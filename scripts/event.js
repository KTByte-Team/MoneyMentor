const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventID = urlParams.get('id');

let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

let thisEvent;

var data = firebase.database().ref('events/' + eventID);
data.once('value', (snapshot) => {
    thisEvent = snapshot.val();

    document.querySelector("title").innerHTML = forceString(thisEvent.title) + " | MoneyMentor";

    $(".eventTitleMain").html(forceString(thisEvent.title));
    $(".eventPostedAuthor").html("<i class=\"fa-regular fa-circle-user\"></i> " + forceString(thisEvent.organizer.name));
    $(".eventPostedDate").html("<i class=\"fa-regular fa-calendar\"></i> " + formatOnlyDateLong(thisEvent.date));
    $(".eventPostedLocation").html("<i class=\"fa-solid fa-location-dot\"></i> " + forceString(thisEvent.location));

    $(".eventContentDescription").html(forceString(thisEvent.description));
    if(thisEvent.link == "N/A" || thisEvent.link == "" || thisEvent.link == null) {
        $(".eventContentLink").html("<i class=\"fa-solid fa-link\"></i>&nbsp;No link provided");
    } else if (thisEvent.link.startsWith("https://") || thisEvent.link.startsWith("http://")) {
        $(".eventContentLink").html(`<a class = "eventContentLink" href="${forceString(thisEvent.link)}" target="_blank">
            <i class="fa-solid fa-link"></i>&nbsp;${forceString(thisEvent.link)} 
            </a>`);
    } else {
        thisEvent.link = "https://" + thisEvent.link;
        $(".eventContentLink").html(`<a class = "eventContentLink" href="${forceString(thisEvent.link)}" target="_blank">
            <i class="fa-solid fa-link"></i>&nbsp;${forceString(thisEvent.link)} 
            </a>`);
    }

    let interestedUsers = thisEvent.interestedUsers || [];
    let interestCount = interestedUsers.length;
    $("#interest").html(`Interested: ${interestCount}`);
    let currentUser = JSON.parse(localStorage.getItem("entity"));
    let isInterested = interestedUsers.includes(currentUser.id);
    let interestButton = document.querySelector('.eventContentInterestButton');
    isInterested ? interestButton.querySelector(".event-bell-icon").classList.replace('fa-regular', 'fa-solid') : interestButton.querySelector('.event-bell-icon').classList.replace('fa-solid', 'fa-regular');
    interestButton.addEventListener('click', function() {
        let curEvent = firebase.database().ref('events/' + eventID);
        curEvent.once('value', (snapshot) => {
            let curEvent = snapshot.val();
            let interestedUsers = curEvent.interestedUsers || [];
            if (!interestedUsers.includes(currentUser.id)) {
                interestedUsers.push(currentUser.id);
                firebase.database().ref('events/' + eventID + '/interestedUsers').set(interestedUsers);
                this.querySelector('.event-bell-icon').classList.replace('fa-regular', 'fa-solid');
                document.getElementById('interest').innerText = `Interested: ${interestedUsers.length}`;
            } else {
                interestedUsers = interestedUsers.filter(userId => userId !== currentUser.id);
                firebase.database().ref('events/' + eventID + '/interestedUsers').set(interestedUsers);
                this.querySelector('.event-bell-icon').classList.replace('fa-solid', 'fa-regular');
                document.getElementById('interest').innerText = `Interested: ${interestedUsers.length}`;
            }
        });
    });

    window.title = forceString(thisEvent.title) + " | MoneyMentor";
});
