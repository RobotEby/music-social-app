document
    .querySelector('.social-login.facebook')
    .addEventListener('click', function () {
        window.location.href = '/auth/facebook';
    });

document
    .querySelector('.social-login.google')
    .addEventListener('click', function () {
        window.location.href = '/auth/google';
    });

document
    .querySelector('.social-login.apple')
    .addEventListener('click', function () {
        window.location.href = '/auth/apple';
    });

document.getElementById('registerLink').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('registerFormContainer').classList.add('active');
    document.getElementById('loginFormContainer').classList.remove('active');
});

document
    .getElementById('registerForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registro realizado com sucesso!');
            } else {
                alert(data.error || 'Erro ao registrar usuário');
            }
        } catch (error) {
            alert('Erro ao registrar usuário');
            console.error('Erro ao registrar usuário:', error);
        }
    });

document
    .getElementById('loginForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login realizado com sucesso!');
                console.log('Token:', data.token);
            } else {
                alert(data.error || 'Erro ao fazer login');
            }
        } catch (error) {
            alert('Erro ao fazer login');
            console.error('Erro ao fazer login:', error);
        }
    });
