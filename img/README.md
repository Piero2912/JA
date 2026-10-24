# 🖼️ Carpeta de Imágenes - Juego 1

## Descripción

Esta carpeta está destinada para almacenar imágenes que usarás en el **Juego 1: Imagen que se Aclara**.

## Cómo Usar

### Opción 1: Cargar imágenes desde esta carpeta
1. Coloca tus imágenes JPG o PNG aquí
2. En el editor del Juego 1, haz clic en "📁 Seleccionar imagen"
3. Navega a esta carpeta y elige una imagen
4. Se cargará automáticamente

### Opción 2: Generar imágenes de ejemplo
1. Abre `create-examples.html` en tu navegador
2. Verás 3 imágenes de ejemplo generadas:
   - Arca de Noé
   - Multiplicación de panes
   - David y Goliat
3. Copia el código base64 y úsalo en el editor

## Especificaciones de Imagen

- **Formato:** JPG o PNG
- **Tamaño máximo:** 5 MB
- **Resolución recomendada:** 800×600 px o superior
- **Aspecto recomendado:** 4:3 (como en TV)

## Estructura Sugerida

```
img/
├── README.md                    ← Este archivo
├── create-examples.html         ← Generador de ejemplos
├── noah-ark.jpg                 ← Arca de Noé
├── multiplication-bread.jpg     ← Multiplicación de panes
├── david-goliath.jpg            ← David y Goliat
├── miracles/
│   ├── feeding-5000.jpg
│   └── calming-storm.jpg
└── stories/
    ├── moses-red-sea.jpg
    └── jesus-resurrection.jpg
```

## Notas Importantes

✅ **Las imágenes se guardan en localStorage**
- No necesitas colocar las imágenes aquí después de crearlas
- Se guardan automáticamente en tu navegador
- Usa esta carpeta solo para tener imágenes de referencia

✅ **Cómo hacer respaldo**
- Ve a menú principal
- Haz clic en "📥 Exportar"
- Se descargará un JSON con todas tus rondas (incluyendo imágenes base64)

✅ **Si necesitas reutilizar imágenes**
- Crea varias rondas con la misma imagen
- Cambia solo los elementos a adivinar
- Personaliza los puntos por elemento

## Ejemplo de Flujo

```
1. Abre editor Juego 1
2. Escribe título: "¿Qué es esto?"
3. Escribe respuesta: "Arca de Noé"
4. Haz clic en "📁 Seleccionar imagen"
5. Elige noah-ark.jpg de esta carpeta
6. Añade elementos: "animales", "paloma", "lluvia", "arcoíris"
7. Guarda ronda
8. ¡Lista para jugar!
```

## Resolución de Problemas

**"No puedo ver las imágenes en la carpeta"**
- Las imágenes están en la carpeta `img/`
- Abre el editor del Juego 1 y usa "📁 Seleccionar imagen"
- Navega hasta esta carpeta

**"La imagen se ve muy pixelada"**
- Es normal: la imagen se aclara progresivamente
- Comienza muy borrosa
- Se va clarificando según los elementos que adivinan

**"¿Puedo agregar mis propias imágenes?"**
- Sí, solo colócalas en esta carpeta
- Luego úsalas en el editor del Juego 1
- Deben ser JPG o PNG, máximo 5 MB

## Generar Imágenes Personalizadas

Si quieres crear tus propias imágenes:

1. **Software recomendado:**
   - Paint (Windows)
   - Krita (gratis, profesional)
   - Pixlr (online)
   - Canva (online)

2. **Pasos:**
   - Crea imagen 800×600 px (o similar)
   - Guarda como JPG o PNG
   - Coloca en esta carpeta
   - Usa en el editor

3. **Tips:**
   - Usa colores brillantes (visible desde lejos)
   - Elementos claros y distintos
   - Fondo uniforme
   - Sin texto (o muy poco)

---

**Última actualización:** 2024
**Versión:** 1.0
