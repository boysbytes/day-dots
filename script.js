document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('daysContainer');
    const dayPopup = document.getElementById('dayPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');

    // Fetch and process data from days.json
    fetch('days.json')
        .then(response => response.json())
        .then(daysData => {
            generateDays(daysData);
        })
        .catch(error => {
            console.error('Error fetching days data:', error);
            // If the fetch fails, generateDays with an empty object
            generateDays({});
        });

        function generateDays(daysData) {
            let startDate, endDate;
            const dates = Object.keys(daysData);
            let previousMonth = null;
            let monthWrapper = null;
        
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
        
            const timeDiff = endDate.getTime() - startDate.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
            for (let i = 0; i <= dayDiff; i++) {
                const currentDate = new Date(startDate.getTime() + i * 86400000);
                const dateKey = formatDate(currentDate);
                const dayDetails = daysData[dateKey];
        
                const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        
                // Create a new month wrapper if a new month starts
                if (previousMonth !== currentMonth) {
                    previousMonth = currentMonth;
        
                    // Create a wrapper div for the month
                    monthWrapper = document.createElement('div');
                    monthWrapper.classList.add('month-wrapper');
                    daysContainer.appendChild(monthWrapper);
        
                    // Create the month label inside the wrapper
                    const monthLabel = document.createElement('div');
                    monthLabel.classList.add('month-label');
                    monthLabel.textContent = currentMonth;
                    monthWrapper.appendChild(monthLabel);
                }
        
                // Create the day element and append it to the current month wrapper
                const dayElement = document.createElement('div');
        
                if (dayDetails) {
                    dayElement.classList.add('day-title');
                    dayElement.textContent = dayDetails.title;
                    dayElement.addEventListener('click', () => openPopup(dateKey, dayDetails));
                } else {
                    dayElement.classList.add('day-period');
                    dayElement.textContent = '•';
        
                    const today = new Date();
                    if (currentDate.toDateString() === today.toDateString()) {
                        dayElement.classList.add('today');
                    } else if (currentDate > today) {
                        dayElement.classList.add('future');
                    } else {
                        dayElement.classList.add('past');
                    }
                }
        
                monthWrapper.appendChild(dayElement);
            }
        }
        

    // Format a Date object as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Open the popup with the details for a specific date
    function openPopup(dateKey, dayDetails) {
        popupTitle.textContent = dayDetails.title;
        popupContent.innerHTML = ''; // Clear previous content

        // Show a formatted date
        const dateElement = document.createElement('h3');
        const date = new Date(dateKey);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = formattedDate;
        popupContent.appendChild(dateElement);

        // Show the day's text content
        // const textContentElement = document.createElement('p');
        // textContentElement.textContent = dayDetails.content;
        // popupContent.appendChild(textContentElement);

        // Convert Markdown to HTML
        const textContentElement = document.createElement('div');
        textContentElement.innerHTML = marked.parse(dayDetails.content);
        popupContent.appendChild(textContentElement);


        // If there are images, add them
        if (dayDetails.images && Array.isArray(dayDetails.images)) {
            dayDetails.images.forEach(imageName => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${imageName}`;
                imgElement.style.maxWidth = '100%';
                imgElement.style.height = 'auto';
                popupContent.appendChild(imgElement);
            });
        }

        dayPopup.style.display = "block";
    }

    // Close the popup when clicking the close button
    closePopup.onclick = function() {
        dayPopup.style.display = "none";
    };

    // Close the popup if user clicks outside the popup content
    window.onclick = function(event) {
        if (event.target === dayPopup) {
            dayPopup.style.display = "none";
        }
    };
});
