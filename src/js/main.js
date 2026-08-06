// Adding current date & time
// function updateTime(){
//   const dateTimeCntr = document.getElementById("date-time-container");
//   const now = new Date();
//   const dayOfTheWeek = now.toLocaleDateString("en-US", {weekday: "long"});
//   const monthName = now.toLocaleDateString("en-US", {month: "long"});

//   const day = now.getDate();
//   const year = now.getFullYear();
//   const timeString = now.toLocaleTimeString("en-US", {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });

//   const displayDateTime = `${dayOfTheWeek}, ${day} ${monthName} ${year} at ${timeString}`;
//   const spanDateTime = document.createElement("span");
//   spanDateTime.textContent = displayDateTime;
//   dateTimeCntr.appendChild(spanDateTime);
// }
import { updateTime } from './datefunction';

updateTime();

setInterval(updateTime, 1000);