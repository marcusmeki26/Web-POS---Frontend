function updateTime(){
  const dateTimeCntr = document.getElementById("date-time-container");
  dateTimeCntr.textContent = ""; // Clears the DOM
  dateTimeCntr.innerHTML = 
  `
  <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.7984 3.6001V10.8001M14.3984 3.6001V10.8001" stroke="#3A6EA5" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M37.7984 21.6C37.7984 14.8117 37.7984 11.4176 35.6896 9.30878C33.5809 7.19995 30.1866 7.19995 23.3984 7.19995H19.7984C13.0102 7.19995 9.61611 7.19995 7.50726 9.30878C5.39844 11.4176 5.39844 14.8117 5.39844 21.6V25.2C5.39844 31.9881 5.39844 35.3824 7.50726 37.4911C9.61611 39.6 13.0102 39.6 19.7984 39.6" stroke="#3A6EA5" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.39844 18H37.7984" stroke="#3A6EA5" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32.8792 33.6619L30.5984 32.4V29.2802M37.7984 32.4C37.7984 36.3763 34.5748 39.6 30.5984 39.6C26.6221 39.6 23.3984 36.3763 23.3984 32.4C23.3984 28.4236 26.6221 25.2 30.5984 25.2C34.5748 25.2 37.7984 28.4236 37.7984 32.4Z" stroke="#3A6EA5" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  const now = new Date();
  const dayOfTheWeek = now.toLocaleDateString("en-US", {weekday: "long"});
  const monthName = now.toLocaleDateString("en-US", {month: "long"});

  const day = now.getDate();
  const year = now.getFullYear();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const displayDateTime = `${dayOfTheWeek}, ${day} ${monthName} ${year} at ${timeString}`;
  const spanDateTime = document.createElement("span");
  const classes = ["text-sm", "text-primaryColor"];
  spanDateTime.classList.add(...classes);

  spanDateTime.textContent = displayDateTime;
  dateTimeCntr.appendChild(spanDateTime);
}


export {updateTime};