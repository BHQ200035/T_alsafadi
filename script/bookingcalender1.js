// **ملف scheduler-interaction-unique.js**

// =================================
// 1. تعريف العناصر الرئيسية والثوابت (Unique Names)
// =================================

// عناصر واجهات الجدولة (التاريخ، الوقت، التفاصيل)
const sch_datePickerView = document.getElementById('sch_date_picker_view');
const sch_timeSlotsView = document.getElementById('sch_time_slots_view');
const sch_clientDetailsFormView = document.getElementById('sch_client_details_form_view');
const sch_availableSlotsContainer = document.getElementById('sch_available_slots_container');

// عناصر التقويم
const sch_currentMonthLabel = document.getElementById('sch_current_month_label');
const sch_calendarGridContainer = document.getElementById('sch_calendar_grid_container'); 

// عناصر عرض البيانات المختارة
const sch_chosenDateLabel = document.getElementById('sch_chosen_date_label');
const sch_chosenTimeLabel = document.getElementById('sch_chosen_time_label');

// عناصر المنطقة الزمنية
const sch_timezoneOverlay = document.getElementById('sch_timezone_modal_overlay');
const sch_timezoneListElement = document.getElementById('sch_timezone_list_output');
const sch_currentNameDisplay = document.getElementById('sch_timezone_name_output');
const sch_currentTimeDisplay = document.getElementById('sch_timezone_time_output');
const sch_searchInput = document.getElementById('sch_search_input_field');

// العناصر الجديدة لقائمة الدول (للهاتف)
const sch_countryCodeModal = document.getElementById('sch_country_code_modal');
const sch_countryListOutput = document.getElementById('sch_country_list_output');
const sch_countrySearchInput = document.getElementById('sch_country_search_input');
const sch_selectedFlagDisplay = document.getElementById('sch_selected_flag');
const sch_selectedCodeDisplay = document.getElementById('sch_selected_code');


// ثوابت ومُتغيرات الحالة (Unique Variables)
let sch_currentYear = new Date().getFullYear();
let sch_currentMonth = new Date().getMonth(); // الشهر الحالي (0-11)
let sch_selectedDate = null;
let sch_selectedTime = null;
const sch_meetingDuration = 30; // مدة الاجتماع بالدقائق

const sch_availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const sch_weekdayLabels = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']; 

const SCH_TIMEZONES_LIST = [
  { name: "توقيت بيروت", id: "Asia/Beirut" },
  { name: "توقيت سوريا", id: "Asia/Damascus" },
  { name: "توقيت غزة", id: "Asia/Gaza" },
  { name: "توقيت الكويت", id: "Asia/Kuwait" },
  { name: "توقيت دبي", id: "Asia/Dubai" },
  { name: "توقيت لندن", id: "Europe/London" },
  { name: "توقيت نيويورك", id: "America/New_York" },
];
let sch_currentSelectedTimezone = SCH_TIMEZONES_LIST.find(tz => tz.id === 'Asia/Gaza');

// قائمة الدول ومفاتيحها
const SCH_COUNTRIES_LIST = [
    { name: "السعودية", code: "+966", flag: "🇸🇦" },
    { name: "الإمارات", code: "+971", flag: "🇦🇪" },
    { name: "مصر", code: "+20", flag: "🇪🇬" },
    { name: "فلسطين (غزة)", code: "+970", flag: "🇵🇸" },
    { name: "الأردن", code: "+962", flag: "🇯🇴" },
    { name: "المغرب", code: "+212", flag: "🇲🇦" },
    { name: "الولايات المتحدة", code: "+1", flag: "🇺🇸" },
    { name: "المملكة المتحدة", code: "+44", flag: "🇬🇧" },
    { name: "لبنان", code: "+961", flag: "🇱🇧" },
];


// =================================
// 2. وظائف التنقل بين الواجهات (Views)
// =================================

function sch_showTimeView() {
  if (!sch_timeSlotsView || !sch_clientDetailsFormView || !sch_datePickerView) return;
  
  sch_datePickerView.style.display = 'none';
  sch_clientDetailsFormView.style.display = 'none';
  sch_timeSlotsView.style.display = 'block';

  sch_updateDateDisplay();
  sch_renderTimeSlots();
}

function sch_showDateView() {
  if (!sch_timeSlotsView || !sch_clientDetailsFormView || !sch_datePickerView) return;
  
  sch_timeSlotsView.style.display = 'none';
  sch_clientDetailsFormView.style.display = 'none';
  sch_datePickerView.style.display = 'block';
  
  sch_selectedTime = null;
  document.querySelectorAll('.sch_time_slot_btn').forEach(btn => btn.classList.remove('sch_selected_time'));
  sch_renderCalendar();
}

function sch_showDetailsView() {
  if (!sch_timeSlotsView || !sch_clientDetailsFormView || !sch_datePickerView) return;
  
  sch_datePickerView.style.display = 'none';
  sch_timeSlotsView.style.display = 'none';
  sch_clientDetailsFormView.style.display = 'block';

  sch_updateTimeDisplay();
}


// =================================
// 3. منطق التقويم الديناميكي (Calendar Logic)
// =================================

function sch_renderCalendar() {
  if (!sch_calendarGridContainer || !sch_currentMonthLabel) return;
  
  sch_calendarGridContainer.innerHTML = '';
  const date = new Date(sch_currentYear, sch_currentMonth);

  // تحديث عرض الشهر والسنة
  const monthName = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  sch_currentMonthLabel.textContent = monthName;

  // 1. إضافة أسماء الأيام (رؤوس الجدول)
  sch_weekdayLabels.forEach(label => {
    const span = document.createElement('span');
    span.className = 'day-label'; 
    span.textContent = label.slice(0, 3); 
    sch_calendarGridContainer.appendChild(span);
  });

  // 2. حساب اليوم الأول في الشهر ومكانه
  const firstDayIndex = new Date(sch_currentYear, sch_currentMonth, 1).getDay();
  const daysInMonth = new Date(sch_currentYear, sch_currentMonth + 1, 0).getDate();

  // 3. إضافة خلايا فارغة
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('span');
    emptyCell.className = 'day-cell empty'; 
    sch_calendarGridContainer.appendChild(emptyCell);
  }

  // 4. ملء أيام الشهر
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('button');
    const fullDate = `${sch_currentYear}-${(sch_currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const currentDate = new Date(sch_currentYear, sch_currentMonth, day);
    currentDate.setHours(0, 0, 0, 0);

    cell.className = 'day-cell date'; 
    cell.textContent = day.toLocaleString('ar-EG'); 
    cell.setAttribute('data-date', fullDate);
    
    if (currentDate < today) {
      cell.classList.add('disabled');
    } else {
      cell.classList.add('available');
      cell.onclick = () => sch_selectDay(cell, fullDate);
    }

    if (sch_selectedDate === fullDate) {
      cell.classList.add('selected');
    }

    sch_calendarGridContainer.appendChild(cell);
  }
}

function sch_selectDay(cell, fullDate) {
  document.querySelector('.day-cell.date.selected')?.classList.remove('selected');
  cell.classList.add('selected');
  sch_selectedDate = fullDate; 
  sch_showTimeView();
}

function sch_prevMonth() {
  sch_currentMonth--;
  if (sch_currentMonth < 0) {
    sch_currentMonth = 11;
    sch_currentYear--;
  }
  sch_selectedDate = null; 
  sch_renderCalendar();
}

function sch_nextMonth() {
  sch_currentMonth++;
  if (sch_currentMonth > 11) {
    sch_currentMonth = 0;
    sch_currentYear++;
  }
  sch_selectedDate = null; 
  sch_renderCalendar();
}


// =================================
// 4. منطق اختيار وتحديث الوقت (Time Slot Logic)
// =================================

function sch_calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const date = new Date(1970, 0, 1, hours, minutes); 
  date.setMinutes(date.getMinutes() + duration);
  
  const endHours = date.getHours().toString().padStart(2, '0');
  const endMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${endHours}:${endMinutes}`;
}

function sch_renderTimeSlots() {
  if (!sch_availableSlotsContainer) return;
  sch_availableSlotsContainer.innerHTML = '';

  sch_availableTimes.forEach(time => {
    const button = document.createElement('button');
    button.className = 'sch_time_slot_btn'; 
    button.textContent = time;
    button.onclick = () => sch_selectTime(time, button);
    sch_availableSlotsContainer.appendChild(button);
  });
}

function sch_selectTime(time, button) {
  sch_selectedTime = time;
  
  document.querySelectorAll('.sch_time_slot_btn').forEach(btn => {
    btn.classList.remove('sch_selected_time');
  });
  
  button.classList.add('sch_selected_time');
  
  setTimeout(sch_showDetailsView, 300);
}

function sch_updateDateDisplay() {
  if (!sch_selectedDate || !sch_chosenDateLabel) return;
  const dateObj = new Date(sch_selectedDate);
  
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('ar-EG', options);
  
  sch_chosenDateLabel.textContent = formattedDate;
}

function sch_updateTimeDisplay() {
  if (!sch_selectedTime || !sch_chosenTimeLabel || !sch_chosenDateLabel) return;
  const endTime = sch_calculateEndTime(sch_selectedTime, sch_meetingDuration);
  const datePart = sch_chosenDateLabel.textContent;
  sch_chosenTimeLabel.textContent = `${sch_selectedTime} - ${endTime}, ${datePart}`;
}


// =================================
// 5. منطق المناطق الزمنية (Timezone Logic)
// =================================

function sch_formatTime(timezoneId) {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezoneId, hour12: false });
}

function sch_renderTimezoneDisplay() {
  if (sch_currentNameDisplay) sch_currentNameDisplay.textContent = sch_currentSelectedTimezone.name;
  if (sch_currentTimeDisplay) sch_currentTimeDisplay.textContent = sch_formatTime(sch_currentSelectedTimezone.id);
}

function sch_openTimezoneDropdown() {
  if (sch_timezoneOverlay) sch_timezoneOverlay.style.display = 'flex';
  sch_renderTimezoneList(SCH_TIMEZONES_LIST);
  if (sch_searchInput) {
    sch_searchInput.value = ''; 
    sch_searchInput.focus();
  }
}

function sch_closeTimezoneDropdown() {
  if (sch_timezoneOverlay) sch_timezoneOverlay.style.display = 'none';
}

function sch_renderTimezoneList(zones) {
  if (!sch_timezoneListElement) return;
  sch_timezoneListElement.innerHTML = '';

  zones.forEach(zone => {
    const li = document.createElement('li');
    li.className = 'sch_timezone_list_item'; 
    if (zone.id === sch_currentSelectedTimezone.id) {
      li.classList.add('selected');
    }

    const time = sch_formatTime(zone.id);
    const [hour, minute] = time.split(':');
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = zone.name;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'time-24h';
    timeSpan.textContent = `${hour}:${minute}`;

    li.appendChild(nameSpan);
    li.appendChild(timeSpan);
    li.onclick = () => sch_selectTimezone(zone);
    
    sch_timezoneListElement.appendChild(li);
  });
}

function sch_filterTimezones() {
  if (!sch_searchInput) return;
  const searchTerm = sch_searchInput.value.toLowerCase();
  const filteredZones = SCH_TIMEZONES_LIST.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm) || 
    zone.id.toLowerCase().includes(searchTerm)
  );
  sch_renderTimezoneList(filteredZones);
}

function sch_selectTimezone(zone) {
  sch_currentSelectedTimezone = zone;
  sch_renderTimezoneDisplay();
  sch_closeTimezoneDropdown();
}

if (sch_searchInput) {
  sch_searchInput.addEventListener('input', sch_filterTimezones);
}


// =================================
// 6. منطق اختيار الدولة ومفتاح الهاتف
// =================================

function sch_renderCountryList(countries) {
    if (!sch_countryListOutput) return;
    sch_countryListOutput.innerHTML = '';

    countries.forEach(country => {
        const li = document.createElement('li');
        li.className = 'sch_country_list_item';
        
        li.innerHTML = `
            <span class="sch_country_flag_small">${country.flag}</span>
            <span>${country.name}</span>
            <span class="sch_country_code_text">${country.code}</span>
        `;
        
        li.onclick = () => sch_selectCountry(country);
        sch_countryListOutput.appendChild(li);
    });
}

function sch_selectCountry(country) {
    if (sch_selectedFlagDisplay) sch_selectedFlagDisplay.textContent = country.flag;
    if (sch_selectedCodeDisplay) sch_selectedCodeDisplay.textContent = country.code;
    sch_closeCountryList();
}

function sch_toggleCountryList() {
    if (!sch_countryCodeModal) return;
    sch_countryCodeModal.style.display = 'flex';
    sch_renderCountryList(SCH_COUNTRIES_LIST);
    if (sch_countrySearchInput) {
        sch_countrySearchInput.value = '';
        sch_countrySearchInput.focus();
    }
}

function sch_closeCountryList() {
    if (sch_countryCodeModal) sch_countryCodeModal.style.display = 'none';
}

function sch_filterCountries() {
    if (!sch_countrySearchInput) return;
    const searchTerm = sch_countrySearchInput.value.toLowerCase();
    const filteredCountries = SCH_COUNTRIES_LIST.filter(country => 
        country.name.toLowerCase().includes(searchTerm) || 
        country.code.includes(searchTerm)
    );
    sch_renderCountryList(filteredCountries);
}

if (sch_countrySearchInput) {
    sch_countrySearchInput.addEventListener('input', sch_filterCountries);
}


// =================================
// 7. الإطلاق الأولي (Initial Launch) & الإغلاق العام
// =================================

// عند تحميل الصفحة، يتم تهيئة التقويم وعرض واجهة التاريخ الافتراضية
window.onload = () => {
  const today = new Date();
  
  sch_currentYear = today.getFullYear();
  sch_currentMonth = today.getMonth();
  
  sch_renderCalendar();
  sch_showDateView();
  sch_renderTimezoneDisplay();
};

// إغلاق النوافذ عند النقر خارجها
window.onclick = function(event) {
  // في هذا الكود لا يوجد mainModal مفتوح كنظام نافذة منبثقة، 
  // لكن للتأكد من إغلاق النوافذ الفرعية:
  
  if (event.target == sch_timezoneOverlay) { 
    sch_closeTimezoneDropdown();
  }
  
  if (event.target == sch_countryCodeModal) { 
    sch_closeCountryList();
  }
}