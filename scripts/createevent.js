let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

var data = firebase.database().ref('events/');
data.once('value', (snapshot) => {
    thisEvent = snapshot.val();
});

function createEvent() {
    let eventTitle = forceString(document.getElementById("eventTitle").value.trim());
    let eventDate = document.getElementById("eventDate").value.trim();
    let eventLocation = forceString(document.getElementById("eventLocation").value.trim());
    let eventLink = forceString(document.getElementById("eventLink").value.trim());
    let eventDescription = forceString(document.getElementById("eventContent").value.trim());
    
    let thisEvent = new Event(eventTitle, "General");

    let linkVerification = eventLink.match(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- .\/?%&=]*)?$/);
    
    if(eventTitle === "" || eventDescription === "" || eventDate === "" || eventLocation === "") {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Please fill in all fields.";
        return;
    } else if(eventTitle.length < 10) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Event title must be at least 10 characters.";
        return;
    } else if(eventDescription.length < 25) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Event content must be at least 25 characters.";
        return;
    } else if(eventLocation.length < 5) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Please enter a valid location.";
        return;
    } else if(!validateDate(document.getElementById("eventDate"))) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Please enter a date in the future.";
        return;
    } else if(eventLink.length > 0 && !linkVerification) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Please enter a valid link.";
        return;
    }

    let eventObj = new Event(eventTitle, eventDescription, eventDate, eventLocation, JSON.parse(localStorage.getItem("entity")), eventLink === "" ? "N/A" : eventLink);

    firebase.database().ref('events/' + thisEvent.id).set({
        title: eventObj.title,
        description: eventObj.description,
        date: eventObj.date,
        datePosted: eventObj.datePosted,
        location: eventObj.location,
        organizer: eventObj.organizer,
        numInterested: eventObj.numInterested,
        link: eventObj.link,
        id: eventObj.id,
    }).then(() => {
        console.log("Event created successfully.");
        window.location.href = "event.html?id=" + thisEvent.id;
    }).catch((error) => {
        console.error("Error creating event:", error);
    });
}

$("#createEventSubmit").on("click", function() {
    createEvent();
});

function validateDate(x) {
    let entered = new Date(x.value);
    let today = new Date();
    if(entered > today) {
        return true;
    } else{
        return false;
    }
}