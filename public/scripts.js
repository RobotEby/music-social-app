// Select the social login elements and check if they exist before adding event listeners
const facebookLogin = document.querySelector('.social-login.facebook');
if (facebookLogin) {
    facebookLogin.addEventListener('click', function () {
        window.location.href = '/auth/facebook';
    });
}

const googleLogin = document.querySelector('.social-login.google');
if (googleLogin) {
    googleLogin.addEventListener('click', function () {
        window.location.href = '/auth/google';
    });
}

const appleLogin = document.querySelector('.social-login.apple');
if (appleLogin) {
    appleLogin.addEventListener('click', function () {
        window.location.href = '/auth/apple';
    });
}

const signUpLink = document.getElementById('sign-up-link');
if (signUpLink) {
    signUpLink.addEventListener('click', function (e) {
        e.preventDefault();
        document
            .getElementById('register-form-container')
            .classList.add('active');
        document
            .getElementById('login-form-container')
            .classList.remove('active');
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful!');
            } else {
                alert(data.error || 'Error registering user');
            }
        } catch (error) {
            alert('Error registering user');
            console.error('Error registering user:', error);
        }
    });
}

const loginForm = document.getElementById('user-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                console.log('Token:', data.token);
            } else {
                alert(data.error || 'Error logging in');
            }
        } catch (error) {
            alert('Error logging in');
            console.error('Error logging in:', error);
        }
    });
}

// Script for toggle icon
const rememberToggle = document.getElementById('remember-toggle');
if (rememberToggle) {
    rememberToggle.addEventListener('click', () => {
        if (rememberToggle.classList.contains('fa-toggle-on')) {
            rememberToggle.classList.remove('fa-toggle-on');
            rememberToggle.classList.add('fa-toggle-off');
            localStorage.setItem('rememberMe', 'false');
        } else {
            rememberToggle.classList.remove('fa-toggle-off');
            rememberToggle.classList.add('fa-toggle-on');
            localStorage.setItem('rememberMe', 'true');
        }
    });
} else {
    console.error('The remember-toggle element was not found');
}
