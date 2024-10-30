const signUpLink = document.getElementById('sign-up-link');
if (signUpLink) {
    signUpLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'register.app.html';
    });
}

const nextButton = document.getElementById('next-button');
if (nextButton) {
    nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'register.appsx.html';
    });
}

const nameForm = document.getElementById('name-form');
if (nameForm) {
    nameForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('name-input').value;
        const nickname = document.getElementById('nickname-input').value;
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, nickname }),
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

const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password-input');
document.addEventListener('DOMContentLoaded', (event) => {
    const isPasswordVisible = togglePassword.classList.contains('fa-eye');
    passwordInput.setAttribute('type', isPasswordVisible ? 'text' : 'password');
});

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type =
            passwordInput.getAttribute('type') === 'password'
                ? 'text'
                : 'password';
        passwordInput.setAttribute('type', type);
        if (type === 'password') {
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
}
