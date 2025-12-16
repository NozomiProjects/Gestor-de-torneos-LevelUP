// --- VARIABLES GLOBALES Y ESTADO ---
let equipos = [];
let torneoBracket = [];

// Referencias a elementos del DOM
const formEquipo = document.getElementById('form-equipo');
const listaEquiposContainer = document.getElementById('lista-equipos-container');
const contadorEquiposSpan = document.getElementById('contador-equipos');
const btnBorrarTodo = document.getElementById('btn-borrar-todo');
const navButtons = document.querySelectorAll('.nav-btn');
const secciones = document.querySelectorAll('.seccion');
const bracketContainer = document.getElementById('bracket-visual');
const btnGenerarSorteo = document.getElementById('btn-generar-sorteo');
const btnLimpiarBracket = document.getElementById('btn-limpiar-bracket');
// Referencia al botón PDF (asegúrate de haberlo creado en el HTML)
const btnDescargarPDF = document.getElementById('btn-descargar-pdf');

// --- INICIALIZACIÓN ---
window.addEventListener('DOMContentLoaded', () => {
    cargarDatosLocales();
    renderizarListaEquipos();
    setupNavegacion();
    cargarTorneoGuardado();
    actualizarVisibilidadBotones();
});

// --- NAVEGACIÓN ---
function setupNavegacion() {
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            secciones.forEach(s => s.classList.remove('activa'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('activa');
        });
    });
}

// --- GESTIÓN DE EQUIPOS ---
formEquipo.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreEquipo').value;

    if (!nombre) return;

    const nuevoEquipo = {
        id: Date.now(),
        nombre: nombre,
        capitan: document.getElementById('nickCapitan').value || "-",
        jugadores: [
            document.getElementById('jugador1').value,
            document.getElementById('jugador2').value,
            document.getElementById('jugador3').value,
            document.getElementById('jugador4').value
        ].filter(j => j !== ""),
        suplente: document.getElementById('suplente').value
    };

    equipos.push(nuevoEquipo);
    guardarDatosLocales();
    renderizarListaEquipos();
    formEquipo.reset();
    document.querySelector('[data-target="seccion-lista"]').click();
});

btnBorrarTodo.addEventListener('click', () => {
    if (confirm("¿Borrar todos los equipos?")) {
        equipos = [];
        guardarDatosLocales();
        renderizarListaEquipos();
    }
});

function renderizarListaEquipos() {
    contadorEquiposSpan.textContent = equipos.length;
    listaEquiposContainer.innerHTML = '';

    if (equipos.length === 0) {
        listaEquiposContainer.innerHTML = '<p style="text-align:center; width:100%;">Sin equipos.</p>';
        return;
    }

    equipos.forEach((equipo, index) => {
        const card = document.createElement('div');
        card.classList.add('equipo-card');

        let jugadoresHTML = equipo.jugadores.length > 0
            ? equipo.jugadores.map(j => `<li>👤 ${j}</li>`).join('')
            : '<li>(Sin jugadores registrados)</li>';

        card.innerHTML = `
            <h3>${index + 1}. ${equipo.nombre}</h3>
            <ul>
                <li><span class="capitan-label">👑 Cap: ${equipo.capitan}</span></li>
                ${jugadoresHTML}
            </ul>
        `;
        listaEquiposContainer.appendChild(card);
    });
}

// --- LÓGICA DEL TORNEO ---

function esPotenciaDeDos(n) {
    return n > 1 && (n & (n - 1)) === 0;
}

btnGenerarSorteo.addEventListener('click', () => {
    const total = equipos.length;

    if (!esPotenciaDeDos(total)) {
        if (!confirm(`Tienes ${total} equipos. Se recomienda usar potencias de 2 (4, 8, 16). ¿Continuar de todas formas?`)) {
            return;
        }
    } else {
        if (!confirm(`¿Iniciar torneo con ${total} equipos?`)) return;
    }

    generarArbolCompleto();
});

function generarArbolCompleto() {
    let equiposMezclados = [...equipos];
    equiposMezclados.sort(() => Math.random() - 0.5);

    torneoBracket = [];

    const totalRondas = Math.ceil(Math.log2(equiposMezclados.length));
    let partidosEnRonda = Math.pow(2, totalRondas) / 2;

    for (let r = 0; r < totalRondas; r++) {
        let ronda = [];
        for (let m = 0; m < partidosEnRonda; m++) {
            let partido = {
                id: `R${r + 1}-M${m}`,
                equipo1: null,
                equipo2: null,
                goles1: 0,
                goles2: 0,
                ganador: null,
                jugado: false,
                horario: "",
                evidencia: ""
            };

            if (r === 0) {
                partido.equipo1 = equiposMezclados[m * 2] || null;
                partido.equipo2 = equiposMezclados[(m * 2) + 1] || null;
            }

            ronda.push(partido);
        }
        torneoBracket.push(ronda);
        partidosEnRonda /= 2;
    }

    guardarTorneo();
    renderizarBracket();
    actualizarVisibilidadBotones();
}

// --- RENDERIZADO VISUAL ---

function renderizarBracket() {
    bracketContainer.innerHTML = '';

    torneoBracket.forEach((ronda, indexRonda) => {
        const columnaRonda = document.createElement('div');
        columnaRonda.classList.add('ronda');

        const titulo = document.createElement('h3');
        if (indexRonda === torneoBracket.length - 1) titulo.textContent = "Gran Final 🏆";
        else if (indexRonda === torneoBracket.length - 2) titulo.textContent = "Semifinal";
        else titulo.textContent = `Ronda ${indexRonda + 1}`;
        columnaRonda.appendChild(titulo);

        ronda.forEach((partido, i) => {
            const card = document.createElement('div');
            card.classList.add('partido-card');

            const nombreEq1 = partido.equipo1 ? partido.equipo1.nombre : "--------";
            const nombreEq2 = partido.equipo2 ? partido.equipo2.nombre : "--------";

            const textoHorario = partido.horario ? partido.horario : "Definir Hora";

            // Botón evidencia
            const tieneEvidencia = partido.evidencia && partido.evidencia.trim() !== "";
            const textoBotonEvidencia = tieneEvidencia ? "📷 Ver Foto" : "🔗 Add Foto";
            const claseBotonEvidencia = tieneEvidencia ? "evidence-btn has-link" : "evidence-btn";

            const claseGanador1 = (partido.ganador && partido.equipo1 && partido.ganador.id === partido.equipo1.id) ? 'ganador' : '';
            const claseGanador2 = (partido.ganador && partido.equipo2 && partido.ganador.id === partido.equipo2.id) ? 'ganador' : '';
            const disabled = (!partido.equipo1 || !partido.equipo2) ? 'disabled' : '';

            card.innerHTML = `
                <div class="info-partido">MATCH ${i + 1}</div>
                
                <div class="schedule-container">
                    <span id="text-${partido.id}" class="schedule-text" onclick="editarHorario('${partido.id}')">
                        📅 ${textoHorario}
                    </span>
                    <span id="icon-${partido.id}" class="edit-icon" onclick="editarHorario('${partido.id}')">✏️</span>
                    <input type="text" id="input-${partido.id}" class="schedule-input hidden" 
                           value="${partido.horario || ''}" 
                           placeholder="Ej: 15:00hs"
                           onblur="guardarHorarioInput('${indexRonda}', '${partido.id}', this)"
                           onkeydown="if(event.key === 'Enter') this.blur()">
                           
                    <button class="${claseBotonEvidencia}" onclick="gestionarEvidencia('${indexRonda}', '${partido.id}')" title="Guardar link de captura">
                        ${textoBotonEvidencia}
                    </button>
                    ${tieneEvidencia ? `<a href="${partido.evidencia}" target="_blank" style="font-size:12px; text-decoration:none;">↗️</a>` : ''}
                </div>

                <div class="equipo-partido ${claseGanador1}">
                    <span>${nombreEq1}</span>
                    <input type="number" class="score-input" value="${partido.goles1}" 
                           onchange="actualizarMarcador(${indexRonda}, ${i}, 1, this.value)" ${disabled}>
                </div>
                
                <div class="equipo-partido ${claseGanador2}">
                    <span>${nombreEq2}</span>
                    <input type="number" class="score-input" value="${partido.goles2}" 
                           onchange="actualizarMarcador(${indexRonda}, ${i}, 2, this.value)" ${disabled}>
                </div>

                ${!partido.jugado && !disabled ? `<button class="btn-avanzar" onclick="finalizarPartido(${indexRonda}, ${i})">Finalizar & Avanzar ▶</button>` : ''}
            `;

            columnaRonda.appendChild(card);
        });

        bracketContainer.appendChild(columnaRonda);
    });
}

// --- LÓGICA DE AVANCE ---

function actualizarMarcador(rIndex, pIndex, equipoNum, valor) {
    const partido = torneoBracket[rIndex][pIndex];
    if (partido.jugado) return;

    if (equipoNum === 1) partido.goles1 = parseInt(valor);
    else partido.goles2 = parseInt(valor);

    guardarTorneo();
}

function finalizarPartido(rIndex, pIndex) {
    const partido = torneoBracket[rIndex][pIndex];

    if (partido.goles1 == partido.goles2) {
        alert("¡Empate! Asigna un ganador manualmente.");
        return;
    }

    if (partido.goles1 > partido.goles2) partido.ganador = partido.equipo1;
    else partido.ganador = partido.equipo2;

    partido.jugado = true;

    if (rIndex === torneoBracket.length - 1) {
        confetiCampeon(partido.ganador.nombre);
    } else {
        avanzarSiguienteRonda(rIndex, pIndex, partido.ganador);
    }

    guardarTorneo();
    renderizarBracket();
}

function avanzarSiguienteRonda(rondaActual, indexPartidoActual, equipoGanador) {
    const siguienteRonda = rondaActual + 1;
    if (!torneoBracket[siguienteRonda]) return;

    const indexSiguientePartido = Math.floor(indexPartidoActual / 2);
    const siguienteMatch = torneoBracket[siguienteRonda][indexSiguientePartido];

    if (indexPartidoActual % 2 === 0) {
        siguienteMatch.equipo1 = equipoGanador;
    } else {
        siguienteMatch.equipo2 = equipoGanador;
    }
}

function confetiCampeon(nombreEquipo) {
    alert(`🏆 ¡¡¡TENEMOS CAMPEÓN!!! 🏆\n\nFelicidades al equipo: ${nombreEquipo.toUpperCase()}`);
}

function gestionarEvidencia(rondaIndex, partidoId) {
    const partido = torneoBracket[rondaIndex].find(p => p.id === partidoId);
    if (!partido) return;

    let mensaje = "Pega aquí el link de la captura (Discord, Drive, Imgur):";
    let valorActual = partido.evidencia || "";

    if (valorActual) {
        mensaje = "Edita el link de la captura:";
    }

    const nuevoLink = prompt(mensaje, valorActual);

    if (nuevoLink !== null) {
        partido.evidencia = nuevoLink.trim();
        guardarTorneo();
        renderizarBracket();
    }
}

// --- GENERACIÓN DE PDF (NUEVO) ---

if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener('click', () => {
        // Verificar que jsPDF esté cargado
        if (!window.jspdf) {
            alert("Error: Librería PDF no cargada. Verifica tu conexión a internet.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // 1. Título y Fecha
        doc.setFontSize(22);
        doc.text("Reporte de Torneo - Match Maker", 14, 20);

        doc.setFontSize(10);
        const fecha = new Date().toLocaleString();
        doc.text(`Generado el: ${fecha}`, 14, 28);
        doc.text(`Total de equipos: ${equipos.length}`, 14, 33);

        // 2. Preparar datos para la tabla
        let filasTabla = [];

        torneoBracket.forEach((ronda, indexRonda) => {
            const nombreRonda = `RONDA ${indexRonda + 1}`;

            ronda.forEach((partido, indexPartido) => {
                const p1 = partido.equipo1 ? partido.equipo1.nombre : "(Vacío)";
                const p2 = partido.equipo2 ? partido.equipo2.nombre : "(Vacío)";
                const resultado = `${partido.goles1} - ${partido.goles2}`;

                let ganadorTexto = "-";
                if (partido.jugado && partido.ganador) {
                    ganadorTexto = partido.ganador.nombre;
                }

                // Recortar links muy largos para que no rompan la tabla
                let evidenciaTexto = partido.evidencia || "Sin evidencia";

                filasTabla.push([
                    nombreRonda,
                    `Match ${indexPartido + 1}`,
                    `${p1} vs ${p2}`,
                    resultado,
                    ganadorTexto,
                    evidenciaTexto
                ]);
            });
        });

        // 3. Generar Tabla con AutoTable
        doc.autoTable({
            head: [['Ronda', 'Match', 'Enfrentamiento', 'Score', 'Ganador', 'Link Evidencia']],
            body: filasTabla,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [188, 19, 254] }, // Color Violeta Neón de tu marca
            columnStyles: {
                5: { cellWidth: 50, overflow: 'linebreak' } // La columna de links permite salto de línea
            }
        });

        // 4. Guardar archivo
        doc.save(`Reporte_Torneo_${Date.now()}.pdf`);
    });
}

// --- PERSISTENCIA Y UTILIDADES ---

if (btnLimpiarBracket) {
    btnLimpiarBracket.addEventListener('click', () => {
        if (confirm("¿Reiniciar Torneo? Se borrarán los resultados.")) {
            torneoBracket = [];
            localStorage.removeItem('torneo_data');
            bracketContainer.innerHTML = '';
            actualizarVisibilidadBotones();
        }
    });
}

function actualizarVisibilidadBotones() {
    if (torneoBracket && torneoBracket.length > 0) {
        btnGenerarSorteo.style.display = 'none';
        btnLimpiarBracket.style.display = 'inline-block';
        if (btnDescargarPDF) btnDescargarPDF.style.display = 'inline-block';
    } else {
        btnGenerarSorteo.style.display = 'inline-block';
        btnLimpiarBracket.style.display = 'none';
        if (btnDescargarPDF) btnDescargarPDF.style.display = 'none';
    }
}

function guardarDatosLocales() { localStorage.setItem('torneo_equipos', JSON.stringify(equipos)); }
function cargarDatosLocales() {
    const e = localStorage.getItem('torneo_equipos');
    if (e) equipos = JSON.parse(e);
}
function guardarTorneo() { localStorage.setItem('torneo_data', JSON.stringify(torneoBracket)); }
function cargarTorneoGuardado() {
    const d = localStorage.getItem('torneo_data');
    if (d) {
        torneoBracket = JSON.parse(d);
        renderizarBracket();
    }
}

// --- FUNCIONES PARA EDITAR HORARIO ---

function editarHorario(partidoId) {
    const txt = document.getElementById(`text-${partidoId}`);
    const icn = document.getElementById(`icon-${partidoId}`);
    const inp = document.getElementById(`input-${partidoId}`);

    if (txt) txt.classList.add('hidden');
    if (icn) icn.classList.add('hidden');
    if (inp) {
        inp.classList.remove('hidden');
        inp.focus();
    }
}

function guardarHorarioInput(rondaIndex, partidoId, inputElement) {
    const nuevoHorario = inputElement.value;
    const partido = torneoBracket[rondaIndex].find(p => p.id === partidoId);
    if (partido) {
        partido.horario = nuevoHorario;
    }
    guardarTorneo();
    renderizarBracket();
}