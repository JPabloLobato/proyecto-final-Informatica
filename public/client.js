document.addEventListener('DOMContentLoaded', () => {
    // Enlace para redirigir a la página de inicio de sesión
    const loginLink = document.querySelector('.no-tienes-cuenta a.login');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'inicio.html'; // Redirige a inicio.html
        });
    }

    // Enlace para redirigir a la página de registro
    const registerLink = document.querySelector('.no-tienes-cuenta a.register');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'registro.html'; // Redirige a registro.html
        });
    }

    // Manejar envío de formularios
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // Determinar si es registro o inicio de sesión
    const isRegister = e.target.querySelector('h1').textContent.includes('Registr');
    const endpoint = `/api/${isRegister ? 'register' : 'login'}`;

    // Enviar datos al servidor mediante fetch
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formProps)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = data.redirect || '/';
            } else {
                alert(data.message || 'Ha ocurrido un error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ha ocurrido un error de conexión');
        });
}