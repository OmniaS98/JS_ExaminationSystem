let form = document.getElementById('signUp');
let inputs = document.getElementsByTagName('input');
let fnameInp = document.getElementById('fname');
let fnameError = document.getElementById('fnameSpan');
let lnameInp = document.getElementById('lname');
let lnameError = document.getElementById('lnameSpan');
let emailInp = document.getElementById('email');
let emailError = document.getElementById('emailSpan');
let passInp = document.getElementById('password');
let passError = document.getElementById('pass');
let rePass = document.getElementById('re-password');
let rePassError = document.getElementById('re-pass');
let submitBtn = document.getElementById('submitBtn');
let errorSpan = document.getElementsByTagName('span');
let errorMsg = document.getElementsByClassName('signUp-error')[0];

let nameRegEx = /^[A-Za-z]+$/;
let emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
let passRegEx = /^.{8,}$/;


let validate = function() {
    let isValidate = true;
    for(let i = 0; i < inputs.length; i++)
    {
       
        if(inputs[i].value == "")
        {
            errorSpan[i].textContent = "*This field can not be empty."
            errorSpan[i].style.display = "block";
            isValidate = false;
        }
        else if(inputs[i].name == "fname" && (!nameRegEx.test(inputs[i].value)))
        {
            errorSpan[i].textContent = "*It should contains alphabetical characters only.";
            errorSpan[i].style.display = "block";
            isValidate = false;

        }
        else if(inputs[i].name == "lname" && (!nameRegEx.test(inputs[i].value))) {
            errorSpan[i].textContent = "*It should contains alphabetical characters only.";
            errorSpan[i].style.display = "block";
            isValidate = false;
        }
        else if(inputs[i].name == "email" && (!emailRegEx.test(inputs[i].value)))
        {   
            errorSpan[i].textContent = "Please enter a valid email address";
            errorSpan[i].style.display = "block";
            isValidate = false;
        }
        else if(inputs[i].name == "password" && (!passRegEx.test(inputs[i].value)))
        {
            errorSpan[i].textContent = "Password should be 8 characters or more";
            errorSpan[i].style.display = "block";
            isValidate = false;
        }
        else if (inputs[i].name == "reenter-password" && passInp.value != inputs[i].value)
        {
            errorSpan[i].textContent = "Password didn't match";
            errorSpan[i].style.display = "block";
            isValidate = false;
        }
        else {
            errorSpan[i].style.display = "none";
        }
    }
    return isValidate;

} 

// Save user data 

function saveUser() {

    let user = {
        fname: fnameInp.value,
        lname: lnameInp.value,
        email: emailInp.value,
        password: passInp.value
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
};



// Check if user exists in local storage
function checkUser(email) {
    let user = JSON.parse(localStorage.getItem('currentUser')) || null;
    return user.email === email;
}


// Function to save user in local storage
function saveUser() {
    let user = {
        fname: fnameInp.value,
        lname: lnameInp.value,
        email: emailInp.value,
        password: passInp.value
    };

    // Save the user to local storage
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Function to check if the current user's email matches the provided email
function checkUser(email) {
    let user = JSON.parse(localStorage.getItem('currentUser')) || null;
    return user && user.email === email;
}


function resetForm()
{
    for(let inp of inputs)
    {
        inp.value = "";
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = validate();
    if(isValid)
    { 
        if(checkUser(emailInp.value))  
        {
            errorMsg.style.display = "block";
            resetForm();
        }
        else {
            saveUser();
            window.location.replace("signIn.html");
        }
    }
} );


for(const inp of inputs)
    inp.addEventListener('input', function() {
        inp.nextElementSibling.style.display = "none";
}) 


let link = document.getElementsByClassName('log-link')[0];
link.addEventListener('click', function() {
    location.replace('signIn.html');
})