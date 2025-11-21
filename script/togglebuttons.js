
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollThreshold = 300; // المسافة بالبكسل التي يجب تجاوزها لظهور الزر
    const contactFloatWrap = document.querySelector('.pxl-contact-float-wrap');
    const mainContactBtn = document.querySelector('.main-contact-btn');
    const isMobile = window.matchMedia("only screen and (max-width: 991.98px)").matches;


    // ===================================
    // 1. وظيفة زر العودة للأعلى (Scroll to Top)
    // ===================================

    function toggleBackToTopButton() {
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // الاستماع لحدث التمرير لإظهار/إخفاء الزر
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // تفعيل وظيفة الزر عند النقر (Scroll to top)
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // لتمرير سلس
        });
    });

    // تنفيذ الدالة عند التحميل الأولي للصفحة
    toggleBackToTopButton();


    // ===================================
    // 2. وظيفة تبديل الأزرار الفرعية (للجوال)
    // ===================================

    function toggleSubButtons() {
        contactFloatWrap.classList.toggle('open');
        
        // تغيير أيقونة الزر الرئيسي (من رسالة إلى X وبالعكس)
        const icon = mainContactBtn.querySelector('i');
        if (contactFloatWrap.classList.contains('open')) {
            icon.className = 'fas fa-times'; // تغيير الأيقونة إلى X
            mainContactBtn.style.backgroundColor = '#dc3545'; // تغيير اللون إلى أحمر
        } else {
            icon.className = 'fas fa-comment-dots'; // إعادة أيقونة الرسالة
            mainContactBtn.style.backgroundColor = 'var(--main-color)'; // إعادة اللون الأساسي
        }
    }

    // تفعيل وظيفة النقر على الأجهزة المحمولة فقط
    if (isMobile) {
        mainContactBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleSubButtons();
        });
    }

