// Configuración de imágenes para proyectos
const projectImages = {
    ecommerce: {
        hero: { src: 'img/projects/ecommerce/hero.svg', alt: 'Página Principal del E-Commerce', caption: 'Página principal con diseño moderno y navegación intuitiva' },
        catalog: { src: 'img/projects/ecommerce/catalog.svg', alt: 'Catálogo de Productos', caption: 'Catálogo de productos con filtros y búsqueda avanzada' },
        cart: { src: 'img/projects/ecommerce/cart.svg', alt: 'Carrito de Compras', caption: 'Carrito de compras con cálculo automático de totales' },
        admin: { src: 'img/projects/ecommerce/admin.svg', alt: 'Panel Administrativo', caption: 'Panel de administración para gestión de productos y pedidos' },
        analytics: { src: 'img/projects/ecommerce/analytics.svg', alt: 'Dashboard Analytics', caption: 'Dashboard con analytics y reportes de ventas' },
        mobile: { src: 'img/projects/ecommerce/mobile.svg', alt: 'Vista Móvil', caption: 'Diseño responsivo optimizado para dispositivos móviles' }
    },
    banking: {
        login: { src: 'img/projects/banking/login.svg', alt: 'Pantalla de Login', caption: 'Pantalla de inicio de sesión con autenticación biométrica' },
        dashboard: { src: 'img/projects/banking/dashboard.svg', alt: 'Dashboard Principal', caption: 'Dashboard principal con resumen de cuentas' },
        transfer: { src: 'img/projects/banking/transfer.svg', alt: 'Transferencias', caption: 'Interfaz de transferencias bancarias' },
        payments: { src: 'img/projects/banking/payments.svg', alt: 'Pago de Servicios', caption: 'Módulo de pago de servicios y facturas' },
        history: { src: 'img/projects/banking/history.svg', alt: 'Historial de Transacciones', caption: 'Historial detallado de transacciones' },
        settings: { src: 'img/projects/banking/settings.svg', alt: 'Configuración', caption: 'Panel de configuración y seguridad' }
    },
    analytics: {
        dashboard: { src: 'img/projects/analytics/dashboard.svg', alt: 'Dashboard Principal', caption: 'Vista general del dashboard con métricas principales' },
        charts: { src: 'img/projects/analytics/charts.svg', alt: 'Gráficos Interactivos', caption: 'Gráficos interactivos con zoom y filtros' },
        temporal: { src: 'img/projects/analytics/temporal.svg', alt: 'Análisis Temporal', caption: 'Análisis de tendencias temporales' },
        reports: { src: 'img/projects/analytics/reports.svg', alt: 'Reportes Personalizados', caption: 'Generación de reportes personalizados' },
        alerts: { src: 'img/projects/analytics/alerts.svg', alt: 'Configuración de Alertas', caption: 'Panel de configuración de alertas automáticas' },
        mobile: { src: 'img/projects/analytics/mobile.svg', alt: 'Vista Móvil', caption: 'Dashboard optimizado para dispositivos móviles' }
    },
    cms: {
        dashboard: { src: 'img/projects/cms/dashboard.svg', alt: 'Dashboard CMS', caption: 'Dashboard principal del sistema de gestión' },
        editor: { src: 'img/projects/cms/editor.svg', alt: 'Editor WYSIWYG', caption: 'Editor de contenido con formato avanzado' },
        media: { src: 'img/projects/cms/media.svg', alt: 'Gestión de Medios', caption: 'Gestor de medios con optimización automática' },
        themes: { src: 'img/projects/cms/themes.svg', alt: 'Editor de Temas', caption: 'Editor de temas y plantillas personalizables' },
        users: { src: 'img/projects/cms/users.svg', alt: 'Gestión de Usuarios', caption: 'Panel de gestión de usuarios y permisos' },
        analytics: { src: 'img/projects/cms/analytics.svg', alt: 'Analytics Integrado', caption: 'Dashboard de analytics y métricas de contenido' }
    },
    gaming: {
        lobby: { src: 'img/projects/gaming/lobby.svg', alt: 'Lobby Principal', caption: 'Lobby principal con lista de juegos disponibles' },
        poker: { src: 'img/projects/gaming/poker.svg', alt: 'Sala de Poker', caption: 'Sala de poker multijugador en tiempo real' },
        chat: { src: 'img/projects/gaming/chat.svg', alt: 'Chat Global', caption: 'Sistema de chat global y por sala' },
        rankings: { src: 'img/projects/gaming/rankings.svg', alt: 'Rankings', caption: 'Sistema de rankings y logros' },
        profile: { src: 'img/projects/gaming/profile.svg', alt: 'Perfil de Usuario', caption: 'Perfil de usuario con estadísticas detalladas' },
        tournaments: { src: 'img/projects/gaming/tournaments.svg', alt: 'Torneos', caption: 'Sistema de torneos automáticos' }
    },
    cloud: {
        dashboard: { src: 'img/projects/cloud/dashboard.svg', alt: 'Dashboard Principal', caption: 'Dashboard principal con vista de archivos y carpetas' },
        editor: { src: 'img/projects/cloud/editor.svg', alt: 'Editor Colaborativo', caption: 'Editor colaborativo en tiempo real' },
        versions: { src: 'img/projects/cloud/versions.svg', alt: 'Gestión de Versiones', caption: 'Sistema de versionado y historial de cambios' },
        admin: { src: 'img/projects/cloud/admin.svg', alt: 'Panel Administrativo', caption: 'Panel de administración empresarial' },
        security: { src: 'img/projects/cloud/security.svg', alt: 'Configuración de Seguridad', caption: 'Configuración avanzada de seguridad y permisos' },
        analytics: { src: 'img/projects/cloud/analytics.svg', alt: 'Analytics de Uso', caption: 'Analytics detallados de uso y almacenamiento' }
    }
};

// Función para generar HTML de imágenes
function generateImageHTML(projectName) {
    const images = projectImages[projectName];
    if (!images) return '';
    
    return Object.values(images).map(image => `
        <div class="image-item">
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <p class="image-caption">${image.caption}</p>
        </div>
    `).join('');
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projectImages, generateImageHTML };
}
