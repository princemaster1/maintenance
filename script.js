var notificationVisible = true;
 var socket = io();

 socket.on('maintenanceStatus', function (status) {
   if (status.active) {
     setWebBlockerStatus(status.startTime, status.stopTime);
   }
 });

 function toggleNotification() {
   var notificationContainer = document.getElementById("notification-container");
   notificationVisible = !notificationVisible;

   if (notificationVisible) {
     notificationContainer.style.display = "block";
   } else {
     notificationContainer.style.display = "none";
   }
 }

 function closeNotification() {
   var notificationContainer = document.getElementById("notification-container");
   notificationContainer.style.display = "none";
   notificationVisible = true;
 }

 var blockStartTime = null;
 var blockStopTime = null;

 var webBlocker = document.querySelector('.blockerbody');
 var isWebBlocked = true;
 var showDetails = false;

 var savedStartTime = localStorage.getItem('blockStartTime');
 var savedStopTime = localStorage.getItem('blockStopTime');
 if (savedStartTime && savedStopTime) {
   document.getElementById('start-time-input').value = savedStartTime;
   document.getElementById('stop-time-input').value = savedStopTime;
   setWebBlockerStatus(new Date(savedStartTime).getTime(), new Date(savedStopTime).getTime());
 }

 function toggleWebBlocker() {
   if (isWebBlocked) {
     webBlocker.style.display = 'flex';
     document.body.style.overflow = 'hidden';
   } else {
     webBlocker.style.display = 'none';
     document.body.style.overflow = 'auto';
   }
 }

 function setWebBlockerStatus(start, stop) {
   blockStartTime = start;
   blockStopTime = stop;
   var currentTime = new Date().getTime();

   if (currentTime >= blockStartTime && currentTime <= blockStopTime) {
     isWebBlocked = true;
   } else {
     isWebBlocked = false;
   }
   toggleWebBlocker();
 }

 function toggleMaintenanceDetails() {
   showDetails = !showDetails;
   var maintenanceDetails = document.getElementById('maintenance-details');
   var toggleButton = document.getElementById('toggle-details');
   var maintenanceStartTime = document.getElementById('maintenance-start-time');
   var maintenanceStopTime = document.getElementById('maintenance-end-time');

   if (showDetails) {
     maintenanceDetails.classList.remove('hidden');
     toggleButton.textContent = 'Hide Maintenance Details';
     if (blockStartTime !== null) {
       var blockStartString = new Date(blockStartTime).toLocaleString();
       maintenanceStartTime.innerText = '' + blockStartString;
     }

     if (blockStopTime !== null) {
       var blockStopString = new Date(blockStopTime).toLocaleString();
       maintenanceStopTime.innerText = '' + blockStopString;
     }
   } else {
     maintenanceDetails.classList.add('hidden');
     toggleButton.textContent = 'Maintenance Details';
   }
 }

 document.getElementById('set-time-button').addEventListener('click', function () {
   var startDateTime = new Date(document.getElementById('start-time-input').value).getTime();
   var stopDateTime = new Date(document.getElementById('stop-time-input').value).getTime();
   setWebBlockerStatus(startDateTime, stopDateTime);

   localStorage.setItem('blockStartTime', document.getElementById('start-time-input').value);
   localStorage.setItem('blockStopTime', document.getElementById('stop-time-input').value);

   // Emit update to the server
   socket.emit('updateMaintenanceStatus', {
     active: isWebBlocked,
     startTime: blockStartTime,
     stopTime: blockStopTime,
   });
 });

 document.getElementById('show-schedule-button').addEventListener('click', function () {
   if (blockStartTime !== null && blockStopTime !== null) {
     var blockStartString = new Date(blockStartTime).toLocaleString();
     var blockStopString = new Date(blockStopTime).toLocaleString();
     alert('The web blocker is scheduled from ' + blockStartString + ' to ' + blockStopString);
   } else if ((blockStartTime && blockStopTime) === null) {
     alert('No active schedule');
   } else {
     alert('No schedule is set');
   }
 });

 document.getElementById('toggle-details').addEventListener('click', toggleMaintenanceDetails);

 var pin = "TVRrMk1qRTVNVEk9Cg==";
 var isPanelVisible = false;

 document.getElementById('help-button').addEventListener('click', function () {
   var enteredPin = prompt("Enter PIN to access the developer's control panel:");
   if (enteredPin === prince(pin)) {
     toggleControlPanel();
     document.getElementById('help-button').style.display = 'none';
     document.getElementById('notification-p').style.display = 'none';
   } else if (enteredPin === "") {
     alert("Please enter the required PIN to access the control panel.");
   } else if (enteredPin === null) {
     alert("Bye👋!");
   } else {
     alert("Invalid PIN. Access denied.");
   }
 });

 function toggleControlPanel() {
   var controlPanel = document.querySelector('.control-panel');
   isPanelVisible = !isPanelVisible;
   if (isPanelVisible) {
     controlPanel.classList.remove('hidden');
   } else {
     controlPanel.classList.add('hidden');
   }
 }

 function prince(princeMaster) {
   var initial = atob(princeMaster);
   var original = atob(initial);
   return original;
 }