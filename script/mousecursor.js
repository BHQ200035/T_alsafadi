document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.getElementById('mouse-cursor');
    
    // إظهار الدائرة بمجرد تحميل الصفحة
    cursor.style.opacity = 1;

    // دالة لتتبع حركة الماوس
    document.addEventListener('mousemove', (e) => {
        
        // e.clientX و e.clientY هي إحداثيات الماوس على الشاشة
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // تطبيق الموقع الجديد للدائرة باستخدام CSS property 'transform'
        // نستخدم translate3d لضمان أداء سلس وأفضل
        // -50% لـ X و Y يتم إضافتها هنا لتوسيط الدائرة حول المؤشر
        cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
    });
});