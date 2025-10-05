// Image Manager - Sistema dinámico de gestión de imágenes
class ImageManager {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('portfolio_projects') || '{}');
        this.init();
    }

    init() {
        this.loadProjectImages();
        this.setupImageUpdates();
    }

    loadProjectImages() {
        // Cargar imágenes dinámicamente desde localStorage
        const projectElements = document.querySelectorAll('[data-project]');
        
        projectElements.forEach(element => {
            const projectId = element.dataset.project;
            const project = this.projects[projectId];
            
            if (project && project.images) {
                const imgElement = element.querySelector('img');
                if (imgElement && project.images.hero) {
                    imgElement.src = project.images.hero;
                }
            }
        });

        // Cargar imágenes en galerías de proyectos
        this.loadProjectGallery();
        
        // Cargar imágenes en la página principal
        this.loadMainPageImages();
    }

    loadMainPageImages() {
        // Actualizar imágenes de proyectos en la página principal
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            const projectIds = ['ecommerce', 'banking', 'analytics', 'cms', 'gaming', 'cloud'];
            const projectId = projectIds[index];
            
            if (projectId && this.projects[projectId] && this.projects[projectId].images) {
                const imgElement = card.querySelector('.project-image img');
                if (imgElement && this.projects[projectId].images.hero) {
                    imgElement.src = this.projects[projectId].images.hero;
                } else if (imgElement) {
                    // Si no hay imagen específica, usar un placeholder
                    imgElement.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${projectId}`;
                }
            }
        });
    }

    loadProjectGallery() {
        const currentPage = this.getCurrentProjectPage();
        if (!currentPage) return;

        const project = this.projects[currentPage];
        const imageGallery = document.querySelector('.image-gallery');
        if (!imageGallery) return;

        // Limpiar galería existente
        imageGallery.innerHTML = '';

        // Si no hay proyecto o imágenes, mostrar placeholders por defecto
        if (!project || !project.images) {
            this.loadDefaultGallery(currentPage);
            return;
        }

        // Cargar imágenes dinámicamente si existen
        Object.entries(project.images || {}).forEach(([key, url]) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            const img = document.createElement('img');
            img.src = url || `https://via.placeholder.com/400x300/667eea/ffffff?text=${currentPage}-${key}`;
            img.alt = this.getImageAlt(key);
            img.loading = 'lazy';
            
            const caption = document.createElement('p');
            caption.className = 'image-caption';
            caption.textContent = this.getImageCaption(key);
            
            imageItem.appendChild(img);
            imageItem.appendChild(caption);
            
            // Agregar botón especial para admin
            if (key === 'admin') {
                const adminBtn = document.createElement('a');
                adminBtn.href = 'admin.html';
                adminBtn.className = 'btn btn-primary admin-demo-btn';
                adminBtn.target = '_blank';
                adminBtn.innerHTML = '<i class="fas fa-cog"></i> Acceder al Panel de Administración';
                imageItem.appendChild(adminBtn);
            }
            
            imageGallery.appendChild(imageItem);
        });

        // Re-inicializar lightbox después de cargar imágenes dinámicamente
        if (typeof initImageLightbox === 'function') {
            initImageLightbox();
        }
    }

    loadDefaultGallery(projectId) {
        const imageGallery = document.querySelector('.image-gallery');
        if (!imageGallery) return;

        // Crear imágenes por defecto para el proyecto
        const defaultImages = {
            ecommerce: [
                { key: 'hero', text: 'Hero+Image' },
                { key: 'catalog', text: 'Catalog' },
                { key: 'cart', text: 'Cart' },
                { key: 'admin', text: 'Admin' },
                { key: 'analytics', text: 'Analytics' },
                { key: 'mobile', text: 'Mobile' }
            ],
            banking: [
                { key: 'hero', text: 'Banking+Hero' },
                { key: 'dashboard', text: 'Dashboard' },
                { key: 'transfer', text: 'Transfer' },
                { key: 'payments', text: 'Payments' },
                { key: 'history', text: 'History' }
            ],
            analytics: [
                { key: 'hero', text: 'Analytics+Hero' },
                { key: 'dashboard', text: 'Dashboard' },
                { key: 'reports', text: 'Reports' },
                { key: 'charts', text: 'Charts' }
            ],
            cms: [
                { key: 'hero', text: 'CMS+Hero' },
                { key: 'admin', text: 'Admin' },
                { key: 'editor', text: 'Editor' },
                { key: 'mobile', text: 'Mobile' }
            ],
            gaming: [
                { key: 'hero', text: 'Gaming+Hero' },
                { key: 'gameplay', text: 'Gameplay' },
                { key: 'leaderboard', text: 'Leaderboard' },
                { key: 'mobile', text: 'Mobile' }
            ],
            cloud: [
                { key: 'hero', text: 'Cloud+Hero' },
                { key: 'dashboard', text: 'Dashboard' },
                { key: 'monitoring', text: 'Monitoring' },
                { key: 'settings', text: 'Settings' }
            ]
        };

        const projectDefaults = defaultImages[projectId] || defaultImages.ecommerce;

        projectDefaults.forEach(({ key, text }) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';

            const img = document.createElement('img');
            img.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${text}`;
            img.alt = this.getImageAlt(key);
            img.loading = 'lazy';

            const caption = document.createElement('p');
            caption.className = 'image-caption';
            caption.textContent = this.getImageCaption(key);

            imageItem.appendChild(img);
            imageItem.appendChild(caption);

            // Agregar botón especial para admin
            if (key === 'admin') {
                const adminBtn = document.createElement('a');
                adminBtn.href = 'admin.html';
                adminBtn.className = 'btn btn-primary admin-demo-btn';
                adminBtn.target = '_blank';
                adminBtn.innerHTML = '<i class="fas fa-cog"></i> Acceder al Panel de Administración';
                imageItem.appendChild(adminBtn);
            }

            imageGallery.appendChild(imageItem);
        });

        // Re-inicializar lightbox después de cargar imágenes por defecto
        if (typeof initImageLightbox === 'function') {
            initImageLightbox();
        }
    }

    getCurrentProjectPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename.includes('proyecto-ecommerce')) return 'ecommerce';
        if (filename.includes('proyecto-banking')) return 'banking';
        if (filename.includes('proyecto-analytics')) return 'analytics';
        if (filename.includes('proyecto-cms')) return 'cms';
        if (filename.includes('proyecto-gaming')) return 'gaming';
        if (filename.includes('proyecto-cloud')) return 'cloud';
        
        return null;
    }

    getImageAlt(key) {
        const altTexts = {
            hero: 'Imagen principal del proyecto',
            catalog: 'Catálogo de productos',
            cart: 'Carrito de compras',
            admin: 'Panel administrativo',
            analytics: 'Dashboard de analytics',
            mobile: 'Vista móvil',
            login: 'Pantalla de login',
            dashboard: 'Dashboard principal',
            transfer: 'Transferencias',
            payments: 'Pagos',
            history: 'Historial',
            settings: 'Configuración'
        };
        
        return altTexts[key] || 'Imagen del proyecto';
    }

    getImageCaption(key) {
        const captions = {
            hero: 'Imagen principal con diseño moderno',
            catalog: 'Catálogo con filtros y búsqueda avanzada',
            cart: 'Carrito de compras con cálculo automático',
            admin: 'Panel de administración completo',
            analytics: 'Dashboard con analytics y reportes',
            mobile: 'Diseño responsivo optimizado para móviles',
            login: 'Pantalla de inicio de sesión segura',
            dashboard: 'Dashboard principal con resumen',
            transfer: 'Interfaz de transferencias',
            payments: 'Módulo de pagos y facturas',
            history: 'Historial detallado de transacciones',
            settings: 'Panel de configuración y seguridad'
        };
        
        return captions[key] || 'Captura de pantalla del proyecto';
    }

    setupImageUpdates() {
        // Escuchar cambios en localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolio_projects') {
                this.projects = JSON.parse(e.newValue || '{}');
                this.loadProjectImages();
            }
        });

        // Actualizar imágenes cada 5 segundos para cambios en tiempo real
        setInterval(() => {
            const newProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '{}');
            if (JSON.stringify(newProjects) !== JSON.stringify(this.projects)) {
                this.projects = newProjects;
                this.loadProjectImages();
            }
        }, 5000);
    }

    // Método para actualizar una imagen específica
    updateImage(projectId, imageKey, newUrl) {
        if (!this.projects[projectId]) {
            this.projects[projectId] = {};
        }
        if (!this.projects[projectId].images) {
            this.projects[projectId].images = {};
        }
        
        this.projects[projectId].images[imageKey] = newUrl;
        localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
        this.loadProjectImages();
    }

    // Método para obtener todas las imágenes de un proyecto
    getProjectImages(projectId) {
        return this.projects[projectId]?.images || {};
    }
}

// Inicializar el gestor de imágenes cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageManager;
}