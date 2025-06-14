if (JSON.parse(localStorage.getItem("loggedIn"))) {
    window.location.href = "home.html"
}

var cont;

var emailError = document.querySelector(".errorEmail");
var passwordError = document.querySelector(".errorPassword");

function emailErrorShow(value) {
    emailError.style.display = "block";
    emailError.textContent = value;
}

function passwordErrorShow(value) {
    passwordError.style.display = "block";
    passwordError.textContent = value;
}

var loginBtn = document.querySelector(".loginButton");

loginBtn.addEventListener("click", function() { loginFunction() });


document.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        loginFunction();
    }
});

function loginFunction() {
    emailError.style.display = "none";
    passwordError.style.display = "none";

    if (document.querySelector(".loginCredentialEmail").value.length != 0) {
        cont = true;
    } else {
        cont = false;

        emailErrorShow("Please Enter Email");
    }

    if (document.querySelector(".loginCredentialPassword").value.length != 0) {
        cont = true;
    } else {
        cont = false;

        passwordErrorShow("Please Enter Password");
    }

    if (cont && document.querySelector(".loginCredentialPassword").value.length != 0 && document.querySelector(".loginCredentialEmail").value.length != 0) {
        if (document.querySelector(".loginCredentialEmail").value.split('@').length - 1 == 1 && document.querySelector(".loginCredentialEmail").value.split('@')[1].split(".").length - 1 == 1) {
            validate();
        } else {
            cont = false;

            emailErrorShow("Please Enter a Valid Email")
        }
    }
};

function validate() {
    signInWithEmailPassword();
}

function signInWithEmailPassword() {
    var email = document.querySelector(".loginCredentialEmail").value;
    var password = document.querySelector(".loginCredentialPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;

        console.log(user);

        var userName = user.email.split("@")[0];

        var entity = {
            id: user.uid,
            name: userName,
            email: user.email,
            emailVerified: user.emailVerified,
        }

        const userRef = firebase.database().ref('users/' + user.uid);

        userRef.set({
            id: user.uid,
            name: userName,
            email: user.email,
        }).then(() => {
            localStorage.setItem("entity", JSON.stringify(entity));
            localStorage.setItem("loggedIn", JSON.stringify(true));
            localStorage.setItem("rememberMe", JSON.stringify(document.getElementById("rem").checked));

            window.setTimeout(function () {
                window.location.href = "home.html";
            }, 500);
        }).catch(error => {
            console.error("Error saving user data:", error);
        });
    }).catch((error) => {
        var errorObj = JSON.parse(error.message);
        var errorMessage = errorObj.error.message;

        passwordErrorShow(errorMessage);
    });
}