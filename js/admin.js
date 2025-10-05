// Panel de Administración Completo
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentProject = 'ecommerce';
        this.currentDevice = 'desktop';
        this.messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        this.images = JSON.parse(localStorage.getItem('portfolio_images') || '[]');
        this.projects = JSON.parse(localStorage.getItem('portfolio_projects') || this.getDefaultProjects());
        this.settings = JSON.parse(localStorage.getItem('portfolio_settings') || this.getDefaultSettings());
        this.init();
    }

    init() {
        // Verificar autenticación
        if (!auth.requireAdmin()) return;

        this.setupEventListeners();
        this.loadUserInfo();
        this.loadDashboard();
        this.loadProjects();
        this.loadImages();
        this.loadMessages();
        this.loadSettings();
        this.setupAutoSave();
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
                url: '',
                github: '',
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
                challenges: 'Uno de los mayores desafíos fue implementar un sistema de pagos seguro y confiable. Integré Stripe para manejar las transacciones y desarrollé un sistema de notificaciones en tiempo real para mantener a los usuarios informados sobre el estado de sus pedidos.',
                results: {
                    satisfaction: '95%',
                    salesIncrease: '40%',
                    loadTime: '2.5s'
                },
                images: {
                    hero: 'img/projects/ecommerce/hero.svg',
                    catalog: 'img/projects/ecommerce/catalog.svg',
                    cart: 'img/projects/ecommerce/cart.svg',
                    admin: 'img/projects/ecommerce/admin.svg',
                    analytics: 'img/projects/ecommerce/analytics.svg',
                    mobile: 'img/projects/ecommerce/mobile.svg'
                }
            },
            banking: {
                id: 'banking',
                title: 'Aplicación Bancaria Móvil',
                subtitle: 'App móvil segura para operaciones bancarias',
                description: 'Desarrollo de una aplicación móvil bancaria con las más altas medidas de seguridad.',
                tech: 'React Native, Firebase, TypeScript',
                category: 'mobile',
                url: '',
                github: '',
                features: [
                    'Autenticación biométrica',
                    'Transferencias instantáneas',
                    'Historial de transacciones',
                    'Notificaciones push'
                ],
                challenges: 'Implementar medidas de seguridad avanzadas para proteger las transacciones financieras.',
                results: {
                    satisfaction: '98%',
                    salesIncrease: '25%',
                    loadTime: '1.8s'
                },
                images: {
                    hero: 'img/projects/banking/hero.svg',
                    login: 'img/projects/banking/login.svg',
                    dashboard: 'img/projects/banking/dashboard.svg',
                    transfer: 'img/projects/banking/transfer.svg'
                }
            }
        };
    }

    getDefaultSettings() {
        return {
            title: 'Jhon Desarrollador',
            subtitle: 'Desarrollador de Software Freelance',
            description: 'Creo experiencias digitales hermosas, funcionales y centradas en el usuario. Especializado en desarrollo web moderno y aplicaciones móviles.',
            adminEmail: 'admin@jhondev.com',
            contactEmail: 'juan.desarrollador@email.com',
            phone: '+1 (555) 123-4567',
            address: 'Ciudad, País',
            social: {
                github: '',
                linkedin: '',
                twitter: '',
                instagram: ''
            },
            content: {
                home: {
                    title: 'Jhon Desarrollador',
                    subtitle: 'Desarrollador de Software Freelance',
                    description: 'Creo experiencias digitales hermosas, funcionales y centradas en el usuario. Especializado en desarrollo web moderno y aplicaciones móviles.'
                },
                about: {
                    title: 'Acerca de Mí',
                    description: 'Soy un desarrollador apasionado con más de 5 años de experiencia creando soluciones digitales innovadoras...'
                },
                services: [
                    {
                        name: 'Desarrollo Web',
                        description: 'Desarrollo de sitios web modernos y responsivos'
                    },
                    {
                        name: 'Aplicaciones Móviles',
                        description: 'Desarrollo de aplicaciones móviles nativas e híbridas'
                    }
                ],
                navigation: [
                    { text: 'Inicio', url: '#home' },
                    { text: 'Acerca de', url: '#about' },
                    { text: 'Proyectos', url: '#projects' },
                    { text: 'Servicios', url: '#services' },
                    { text: 'Contacto', url: '#contact' }
                ]
            }
        };
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

        // Editor de proyectos
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.project;
                this.selectProject(projectId);
            });
        });

        // Editor tabs
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchEditorTab(tabName);
            });
        });

        // Content sections
        document.querySelectorAll('.section-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchContentSection(section);
            });
        });

        // Device selector
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.target.dataset.device;
                this.switchDevice(device);
            });
        });

        // Upload de imágenes
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('image-upload');
        const projectFileInput = document.getElementById('project-file-input');
        const projectUploadArea = document.getElementById('project-image-upload');

        if (fileInput && uploadArea) {
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

            this.setupDragAndDrop(uploadArea, fileInput);
        }

        if (projectFileInput && projectUploadArea) {
            projectFileInput.addEventListener('change', (e) => {
                this.handleProjectImageUpload(e.target.files);
            });

            this.setupDragAndDrop(projectUploadArea, projectFileInput);
        }

        // Filtros
        const projectFilter = document.getElementById('project-filter');
        const messageFilter = document.getElementById('message-filter');

        if (projectFilter) {
            projectFilter.addEventListener('change', (e) => {
                this.filterImages(e.target.value);
            });
        }

        if (messageFilter) {
            messageFilter.addEventListener('change', (e) => {
                this.filterMessages(e.target.value);
            });
        }

        // Formularios
        const projectForm = document.getElementById('project-form');
        const settingsForm = document.getElementById('settings-form');
        const addProjectForm = document.getElementById('add-project-form');

        if (projectForm) {
            projectForm.addEventListener('input', () => {
                this.updateProjectPreview();
            });
        }

        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }

        if (addProjectForm) {
            addProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewProject();
            });
        }

        // Backup file input
        const backupFileInput = document.getElementById('backup-file');
        if (backupFileInput) {
            backupFileInput.addEventListener('change', (e) => {
                this.restoreBackup(e.target.files[0]);
            });
        }

        // Auto-save en inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.debounceAutoSave();
            }
        });
    }

    setupDragAndDrop(uploadArea, fileInput) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
    }

    loadUserInfo() {
        const user = auth.getCurrentUser();
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';
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
            case 'projects':
                this.loadProjects();
                break;
            case 'images':
                this.loadImages();
                break;
            case 'content':
                this.loadContentEditor();
                break;
            case 'navigation':
                this.loadNavigationEditor();
                break;
            case 'preview':
                this.loadPreview();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'backup':
                this.loadBackup();
                break;
        }
    }

    loadDashboard() {
        // Actualizar contadores
        document.getElementById('projects-count').textContent = Object.keys(this.projects).length;
        document.getElementById('images-count').textContent = this.images.length;
        document.getElementById('messages-count').textContent = this.messages.length;
        document.getElementById('message-count').textContent = this.messages.filter(m => !m.read).length;

        // Actualizar actividad reciente
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        const activities = [
            { icon: 'fas fa-plus', text: 'Nuevo proyecto agregado', time: 'Hace 2 horas' },
            { icon: 'fas fa-image', text: 'Imagen actualizada', time: 'Hace 4 horas' },
            { icon: 'fas fa-edit', text: 'Contenido modificado', time: 'Hace 6 horas' },
            { icon: 'fas fa-save', text: 'Configuración guardada', time: 'Hace 1 día' }
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

    loadProjects() {
        this.updateProjectsList();
        this.loadProjectEditor();
    }

    updateProjectsList() {
        const projectsList = document.querySelector('.projects-list');
        const projectsHtml = Object.values(this.projects).map(project => `
            <div class="project-item ${project.id === this.currentProject ? 'active' : ''}" data-project="${project.id}">
                <div class="project-preview">
                    <img src="${project.images.hero}" alt="${project.title}">
                        </div>
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.tech}</p>
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

        // Re-attach event listeners
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.project;
                this.selectProject(projectId);
            });
        });
    }

    selectProject(projectId) {
        this.currentProject = projectId;
        
        // Update UI
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-project="${projectId}"]`).classList.add('active');

        this.loadProjectEditor();
        this.loadProjectPreview(projectId);
    }

    loadProjectEditor() {
        const project = this.projects[this.currentProject];
        if (!project) return;

        // Fill form with project data
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-subtitle').value = project.subtitle;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-tech').value = project.tech;
        document.getElementById('project-category').value = project.category;
        document.getElementById('project-url').value = project.url;
        document.getElementById('project-github').value = project.github;

        // Load features
        this.loadFeatures(project.features);
        
        // Load challenges
        document.getElementById('challenges').value = project.challenges;

        // Load results
        document.querySelectorAll('.result-item input').forEach((input, index) => {
            const values = Object.values(project.results);
            input.value = values[index] || '';
        });

        // Load images
        this.loadProjectImages(project.images);

        // Update preview
        this.updateProjectPreview();
    }

    loadFeatures(features) {
        const featuresList = document.getElementById('features-list');
        featuresList.innerHTML = features.map(feature => `
            <div class="feature-item">
                <input type="text" value="${feature}">
                <button class="btn-icon" onclick="admin.removeFeature(this)">
                    <i class="fas fa-trash"></i>
                    </button>
            </div>
        `).join('');
    }

    loadProjectImages(images) {
        const imagesGrid = document.getElementById('project-images-grid');
        imagesGrid.innerHTML = Object.entries(images).map(([key, src]) => `
            <div class="image-item">
                <img src="${src}" alt="${key}">
                <div class="image-overlay">
                    <button class="btn-icon" onclick="admin.editImage('${key}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="admin.deleteImage('${key}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-label">${key}</div>
            </div>
        `).join('');
    }

    switchEditorTab(tabName) {
        // Update tabs
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Special handling for preview tab
        if (tabName === 'preview') {
            this.updateProjectPreview();
        }
    }

    updateProjectPreview() {
        const project = this.projects[this.currentProject];
        if (!project) return;

        // Update project data from form
        project.title = document.getElementById('project-title').value;
        project.subtitle = document.getElementById('project-subtitle').value;
        project.description = document.getElementById('project-description').value;
        project.tech = document.getElementById('project-tech').value;
        project.category = document.getElementById('project-category').value;
        project.url = document.getElementById('project-url').value;
        project.github = document.getElementById('project-github').value;

        // Update features
        const featureInputs = document.querySelectorAll('#features-list input');
        project.features = Array.from(featureInputs).map(input => input.value).filter(f => f.trim());

        // Update challenges
        project.challenges = document.getElementById('challenges').value;

        // Update results
        const resultInputs = document.querySelectorAll('.result-item input');
        const resultKeys = Object.keys(project.results);
        resultInputs.forEach((input, index) => {
            if (resultKeys[index]) {
                project.results[resultKeys[index]] = input.value;
            }
        });

        // Save to localStorage
        this.saveProjects();

        // Update preview iframe
        const previewFrame = document.getElementById('project-preview-frame');
        if (previewFrame) {
            previewFrame.src = previewFrame.src; // Refresh
        }
    }

    loadImages() {
        const imagesGrid = document.getElementById('images-grid');
        if (!imagesGrid) return;

        if (this.images.length === 0) {
            imagesGrid.innerHTML = '<p>No hay imágenes cargadas</p>';
            return;
        }

        imagesGrid.innerHTML = this.images.map((image, index) => `
            <div class="image-item">
                <img src="${image.url}" alt="${image.name}" loading="lazy">
                <div class="image-overlay">
                    <button class="btn-icon" onclick="admin.editImageData(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="admin.deleteImageData(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="image-label">${image.name}</div>
            </div>
        `).join('');
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.uploadImage(file);
            }
        });
    }

    handleProjectImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.uploadProjectImage(file);
            }
        });
    }

    uploadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                id: Date.now(),
                name: file.name,
                url: e.target.result,
                alt: file.name.replace(/\.[^/.]+$/, ""),
                project: 'general',
                size: this.formatFileSize(file.size),
                date: new Date().toISOString(),
                type: file.type
            };

            this.images.push(imageData);
            this.saveImages();
            this.loadImages();
            this.showNotification('Imagen subida correctamente', 'success');
        };
        reader.readAsDataURL(file);
    }

    uploadProjectImage(file) {
        const imageKey = prompt('Nombre de la imagen (hero, catalog, cart, etc.):', 'hero');
        if (!imageKey) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.projects[this.currentProject].images[imageKey] = e.target.result;
            this.saveProjects();
            this.loadProjectImages(this.projects[this.currentProject].images);
            this.showNotification('Imagen del proyecto actualizada', 'success');
        };
        reader.readAsDataURL(file);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadContentEditor() {
        this.loadContentSection('home');
    }

    switchContentSection(section) {
        // Update navigation
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${section}-content`).classList.add('active');

        this.loadContentSection(section);
    }

    loadContentSection(section) {
        const content = this.settings.content[section];
        if (!content) return;

        switch(section) {
            case 'home':
                document.getElementById('home-title').value = content.title;
                document.getElementById('home-subtitle').value = content.subtitle;
                document.getElementById('home-description').value = content.description;
                break;
            case 'about':
                document.getElementById('about-title').value = content.title;
                document.getElementById('about-description').value = content.description;
                break;
            case 'services':
                this.loadServices(content);
                break;
            case 'contact':
                document.getElementById('contact-email').value = this.settings.contactEmail;
                document.getElementById('contact-phone').value = this.settings.phone;
                document.getElementById('contact-address').value = this.settings.address;
                break;
        }
    }

    loadServices(services) {
        const servicesList = document.getElementById('services-list');
        servicesList.innerHTML = services.map(service => `
            <div class="service-item">
                <input type="text" value="${service.name}" placeholder="Nombre del servicio">
                <textarea placeholder="Descripción del servicio">${service.description}</textarea>
                <button class="btn-icon" onclick="admin.removeService(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    loadNavigationEditor() {
        const navigation = this.settings.content.navigation;
        const navItems = document.getElementById('nav-items');
        
        navItems.innerHTML = navigation.map(item => `
            <div class="nav-item-editor">
                <input type="text" value="${item.text}" placeholder="Texto del enlace">
                <input type="text" value="${item.url}" placeholder="URL o ID">
                <button class="btn-icon" onclick="admin.removeNavItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateNavigationPreview();
    }

    updateNavigationPreview() {
        const navItems = document.querySelectorAll('.nav-item-editor');
        const previewNav = document.getElementById('preview-nav');
        
        previewNav.innerHTML = Array.from(navItems).map(item => {
            const textInput = item.querySelector('input[type="text"]:first-of-type');
            const urlInput = item.querySelector('input[type="text"]:last-of-type');
            return `<a href="${urlInput.value}" class="preview-nav-item">${textInput.value}</a>`;
        }).join('');
    }

    loadPreview() {
        this.initializePreview();
    }

    switchDevice(device) {
        this.currentDevice = device;
        
        // Update buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${device}"]`).classList.add('active');

        // Update preview containers
        const mainContainer = document.querySelector('.preview-frame-container');
        const projectContainer = document.querySelector('.preview-frame');
        
        if (mainContainer) {
            mainContainer.className = `preview-frame-container ${device}`;
        }
        
        if (projectContainer) {
            projectContainer.className = `preview-frame ${device}`;
        }

        // Apply device-specific styles
        this.applyDeviceStyles(device);
        this.updatePreview();
    }

    applyDeviceStyles(device) {
        const previewFrame = document.getElementById('preview-frame');
        const projectPreviewFrame = document.getElementById('project-preview-frame');
        
        if (!previewFrame && !projectPreviewFrame) return;
        
        const frames = [previewFrame, projectPreviewFrame].filter(frame => frame);
        
        frames.forEach(frame => {
            switch(device) {
                case 'desktop':
                    frame.style.width = '100%';
                    frame.style.height = '800px';
                    frame.style.maxWidth = 'none';
                    break;
                case 'tablet':
                    frame.style.width = '768px';
                    frame.style.height = '1024px';
                    frame.style.maxWidth = '768px';
                    frame.style.margin = '0 auto';
                    break;
                case 'mobile':
                    frame.style.width = '375px';
                    frame.style.height = '667px';
                    frame.style.maxWidth = '375px';
                    frame.style.margin = '0 auto';
                    break;
            }
        });
    }

    updatePreview() {
        const previewFrame = document.getElementById('preview-frame');
        const projectPreviewFrame = document.getElementById('project-preview-frame');
        
        if (previewFrame) {
            // Forzar recarga del iframe principal
            const currentSrc = previewFrame.src;
            previewFrame.src = '';
            setTimeout(() => {
                previewFrame.src = currentSrc;
            }, 50);
        }
        
        if (projectPreviewFrame) {
            // Actualizar vista previa del proyecto si hay uno seleccionado
            if (this.currentProject && this.projects[this.currentProject]) {
                const project = this.projects[this.currentProject];
                const projectUrl = `proyecto-${project.slug}.html`;
                projectPreviewFrame.src = projectUrl;
            }
        }
        
        // Actualizar estadísticas de vista previa
        this.updatePreviewStats();
    }

    updatePreviewStats() {
        // Actualizar contador de visitas simuladas
        const visitsElement = document.querySelector('.card-value');
        if (visitsElement && visitsElement.textContent.includes(',')) {
            const currentVisits = parseInt(visitsElement.textContent.replace(/,/g, ''));
            const newVisits = currentVisits + Math.floor(Math.random() * 5) + 1;
            visitsElement.textContent = newVisits.toLocaleString();
        }
        
        // Actualizar última actualización
        const lastUpdateElements = document.querySelectorAll('.stat-value');
        lastUpdateElements.forEach(element => {
            if (element.textContent === 'Hoy') {
                element.textContent = new Date().toLocaleTimeString();
            }
        });
    }

    loadMessages() {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        if (this.messages.length === 0) {
            messagesList.innerHTML = '<p>No hay mensajes</p>';
            return;
        }

        messagesList.innerHTML = this.messages.map((message, index) => `
            <div class="message-item ${message.read ? '' : 'unread'}">
                <div class="message-header">
                    <span class="message-sender">${message.name}</span>
                    <span class="message-date">${new Date(message.date).toLocaleDateString()}</span>
                </div>
                <div class="message-content">${message.message}</div>
                <div class="message-actions">
                    <button class="btn btn-sm btn-primary" onclick="admin.viewMessage(${index})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteMessage(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadSettings() {
        // Load general settings
        document.getElementById('portfolio-title').value = this.settings.title;
        document.getElementById('portfolio-subtitle').value = this.settings.subtitle;
        document.getElementById('portfolio-description').value = this.settings.description;
        document.getElementById('admin-email').value = this.settings.adminEmail;
        document.getElementById('contact-email').value = this.settings.contactEmail;

        // Load social media
        document.getElementById('github-url').value = this.settings.social.github;
        document.getElementById('linkedin-url').value = this.settings.social.linkedin;
        document.getElementById('twitter-url').value = this.settings.social.twitter;
        document.getElementById('instagram-url').value = this.settings.social.instagram;
    }

    loadBackup() {
        // Load backup history
        const backupList = document.getElementById('backup-list');
        const backups = JSON.parse(localStorage.getItem('portfolio_backups') || '[]');
        
        if (backups.length === 0) {
            backupList.innerHTML = '<p>No hay respaldos disponibles</p>';
            return;
        }

        backupList.innerHTML = backups.map((backup, index) => `
            <div class="backup-item">
                <div class="backup-info">
                    <h4>${backup.name}</h4>
                    <p>${new Date(backup.date).toLocaleString()}</p>
                </div>
                <div class="backup-actions">
                    <button class="btn-icon" onclick="admin.restoreBackupFromHistory(${index})">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="btn-icon" onclick="admin.downloadBackupFromHistory(${index})">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Action methods
    addFeature() {
        const featuresList = document.getElementById('features-list');
        const newFeature = document.createElement('div');
        newFeature.className = 'feature-item';
        newFeature.innerHTML = `
            <input type="text" placeholder="Nueva característica">
            <button class="btn-icon" onclick="admin.removeFeature(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        featuresList.appendChild(newFeature);
    }

    removeFeature(button) {
        button.parentElement.remove();
        this.updateProjectPreview();
    }

    addService() {
        const servicesList = document.getElementById('services-list');
        const newService = document.createElement('div');
        newService.className = 'service-item';
        newService.innerHTML = `
            <input type="text" placeholder="Nombre del servicio">
            <textarea placeholder="Descripción del servicio"></textarea>
            <button class="btn-icon" onclick="admin.removeService(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        servicesList.appendChild(newService);
    }

    removeService(button) {
        button.parentElement.remove();
    }

    addNavItem() {
        const navItems = document.getElementById('nav-items');
        const newItem = document.createElement('div');
        newItem.className = 'nav-item-editor';
        newItem.innerHTML = `
            <input type="text" placeholder="Texto del enlace">
            <input type="text" placeholder="URL o ID">
            <button class="btn-icon" onclick="admin.removeNavItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        navItems.appendChild(newItem);
        this.updateNavigationPreview();
    }

    removeNavItem(button) {
        button.parentElement.remove();
        this.updateNavigationPreview();
    }

    showAddProjectModal() {
        document.getElementById('add-project-modal').style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    addNewProject() {
        const title = document.getElementById('new-project-title').value;
        const subtitle = document.getElementById('new-project-subtitle').value;
        const tech = document.getElementById('new-project-tech').value;

        if (!title || !subtitle) {
            this.showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const projectId = title.toLowerCase().replace(/\s+/g, '-');
        this.projects[projectId] = {
            id: projectId,
            title,
            subtitle,
            description: '',
            tech,
            category: 'web',
            url: '',
            github: '',
            features: [],
            challenges: '',
            results: {
                satisfaction: '',
                salesIncrease: '',
                loadTime: ''
            },
            images: {
                hero: 'https://via.placeholder.com/400x300'
            }
        };

        this.saveProjects();
        this.updateProjectsList();
        this.closeModal('add-project-modal');
        this.showNotification('Proyecto agregado exitosamente', 'success');
    }

    editProject(projectId) {
        this.selectProject(projectId);
    }

    deleteProject(projectId) {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            delete this.projects[projectId];
            this.saveProjects();
            this.updateProjectsList();
            this.showNotification('Proyecto eliminado', 'success');
        }
    }

    editImage(imageKey) {
        const newUrl = prompt('Nueva URL de la imagen:', this.projects[this.currentProject].images[imageKey]);
        if (newUrl) {
            this.projects[this.currentProject].images[imageKey] = newUrl;
            this.saveProjects();
            this.loadProjectImages(this.projects[this.currentProject].images);
            this.showNotification('Imagen actualizada', 'success');
        }
    }

    deleteImage(imageKey) {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            delete this.projects[this.currentProject].images[imageKey];
            this.saveProjects();
            this.loadProjectImages(this.projects[this.currentProject].images);
            this.showNotification('Imagen eliminada', 'success');
        }
    }

    editImageData(index) {
        const image = this.images[index];
        const newName = prompt('Nuevo nombre:', image.name);
        const newProject = prompt('Proyecto:', image.project);
        
        if (newName) {
            this.images[index].name = newName;
            this.images[index].alt = newName.replace(/\.[^/.]+$/, "");
        }
        if (newProject) {
            this.images[index].project = newProject;
        }
        
        this.saveImages();
        this.loadImages();
        this.showNotification('Imagen actualizada', 'success');
    }

    deleteImageData(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            this.images.splice(index, 1);
            this.saveImages();
            this.loadImages();
            this.showNotification('Imagen eliminada', 'success');
        }
    }

    viewMessage(index) {
        const message = this.messages[index];
        message.read = true;
        this.saveMessages();
        
        this.showMessageModal(message);
    }

    deleteMessage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            this.messages.splice(index, 1);
            this.saveMessages();
            this.loadMessages();
            this.loadDashboard();
            this.showNotification('Mensaje eliminado', 'success');
        }
    }

    showMessageModal(message) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Mensaje de ${message.name}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <p><strong>Email:</strong> ${message.email}</p>
                    <p><strong>Fecha:</strong> ${new Date(message.date).toLocaleString()}</p>
                    <p><strong>Mensaje:</strong></p>
                    <div class="message-content">${message.message}</div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    filterImages(project) {
        const images = document.querySelectorAll('.image-item');
        images.forEach(item => {
            const imageProject = item.querySelector('.image-label').textContent.toLowerCase();
            if (!project || imageProject.includes(project.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterMessages(status) {
        const messages = document.querySelectorAll('.message-item');
        messages.forEach(message => {
            const isRead = !message.classList.contains('unread');
                if (!status || 
                    (status === 'read' && isRead) || 
                    (status === 'unread' && !isRead)) {
                message.style.display = 'block';
                } else {
                message.style.display = 'none';
                }
        });
            }

    markAllAsRead() {
        this.messages.forEach(message => {
            message.read = true;
        });
        this.saveMessages();
        this.loadMessages();
        this.showNotification('Todos los mensajes marcados como leídos', 'success');
    }

    saveSettings() {
        this.settings.title = document.getElementById('portfolio-title').value;
        this.settings.subtitle = document.getElementById('portfolio-subtitle').value;
        this.settings.description = document.getElementById('portfolio-description').value;
        this.settings.adminEmail = document.getElementById('admin-email').value;
        this.settings.contactEmail = document.getElementById('contact-email').value;

        this.settings.social.github = document.getElementById('github-url').value;
        this.settings.social.linkedin = document.getElementById('linkedin-url').value;
        this.settings.social.twitter = document.getElementById('twitter-url').value;
        this.settings.social.instagram = document.getElementById('instagram-url').value;

        localStorage.setItem('portfolio_settings', JSON.stringify(this.settings));
        this.showNotification('Configuración guardada', 'success');
    }

    createBackup() {
        const backup = {
            name: `Respaldo ${new Date().toLocaleDateString()}`,
            date: new Date().toISOString(),
            data: {
                projects: this.projects,
                images: this.images,
                messages: this.messages,
                settings: this.settings
            }
        };

        const backups = JSON.parse(localStorage.getItem('portfolio_backups') || '[]');
        backups.unshift(backup);
        
        // Keep only last 10 backups
        if (backups.length > 10) {
            backups.splice(10);
        }
        
        localStorage.setItem('portfolio_backups', JSON.stringify(backups));

        // Download backup file
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Respaldo creado y descargado', 'success');
    }

    restoreBackup(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                this.projects = backup.data.projects;
                this.images = backup.data.images;
                this.messages = backup.data.messages;
                this.settings = backup.data.settings;

                this.saveAll();
                this.loadDashboard();
                this.showNotification('Respaldo restaurado exitosamente', 'success');
            } catch (error) {
                this.showNotification('Error al restaurar el respaldo', 'error');
            }
        };
        reader.readAsText(file);
    }

    restoreBackupFromHistory(index) {
        const backups = JSON.parse(localStorage.getItem('portfolio_backups') || '[]');
        const backup = backups[index];
        
        if (confirm('¿Estás seguro de que quieres restaurar este respaldo? Se perderán los datos actuales.')) {
            this.projects = backup.data.projects;
            this.images = backup.data.images;
            this.messages = backup.data.messages;
            this.settings = backup.data.settings;

            this.saveAll();
            this.loadDashboard();
            this.showNotification('Respaldo restaurado exitosamente', 'success');
        }
    }

    downloadBackupFromHistory(index) {
        const backups = JSON.parse(localStorage.getItem('portfolio_backups') || '[]');
        const backup = backups[index];
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${backup.date.split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    refreshPreview() {
        const previewFrame = document.getElementById('preview-frame');
        const projectPreviewFrame = document.getElementById('project-preview-frame');
        
        if (previewFrame) {
            const currentSrc = previewFrame.src;
            previewFrame.src = '';
            setTimeout(() => {
                previewFrame.src = currentSrc;
            }, 100);
        }
        
        if (projectPreviewFrame) {
            const currentSrc = projectPreviewFrame.src;
            projectPreviewFrame.src = '';
            setTimeout(() => {
                projectPreviewFrame.src = currentSrc;
            }, 100);
        }
        
        this.showNotification('Vista previa actualizada', 'success');
    }

    loadProjectPreview(projectId) {
        const project = this.projects[projectId];
        if (!project) return;
        
        const projectPreviewFrame = document.getElementById('project-preview-frame');
        if (projectPreviewFrame) {
            const projectUrl = `proyecto-${project.slug}.html`;
            projectPreviewFrame.src = projectUrl;
            
            // Actualizar información del proyecto en la vista previa
            const previewHeader = document.querySelector('.preview-header h3');
            if (previewHeader) {
                previewHeader.textContent = `Vista Previa: ${project.title}`;
            }
        }
    }

    refreshProjectPreview() {
        if (this.currentProject) {
            this.loadProjectPreview(this.currentProject);
            this.showNotification('Vista previa del proyecto actualizada', 'success');
        }
    }

    toggleAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
            this.showNotification('Actualización automática desactivada', 'info');
        } else {
            this.autoRefreshInterval = setInterval(() => {
                this.updatePreview();
            }, 5000); // Actualizar cada 5 segundos
            this.showNotification('Actualización automática activada', 'success');
        }
    }

    initializePreview() {
        // Inicializar vista previa con configuración por defecto
        this.currentDevice = 'desktop';
        this.loadPreview();
        
        // Configurar auto-refresh opcional
        const autoRefreshBtn = document.querySelector('.auto-refresh-btn');
        if (autoRefreshBtn) {
            autoRefreshBtn.addEventListener('click', () => this.toggleAutoRefresh());
        }
    }

    openPreviewInNewTab() {
        // Determinar qué página abrir según el contexto
        let url = 'index.html';
        
        // Si estamos en la sección de proyectos y hay un proyecto seleccionado
        if (this.currentSection === 'projects' && this.currentProject) {
            const project = this.projects[this.currentProject];
            if (project && project.slug) {
                url = `proyecto-${project.slug}.html`;
            }
        }
        
        // Si estamos en la vista previa de proyectos específicos
        const projectPreviewFrame = document.getElementById('project-preview-frame');
        if (projectPreviewFrame && projectPreviewFrame.src) {
            const frameSrc = projectPreviewFrame.src;
            if (frameSrc.includes('proyecto-')) {
                url = frameSrc.split('/').pop();
            }
        }
        
        window.open(url, '_blank');
    }

    togglePreview() {
        if (this.currentSection === 'preview') {
            this.switchSection('dashboard');
        } else {
            this.switchSection('preview');
        }
    }

    saveAll() {
        this.saveProjects();
        this.saveImages();
        this.saveMessages();
        this.saveSettings();
    }

    saveProjects() {
        localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
    }

    saveImages() {
        localStorage.setItem('portfolio_images', JSON.stringify(this.images));
    }

    saveMessages() {
        localStorage.setItem('portfolio_messages', JSON.stringify(this.messages));
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveAll();
        }, 30000);
    }

    debounceAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveAll();
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar panel de administración
const admin = new AdminPanel();

// Agregar CSS para notificaciones y modales
const style = document.createElement('style');
style.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    }

    .modal-container {
        background: white;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-content {
        padding: 1.5rem;
    }

    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
        text-align: right;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }

    .message-content {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 0.5rem;
        white-space: pre-wrap;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        color: white;
        font-weight: 500;
    }

    .notification-success {
        background: #27ae60;
    }

    .notification-error {
        background: #e74c3c;
    }

    .notification-info {
        background: #3498db;
    }

    .notification-warning {
        background: #f39c12;
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