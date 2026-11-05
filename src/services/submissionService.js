/**
 * إرسال نموذج الانشغالات
 * ------------------------------------------------------------
 * اختر مزوّد الاستقبال من public/data/site-config.json → forms.provider:
 *
 *  "none"        → وضع المعاينة: لا يُرسل أي شيء (لا يوجد Backend وهمي). تظهر ملاحظة للمسؤول.
 *  "formspree"   → أنشئ نموذجًا على formspree.io وضع الرابط في forms.formspree.endpoint
 *                  (يدعم الملفات المرفقة في الخطط المدفوعة).
 *  "googleForms" → ضع رابط formResponse ومعرّفات الحقول entry.XXXX في forms.googleForms
 *                  (لا يدعم رفع الملفات من خارج Google).
 *  "supabase"    → أنشئ جدول concerns (+ bucket للملفات) وضع url و anonKey.
 *  "email"       → يفتح تطبيق البريد لدى الطالب برسالة جاهزة إلى forms.email.to
 *
 *  Firebase: أضف مزوّدًا جديدًا في الدالة submitConcern بنفس الشكل (addDoc إلى Firestore).
 */

export const CONCERN_FIELDS = ['fullName', 'email', 'phone', 'university', 'faculty', 'level', 'category', 'subject', 'message'];

async function viaFormspree(cfg, values, file) {
  if (!cfg.endpoint) throw new Error('Formspree endpoint missing');
  const fd = new FormData();
  CONCERN_FIELDS.forEach((k) => fd.append(k, values[k] ?? ''));
  fd.append('_subject', `[FNEA] ${values.category} – ${values.subject}`);
  if (file) fd.append('attachment', file);
  const res = await fetch(cfg.endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
  if (!res.ok) {
    let detail = '';
    try {
      const payload = await res.json();
      detail = payload?.errors?.map((x) => x.message).filter(Boolean).join('؛ ') || payload?.error || '';
    } catch { /* response is not JSON */ }
    const error = new Error(detail || `Formspree HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
}

async function viaGoogleForms(cfg, values) {
  if (!cfg.actionUrl) throw new Error('Google Forms actionUrl missing');
  const fd = new FormData();
  Object.entries(cfg.fields || {}).forEach(([k, entryId]) => { if (entryId) fd.append(entryId, values[k] ?? ''); });
  // Google Forms لا يرسل ردًّا قابلًا للقراءة (no-cors) — الطلب يُسجَّل رغم ذلك.
  await fetch(cfg.actionUrl, { method: 'POST', mode: 'no-cors', body: fd });
}

async function viaSupabase(cfg, values, file) {
  if (!cfg.url || !cfg.anonKey) throw new Error('Supabase config missing');
  const headers = { apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}` };
  let file_path = null;
  if (file && cfg.bucket) {
    file_path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const up = await fetch(`${cfg.url}/storage/v1/object/${cfg.bucket}/${file_path}`, { method: 'POST', headers: { ...headers, 'Content-Type': file.type }, body: file });
    if (!up.ok) throw new Error(`Supabase upload error ${up.status}`);
  }
  const row = { ...Object.fromEntries(CONCERN_FIELDS.map((k) => [k, values[k] ?? ''])), file_path, status: 'new' };
  const res = await fetch(`${cfg.url}/rest/v1/${cfg.table || 'concerns'}`, {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}`);
}

function viaEmail(cfg, values) {
  if (!cfg.to) throw new Error('Email recipient missing');
  const body = CONCERN_FIELDS.map((k) => `${k}: ${values[k] ?? ''}`).join('\n');
  window.location.href = `mailto:${cfg.to}?subject=${encodeURIComponent(`[FNEA] ${values.subject}`)}&body=${encodeURIComponent(body)}`;
}

/**
 * @returns {Promise<{mode: 'sent' | 'preview' | 'email'}>}
 */
export async function submitConcern(formsConfig = {}, values, file) {
  const provider = formsConfig.provider || 'none';
  switch (provider) {
    case 'formspree': await viaFormspree(formsConfig.formspree || {}, values, file); return { mode: 'sent' };
    case 'googleForms': await viaGoogleForms(formsConfig.googleForms || {}, values); return { mode: 'sent' };
    case 'supabase': await viaSupabase(formsConfig.supabase || {}, values, file); return { mode: 'sent' };
    case 'email': viaEmail(formsConfig.email || {}, values); return { mode: 'email' };
    case 'none':
    default:
      // ⚠️ غير مربوط بأي Backend: لا يتم حفظ أو إرسال أي بيانات.
      console.warn('[FNEA] نموذج الانشغالات غير مربوط. عيّن forms.provider في site-config.json');
      return { mode: 'preview' };
  }
}
