// Wait for DOM to load before querying elements
$(document).ready(function() {
    if (JSON.parse(localStorage.getItem("loggedIn"))) {
        window.location.href = "home.html";
    }

    var cont;

    var emailError = document.querySelector(".errorEmail");
    var passwordError = document.querySelector(".errorPassword");
    var passwordError2 = document.querySelector(".errorPassword2");

    function emailErrorShow(value) {
        emailError.style.display = "block";
        emailError.textContent = value;
    }

    function passwordErrorShow(value) {
        passwordError.style.display = "block";
        passwordError.textContent = value;
    }

    function passwordErrorShow2(value) {
        passwordError2.style.display = "block";
        passwordError2.textContent = value;
    }

    var signupBtn = document.querySelector(".signupButton");
    if (signupBtn) {
        signupBtn.addEventListener("click", function() { signupFunction(); });
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === 'Enter') {
            signupFunction();
        }
    });

    function signupFunction () {
        emailError.style.display = "none";
        passwordError.style.display = "none";
        passwordError2.style.display = "none";

        var emailVal = document.querySelector(".signupCredentialEmail").value;
        var passVal = document.querySelector(".signupCredentialPassword").value;
        var pass2Val = document.querySelector(".signupCredentialPassword2").value;

        cont = true;
        if (emailVal.length === 0) {
            cont = false;
            emailErrorShow("Please Enter Email");
        }
        if (passVal.length === 0) {
            cont = false;
            passwordErrorShow("Please Enter Password");
        }
        if (pass2Val.length === 0) {
            cont = false;
            passwordErrorShow2("Please Confirm Password");
        }

        if (cont) {
            if (emailVal.split('@').length - 1 === 1 && emailVal.split('@')[1].split(".").length - 1 >= 1) {
                validate();
            } else {
                emailErrorShow("Please Enter a Valid Email");
            }
        }
    }

    function validate() {
        var email2 = document.querySelector(".signupCredentialEmail");
        var password2 = document.querySelector(".signupCredentialPassword");
        var password3 = document.querySelector(".signupCredentialPassword2");

        if (password2.value.length >= 8 && !(password2.value.indexOf(" ") >= 0)) {
            if (password3.value === password2.value) {
                var email = email2.value;
                var password = password2.value;
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        var user = userCredential.user;
                        var userName = user.email.split("@")[0];
                        var entity = {
                            id: user.uid,
                            name: userName,
                            email: user.email,
                            emailVerified: user.emailVerified,
                        }
                        firebase.database().ref('users/' + user.uid).set({
                            id: user.uid,
                            name: userName,
                            email: user.email,
                        });
                        localStorage.setItem("entity", JSON.stringify(entity));
                        localStorage.setItem("loggedIn", JSON.stringify(true));
                        window.setTimeout(function () {
                            window.location.href = "home.html";
                        }, 500);
                    })
                    .catch((error) => {
                        var errorMessage = error.message;
                        passwordErrorShow2(errorMessage);
                    });
            } else {
                passwordErrorShow2("Passwords do Not Match");
            }
        } else {
            passwordErrorShow("Please Enter a Valid Password (min 8 chars, no spaces)");
        }
    }
});
