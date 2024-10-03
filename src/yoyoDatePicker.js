export function yoyoDatePicker(selector, options = {}) {
    const inputElement = document.querySelector(selector);
    const datepickerContainer = document.createElement('div');
    const daysContainer = document.createElement('div');
    const daysNamesContainer = document.createElement('div');
    const monthSelect = document.createElement('select');
    const yearInput = document.createElement('input');
    const prevMonthBtn = document.createElement('button');
    const nextMonthBtn = document.createElement('button');
    const todayBtn = document.createElement('button');

    const enableDates = options.enableDates || [];
    const disableDates = options.disableDates || [];
    const firstDayOfWeek = options.firstDayOfWeek || 'Monday';
    const disableDateStyle = options.disableDateStyle || '';
    const enableDateStyle = options.enableDateStyle || '';
    const todayStyle = options.todayStyle || 'font-weight: bold;';
    const onSelect = options.onSelect || function () { };
    const inline = options.inline || false;
    const width = options.width || '350px';
    const primaryColor = options.primaryColor || '#4a90e2';
    const buttonHoverColor = options.buttonHoverColor || '#3a7bc8';
    let weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (firstDayOfWeek === 'Sunday') {
        weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    let currentDate = new Date();
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let selectedDate = null;

    function generateStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
        .yoyo_dp_container {
            display: ${inline ? 'flex' : 'none'};
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            width: ${width};
            position: ${inline ? 'static' : 'absolute'};
            z-index: 1000;
        }
        .yoyo_dp_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
        }
        .yoyo_dp_month-btn, .yoyo_dp_today-btn {
            padding: 10px 15px;
            background-color: ${primaryColor};
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .yoyo_dp_month-btn:hover, .yoyo_dp_today-btn:hover {
            background-color: ${buttonHoverColor};
        }
        .yoyo_dp_today-btn {
            margin-top: 10px;
            width: 100%;
        }
        .yoyo_dp_month-select, .yoyo_dp_year-input {
            padding: 5px;
            font-size: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .yoyo_dp_year-input {
            width: 70px;
            text-align: center;
        }
        .yoyo_dp_days-container, .yoyo_dp_days-names {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
            width: 100%;
        }
        .yoyo_dp_day, .yoyo_dp_day-name {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-radius: 50%;
            font-size: 14px;
        }
        .yoyo_dp_day-name {
            font-weight: bold;
            color: ${primaryColor};
        }
        .yoyo_dp_day {
            border: none;
            background: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .yoyo_dp_enabled {
            ${enableDateStyle || `background-color: #e8f0fe; color: ${primaryColor};`}
        }
        .yoyo_dp_enabled:hover {
            background-color: ${primaryColor};
            color: white;
        }
        .yoyo_dp_disabled {
            ${disableDateStyle || 'background-color: #f0f0f0; color: #a0a0a0;'}
            cursor: not-allowed;
        }
        .yoyo_dp_today {
            ${todayStyle}
        }
        .yoyo_dp_selected {
            background-color: ${primaryColor};
            color: white;
        }
    `;
        document.head.appendChild(style);
    }

    function generateDatepicker() {
        datepickerContainer.classList.add('yoyo_dp_container');
        daysContainer.classList.add('yoyo_dp_days-container');
        daysNamesContainer.classList.add('yoyo_dp_days-names');
        monthSelect.classList.add('yoyo_dp_month-select');
        yearInput.classList.add('yoyo_dp_year-input');
        prevMonthBtn.classList.add('yoyo_dp_month-btn');
        nextMonthBtn.classList.add('yoyo_dp_month-btn');
        todayBtn.classList.add('yoyo_dp_today-btn');

        prevMonthBtn.textContent = '←';
        nextMonthBtn.textContent = '→';
        todayBtn.textContent = 'Back to Today';

        yearInput.type = 'number';
        yearInput.min = 1900;
        yearInput.max = 2100;

        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        const header = document.createElement('div');
        header.classList.add('yoyo_dp_header');
        header.appendChild(prevMonthBtn);
        header.appendChild(monthSelect);
        header.appendChild(yearInput);
        header.appendChild(nextMonthBtn);

        datepickerContainer.appendChild(header);
        datepickerContainer.appendChild(daysNamesContainer);
        datepickerContainer.appendChild(daysContainer);
        datepickerContainer.appendChild(todayBtn);

        if (inline) {
            inputElement.parentNode.insertBefore(datepickerContainer, inputElement.nextSibling);
        } else {
            document.body.appendChild(datepickerContainer);
        }

        displayWeekDays();
        updateCalendar();
    }

    // 显示星期一到星期日
    function displayWeekDays() {
        daysNamesContainer.innerHTML = '';
        weekDays.forEach(day => {
            const dayName = document.createElement('div');
            dayName.classList.add('yoyo_dp_day-name');
            dayName.textContent = day;
            daysNamesContainer.appendChild(dayName);
        });
    }

    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        yearInput.value = year;
        monthSelect.value = month;

        // 获取当月的天数
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 获取当月第一天是星期几
        let firstDay = new Date(year, month, 1).getDay();
        if (firstDayOfWeek === 'Monday') {
            firstDay = (firstDay === 0) ? 7 : firstDay;
        }

        // 清空之前的天数
        daysContainer.innerHTML = '';

        // 填充空白天数
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('button');
            emptyDay.classList.add('yoyo_dp_day');
            emptyDay.disabled = true;
            daysContainer.appendChild(emptyDay);
        }

        // 填充当月的天数
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button');
            dayElement.classList.add('yoyo_dp_day');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // 检查日期是否被禁用
            if (disableDates.includes(dateStr)) {
                dayElement.classList.add('yoyo_dp_disabled');
                dayElement.disabled = true;
            } else if (enableDates.length === 0 || enableDates.includes(dateStr)) {
                dayElement.classList.add('yoyo_dp_enabled');
                dayElement.addEventListener('click', () => {
                    selectedDate = dateStr;
                    onSelect(dateStr);
                    inputElement.value = dateStr;
                    if (!inline) {
                        datepickerContainer.style.display = 'none';
                    }
                    updateCalendar();
                });
            } else {
                dayElement.classList.add('yoyo_dp_disabled');
                dayElement.disabled = true;
            }

            // 检查是否是今天
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('yoyo_dp_today');
            }

            // 检查是否是选中的日期
            if (dateStr === selectedDate) {
                dayElement.classList.add('yoyo_dp_selected');
            }

            dayElement.textContent = day;
            daysContainer.appendChild(dayElement);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        updateCalendar();
    });

    monthSelect.addEventListener('change', () => {
        currentDate.setMonth(parseInt(monthSelect.value));
        updateCalendar();
    });

    yearInput.addEventListener('change', () => {
        currentDate.setFullYear(parseInt(yearInput.value));
        updateCalendar();
    });

    if (!inline) {
        inputElement.addEventListener('click', () => {
            const rect = inputElement.getBoundingClientRect();
            datepickerContainer.style.top = `${rect.bottom}px`;
            datepickerContainer.style.left = `${rect.left}px`;
            datepickerContainer.style.display = 'flex';
        });

        document.addEventListener('click', (e) => {
            if (!datepickerContainer.contains(e.target) && e.target !== inputElement) {
                datepickerContainer.style.display = 'none';
            }
        });
    }

    generateStyles();
    generateDatepicker();
}

window.yoyoDatePicker = yoyoDatePicker;