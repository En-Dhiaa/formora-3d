# FORMORA 3D — استوديو تصميم ومحاكاة التغليف ثلاثي الأبعاد بالذكاء الاصطناعي
### Professional AI Product Packaging Design & 3D Mockup Studio for Windows & Web

![FORMORA 3D Pro Packaging](https://img.shields.io/badge/FORMORA%203D-PRO%20STUDIO-6366f1?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-r165-047857?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-0284c7?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Proprietary-amber?style=for-the-badge)

---

## 🌟 نظرة عامة (Overview)
**FORMORA 3D** هو نظام هندسي وتصميمي متكامل مخصص لمحاكاة وتجسيد عبوات وتغليف المنتجات (Packaging Design) في بيئة ثلاثية الأبعاد تفاعلية فائقة الواقعية. تم تصميمه ليكون بديلاً مبسطاً واحترافياً لأعقد أجزاء برامج النمذجة (مثل بلندر Blender) وموجهاً خصيصاً لمصممي الجرافيك، واستوديوهات الدواء ومستحضرات التجميل، والشركات الصناعية.

يتيح التطبيق بناء المجسم بمجرد إدخال الأبعاد الهندسية الحقيقية بالملليمتر أو البوصة، ثم يقوم النظام تلقائياً بحساب مساحات وأبعاد الأوجه، وإسقاط التصاميم الفنية والملصقات عليها بدقة UV متطابقة دون تشوه، والتحكم في إضاءة الاستوديو والخامات الفيزيائية (PBR)، وتصدير صور تجارية عالية الدقة تصل إلى 4K بخلفيات شفافة مع إمكانية تصدير نماذج ثلاثية الأبعاد بصيغة GLB.

---

## ✨ المميزات الرئيسية (Key Features)

### 1. محرك القوالب الهندسية البارامترية (Parametric Geometry Engine)
* **علب الكرتون والعبوات المستطيلة (Carton Box)**: تحديد العرض، الارتفاع، العمق، مع استدارة الحواف (Corner Radius)، وغطاء منفصل.
* **العبوات والزجاجات الأسطوانية (Cylindrical Bottles & Jars)**: ارتفاع كلي، قطر الجسم، زوايا وانسيابية الكتف (Rounded / Sloped / Flat)، عنق الزجاجة، وغطاء ملولب.
* **الأنابيب المرنة (Squeeze Tubes)**: الطول الكلي، قطر الجسم، شريط اللحام العلوي (Crimp Seal)، والفوهة وغطاء الفتح القلاب.
* **الأكياس المرنة القائمة (Stand-up Pouches / Doypack)**: العرض والارتفاع، عمق القاعدة الممتدة (Gusset)، شريط اللحام، والسحاب (ZipLock).
* **العبوات البيضاوية (Oval Bottles)**: مقاطع عرضية بيضاوية انسيابية مريحة ومناسبة للشامبو ومستحضرات العناية.

### 2. الحساب التلقائي للأبعاد وإسقاط التصاميم (Intelligent UV Mapping)
* **حساب فوري للأبعاد المشتقة**: بمجرد تعديل أبعاد العبوة، تُحسب أبعاد جميع الأوجه تلقائياً بالوحدة المختارة (`mm` أو `cm` أو `in`).
* **مدير التصاميم الذكي (Artwork Manager)**: رفع ملفات الصور (`PNG`, `JPG`, `WebP`, `SVG`) وتعيينها لكل وجه (Front, Back, Left, Right, Top, Bottom, Body Wrap, Cap).
* **التحكم الهندسي في الإسقاط**: ملاءمة (Fit / Fill / Stretch)، إزاحة (Offset X/Y)، تكبير (Scale)، تدوير بزوايا، وانعكاس أفقي/رأسي.
* **مخطط القالب المنبسط (2D Dieline View)**: فحص خطوط القص (Cut Lines) وخطوط الطي (Fold Creases) لجميع الأوجه ومطابقة التصاميم عليها.

### 3. خامات فيزيائية واقعية (Physically-Based Materials)
* مكتبة خامات معتمدة:
  * كرتون غير لامع (Matte Cardboard) وكرتون لامع (Glossy).
  * زجاج شفاف كريستالي وزجاج دوائي كهرماني (Amber Glass).
  * بلاستيك معتم وبلاستيك لامع فاخر.
  * ألومنيوم مصقول ورقائق معدنية ذهبية (Gold Foil).
  * أكياس مرنة بطبقات عازلة ميتاليك (Foil Pouch).
* تحكم كامل في خصائص الخامة: الخشونة (Roughness)، المعدنية (Metalness)، النفاذية للضوء (Transmission)، طبقة الورنيش (Clearcoat)، والشفافية.

### 4. استوديو الإضاءة والكاميرا (Studio Lighting & Cameras)
* أنماط استوديو جاهزة بنقرة واحدة:
  * استوديو تجاري ناعم (Soft Commercial Studio).
  * إضاءة طبية ودوائية ناصعة (Medical Bright Lab).
  * إضاءة تجميل دراماتيكية (Cosmetic Luxury Studio).
  * تصوير متجر إلكتروني ناصع (Clean E-Commerce).
* تحكم دقيق في الضوء الرئيسي (Key Light)، ضوء التعبئة (Fill Light)، ضوء الحواف (Rim Light)، ونعومة وعتمة الظلال الأرضية.
* كاميرات محايدة: Perspective و Orthographic، مع زوايا تصوير جاهزة (Hero View, Front, Top-Down Flatlay, Low Angle).

### 5. مركز التصدير الفائق (Export & Render Center)
* تصدير صور رندرة بدقة 1080p, 2K Square, 4K Ultra HD، وأبعاد مخصصة.
* دعم الخلفيات الشفافة (Alpha Transparency) لعزل المنتج مباشرة دون الحاجة لقص الخلفية.
* تصدير النموذج ثلاثي الأبعاد بصيغة `GLB` لفتحه في Blender أو محركات الألعاب أو استخدامه في الويب.
* تصدير مخطط الـ Dieline ثنائي الأبعاد بصيغة عريضة للطباعة المباشرة.

### 6. مستشار التغليف الذكي (AI Studio Advisor)
* يقدم توصيات صناعية لأبعاد العبوات حسب الحجم (50ml, 100ml, 250ml, 500ml).
* يقترح توليفات خامات متوافقة مع اشتراطات الهيئات الصحية (FDA/MOH) والجمالية التسويقية.
* قائمة تحقق إلزامية لمناطق الباركود وتاريخ الصلاحية ورقم التشغيلة.

---

## 🛠️ البنية التقنية (Architecture & Tech Stack)
* **إطار العمل**: [Next.js 14](https://nextjs.org/) (App Router) مع React 18 و TypeScript.
* **محرك الرسوميات ثلاثي الأبعاد**: [Three.js](https://threejs.org/) مع [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) و [@react-three/drei](https://github.com/pmndrs/drei).
* **إدارة الحالة**: [Zustand](https://github.com/pmndrs/zustand) مع دعم الحفظ التلقائي وسجل التراجع والإعادة (Undo/Redo).
* **التصميم والواجهة**: Vanilla Tailwind CSS مع دعم أصيل لواجهات اليمين لليسار (RTL) باللغة العربية والإنجليزية.
* **الأيقونات والخطوط**: Lucide React + خط Cairo العربي و Inter اللاتيني.

---

## 🚀 تشغيل المشروع محلياً (Running Locally)

### المتطلبات المسبقة:
* بيئة Node.js (v18 أو أحدث).
* مدير الحزم npm.

### خطوات التشغيل:
```bash
# 1. الدخول إلى مجلد المشروع
cd formora-3d

# 2. تشغيل خادم التطوير
npm run dev

# 3. فتح المتصفح على:
http://localhost:3000
```

### تشغيل الاختبارات الآلية:
```bash
node tests/run_tests.js
```

---

## 📦 إدارة ونشر المشاريع (Permanent GitHub Workflow)
تم تزويد بيئة العمل بنظام **GitHub Project Publisher** الدائم لمزامنة وإدارة المستودعات تلقائياً تحت حساب `En-Dhiaa`:

```powershell
# استعراض حالة المستودع الحالي
project-publisher status

# رفع التعديلات والتحسينات مع رسالة
project-publisher publish -Message "Complete full packaging studio features"

# التحقق من سلامة الرابط البعيد على GitHub
project-publisher verify

# إنشاء مجلد ومستودع لمشروع جديد
project-publisher new <project-name> -Description "Project description"
```

---

## 📋 خارطة الطريق (Roadmap)
- [x] محرك النمذجة البارامترية (علب، زجاجات، أنابيب، أكياس).
- [x] إسقاط التصاميم الذكي وتحويل الإحداثيات UV.
- [x] مكتبة الخامات الفيزيائية PBR واستوديو الإضاءة الاحترافي.
- [x] رندرة 4K وتصدير صور بخلفيات شفافة وتصدير GLB ثلاثي الأبعاد.
- [x] مخطط القوالب المنبسطة 2D Dieline.
- [x] مستشار التغليف الذكي بالذكاء الاصطناعي وقوائم التحقق الطبية.
- [ ] دعم استيراد ملفات الفيكتور والـ PDF مباشرة كطبقات ملصقات.
- [ ] حزمة تطبيق سطح المكتب لنظام Windows عبر Tauri 2.

---

### المطور والمالك (Owner)
**En-Dhiaa**  
GitHub: [https://github.com/En-Dhiaa](https://github.com/En-Dhiaa)
