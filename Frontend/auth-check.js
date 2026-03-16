// Check authentication on protected pages
function checkAuthentication() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

// Call this on every protected page (but NOT on login page)
if (!window.location.pathname.includes('login.html')) {
    checkAuthentication();
}

// Logout functionality
function logout() {
    // Clear all session data
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('loginType');
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = 'login.html';
}