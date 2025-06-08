if(localStorage.getItem("loggedIn") == null) {
    localStorage.setItem("loggedIn", JSON.stringify(false));
}

if(!JSON.parse(localStorage.loggedIn)) {
    if(window.location.href.includes('forum') ||
        window.location.href.includes('home')) {
        window.location.href = "login.html";
    }
}