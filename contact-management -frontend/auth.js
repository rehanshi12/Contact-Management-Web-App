//auth.js
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const messageDiv = document.getElementById('message');

// Check if user is already logged in
if (isAuthenticated()) {
    window.location.href = 'contacts.html';
}

// DOM Elements

// Form switch buttons
const showSignUpBtn = document.getElementById('showSignUp');
const showSignInBtn = document.getElementById('showSignIn');
const showForgotPasswordBtn = document.getElementById('showForgotPassword');
const backToSignInBtn = document.getElementById('backToSignIn');

// Check if reset token is in URL
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get('token');

if (resetToken) {
    showForm('resetPasswordForm');
}

// Form switching
showSignUpBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('signUpForm');
});

showSignInBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('signInForm');
});

showForgotPasswordBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('forgotPasswordForm');
});

backToSignInBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('signInForm');
});

function showForm(formId) {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
    hideMessage();
}

// Sign In - Updated to match backend
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginEmail').value; // Using email as username
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token and user info
            setAuthToken(data.token);
            saveUserInfo(data.userId, data.username, data.email);

            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'contacts.html';
            }, 1000);
        } else {
            showMessage(data.error || 'Invalid credentials', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
});

// Sign Up - Updated to match backend
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerEmail').value; // Using email as username
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing Up...';

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password 
            //      securityQuestion: document.getElementById('registerSecurityQuestion').value,
            //    securityAnswer: document.getElementById('registerSecurityAnswer').value
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Registration successful! Please sign in.', 'success');
            setTimeout(() => {
                showForm('signInForm');
                document.getElementById('loginEmail').value = email;
            }, 1500);
        } else {
            showMessage(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Registration error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
});





// Forgot Password - Updated to match backend


document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgotEmail').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Password reset link sent to your email! (Check console for testing)', 'success');
            console.log('Reset Token for Testing:', data.resetToken);
              showForm('resetPasswordForm');
        } else {
            showMessage(data.error || 'Failed to send reset link', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Forgot password error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
});



//Reset Password - Updated to match backend
document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('resetPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Resetting...';

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESET_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: resetToken,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Password reset successful! Redirecting to sign in...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(data.error || 'Failed to reset password', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Reset password error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
});

function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message show ${type}`;
}

function hideMessage() {
    messageDiv.className = 'message';
}


//   here is new code 


// Step 1: Get Username


// here is new line  
// document.getElementById('getUsernameForm')?.addEventListener('submit', async (e) => {

//     const getUsernameForm = document.getElementById('getUsernameForm');
// if (getUsernameForm) {
//     getUsernameForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     console.log('✅ Step 1: Username form submitted with:', username);
//     const username = document.getElementById('resetUsername').value;
    
//     try {
//         console.log('🔐 Sending request to get security question...');
//         const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/get-security-question`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             document.getElementById('securityQuestionDisplay').textContent = data.securityQuestion;
//             document.getElementById('step1-username').style.display = 'none';
//             document.getElementById('step2-security').style.display = 'block';
//             window.currentUsername = username;
//         } else {
//             showMessage(data.error || 'User not found', 'error');
//         }
//     } catch (error) {
//         showMessage('Error: ' + error.message, 'error');
//     }
// });
// }


// Step 2: Verify Security Answer
// document.getElementById('verifySecurityForm')?.addEventListener('submit', async (e) => {


    // here is new cod 

//     const verifySecurityForm = document.getElementById('verifySecurityForm');
// if (verifySecurityForm) {
//     verifySecurityForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const answer = document.getElementById('securityAnswerInput').value;
    
//     try {
//         const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/verify-security-answer`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username: window.currentUsername, answer })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             showMessage('Security answer verified!', 'success');
//             window.resetToken = data.token;
//             document.getElementById('step2-security').style.display = 'none';
//             document.getElementById('step3-password').style.display = 'block';
//         } else {
//             showMessage(data.error || 'Wrong answer', 'error');
//         }
//     } catch (error) {
//         showMessage('Error: ' + error.message, 'error');
//     }
// });
// }
// Step 3: Reset Password
// document.getElementById('resetNewPasswordForm')?.addEventListener('submit', async (e) => {


    // here is new code  

//     const resetNewPasswordForm = document.getElementById('resetNewPasswordForm');
// if (resetNewPasswordForm) {
//     resetNewPasswordForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const newPassword = document.getElementById('newPasswordInput').value;
//     const confirmPassword = document.getElementById('confirmNewPasswordInput').value;
    
//     if (newPassword !== confirmPassword) {
//         showMessage('Passwords do not match', 'error');
//         return;
//     }
    
//     try {
//         const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/reset-password-with-auth`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username: window.currentUsername, newPassword })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             showMessage('Password reset successfully! Redirecting...', 'success');
//             setTimeout(() => {
//                 window.location.href = 'index.html';
//             }, 2000);
//         } else {
//             showMessage(data.error || 'Failed to reset password', 'error');
//         }
//     } catch (error) {
//         showMessage('Error: ' + error.message, 'error');
//     }
// });
// }



// Back button in security question
// document.getElementById('backToUsername')?.addEventListener('click', (e) => {


    // here is new code 

//     const backToUsername = document.getElementById('backToUsername');
// if (backToUsername) {
//     backToUsername.addEventListener('click', (e) => {
//     e.preventDefault();
//     document.getElementById('step2-security').style.display = 'none';
//     document.getElementById('step1-username').style.display = 'block';
//     document.getElementById('securityAnswerInput').value = '';
// });
// }















