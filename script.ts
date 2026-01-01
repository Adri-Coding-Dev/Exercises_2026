// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface Ejercicio {
    id: number;
    titulo: string;
    descripcion: string;
    nivel: string;
    completado: boolean;
}

interface AppState {
    exercises: Ejercicio[];
    currentFilter: 'all' | 'completed' | 'pending';
    soundEnabled: boolean;
    currentSeason: string;
    seasonEffectsActive: boolean;
    currentAnimation: number | null;
}

interface Particula {
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    sway: number;
    swaySpeed: number;
    rotation: number;
    rotationSpeed: number;
    velocity: [number, number];
    type: 'snow' | 'leaf';
}

interface HojaParticula extends Particula {
    colorVariation: number;
    shape: number;
}

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const exercisesData: Ejercicio[] = [
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

// Colores para las hojas según la estación
const HOJA_COLORES = {
    primavera: ['#9ece6a', '#73daca', '#2ecc71', '#27ae60', '#229954'],
    otoño: ['#ff9e64', '#e0af68', '#d35400', '#e67e22', '#f39c12']
};

// ============================================================================
// ESTADO DE LA APLICACIÓN
// ============================================================================

const AppState: AppState = {
    exercises: [],
    currentFilter: 'all',
    soundEnabled: true,
    currentSeason: '',
    seasonEffectsActive: true,
    currentAnimation: null
};

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================================================

function initializeApp(): void {
    initializeExercises();
    initializeSeasonEffects();
    initializeTitleCanvas();
    setupEventListeners();
    updateStats();
    renderExercises();
}

function initializeExercises(): void {
    const savedExercises = localStorage.getItem('javaExercises2026');
    
    if (savedExercises) {
        AppState.exercises = JSON.parse(savedExercises);
    } else {
        AppState.exercises = exercisesData;
        localStorage.setItem('javaExercises2026', JSON.stringify(exercisesData));
    }
}

function saveExercises(): void {
    localStorage.setItem('javaExercises2026', JSON.stringify(AppState.exercises));
}

function getCurrentSeason(): string {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'primavera';
    if (month >= 6 && month <= 8) return 'verano';
    if (month >= 9 && month <= 11) return 'otoño';
    return 'invierno';
}

function initializeSeasonEffects(): void {
    const season = getCurrentSeason();
    AppState.currentSeason = season;
    
    const seasonNameMap: { [key: string]: string } = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    document.getElementById('seasonName')!.textContent = seasonNameMap[season];
    
    const seasonOverlay = document.getElementById('seasonOverlay')!;
    seasonOverlay.className = 'season-overlay';
    
    if (season === 'verano') {
        seasonOverlay.classList.add('summer-overlay');
        
        const summerSound = document.getElementById('summerSound') as HTMLAudioElement;
        summerSound.volume = 0.3;
        
        if (AppState.soundEnabled) {
            summerSound.play().catch(e => console.log("Autoplay bloqueado"));
        }
    }
    
    initSeasonCanvas(season);
}

// ============================================================================
// SISTEMA DE HOJAS REALISTAS (PRIMAVERA Y OTOÑO)
// ============================================================================

class SistemaHojas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private hojas: HojaParticula[] = [];
    private animationId: number | null = null;
    
    constructor(canvasId: string, private season: 'primavera' | 'otoño') {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.inicializar();
    }
    
    private inicializar(): void {
        this.ajustarCanvas();
        window.addEventListener('resize', () => this.ajustarCanvas());
        
        const cantidadHojas = this.season === 'primavera' ? 80 : 100;
        this.crearHojas(cantidadHojas);
        this.animar();
    }
    
    private ajustarCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    private crearHojas(cantidad: number): void {
        const colores = HOJA_COLORES[this.season];
        
        for (let i = 0; i < cantidad; i++) {
            const velocidadCaida = this.season === 'primavera' 
                ? 0.5 + Math.random() * 0.5 
                : 0.8 + Math.random() * 0.7;
                
            this.hojas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 12 + Math.random() * 20,
                speed: velocidadCaida,
                color: colores[Math.floor(Math.random() * colores.length)],
                sway: Math.random() * 0.5 - 0.25,
                swaySpeed: Math.random() * 0.005 + 0.002,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.03,
                velocity: [
                    (Math.random() - 0.5) * 0.8,
                    velocidadCaida
                ],
                type: 'leaf',
                colorVariation: Math.random() * 0.3 + 0.7,
                shape: Math.floor(Math.random() * 3) // 0: hoja simple, 1: hoja lobulada, 2: hoja con punta
            });
        }
    }
    
    private dibujarHoja(hoja: HojaParticula): void {
        this.ctx.save();
        this.ctx.translate(hoja.x, hoja.y);
        this.ctx.rotate(hoja.rotation);
        
        // Color base con variación
        const colorBase = this.ctx.createLinearGradient(
            -hoja.size/2, 0,
            hoja.size/2, 0
        );
        
        const colorVariante = this.ajustarBrillo(hoja.color, hoja.colorVariation);
        colorBase.addColorStop(0, hoja.color);
        colorBase.addColorStop(1, colorVariante);
        
        this.ctx.fillStyle = colorBase;
        this.ctx.strokeStyle = this.season === 'primavera' ? '#2c3e50' : '#7e5109';
        this.ctx.lineWidth = 1;
        
        // Dibujar forma de hoja según el tipo
        switch (hoja.shape) {
            case 0:
                this.dibujarHojaSimple(hoja.size);
                break;
            case 1:
                this.dibujarHojaLobulada(hoja.size);
                break;
            case 2:
                this.dibujarHojaConPunta(hoja.size);
                break;
        }
        
        this.ctx.restore();
    }
    
    private dibujarHojaSimple(tamaño: number): void {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, tamaño, tamaño * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Vena central
        this.ctx.beginPath();
        this.ctx.moveTo(0, -tamaño * 0.6);
        this.ctx.lineTo(0, tamaño * 0.6);
        this.ctx.stroke();
    }
    
    private dibujarHojaLobulada(tamaño: number): void {
        const puntos = 5;
        this.ctx.beginPath();
        
        for (let i = 0; i < puntos * 2; i++) {
            const angulo = (i / (puntos * 2)) * Math.PI * 2;
            const radio = i % 2 === 0 ? tamaño : tamaño * 0.7;
            const x = Math.cos(angulo) * radio;
            const y = Math.sin(angulo) * radio * 0.6;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Venas
        this.ctx.beginPath();
        this.ctx.moveTo(0, -tamaño * 0.6);
        this.ctx.lineTo(0, tamaño * 0.6);
        
        for (let i = 1; i < 3; i++) {
            const angulo = i * Math.PI / 4;
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angulo) * tamaño * 0.8, Math.sin(angulo) * tamaño * 0.5);
        }
        
        this.ctx.stroke();
    }
    
    private dibujarHojaConPunta(tamaño: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -tamaño);
        
        // Lado izquierdo
        this.ctx.bezierCurveTo(
            -tamaño * 0.8, -tamaño * 0.2,
            -tamaño * 0.6, tamaño * 0.4,
            0, tamaño * 0.3
        );
        
        // Lado derecho
        this.ctx.bezierCurveTo(
            tamaño * 0.6, tamaño * 0.4,
            tamaño * 0.8, -tamaño * 0.2,
            0, -tamaño
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Venas detalladas
        this.ctx.beginPath();
        this.ctx.moveTo(0, -tamaño);
        this.ctx.lineTo(0, tamaño * 0.3);
        this.ctx.moveTo(0, -tamaño * 0.5);
        this.ctx.lineTo(-tamaño * 0.4, -tamaño * 0.1);
        this.ctx.moveTo(0, -tamaño * 0.5);
        this.ctx.lineTo(tamaño * 0.4, -tamaño * 0.1);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-tamaño * 0.3, tamaño * 0.2);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(tamaño * 0.3, tamaño * 0.2);
        this.ctx.stroke();
    }
    
    private ajustarBrillo(color: string, factor: number): string {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const nuevoR = Math.min(255, Math.floor(r * factor));
        const nuevoG = Math.min(255, Math.floor(g * factor));
        const nuevoB = Math.min(255, Math.floor(b * factor));
        
        return `rgb(${nuevoR}, ${nuevoG}, ${nuevoB})`;
    }
    
    private actualizarHoja(hoja: HojaParticula): void {
        // Movimiento vertical con velocidad variable
        hoja.y += hoja.speed;
        
        // Movimiento horizontal con balanceo
        hoja.x += Math.sin(Date.now() * hoja.swaySpeed) * hoja.sway * 2;
        
        // Rotación natural
        hoja.rotation += hoja.rotationSpeed;
        
        // Variación en la velocidad de caída
        hoja.speed += (Math.random() - 0.5) * 0.1;
        hoja.speed = Math.max(0.3, Math.min(2.0, hoja.speed));
        
        // Variación en el balanceo
        hoja.sway += (Math.random() - 0.5) * 0.05;
        hoja.sway = Math.max(-0.5, Math.min(0.5, hoja.sway));
        
        // Reiniciar posición si sale de la pantalla
        if (hoja.y > this.canvas.height + hoja.size) {
            hoja.y = -hoja.size;
            hoja.x = Math.random() * this.canvas.width;
            hoja.rotation = Math.random() * Math.PI * 2;
            hoja.speed = this.season === 'primavera' 
                ? 0.5 + Math.random() * 0.5 
                : 0.8 + Math.random() * 0.7;
        }
        
        if (hoja.x > this.canvas.width + hoja.size) hoja.x = -hoja.size;
        if (hoja.x < -hoja.size) hoja.x = this.canvas.width + hoja.size;
    }
    
    private animar(): void {
        if (!AppState.seasonEffectsActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.hojas.forEach(hoja => {
            this.actualizarHoja(hoja);
            this.dibujarHoja(hoja);
        });
        
        this.animationId = requestAnimationFrame(() => this.animar());
    }
    
    public detener(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ============================================================================
// SISTEMA DE NIEVE (INVIERNO)
// ============================================================================

class SistemaNieve {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private copos: Particula[] = [];
    private animationId: number | null = null;
    
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.inicializar();
    }
    
    private inicializar(): void {
        this.ajustarCanvas();
        window.addEventListener('resize', () => this.ajustarCanvas());
        
        this.crearCopos(150);
        this.animar();
    }
    
    private ajustarCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    private crearCopos(cantidad: number): void {
        const coloresNieve = ['#ffffff', '#e6f7ff', '#cceeff'];
        
        for (let i = 0; i < cantidad; i++) {
            this.copos.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 0.5,
                color: coloresNieve[Math.floor(Math.random() * coloresNieve.length)],
                sway: Math.random() * 0.5 - 0.25,
                swaySpeed: Math.random() * 0.02 + 0.01,
                rotation: 0,
                rotationSpeed: 0,
                velocity: [0, 0],
                type: 'snow'
            });
        }
    }
    
    private dibujarCopo(copo: Particula): void {
        this.ctx.beginPath();
        this.ctx.arc(copo.x, copo.y, copo.size, 0, Math.PI * 2);
        this.ctx.fillStyle = copo.color;
        
        // Efecto de brillo para copos de nieve
        const gradiente = this.ctx.createRadialGradient(
            copo.x, copo.y, 0,
            copo.x, copo.y, copo.size
        );
        gradiente.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradiente.addColorStop(1, 'rgba(230, 247, 255, 0.4)');
        this.ctx.fillStyle = gradiente;
        
        this.ctx.fill();
        
        // Efecto de cristalización (copos con puntas)
        if (copo.size > 2) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x1 = copo.x + Math.cos(angle) * copo.size * 0.5;
                const y1 = copo.y + Math.sin(angle) * copo.size * 0.5;
                const x2 = copo.x + Math.cos(angle) * copo.size;
                const y2 = copo.y + Math.sin(angle) * copo.size;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
    }
    
    private actualizarCopo(copo: Particula): void {
        copo.y += copo.speed;
        copo.x += Math.sin(Date.now() * copo.swaySpeed) * copo.sway;
        
        // Variación de velocidad según tamaño
        copo.speed += (Math.random() - 0.5) * 0.05;
        copo.speed = Math.max(0.5, Math.min(3.0, copo.speed));
        
        // Reiniciar posición
        if (copo.y > this.canvas.height + copo.size) {
            copo.y = -copo.size;
            copo.x = Math.random() * this.canvas.width;
            copo.size = Math.random() * 4 + 1;
            copo.speed = Math.random() * 2 + 0.5;
        }
        
        if (copo.x > this.canvas.width + copo.size) copo.x = -copo.size;
        if (copo.x < -copo.size) copo.x = this.canvas.width + copo.size;
    }
    
    private animar(): void {
        if (!AppState.seasonEffectsActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.copos.forEach(copo => {
            this.actualizarCopo(copo);
            this.dibujarCopo(copo);
        });
        
        this.animationId = requestAnimationFrame(() => this.animar());
    }
    
    public detener(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ============================================================================
// CONTROL DE EFECTOS ESTACIONALES
// ============================================================================

let sistemaEfectos: SistemaHojas | SistemaNieve | null = null;

function initSeasonCanvas(season: string): void {
    // Detener sistema anterior
    if (sistemaEfectos) {
        sistemaEfectos.detener();
        sistemaEfectos = null;
    }
    
    // Limpiar canvas
    const canvas = document.getElementById('seasonCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ajustar tamaño del canvas
    function resizeCanvas(): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configurar overlay según estación
    const seasonOverlay = document.getElementById('seasonOverlay')!;
    seasonOverlay.className = 'season-overlay';
    
    // Inicializar sistema según estación
    if (season === 'invierno') {
        sistemaEfectos = new SistemaNieve('seasonCanvas');
        seasonOverlay.style.opacity = '0.1';
    } 
    else if (season === 'primavera' || season === 'otoño') {
        sistemaEfectos = new SistemaHojas('seasonCanvas', season as 'primavera' | 'otoño');
        seasonOverlay.style.opacity = '0.05';
    }
    else if (season === 'verano') {
        seasonOverlay.classList.add('summer-overlay');
        seasonOverlay.style.opacity = '0.1';
        
        const summerSound = document.getElementById('summerSound') as HTMLAudioElement;
        summerSound.volume = 0.3;
        
        if (AppState.soundEnabled) {
            summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
        }
    }
}

function changeSeason(season: string): void {
    const seasonNameMap: { [key: string]: string } = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    if (season === 'auto') {
        AppState.currentSeason = getCurrentSeason();
        document.getElementById('seasonControls')!.style.borderColor = 'var(--violet)';
    } else {
        AppState.currentSeason = season;
        const colors = {
            'invierno': '#7dcfff',
            'primavera': '#9ece6a', 
            'verano': '#e0af68',
            'otoño': '#ff9e64'
        };
        document.getElementById('seasonControls')!.style.borderColor = colors[season as keyof typeof colors];
    }
    
    document.getElementById('seasonName')!.textContent = seasonNameMap[AppState.currentSeason];
    
    initSeasonCanvas(AppState.currentSeason);
    
    const summerSound = document.getElementById('summerSound') as HTMLAudioElement;
    if (AppState.currentSeason === 'verano' && AppState.soundEnabled) {
        summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
    } else {
        summerSound.pause();
    }
}

// ============================================================================
// SISTEMA DE EJERCICIOS
// ============================================================================

function updateStats(): void {
    const total = AppState.exercises.length;
    const completed = AppState.exercises.filter(ex => ex.completado).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalExercises')!.textContent = total.toString();
    document.getElementById('completedExercises')!.textContent = completed.toString();
    document.getElementById('progressPercentage')!.textContent = `${percentage}%`;
}

function renderExercises(): void {
    const exercisesList = document.getElementById('exercisesList')!;
    exercisesList.innerHTML = '';
    
    let filteredExercises: Ejercicio[];
    
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
        exerciseElement.dataset.id = exercise.id.toString();
        
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
        
        const checkbox = exerciseElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
            toggleExerciseCompletion(exercise.id);
        });
        
        exercisesList.appendChild(exerciseElement);
    });
    
    updateStats();
}

function toggleExerciseCompletion(exerciseId: number): void {
    const exerciseIndex = AppState.exercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex !== -1) {
        AppState.exercises[exerciseIndex].completado = !AppState.exercises[exerciseIndex].completado;
        saveExercises();
        renderExercises();
        showCompletionEffect(AppState.exercises[exerciseIndex].completado);
    }
}

function showCompletionEffect(isCompleted: boolean): void {
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
// CANVAS DEL TÍTULO ANIMADO
// ============================================================================

function initializeTitleCanvas(): void {
    const canvas = document.getElementById('titleCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    
    function resizeCanvas(): void {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const titleText = "2026";
    let time = 0;
    
    function animateTitle(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 120px 'Minecraft', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        time += 0.05;
        const glitchAmount = Math.sin(time) * 0.5 + 0.5;
        const glitchOffset = glitchAmount * 2;
        
        const hue = (time * 10) % 360;
        const mainColor = `hsl(${hue}, 70%, 65%)`;
        
        ctx.shadowColor = '#7dcfff';
        ctx.shadowBlur = 20 + Math.sin(time * 2) * 5;
        
        ctx.fillStyle = mainColor;
        
        for (let i = 0; i < 3; i++) {
            const offset = (Math.random() - 0.5) * glitchOffset;
            ctx.fillText(titleText, canvas.width / 2 + offset, canvas.height / 2 + offset);
        }
        
        ctx.shadowColor = '#bb9af7';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(187, 154, 247, 0.7)';
        ctx.fillText(titleText, canvas.width / 2, canvas.height / 2);
        
        ctx.shadowBlur = 0;
        drawParticlesAroundText(ctx, canvas, time);
        
        requestAnimationFrame(animateTitle);
    }
    
    animateTitle();
}

function drawParticlesAroundText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number): void {
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

function setupEventListeners(): void {
    // Filtros de ejercicios
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.currentFilter = (btn as HTMLElement).dataset.filter as 'all' | 'completed' | 'pending';
            renderExercises();
        });
    });
    
    // Control de sonido
    document.getElementById('soundControl')!.addEventListener('click', () => {
        AppState.soundEnabled = !AppState.soundEnabled;
        const soundStatus = document.getElementById('soundStatus')!;
        const summerSound = document.getElementById('summerSound') as HTMLAudioElement;
        
        if (AppState.soundEnabled) {
            soundStatus.textContent = 'Encendido';
            if (AppState.currentSeason === 'verano') {
                summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
            }
        } else {
            soundStatus.textContent = 'Apagado';
            summerSound.pause();
        }
    });
    
    // Permitir la reproducción de audio después de la interacción
    document.addEventListener('click', () => {
        const summerSound = document.getElementById('summerSound') as HTMLAudioElement;
        if (AppState.soundEnabled && AppState.currentSeason === 'verano' && summerSound.paused) {
            summerSound.play().catch(e => console.log("Reproducción de audio bloqueada"));
        }
    }, { once: true });
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================================================
// FUNCIONES DE DESARROLLO (PARA PROBAR ESTACIONES)
// ============================================================================

// Función para cambiar estación desde consola
(window as any).changeSeason = changeSeason;

// Atajos globales para la consola
(window as any).s = {
    primavera: () => changeSeason('primavera'),
    verano: () => changeSeason('verano'),
    otoño: () => changeSeason('otoño'),
    invierno: () => changeSeason('invierno'),
    auto: () => changeSeason('auto'),
    estado: () => console.log(`Estación actual: ${AppState.currentSeason}`)
};