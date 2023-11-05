const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");
  const addEventForm = document.querySelector(".add-event-form");
  const addEventButton = document.querySelector("#add-event-button");
  const eventTitleInput = document.querySelector("#event-title");
  const eventDateInput = document.querySelector("#event-date");
  const eventStartTimeInput = document.querySelector("#event-start-time");
  const eventEndTimeInput = document.querySelector("#event-end-time");
  const eventSectionTitle = document.getElementById("event-section-title");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// get current date
const date = new Date();

let events = {};

// get current month
let currentMonth = date.getMonth();

// get current year
let currentYear = date.getFullYear();

let selectedDate = new Date(currentYear, currentMonth, new Date().getDate(), 0, 0, 0, 0);

// function to render days
function renderCalendar() {
  // Get the first day of the current month
  const firstDay = new Date(currentYear, currentMonth, 1);

  // Calculate the starting day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const startDay = (firstDay.getDay() + 6) % 7; // Adjust for Monday as the first day of the week

  // Calculate the number of days in the previous month
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();

  // Calculate the number of days in the current month
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayDate = lastDay.getDate();

  // Calculate the number of days in the next month
  const nextDays = (7 - (startDay + lastDayDate) % 7) % 7;

  // Update current year and month in the header
  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  // Update days HTML
  let days = "";

  // Previous month days
  for (let x = startDay - 1; x >= 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x}</div>`;
  }

  // ...
// Current month days
for (let i = 1; i <= lastDayDate; i++) {
  const formattedDate = `${i}.${currentMonth + 1}.${currentYear}`;
  const dayHasEvents = events[formattedDate] && events[formattedDate].length > 0;

  if (
    i === new Date().getDate() &&
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    days += `<div class="day today ${dayHasEvents ? 'has-events' : ''}">${i}</div>`;
  } else {
    days += `<div class="day ${dayHasEvents ? 'has-events' : ''}">${i}</div>`;
  }
}

// Remove the "has-events" class from days that no longer have events
document.querySelectorAll('.day').forEach((day) => {
  const dayDate = day.innerText;
  const formattedDate = `${dayDate}.${currentMonth + 1}.${currentYear}`;
  if (!events[formattedDate]) {
    day.classList.remove('has-events');
  }
});
// ...


  // Next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next">${j}</div>`;
  }
  for (const date in events) {
    if (events.hasOwnProperty(date)) {
      displayEventsForToday(date);
    }
  }
  // Run this function with every calendar render
  hideTodayBtn();
  daysContainer.innerHTML = days;
}

renderCalendar();


nextBtn.addEventListener("click", () => {
  // increase current month by one
  currentMonth++;
  if (currentMonth > 11) {
    // if month gets greater that 11 make it 0 and increase year by one
    currentMonth = 0;
    currentYear++;
  }
  // rerender calendar
  renderCalendar();
});

// prev monyh btn
prevBtn.addEventListener("click", () => {
  // increase by one
  currentMonth--;
  // check if let than 0 then make it 11 and deacrease year
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

// go to today
todayBtn.addEventListener("click", () => {
  // set month and year to current
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  // rerender calendar
  renderCalendar();
});

// lets hide today btn if its already current month and vice versa

function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}
// Function to show the Add Event form
function showAddEventForm() {
  eventTitleInput.value = ""; // Clear event title input
  eventStartTimeInput.value = ""; // Clear event start time input
  eventEndTimeInput.value = ""; // Clear event end time input
  addEventForm.style.display = "block";
}


// Function to hide the Add Event form
function hideAddEventForm() {
  addEventForm.style.display = "none";
  eventTitleInput.value = "";
  eventDateInput.value = "";
}

document.getElementById("event-list").style.display = "none"; 

daysContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("day")) {
    const clickedDay = e.target.innerText;
    const selectedDate = new Date(currentYear, currentMonth, parseInt(clickedDay) + 1, 0, 0, 0, 0);
    const formattedDate = `${clickedDay}.${currentMonth + 1}.${currentYear}`;
    
    if (selectedDate > date && !e.target.classList.contains("prev") && !e.target.classList.contains("next")) {
      const dayClassList = e.target.classList;
      eventDateInput.value = formattedDate;
      showAddEventForm();
    } else {
      hideAddEventForm();
    }

    // Hide the "Events for Today" section by default
    document.getElementById("event-list").style.display = "none";
    
// Update the section title with the clicked day's date
eventSectionTitle.textContent = `Events for ${formattedDate}`;
    
    const eventsList = document.getElementById("events-for-selected-day");

    if (events[formattedDate]) {
      eventsList.innerHTML = "";
      events[formattedDate].forEach((event) => {
        const eventItem = document.createElement("li");
        eventItem.textContent = `${event.title} (${event.startTime} - ${event.endTime})`;

        // Create a delete button for each event
        const deleteButton = createDeleteButton(formattedDate, event);

        eventItem.appendChild(deleteButton);
        eventsList.appendChild(eventItem);
      });

      eventsList.style.display = "block"; // Show the event list
      document.getElementById("event-list").style.display = "block"; // Show the "Events for Today" section
    }
  } else {
    hideAddEventForm();
  }
});





// Function to save events to local storage
function saveEventsToLocalStorage() {
  localStorage.setItem('events', JSON.stringify(events));
}

function loadEventsFromLocalStorage() {
  const savedEvents = localStorage.getItem('events');
  if (savedEvents) {
    events = JSON.parse(savedEvents);
  }
}

window.addEventListener('load', () => {
  loadEventsFromLocalStorage();
  renderCalendar();
  clearEventList(); // Clear the event list on page load
});

function clearEventList() {
  const eventsList = document.getElementById("events-for-selected-day");
  eventsList.innerHTML = "";
  document.getElementById("event-list").style.display = "none";
}


// Function to clear events for a specific date
function clearEventsForDateFromLocalStorage(eventDate) {
  if (events[eventDate]) {
    delete events[eventDate];
    saveEventsToLocalStorage(); // Save the updated events to local storage
  }
}


// Function to create a "Delete" button for each event
function createDeleteButton(eventDate, event) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    // Remove the event from the events object
    deleteEvent(eventDate, event);
  });
  return deleteButton;
}

// Function to display events for a specific date
function displayEventsForToday(eventDate) {
  const eventsList = document.getElementById("events-for-selected-day");
  eventsList.innerHTML = "";

  if (events[eventDate]) {
    events[eventDate].forEach((event) => {
      const eventItem = document.createElement("li");
      eventItem.textContent = `${event.title} (${event.startTime} - ${event.endTime})`;

      // Create a delete button for each event
      const deleteButton = createDeleteButton(eventDate, event);
      // Update the title of the "Events for Today" section
      const formattedDate = eventDate.split('.').map(num => num.padStart(2, '0')).join('.'); // Format the date as dd.mm.yyyy
      document.querySelector('.event-list h2').innerHTML = `Events for ${formattedDate}`;
      eventItem.appendChild(deleteButton);
      eventsList.appendChild(eventItem);
    });
    eventsList.style.display = "block";
    document.getElementById("event-list").style.display = "block";
  } else {
    eventsList.style.display = "none";
    document.getElementById("event-list").style.display = "none";
  }
}



function deleteEvent(eventDate, eventToDelete) {
  if (events[eventDate]) {
    // Filter out the event to be deleted
    events[eventDate] = events[eventDate].filter((event) => event !== eventToDelete);

    // If there are no more events for this date, remove the date from the events object
    if (events[eventDate].length === 0) {
      delete events[eventDate];
    }

    // Save the updated events to local storage
    saveEventsToLocalStorage();

    // Update the UI to reflect the changes
    displayEventsForToday(eventDate);

    // Call renderCalendar to update the star icon immediately
    renderCalendar();

    // Hide the "Events for Today" section if there are no events left
    if (!events[eventDate]) {
      document.getElementById("event-list").style.display = "none";
    }
  }
}


// Function to update events and delete buttons for the selected day
function updateEventsForSelectedDay(selectedDate) {
  const formattedDate = formatDate(selectedDate);
  const eventsList = document.getElementById("events-for-selected-day");

  if (events[formattedDate]) {
    eventsList.innerHTML = "";
    events[formattedDate].forEach((event) => {
      const eventItem = document.createElement("li");
      eventItem.textContent = `${event.title} (${event.startTime} - ${event.endTime})`;

      // Create a delete button for each event
      const deleteButton = createDeleteButton(formattedDate, event);

      eventItem.appendChild(deleteButton);
      eventsList.appendChild(eventItem);
    });

    eventsList.style.display = "block";
    document.getElementById("event-list").style.display = "block";
  } else {
    eventsList.innerHTML = "";
    eventsList.style.display = "none";
    document.getElementById("event-list").style.display = "none";
  }
}







function addEventToLocalStorage(eventDate, newEvent) {
  if (events[eventDate]) {
    // Add the new event to the existing events array
    events[eventDate].push(newEvent);

    // Sort events based on start time
    events[eventDate].sort((a, b) => {
      const startTimeA = parseTime(a.startTime);
      const startTimeB = parseTime(b.startTime);
      return startTimeA - startTimeB;
    });
  } else {
    events[eventDate] = [newEvent];
  }

  // Save the updated events to local storage
  saveEventsToLocalStorage();

  // Update the UI immediately to show the event
  displayEventsForToday(eventDate);

  // Clear the input fields and hide the form
  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartTimeInput.value = "";
  eventEndTimeInput.value = "";
  hideAddEventForm();
}




addEventButton.addEventListener("click", () => {
  const eventTitle = eventTitleInput.value;
  const eventDateInputValue = eventDateInput.value;
  const eventStartTime = eventStartTimeInput.value;
  const eventEndTime = eventEndTimeInput.value;

  if (
    eventTitle.trim() === '' ||
    eventDateInputValue.trim() === '' ||
    eventStartTime.trim() === '' ||
    eventEndTime.trim() === ''
  ) {
    alert('Please enter event details.');
  } else {
    // Validate and parse event times
    const startTimeValid = validateTimeFormat(eventStartTime);
    const endTimeValid = validateTimeFormat(eventEndTime);

    if (startTimeValid && endTimeValid) {
      // Check if the start time is before the end time
      const startTime = parseTime(eventStartTime);
      const endTime = parseTime(eventEndTime);

      if (startTime < endTime) {
        const newEvent = {
          title: eventTitle,
          startTime: eventStartTime,
          endTime: eventEndTime,
        };

        // Add the event to the events object
        addEventToLocalStorage(eventDateInputValue, newEvent);

        // Update the UI immediately to show the event
        displayEventsForToday(eventDateInputValue);

        renderCalendar();

        // Clear the input fields and hide the form
        eventTitleInput.value = "";
        eventDateInput.value = "";
        eventStartTimeInput.value = "";
        eventEndTimeInput.value = "";
        hideAddEventForm();
        document.getElementById("event-list").style.display = "none";
      } else {
        alert('End time should be after the start time.');
      }
    } else {
      alert('Invalid time format. Please enter times in HH:MM format.');
    }
  }
});

// Function to clear events for a specific date
function clearEventsForDateFromLocalStorage(eventDate) {
  if (events[eventDate]) {
    delete events[eventDate];
    saveEventsToLocalStorage(); // Save the updated events to local storage
  }
}

// Function to validate time format (HH:MM)
function validateTimeFormat(time) {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Function to parse time to a Date object
function parseTime(time) {
  const [hours, minutes] = time.split(":");
  const eventTime = new Date();
  eventTime.setHours(parseInt(hours, 10));
  eventTime.setMinutes(parseInt(minutes, 10));
  eventTime.setSeconds(0);
  return eventTime;
}

// Function to close the Add Event form
function closeAddEventForm() {
  hideAddEventForm();
  hideEventsForTodaySection();
}

// Event listener for the close button
document.getElementById("close-button").addEventListener("click", closeAddEventForm);

function hideEventsForTodaySection() {
  document.getElementById("event-list").style.display = "none";
}

hideAddEventForm();
hideEventsForTodaySection();






