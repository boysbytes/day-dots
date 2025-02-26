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
        // Determine start and end dates from daysData keys
        const dates = Object.keys(daysData);
        if (dates.length === 0) {
            return; // No data to display
        }

        const sortedDates = dates.sort();
        const startDate = new Date(sortedDates[0]);
        const endDate = new Date(sortedDates[sortedDates.length - 1]);

        // Ensure the range includes at least the current date if later than data dates
        const today = new Date();
        if (endDate < today) {
            endDate = today;
        }


        const timeDiff = endDate.getTime() - startDate.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i <= dayDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateKey = formatDate(currentDate);
            const dayDetails = daysData[dateKey];

            if (dayDetails) {
                const dayTitleElement = document.createElement('div');
                dayTitleElement.classList.add('day-title');
                dayTitleElement.textContent = dayDetails.title;
                dayTitleElement.addEventListener('click', (event) => openPopup(dateKey, dayDetails)); // Pass dateKey to openPopup
                daysContainer.appendChild(dayTitleElement);
            } else {
                const dayPeriodElement = document.createElement('div');
                dayPeriodElement.classList.add('day-period');
                dayPeriodElement.textContent = '.'; // Period symbol
                daysContainer.appendChild(dayPeriodElement);
            }
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; //YYYY-MM-DD format
    }

    function openPopup(dateKey, dayDetails) { // Accept dateKey as argument
        popupTitle.textContent = dayDetails.title;
        popupContent.innerHTML = ''; // Clear previous content

        const dateElement = document.createElement('h3'); // Or <p>, <h2>, etc.
        const date = new Date(dateKey); // Create Date object from dateKey
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // Format date
        dateElement.textContent = formattedDate; // Display the formatted date
        popupContent.appendChild(dateElement);


        const textContentElement = document.createElement('p');
        textContentElement.textContent = dayDetails.content;
        popupContent.appendChild(textContentElement);

        if (dayDetails.images && Array.isArray(dayDetails.images)) {
            dayDetails.images.forEach(imageName => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${imageName}`; // Path to images folder
                imgElement.style.maxWidth = '600px'; // Set max-width to 600px
                imgElement.style.height = 'auto';
                popupContent.appendChild(imgElement);
            });
        }

        dayPopup.style.display = "block";
    }

    closePopup.onclick = function() {
        dayPopup.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == dayPopup) {
            dayPopup.style.display = "none";
        }
    }
});