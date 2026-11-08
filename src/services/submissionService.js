import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const CONCERN_FIELDS = [
  'fullName', 'email', 'phone', 'university', 'faculty',
  'level', 'category', 'subject', 'message',
];

async function viaFormspree(cfg, values, file) {
  if (!cfg.endpoint) throw new Error('Formspree endpoint missing');
  const fd = new FormData();
  CONCERN_FIELDS.forEach((key) => fd.append(key, values[key] ?? ''));
  fd.append('_subject', `[FNEA] ${values.category} – ${values.subject}`);
  if (file) fd.append('attachment', file);
  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    body: fd,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Formspree HTTP ${res.status}`);
}

async function viaGoogleForms(cfg, values) {
  if (!cfg.actionUrl) throw new Error('Google Forms actionUrl missing');
  const fd = new FormData();
  Object.entries(cfg.fields || {}).forEach(([key, id]) => {
    if (id) fd.append(id, values[key] ?? '');
  });
  await fetch(cfg.actionUrl, { method: 'POST', mode: 'no-cors', body: fd });
}

async function viaSupabase(cfg, values, file) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase غير مربوط بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى إعدادات البناء.');
  }

  const table = cfg.table || 'concerns';
  const bucket = cfg.bucket || 'concern-files';
  let filePath = null;

  if (file) {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    filePath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(`فشل رفع الملف: ${uploadError.message}`);
  }

  const row = {
    full_name: values.fullName,
    email: values.email,
    phone: values.phone || null,
    university: values.university,
    faculty: values.faculty,
    level: values.level,
    category: values.category,
    subject: values.subject,
    message: values.message,
    file_path: filePath,
    file_name: file?.name || null,
    status: 'new',
  };

  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select('reference_code')
    .single();

  if (error) {
    // Avoid leaving an orphaned attachment if saving the concern fails.
    if (filePath) {
      await supabase.storage.from(bucket).remove([filePath]).catch(() => {});
    }
    throw new Error(`فشل حفظ الانشغال: ${error.message}`);
  }

  return { reference_code: data.reference_code };
}

function viaEmail(cfg, values) {
  if (!cfg.to) throw new Error('Email recipient missing');
  const body = CONCERN_FIELDS.map((key) => `${key}: ${values[key] ?? ''}`).join('\n');
  window.location.href = `mailto:${cfg.to}?subject=${encodeURIComponent(`[FNEA] ${values.subject}`)}&body=${encodeURIComponent(body)}`;
}

export async function submitConcern(formsConfig = {}, values, file) {
  switch (formsConfig.provider || 'none') {
    case 'formspree':
      await viaFormspree(formsConfig.formspree || {}, values, file);
      return { mode: 'sent' };
    case 'googleForms':
      if (file) throw new Error('Google Forms لا يدعم رفع هذا المرفق عبر هذا النموذج.');
      await viaGoogleForms(formsConfig.googleForms || {}, values);
      return { mode: 'sent' };
    case 'supabase':
      return { mode: 'sent', ...(await viaSupabase(formsConfig.supabase || {}, values, file)) };
    case 'email':
      if (file) throw new Error('إرسال المرفقات غير مدعوم عبر تطبيق البريد.');
      viaEmail(formsConfig.email || {}, values);
      return { mode: 'email' };
    default:
      console.warn('[FNEA] Concern form is in preview mode.');
      return { mode: 'preview' };
  }
}
