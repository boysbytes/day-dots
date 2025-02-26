document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('daysContainer');
    const dayPopup = document.getElementById('dayPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');

    // Function to fetch and process data (assuming days.json)
    fetch('days.json')
        .then(response => response.json())
        .then(daysData => {
            generateDays(daysData);
        })
        .catch(error => {
            console.error('Error fetching days data:', error);
            generateDays({}); // Generate days without data if fetch fails
        });

    function generateDays(daysData) {
        const startDate = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year
        const endDate = new Date(); // Today
        const timeDiff = endDate.getTime() - startDate.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i <= dayDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateKey = formatDate(currentDate);
            const dayDetails = daysData[dateKey];

            const dayEntryElement = document.createElement('div'); // Container for each day entry
            dayEntryElement.classList.add('day-entry');

            if (dayDetails) {
                const dayTitleElement = document.createElement('div');
                dayTitleElement.classList.add('day-title');
                dayTitleElement.textContent = dayDetails.title;
                dayTitleElement.addEventListener('click', () => openPopup(dayDetails));
                dayEntryElement.appendChild(dayTitleElement); // Append title to entry
            } else {
                const dayPeriodElement = document.createElement('div');
                dayPeriodElement.classList.add('day-period');
                dayPeriodElement.textContent = '.'; // Period symbol
                dayEntryElement.appendChild(dayPeriodElement); // Append period to entry
            }
            daysContainer.appendChild(dayEntryElement); // Append day entry to container
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `<span class="math-inline">\{year\}\-</span>{month}-${day}`; //
