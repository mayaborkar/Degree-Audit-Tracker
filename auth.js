// Simple authentication system
class SimpleAuth {
    constructor() {
        this.isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
        this.init();
    }

    init() {
        if (!this.isAuthenticated) {
            this.showLoginModal();
        } else {
            this.showApp();
        }
    }

    showLoginModal() {
        // Hide main app
        document.getElementById('app').style.display = 'none';
        
        // Create login modal
        const loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.innerHTML = `
            <div class="login-overlay">
                <div class="login-container">
                    <div class="login-header">
                        <h2>🎓 Degree Tracker Access</h2>
                        <p>Please enter credentials to continue</p>
                    </div>
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit" class="btn-primary">Access Tracker</button>
                        <div id="error-message" class="error-message" style="display: none;">
                            Invalid credentials. Please try again.
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginModal);
        
        // Add login styles
        this.addLoginStyles();
        
        // Handle form submission
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Get credentials from environment variables (set in Vercel dashboard)
        const validUsername = window.ENV?.AUTH_USERNAME || 'demo_user';
        const validPassword = window.ENV?.AUTH_PASSWORD || 'demo_pass';
        
        if (username === validUsername && password === validPassword) {
            sessionStorage.setItem('authenticated', 'true');
            this.isAuthenticated = true;
            this.hideLoginModal();
            this.showApp();
        } else {
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('password').value = '';
        }
    }

    hideLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.remove();
        }
    }

    showApp() {
        document.getElementById('app').style.display = 'block';
    }

    logout() {
        sessionStorage.removeItem('authenticated');
        window.location.reload();
    }

    addLoginStyles() {
        const styles = `
            .login-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .login-container {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
                margin: 1rem;
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .login-header h2 {
                color: #1f2937;
                margin: 0 0 0.5rem 0;
            }
            
            .login-header p {
                color: #6b7280;
                margin: 0;
            }
            
            .login-form .form-group {
                margin-bottom: 1rem;
            }
            
            .login-form label {
                display: block;
                margin-bottom: 0.5rem;
                color: #374151;
                font-weight: 500;
            }
            
            .login-form input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }
            
            .login-form input:focus {
                outline: none;
                border-color: #3b82f6;
            }
            
            .login-form .btn-primary {
                width: 100%;
                padding: 0.75rem;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
                margin-top: 1rem;
            }
            
            .login-form .btn-primary:hover {
                background: #2563eb;
            }
            
            .error-message {
                color: #dc2626;
                text-align: center;
                margin-top: 1rem;
                padding: 0.5rem;
                background: #fef2f2;
                border-radius: 0.5rem;
                border: 1px solid #fecaca;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize auth when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new SimpleAuth();
});