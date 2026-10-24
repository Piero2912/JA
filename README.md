# Desafío de los Bandos 🎯

Aplicación web interactiva para dinámicas bíblicas adventistas en iglesias.

## 📋 Descripción

**Desafío de los Bandos** es una aplicación diseñada para dirigir dinámicas competitivas en eventos de iglesia con aproximadamente 100 personas divididas en dos bandos. El animador controla todo desde una laptop conectada a un televisor o proyector, mientras que el público solo observa la pantalla.

### Características principales:

✅ **3 juegos independientes:**
- Juego 1: Imagen que se aclara
- Juego 2: Completa el versículo  
- Juego 3: Ordena la historia con cronómetro

✅ **Tecnología:**
- 100% web, sin backend ni internet
- Almacenamiento local automático
- Exportación/importación de respaldos JSON
- Sonidos mediante Web Audio API
- Animaciones discretas y confeti

✅ **Funcionalidades:**
- Modo presentación (oculta controles del animador)
- Pantalla completa
- Atajos de teclado personalizables
- Marcadores independientes por juego
- Configuración de nombres y colores de bandos

## 🚀 Inicio Rápido

### Opción 1: Abrir directamente (más simple)
1. Descargar o clonar el proyecto
2. Abrir `index.html` en tu navegador (Firefox, Chrome, Edge o Safari)
3. ¡Listo! No requiere instalación

### Opción 2: Con servidor local
```bash
# En el directorio del proyecto
python -m http.server 8000

# Luego abrir en el navegador:
http://localhost:8000
```

## ⌨️ Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl+P` | Alternar modo presentación (oculta controles) |
| `F11` | Pantalla completa |
| `M` | Mostrar ayuda de atajos |
| `ESC` | Volver al menú |
| `1` | Bando Izquierdo (en juegos) |
| `2` | Bando Derecho (en juegos) |
| `0` | Nadie acertó (Juego 2) |

## 📖 Cómo Usar

### Configurar Bandos (primera vez)
1. En el menú principal, clic en "⚙️ Configurar Bandos"
2. Edita nombres y colores
3. Guarda la configuración

### Juego 1: Imagen que se Aclara
1. Crea una ronda: carga imagen, escribe respuesta y elementos
2. Selecciona elemento y bando que lo adivinó → imagen se aclara
3. Cada bando puede intentar adivinar la imagen completa
4. Gana quien adivine primero o quien tenga más puntos

### Juego 2: Completa el Versículo
1. Crea versículos: escribe el texto con palabras en [corchetes]
2. O usa "Generar automáticamente" para ocultar por nivel
3. Durante el juego: selecciona espacio en blanco y asigna resultado (1/2/0)
4. Gana el bando con más puntos

### Juego 3: Ordena la Historia
1. Crea historias con 5 hechos en orden cronológico
2. Al iniciar: cuenta regresiva 3-2-1, cronómetro comienza
3. Arrastra o usa botones para reordenar hechos
4. Presiona "¡Listo!" para validar → se detiene el tiempo
5. Gana el primer bando en completar correctamente

## 💾 Persistencia de Datos

- **Almacenamiento automático** en localStorage del navegador
- **No requiere internet** durante el evento
- **Si recarga la página:** se recupera todo el estado
- **Exportar respaldo:** botón "📥 Exportar" en menú (descarga JSON)
- **Importar respaldo:** botón "📤 Importar" en menú (carga JSON anterior)

## 🔊 Sonidos

- Generados localmente con Web Audio API
- Botón 🔊 en la esquina superior derecha para silenciar
- Sonidos: acierto, error, victoria

## 🎨 Personalización

### Cambiar colores predeterminados
Edita `styles.css`:
```css
:root {
  --color-left: #0066cc;   /* Color Bando Izquierdo */
  --color-right: #cc0000;  /* Color Bando Derecho */
  --color-bg: #1a1a1a;     /* Fondo general */
}
```

### Cambiar tamaños de texto
```css
:root {
  --font-size-lg: 4rem;    /* Títulos */
  --font-size-md: 2.5rem;  /* Subtítulos */
  --font-size-sm: 1.8rem;  /* Contenido */
}
```

## 📁 Estructura del Proyecto

```
desafio-bandos/
├── index.html           # Archivo principal
├── styles.css           # Estilos CSS
├── README.md            # Este archivo
└── js/
    ├── app.js           # Controlador principal
    ├── storage.js       # Gestión de almacenamiento
    ├── audio.js         # Sistema de sonidos
    ├── utils.js         # Funciones auxiliares
    ├── game1.js         # Lógica Juego 1
    ├── game2.js         # Lógica Juego 2
    └── game3.js         # Lógica Juego 3
```

## 🌐 Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚠️ Limitaciones

- **Almacenamiento:** máximo ~5-10MB por navegador
- **Imágenes:** máximo 5MB por imagen
- **Sin conexión en red:** diseñado para trabajar offline completamente

## 🆘 Solución de Problemas

### La app no carga
- Verifica que todos los archivos `.js` estén en la carpeta `js/`
- Prueba en otro navegador
- Abre la consola (F12) para ver errores

### Se perdieron datos
- Verifica que tengas un respaldo JSON (exporta si no tienes)
- Los datos se guardan en localStorage, si borraste caché del navegador se pierden
- Prueba importar desde el respaldo

### Los sonidos no funcionan
- Verifica que el navegador tenga permiso de audio
- Prueba con otro navegador
- Usa el botón 🔊 para activar sonido

### Las imágenes se ven pixeladas
- Es normal: se aclaran progresivamente según los elementos adivinados
- Carga imágenes de buena calidad (1920x1080 o similar)

## 👨‍💻 Desarrollo

El código está organizado y comentado para ser fácil de modificar como estudiante de Sistemas.

### Estructura de datos (localStorage)
```javascript
desafio_config              // Configuración de bandos
desafio_game1_rounds        // Rondas del Juego 1
desafio_game1_session       // Estado actual Juego 1
desafio_game2_verses        // Versículos del Juego 2
desafio_game2_session       // Estado actual Juego 2
desafio_game3_stories       // Historias del Juego 3
desafio_game3_session       // Estado actual Juego 3
```

## 📝 Notas Importantes

- **Derechos de autor:** Los versículos de ejemplo son de dominio público. Verifica las referencias de tu Biblia.
- **Resolución:** Optimizada para 1920×1080 (16:9), pero se adapta a otras resoluciones.
- **Textos grandes:** Diseñada para verse desde el fondo de un salón ~20-30 metros.

## 📞 Soporte

Para dudas o errores, revisa:
1. La consola del navegador (F12)
2. Los atajos de teclado (M)
3. Los archivos `.js` tienen comentarios explicativos

---

**Versión:** 1.0  
**Última actualización:** 2024  
**Licencia:** Uso libre para eventos de iglesia
