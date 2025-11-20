// // ===== auth.js (cleaned, copy & replace your file) =====

// // Config (ensure API_CONFIG exists elsewhere)
// const API_CONFIG = window.API_CONFIG || {
//   BASE_URL: 'http://localhost:8080', // change if needed
//   ENDPOINTS: {
//     SIGNIN: '/api/auth/signin',
//     SIGNUP: '/api/auth/signup',
//     FORGOT_PASSWORD: '/api/auth/forgot-password',
//     RESET_PASSWORD: '/api/auth/reset-password'
//   }
// };

// // Helper: message element + show/hide functions
// let messageDiv = null;
// function ensureMessageDiv() {
//   if (!messageDiv) {
//     messageDiv = document.getElementById('message');
//     if (!messageDiv) {
//       // create fallback message div at top of body
//       messageDiv = document.createElement('div');
//       messageDiv.id = 'message';
//       messageDiv.style.padding = '10px';
//       document.body.prepend(messageDiv);
//     }
//   }
// }
// function showMessage(msg, type) {
//   ensureMessageDiv();
//   messageDiv.textContent = msg;
//   messageDiv.className = `message show ${type || ''}`;
// }
// function hideMessage() {
//   ensureMessageDiv();
//   messageDiv.textContent = '';
//   messageDiv.className = 'message';
// }

// // Utility auth helpers (stubs, keep your real impls elsewhere)
// function isAuthenticated() {
//   // implement your auth check (e.g. token in localStorage)
//   return !!localStorage.getItem('authToken');
// }
// function setAuthToken(token) {
//   localStorage.setItem('authToken', token);
// }
// function saveUserInfo(userId, username, email) {
//   localStorage.setItem('userId', userId);
//   localStorage.setItem('username', username);
//   localStorage.setItem('email', email);
// }

// // DOMContentLoaded to ensure DOM exists before attaching listeners
// window.addEventListener('DOMContentLoaded', function () {

//   // --------------------------
//   // Detect reset token in URL
//   // --------------------------
//   const urlParams = new URLSearchParams(window.location.search);
//   const urlResetToken = urlParams.get('token');
//   if (urlResetToken) {
//     console.log('Reset token detected:', urlResetToken);
//     // Store token and show reset form
//     localStorage.setItem('resetToken', urlResetToken);
//     // ensure messageDiv exists for UI
//     ensureMessageDiv();
//     // show the reset password form if function exists
//     try { showForm('resetPasswordForm'); } catch (e) { /* ignore if UI structure differs */ }
//   }

//   // --------------------------
//   // Quick redirect if authenticated
//   // --------------------------
//   if (isAuthenticated()) {
//     window.location.href = 'contacts.html';
//     return;
//   }

//   // --------------------------
//   // DOM element references
//   // --------------------------
//   const signInForm = document.getElementById('signInForm');
//   const signUpForm = document.getElementById('signUpForm');
//   const forgotPasswordForm = document.getElementById('forgotPasswordForm');
//   const resetPasswordForm = document.getElementById('resetPasswordForm');

//   const showSignUpBtn = document.getElementById('showSignUp');
//   const showSignInBtn = document.getElementById('showSignIn');
//   const showForgotPasswordBtn = document.getElementById('showForgotPassword');
//   const backToSignInBtn = document.getElementById('backToSignIn');

//   // --------------------------
//   // Form switching
//   // --------------------------
//   function showForm(formId) {
//     document.querySelectorAll('.form-container').forEach(form => {
//       form.classList.remove('active');
//     });
//     const el = document.getElementById(formId);
//     if (el) el.classList.add('active');
//     hideMessage();
//   }

//   showSignUpBtn?.addEventListener('click', (e) => { e.preventDefault(); showForm('signUpForm'); });
//   showSignInBtn?.addEventListener('click', (e) => { e.preventDefault(); showForm('signInForm'); });
//   showForgotPasswordBtn?.addEventListener('click', (e) => { e.preventDefault(); showForm('forgotPasswordForm'); });
//   backToSignInBtn?.addEventListener('click', (e) => { e.preventDefault(); showForm('signInForm'); });

//   // If token in URL, show reset form
//   const maybeToken = localStorage.getItem('resetToken');
//   if (maybeToken) showForm('resetPasswordForm');

//   // --------------------------
//   // FORGOT PASSWORD handler
//   // --------------------------
//   document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('forgotEmail')?.value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');
//     try {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Generating Link...';

//       const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         document.getElementById('forgotForm').style.display = 'none';
//         ensureMessageDiv();
//         messageDiv.innerHTML = `
//           <div style="text-align:left;padding:10px">
//             <p style="color:#155724;font-weight:bold;margin-bottom:15px">✅ Password reset link generated!</p>
//             <p style="margin-bottom:10px;color:#666">Click the link below to reset your password:</p>
//             <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:15px 0;">
//               <a href="${data.resetUrl}" style="color:#667eea;word-break:break-all;text-decoration:underline;" target="_blank">${data.resetUrl}</a>
//             </div>
//             <p style="margin-top:10px;font-size:12px;color:#999">⏱️ This link will expire in 15 minutes</p>
//             <button onclick="location.reload()" style="margin-top:15px;padding:8px 16px;background:#667eea;color:white;border:none;border-radius:6px;cursor:pointer;">Back to Sign In</button>
//           </div>
//         `;
//         messageDiv.className = 'message show success';
//         console.log('PASSWORD RESET LINK GENERATED', data.resetUrl);
//       } else {
//         showMessage(data.error || 'Failed to generate reset link', 'error');
//       }
//     } catch (err) {
//       showMessage('Network error. Please try again.', 'error');
//       console.error('Forgot password error:', err);
//     } finally {
//       if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Reset Link'; }
//     }
//   });

//   // --------------------------
//   // SIGN IN handler
//   // --------------------------
//   document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('loginEmail')?.value;
//     const password = document.getElementById('loginPassword')?.value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');
//     try {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Signing In...';

//       const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNIN}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setAuthToken(data.token);
//         saveUserInfo(data.userId, data.username, data.email);
//         showMessage('Login successful! Redirecting...', 'success');
//         setTimeout(() => window.location.href = 'contacts.html', 800);
//       } else {
//         showMessage(data.error || 'Invalid credentials', 'error');
//       }
//     } catch (err) {
//       showMessage('Network error. Please try again.', 'error');
//       console.error('Login error:', err);
//     } finally {
//       if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
//     }
//   });

//   // --------------------------
//   // SIGN UP handler
//   // --------------------------
//   document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('registerEmail')?.value;
//     const email = document.getElementById('registerEmail')?.value;
//     const password = document.getElementById('registerPassword')?.value;
//     const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');

//     if (password !== confirmPassword) { showMessage('Passwords do not match', 'error'); return; }

//     try {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Signing Up...';

//       const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email, password })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         showMessage('Registration successful! Please sign in.', 'success');
//         setTimeout(() => { showForm('signInForm'); document.getElementById('loginEmail').value = email; }, 1200);
//       } else {
//         showMessage(data.error || 'Registration failed', 'error');
//       }
//     } catch (err) {
//       showMessage('Network error. Please try again.', 'error');
//       console.error('Registration error:', err);
//     } finally {
//       if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign Up'; }
//     }
//   });

//   // --------------------------
//   // RESET PASSWORD handler
//   // --------------------------
//   document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const newPassword = document.getElementById('resetPassword')?.value;
//     const confirmPassword = document.getElementById('resetConfirmPassword')?.value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');

//     if (newPassword !== confirmPassword) { showMessage('Passwords do not match', 'error'); return; }

//     const resetToken = localStorage.getItem('resetToken');
//     if (!resetToken) { showMessage('Invalid or expired reset link', 'error'); return; }

//     try {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Resetting...';

//       const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESET_PASSWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token: resetToken, newPassword })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.removeItem('resetToken');
//         window.history.replaceState({}, document.title, window.location.pathname);
//         showMessage('Password reset successful! Redirecting to sign in...', 'success');
//         setTimeout(() => showForm('signInForm'), 1200);
//       } else {
//         showMessage(data.error || 'Failed to reset password', 'error');
//       }
//     } catch (err) {
//       showMessage('Network error. Please try again.', 'error');
//       console.error('Reset password error:', err);
//     } finally {
//       if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Reset Password'; }
//     }
//   });

// }); // end DOMContentLoaded




// js///auth.js


// ===== ADD THIS SECTION AT THE TOP =====
// Check if reset token is in URL when page loads
// window.addEventListener('DOMContentLoaded', function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const resetToken = urlParams.get('token');
    
//     if (resetToken) {
//         console.log('Reset token detected:', resetToken);
//         // Show reset password form
//         showForm('resetPasswordForm');
//         // Store token for later use
//         localStorage.setItem('resetToken', resetToken);
//     }
// });
// // ===== END OF NEW SECTION =====

// // Check if user is already logged in
// if (isAuthenticated()) {
//     window.location.href = 'contacts.html';
// }


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
            body: JSON.stringify({ username, email, password })
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
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Password reset link sent to your email! (Check console for testing)', 'success');
            console.log('Reset Token for Testing:', data.resetToken);
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

// Forgot Password - Updated
// document.getElementById('forgotForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const email = document.getElementById('forgotEmail').value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');

//     try {
//         submitBtn.disabled = true;
//         submitBtn.textContent = 'Generating Link...';

//         const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             // Hide the form
//             document.getElementById('forgotForm').style.display = 'none';

//             // Show success message with clickable link
//             messageDiv.innerHTML = `
//                 <div style="text-align: left; padding: 10px;">
//                     <p style="color: #155724; font-weight: bold; margin-bottom: 15px;">
//                         ✅ Password reset link generated!
//                     </p>
//                     <p style="margin-bottom: 10px; color: #666;">
//                         Click the link below to reset your password:
//                     </p>
//                     <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
//                         <a href="${data.resetUrl}" 
//                            style="color: #667eea; word-break: break-all; text-decoration: underline;"
//                            target="_blank">
//                             ${data.resetUrl}
//                         </a>
//                     </div>
//                     <p style="margin-top: 15px; font-size: 13px; color: #666;">
//                         💡 Tip: Right-click the link and select "Open in new tab"
//                     </p>
//                     <p style="margin-top: 10px; font-size: 12px; color: #999;">
//                         ⏱️ This link will expire in 15 minutes
//                     </p>
//                     <button onclick="location.reload()" 
//                             style="margin-top: 15px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
//                         Back to Sign In
//                     </button>
//                 </div>
//             `;
//             messageDiv.className = 'message show success';

//             // Also log to console for easy access
//             console.log('\n' + '='.repeat(60));
//             console.log('PASSWORD RESET LINK GENERATED');
//             console.log('Copy and open this URL in your browser:');
//             console.log(data.resetUrl);
//             console.log('='.repeat(60) + '\n');

//         } else {
//             showMessage(data.error || 'Failed to generate reset link', 'error');
//         }
//     } catch (error) {
//         showMessage('Network error. Please try again.', 'error');
//         console.error('Forgot password error:', error);
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.textContent = 'Send Reset Link';
//     }
// });



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


//   /  upadted this is for reset link a rhi thi par reset page load nhi horha 
// Reset Password - Updated
// document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const newPassword = document.getElementById('resetPassword').value;
//     const confirmPassword = document.getElementById('resetConfirmPassword').value;
//     const submitBtn = e.target.querySelector('button[type="submit"]');
    
//     if (newPassword !== confirmPassword) {
//         showMessage('Passwords do not match', 'error');
//         return;
//     }
    
//     // Get token from localStorage (stored when page loaded)
//     const resetToken = localStorage.getItem('resetToken');
    
//     if (!resetToken) {
//         showMessage('Invalid or expired reset link', 'error');
//         return;
//     }
    
//     try {
//         submitBtn.disabled = true;
//         submitBtn.textContent = 'Resetting...';
        
//         const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESET_PASSWORD}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ 
//                 token: resetToken, 
//                 newPassword: newPassword 
//             })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             // Clear the reset token
//             localStorage.removeItem('resetToken');
            
//             // Clear URL parameters
//             window.history.replaceState({}, document.title, window.location.pathname);
            
//             showMessage('Password reset successful! Redirecting to sign in...', 'success');
//             setTimeout(() => {
//                 showForm('signInForm');
//             }, 2000);
//         } else {
//             showMessage(data.error || 'Failed to reset password', 'error');
//         }
//     } catch (error) {
//         showMessage('Network error. Please try again.', 'error');
//         console.error('Reset password error:', error);
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.textContent = 'Reset Password';
//     }
// });
