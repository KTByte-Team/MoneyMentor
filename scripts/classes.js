class Event {
    constructor(title, description, date, location, organizer, link) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.datePosted = Date.now();
        this.location = location;
        this.organizer = organizer;
        this.numInterested = 0;
        this.link = link;
        this.id = this.generateID();
    }

    generateID() {
        let hashedTitle = window.btoa(this.title);
        let id = hashedTitle.replace(/=/g, "");

        let sum = 0;

        let dateArr = this.datePosted.toString().split("");
        for (let i = 0; i < dateArr.length; i++) {
            sum += parseInt(dateArr[i]);
        }

        return id + sum.toString();
    }
}

class Forum {
    constructor(title, group) {
        this.title = title;
        this.group = group;
        this.views = 0;
        this.replies = 0;
        this.posts = [];
        this.date = Date.now();
        this.id = this.generateID();
    }

    generateID() {
        let hashedTitle = window.btoa(this.title);
        let id = hashedTitle.replace(/=/g, "");

        let sum = 0;

        let dateArr = this.date.toString().split("");
        for (let i = 0; i < dateArr.length; i++) {
            sum += parseInt(dateArr[i]);
        }

        return id + sum.toString();
    }
}

class ForumPost {
    constructor(content, author, reactions) {
        this.content = content;
        this.author = author;
        this.reactions = reactions;
        this.date = Date.now();

        this.id = this.generateID();
    }

    generateID() {
        let hashedTitle = window.btoa(this.content.slice(0, 20));
        let id = hashedTitle.replace(/=/g, "");

        let sum = 0;

        let dateArr = this.date.toString().split("");
        for (let i = 0; i < dateArr.length; i++) {
            sum += parseInt(dateArr[i]);
        }

        let authorArr = this.author.split("");
        for (let i = 0; i < authorArr.length; i++) {
            sum += authorArr[i].charCodeAt(0);
        }

        return id + sum.toString();
    }
}

const reactions = {
    1: {
        name: "Thumbs Up",
        icon: `<i class="fa-regular fa-thumbs-up"></i>`
    },
    2: {
        name: "Heart",
        icon: `<i class="fa-regular fa-heart"></i>`
    },
    3: {
        name: "Surprise",
        icon: `<i class="fa-regular fa-face-surprise"></i>`
    },
    4: {
        name: "Smile",
        icon: `<i class="fa-regular fa-face-smile-beam"></i>`
    },
    5: {
        name: "Laugh",
        icon: `<i class="fa-regular fa-face-grin-squint-tears"></i>`
    }
}

class Reaction {
    constructor(type, postID, userID) {
        this.type = type;
        this.postID = postID;
        this.userID = userID;
        this.date = Date.now();
    }
}

function formatDate(date) {
    const d = new Date(date);
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    return d.toLocaleDateString("en-GB") + ", " + hours % 12 + ":" + minutes + " " + ampm;
}

function formatOnlyDate(date) {
    const d = new Date(date);

    return d.toLocaleDateString("en-GB");
}

function formatTimestamp(date) {
    const d = new Date(date);

    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const time = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();

    return `${weekday}, ${time}`;
}

function formatDateLongOld(timestamp) {
    const date = new Date(timestamp);

    const getOrdinal = (day) => {
        if (day % 10 === 1 && day !== 11) return 'st';
        if (day % 10 === 2 && day !== 12) return 'nd';
        if (day % 10 === 3 && day !== 13) return 'rd';
        return 'th';
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth}${getOrdinal(dayOfMonth)} ${month}, ${year}`;
}

function formatDateLong(timestamp) {
    const date = new Date(timestamp);

    const getOrdinal = (day) => {
        if (day % 10 === 1 && day !== 11) return 'st';
        if (day % 10 === 2 && day !== 12) return 'nd';
        if (day % 10 === 3 && day !== 13) return 'rd';
        return 'th';
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${adjustedHours}:${formattedMinutes} ${period}`;
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const time = formatTime(hours, minutes);

    return `${dayOfWeek} ${dayOfMonth}${getOrdinal(dayOfMonth)} ${month} ${year}, ${time}`;
}

function formatOnlyDateLong(timestamp) {
    const date = new Date(timestamp);

    const getOrdinal = (day) => {
        if (day % 10 === 1 && day !== 11) return 'st';
        if (day % 10 === 2 && day !== 12) return 'nd';
        if (day % 10 === 3 && day !== 13) return 'rd';
        return 'th';
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek} ${dayOfMonth}${getOrdinal(dayOfMonth)} ${month} ${year}`;
}

function formatDateShort(timestamp) {
    const inputDate = new Date(timestamp);
    const now = new Date();

    const differenceInDays = Math.floor((now - inputDate) / (24 * 60 * 60 * 1000));

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${adjustedHours}:${formattedMinutes} ${period}`;
    };

    const formatAsDayAndTime = () => {
        const dayOfWeek = days[inputDate.getDay()];
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const time = formatTime(hours, minutes);
        return `${dayOfWeek}, ${time}`;
    };

    const formatAsLocaleDateAndTime = () => {
        const localeDate = inputDate.toLocaleDateString();
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const time = formatTime(hours, minutes);
        return `${localeDate} ${time}`;
    };

    if (differenceInDays >= 0 && differenceInDays < 7) {
        return formatAsDayAndTime();
    }

    return formatAsLocaleDateAndTime();
}

// Those who HTML Inject: 💀
function forceString(str) {
    if (typeof str !== 'string') {
        return String(str);
    }
    return str;
}