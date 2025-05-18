  (() => {
    const moodColors = {
      happy: 'mood-happy',
      sad: 'mood-sad',
      angry: 'mood-angry',
      excited: 'mood-excited',
      neutral: 'mood-neutral',
    };
    const moodEmojis = {
      happy: "😀",
      sad: "😢",
      angry: "😠",
      excited: "🤩",
      neutral: "😐",
    };

    let selectedMood = null;

    const monthYearLabel = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const moodButtons = document.querySelectorAll('.mood-button');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const clearButton = document.querySelector('.clear-button');

    let currentDate = new Date();

    // Storage key prefix
    const STORAGE_KEY = 'moodtracker-';

    function saveMood(dateKey, mood) {
      localStorage.setItem(STORAGE_KEY + dateKey, mood);
    }
    function getMood(dateKey) {
      return localStorage.getItem(STORAGE_KEY + dateKey);
    }
    function clearMoods() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    }

    function formatDateKey(date) {
      // Format: YYYY-MM-DD
      return date.toISOString().slice(0, 10);
    }

    function renderCalendar(year, month) {
      daysContainer.innerHTML = '';
      
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const firstWeekDay = firstDayOfMonth.getDay();
      const daysInMonth = lastDayOfMonth.getDate();

      // Calculate previous month tail days (if any)
      const prevMonthLastDay = new Date(year, month, 0);
      const daysInPrevMonth = prevMonthLastDay.getDate();

      // Add tail days from previous month as inactive
      for (let i = firstWeekDay - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const dayEl = document.createElement('div');
        dayEl.className = 'day inactive';
        dayEl.textContent = dayNum;
        daysContainer.appendChild(dayEl);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = day;

        const dateObj = new Date(year, month, day);
        const dateKey = formatDateKey(dateObj);

        // Add mood if saved
        const mood = getMood(dateKey);
        if (mood && moodColors[mood]) {
          dayEl.classList.add(moodColors[mood]);
          // Add mood emoji indicator
          const moodSpan = document.createElement('span');
          moodSpan.className = 'mood-indicator';
          moodSpan.textContent = moodEmojis[mood];
          dayEl.appendChild(moodSpan);
        }

        // Highlight today
        const today = new Date();
        if (
          dateObj.getFullYear() === today.getFullYear() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getDate() === today.getDate()
        ) {
          dayEl.classList.add('today');
        }

        // Make only current month days interactive
        dayEl.addEventListener('click', () => {
          if (!selectedMood) {
            alert('Please select a mood first.');
            return;
          }
          saveMood(dateKey, selectedMood);
          renderCalendar(year, month);
        });

        daysContainer.appendChild(dayEl);
      }

      // Fill the remaining cells to complete the last row to 7 columns with next month days inactive
      const totalDisplayed = firstWeekDay + daysInMonth;
      const extraDays = 7 - (totalDisplayed % 7);
      if (extraDays < 7) {
        for (let i = 1; i <= extraDays; i++) {
          const dayEl = document.createElement('div');
          dayEl.className = 'day inactive';
          dayEl.textContent = i;
          daysContainer.appendChild(dayEl);
        }
      }

      // Update month-year label
      const options = { year: 'numeric', month: 'long' };
      monthYearLabel.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date(year, month));
    }

    // Mood button click handler
    moodButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Visually indicate selection
        moodButtons.forEach(b => b.style.transform = '');
        button.style.transform = 'scale(1.3)';
        selectedMood = button.getAttribute('data-mood');
      });
    });

    // Navigate months
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    // Clear all moods
    clearButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all mood data?')) {
        clearMoods();
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      }
    });

    // Initial render
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  })();