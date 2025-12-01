// booking-interaction.js

// ---------------------------------
// 1. تعريف العناصر الأساسية (تحديث IDs)
// ---------------------------------
const dateSelectorView = document.getElementById('datePickerView'); // كان: date-selector-view
const timeSelectorView = document.getElementById('timeSlotsView'); // كان: time-selector-view
const detailsFormView = document.getElementById('detailsFormView'); // كان: details-form-view
const timeSlotsContainer = document.getElementById('timeSlotsWrapper'); // كان: time-slots-container
const currentMonthDisplay = document.getElementById('currentMonthLabel'); // كان: current-month-display
const calendarGrid = document.getElementById('calendarGrid'); // كان: calendar-grid 

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // الشهر الحالي (0-11)
let selectedDate = null;
let selectedTime = null;

// **2. الأوقات المتاحة لهذا اليوم (مثال ثابت)**
const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const meetingDuration = 30; // مدة الاجتماع بالدقائق

// ---------------------------------
// 3. وظائف التنقل بين الواجهات
// ---------------------------------

function showTimeView() {
  // إخفاء الواجهات الأخرى وإظهار واجهة الوقت
  dateSelectorView.style.display = 'none';
  detailsFormView.style.display = 'none';
  timeSelectorView.style.display = 'block';

  updateDateDisplay();
  renderTimeSlots();
}

function showDateView() {
  // إخفاء الواجهات الأخرى وإظهار واجهة اليوم
  timeSelectorView.style.display = 'none';
  detailsFormView.style.display = 'none';
  dateSelectorView.style.display = 'block';
  
  // مسح اختيار الوقت عند الرجوع
  selectedTime = null;
  // تحديث الكلاسات (تغيير اسم الكلاس)
  document.querySelectorAll('.time-slot-button').forEach(btn => btn.classList.remove('selected-slot')); // كان: .time-slot-btn.selected-time
  renderCalendar(); // إعادة رسم التقويم للحفاظ على الحالة
}

function showDetailsView() {
  // إخفاء الواجهات الأخرى وإظهار واجهة التفاصيل
  dateSelectorView.style.display = 'none';
  timeSelectorView.style.display = 'none';
  detailsFormView.style.display = 'block';

  updateTimeDisplay();
}


// ---------------------------------
// 4. تحديث النصوص بناءً على الاختيار (تحديث IDs)
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
  const dateDisplay = document.getElementById('selectedDateLabel'); // كان: selected-date-display
  
  // استخدام 'ar-EG' لعرض الأسماء والأرقام العربية
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('ar-EG', options);
  
  dateDisplay.textContent = formattedDate;
}

function updateTimeDisplay() {
  if (!selectedTime) return;
  const timeDisplay = document.getElementById('selectedTimeLabel'); // كان: selected-time-display
  const endTime = calculateEndTime(selectedTime, meetingDuration);
  const datePart = document.getElementById('selectedDateLabel').textContent; // كان: selected-date-display
  timeDisplay.textContent = `${selectedTime} - ${endTime}, ${datePart}`;
}

// ---------------------------------
// 5. منطق اختيار الوقت (تحديث الكلاسات)
// ---------------------------------

function renderTimeSlots() {
  timeSlotsContainer.innerHTML = ''; // ID تم تحديثه بالفعل

  availableTimes.forEach(time => {
    const button = document.createElement('button');
    button.className = 'time-slot-button'; // كان: time-slot-btn
    button.textContent = time;
    button.onclick = () => selectTime(time, button);
    timeSlotsContainer.appendChild(button);
  });
}

function selectTime(time, button) {
  selectedTime = time;
  
  // إزالة التحديد من جميع الأزرار (تغيير اسم الكلاس)
  document.querySelectorAll('.time-slot-button').forEach(btn => { // كان: .time-slot-btn
    btn.classList.remove('selected-slot'); // كان: selected-time
  });
  
  // تحديد الزر المختار (تغيير اسم الكلاس)
  button.classList.add('selected-slot'); // كان: selected-time
  
  // الانتقال إلى واجهة التفاصيل
  setTimeout(showDetailsView, 300); 
}


// ---------------------------------
// 6. منطق التقويم الديناميكي والترتيب (تحديث الكلاسات)
// ---------------------------------

// أسماء الأيام بالإنجليزية 
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const date = new Date(currentYear, currentMonth);

  // تحديث عرض الشهر والسنة باستخدام التنسيق العربي
  const monthName = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  currentMonthDisplay.textContent = monthName; // ID تم تحديثه بالفعل

// 1. إضافة أسماء الأيام (رؤوس الجدول)
  weekdayLabels.forEach(label => {
    const span = document.createElement('span');
    span.className = 'day-label-name'; // كان: day-label
    // 🚀 تم التعديل لعرض أول 3 أحرف 🚀
    span.textContent = label.slice(0, 3); 
    calendarGrid.appendChild(span);
  });

  // 2. حساب اليوم الأول في الشهر ومكانه
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 3. إضافة خلايا فارغة (لتحديد بداية الأسبوع)
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('span');
    emptyCell.className = 'grid-empty-cell'; // كان: day-cell empty
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

    cell.className = 'calendar-date-cell date'; // كان: day-cell date
    cell.textContent = day.toLocaleString('ar-EG'); 
    cell.setAttribute('data-date', fullDate);
    
    // مقارنة التاريخ الحالي لتحديد ما إذا كان اليوم متاحاً أم لا
    if (currentDate < today) {
      cell.classList.add('disabled'); 
    } else {
      cell.classList.add('available');
      cell.onclick = () => selectDay(cell, fullDate);
    }

    // تحديد اليوم المختار مسبقاً
    if (selectedDate === fullDate) {
      cell.classList.add('selected');
    }

    calendarGrid.appendChild(cell);
  }
}

function selectDay(cell, fullDate) {
  // إزالة التحديد من اليوم السابق (تغيير اسم الكلاس)
  document.querySelector('.calendar-date-cell.date.selected')?.classList.remove('selected'); // كان: .day-cell.date.selected

  // تحديد اليوم الحالي
  cell.classList.add('selected');

  selectedDate = fullDate; 

  // الانتقال إلى واجهة اختيار الوقت
  showTimeView();
}

// **7. وظائف التنقل بين الأشهر**
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
// 8. منطق المناطق الزمنية (تحديث IDs)
// ---------------------------------

const TIMEZONES_LIST = [
  { name: "Beirut Time", id: "Asia/Beirut" },
  { name: "Syria Time", id: "Asia/Damascus" },
  { name: "Asia/Gaza", id: "Asia/Gaza" },
  { name: "Kuwait Time", id: "Asia/Kuwait" },
  { name: "Dubai Time", id: "Asia/Dubai" },
  { name: "London Time", id: "Europe/London" },
  { name: "New York Time", id: "America/New_York" },
];

let currentSelectedTimezone = TIMEZONES_LIST.find(tz => tz.id === 'Asia/Gaza'); // الإعداد الافتراضي

const timezoneOverlay = document.getElementById('timezoneOverlay'); // كان: timezone-overlay
const timezoneListElement = document.getElementById('timezoneList'); // كان: timezone-list
const currentNameDisplay = document.getElementById('currentTzName'); // كان: current-timezone-name
const currentTimeDisplay = document.getElementById('currentTzTime'); // كان: current-timezone-time
const searchInput = document.getElementById('timezoneSearchInput'); // كان: timezone-search-input


// **وظائف المنطقة الزمنية**

function formatTime(timezoneId) {
  // وظيفة لتحويل الوقت إلى تنسيق 24 ساعة للمنطقة الزمنية المحددة
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezoneId, hour12: false });
}

function renderTimezoneDisplay() {
  currentNameDisplay.textContent = currentSelectedTimezone.name;
  currentTimeDisplay.textContent = formatTime(currentSelectedTimezone.id);
}

function openTimezoneDropdown() {
  timezoneOverlay.style.display = 'flex';
  renderTimezoneList(TIMEZONES_LIST);
  searchInput.value = ''; 
  searchInput.focus();
}

function closeTimezoneDropdown() {
  timezoneOverlay.style.display = 'none';
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
    
    // عرض اسم المنطقة الزمنية
    const nameSpan = document.createElement('span');
    nameSpan.textContent = zone.name;

    // عرض الوقت بصيغة 24 ساعة
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


// **9. الإطلاق الأولي**
window.onload = () => {
  const today = new Date();
  
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  
  renderCalendar();
  showDateView();
  
  renderTimezoneDisplay();

  // 💡 ربط وظيفة البحث بحدث الإدخال
  if (searchInput) {
    searchInput.addEventListener('input', filterTimezones);
  }
};