const API_BASE_URL = 'http://localhost:8080/api';

// Default credentials
const users = {
    simulator: {
        username: 'simulator',
        password: 'sim123',
        redirect: 'simulator.html'
    },
    dashboard: {
        username: 'dashboard',
        password: 'dash123',
        redirect: 'dashboard.html'
    },
    admin: {
        username: 'admin',
        password: 'admin123',
        redirect: 'dashboard.html'
    }
};

// Login form submit
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const loginType = document.getElementById('loginType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    const user = users[loginType];

    if (user && username === user.username && password === user.password) {
        // Store login info
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('loginType', loginType);

        // Redirect
        window.location.href = user.redirect;
    } else {
        showError('Invalid username or password!');
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 50, 50, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        const loginType = sessionStorage.getItem('loginType');

        if (loginType === 'simulator') {
            window.location.href = 'simulator.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
