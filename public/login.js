// Variables
const togglePassword = document.querySelector('#toggle-password');
const password = document.querySelector('#password');
const form = document.querySelector('#myForm'); // Ensure the correct selector is used
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');
const wrongEmailOrPassword = document.querySelector('.error.message');

// Event listener to toggle password visibility
togglePassword.addEventListener('click', () => {
    const inputType = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', inputType);
    togglePassword.classList.toggle('bxs-hide');
});



// Event listener for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    // Reset errors every time the submit button is pressed
    emailError.textContent = "";
    passwordError.textContent = "";
    wrongEmailOrPassword.textContent = "";

    // Get the values from the form
    const email = form.email.value;
    const passwordValue = form.Password.value;
    const pageType = 'Login'; 
    const values = { email, passwordValue, pageType }; 

    if (values.email.includes('@')) {


    // if password field is empty too.
    if (values.passwordValue.trim() == '') {
      
        // Display a message indicating that the password field is empty
        passwordError.textContent = "Password field cannot be empty.";

    } else {
        

        // Use fetch API to send a POST request to /login
        try { 
            const res = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' } // Specify the content type
            });

            // Waiting and getting the response back after sending request body 
            const data = await res.json(); // Data is an object which contains another object.

 

            if (data.loginError) {
                    console.log(data.loginError);
                // Display errors to the user
                emailError.textContent = data.loginError.email; 
                passwordError.textContent = data.loginError.password;
                wrongEmailOrPassword.textContent = data.loginError.wrongEmailOrPassword;
              
            } else {
                // Redirect to the home page if there's no error
                location.assign('/');
    }

} catch (err) {
    // Handle fetch request or endpoint errors

    console.log(err);
}




    }
    

   
}else{

    emailError.textContent = "Please enter a valid email address.";

} 


});



