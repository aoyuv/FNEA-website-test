# تشغيل لوحة تحكم FNEA وربط قاعدة البيانات

## 1) إنشاء Supabase
- أنشئ مشروعًا جديدًا من https://supabase.com/dashboard
- افتح SQL Editor، والصق كامل ملف `supabase/migrations/202611070001_fnea_core.sql` ثم Run.
- الملف ينشئ الجداول والسياسات (RLS) وStorage buckets. لا تستخدم Service Role Key في الواجهة مطلقًا.

## 2) ربط الموقع
من Project Settings → API انسخ Project URL وPublishable/anon key.
- محليًا: أنشئ `.env.local` من `.env.example` وأضف:
  `VITE_SUPABASE_URL=...`
  `VITE_SUPABASE_ANON_KEY=...`
- على Netlify: Site configuration → Environment variables أضف نفس المتغيرين ثم أعد Deploy.

## 3) إنشاء حساب الإدارة
- من Supabase → Authentication → Users → Add user (بريد وكلمة مرور قوية).
- Trigger ينشئ Profile تلقائيًا بدور editor.
- من SQL Editor، غيّر الدور للحساب المقصود فقط (استبدل البريد):
```sql
update public.profiles p set role='super_admin'
from auth.users u where p.id=u.id and u.email='YOUR_ADMIN_EMAIL';
```
- افتح الموقع ثم `/#/admin` وسجّل الدخول. الحسابات الجديدة لا تحصل على صلاحية الإدارة تلقائيًا.

## 4) وظائف لوحة التحكم
- الأخبار والنشاطات: إضافة/تعديل/حذف وتفعيل النشر.
- أعضاء المكتب والفروع: إدارة وتفعيل/تعطيل.
- الانشغالات: عرض التفاصيل للمصرح لهم، تغيير الحالة وإضافة ملاحظة داخلية.
- الموقع العام يقرأ الأخبار والنشاطات/الأعضاء/الفروع من Supabase عند نجاح الاتصال، ويستخدم JSON كخيار احتياطي إذا لم تتوفر الجداول.

## ملاحظات أمان مهمة
- لا تضع `service_role` أو أسرار SMTP أو مفاتيح خاصة داخل `VITE_*` أو ملفات Git.
- وصول الانشغالات للقراءة مقصور على أدوار super_admin/admin/concerns_manager. الإرسال العام insert فقط.
- قبل إطلاق عام، أضف CAPTCHA/Rate limiting على إرسال الانشغالات، وحدود حجم ونوع المرفقات، وسياسة حذف/احتفاظ بالبيانات.
- لا تضف أعضاء أو فروعًا أو بيانات رسمية غير مؤكدة؛ أدخل البيانات الحقيقية من الإدارة.
