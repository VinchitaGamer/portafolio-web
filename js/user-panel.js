// Panel de Usuario
class UserPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.userMessages = JSON.parse(localStorage.getItem('user_messages') || '[]');
        this.userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        this.init();
    }

    init() {
        // Verificar autenticación
        if (!auth.requireAuth()) return;

        this.setupEventListeners();
        this.loadUserInfo();
        this.loadDashboard();
        this.loadProfile();
    }

    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // Formulario de mensaje
        document.getElementById('user-message-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(e.target);
        });

        // Formulario de perfil
        document.getElementById('user-profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile(e.target);
        });
    }

    loadUserInfo() {
        const user = auth.getCurrentUser();
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = 'Usuario';
        
        // Cargar datos del perfil si existen
        if (this.userProfile.name) {
            document.getElementById('profile-name').value = this.userProfile.name;
        }
        if (this.userProfile.email) {
            document.getElementById('profile-email').value = this.userProfile.email;
        }
        if (this.userProfile.phone) {
            document.getElementById('profile-phone').value = this.userProfile.phone;
        }
        if (this.userProfile.company) {
            document.getElementById('profile-company').value = this.userProfile.company;
        }
        if (this.userProfile.bio) {
            document.getElementById('profile-bio').value = this.userProfile.bio;
        }
        if (this.userProfile.interests) {
            document.getElementById('profile-interests').value = this.userProfile.interests;
        }
    }

    switchSection(section) {
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Actualizar secciones
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;

        // Cargar contenido específico
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    loadDashboard() {
        // Actualizar contadores
        document.getElementById('sent-messages').textContent = this.userMessages.length;
        document.getElementById('member-since').textContent = 'Hoy';
        document.getElementById('user-visits').textContent = '12';
        document.getElementById('user-status').textContent = 'Activo';

        // Actualizar actividad
        this.updateActivity();
    }

    loadMessages() {
        const messagesTable = document.getElementById('user-messages-table');
        messagesTable.innerHTML = '';

        if (this.userMessages.length === 0) {
            messagesTable.innerHTML = '<tr><td colspan="4">No has enviado mensajes aún</td></tr>';
            return;
        }

        this.userMessages.forEach((message, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(message.date).toLocaleDateString()}</td>
                <td>${message.subject}</td>
                <td><span class="status-${message.status === 'read' ? 'success' : 'warning'}">${message.status === 'read' ? 'Leído' : 'Enviado'}</span></td>
                <td>${message.response || 'Sin respuesta'}</td>
            `;
            messagesTable.appendChild(row);
        });
    }

    loadProfile() {
        // Los datos del perfil se cargan en loadUserInfo()
        this.updateStats();
    }

    sendMessage(form) {
        const formData = new FormData(form);
        const message = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            date: new Date().toISOString(),
            status: 'sent'
        };

        // Guardar mensaje del usuario
        this.userMessages.push(message);
        this.saveUserMessages();

        // También agregar a los mensajes del admin
        const adminMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        adminMessages.push({
            ...message,
            read: false,
            response: null
        });
        localStorage.setItem('portfolio_messages', JSON.stringify(adminMessages));

        // Limpiar formulario
        form.reset();

        this.showNotification('Mensaje enviado correctamente', 'success');
        this.loadMessages();
    }

    updateProfile(form) {
        const formData = new FormData(form);
        this.userProfile = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            bio: formData.get('bio'),
            interests: formData.get('interests'),
            updatedAt: new Date().toISOString()
        };

        this.saveUserProfile();
        this.showNotification('Perfil actualizado correctamente', 'success');
    }

    updateActivity() {
        const activityTable = document.getElementById('user-activity');
        const activities = [
            { date: 'Hoy', action: 'Login de usuario', status: 'success' },
            { date: 'Hoy', action: 'Actualización de perfil', status: 'success' },
            { date: 'Ayer', action: 'Visita al portafolio', status: 'success' }
        ];

        activityTable.innerHTML = '';
        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.date}</td>
                <td>${activity.action}</td>
                <td><span class="status-${activity.status}">Exitoso</span></td>
            `;
            activityTable.appendChild(row);
        });
    }

    updateStats() {
        const stats = document.querySelectorAll('.stats-grid .stat-number');
        if (stats.length >= 4) {
            stats[0].textContent = this.userMessages.length;
            stats[1].textContent = '5 min';
            stats[2].textContent = 'Hoy';
            stats[3].textContent = 'Nuevo';
        }
    }

    saveUserMessages() {
        localStorage.setItem('user_messages', JSON.stringify(this.userMessages));
    }

    saveUserProfile() {
        localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar panel de usuario
const userPanel = new UserPanel();

// Agregar CSS adicional para el panel de usuario
const style = document.createElement('style');
style.textContent = `
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .stat-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        transition: transform 0.3s ease;
    }

    .stat-item:hover {
        transform: translateY(-2px);
    }

    .stat-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
    }

    .stat-icon i {
        color: white;
        font-size: 1.2rem;
    }

    .stat-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
        color: #666;
    }

    .stat-content .stat-number {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
