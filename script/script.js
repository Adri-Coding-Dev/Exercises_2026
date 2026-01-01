// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================
const exercisesData = [
    {
        id: 1,
        titulo: "Sistema de Gestión de Biblioteca",
        descripcion: "Implementar un sistema que permita agregar, buscar y prestar libros. Usar principios de POO como herencia y encapsulamiento.",
        nivel: "Intermedio",
        completado: false
    },
    {
        id: 2,
        titulo: "Algoritmo de Ordenamiento Personalizado",
        descripcion: "Crear un algoritmo de ordenamiento eficiente desde cero y comparar su rendimiento con QuickSort y MergeSort.",
        nivel: "Avanzado",
        completado: true
    },
    {
        id: 3,
        titulo: "Calculadora de Expresiones Matemáticas",
        descripcion: "Desarrollar una calculadora que pueda evaluar expresiones matemáticas complejas con paréntesis y funciones trigonométricas.",
        nivel: "Intermedio",
        completado: false
    },
    {
        id: 4,
        titulo: "Simulador de Banco con Hilos",
        descripcion: "Implementar un sistema bancario que simule múltiples transacciones concurrentes usando hilos y sincronización.",
        nivel: "Avanzado",
        completado: false
    },
    {
        id: 5,
        titulo: "Gestor de Tareas con Interfaz de Consola",
        descripcion: "Crear una aplicación de consola que permita agregar, eliminar y marcar tareas como completadas, con persistencia en archivos.",
        nivel: "Principiante",
        completado: true
    },
    {
        id: 6,
        titulo: "Análisis de Texto con Streams",
        descripcion: "Desarrollar un programa que analice un texto y proporcione estadísticas usando streams de Java 8+.",
        nivel: "Intermedio",
        completado: false
    },
    {
        id: 7,
        titulo: "Juego de Ajedrez por Consola",
        descripcion: "Implementar un juego de ajedrez funcional para dos jugadores con todas las reglas y movimientos válidos.",
        nivel: "Avanzado",
        completado: false
    },
    {
        id: 8,
        titulo: "API REST con Spring Boot",
        descripcion: "Crear una API REST completa para un sistema de gestión de estudiantes, con operaciones CRUD y autenticación básica.",
        nivel: "Intermedio",
        completado: false
    },
    {
        id: 9,
        titulo: "Conversor de Unidades con Patrón Factory",
        descripcion: "Desarrollar un conversor de unidades que utilice el patrón de diseño Factory para crear diferentes tipos de conversiones.",
        nivel: "Principiante",
        completado: true
    },
    {
        id: 10,
        titulo: "Sistema de Cache con LRU",
        descripcion: "Implementar un sistema de caché con política de reemplazo LRU (Least Recently Used) desde cero.",
        nivel: "Avanzado",
        completado: false
    }
];

// ============================================================================
// ESTADO DE LA APLICACIÓN
// ============================================================================
const AppState = {
    exercises: [],
    currentFilter: 'all',
    soundEnabled: true,
    currentSeason: '',
    seasonEffectsActive: true
};

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================================================

function initializeApp() {
    initializeExercises();
    initializeSeasonEffects();
    initializeTitleCanvas();
    setupEventListeners();
    updateStats();
    renderExercises();
}

function initializeExercises() {
    const savedExercises = localStorage.getItem('javaExercises2026');
    
    if (savedExercises) {
        AppState.exercises = JSON.parse(savedExercises);
    } else {
        // Cargar desde el archivo JSON en la carpeta data
        fetch('../data/exercises.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                AppState.exercises = data;
                localStorage.setItem('javaExercises2026', JSON.stringify(data));
                updateStats();
                renderExercises();
            })
            .catch(error => {
                console.error('Error al cargar exercises.json:', error);
                // Usar datos por defecto si hay error
                AppState.exercises = exercisesData;
                localStorage.setItem('javaExercises2026', JSON.stringify(exercisesData));
                updateStats();
                renderExercises();
            });
    }
}

function saveExercises() {
    localStorage.setItem('javaExercises2026', JSON.stringify(AppState.exercises));
}

// ============================================================================
// SISTEMA DE EJERCICIOS
// ============================================================================

function updateStats() {
    const total = AppState.exercises.length;
    const completed = AppState.exercises.filter(ex => ex.completado).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalExercises').textContent = total;
    document.getElementById('completedExercises').textContent = completed;
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
}

function renderExercises() {
    const exercisesList = document.getElementById('exercisesList');
    if (!exercisesList) return;
    
    exercisesList.innerHTML = '';
    
    let filteredExercises = [];
    
    switch (AppState.currentFilter) {
        case 'completed':
            filteredExercises = AppState.exercises.filter(ex => ex.completado);
            break;
        case 'pending':
            filteredExercises = AppState.exercises.filter(ex => !ex.completado);
            break;
        default:
            filteredExercises = AppState.exercises;
    }
    
    filteredExercises.forEach(exercise => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = `exercise-card ${exercise.completado ? 'completed' : ''}`;
        exerciseElement.dataset.id = exercise.id;
        
        exerciseElement.innerHTML = `
            <div class="exercise-header">
                <h3 class="exercise-title">${exercise.titulo}</h3>
                <span class="exercise-level">${exercise.nivel}</span>
            </div>
            <p class="exercise-description">${exercise.descripcion}</p>
            <div class="exercise-footer">
                <label class="checkbox-container">
                    <input type="checkbox" ${exercise.completado ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                    <span class="checkbox-label">${exercise.completado ? 'Completado' : 'Marcar como completado'}</span>
                </label>
                <span class="exercise-id">#${exercise.id.toString().padStart(3, '0')}</span>
            </div>
        `;
        
        const checkbox = exerciseElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleExerciseCompletion(exercise.id);
        });
        
        exercisesList.appendChild(exerciseElement);
    });
    
    updateStats();
}

function toggleExerciseCompletion(exerciseId) {
    const exerciseIndex = AppState.exercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex !== -1) {
        AppState.exercises[exerciseIndex].completado = !AppState.exercises[exerciseIndex].completado;
        saveExercises();
        renderExercises();
        showCompletionEffect(AppState.exercises[exerciseIndex].completado);
    }
}

function showCompletionEffect(isCompleted) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontFamily = "'Minecraft', monospace";
    effect.style.fontSize = '2rem';
    effect.style.color = isCompleted ? '#9ece6a' : '#f7768e';
    effect.style.zIndex = '1000';
    effect.style.pointerEvents = 'none';
    effect.style.opacity = '0';
    effect.style.transition = 'opacity 0.5s ease';
    effect.textContent = isCompleted ? '✓ EJERCICIO COMPLETADO' : '✗ EJERCICIO PENDIENTE';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        effect.style.opacity = '0';
    }, 1000);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 1500);
}

// ============================================================================
// SISTEMA DE ESTACIONES
// ============================================================================

function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'primavera';
    if (month >= 6 && month <= 8) return 'verano';
    if (month >= 9 && month <= 11) return 'otoño';
    return 'invierno';
}

function initializeSeasonEffects() {
    const season = getCurrentSeason();
    AppState.currentSeason = season;
    
    const seasonNameMap = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    document.getElementById('seasonName').textContent = seasonNameMap[season];
    
    const seasonOverlay = document.getElementById('seasonOverlay');
    seasonOverlay.className = 'season-overlay';
    
    if (season === 'verano') {
        seasonOverlay.classList.add('summer-overlay');
        
        const summerSound = document.getElementById('summerSound');
        if (summerSound) {
            summerSound.volume = 0.3;
            
            if (AppState.soundEnabled) {
                summerSound.play().catch(e => console.log("Autoplay bloqueado"));
            }
        }
    }
    
    initSeasonCanvas(season);
}

function initSeasonCanvas(season) {
    const canvas = document.getElementById('seasonCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Cancelar animación anterior si existe
    if (window.seasonAnimationId) {
        cancelAnimationFrame(window.seasonAnimationId);
        window.seasonAnimationId = null;
    }
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurar efectos según estación
    if (season === 'invierno') {
        initSnowEffect(canvas, ctx);
    } else if (season === 'primavera') {
        initLeafEffect(canvas, ctx, 'primavera');
    } else if (season === 'otoño') {
        initLeafEffect(canvas, ctx, 'otoño');
    } else if (season === 'verano') {
        // No hay partículas en verano
    }
}

function initSnowEffect(canvas, ctx) {
    const particles = [];
    const particleCount = 150;
    
    // Crear partículas de nieve
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 2 + 0.5,
            sway: Math.random() * 0.5 - 0.25,
            swaySpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    function animateSnow() {
        if (!AppState.seasonEffectsActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.y += particle.speed;
            particle.x += Math.sin(Date.now() * particle.swaySpeed) * particle.sway;
            
            if (particle.y > canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * canvas.width;
            }
            
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        window.seasonAnimationId = requestAnimationFrame(animateSnow);
    }
    
    animateSnow();
}

function initLeafEffect(canvas, ctx, season) {
    const leaves = [];
    const leafCount = season === 'primavera' ? 80 : 100;
    
    // Colores según estación
    const leafColors = season === 'primavera' ? [
        '#9ece6a', '#73daca', '#2ecc71', '#27ae60', '#229954'
    ] : [
        '#ff9e64', '#e0af68', '#d35400', '#e67e22', '#f39c12'
    ];
    
    // Crear hojas
    for (let i = 0; i < leafCount; i++) {
        leaves.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 10 + Math.random() * 20,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            speed: (season === 'primavera' ? 0.5 : 0.8) + Math.random() * 0.5,
            sway: Math.random() * 0.5 - 0.25,
            swaySpeed: Math.random() * 0.005 + 0.002,
            swayAmplitude: 10 + Math.random() * 30
        });
    }
    
    // Función para dibujar una hoja
    function drawLeaf(ctx, leaf) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        
        // Dibujar forma de hoja
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        
        // Forma de hoja más realista
        ctx.moveTo(0, -leaf.size / 2);
        ctx.bezierCurveTo(
            leaf.size / 2, -leaf.size / 3,
            leaf.size / 3, leaf.size / 2,
            0, leaf.size / 3
        );
        ctx.bezierCurveTo(
            -leaf.size / 3, leaf.size / 2,
            -leaf.size / 2, -leaf.size / 3,
            0, -leaf.size / 2
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Dibujar vena central
        ctx.strokeStyle = season === 'primavera' ? '#2c3e50' : '#7e5109';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size / 2);
        ctx.lineTo(0, leaf.size / 3);
        ctx.stroke();
        
        // Dibujar venas laterales
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size / 4);
        ctx.lineTo(leaf.size / 3, -leaf.size / 6);
        ctx.moveTo(0, -leaf.size / 4);
        ctx.lineTo(-leaf.size / 3, -leaf.size / 6);
        ctx.moveTo(0, 0);
        ctx.lineTo(leaf.size / 3, leaf.size / 6);
        ctx.moveTo(0, 0);
        ctx.lineTo(-leaf.size / 3, leaf.size / 6);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Función de animación
    function animateLeaves() {
        if (!AppState.seasonEffectsActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        leaves.forEach(leaf => {
            // Actualizar posición
            leaf.y += leaf.speed;
            leaf.x += Math.sin(Date.now() * leaf.swaySpeed) * leaf.swayAmplitude * leaf.sway;
            leaf.rotation += leaf.rotationSpeed;
            
            // Reiniciar hoja cuando sale de la pantalla
            if (leaf.y > canvas.height + leaf.size) {
                leaf.y = -leaf.size;
                leaf.x = Math.random() * canvas.width;
            }
            
            if (leaf.x > canvas.width + leaf.size) leaf.x = -leaf.size;
            if (leaf.x < -leaf.size) leaf.x = canvas.width + leaf.size;
            
            // Dibujar hoja
            drawLeaf(ctx, leaf);
        });
        
        window.seasonAnimationId = requestAnimationFrame(animateLeaves);
    }
    
    animateLeaves();
}

// ============================================================================
// CANVAS DEL TÍTULO ANIMADO
// ============================================================================

function initializeTitleCanvas() {
    const canvas = document.getElementById('titleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const titleText = "2026";
    let time = 0;
    
    function animateTitle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configuración del texto
        ctx.font = "bold 120px 'Minecraft', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Efecto de glitch
        time += 0.05;
        const glitchAmount = Math.sin(time) * 0.5 + 0.5;
        const glitchOffset = glitchAmount * 2;
        
        // Color principal con efecto de onda
        const hue = (time * 10) % 360;
        const mainColor = `hsl(${hue}, 70%, 65%)`;
        
        // Sombra con efecto de desplazamiento
        ctx.shadowColor = '#7dcfff';
        ctx.shadowBlur = 20 + Math.sin(time * 2) * 5;
        
        // Dibujar texto principal con efecto de distorsión
        ctx.fillStyle = mainColor;
        
        // Aplicar efecto de glitch
        for (let i = 0; i < 3; i++) {
            const offset = (Math.random() - 0.5) * glitchOffset;
            ctx.fillText(titleText, canvas.width / 2 + offset, canvas.height / 2 + offset);
        }
        
        // Efecto de brillo
        ctx.shadowColor = '#bb9af7';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(187, 154, 247, 0.7)';
        ctx.fillText(titleText, canvas.width / 2, canvas.height / 2);
        
        // Restablecer sombra
        ctx.shadowBlur = 0;
        
        // Efecto de partículas alrededor del texto
        drawParticlesAroundText(ctx, canvas, time);
        
        requestAnimationFrame(animateTitle);
    }
    
    animateTitle();
}

function drawParticlesAroundText(ctx, canvas, time) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.5;
        const radius = 100 + Math.sin(time + i) * 20;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        const size = Math.sin(time + i * 0.5) * 2 + 2;
        
        ctx.beginPath();
        ctx.fillStyle = i % 3 === 0 ? '#7dcfff' : i % 3 === 1 ? '#bb9af7' : '#2ac3de';
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================================================
// CONFIGURACIÓN DE EVENTOS
// ============================================================================

function setupEventListeners() {
    // Filtros de ejercicios
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.currentFilter = btn.dataset.filter;
            renderExercises();
        });
    });
    
    // Control de sonido
    const soundControl = document.getElementById('soundControl');
    if (soundControl) {
        soundControl.addEventListener('click', () => {
            AppState.soundEnabled = !AppState.soundEnabled;
            const soundStatus = document.getElementById('soundStatus');
            const summerSound = document.getElementById('summerSound');
            
            if (AppState.soundEnabled) {
                soundStatus.textContent = 'Encendido';
                if (AppState.currentSeason === 'verano' && summerSound) {
                    summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
                }
            } else {
                soundStatus.textContent = 'Apagado';
                if (summerSound) summerSound.pause();
            }
        });
    }
    
    // Permitir la reproducción de audio después de la interacción del usuario
    document.addEventListener('click', () => {
        const summerSound = document.getElementById('summerSound');
        if (AppState.soundEnabled && AppState.currentSeason === 'verano' && summerSound && summerSound.paused) {
            summerSound.play().catch(e => console.log("Reproducción de audio bloqueada"));
        }
    }, { once: true });
    
    // Controles de estación (si existen)
    const seasonControls = document.getElementById('seasonControls');
    if (seasonControls) {
        // Los botones de cambio de estación usarán onclick desde el HTML
    }
}

// ============================================================================
// FUNCIONES DE CAMBIO DE ESTACIÓN (PARA DESARROLLO)
// ============================================================================

function changeSeason(season) {
    const seasonNameMap = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    if (season === 'auto') {
        AppState.currentSeason = getCurrentSeason();
        const seasonControls = document.getElementById('seasonControls');
        if (seasonControls) seasonControls.style.borderColor = 'var(--violet)';
    } else {
        AppState.currentSeason = season;
        const colors = {
            'invierno': '#7dcfff',
            'primavera': '#9ece6a', 
            'verano': '#e0af68',
            'otoño': '#ff9e64'
        };
        const seasonControls = document.getElementById('seasonControls');
        if (seasonControls) seasonControls.style.borderColor = colors[season];
    }
    
    document.getElementById('seasonName').textContent = seasonNameMap[AppState.currentSeason];
    initSeasonCanvas(AppState.currentSeason);
    
    const summerSound = document.getElementById('summerSound');
    if (AppState.currentSeason === 'verano' && AppState.soundEnabled && summerSound) {
        summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
    } else if (summerSound) {
        summerSound.pause();
    }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================================================
// FUNCIONES DE DESARROLLO (PARA PROBAR ESTACIONES)
// ============================================================================

// Hacer las funciones disponibles globalmente para la consola
window.changeSeason = changeSeason;
window.s = {
    primavera: () => changeSeason('primavera'),
    verano: () => changeSeason('verano'),
    otoño: () => changeSeason('otoño'),
    invierno: () => changeSeason('invierno'),
    auto: () => changeSeason('auto'),
    estado: () => console.log(`Estación actual: ${AppState.currentSeason}`)
};

// Funciones para ejercicios (para consola)
window.recargarEjercicios = function() {
    // Forzar recarga desde JSON
    fetch('../data/exercises.json')
        .then(response => response.json())
        .then(data => {
            // Combinar con estado actual de completado
            const currentExercises = AppState.exercises;
            const updatedExercises = data.map(newExercise => {
                const existingExercise = currentExercises.find(e => e.id === newExercise.id);
                if (existingExercise) {
                    return { ...newExercise, completado: existingExercise.completado };
                }
                return { ...newExercise, completado: false };
            });
            
            AppState.exercises = updatedExercises;
            saveExercises();
            renderExercises();
            console.log('✅ Ejercicios recargados desde JSON');
        })
        .catch(error => {
            console.error('Error al recargar ejercicios:', error);
        });
};

window.verEjercicios = () => console.log(AppState.exercises);
window.resetEjercicios = () => {
    localStorage.removeItem('javaExercises2026');
    location.reload();
};