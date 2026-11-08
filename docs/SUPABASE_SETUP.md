# إعداد Supabase لنموذج انشغالات FNEA

## 1) إنشاء المشروع
أنشئ مشروعاً في Supabase، ثم افتح **SQL Editor** والصق محتوى:
`supabase/migrations/20261108000000_concerns_storage.sql`
وشغّله مرة واحدة.

هذا ينشئ جدول `public.concerns` وحاوية خاصة `concern-files`. الزوار يستطيعون الإرسال والرفع فقط؛ لا توجد سياسة عامة لقراءة الانشغالات أو تنزيل الملفات.

## 2) إعداد مفاتيح البناء
في مستودع GitHub افتح **Settings → Secrets and variables → Actions → New repository secret** وأنشئ:
- `VITE_SUPABASE_URL`: Project URL من Supabase.
- `VITE_SUPABASE_ANON_KEY`: Publishable/anon key من Supabase.

لا تضع Service Role Key في الموقع أو في GitHub Pages frontend.

## 3) تفعيل مزود Supabase
بعد إضافة الأسرار، يجب أن يمرّر workflow القيمتين إلى خطوة `npm run build` كمتغيري بيئة، ثم يُضبط `data/site-config.json` على `"provider": "supabase"`.

## ملاحظات أمان
- الحاوية خاصة وليست Public.
- لا توجد صلاحية عامة لقراءة جدول الانشغالات أو الملفات.
- عرض الانشغالات وتنزيل مرفقاتها من لوحة الإدارة يحتاج سياسة قراءة/تنزيل خاصة بأدوار الإدارة بعد ربط نظام صلاحيات المديرين.
