// Sistema de Autenticación
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userRole = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Credenciales de demo
    getCredentials() {
        return {
            admin: {
                email: 'admin@jhondev.com',
                password: 'admin123',
                role: 'admin',
                name: 'Jhon Desarrollador'
            },
            user: {
                email: 'usuario@demo.com',
                password: 'user123',
                role: 'user',
                name: 'Usuario Demo'
            }
        };
    }

    setupEventListeners() {
        // Tabs de login
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Formularios de login
        document.getElementById('admin-login').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target, 'admin');
        });

        document.getElementById('user-login').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target, 'user');
        });

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target);
            });
        });
    }

    switchTab(tab) {
        // Actualizar botones de tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Actualizar formularios
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tab}-login`).classList.add('active');
    }

    togglePasswordVisibility(button) {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    handleLogin(form, role) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        const credentials = this.getCredentials();
        const userCreds = credentials[role];

        if (email === userCreds.email && password === userCreds.password) {
            this.login(userCreds, remember);
        } else {
            this.showError('Credenciales incorrectas');
        }
    }

    login(user, remember = false) {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.userRole = user.role;

        // Guardar en localStorage si "recordar" está marcado
        if (remember) {
            localStorage.setItem('portfolio_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('portfolio_user', JSON.stringify(user));
        }

        // Redirigir al dashboard
        this.redirectToDashboard();
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userRole = null;

        // Limpiar storage
        localStorage.removeItem('portfolio_user');
        sessionStorage.removeItem('portfolio_user');

        // Redirigir al login
        window.location.href = 'login.html';
    }

    loadUserFromStorage() {
        const user = localStorage.getItem('portfolio_user') || sessionStorage.getItem('portfolio_user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isLoggedIn = true;
            this.userRole = this.currentUser.role;
        }
    }

    checkAuthStatus() {
        // Si estamos en una página protegida y no hay usuario, redirigir al login
        const protectedPages = ['admin.html', 'dashboard.html', 'projects.html', 'messages.html', 'images.html', 'content.html', 'navigation.html', 'preview.html', 'settings.html', 'backup.html'];
        const currentPage = window.location.pathname.split('/').pop();
        const loginPath = this.getLoginPath();

        if (protectedPages.includes(currentPage) && !this.isLoggedIn) {
            window.location.href = loginPath;
        }

        // Si estamos en login y ya hay usuario, redirigir al dashboard
        if (currentPage === 'login.html' && this.isLoggedIn) {
            this.redirectToDashboard();
        }
    }

    redirectToDashboard() {
        if (this.userRole === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }

    showError(message) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #e74c3c;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideDown 0.3s ease-out;
        `;
        errorDiv.textContent = message;

        // Insertar antes del primer formulario
        const firstForm = document.querySelector('.login-form');
        firstForm.parentNode.insertBefore(errorDiv, firstForm);

        // Remover después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Métodos para usar en otras páginas
    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.userRole === 'admin';
    }

    isUser() {
        return this.userRole === 'user';
    }

    requireAuth() {
        if (!this.isLoggedIn) {
            window.location.href = this.getLoginPath();
            return false;
        }
        return true;
    }

    requireAdmin() {
        if (!this.isLoggedIn || !this.isAdmin()) {
            window.location.href = this.getLoginPath();
            return false;
        }
        return true;
    }

    getLoginPath() {
        // Si estamos dentro de /admin/, regresar a ../login.html
        const parts = window.location.pathname.split('/');
        const isInAdmin = parts.includes('admin');
        return isInAdmin ? '../login.html' : 'login.html';
    }
}

// Inicializar sistema de autenticación
const auth = new AuthSystem();

// Agregar CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Exportar para uso global
window.auth = auth;
