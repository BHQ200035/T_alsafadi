document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديد العناصر الأساسية (البطاقة وحاوية المنطقة الزمنية)
    const bookingCard = document.querySelector('.booking-card');
    const timezoneSelection = document.querySelector('.timezone-selection');

    // التحقق من وجود العناصر لتجنب الأخطاء
    if (!bookingCard || !timezoneSelection) {
        console.error('Booking card or timezone section not found. Check your HTML class names.');
        return; 
    }

    // 2. تحديد حد التمرير (بالبكسل) الذي يجب تجاوزه قبل ظهور المنطقة الزمنية
    // يمكنك تعديل هذا الرقم ليناسب المحتوى لديك
    const scrollThreshold = 100; 

    // 3. دالة التحقق من موضع التمرير
    const checkScrollPosition = () => {
        // bookingCard.scrollTop: المسافة التي تم تمريرها من أعلى البطاقة
        
        if (bookingCard.scrollTop > scrollThreshold) {
            // إذا تجاوز التمرير الحد، أظهر المنطقة الزمنية
            timezoneSelection.classList.add('show-timezone');
        } else {
            // إذا عاد التمرير إلى الأعلى (اختياري: لإخفائها مرة أخرى)
            timezoneSelection.classList.remove('show-timezone');
        }
    };

    // 4. الاستماع لحدث 'scroll' داخل بطاقة الحجز (.booking-card)
    bookingCard.addEventListener('scroll', checkScrollPosition);

    // 5. التحقق المبدئي في حال تم تحميل الصفحة وكان المحتوى بالفعل متجاوزاً للحد
    checkScrollPosition(); 
});