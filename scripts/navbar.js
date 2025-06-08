if(window.location.href.includes("index") || !window.location.href.includes(".html")) {
    document.querySelector(".navbar").innerHTML = `
    <div class='navbar_logo'>
        <a href="index.html" class="logo_link">
            <i class="fa-solid fa-money-bill-trend-up"></i>
            <span>MoneyMentor</span>
        </a>
    </div>
    <div class='navbar_links'>
        <a href='index.html' id = "homelink" class="navbar_link animated_underline">Home</a>
        <a href='simulator.html' class="navbar_link animated_underline">Simulator</a>
        <a href='contact.html' class="navbar_link animated_underline">Contact</a>
        <a href="login.html" class="navbar_link login_link">Login</a>
    </div>`
} else {
    document.querySelector(".navbar").innerHTML = `
    <div class='navbar_logo'>
        <a href="index.html" class="logo_link">
            <i class="fa-solid fa-money-bill-trend-up"></i>
            <span>MoneyMentor</span>
        </a>
    </div>
    <div class='navbar_links'>
        <a href='home.html' id = "homelink" class="navbar_link animated_underline">Home</a>
        <a href='simulator.html' class="navbar_link animated_underline">Simulator</a>
        <a href='contact.html' class="navbar_link animated_underline">Contact</a>
    </div>`
}

if(JSON.parse(localStorage.loggedIn) || localStorage.getItem("loggedIn") == null) {
    document.querySelector(".navbar").innerHTML = `
    <div class='navbar_logo'>
        <a href="index.html" class="logo_link">
            <i class="fa-solid fa-money-bill-trend-up"></i>
            <span>MoneyMentor</span>
        </a>
    </div>
    <div class='navbar_links'>
        <a href='home.html' id = "homelink" class="navbar_link animated_underline">Home</a>
        <a href='forums.html' class="navbar_link animated_underline">Forums</a>
        <a href='events.html' class="navbar_link animated_underline">Events</a>
        <a href='simulator.html' class="navbar_link animated_underline">Simulator</a>
        <a href='contact.html' class="navbar_link animated_underline">Contact</a>
        <button class="navbar_link signoutButton" id="signout-btn">Sign Out</button>
    </div>`

    $("#signout-btn").on("click", function() {
        localStorage.setItem(
            "loggedIn",
            JSON.stringify(false)
        );
        localStorage.removeItem("entity");
        firebase.auth().signOut().then(() => {
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    });
    
    $("#homelink").attr("href", "home.html");
} else {
    $("#homelink").attr("href", "index.html");
}

function setupNavbarToggle() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (!document.querySelector('.navbar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'navbar-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation');
        toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
        navbar.insertBefore(toggleBtn, navbar.firstChild);
    }

    const toggleBtn = document.querySelector('.navbar-toggle');
    const links = document.querySelector('.navbar_links');
    if (!toggleBtn || !links) return;

    toggleBtn.addEventListener('click', toggleMenu);
    toggleBtn.addEventListener('touchstart', toggleMenu);

    function toggleMenu(e) {
        e.preventDefault();
        links.classList.toggle('open');
    }

    links.querySelectorAll('a,button').forEach(el => {
        if (el.id !== "signout-btn") {
            el.addEventListener('click', function(e) {
                setTimeout(() => {
                    closeMenuIfMobile();
                }, 100);
            });

            el.addEventListener('touchstart', function(e) {
                setTimeout(() => {
                    closeMenuIfMobile();
                }, 100);
            });
        } else {
            el.addEventListener('click', closeMenuIfMobile);
            el.addEventListener('touchstart', closeMenuIfMobile);
        }
    });

    function closeMenuIfMobile() {
        if (window.innerWidth <= 800) {
            links.classList.remove('open');
        }
    }
}

setupNavbarToggle();

if(innerWidth > 800) {
    document.querySelector(".navbar-toggle").style.display = "none";
}