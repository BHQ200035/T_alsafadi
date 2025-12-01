// booking-interaction.js - الكود النهائي الموحد والشامل
// تم توحيد جميع IDs وكلاسات التقويم والمناطق الزمنية والتحكم بالنوافذ

// ---------------------------------
// 1. تعريف المتغيرات والعناصر الأساسية (موحدة ومُحدثة)
// ---------------------------------
// عناصر النافذة الرئيسية والنوافذ الإضافية
const mainModal = document.getElementById("bookingMainContainer");
const openBtn = document.getElementById("openConsultationModal");
const closeSpan = document.getElementsByClassName("close-btn-main")[0];
const cookieModal = document.getElementById('cookieSettingsModal');
const cookieLink = document.getElementById('privacyCookieLink');

// عناصر واجهات الجدولة (التاريخ/الوقت/التفاصيل)
const dateSelectorView = document.getElementById('datePickerView'); 
const timeSelectorView = document.getElementById('timeSlotsView'); 
const detailsFormView = document.getElementById('detailsFormView'); 
const timeSlotsContainer = document.getElementById('timeSlotsWrapper'); 
const currentMonthDisplay = document.getElementById('currentMonthLabel'); 
const calendarGrid = document.getElementById('calendarGrid'); 

// المنطقة الزمنية
const timezoneOverlay = document.getElementById('timezoneOverlay'); 
const timezoneListElement = document.getElementById('timezoneList'); 
const currentNameDisplay = document.getElementById('currentTzName'); 
const currentTimeDisplay = document.getElementById('currentTzTime'); 
const searchInput = document.getElementById('timezoneSearchInput'); 

// متغيرات حالة التقويم والوقت
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); 
let selectedDate = null;
let selectedTime = null;

// ثوابت
const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const meetingDuration = 30; // مدة الاجتماع بالدقائق
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// بيانات المناطق الزمنية (كمثال)
const TIMEZONES_LIST = [
    { name: "Beirut Time", id: "Asia/Beirut" },
    { name: "Syria Time", id: "Asia/Damascus" },
    { name: "Asia/Gaza", id: "Asia/Gaza" },
    { name: "Kuwait Time", id: "Asia/Kuwait" },
    { name: "Dubai Time", id: "Asia/Dubai" },
    { name: "London Time", id: "Europe/London" },
    { name: "New York Time", id: "America/New_York" },
];

let currentSelectedTimezone = TIMEZONES_LIST.find(tz => tz.id === 'Asia/Gaza'); 

// ---------------------------------
// 2. وظائف التحكم بالنافذة الرئيسية (الجدولة)
// ---------------------------------

function closeMainModal() {
    if (mainModal) {
        mainModal.classList.remove("active");
    }
}

// ---------------------------------
// 3. وظائف التحكم بنافذة إعدادات الكوكيز
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

// ---------------------------------
// 4. وظائف التنقل بين واجهات الجدولة
// ---------------------------------

function showTimeView() {
    // إظهار واجهة الوقت
    dateSelectorView.style.display = 'none';
    detailsFormView.style.display = 'none';
    timeSelectorView.style.display = 'block';

    updateDateDisplay();
    renderTimeSlots();
}

function showDateView() {
    // إظهار واجهة التاريخ
    timeSelectorView.style.display = 'none';
    detailsFormView.style.display = 'none';
    dateSelectorView.style.display = 'block';
    
    selectedTime = null;
    document.querySelectorAll('.time-slot-button').forEach(btn => btn.classList.remove('selected-slot'));
    renderCalendar();
}

function showDetailsView() {
    // إظهار واجهة التفاصيل
    dateSelectorView.style.display = 'none';
    timeSelectorView.style.display = 'none';
    detailsFormView.style.display = 'block';

    updateTimeDisplay();
}

// ---------------------------------
// 5. منطق التقويم واختيار اليوم
// ---------------------------------

function renderCalendar() {
    calendarGrid.innerHTML = '';
    const date = new Date(currentYear, currentMonth);
    const monthName = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    currentMonthDisplay.textContent = monthName;

    // 1. إضافة أسماء الأيام
    weekdayLabels.forEach(label => {
        const span = document.createElement('span');
        span.className = 'day-label-name';
        span.textContent = label.slice(0, 3); 
        calendarGrid.appendChild(span);
    });

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 2. إضافة خلايا فارغة
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('span');
        emptyCell.className = 'grid-empty-cell';
        calendarGrid.appendChild(emptyCell);
    }

    // 3. ملء أيام الشهر
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

// ---------------------------------
// 6. منطق اختيار الوقت وتحديث العرض
// ---------------------------------

function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(1970, 0, 1, hours, minutes); 
    date.setMinutes(date.getMinutes() + duration);
    
    const endHours = date.getHours().toString().padStart(2, '0');
    const endMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${endHours}:${endMinutes}`;
}

function updateDateDisplay() {
    if (!selectedDate) return;
    const dateObj = new Date(selectedDate);
    const dateDisplay = document.getElementById('selectedDateLabel'); 
    
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('ar-EG', options);
    
    dateDisplay.textContent = formattedDate;
}

function updateTimeDisplay() {
    if (!selectedTime) return;
    const timeDisplay = document.getElementById('selectedTimeLabel'); 
    const endTime = calculateEndTime(selectedTime, meetingDuration);
    const datePart = document.getElementById('selectedDateLabel').textContent;
    timeDisplay.textContent = `${selectedTime} - ${endTime}, ${datePart}`;
}

function renderTimeSlots() {
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

// ---------------------------------
// 7. وظائف المنطقة الزمنية
// ---------------------------------

function formatTime(timezoneId) {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezoneId, hour12: false });
}

function renderTimezoneDisplay() {
    currentNameDisplay.textContent = currentSelectedTimezone.name;
    currentTimeDisplay.textContent = formatTime(currentSelectedTimezone.id);
}

function openTimezoneDropdown() {
    if (timezoneOverlay) {
        timezoneOverlay.style.display = 'flex';
        renderTimezoneList(TIMEZONES_LIST);
        searchInput.value = ''; 
        searchInput.focus();
    }
}

function closeTimezoneDropdown() {
    if (timezoneOverlay) {
        timezoneOverlay.style.display = 'none';
    }
}

function renderTimezoneList(zones) {
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


// ---------------------------------
// 8. الإطلاق الأولي وربط الأحداث
// ---------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. إعداد حالة التقويم الأولية
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    
    // تأكد من وجود العناصر قبل البدء
    if (calendarGrid) {
        renderCalendar();
        showDateView(); 
        renderTimezoneDisplay();
    }

    // 2. ربط الأحداث العامة للنافذة المنبثقة
    if (openBtn && mainModal) {
        openBtn.onclick = function() {
            mainModal.classList.add("active");
        }
    }
    if (closeSpan) {
        closeSpan.onclick = closeMainModal;
    }
    if (cookieLink) {
        cookieLink.addEventListener('click', openCookieModal);
    }

    // 3. عند النقر في أي مكان خارج النافذة، يتم إغلاقها
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

    // 4. ربط وظيفة البحث بحدث الإدخال
    if (searchInput) {
        searchInput.addEventListener('input', filterTimezones);
    }
});