/* ===========================================
    CountUp.js: تفعيل عداد الأرقام عند الرؤية (Intersection Observer)
    =========================================== */

// قائمة بجميع العدادات التي يجب تشغيلها
const counters = document.querySelectorAll('.counter-number');
const executedCounters = new Set(); // لمنع تكرار التشغيل

const observerOptions = {
    root: null, 
    rootMargin: '0px',
    threshold: 0.5 // تشغيل العداد عند رؤية 50% من العنصر
};

const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetElement = entry.target;
            const targetID = targetElement.id;
            
            if (!executedCounters.has(targetID)) {
                
                const finalNum = parseInt(targetElement.getAttribute('data-num'));
                const options = {
                    duration: 2, // مدة العد بالثواني
                    // إضافة علامة + فقط لأول عداد (سنوات الخبرة)
                    suffix: targetID === 'counter1' ? '+' : '' 
                };

                const countUp = new countUp.CountUp(targetID, finalNum, options);
                
                if (!countUp.error) {
                    countUp.start();
                    executedCounters.add(targetID);
                    // إذا أردت إيقاف المراقبة بعد التشغيل: observer.unobserve(targetElement);
                } else {
                    console.error("CountUp Error:", countUp.error);
                }
            }
        }
    });
}, observerOptions);

// ابدأ بمراقبة جميع العدادات
counters.forEach(counter => {
    countObserver.observe(counter);
});