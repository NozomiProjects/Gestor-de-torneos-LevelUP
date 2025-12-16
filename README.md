# 🏆 Match Maker - Gestor de Torneos

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![Estado](https://img.shields.io/badge/estado-funcional-success)
![Tecnología](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-orange)

**Match Maker** es una aplicación web intuitiva y visualmente atractiva diseñada para organizar, gestionar y visualizar torneos de eSports o deportes tradicionales. Funciona completamente en el navegador sin necesidad de bases de datos externas, ofreciendo persistencia de datos y generación de reportes.

---

## 🚀 Funcionalidades Principales

### 1. Gestión de Equipos
* **Registro Completo:** Permite inscribir equipos con nombre, capitán, hasta 4 jugadores y un suplente.
* **Validación:** Sistema inteligente para manejar equipos reales y "BYE" (equipos fantasma para rellenar cuadros).
* **Gestión de Lista:** Visualización en tiempo real de inscritos con opción de borrado masivo.

### 2. Generación de Brackets (Cuadros)
* **Sorteo Aleatorio:** Algoritmo que mezcla los equipos y genera automáticamente los enfrentamientos.
* **Sistema de Rondas:** Generación dinámica desde octavos/cuartos hasta la Gran Final.
* **Interfaz Visual:** Diseño tipo "árbol de torneo" fácil de leer.

### 3. Control de Partidos
* **Marcador en Vivo:** Edición manual de goles/puntos.
* **Avance de Ronda:** Al finalizar un partido, el ganador avanza automáticamente a la siguiente llave.
* **Horarios:** Posibilidad de asignar y editar fecha/hora para cada enfrentamiento individual.

### 4. Evidencia y Reportes (Características Pro)
* **📸 Sistema de Evidencia:** Permite adjuntar links (Discord, Imgur, Drive) a cada partido para validar resultados mediante capturas de pantalla.
* **📄 Exportación a PDF:** Genera un reporte profesional con un solo clic, incluyendo todos los resultados, ganadores y links de evidencia, utilizando la librería `jsPDF`.

### 5. Persistencia de Datos
* **LocalStorage:** Todo el progreso (equipos inscritos, marcadores, configuración del torneo) se guarda automáticamente en el navegador. Puedes cerrar la pestaña y volver más tarde sin perder nada.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica.
* **CSS3:** Diseño responsivo con paleta de colores "Cyberpunk" (Variables CSS, Flexbox).
* **JavaScript (Vanilla):** Lógica del negocio, manipulación del DOM y gestión del LocalStorage.
* **Librerías Externas:**
    * `jsPDF` & `jspdf-autotable`: Para la generación de reportes en PDF desde el cliente.

---

## 📸 Capturas de Pantalla

*(Aquí puedes subir capturas de tu proyecto en funcionamiento. Ejemplos: El formulario de registro y el cuadro del torneo)*

---

## 🔧 Instalación y Uso

Este proyecto es una aplicación web estática, por lo que no requiere instalación de servidores ni bases de datos.

### Opción 1: Ver Online
Visita el despliegue oficial en GitHub Pages:
[🔗 Ver Match Maker en Vivo](https://nozomiprojects.github.io/Gestor-de-torneos-LevelUP/) 

### Opción 2: Ejecutar Localmente
1.  Clona este repositorio o descarga el ZIP.
    ```bash
    git clone [https://github.com/Gabeko/match-maker.git](https://github.com/Gabeko/match-maker.git)
    ```
2.  Abre el archivo `index.html` en tu navegador web favorito (Chrome, Firefox, Edge).
3.  ¡Listo! Ya puedes empezar a gestionar torneos.

---

## 👤 Autor

**Gabeko**

* Desarrollador Web y de videojuegos. Gamer y Entusiasta de los eSports.
* [GitHub Perfil](https://github.com/Gabeko)

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la **Licencia MIT**. Siéntete libre de usarlo, modificarlo y aprender de él.
