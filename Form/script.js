const pwShowHide = document.querySelectorAll(".showHidePw"),
      pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");

// Show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                });
            } else {
                pwField.type = "password";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                });
            }
        });
    });
});

// Switch between signup and login forms
signUp.addEventListener("click", () => {
    document.querySelector(".container").classList.add("active");
});
login.addEventListener("click", () => {
    document.querySelector(".container").classList.remove("active");
});

// Handle signup form submission
function register() {
    var signupName = document.getElementById("signupName").value;
    var signupEmail = document.getElementById("signupEmail").value;
    var signupPassword = document.getElementById("signupPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;


    // Check if passwords match
    if (signupPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    
    if (localStorage.getItem(signupEmail)) {
        alert('Email already exists');
        return;
    }

    // Store email and password in localStorage
    if(!signupName && !signupEmail && !signupPassword && !confirmPassword){
        alert('Please fill all fields');
        return;
    }else{
          // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupEmail)) {
            alert('Invalid email address');
            return;
    }

        localStorage.setItem("username", signupEmail);
        localStorage.setItem("password", signupPassword);
    }
    alert("Registration successful");
    clearSignupForm();    
}


// Handle login authenticationss
function authenticate() {
    var storedUsername = localStorage.getItem("username");
    var storedPassword = localStorage.getItem("password");
    var username = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPass").value;
    
    
    // Check if entered credentials match stored credentials
    if (username === storedUsername && password === storedPassword) {
        alert("Login successful");
        window.location.href="../Frontend/main.html";
    } else if(username === '' || password === '') {
        alert("Please enter your credentials");
    }
    else {
        alert("Invalid credentials, Please register first");
    }
}

function clearSignupForm() {
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}
