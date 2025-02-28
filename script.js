document.addEventListener('DOMContentLoaded', function () {
  const daysContainer = document.getElementById('daysContainer');
  const dayPopup = document.getElementById('dayPopup');
  const popupTitle = document.getElementById('popupTitle');
  const popupContent = document.getElementById('popupContent');
  const closePopup = document.getElementById('closePopup');

  // --- Utility Functions ---
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openPopup = (dateKey, dayDetails) => {
    popupTitle.textContent = dayDetails.title;
    popupContent.innerHTML = '';

    const date = new Date(dateKey);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const dateElement = document.createElement('h3');
    dateElement.textContent = formattedDate;
    popupContent.appendChild(dateElement);

    const textContentElement = document.createElement('div');
    textContentElement.innerHTML = marked.parse(dayDetails.content);
    popupContent.appendChild(textContentElement);

    if (dayDetails.images && Array.isArray(dayDetails.images)) {
      dayDetails.images.forEach((imageName) => {
        const imgElement = document.createElement('img');
        imgElement.src = `images/${imageName}`;
        imgElement.alt = dayDetails.title + " Image"; // add alt text
        imgElement.style.maxWidth = '100%';
        imgElement.style.height = 'auto';
        popupContent.appendChild(imgElement);
      });
    }

    dayPopup.style.display = 'block';
  };

  // --- Generate Days Logic ---
  const generateDays = (daysData) => {
    let startDate, endDate;
    const dates = Object.keys(daysData);

    if (dates.length > 0) {
      const sortedDates = dates.sort();
      startDate = new Date(sortedDates[0]);
      const lastDate = new Date(sortedDates[sortedDates.length - 1]);
      endDate = new Date(lastDate);
      endDate.setFullYear(lastDate.getFullYear() + 1);
    } else {
      startDate = new Date(new Date().getFullYear(), 0, 1);
      endDate = new Date();
    }

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const dayDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    for (let i = 0; i <= dayDiff; i++) {
      const currentDate = new Date(startDate.getTime() + i * 86400000);
      const dateKey = formatDate(currentDate);
      const dayDetails = daysData[dateKey];

      if (dayDetails) {
        const dayTitleElement = document.createElement('div');
        dayTitleElement.classList.add('day-title');
        dayTitleElement.textContent = dayDetails.title;
        dayTitleElement.addEventListener('click', () =>
          openPopup(dateKey, dayDetails)
        );
        daysContainer.appendChild(dayTitleElement);
      } else {
        const dayPeriodElement = document.createElement('div');
        dayPeriodElement.classList.add('day-period');
        dayPeriodElement.textContent = '•';

        const today = new Date();
        if (currentDate.toDateString() === today.toDateString()) {
          dayPeriodElement.classList.add('today');
        } else if (currentDate > today) {
          dayPeriodElement.classList.add('future');
        } else {
          dayPeriodElement.classList.add('past');
        }
        daysContainer.appendChild(dayPeriodElement);
      }
    }
  };

  // --- Event Listeners ---
  closePopup.onclick = () => {
    dayPopup.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === dayPopup) {
      dayPopup.style.display = 'none';
    }
  };

  // --- Fetch Data & Initialize ---
  fetch('days.json')
    .then((response) => response.json())
    .then((daysData) => {
      generateDays(daysData);
    })
    .catch((error) => {
      console.error('Error fetching days data:', error);
      generateDays({});
    });
});
