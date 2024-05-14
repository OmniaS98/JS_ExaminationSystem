let signInForm = document.getElementById('signIn');
let sEmail = document.getElementById('signIn-email');
let sPass = document.getElementById('signIn-pass');
let spans = document.querySelectorAll('#signIn span');
let inps = document.querySelectorAll('#signIn input');
let errorMsg = document.getElementsByClassName('signIn-error')[0];
let emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if(validate()) {
            login(sEmail.value, sPass.value);
        }

}) 


let validate = function(e) {
    let isValidate = true;
    for(let i = 0; i < inps.length; i++)
    {
        if(inps[i].value === "")
        {
            spans[i].textContent = "*This field can not be empty."
            spans[i].style.display = "block";
            isValidate = false;
        }
        else if(inps[i].name == "email" && (!emailRegEx.test(inps[i].value)))
        {   
            spans[i].textContent = "Please enter a valid email address";
            spans[i].style.display = "block";
            isValidate = false;
        }
        else {
            spans[i].style.display = "none";
        }
    }
    return isValidate;

} 

// ///////////////////////////////////////////////

function login(email, password)
{
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user.email === email && user.password === password)
    {
        window.location.replace("exam.html");
    }
    else {
        errorMsg.style.display = "block";
        sEmail.value = "";
        sPass.value = "";
    }
}


sEmail.addEventListener('input', function() {
    errorMsg.style.display = "none";
})

sPass.addEventListener('input', function() {
    errorMsg.style.display = "none";
})
    