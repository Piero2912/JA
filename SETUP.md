# 🚀 Guía de Instalación y Arranque

## ¿Qué es Desafío de los Bandos?

Una aplicación web completa, funcional y lista para usar para dirigir dinámicas bíblicas en eventos de iglesia.

## ✅ Estado de la Aplicación

- **3 Juegos completamente implementados**: Imagen, Versículo, Historia
- **Almacenamiento automático**: Todos los datos se guardan en el navegador
- **Ejemplos incluidos**: Versículos e historias de ejemplo para comenzar
- **Sin dependencias externas**: 100% JavaScript puro, Web Audio API
- **Totalmente funcional**: Listo para usar sin instalación

## 📦 Archivos Incluidos

```
index.html              ← ABRE ESTO en tu navegador
styles.css              ← Estilos (responsive para TV)
README.md               ← Instrucciones de uso
SETUP.md                ← Este archivo
test.html               ← Verificación de módulos
js/
  ├── app.js            ← Controlador principal (46KB)
  ├── storage.js        ← Persistencia de datos
  ├── audio.js          ← Sonidos Web Audio API
  ├── utils.js          ← Funciones auxiliares
  ├── game1.js          ← Lógica Imagen que se Aclara
  ├── game2.js          ← Lógica Completa el Versículo
  └── game3.js          ← Lógica Ordena la Historia
```

## 🎯 Cómo Comenzar (3 pasos)

### Paso 1: Abrir la Aplicación
```
1. Navega a la carpeta del proyecto
2. Abre "index.html" con tu navegador (Firefox, Chrome, Edge, Safari)
3. Aparecerá el menú principal con 3 botones de juegos
```

**Nota:** No necesitas instalar nada, no requiere servidor web. Simplemente abre el archivo.

### Paso 2: Configurar los Bandos
```
1. Haz clic en "⚙️ Configurar Bandos"
2. Edita nombres (ej: "Equipo Azul", "Equipo Rojo")
3. Cambia los colores si deseas
4. Haz clic en "Guardar Configuración"
```

### Paso 3: Comienza a Jugar
```
1. Selecciona uno de los 3 juegos
2. Crea nuevo contenido (ronda, versículo, historia)
3. ¡Juega! Los datos se guardan automáticamente
```

## 🎮 Prueba Rápida de Verificación

1. Abre `test.html` en tu navegador
2. Deberías ver "✅ Todos los módulos funcionan correctamente!"
3. Si algo falla, te lo indicará

## ⌨️ Atajos Esenciales Durante el Evento

```
Ctrl+P  → Modo presentación (oculta tus controles)
F11     → Pantalla completa
ESC     → Volver al menú
1, 2    → Asignar puntos a bandos
M       → Mostrar ayuda
```

## 💾 Almacenamiento de Datos

**¿Dónde se guardan los datos?**
- En localStorage del navegador (no en servidor, no en nube)
- Aproximadamente 5-10 MB disponibles

**¿Se pierden al cerrar el navegador?**
- No, se guardan permanentemente

**¿Si limpio el caché del navegador?**
- Sí, se pierden. Por eso existe exportar/importar

**¿Cómo hacer un respaldo?**
```
1. En el menú principal
2. Haz clic en "📥 Exportar"
3. Se descargará un archivo JSON
4. Guarda ese archivo en lugar seguro
```

**¿Cómo restaurar desde respaldo?**
```
1. En el menú principal
2. Haz clic en "📤 Importar"
3. Selecciona el archivo JSON descargado
4. Todo se restaura automáticamente
```

## 🔧 Configuración Avanzada

### Cambiar Tamaños de Texto
Edita `styles.css`:
```css
:root {
  --font-size-lg: 4rem;    /* Aumenta si es pequeño */
  --font-size-md: 2.5rem;
  --font-size-sm: 1.8rem;
}
```

### Cambiar Colores por Defecto
```css
:root {
  --color-left: #0066cc;   /* Azul */
  --color-right: #cc0000;  /* Rojo */
  --color-bg: #1a1a1a;     /* Fondo oscuro */
}
```

### Permitir Más/Menos de 5 Hechos en Game 3
Edita `js/game3.js` en la función `renderGame3Editor`:
```javascript
// Cambiar este bucle:
for (let i = 1; i <= 5; i++) {  // Cambia 5 por el número que quieras
```

## 🌐 Usar en Diferentes Navegadores

| Navegador | Funciona | Nota |
|-----------|----------|------|
| Chrome    | ✅ | Recomendado |
| Firefox   | ✅ | Muy bien |
| Edge      | ✅ | Igual a Chrome |
| Safari    | ✅ | Probado en Mac |

## 📺 Proyectar en TV

1. Conecta tu laptop al TV/Proyector con HDMI
2. Abre `index.html` a pantalla completa (F11)
3. Presiona Ctrl+P en la laptop para mostrar "Modo Presentación" (oculta tus botones)
4. El público solo ve el contenido del juego

## 🎨 Estructura Visual en TV

```
┌─────────────────────────────────────────┐
│   TÍTULO DEL JUEGO                      │
├─────────────────────────────────────────┤
│                                         │
│          CONTENIDO GRANDE DEL JUEGO     │
│      (Imagen, Versículos, Historia)    │
│                                         │
├─────────────────────────────────────────┤
│ BANDO IZQ: 50pts  │  BANDO DER: 40pts  │
└─────────────────────────────────────────┘
```

- Diseñada para leerse desde 20-30 metros
- Alto contraste (blanco sobre fondo oscuro)
- Textos mínimo 48px

## ⚠️ Posibles Problemas y Soluciones

### "La aplicación no carga"
**Solución:**
1. Verifica que todos los archivos `.js` estén en la carpeta `js/`
2. Intenta en otro navegador
3. Abre `test.html` para ver si hay errores

### "Se perdieron todos mis datos"
**Solución:**
- Restaura desde tu respaldo JSON (si lo tienes)
- Si no tienes respaldo, lamento pero no se pueden recuperar
- **Acción**: Ahora mismo, haz un respaldo (📥 Exportar)

### "Los sonidos no se escuchan"
**Solución:**
1. Verifica que tu navegador tenga audio habilitado
2. Presiona el botón 🔊 para verificar que no está muted
3. Sube el volumen de tu computadora

### "La pantalla está muy pequeña en el TV"
**Solución:**
1. Aumenta los tamaños en `styles.css`
2. Prueba con F11 (pantalla completa)
3. Aumenta la resolución de tu monitor si es posible

### "Los botones no responden"
**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Si ves errores, copia y revisa el archivo mencionado

## 📝 Verificación Pre-Evento

**Checklist 24 horas antes:**
```
☐ Probé la app en mi laptop
☐ Probé la conexión HDMI/Proyector
☐ Creé y guardé contenido de prueba (al menos 1 ronda/versículo/historia)
☐ Probé los 3 juegos al menos una vez
☐ Exporté un respaldo JSON
☐ Probé el Modo Presentación (Ctrl+P)
☐ Probé Pantalla Completa (F11)
☐ Probé los atajos de teclado (1, 2, 0)
☐ Subí el volumen de sonidos
```

## 🎓 Para Estudiantes de Sistemas

El código está diseñado para ser modificable. Puntos clave:

- **Modular**: Cada juego en su archivo
- **Almacenamiento**: Abstracto en `storage.js`
- **Eventos**: Simples onclick en HTML
- **No usa frameworks**: Solo JavaScript vanilla
- **Comentarios útiles**: En funciones complejas

**Próximas mejoras sugeridas:**
- Agregar más juegos
- Exportar a PDF resultados de sesión
- Agregar soporte para múltiples sesiones
- Integrar con IndexedDB para mayor capacidad

## 📞 Contacto / Soporte

- Revisa el `README.md` para más detalles de uso
- Abre la consola (F12) para ver errores técnicos
- Los archivos `.js` tienen comentarios explicativos

---

**¡Listo! Tu aplicación "Desafío de los Bandos" está lista para funcionar. 🎉**

**Próximos pasos:**
1. Abre `index.html` en tu navegador
2. Configura los bandos
3. Crea contenido de prueba
4. ¡Diviértete con los juegos!
