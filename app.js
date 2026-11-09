// يفعّل تنسيقات الحركة التي تعتمد على JavaScript في style.css.
document.documentElement.classList.add("js");

// يضيف تدرجًا لحركة عجلة الماوس على الصفحة، مع إبقاء تمرير الشريط الجانبي طبيعيًا.
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var targetY = window.scrollY;
  var animationFrame = 0;
  var previousTime = 0;

  function stopWheelScroll() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    targetY = window.scrollY;
  }

  function animateWheelScroll(time) {
    var distance = targetY - window.scrollY;
    var elapsed = previousTime ? time - previousTime : 16;
    previousTime = time;

    if (Math.abs(distance) < 0.5) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      animationFrame = 0;
      previousTime = 0;
      return;
    }

    var progress = 1 - Math.exp(-elapsed / 90);
    window.scrollTo({
      top: window.scrollY + distance * progress,
      behavior: "instant",
    });
    animationFrame = requestAnimationFrame(animateWheelScroll);
  }

  window.addEventListener(
    "wheel",
    function (event) {
      if (event.ctrlKey || event.shiftKey || event.deltaY === 0) return;

      var target = event.target;
      if (target.nodeType !== 1) target = target.parentElement;
      var sidebar = target && target.closest ? target.closest("aside") : null;
      if (sidebar && sidebar.scrollHeight > sidebar.clientHeight) return;

      var multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      var maxY = document.documentElement.scrollHeight - window.innerHeight;
      var nextY = Math.max(0, Math.min(maxY, targetY + event.deltaY * multiplier));
      if (nextY === targetY) return;

      event.preventDefault();
      targetY = nextY;
      if (!animationFrame) animationFrame = requestAnimationFrame(animateWheelScroll);
    },
    { passive: false },
  );

  window.addEventListener("pointerdown", stopWheelScroll);
  window.addEventListener("keydown", stopWheelScroll);
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (target.nodeType !== 1) target = target.parentElement;
    if (target && target.closest && target.closest('a[href^="#"]')) stopWheelScroll();
  });
})();

// يقرأ تفضيلات المظهر واللغة المحفوظة، ويستخدم تفضيل النظام للمظهر عند أول زيارة.
try {
        var d = document.documentElement,
          t = localStorage.getItem("theme"),
          l = localStorage.getItem("lang");
        if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        d.setAttribute("data-theme", t);
        if (l === "ar") { d.lang = "ar"; d.dir = "rtl"; }
      } catch (e) {}

// يظهر عناصر الصفحة تدريجيًا عند دخولها إلى إطار العرض.
(function () {
        var els = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
          els.forEach(function (e) {
            e.classList.add("in");
          });
          return;
        }
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add("in");
                io.unobserve(en.target);
              }
            });
          },
          { threshold: 0.12 },
        );
        els.forEach(function (e) {
          io.observe(e);
        });
      })();

// قاموس النصوص العربية، بالإضافة إلى محتوى النبذة العربية بصيغة HTML.
(function () {
        var AR = {"Open to work":"متاح للعمل","Ebraam Emad": "إبرام عماد", "Front-End Developer": "مطوّر واجهات أمامية", "Cairo, Egypt": "القاهرة، مصر", "10 Public Repositories": "10 مستودعات عامة", "Download CV": "تحميل السيرة الذاتية", "Portfolio 2026": "معرض أعمال 2026", "FRONT-END": "مطوّر واجهات", "DEVELOPER": "أمامية", "& WordPress Specialist": "وخبير ووردبريس", "MIS student crafting high-performance, responsive web interfaces and dynamic WordPress sites with React.js, modern JavaScript and Elementor.": "طالب نظم معلومات إدارية، أبني واجهات ويب سريعة ومتجاوبة ومواقع ووردبريس ديناميكية باستخدام React.js وجافاسكريبت الحديثة وElementor.", "View My Work": "شاهد أعمالي", "01 — Selected Work": "01 — أعمال مختارة", "Projects": "المشاريع", "A selection of websites and interfaces I've built. Each card opens the live project.": "مجموعة من المواقع والواجهات التي بنيتها. كل بطاقة تفتح المشروع مباشرة.", "Landing page for a coffee house with a popular menu section and client reviews.": "صفحة هبوط لمقهى مع قسم للقائمة الأكثر طلبًا وآراء العملاء.", "Multi-section website with articles, a gallery and a features showcase.": "موقع متعدد الأقسام يضم مقالات ومعرض صور وعرضًا للمميزات.", "Sleek agency-style landing page with interactive navigation and a responsive layout.": "صفحة هبوط أنيقة بأسلوب الوكالات مع تنقّل تفاعلي وتصميم متجاوب.", "Coffee shop landing page highlighting easy ordering, specialty roasts and delivery.": "صفحة هبوط لمحل قهوة تُبرز سهولة الطلب والتحميصات المميزة والتوصيل.", "A personal digital business card with a clean, modern look.": "بطاقة أعمال رقمية شخصية بمظهر نظيف وعصري.", "Educational web portal for a servant-training school, with multiple pages and an Arabic RTL interface.": "بوابة تعليمية لمدرسة إعداد الخدام، متعددة الصفحات وبواجهة عربية RTL.", "Responsive": "متجاوب", "View all repositories on GitHub": "شاهد كل المستودعات على GitHub", "02 — About": "02 — نبذة عني", "Professional Summary": "الملخص المهني", "03 — Skills": "03 — المهارات", "Tools & Technologies": "الأدوات والتقنيات", "Front-End Development": "تطوير الواجهات الأمامية", "CMS & Web Design": "أنظمة إدارة المحتوى وتصميم الويب", "AI & Developer Tools": "الذكاء الاصطناعي وأدوات التطوير", "MIS & Systems": "نظم المعلومات والأنظمة", "Responsive Design": "التصميم المتجاوب", "Theme Customization": "تخصيص القوالب", "Site Speed Optimization": "تحسين سرعة المواقع", "AI-Assisted Coding": "البرمجة بمساعدة الذكاء الاصطناعي", "Prompt Engineering": "هندسة الأوامر", "Systems Analysis": "تحليل النظم", "UI/UX Workflow Design": "تصميم مسارات UI/UX", "Enterprise Info Systems": "نظم معلومات المؤسسات", "Bachelor of Management Information Systems (MIS)": "بكالوريوس نظم المعلومات الإدارية (MIS)", "University Student · Egypt — Object-Oriented Programming (C++), Enterprise Information Systems, Operations Research, Project Management, E-Business Infrastructure.": "طالب جامعي · مصر — البرمجة كائنية التوجه (C++)، نظم معلومات المؤسسات، بحوث العمليات، إدارة المشاريع، البنية التحتية للتجارة الإلكترونية.", "04 — Contact": "04 — تواصل", "Let's build something great": "لنبنِ شيئًا رائعًا", "Have a project in mind or want to work together? Get in touch, I'd love to hear about it.": "هل لديك مشروع في بالك أو تريد التعاون؟ تواصل معي وسيسعدني أن أسمع عنه.", "Email Me": "راسلني", "WhatsApp": "واتساب", "© 2026 Ebraam Emad. All rights reserved.": "© 2026 إبرام عماد. جميع الحقوق محفوظة.", "Front-End Developer & WordPress Specialist": "مطوّر واجهات أمامية وخبير ووردبريس"};
        var ABOUT_AR = "مطوّر <strong>واجهات أمامية</strong> وطالب <strong>نظم المعلومات الإدارية (MIS)</strong> متخصص في بناء واجهات ويب سريعة ومتجاوبة ومواقع ووردبريس ديناميكية. متمكّن من React.js وجافاسكريبت الحديثة ومكتبات المكوّنات وتصميم مواقع Elementor المخصصة، وأستخدم <strong>أدوات الذكاء الاصطناعي وهندسة الأوامر</strong> لتسريع عملي وكتابة كود نظيف وقابل للصيانة.";
        var root = document.documentElement;
        // يحفظ إعدادات المستخدم محليًا لتبقى بعد تحديث الصفحة.
        var save = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        var EN_TITLE = document.title;
        var nodes = [];
        // يجمع النصوص المطابقة للقاموس فقط، مع استثناء الأزرار والنبذة ذات HTML.
        var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (n) {
            var p = n.parentNode;
            if (!p || /^(SCRIPT|STYLE)$/.test(p.nodeName) || p.closest(".controls, [data-i18n-html]"))
              return NodeFilter.FILTER_REJECT;
            var k = n.nodeValue.replace(/\s+/g, " ").trim();
            return Object.prototype.hasOwnProperty.call(AR, k) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          },
        });
        var n;
        while ((n = w.nextNode())) nodes.push({ n: n, en: n.nodeValue, k: n.nodeValue.replace(/\s+/g, " ").trim() });
        var about = document.querySelector("[data-i18n-html]");
        var ABOUT_EN = about ? about.innerHTML : "";

        // يبدّل النصوص واتجاه الصفحة وعنوانها، ثم يحفظ اللغة المختارة.
        function setLang(l) {
          root.lang = l;
          root.dir = l === "ar" ? "rtl" : "ltr";
          nodes.forEach(function (o) {
            if (l === "ar") {
              var lead = o.en.match(/^\s*/)[0], trail = o.en.match(/\s*$/)[0];
              o.n.nodeValue = lead + AR[o.k] + trail;
            } else o.n.nodeValue = o.en;
          });
          if (about) about.innerHTML = l === "ar" ? ABOUT_AR : ABOUT_EN;
          document.title = l === "ar" ? "إبرام عماد | مطوّر واجهات أمامية وخبير ووردبريس" : EN_TITLE;
          var lb = document.getElementById("langBtn");
          lb.textContent = l === "ar" ? "English" : "عربي";
          lb.setAttribute("aria-label", l === "ar" ? "Switch to English" : "التبديل إلى العربية");
          setTheme(root.getAttribute("data-theme") || "dark", true);
          save("lang", l);
        }

        // يبدّل سمة الألوان ويحدّث الأيقونة والنص ولون شريط المتصفح.
        function setTheme(t, silent) {
          root.setAttribute("data-theme", t);
          var ar = root.lang === "ar";
          document.getElementById("themeIcon").className = "fas " + (t === "dark" ? "fa-sun" : "fa-moon");
          document.getElementById("themeLabel").textContent = t === "dark" ? (ar ? "فاتح" : "Light") : (ar ? "داكن" : "Dark");
          document.getElementById("themeBtn").setAttribute("aria-label", t === "dark" ? (ar ? "الوضع الفاتح" : "Switch to light mode") : (ar ? "الوضع الداكن" : "Switch to dark mode"));
          if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#0b1220" : "#f2f6ff");
          if (!silent) save("theme", t);
        }

        document.getElementById("themeBtn").addEventListener("click", function () {
          setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
        document.getElementById("langBtn").addEventListener("click", function () {
          setLang(root.lang === "ar" ? "en" : "ar");
        });
        // يطبّق اللغة المحفوظة أو الإنجليزية عند فتح الصفحة.
        setLang(root.lang === "ar" ? "ar" : "en");
      })();

// يحدّث شريط تقدم التمرير ويضبط إضاءة البطاقات حسب موضع المؤشر.
(function () {
        var bar = document.getElementById("progress");
        function update() {
          var max = document.documentElement.scrollHeight - innerHeight;
          bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
        }
        addEventListener("scroll", update, { passive: true });
        update();
        document.querySelectorAll("a.project-card, .skill-card").forEach(function (c) {
          c.addEventListener("pointermove", function (e) {
            var r = c.getBoundingClientRect();
            c.style.setProperty("--mx", e.clientX - r.left + "px");
            c.style.setProperty("--my", e.clientY - r.top + "px");
          });
        });
      })();
