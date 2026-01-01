// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================
const exercisesData = [
    { "id": 1, "titulo": "Hola Java", "descripcion": "Imprimir por consola el mensaje 'Hola, Java'.", "nivel": "Básico", "completado": false },
  { "id": 2, "titulo": "Tipos primitivos", "descripcion": "Declarar variables de todos los tipos primitivos y mostrarlas por consola.", "nivel": "Básico", "completado": false },
  { "id": 3, "titulo": "Cuadrado de un número", "descripcion": "Leer un número entero desde consola y mostrar su cuadrado.", "nivel": "Básico", "completado": false },
  { "id": 4, "titulo": "Conversiones de tipo", "descripcion": "Convertir un int a double y un double a int.", "nivel": "Básico", "completado": false },
  { "id": 5, "titulo": "Par o impar", "descripcion": "Determinar si un número es par o impar.", "nivel": "Básico", "completado": false },
  { "id": 6, "titulo": "Mayor de tres números", "descripcion": "Calcular el mayor de tres números.", "nivel": "Básico", "completado": false },
  { "id": 7, "titulo": "Día de la semana", "descripcion": "Usar un switch para imprimir el día de la semana.", "nivel": "Básico", "completado": false },
  { "id": 8, "titulo": "Bucles del 1 al 100", "descripcion": "Imprimir los números del 1 al 100 usando for, while y do-while.", "nivel": "Básico", "completado": false },
  { "id": 9, "titulo": "Factorial iterativo", "descripcion": "Calcular el factorial de un número de forma iterativa.", "nivel": "Básico", "completado": false },
  { "id": 10, "titulo": "Suma de naturales", "descripcion": "Calcular la suma de los primeros n números naturales.", "nivel": "Básico", "completado": false },
  { "id": 11, "titulo": "Número primo", "descripcion": "Determinar si un número es primo.", "nivel": "Básico", "completado": false },
  { "id": 12, "titulo": "Invertir número", "descripcion": "Invertir un número entero.", "nivel": "Básico", "completado": false },
  { "id": 13, "titulo": "Pirámide de asteriscos", "descripcion": "Imprimir una pirámide de asteriscos.", "nivel": "Básico", "completado": false },
  { "id": 14, "titulo": "Máximo común divisor", "descripcion": "Calcular el MCD de dos números.", "nivel": "Básico", "completado": false },
  { "id": 15, "titulo": "Fibonacci iterativo", "descripcion": "Implementar la serie de Fibonacci de forma iterativa.", "nivel": "Básico", "completado": false },
  { "id": 16, "titulo": "Contar cifras", "descripcion": "Contar cuántas cifras tiene un número.", "nivel": "Básico", "completado": false },
  { "id": 17, "titulo": "Calculadora por consola", "descripcion": "Simular una calculadora básica por consola.", "nivel": "Básico", "completado": false },
  { "id": 18, "titulo": "Año bisiesto", "descripcion": "Determinar si un año es bisiesto.", "nivel": "Básico", "completado": false },
  { "id": 19, "titulo": "Segundo mayor", "descripcion": "Encontrar el segundo mayor de un conjunto de números.", "nivel": "Básico", "completado": false },
  { "id": 20, "titulo": "Estadísticas aleatorias", "descripcion": "Generar números aleatorios y calcular estadísticas básicas.", "nivel": "Básico", "completado": false },
  { "id": 21, "titulo": "Máximo y mínimo en array", "descripcion": "Encontrar el valor máximo y mínimo de un array.", "nivel": "Intermedio", "completado": false },
  { "id": 22, "titulo": "Media de un array", "descripcion": "Calcular la media de un array de enteros.", "nivel": "Intermedio", "completado": false },
  { "id": 23, "titulo": "Invertir array", "descripcion": "Invertir un array de enteros.", "nivel": "Intermedio", "completado": false },
  { "id": 24, "titulo": "Eliminar duplicados", "descripcion": "Eliminar valores duplicados de un array.", "nivel": "Intermedio", "completado": false },
  { "id": 25, "titulo": "Ordenación manual", "descripcion": "Ordenar un array sin usar Arrays.sort.", "nivel": "Intermedio", "completado": false },
  { "id": 26, "titulo": "Búsqueda en array", "descripcion": "Implementar búsqueda lineal y binaria.", "nivel": "Intermedio", "completado": false },
  { "id": 27, "titulo": "Contar vocales", "descripcion": "Contar las vocales de una cadena.", "nivel": "Intermedio", "completado": false },
  { "id": 28, "titulo": "Palíndromo", "descripcion": "Determinar si una palabra es palíndroma.", "nivel": "Intermedio", "completado": false },
  { "id": 29, "titulo": "Anagramas", "descripcion": "Comprobar si dos palabras son anagramas.", "nivel": "Intermedio", "completado": false },
  { "id": 30, "titulo": "Compresión de cadenas", "descripcion": "Comprimir una cadena contando caracteres consecutivos.", "nivel": "Intermedio", "completado": false },
  { "id": 31, "titulo": "Fibonacci recursivo", "descripcion": "Implementar Fibonacci usando recursividad.", "nivel": "Intermedio", "completado": false },
  { "id": 32, "titulo": "Factorial recursivo", "descripcion": "Calcular factorial mediante recursividad.", "nivel": "Intermedio", "completado": false },
  { "id": 33, "titulo": "Torres de Hanoi", "descripcion": "Resolver el problema de las Torres de Hanoi.", "nivel": "Intermedio", "completado": false },
  { "id": 34, "titulo": "Validador de contraseñas", "descripcion": "Validar contraseñas según reglas configurables.", "nivel": "Intermedio", "completado": false },
  { "id": 35, "titulo": "Combinaciones de cadenas", "descripcion": "Generar combinaciones posibles de una cadena.", "nivel": "Intermedio", "completado": false },
  { "id": 36, "titulo": "Menú reutilizable", "descripcion": "Crear un menú por consola usando métodos reutilizables.", "nivel": "Intermedio", "completado": false },
  { "id": 37, "titulo": "Validador de DNI", "descripcion": "Implementar un validador de DNI.", "nivel": "Intermedio", "completado": false },
  { "id": 38, "titulo": "Separación de capas", "descripcion": "Separar lógica de negocio y entrada/salida.", "nivel": "Intermedio", "completado": false },
  { "id": 39, "titulo": "JavaDoc", "descripcion": "Documentar correctamente el código con JavaDoc.", "nivel": "Intermedio", "completado": false },
  { "id": 40, "titulo": "Diseño de tests mentales", "descripcion": "Definir casos de prueba para tus métodos.", "nivel": "Intermedio", "completado": false },
  { "id": 41, "titulo": "Clase Persona", "descripcion": "Crear una clase Persona con encapsulación correcta.", "nivel": "Intermedio", "completado": false },
  { "id": 42, "titulo": "Herencia Empleado", "descripcion": "Crear una jerarquía Empleado -> Programador.", "nivel": "Intermedio", "completado": false },
  { "id": 43, "titulo": "Polimorfismo", "descripcion": "Usar polimorfismo con métodos sobrescritos.", "nivel": "Intermedio", "completado": false },
  { "id": 44, "titulo": "Clases abstractas e interfaces", "descripcion": "Usar abstract e interface correctamente.", "nivel": "Intermedio", "completado": false },
  { "id": 45, "titulo": "Equals y hashCode", "descripcion": "Sobrescribir equals, hashCode y toString.", "nivel": "Intermedio", "completado": false },
  { "id": 46, "titulo": "Composición vs herencia", "descripcion": "Resolver un caso práctico usando composición.", "nivel": "Intermedio", "completado": false },
  { "id": 47, "titulo": "Clase inmutable", "descripcion": "Crear una clase completamente inmutable.", "nivel": "Intermedio", "completado": false },
  { "id": 48, "titulo": "Enums avanzados", "descripcion": "Crear enums con comportamiento.", "nivel": "Intermedio", "completado": false },
  { "id": 49, "titulo": "Dominio Biblioteca", "descripcion": "Diseñar un pequeño dominio orientado a objetos.", "nivel": "Intermedio", "completado": false },
  { "id": 50, "titulo": "Principios SOLID", "descripcion": "Aplicar principios SOLID en un diseño.", "nivel": "Intermedio", "completado": false },
  { "id": 51, "titulo": "Colecciones básicas", "descripcion": "Uso correcto de List, Set y Map.", "nivel": "Intermedio", "completado": false },
  { "id": 52, "titulo": "ArrayList vs LinkedList", "descripcion": "Comparar ArrayList y LinkedList en la práctica.", "nivel": "Intermedio", "completado": false },
  { "id": 53, "titulo": "Contador de palabras", "descripcion": "Contar ocurrencias de palabras en un texto.", "nivel": "Intermedio", "completado": false },
  { "id": 54, "titulo": "Comparator", "descripcion": "Ordenar objetos usando Comparator.", "nivel": "Intermedio", "completado": false },
  { "id": 55, "titulo": "Filtrado manual", "descripcion": "Filtrar colecciones sin streams.", "nivel": "Intermedio", "completado": false },
  { "id": 56, "titulo": "Genéricos", "descripcion": "Implementar una clase genérica.", "nivel": "Intermedio", "completado": false },
  { "id": 57, "titulo": "Optional", "descripcion": "Usar Optional correctamente.", "nivel": "Intermedio", "completado": false },
  { "id": 58, "titulo": "ConcurrentModificationException", "descripcion": "Evitar ConcurrentModificationException.", "nivel": "Intermedio", "completado": false },
  { "id": 59, "titulo": "Cache simple", "descripcion": "Implementar una cache básica.", "nivel": "Intermedio", "completado": false },
  { "id": 60, "titulo": "Cache LRU", "descripcion": "Implementar un sistema de cache con política LRU.", "nivel": "Avanzado", "completado": false },
  { "id": 61, "titulo": "Excepción personalizada", "descripcion": "Crear excepciones personalizadas.", "nivel": "Intermedio", "completado": false },
  { "id": 62, "titulo": "Try-with-resources", "descripcion": "Usar try-with-resources correctamente.", "nivel": "Intermedio", "completado": false },
  { "id": 63, "titulo": "API segura", "descripcion": "Diseñar una API que falle de forma segura.", "nivel": "Avanzado", "completado": false },
  { "id": 64, "titulo": "Propagación de excepciones", "descripcion": "Decidir cuándo capturar o propagar excepciones.", "nivel": "Avanzado", "completado": false },
  { "id": 65, "titulo": "Validación de entradas", "descripcion": "Validar entradas sin romper el flujo.", "nivel": "Intermedio", "completado": false },
  { "id": 66, "titulo": "Checked vs Unchecked", "descripcion": "Diferenciar checked y unchecked exceptions.", "nivel": "Intermedio", "completado": false },
  { "id": 67, "titulo": "Logging", "descripcion": "Implementar logging en lugar de System.out.", "nivel": "Intermedio", "completado": false },
  { "id": 68, "titulo": "Errores en capas", "descripcion": "Gestionar errores en múltiples capas.", "nivel": "Avanzado", "completado": false },
  { "id": 69, "titulo": "Reintentos", "descripcion": "Implementar reintentos controlados.", "nivel": "Avanzado", "completado": false },
  { "id": 70, "titulo": "Fail-fast vs Fail-safe", "descripcion": "Aplicar estrategias fail-fast y fail-safe.", "nivel": "Avanzado", "completado": false },
  { "id": 71, "titulo": "Lectura y escritura de ficheros", "descripcion": "Leer y escribir ficheros de texto.", "nivel": "Intermedio", "completado": false },
  { "id": 72, "titulo": "Procesar CSV", "descripcion": "Leer y procesar un archivo CSV.", "nivel": "Intermedio", "completado": false },
  { "id": 73, "titulo": "Copia eficiente de archivos", "descripcion": "Copiar archivos grandes eficientemente.", "nivel": "Intermedio", "completado": false },
  { "id": 74, "titulo": "Serialización", "descripcion": "Serializar y deserializar objetos.", "nivel": "Intermedio", "completado": false },
  { "id": 75, "titulo": "Rutas portables", "descripcion": "Manejar rutas de forma portable.", "nivel": "Intermedio", "completado": false },
  { "id": 76, "titulo": "Procesar logs", "descripcion": "Leer y analizar archivos de log.", "nivel": "Intermedio", "completado": false },
  { "id": 77, "titulo": "Mini parser", "descripcion": "Implementar un parser sencillo.", "nivel": "Avanzado", "completado": false },
  { "id": 78, "titulo": "Encoding", "descripcion": "Gestionar correctamente el encoding de texto.", "nivel": "Intermedio", "completado": false },
  { "id": 79, "titulo": "WatchService", "descripcion": "Monitorizar cambios en un directorio.", "nivel": "Avanzado", "completado": false },
  { "id": 80, "titulo": "Import / Export", "descripcion": "Diseñar un sistema de importación y exportación.", "nivel": "Avanzado", "completado": false },
  { "id": 81, "titulo": "Streams básicos", "descripcion": "Reescribir ejercicios usando streams.", "nivel": "Intermedio", "completado": false },
  { "id": 82, "titulo": "Map Filter Reduce", "descripcion": "Usar map, filter y reduce de forma avanzada.", "nivel": "Avanzado", "completado": false },
  { "id": 83, "titulo": "Streams con objetos", "descripcion": "Usar streams sobre colecciones de objetos.", "nivel": "Intermedio", "completado": false },
  { "id": 84, "titulo": "Streams infinitos", "descripcion": "Crear y manejar streams infinitos.", "nivel": "Avanzado", "completado": false },
  { "id": 85, "titulo": "GroupingBy", "descripcion": "Agrupar datos usando groupingBy.", "nivel": "Avanzado", "completado": false },
  { "id": 86, "titulo": "Streams paralelos", "descripcion": "Usar streams paralelos correctamente.", "nivel": "Avanzado", "completado": false },
  { "id": 87, "titulo": "Efectos colaterales", "descripcion": "Evitar efectos colaterales en streams.", "nivel": "Avanzado", "completado": false },
  { "id": 88, "titulo": "Rendimiento streams", "descripcion": "Comparar rendimiento entre loops y streams.", "nivel": "Avanzado", "completado": false },
  { "id": 89, "titulo": "Funcional vs imperativo", "descripcion": "Comparar diseño funcional e imperativo.", "nivel": "Avanzado", "completado": false },
  { "id": 90, "titulo": "Pipeline funcional", "descripcion": "Diseñar un pipeline funcional realista.", "nivel": "Avanzado", "completado": false },
  { "id": 91, "titulo": "Creación de hilos", "descripcion": "Crear y gestionar hilos.", "nivel": "Avanzado", "completado": false },
  { "id": 92, "titulo": "Runnable vs Callable", "descripcion": "Comparar Runnable y Callable.", "nivel": "Avanzado", "completado": false },
  { "id": 93, "titulo": "Sincronización", "descripcion": "Implementar sincronización correcta.", "nivel": "Avanzado", "completado": false },
  { "id": 94, "titulo": "Productor consumidor", "descripcion": "Resolver el problema productor-consumidor.", "nivel": "Avanzado", "completado": false },
  { "id": 95, "titulo": "Deadlocks", "descripcion": "Detectar y evitar deadlocks.", "nivel": "Avanzado", "completado": false },
  { "id": 96, "titulo": "ExecutorService", "descripcion": "Usar ExecutorService.", "nivel": "Avanzado", "completado": false },
  { "id": 97, "titulo": "Futures", "descripcion": "Trabajar con Future y CompletableFuture.", "nivel": "Avanzado", "completado": false },
  { "id": 98, "titulo": "Programación reactiva", "descripcion": "Introducción a programación reactiva.", "nivel": "Avanzado", "completado": false },
  { "id": 99, "titulo": "Colecciones thread-safe", "descripcion": "Usar colecciones thread-safe.", "nivel": "Avanzado", "completado": false },
  { "id": 100, "titulo": "Diseño concurrente", "descripcion": "Diseñar código concurrente limpio.", "nivel": "Avanzado", "completado": false },
  { "id": 101, "titulo": "Arquitectura por capas", "descripcion": "Diseñar una aplicación por capas.", "nivel": "Avanzado", "completado": false },
  { "id": 102, "titulo": "Refactorización", "descripcion": "Refactorizar código espagueti.", "nivel": "Avanzado", "completado": false },
  { "id": 103, "titulo": "Patrones de diseño", "descripcion": "Aplicar patrones de diseño clásicos.", "nivel": "Avanzado", "completado": false },
  { "id": 104, "titulo": "Código testeable", "descripcion": "Escribir código orientado a pruebas.", "nivel": "Avanzado", "completado": false },
  { "id": 105, "titulo": "Diseño de APIs", "descripcion": "Diseñar APIs limpias y coherentes.", "nivel": "Avanzado", "completado": false },
  { "id": 106, "titulo": "Maven o Gradle", "descripcion": "Gestionar dependencias con Maven o Gradle.", "nivel": "Avanzado", "completado": false },
  { "id": 107, "titulo": "Inyección de dependencias", "descripcion": "Aplicar inyección de dependencias.", "nivel": "Avanzado", "completado": false },
  { "id": 108, "titulo": "Configuración", "descripcion": "Gestionar configuración de aplicaciones.", "nivel": "Avanzado", "completado": false },
  { "id": 109, "titulo": "Versionado", "descripcion": "Gestionar versionado y compatibilidad.", "nivel": "Avanzado", "completado": false },
  { "id": 110, "titulo": "Proyecto Java completo", "descripcion": "Diseñar y desarrollar un proyecto Java completo.", "nivel": "Avanzado", "completado": false }
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
