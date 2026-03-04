# 🕺 Visor 3D Interactivo: Animaciones con Three.js y Mixamo

Este proyecto es una aplicación web interactiva en 3D que permite visualizar y controlar un personaje animado en tiempo real directamente desde el navegador. 

## 📌 Datos Académicos
* **Institución:** Instituto Tecnológico de Pachuca
* **Carrera:** Ingeniería en Tecnologías de la Información y Comunicaciones (ITICS)
* **Materia:** Desarrollo de soluciones en ambientes virtuales
* **Alumno:** Luis Enrique Cabrera García

## 🚀 Descripción del Proyecto
La aplicación carga un modelo 3D base y múltiples animaciones independientes en formato `.fbx` utilizando la biblioteca **Three.js**. Mediante el uso de un `AnimationMixer`, el usuario puede interactuar con el personaje utilizando el teclado numérico para cambiar de forma dinámica entre distintos bailes y movimientos, aplicando transiciones suaves (crossfading) entre cada acción.

Además, cuenta con una Interfaz de Usuario (UI) superpuesta al lienzo 3D construida con HTML y CSS, utilizando un diseño moderno de *Glassmorphism* (cristal esmerilado) que reacciona visualmente a los eventos del teclado físico.

## ✨ Características Principales
* **Carga de Modelos FBX:** Importación asíncrona de esqueletos y mallas desde Mixamo.
* **Limpieza de Nombres de Huesos (Regex):** Solución de compatibilidad implementada por código para emparejar la jerarquía de huesos entre el modelo base y las animaciones individuales (`track.name.replace(/.*\|/, '')`).
* **Transiciones Suaves (Crossfading):** Uso de `.fadeIn()` y `.fadeOut()` para mezclar fotogramas y evitar saltos bruscos entre animaciones.
* **Interfaz Reactiva:** Menú de controles HTML/CSS superpuesto con `pointer-events: none` para no interferir con la cámara OrbitControls.
* **Monitor de Rendimiento:** Integración de `Stats.js` para visualizar el consumo de fotogramas por segundo (FPS) en tiempo real.
* **Favicon Optimizado:** Implementación de un favicon renderizado mediante SVG directamente en el código HTML, reduciendo peticiones HTTP.

## 🛠️ Tecnologías Utilizadas
* **Lenguajes:** HTML5, CSS3, JavaScript (ES6)
* **Librerías:** Three.js (WebGL)
* **Modelado y Animación:** Mixamo (Adobe)
* **Formatos:** FBX

## 🎮 Controles de la Aplicación
Al iniciar, el modelo cargará por defecto la animación **Zombie**. Puedes cambiar la animación presionando las siguientes teclas:

* `1` - Thriller
* `2` - Emocionado
* `3` - Breakdance
* `4` - Breakdance (Variación)
* `5` - Snake

*Nota: También puedes usar el ratón para rotar la cámara (clic izquierdo), hacer zoom (rueda del ratón) o desplazar la vista (clic derecho).*

## ⚙️ Instrucciones de Instalación y Uso
Debido a las políticas de seguridad de los navegadores web (CORS) al cargar archivos locales como los `.fbx`, este proyecto no puede abrirse simplemente haciendo doble clic en el archivo `index.html`. 

Para ejecutarlo localmente:
1. Clona este repositorio o descarga los archivos.
2. Abre la carpeta del proyecto en tu editor de código (ej. Visual Studio Code).
3. Inicia un servidor local. Si usas VS Code, puedes instalar la extensión **Live Server** y hacer clic en "Go Live".
4. El proyecto se abrirá automáticamente en tu navegador por defecto (usualmente en `http://127.0.0.1:5500/`).
