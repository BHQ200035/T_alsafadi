// pxlmodal.js

// ---------------------------------
// 1. تعريف العناصر الرئيسية
// ---------------------------------

// الحصول على النافذة المنبثقة الرئيسية (الجدولة)
const mainModal = document.getElementById("customConsultationModal");

// الحصول على زر فتح النافذة (يفترض وجوده في مكان ما في HTML)
const openBtn = document.getElementById("openConsultationModal");

// الحصول على عنصر <span> الذي يغلق النافذة الرئيسية (علامة X)
const closeSpan = document.getElementsByClassName("pxl-close-button")[0];

// الحصول على عناصر النوافذ المنبثقة الإضافية
const timezoneModal = document.getElementById('timezone-overlay');
const cookieModal = document.getElementById('cookieSettingsOverlay');
const cookieLink = document.getElementById('cookieSettingsLink'); // رابط "Cookie settings"


// ---------------------------------
// 2. وظائف التحكم بالنافذة الرئيسية (الجدولة)
// ---------------------------------

// دالة مخصصة لإغلاق النافذة الرئيسية (نربطها بزر X)
function closeMainModal() {
    if (mainModal) {
        mainModal.classList.remove("active"); // إزالة الكلاس 'active' لإخفاء النافذة
    }
}

// عند النقر على الزر، يتم فتح النافذة
if (openBtn) {
    openBtn.onclick = function() {
        mainModal.classList.add("active"); // إضافة الكلاس 'active' لإظهار النافذة
    }
}

// عند النقر على <span> (X)، يتم إغلاق النافذة
if (closeSpan) {
    closeSpan.onclick = closeMainModal;
}

// عند النقر في أي مكان خارج النافذة، يتم إغلاقها
window.onclick = function(event) {
    // إغلاق النافذة الرئيسية عند النقر خارجها
    if (event.target == mainModal) {
        closeMainModal();
    }
    // إغلاق نافذة المناطق الزمنية عند النقر خارجها
    if (event.target == timezoneModal) {
        closeTimezoneDropdown();
    }
    // إغلاق نافذة الكوكيز عند النقر خارجها
    if (event.target == cookieModal) {
        closeCookieModal();
    }
}

// ---------------------------------
// 3. وظائف التحكم بنافذة المناطق الزمنية (Timezone)
// ---------------------------------

function openTimezoneDropdown() {
    if (timezoneModal) {
        timezoneModal.style.display = 'flex';
        // يفترض أن لديك منطق لإظهار قائمة المناطق الزمنية هنا (مثل ملء القائمة وتشغيل البحث)
    }
}

function closeTimezoneDropdown() {
    if (timezoneModal) {
        timezoneModal.style.display = 'none';
    }
}

// ---------------------------------
// 4. وظائف التحكم بنافذة إعدادات الكوكيز (Cookie Settings)
// ---------------------------------

function openCookieModal(event) {
    event.preventDefault(); // منع الرابط من الانتقال
    
    // 1. إخفاء نافذة الجدولة الرئيسية
    if (mainModal) {
        mainModal.classList.remove('active');
        // تأخير بسيط لإخفائها بالكامل قبل إظهار الأخرى
        setTimeout(() => {
             mainModal.style.display = 'none';
        }, 300);
    }
    
    // 2. إظهار نافذة الكوكيز
    if (cookieModal) {
        cookieModal.style.display = 'flex';
        setTimeout(() => {
            cookieModal.classList.add('active'); // تبديل حالة opacity
        }, 10);
    }
}

function closeCookieModal() {
    if (cookieModal) {
        cookieModal.classList.remove('active');
        setTimeout(() => {
            cookieModal.style.display = 'none';
            
            // 3. إعادة إظهار نافذة الجدولة الرئيسية
            if (mainModal) {
                mainModal.style.display = 'flex';
                mainModal.classList.add('active');
            }
        }, 300);
    }
}

// ربط الدالة برابط "Cookie settings"
if (cookieLink) {
    cookieLink.addEventListener('click', openCookieModal);
}


// ---------------------------------
// 5. وظائف التنقل بين الواجهات (التاريخ، الوقت، التفاصيل)
// ---------------------------------
// ملاحظة: هذه الدوال ضرورية لتشغيل أزرار "رجوع" في الـ HTML
function showDateView() {
    document.getElementById('date-selector-view').style.display = 'block';
    document.getElementById('time-selector-view').style.display = 'none';
    document.getElementById('details-form-view').style.display = 'none';
}

// يفترض أن هذه الدوال سيتم تعريفها لاحقًا لتشغيل الانتقال
// function showTimeView() { ... } 
// function showDetailsView() { ... } 
// function prevMonth() { ... } 
// function nextMonth() { ... } 
// function filterTimezones() { ... } 

// عند تحميل الصفحة، تأكد من إظهار واجهة التاريخ فقط
document.addEventListener('DOMContentLoaded', () => {
    showDateView();
});