// booking-interaction.js

// =================================
// 1. تعريف العناصر الرئيسية والثوابت
// =================================

// العناصر الرئيسية للنافذة المنبثقة (Modal)
const mainModal = document.getElementById("bookingMainContainer");
const openBtn = document.getElementById("openConsultationModal");
const closeSpan = document.getElementsByClassName("close-btn-main")[0];

// عناصر النوافذ الفرعية
const timezoneOverlay = document.getElementById('timezoneOverlay');
const cookieModal = document.getElementById('cookieSettingsModal');
const cookieLink = document.getElementById('privacyCookieLink');

// عناصر واجهات الجدولة (التاريخ، الوقت، التفاصيل)
const dateSelectorView = document.getElementById('datePickerView');
const timeSelectorView = document.getElementById('timeSlotsView');
const detailsFormView = document.getElementById('detailsFormView');
const timeSlotsContainer = document.getElementById('timeSlotsWrapper');

// عناصر التقويم
const currentMonthDisplay = document.getElementById('currentMonthLabel');
const calendarGrid = document.getElementById('calendarGrid');

// عناصر عرض البيانات المختارة
const dateDisplayLabel = document.getElementById('selectedDateLabel');
const timeDisplayLabel = document.getElementById('selectedTimeLabel');

// عناصر المنطقة الزمنية
const timezoneListElement = document.getElementById('timezoneList');
const currentNameDisplay = document.getElementById('currentTzName');
const currentTimeDisplay = document.getElementById('currentTzTime');
const searchInput = document.getElementById('timezoneSearchInput');

// ثوابت ومُتغيرات الحالة
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // الشهر الحالي (0-11)
let selectedDate = null;
let selectedTime = null;
const meetingDuration = 30; // مدة الاجتماع بالدقائق

// **الأوقات المتاحة لهذا اليوم (مثال ثابت)**
const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const weekdayLabels = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']; // رؤوس الأيام باللغة العربية

const TIMEZONES_LIST = [
    { name: "توقيت بيروت", id: "Asia/Beirut" },
    { name: "توقيت سوريا", id: "Asia/Damascus" },
    { name: "توقيت غزة", id: "Asia/Gaza" },
    { name: "توقيت الكويت", id: "Asia/Kuwait" },
    { name: "توقيت دبي", id: "Asia/Dubai" },
    { name: "توقيت لندن", id: "Europe/London" },
    { name: "توقيت نيويورك", id: "America/New_York" },
];
let currentSelectedTimezone = TIMEZONES_LIST.find(tz => tz.id === 'Asia/Gaza');


// =================================
// 2. وظائف التحكم بالنافذة الرئيسية والنوافذ الفرعية (Modal Control)
// =================================

function closeMainModal() {
    if (mainModal) {
        mainModal.classList.remove("active");
    }
}

// فتح النافذة
if (openBtn && mainModal) {
    openBtn.onclick = function() {
        mainModal.classList.add("active");
        showDateView(); // التأكد من العودة لواجهة التاريخ عند الفتح
    }
}

// إغلاق النافذة بزر X
if (closeSpan) {
    closeSpan.onclick = closeMainModal;
}

// إغلاق النوافذ عند النقر خارجها
window.onclick = function(event) {
    if (event.target == mainModal) {
        closeMainModal();
    }
    if (event.target == timezoneOverlay) {
        closeTimezoneDropdown();
    }
    if (event.target == cookieModal) {
        closeCookieModal();
    }
}


// ---------------------------------
// 2.1. وظائف الكوكيز (Cookie Settings)
// ---------------------------------

function openCookieModal(event) {
    event.preventDefault();

    if (mainModal) {
        mainModal.classList.remove('active');
        setTimeout(() => {
            mainModal.style.display = 'none';
        }, 300);
    }

    if (cookieModal) {
        cookieModal.style.display = 'flex';
        setTimeout(() => {
            cookieModal.classList.add('active');
        }, 10);
    }
}

function closeCookieModal() {
    if (cookieModal) {
        cookieModal.classList.remove('active');
        setTimeout(() => {
            cookieModal.style.display = 'none';

            if (mainModal) {
                mainModal.style.display = 'flex';
                mainModal.classList.add('active');
            }
        }, 300);
    }
}

if (cookieLink) {
    cookieLink.addEventListener('click', openCookieModal);
}


// =================================
// 3. وظائف التنقل بين الواجهات (Views)
// =================================

function showTimeView() {
    if (!timeSelectorView || !detailsFormView || !dateSelectorView) return;
    
    dateSelectorView.style.display = 'none';
    detailsFormView.style.display = 'none';
    timeSelectorView.style.display = 'block';

    updateDateDisplay();
    renderTimeSlots();
}

function showDateView() {
    if (!timeSelectorView || !detailsFormView || !dateSelectorView) return;
    
    timeSelectorView.style.display = 'none';
    detailsFormView.style.display = 'none';
    dateSelectorView.style.display = 'block';
    
    selectedTime = null;
    document.querySelectorAll('.time-slot-button').forEach(btn => btn.classList.remove('selected-slot'));
    renderCalendar();
}

function showDetailsView() {
    if (!timeSelectorView || !detailsFormView || !dateSelectorView) return;
    
    dateSelectorView.style.display = 'none';
    timeSelectorView.style.display = 'none';
    detailsFormView.style.display = 'block';

    updateTimeDisplay();
}


// =================================
// 4. منطق التقويم الديناميكي (Calendar Logic)
// =================================

function renderCalendar() {
    if (!calendarGrid || !currentMonthDisplay) return;
    
    calendarGrid.innerHTML = '';
    const date = new Date(currentYear, currentMonth);

    // تحديث عرض الشهر والسنة باستخدام التنسيق العربي
    const monthName = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    currentMonthDisplay.textContent = monthName;

    // 1. إضافة أسماء الأيام (رؤوس الجدول)
    weekdayLabels.forEach(label => {
        const span = document.createElement('span');
        span.className = 'day-label-name';
        // عرض أول 3 أحرف
        span.textContent = label.slice(0, 3); 
        calendarGrid.appendChild(span);
    });

    // 2. حساب اليوم الأول في الشهر ومكانه
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 3. إضافة خلايا فارغة
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('span');
        emptyCell.className = 'grid-empty-cell';
        calendarGrid.appendChild(emptyCell);
    }

    // 4. ملء أيام الشهر
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('button');
        const fullDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const currentDate = new Date(currentYear, currentMonth, day);
        currentDate.setHours(0, 0, 0, 0);

        cell.className = 'calendar-date-cell date';
        cell.textContent = day.toLocaleString('ar-EG'); 
        cell.setAttribute('data-date', fullDate);
        
        if (currentDate < today) {
            cell.classList.add('disabled');
        } else {
            cell.classList.add('available');
            cell.onclick = () => selectDay(cell, fullDate);
        }

        if (selectedDate === fullDate) {
            cell.classList.add('selected');
        }

        calendarGrid.appendChild(cell);
    }
}

function selectDay(cell, fullDate) {
    document.querySelector('.calendar-date-cell.date.selected')?.classList.remove('selected');
    cell.classList.add('selected');
    selectedDate = fullDate; 
    showTimeView();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    selectedDate = null; 
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    selectedDate = null; 
    renderCalendar();
}


// =================================
// 5. منطق اختيار وتحديث الوقت (Time Slot Logic)
// =================================

function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(1970, 0, 1, hours, minutes); 
    date.setMinutes(date.getMinutes() + duration);
    
    const endHours = date.getHours().toString().padStart(2, '0');
    const endMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${endHours}:${endMinutes}`;
}

function renderTimeSlots() {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';

    availableTimes.forEach(time => {
        const button = document.createElement('button');
        button.className = 'time-slot-button';
        button.textContent = time;
        button.onclick = () => selectTime(time, button);
        timeSlotsContainer.appendChild(button);
    });
}

function selectTime(time, button) {
    selectedTime = time;
    
    document.querySelectorAll('.time-slot-button').forEach(btn => {
        btn.classList.remove('selected-slot');
    });
    
    button.classList.add('selected-slot');
    
    setTimeout(showDetailsView, 300);
}

function updateDateDisplay() {
    if (!selectedDate || !dateDisplayLabel) return;
    const dateObj = new Date(selectedDate);
    
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('ar-EG', options);
    
    dateDisplayLabel.textContent = formattedDate;
}

function updateTimeDisplay() {
    if (!selectedTime || !timeDisplayLabel || !dateDisplayLabel) return;
    const endTime = calculateEndTime(selectedTime, meetingDuration);
    const datePart = dateDisplayLabel.textContent;
    timeDisplayLabel.textContent = `${selectedTime} - ${endTime}, ${datePart}`;
}


// =================================
// 6. منطق المناطق الزمنية (Timezone Logic)
// =================================

function formatTime(timezoneId) {
    const now = new Date();
    // عرض الوقت بتنسيق 24 ساعة (00:00) للمنطقة الزمنية المحددة
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezoneId, hour12: false });
}

function renderTimezoneDisplay() {
    if (currentNameDisplay) currentNameDisplay.textContent = currentSelectedTimezone.name;
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentSelectedTimezone.id);
}

function openTimezoneDropdown() {
    if (timezoneOverlay) timezoneOverlay.style.display = 'flex';
    renderTimezoneList(TIMEZONES_LIST);
    if (searchInput) {
        searchInput.value = ''; 
        searchInput.focus();
    }
}

function closeTimezoneDropdown() {
    if (timezoneOverlay) timezoneOverlay.style.display = 'none';
}

function renderTimezoneList(zones) {
    if (!timezoneListElement) return;
    timezoneListElement.innerHTML = '';

    zones.forEach(zone => {
        const li = document.createElement('li');
        li.className = 'timezone-list-item';
        if (zone.id === currentSelectedTimezone.id) {
            li.classList.add('selected');
        }

        const time = formatTime(zone.id);
        const [hour, minute] = time.split(':');
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = zone.name;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'time-24h';
        timeSpan.textContent = `${hour}:${minute}`;

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        li.onclick = () => selectTimezone(zone);
        
        timezoneListElement.appendChild(li);
    });
}

function filterTimezones() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    const filteredZones = TIMEZONES_LIST.filter(zone => 
        zone.name.toLowerCase().includes(searchTerm) || 
        zone.id.toLowerCase().includes(searchTerm)
    );
    renderTimezoneList(filteredZones);
}

function selectTimezone(zone) {
    currentSelectedTimezone = zone;
    renderTimezoneDisplay();
    closeTimezoneDropdown();
}

if (searchInput) {
    searchInput.addEventListener('input', filterTimezones);
}


// =================================
// 7. الإطلاق الأولي (Initial Launch)
// =================================

// عند تحميل الصفحة، يتم تهيئة التقويم وعرض واجهة التاريخ الافتراضية
window.onload = () => {
    const today = new Date();
    
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    
    renderCalendar();
    showDateView();
    renderTimezoneDisplay(); // عرض المنطقة الزمنية الافتراضية
};












