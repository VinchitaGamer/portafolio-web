// Panel de Administración Simplificado pero Funcional
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentProject = 'ecommerce';
        this.createDefaultAdminUser();

        this.messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        this.images = JSON.parse(localStorage.getItem('portfolio_images') || '[]');
        this.projects = JSON.parse(localStorage.getItem('portfolio_projects') || '{}');
        this.settings = JSON.parse(localStorage.getItem('portfolio_settings') || '{}');

        // Inicializar datos por defecto si no existen
        if (Object.keys(this.projects).length === 0) {
            this.projects = this.getDefaultProjects();
            localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
        }


        if (Object.keys(this.settings).length === 0) {
            this.settings = this.getDefaultSettings();
            localStorage.setItem('portfolio_settings', JSON.stringify(this.settings));
        }

        // Agregar algunos mensajes de ejemplo
        if (this.messages.length === 0) {
            this.messages = this.getSampleMessages();
            localStorage.setItem('portfolio_messages', JSON.stringify(this.messages));
        }

        // Agregar algunas imágenes de ejemplo
        if (this.images.length === 0) {
            this.images = this.getSampleImages();
            localStorage.setItem('portfolio_images', JSON.stringify(this.images));
        }

        this.init();
    }

    createDefaultAdminUser() {
        const defaultUser = {
            name: 'Jhon Desarrollador',
            email: 'admin@jhondev.com',
            password: 'admin123',
            role: 'admin'
        };

        if (!localStorage.getItem('portfolio_user') && !sessionStorage.getItem('portfolio_user')) {
            localStorage.setItem('portfolio_user', JSON.stringify(defaultUser));
        }
    }

    getDefaultProjects() {
        return {
            ecommerce: {
                id: 'ecommerce',
                title: 'Plataforma E-Commerce',
                subtitle: 'Solución completa de comercio electrónico moderna y escalable',
                description: 'Desarrollé una plataforma de comercio electrónico completa y moderna que permite a los usuarios comprar y vender productos de manera segura y eficiente.',
                tech: 'React, Node.js, MongoDB, Express, Stripe',
                category: 'web',
                features: [
                    'Catálogo de productos con filtros avanzados',
                    'Sistema de carrito de compras persistente',
                    'Procesamiento de pagos seguro con Stripe',
                    'Panel de administración completo',
                    'Sistema de gestión de inventario',
                    'Notificaciones por email en tiempo real',
                    'Dashboard de analytics y reportes',
                    'Diseño completamente responsivo'
                ],
                challenges: 'Uno de los mayores desafíos fue implementar un sistema de pagos seguro y confiable.',
                results: {
                    satisfaction: '95%',
                    salesIncrease: '40%',
                    loadTime: '2.5s'
                },
                images: {
                    hero: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Hero+Image',
                    catalog: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Catalog',
                    cart: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Cart',
                    admin: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Admin',
                    analytics: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Analytics'
                }
            }
        };
    }

    getDefaultSettings() {
        return {
            title: 'Jhon Desarrollador',
            subtitle: 'Desarrollador de Software Freelance',
            description: 'Creo experiencias digitales hermosas, funcionales y centradas en el usuario.',
            content: {
                home: {
                    title: 'Jhon Desarrollador',
                    subtitle: 'Desarrollador de Software Freelance',
                    description: 'Creo experiencias digitales hermosas, funcionales y centradas en el usuario.'
                }
            }
        };
    }

    getSampleMessages() {
        return [
            {
                id: 1,
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                subject: 'Interés en servicios de desarrollo web',
                message: 'Hola Jhon, estoy interesada en tus servicios de desarrollo web para mi proyecto de e-commerce. ¿Podrías enviarme más información sobre tus tarifas y tiempos de entrega?',
                date: new Date(Date.now() - 172800000).toISOString(),
                read: false
            },
            {
                id: 2,
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@empresa.com',
                subject: 'Consulta sobre aplicación móvil',
                message: 'Estimado Jhon, vimos tu portafolio y estamos interesados en desarrollar una aplicación móvil para nuestra empresa. ¿Tienes disponibilidad para una reunión esta semana?',
                date: new Date(Date.now() - 86400000).toISOString(),
                read: true
            }
        ];
    }

    getSampleImages() {
        return [
            {
                id: 1,
                name: 'proyecto-hero.jpg',
                url: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Sample+Hero',
                alt: 'Imagen de ejemplo del proyecto',
                project: 'ecommerce',
                size: '45 KB',
                date: new Date().toISOString(),
                type: 'image/jpeg'
            }
        ];
    }

    init() {
        if (!auth.requireAdmin()) return;

        this.setupEventListeners();
        this.setupImageUploadListeners();
        this.ensureUrlModal();
        this.loadUserInfo();

        const currentPage = window.location.pathname.split('/').pop();
        switch (currentPage) {
            case 'images.html':
                this.loadImages();
                break;
            case 'projects.html':
                this.loadProjects();
                break;
            case 'messages.html':
                this.loadMessages();
                break;
            case 'backup.html':
                this.loadBackup();
                break;
            default:
                this.loadDashboard();
        }

        this.setupAutoSave();
        console.log('Panel de administración inicializado correctamente');
    }

    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-item').dataset.section;
                if (section) this.switchSection(section);
            });
        });

        // Botones de acción principales
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.onclick?.toString() || '';
                if (action.includes('admin.')) {
                    // Los métodos serán manejados por el proxy global
                }
            });
        });

        // Filtro de mensajes (messages.html)
        const msgFilter = document.getElementById('message-filter');
        if (msgFilter && !msgFilter.dataset.listenerAttached) {
            msgFilter.dataset.listenerAttached = '1';
            msgFilter.addEventListener('change', () => this.updateMessagesList());
        }
    }

    loadUserInfo() {
        const user = auth.getCurrentUser();
        if (user) {
            const userNameEl = document.getElementById('user-name');
            const userRoleEl = document.getElementById('user-role');
            if (userNameEl) userNameEl.textContent = user.name;
            if (userRoleEl) userRoleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';
        }
    }

    switchSection(section) {
        // Si estamos en archivos separados, redirigir a la página correspondiente
        const currentPage = window.location.pathname.split('/').pop();

        if (currentPage !== 'admin.html' && currentPage !== 'index.html') {
            const sectionUrls = {
                dashboard: 'dashboard.html',
                projects: 'projects.html',
                messages: 'messages.html',
                images: 'images.html',
                content: 'content.html',
                navigation: 'navigation.html',
                preview: 'preview.html',
                settings: 'settings.html',
                backup: 'backup.html'
            };

            if (sectionUrls[section] && currentPage !== sectionUrls[section]) {
                window.location.href = sectionUrls[section];
                return;
            }
        }

        // Si estamos en admin.html o en la página correcta, usar navegación interna
        this.currentSection = section;

        // Cargar contenido específico
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'images':
                this.loadImages();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Método para navegación directa (útil para archivos separados)
    navigateToSection(section) {
        const sectionUrls = {
            dashboard: 'dashboard.html',
            projects: 'projects.html',
            messages: 'messages.html',
            images: 'images.html',
            content: 'content.html',
            navigation: 'navigation.html',
            preview: 'preview.html',
            settings: 'settings.html',
            backup: 'backup.html'
        };

        if (sectionUrls[section]) {
            window.location.href = sectionUrls[section];
        }
    }

    // Método para volver al dashboard
    goToDashboard() {
        window.location.href = 'dashboard.html';
    }

    // Método para abrir vista previa
    openPreview() {
        window.open('preview.html', '_blank');
    }

    loadDashboard() {
        // Actualizar contadores básicos
        const projectsCount = document.getElementById('projects-count');
        const imagesCount = document.getElementById('images-count');
        const messagesCount = document.getElementById('messages-count');

        if (projectsCount) projectsCount.textContent = Object.keys(this.projects).length;
        if (imagesCount) imagesCount.textContent = this.images.length;
        if (messagesCount) messagesCount.textContent = this.messages.length;

        // Actualizar actividad reciente
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;

        const activities = [
            { icon: 'fas fa-plus', text: 'Panel administrativo inicializado', time: 'Ahora' },
            { icon: 'fas fa-check', text: 'Sistema funcionando correctamente', time: 'Reciente' }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span>${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    markAllAsRead() {
        if (!this.messages.length) return;
        this.messages = this.messages.map(m => ({ ...m, read: true }));
        this.saveMessages();
        this.updateMessagesList();
        this.updateMessageCount();
        this.showNotification('Todos los mensajes marcados como leídos', 'success');
    }

    loadProjects() {
        this.updateProjectsList();
        this.updateProjectImagesGrid();
        // Activar selección de proyecto al hacer clic en la lista
        const container = document.querySelector('.projects-list');
        if (container && !container.dataset.listenerAttached) {
            container.dataset.listenerAttached = '1';
            container.addEventListener('click', (e) => {
                const item = e.target.closest('.project-item');
                if (!item) return;
                const pid = item.dataset.project;
                if (!pid) return;
                this.currentProject = pid;
                // Actualizar activo
                container.querySelectorAll('.project-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                this.updateProjectImagesGrid();
                this.populateProjectForm();
            });
        }

        // Inicializar formulario de proyecto
        this.setupProjectFormListeners();
        this.populateProjectForm();
    }

    updateProjectsList() {
        const projectsList = document.querySelector('.projects-list');
        if (!projectsList) return;

        const projectsHtml = Object.values(this.projects).map(project => `
            <div class="project-item ${project.id === this.currentProject ? 'active' : ''}" data-project="${project.id}">
                <div class="project-preview">
                    <img src="${project.images?.hero || 'https://via.placeholder.com/100x80/667eea/ffffff?text=No+Image'}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.tech || 'Tecnologías no especificadas'}</p>
                </div>
                <div class="project-actions">
                    <button class="btn-icon" onclick="admin.editProject('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="admin.deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        projectsList.innerHTML = projectsHtml + `
            <button class="btn btn-primary add-project-btn" onclick="admin.showAddProjectModal()">
                <i class="fas fa-plus"></i>
                Agregar Proyecto
            </button>
        `;
    }

    loadMessages() {
        this.updateMessagesList();
    }

    updateMessagesList() {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        if (this.messages.length === 0) {
            messagesList.innerHTML = '<p>No hay mensajes recibidos</p>';
            return;
        }

        const filterVal = document.getElementById('message-filter')?.value || '';
        const filtered = this.messages.filter(m => {
            if (filterVal === 'unread') return !m.read;
            if (filterVal === 'read') return m.read;
            return true;
        });

        messagesList.innerHTML = filtered.map((message, index) => `
            <div class="message-item ${message.read ? 'read' : 'unread'}" data-message="${index}">
                <div class="message-header">
                    <div class="message-info">
                        <h4>${message.name}</h4>
                        <p>${message.email}</p>
                        <span>${new Date(message.date).toLocaleString()}</span>
                    </div>
                    <div class="message-actions">
                        <button class="btn-icon ${message.read ? 'read' : 'unread'}" onclick="admin.toggleMessageRead(${index})">
                            <i class="fas fa-${message.read ? 'undo' : 'check'}"></i>
                        </button>
                        <button class="btn-icon" onclick="admin.deleteMessage(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="message-content">
                    ${message.message}
                </div>
            </div>
        `).join('');
    }

    toggleMessageRead(index) {
        this.messages[index].read = !this.messages[index].read;
        this.saveMessages();
        this.updateMessagesList();
        this.updateMessageCount();
    }

    deleteMessage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            this.messages.splice(index, 1);
            this.saveMessages();
            this.updateMessagesList();
            this.updateMessageCount();
            this.showNotification('Mensaje eliminado correctamente', 'success');
        }
    }

    updateMessageCount() {
        const unreadCount = this.messages.filter(m => !m.read).length;
        const messageCountEl = document.getElementById('message-count');
        const messagesCountEl = document.getElementById('messages-count');

        if (messageCountEl) messageCountEl.textContent = unreadCount;
        if (messagesCountEl) messagesCountEl.textContent = this.messages.length;
    }

    updateImagesCount() {
        const imagesCountEl = document.getElementById('images-count');
        if (imagesCountEl) imagesCountEl.textContent = this.images.length;
    }

    // =====================  Gestión de Imágenes =========================
    loadImages() {
        this.updateImagesGrid();
    }

    updateImagesGrid() {
        const grid = document.getElementById('images-grid');
        if (!grid) return;

        const filterVal = document.getElementById('project-filter')?.value || '';
        const imgs = this.images.filter(img => !filterVal || img.project === filterVal);

        grid.innerHTML = imgs.map(img => `
            <div class="image-item" data-id="${img.id}">
                <img src="${img.url}" alt="${img.alt || img.name}">
                <div class="image-overlay">
                    <button class="btn-icon" onclick="admin.deleteImage(${img.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-label">${img.name}</div>
            </div>
        `).join('');
    }

    setupImageUploadListeners() {
        // Zona e input principal (images.html)
        const fileInput = document.getElementById('file-input');
        if (fileInput && !fileInput.dataset.listenerAttached) {
            fileInput.dataset.listenerAttached = '1';
            fileInput.addEventListener('change', (e) => {
                [...e.target.files].forEach(f => this.addImageFromFile(f));
                fileInput.value = '';
            });
        }

        const uploadZone = document.getElementById('image-upload');
        if (uploadZone && !uploadZone.dataset.listenerAttached) {
            uploadZone.dataset.listenerAttached = '1';
            ['dragover', 'dragenter'].forEach(evt => uploadZone.addEventListener(evt, ev => ev.preventDefault()));
            uploadZone.addEventListener('drop', ev => {
                ev.preventDefault();
                [...ev.dataTransfer.files].forEach(f => this.addImageFromFile(f));
            });
            uploadZone.addEventListener('click', () => {
                document.getElementById('file-input')?.click();
            });
        }

        // Subida específica para proyectos
        const projectInput = document.getElementById('project-file-input');
        if (projectInput && !projectInput.dataset.listenerAttached) {
            projectInput.dataset.listenerAttached = '1';
            projectInput.addEventListener('change', (e) => {
                [...e.target.files].forEach(f => this.addImageFromFile(f, this.currentProject));
                projectInput.value = '';
            });
        }

        const projectZone = document.getElementById('project-image-upload');
        if (projectZone && !projectZone.dataset.listenerAttached) {
            projectZone.dataset.listenerAttached = '1';
            ['dragover', 'dragenter'].forEach(evt => projectZone.addEventListener(evt, ev => ev.preventDefault()));
            projectZone.addEventListener('drop', ev => {
                ev.preventDefault();
                [...ev.dataTransfer.files].forEach(f => this.addImageFromFile(f, this.currentProject));
            });
            projectZone.addEventListener('click', () => {
                document.getElementById('project-file-input')?.click();
            });
        }

        // Filtro de proyecto
        const filterSelect = document.getElementById('project-filter');
        if (filterSelect && !filterSelect.dataset.listenerAttached) {
            filterSelect.dataset.listenerAttached = '1';
            filterSelect.addEventListener('change', () => this.updateImagesGrid());
        }
    }

    addImageFromFile(file, project = '') {
        if (!file.type.startsWith('image/')) {
            this.showNotification('El archivo seleccionado no es una imagen', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('La imagen supera el límite de 5MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const newImg = {
                id: Date.now(),
                name: file.name,
                url: e.target.result,
                alt: file.name,
                project,
                size: (file.size / 1024).toFixed(0) + ' KB',
                date: new Date().toISOString(),
                type: file.type
            };
            this.images.push(newImg);
            if (project) {
                if (!this.projects[project]) this.projects[project] = { id: project, images: {} };
                if (!this.projects[project].images) this.projects[project].images = {};
                const key = 'img' + Object.keys(this.projects[project].images).length;
                this.projects[project].images[key] = newImg.url;
            }
            this.saveAll();
            this.updateImagesGrid();
            this.updateImagesCount();
            this.showNotification('Imagen subida correctamente', 'success');
        };
        reader.readAsDataURL(file);
    }

    addImageFromUrl(url, project = '') {
        if (!url) return;
        // Validación simple de URL
        try { new URL(url); } catch { this.showNotification('URL inválida', 'error'); return; }
        const newImg = {
            id: Date.now(),
            name: url.split('/').pop(),
            url,
            alt: 'Imagen añadida por URL',
            project,
            size: '-',
            date: new Date().toISOString(),
            type: 'url'
        };
        this.images.push(newImg);
        if (project) {
            if (!this.projects[project]) this.projects[project] = { id: project, images: {} };
            if (!this.projects[project].images) this.projects[project].images = {};
            const key = 'img' + Object.keys(this.projects[project].images).length;
            this.projects[project].images[key] = newImg.url;
        }
        this.saveAll();
        this.updateImagesGrid();
        this.updateImagesCount();
        this.showNotification('Imagen añadida correctamente', 'success');
    }

    deleteImage(idOrKey) {
        // Modo 1: eliminar desde galería general por ID numérico
        if (typeof idOrKey === 'number') {
            const index = this.images.findIndex(img => img.id === idOrKey);
            if (index === -1) return;
            if (!confirm('¿Eliminar esta imagen?')) return;

            const [removed] = this.images.splice(index, 1);

            if (removed.project && this.projects[removed.project] && this.projects[removed.project].images) {
                Object.keys(this.projects[removed.project].images).forEach(key => {
                    if (this.projects[removed.project].images[key] === removed.url) {
                        delete this.projects[removed.project].images[key];
                    }
                });
            }

            this.saveAll();
            this.updateImagesGrid();
            this.updateImagesCount();
            this.updateProjectImagesGrid();
            this.showNotification('Imagen eliminada', 'success');
            return;
        }

        // Modo 2: eliminar por clave de imagen del proyecto actual (e.g., 'hero')
        const key = String(idOrKey);
        const proj = this.projects[this.currentProject];
        if (!proj || !proj.images || !(key in proj.images)) return;
        if (!confirm(`¿Eliminar imagen "${key}" del proyecto?`)) return;
        delete proj.images[key];
        this.saveAll();
        this.updateProjectImagesGrid();
        this.showNotification('Imagen del proyecto eliminada', 'success');
    }

    editImage(key) {
        const proj = this.projects[this.currentProject] || (this.projects[this.currentProject] = { id: this.currentProject, images: {} });
        if (!proj.images) proj.images = {};
        const current = proj.images[key] || '';
        const val = prompt(`Nueva URL para la imagen "${key}"`, current);
        if (!val) return;
        try { new URL(val); } catch { this.showNotification('URL inválida', 'error'); return; }
        proj.images[key] = val;
        this.saveAll();
        this.updateProjectImagesGrid();
        this.showNotification('Imagen actualizada', 'success');
    }

    updateProjectImagesGrid() {
        const grid = document.getElementById('project-images-grid');
        if (!grid) return;
        const proj = this.projects[this.currentProject];
        const images = proj?.images || {};

        // Si no hay imágenes definidas aún, mostrar placeholders de claves comunes
        const defaultKeys = ['hero', 'catalog', 'cart', 'admin', 'analytics'];
        const keys = Object.keys(images).length ? Object.keys(images) : defaultKeys;

        grid.innerHTML = keys.map(k => {
            const url = images[k] || `https://via.placeholder.com/400x300/667eea/ffffff?text=${k}`;
            const label = k.charAt(0).toUpperCase() + k.slice(1);
            return `
                <div class="image-item">
                    <img src="${url}" alt="${label}">
                    <div class="image-overlay">
                        <button class="btn-icon" onclick="admin.editImage('${k}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="admin.deleteImage('${k}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="image-label">${label}</div>
                </div>
            `;
        }).join('');
    }

    setupProjectFormListeners() {
        const titleEl = document.getElementById('project-title');
        const subtitleEl = document.getElementById('project-subtitle');
        const descEl = document.getElementById('project-description');
        const techEl = document.getElementById('project-tech');
        const catEl = document.getElementById('project-category');

        const attach = (el, handler) => {
            if (el && !el.dataset.listenerAttached) {
                el.dataset.listenerAttached = '1';
                el.addEventListener('input', handler);
                // Algunos selects no disparan input en todos los navegadores
                el.addEventListener('change', handler);
            }
        };

        attach(titleEl, () => this.updateProjectFromForm());
        attach(subtitleEl, () => this.updateProjectFromForm());
        attach(descEl, () => this.updateProjectFromForm());
        attach(techEl, () => this.updateProjectFromForm());
        attach(catEl, () => this.updateProjectFromForm());
    }

    populateProjectForm() {
        const proj = this.projects[this.currentProject];
        if (!proj) return;
        const titleEl = document.getElementById('project-title');
        const subtitleEl = document.getElementById('project-subtitle');
        const descEl = document.getElementById('project-description');
        const techEl = document.getElementById('project-tech');
        const catEl = document.getElementById('project-category');

        if (titleEl) titleEl.value = proj.title || '';
        if (subtitleEl) subtitleEl.value = proj.subtitle || '';
        if (descEl) descEl.value = proj.description || '';
        if (techEl) techEl.value = proj.tech || '';
        if (catEl) catEl.value = proj.category || 'web';
    }

    updateProjectFromForm() {
        const proj = this.projects[this.currentProject] || (this.projects[this.currentProject] = { id: this.currentProject });
        const titleEl = document.getElementById('project-title');
        const subtitleEl = document.getElementById('project-subtitle');
        const descEl = document.getElementById('project-description');
        const techEl = document.getElementById('project-tech');
        const catEl = document.getElementById('project-category');

        if (titleEl) proj.title = titleEl.value;
        if (subtitleEl) proj.subtitle = subtitleEl.value;
        if (descEl) proj.description = descEl.value;
        if (techEl) proj.tech = techEl.value;
        if (catEl) proj.category = catEl.value;

        this.saveAll();
        // Refrescar lista por si cambió el título o la vista previa
        this.updateProjectsList();
        this.showNotification('Proyecto actualizado', 'success');
    }

    showUrlInputModal(projectScoped = true) {
        const modal = document.getElementById('url-input-modal');
        if (!modal) return;
        const input = modal.querySelector('#url-input-field');
        const saveBtn = modal.querySelector('#url-input-save');
        const closeBtn = modal.querySelector('#url-input-cancel');

        input.value = '';
        modal.style.display = 'flex';

        const onSave = () => {
            const val = input.value.trim();
            if (val) this.addImageFromUrl(val, projectScoped ? this.currentProject : '');
            modal.style.display = 'none';
            cleanup();
        };
        const onClose = () => { modal.style.display = 'none'; cleanup(); };
        const cleanup = () => {
            saveBtn.removeEventListener('click', onSave);
            closeBtn.removeEventListener('click', onClose);
            modal.removeEventListener('click', onBackdrop);
        };
        const onBackdrop = (e) => { if (e.target === modal) onClose(); };

        saveBtn.addEventListener('click', onSave);
        closeBtn.addEventListener('click', onClose);
        modal.addEventListener('click', onBackdrop);
    }

    ensureUrlModal() {
        if (document.getElementById('url-input-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'url-input-modal';
        modal.style.cssText = `
            position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.5); z-index: 10000;
        `;
        modal.innerHTML = `
            <div style="background:#fff; padding:1rem; border-radius:8px; width: min(500px, 92vw); box-shadow:0 10px 30px rgba(0,0,0,0.2)">
                <h3 style="margin:0 0 .75rem 0">Agregar URL de Imagen</h3>
                <input id="url-input-field" type="url" placeholder="https://..." style="width:100%; padding:.75rem; border:1px solid #ddd; border-radius:6px; margin-bottom: .75rem;" />
                <div style="display:flex; gap:.5rem; justify-content:flex-end">
                    <button id="url-input-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="url-input-save" class="btn btn-primary">Agregar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveAll() {
        localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
        localStorage.setItem('portfolio_settings', JSON.stringify(this.settings));
        localStorage.setItem('portfolio_images', JSON.stringify(this.images));
        localStorage.setItem('portfolio_messages', JSON.stringify(this.messages));
    }

    saveMessages() {
        localStorage.setItem('portfolio_messages', JSON.stringify(this.messages));
    }

    setupAutoSave() {
        // Auto-save cada 30 segundos
        setInterval(() => {
            this.saveAll();
        }, 30000);
    }

    // Método de respaldo para mostrar notificaciones
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Crear elemento de notificación visual
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar el panel de administración
document.addEventListener('DOMContentLoaded', () => {
    // Verificar y limpiar URLs antiguas
    checkAndRedirectLegacyUrls();

    window.admin = new AdminPanel();
    console.log('Panel administrativo cargado exitosamente');
});

function checkAndRedirectLegacyUrls() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    const urlParts = currentPath.split('/');
    const currentPage = urlParts[urlParts.length - 1];
    const hash = window.location.hash;

    console.log('🔍 Verificando URL:', currentUrl);

    // Caso 1: URL con formato admin.html#section
    if (currentUrl.includes('admin.html#') || (currentPage === 'admin.html' && hash)) {
        const section = hash ? hash.substring(1) : 'dashboard';

        const sectionMapping = {
            'dashboard': 'dashboard.html',
            'projects': 'projects.html',
            'messages': 'messages.html',
            'images': 'images.html',
            'content': 'content.html',
            'navigation': 'navigation.html',
            'preview': 'preview.html',
            'settings': 'settings.html',
            'backup': 'backup.html'
        };

        if (sectionMapping[section]) {
            console.log(`🚨 URL antigua detectada: admin.html#${section} -> Redirigiendo a ${sectionMapping[section]}`);
            window.location.replace(sectionMapping[section]); // Usar replace para evitar historial
            return;
        }
    }

    // Caso 2: Acceso directo a admin.html sin hash
    if (currentPage === 'admin.html') {
        console.log('🚨 Acceso directo a admin.html -> Redirigiendo al dashboard');
        window.location.replace('dashboard.html');
        return;
    }

    // Caso 3: Cualquier URL que contenga referencias antiguas
    if (currentUrl.includes('admin.html') && !currentUrl.includes('admin/')) {
        console.log('🚨 URL con referencia antigua a admin.html -> Intentando redirigir...');

        // Si la URL contiene admin.html pero no está en el directorio admin/, intentar redirigir
        if (urlParts.length === 2 && urlParts[1] === 'admin.html') {
            window.location.replace('admin/dashboard.html');
            return;
        }
    }

    // Caso 4: Verificar si estamos en una página válida del sistema modular
    const validPages = ['dashboard.html', 'projects.html', 'messages.html', 'images.html', 'content.html', 'navigation.html', 'preview.html', 'settings.html', 'backup.html'];
    const isInAdminDir = urlParts.includes('admin');

    if (isInAdminDir && !validPages.includes(currentPage)) {
        console.log(`🚨 Página no válida en directorio admin: ${currentPage} -> Redirigiendo al dashboard`);
        window.location.replace('dashboard.html');
        return;
    }

    console.log('✅ URL válida, continuando normalmente');
}

// Métodos adicionales para compatibilidad con el HTML
// Crear un proxy que proporcione métodos por defecto para los que faltan
const originalAdmin = window.admin || {};

window.admin = new Proxy(originalAdmin, {
    get(target, prop) {
        if (prop in target) {
            return target[prop];
        }

        // Métodos básicos que pueden estar faltando
        switch(prop) {
            case 'showAddProjectModal':
                return () => {
                    alert('Función showAddProjectModal: Para agregar proyectos, ve a la sección de proyectos y usa el botón "Agregar Proyecto"');
                    window.admin.switchSection('projects');
                };
            case 'editProject':
                return (id) => {
                    alert(`Editando proyecto: ${id}`);
                    window.admin.currentProject = id;
                    window.admin.switchSection('projects');
                };
            case 'deleteProject':
                return (id) => {
                    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${id}"?`)) {
                        delete window.admin.projects[id];
                        window.admin.saveAll();
                        window.admin.updateProjectsList();
                        window.admin.showNotification('Proyecto eliminado correctamente', 'success');
                    }
                };
            case 'editImage':
                return (key) => alert(`Editando imagen: ${key}`);
            case 'deleteImage':
                return (key) => {
                    if (confirm(`¿Eliminar imagen ${key}?`)) {
                        alert(`Imagen ${key} eliminada`);
                    }
                };
            case 'addFeature':
                return () => alert('Agregar nueva característica');
            case 'removeFeature':
                return (element) => {
                    if (element && element.parentElement) {
                        element.parentElement.remove();
                    }
                };
            case 'addService':
                return () => alert('Agregar nuevo servicio');
            case 'removeService':
                return (element) => {
                    if (element && element.parentElement) {
                        element.parentElement.remove();
                    }
                };
            case 'refreshProjectPreview':
                return () => alert('Vista previa actualizada');
            case 'openPreviewInNewTab':
                return () => window.open('preview.html', '_blank');
            case 'addUrlImage':
                return () => alert('Agregar imagen por URL');
            case 'closeModal':
                return (id) => {
                    const modal = document.getElementById(id);
                    if (modal) modal.style.display = 'none';
                };
            case 'showUrlInputModal':
                return () => {
                    const modal = document.getElementById('url-input-modal');
                    if (modal) modal.style.display = 'flex';
                };
            case 'togglePreview':
                return () => {
                    window.location.href = 'preview.html';
                };
            case 'goToDashboard':
                return () => {
                    window.location.href = 'dashboard.html';
                };
            case 'navigateTo':
                return (section) => {
                    window.admin.navigateToSection(section);
                };
            case 'saveAll':
                return () => {
                    window.admin.saveAll();
                    window.admin.showNotification('Datos guardados correctamente', 'success');
                };
            default:
                return () => console.warn(`Método ${prop} no encontrado en admin`);
        }
    }
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanel;
}
