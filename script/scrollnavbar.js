  

document.addEventListener('DOMContentLoaded', function() {
    const scrollRevealNavbar = document.getElementById('scrollRevealNavbar'); // تم التغيير هنا
    // حد التمرير الذي سيبدأ بعده ظهور النافبار (يمكنك تغييره)
    const scrollThreshold = 200; 
    
    window.addEventListener('scroll', function() {
        // إذا كان موضع التمرير الرأسي أكبر من الحد
        if (window.scrollY > scrollThreshold) {
            // أضف الكلاس لإظهار النافبار
            scrollRevealNavbar.classList.add('navbar-reveal-visible'); // تم التغيير هنا
        } 
        // وإلا، أخفِ النافبار
        else {
            // أزل الكلاس لإخفاء النافبار
            scrollRevealNavbar.classList.remove('navbar-reveal-visible'); // تم التغيير هنا
        }
    });
});
