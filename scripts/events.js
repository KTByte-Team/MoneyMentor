let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

let eventListContainer = document.querySelector('.event-list');

function loadEvents() {
    var data = firebase.database().ref('events/');
    data.once('value', (snapshot) => {
        let val = snapshot.val();
        let keys = Object.keys(val);
        let allEvents = [];

        for(let i = 0; i < keys.length; i++) {
            let curEvent = val[keys[i]];
            curEvent.id = keys[i];
            allEvents.push(curEvent);
        }

        allEvents.sort((a, b) => {
            return b.date - a.date;
        });

        let currentUser = JSON.parse(localStorage.getItem("entity"));
        
        eventListContainer.innerHTML = '';
        allEvents.forEach((event, index) => {
            eventListContainer.innerHTML += makeHTML(users, event, index, currentUser);
        });

        let eventButtons = document.querySelectorAll('.event-button');
        for (let i = 0; i < eventButtons.length; i++) {
            eventButtons[i].addEventListener('click', function() {
                let eventId = allEvents[i].id;
                let thisEvent = firebase.database().ref('events/' + eventId);
                thisEvent.once('value', (snapshot) => {
                    let curEvent = snapshot.val();
                    let interestedUsers = curEvent.interestedUsers || [];
                    if (!interestedUsers.includes(currentUser.id)) {
                        interestedUsers.push(currentUser.id);
                        firebase.database().ref('events/' + eventId + '/interestedUsers').set(interestedUsers);
                        this.querySelector('.event-bell-icon').classList.replace('fa-regular', 'fa-solid');
                        document.getElementById('interest' + i).innerText = `Interested: ${interestedUsers.length}`;
                    } else {
                        interestedUsers = interestedUsers.filter(userId => userId !== currentUser.id);
                        firebase.database().ref('events/' + eventId + '/interestedUsers').set(interestedUsers);
                        this.querySelector('.event-bell-icon').classList.replace('fa-solid', 'fa-regular');
                        document.getElementById('interest' + i).innerText = `Interested: ${interestedUsers.length}`;
                    }
                });
            });
        }
    });
}

loadEvents();

function makeHTML(users, eventObj, index, currentUser) {
    const interestedUsers = eventObj.interestedUsers || [];
    const isInterested = interestedUsers.includes(currentUser.id);
    const interestCount = interestedUsers.length;
    
    return `
    <div class="event">
        <div class="event-left">
            <a href="event.html?id=${eventObj.id}" class="event-title">${forceString(eventObj.title)}</a>
            <br>
            <span class="event-date">${formatOnlyDateLong(eventObj.date)}</span>
            <br>
            <span class="event-location">Location: ${forceString(eventObj.location)}</span>
            <br>
            <span class="event-organizer">Organizer: ${forceString(eventObj.organizer.name)}</span>
        </div>
        <div class="event-middle">
            <span class="event-interest" id="interest${index}">Interested: ${interestCount}</span>
            <br>
            <span class="event-posted">Posted: ${formatOnlyDate(eventObj.datePosted)}</span>
        </div>
        <div class="event-right">
            <button class="event-button" id="${eventObj.id}">
            <i class="fa-${isInterested ? 'solid' : 'regular'} fa-bell event-bell-icon"></i> I'm Interested 
            </button>
        </div>
    </div>
`
}

// let newEvent = new Event("Example Event", "This is a description of the example event.", Date.now(), "123 Example St, City, Country", JSON.parse(localStorage.entity), "https://example.com");
// firebase.database().ref('events/' + newEvent.id).set(newEvent);