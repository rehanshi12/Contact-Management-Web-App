//config.js
const API_CONFIG = {
    // IMPORTANT: Change this to match your backend IP and port
    BASE_URL: 'http://10.96.89.72:8080/api',

    ENDPOINTS: {
        // Auth endpoints
        SIGNUP: '/auth/signup',
        SIGNIN: '/auth/signin',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        // GET_SECURITY_QUESTION: '/auth/get-security-question',
        // VERIFY_SECURITY_ANSWER: '/auth/verify-security-answer',
        // RESET_PASSWORD_WITH_AUTH: '/auth/reset-password-with-auth',

        // Contact endpoints
        CONTACTS: '/contacts',
        CONTACT_BY_ID: '/contacts/:id',
        SEARCH_CONTACTS: '/contacts/search',
        CONTACT_COUNT: '/contacts/count'
    }
};

// Utility function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Utility function to set auth token
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Utility function to remove auth token
const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
};

// Utility function to save user info
const saveUserInfo = (userId, username, email) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
};

// Utility function to get user info
const getUserInfo = () => {
    return {
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email')
    };
};

// Utility function to check if user is authenticated
const isAuthenticated = () => {
    return !!getAuthToken();
};

// Utility function to make API calls with JSON
const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log('Making API call to:', API_CONFIG.BASE_URL + endpoint);
        console.log('Method:', options.method || 'GET');
        console.log('Headers:', headers);

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            headers,
            mode: 'cors',
            // credentials: 'include'
        });


        console.log('Response status:', response.status);

        if (response.status === 401) {
            // Token expired or invalid
            removeAuthToken();
            window.location.href = 'index.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
};

// Utility function to make API calls with FormData (for file uploads)
const apiCallFormData = async (endpoint, formData, method = 'POST') => {
    const token = getAuthToken();
    const headers = {
        'Accept': 'application/json'
    };


    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log('Making FormData API call to:', API_CONFIG.BASE_URL + endpoint);
        console.log('Method:', method);



        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: formData,
            mode: 'cors'
        });




        console.log('Response status:', response.status);

        if (response.status === 401) {
            // Token expired or invalid
            removeAuthToken();
            window.location.href = 'index.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('FormData API Call Error:', error);
        throw error;
    }
};



