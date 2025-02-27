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
            // Determine start and end dates as before...
            const timeDiff = endDate.getTime() - startDate.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
            for (let i = 0; i <= dayDiff; i++) {
                const currentDate = new Date(startDate.getTime() + i * 86400000);
                const dateKey = formatDate(currentDate);
                const dayDetails = daysData[dateKey];
        
                if (dayDetails) {
                    // Existing logic for days with content...
                    const dayTitleElement = document.createElement('div');
                    dayTitleElement.classList.add('day-title');
                    dayTitleElement.textContent = dayDetails.title;
                    dayTitleElement.addEventListener('click', () => openPopup(dateKey, dayDetails));
                    daysContainer.appendChild(dayTitleElement);
                } else {
                    // Create the period element for days without content
                    const dayPeriodElement = document.createElement('div');
                    dayPeriodElement.classList.add('day-period');
                    dayPeriodElement.textContent = '.';
        
                    // If the date is in the future, add a "future" class
                    if (currentDate > new Date()) {
                        dayPeriodElement.classList.add('future');
                    }
        
                    daysContainer.appendChild(dayPeriodElement);
                }
            }
        }
        

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD format
    }

    function openPopup(dateKey, dayDetails) {
        popupTitle.textContent = dayDetails.title;
        popupContent.innerHTML = ''; // Clear previous content

        const dateElement = document.createElement('h3');
        const date = new Date(dateKey);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        dateElement.textContent = formattedDate;
        popupContent.appendChild(dateElement);

        const textContentElement = document.createElement('p');
        textContentElement.textContent = dayDetails.content;
        popupContent.appendChild(textContentElement);

        if (dayDetails.images && Array.isArray(dayDetails.images)) {
            dayDetails.images.forEach(imageName => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${imageName}`;
                imgElement.style.maxWidth = '600px';
                imgElement.style.height = 'auto';
                popupContent.appendChild(imgElement);
            });
        }

        dayPopup.style.display = "block";
    }

    closePopup.onclick = function() {
        dayPopup.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == dayPopup) {
            dayPopup.style.display = "none";
        }
    };
});
