// Generador de imágenes SVG para proyectos
// Ejecutar en Node.js para generar todas las imágenes

const fs = require('fs');
const path = require('path');

// Configuración de proyectos
const projects = {
    ecommerce: [
        { name: 'hero', title: 'Página Principal' },
        { name: 'catalog', title: 'Catálogo de Productos' },
        { name: 'cart', title: 'Carrito de Compras' },
        { name: 'admin', title: 'Panel Administrativo' },
        { name: 'analytics', title: 'Dashboard Analytics' },
        { name: 'mobile', title: 'Vista Móvil' }
    ],
    banking: [
        { name: 'login', title: 'Pantalla de Login' },
        { name: 'dashboard', title: 'Dashboard Principal' },
        { name: 'transfer', title: 'Transferencias' },
        { name: 'payments', title: 'Pago de Servicios' },
        { name: 'history', title: 'Historial de Transacciones' },
        { name: 'settings', title: 'Configuración' }
    ],
    analytics: [
        { name: 'dashboard', title: 'Dashboard Principal' },
        { name: 'charts', title: 'Gráficos Interactivos' },
        { name: 'temporal', title: 'Análisis Temporal' },
        { name: 'reports', title: 'Reportes Personalizados' },
        { name: 'alerts', title: 'Configuración de Alertas' },
        { name: 'mobile', title: 'Vista Móvil' }
    ],
    cms: [
        { name: 'dashboard', title: 'Dashboard CMS' },
        { name: 'editor', title: 'Editor WYSIWYG' },
        { name: 'media', title: 'Gestión de Medios' },
        { name: 'themes', title: 'Editor de Temas' },
        { name: 'users', title: 'Gestión de Usuarios' },
        { name: 'analytics', title: 'Analytics Integrado' }
    ],
    gaming: [
        { name: 'lobby', title: 'Lobby Principal' },
        { name: 'poker', title: 'Sala de Poker' },
        { name: 'chat', title: 'Chat Global' },
        { name: 'rankings', title: 'Rankings' },
        { name: 'profile', title: 'Perfil de Usuario' },
        { name: 'tournaments', title: 'Torneos' }
    ],
    cloud: [
        { name: 'dashboard', title: 'Dashboard Principal' },
        { name: 'editor', title: 'Editor Colaborativo' },
        { name: 'versions', title: 'Gestión de Versiones' },
        { name: 'admin', title: 'Panel Administrativo' },
        { name: 'security', title: 'Configuración de Seguridad' },
        { name: 'analytics', title: 'Analytics de Uso' }
    ]
};

// Función para generar SVG
function generateSVG(projectName, imageName, title) {
    const colors = {
        ecommerce: ['#667eea', '#764ba2'],
        banking: ['#667eea', '#764ba2'],
        analytics: ['#667eea', '#764ba2'],
        cms: ['#667eea', '#764ba2'],
        gaming: ['#667eea', '#764ba2'],
        cloud: ['#667eea', '#764ba2']
    };
    
    const [color1, color2] = colors[projectName];
    
    return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${projectName.toUpperCase()}</text>
</svg>`;
}

// Crear directorios y archivos
Object.keys(projects).forEach(projectName => {
    const projectDir = path.join('img', 'projects', projectName);
    
    // Crear directorio si no existe
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Generar imágenes SVG
    projects[projectName].forEach(image => {
        const svgContent = generateSVG(projectName, image.name, image.title);
        const filePath = path.join(projectDir, `${image.name}.svg`);
        fs.writeFileSync(filePath, svgContent);
        console.log(`Generado: ${filePath}`);
    });
});

console.log('✅ Todas las imágenes SVG han sido generadas');
