// ============================================================================
// ESTADO DE LA APLICACIÓN
// ============================================================================
const AppState = {
    exercises: [],
    currentFilter: 'all',
    soundEnabled: true,
    currentSeason: '',
    seasonEffectsActive: true,
    currentAnimation: null
};

// ============================================================================
// SISTEMA DE HOJAS CON WEBGL (EFECTO AVANZADO)
// ============================================================================
let leafSystem = null;
let leafAnimationFrame = null;

class LeafSystemWebGL {
    constructor(canvas, season) {
        this.canvas = canvas;
        this.season = season;
        this.gl = null;
        this.particles = [];
        this.dataArray = null;
        this.buffer = null;
        this.program = null;
        this.timeInfo = { start: Date.now(), prev: Date.now(), delta: 0, elapsed: 0 };
        
        // Configuración según la estación
        this.config = {
            primavera: {
                numLeaves: 2800,
                area: { x: 25.0, y: 25.0, z: 25.0 },
                colors: [
                    [0.36, 0.54, 0.31],  // Verde bosque
                    [0.47, 0.67, 0.34],  // Verde claro
                    [0.31, 0.58, 0.32],  // Verde medio
                    [0.56, 0.73, 0.36],  // Verde lima
                    [0.42, 0.62, 0.28]   // Verde oscuro
                ],
                speed: 1.5,
                size: 0.9
            },
            otoño: {
                numLeaves: 3200,
                area: { x: 30.0, y: 30.0, z: 30.0 },
                colors: [
                    [0.85, 0.45, 0.20],  // Naranja oscuro
                    [0.91, 0.55, 0.26],  // Naranja
                    [0.75, 0.35, 0.15],  // Marrón rojizo
                    [0.96, 0.65, 0.21],  // Amarillo anaranjado
                    [0.72, 0.42, 0.18]   // Marrón
                ],
                speed: 2.0,
                size: 1.0
            }
        };
        
        this.currentConfig = this.config[season];
        this.init();
    }
    
    init() {
        try {
            this.gl = this.canvas.getContext('webgl', { 
                alpha: true, 
                premultipliedAlpha: false,
                antialias: true 
            }) || this.canvas.getContext('experimental-webgl', { 
                alpha: true, 
                premultipliedAlpha: false 
            });
            
            if (!this.gl) {
                console.log("WebGL no disponible, usando Canvas 2D para hojas");
                this.useCanvas2DFallback();
                return;
            }
            
            this.setupWebGL();
            this.createShaders();
            this.createLeafParticles();
            this.animate();
            
        } catch (error) {
            console.log("Error inicializando WebGL:", error);
            this.useCanvas2DFallback();
        }
    }
    
    setupWebGL() {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }
    
    createShaders() {
        const gl = this.gl;
        
        // Vertex Shader
        const vertexShaderSource = `
            attribute vec3 aPosition;
            attribute vec3 aEuler;
            attribute vec2 aMisc;
            
            uniform mat4 uProjection;
            uniform mat4 uModelview;
            uniform vec3 uResolution;
            uniform vec3 uOffset;
            uniform vec3 uDOF;
            uniform vec3 uFade;
            
            varying vec3 vPosition;
            varying float vSize;
            varying float vAlpha;
            varying vec3 vNormal;
            varying float vDiffuse;
            varying float vSpecular;
            
            void main(void) {
                vec4 pos = uModelview * vec4(aPosition + uOffset, 1.0);
                gl_Position = uProjection * pos;
                gl_PointSize = aMisc.x * uProjection[1][1] / -pos.z * uResolution.y * 0.5;
                
                vPosition = pos.xyz;
                vSize = aMisc.x;
                vAlpha = aMisc.y;
                
                vec3 elrsn = sin(aEuler);
                vec3 elrcs = cos(aEuler);
                
                mat3 rotx = mat3(1.0, 0.0, 0.0, 0.0, elrcs.x, elrsn.x, 0.0, -elrsn.x, elrcs.x);
                mat3 roty = mat3(elrcs.y, 0.0, -elrsn.y, 0.0, 1.0, 0.0, elrsn.y, 0.0, elrcs.y);
                mat3 rotz = mat3(elrcs.z, elrsn.z, 0.0, -elrsn.z, elrcs.z, 0.0, 0.0, 0.0, 1.0);
                
                mat3 rotmat = rotx * roty * rotz;
                vNormal = rotmat[2];
                
                const vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
                vDiffuse = max(dot(vNormal, lightDir), 0.0);
                vSpecular = pow(vDiffuse, 3.0) * 0.3;
            }
        `;
        
        // Fragment Shader con forma de hoja
        const fragmentShaderSource = `
            precision highp float;
            
            uniform vec3 uDOF;
            uniform vec3 uFade;
            
            varying vec3 vPosition;
            varying float vSize;
            varying float vAlpha;
            varying vec3 vNormal;
            varying float vDiffuse;
            varying float vSpecular;
            
            float leafShape(vec2 coord, float leafType) {
                vec2 p = (coord - 0.5) * 2.0;
                float shape;
                
                if (leafType < 0.33) {
                    shape = length(vec2(p.x * 1.2, p.y)) - 0.8;
                } else if (leafType < 0.66) {
                    float angle = atan(p.y, p.x);
                    float radius = length(p);
                    float lobes = 3.0;
                    shape = radius - (0.7 + 0.2 * cos(angle * lobes));
                } else {
                    shape = length(vec2(p.x * 1.5, p.y * 0.7)) - 0.9;
                    shape = min(shape, abs(p.y) - 0.6);
                }
                
                return shape;
            }
            
            float leafVeins(vec2 coord) {
                vec2 p = (coord - 0.5) * 2.0;
                float centralVein = abs(p.x) * 2.0 - abs(p.y) * 0.5;
                centralVein = smoothstep(0.0, 0.2, centralVein);
                
                float sideVeins = 0.0;
                if (abs(p.y) < 0.5) {
                    sideVeins = abs(p.x * 1.5 - p.y * 0.7) * 2.0 - 0.3;
                    sideVeins = smoothstep(0.0, 0.3, sideVeins);
                }
                
                return min(centralVein, sideVeins);
            }
            
            void main(void) {
                vec2 coord = gl_PointCoord;
                float leafType = fract(vPosition.x * 10.0);
                float shape = leafShape(coord, leafType);
                
                if (shape > 0.1) discard;
                
                vec3 baseColor;
                if (leafType < 0.2) {
                    baseColor = vec3(0.36, 0.54, 0.31);
                } else if (leafType < 0.4) {
                    baseColor = vec3(0.47, 0.67, 0.34);
                } else if (leafType < 0.6) {
                    baseColor = vec3(0.85, 0.45, 0.20);
                } else if (leafType < 0.8) {
                    baseColor = vec3(0.91, 0.55, 0.26);
                } else {
                    baseColor = vec3(0.75, 0.35, 0.15);
                }
                
                if (uFade.x > 0.5) {
                    baseColor = mix(baseColor, vec3(0.36, 0.54, 0.31), 0.7);
                } else {
                    baseColor = mix(baseColor, vec3(0.85, 0.45, 0.20), 0.7);
                }
                
                float colorVar = fract(vPosition.z * 100.0) * 0.3 + 0.7;
                baseColor *= colorVar;
                
                float veins = leafVeins(coord);
                vec3 veinColor = baseColor * 0.7;
                baseColor = mix(baseColor, veinColor, veins * 0.3);
                
                vec3 litColor = baseColor * (0.4 + vDiffuse * 0.6) + vec3(vSpecular);
                
                float edgeAlpha = 1.0 - smoothstep(0.0, 0.2, shape);
                float distanceAlpha = clamp(1.0 - length(vPosition) / 50.0, 0.0, 1.0);
                float alpha = edgeAlpha * vAlpha * distanceAlpha * 0.8;
                
                gl_FragColor = vec4(litColor, alpha);
            }
        `;
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) {
            throw new Error("Error compilando shaders");
        }
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error("Error linkando programa: " + gl.getProgramInfoLog(this.program));
        }
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createLeafParticles() {
        const config = this.currentConfig;
        const numLeaves = config.numLeaves;
        
        this.particles = new Array(numLeaves);
        this.dataArray = new Float32Array(numLeaves * (3 + 3 + 2));
        
        for (let i = 0; i < numLeaves; i++) {
            this.particles[i] = this.createLeafParticle(i);
        }
        
        this.buffer = this.gl.createBuffer();
    }
    
    createLeafParticle(index) {
        const config = this.currentConfig;
        const particle = {
            position: [0, 0, 0],
            velocity: [0, 0, 0],
            rotation: [0, 0, 0],
            euler: [0, 0, 0],
            size: 0,
            alpha: 1.0,
            color: [0, 0, 0],
            zkey: 0
        };
        
        particle.position[0] = (Math.random() * 2 - 1) * config.area.x;
        particle.position[1] = (Math.random() * 2 - 1) * config.area.y;
        particle.position[2] = (Math.random() * 2 - 1) * config.area.z;
        
        const speed = config.speed;
        const angle = Math.random() * Math.PI * 2;
        const horizontalSpeed = Math.cos(angle) * speed * 0.5;
        
        particle.velocity[0] = horizontalSpeed;
        particle.velocity[1] = -speed * (0.5 + Math.random() * 0.5);
        particle.velocity[2] = Math.sin(angle) * speed * 0.5;
        
        particle.rotation[0] = (Math.random() * 2 - 1) * 0.5;
        particle.rotation[1] = (Math.random() * 2 - 1) * 0.5;
        particle.rotation[2] = (Math.random() * 2 - 1) * 0.5;
        
        particle.euler[0] = Math.random() * Math.PI * 2;
        particle.euler[1] = Math.random() * Math.PI * 2;
        particle.euler[2] = Math.random() * Math.PI * 2;
        
        particle.size = config.size * (0.8 + Math.random() * 0.4);
        
        const colorIndex = Math.floor(Math.random() * config.colors.length);
        particle.color = [...config.colors[colorIndex]];
        
        return particle;
    }
    
    updateParticles(deltaTime) {
        const config = this.currentConfig;
        const PI2 = Math.PI * 2;
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.position[0] += p.velocity[0] * deltaTime;
            p.position[1] += p.velocity[1] * deltaTime;
            p.position[2] += p.velocity[2] * deltaTime;
            
            p.euler[0] += p.rotation[0] * deltaTime;
            p.euler[1] += p.rotation[1] * deltaTime;
            p.euler[2] += p.rotation[2] * deltaTime;
            
            const limits = [config.area.x, config.area.y, config.area.z];
            for (let j = 0; j < 3; j++) {
                if (Math.abs(p.position[j]) > limits[j]) {
                    if (p.position[j] > 0) {
                        p.position[j] -= limits[j] * 2;
                    } else {
                        p.position[j] += limits[j] * 2;
                    }
                }
            }
            
            for (let j = 0; j < 3; j++) {
                p.euler[j] = p.euler[j] % PI2;
                if (p.euler[j] < 0) p.euler[j] += PI2;
            }
            
            p.alpha = 0.7 + Math.sin(this.timeInfo.elapsed * 2 + i * 0.1) * 0.3;
        }
        
        this.updateDataArray();
    }
    
    updateDataArray() {
        const numLeaves = this.currentConfig.numLeaves;
        let ipos = 0, ieuler = numLeaves * 3, imisc = numLeaves * 6;
        
        for (let i = 0; i < numLeaves; i++) {
            const p = this.particles[i];
            
            this.dataArray[ipos++] = p.position[0];
            this.dataArray[ipos++] = p.position[1];
            this.dataArray[ipos++] = p.position[2];
            
            this.dataArray[ieuler++] = p.euler[0];
            this.dataArray[ieuler++] = p.euler[1];
            this.dataArray[ieuler++] = p.euler[2];
            
            this.dataArray[imisc++] = p.size;
            this.dataArray[imisc++] = p.alpha;
        }
    }
    
    render() {
        const gl = this.gl;
        const canvas = this.canvas;
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        const projectionMatrix = new Float32Array(16);
        const modelViewMatrix = new Float32Array(16);
        
        const fieldOfView = 60 * Math.PI / 180;
        const aspect = canvas.width / canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;
        
        this.perspectiveMatrix(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        this.loadLookAt(modelViewMatrix, [0, 0, 35], [0, 0, 0], [0, 1, 0]);
        
        gl.useProgram(this.program);
        
        const uProjection = gl.getUniformLocation(this.program, "uProjection");
        const uModelview = gl.getUniformLocation(this.program, "uModelview");
        const uResolution = gl.getUniformLocation(this.program, "uResolution");
        const uOffset = gl.getUniformLocation(this.program, "uOffset");
        const uDOF = gl.getUniformLocation(this.program, "uDOF");
        const uFade = gl.getUniformLocation(this.program, "uFade");
        
        gl.uniformMatrix4fv(uProjection, false, projectionMatrix);
        gl.uniformMatrix4fv(uModelview, false, modelViewMatrix);
        gl.uniform3f(uResolution, canvas.width, canvas.height, canvas.width / canvas.height);
        gl.uniform3f(uOffset, 0, 0, 0);
        gl.uniform3f(uDOF, 10.0, 4.0, 8.0);
        
        const fadeParam = this.season === 'primavera' ? [1.0, 20.0, 0.1] : [0.5, 20.0, 0.1];
        gl.uniform3f(uFade, ...fadeParam);
        
        const aPosition = gl.getAttribLocation(this.program, "aPosition");
        const aEuler = gl.getAttribLocation(this.program, "aEuler");
        const aMisc = gl.getAttribLocation(this.program, "aMisc");
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.dataArray, gl.DYNAMIC_DRAW);
        
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
        
        gl.vertexAttribPointer(aEuler, 3, gl.FLOAT, false, 0, 
            this.currentConfig.numLeaves * 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aEuler);
        
        gl.vertexAttribPointer(aMisc, 2, gl.FLOAT, false, 0,
            this.currentConfig.numLeaves * 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aMisc);
        
        gl.drawArrays(gl.POINTS, 0, this.currentConfig.numLeaves);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    
    perspectiveMatrix(out, fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);
        
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
    }
    
    loadLookAt(out, eye, center, up) {
        const eyex = eye[0], eyey = eye[1], eyez = eye[2];
        const upx = up[0], upy = up[1], upz = up[2];
        const centerx = center[0], centery = center[1], centerz = center[2];
        
        let z0 = eyex - centerx;
        let z1 = eyey - centery;
        let z2 = eyez - centerz;
        let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        
        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        
        let y0 = z1 * x2 - z2 * x1;
        let y1 = z2 * x0 - z0 * x2;
        let y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
    }
    
    animate() {
        if (!AppState.seasonEffectsActive) return;
        
        const now = Date.now();
        this.timeInfo.delta = (now - this.timeInfo.prev) / 1000;
        this.timeInfo.elapsed = (now - this.timeInfo.start) / 1000;
        this.timeInfo.prev = now;
        
        this.updateParticles(this.timeInfo.delta * 0.5);
        this.render();
        
        leafAnimationFrame = requestAnimationFrame(() => this.animate());
    }
    
    useCanvas2DFallback() {
        console.log("Usando Canvas 2D para hojas");
        this.createCanvas2DSystem();
    }
    
    createCanvas2DSystem() {
        const ctx = this.canvas.getContext('2d');
        const leaves = [];
        const leafCount = this.season === 'primavera' ? 80 : 100;
        const leafColors = this.season === 'primavera' ? 
            ['#9ece6a', '#73daca', '#2ecc71', '#27ae60', '#229954'] :
            ['#ff9e64', '#e0af68', '#d35400', '#e67e22', '#f39c12'];
        
        for (let i = 0; i < leafCount; i++) {
            leaves.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 10 + Math.random() * 20,
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                speed: (this.season === 'primavera' ? 0.5 : 0.8) + Math.random() * 0.5,
                sway: Math.random() * 0.5 - 0.25,
                swaySpeed: Math.random() * 0.005 + 0.002,
                swayAmplitude: 10 + Math.random() * 30,
                type: Math.floor(Math.random() * 3)
            });
        }
        
        const drawLeaf = (ctx, leaf) => {
            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.rotation);
            
            ctx.fillStyle = leaf.color;
            ctx.strokeStyle = this.season === 'primavera' ? '#2c3e50' : '#7e5109';
            ctx.lineWidth = 1;
            
            switch (leaf.type) {
                case 0:
                    this.drawSimpleLeaf(ctx, leaf.size);
                    break;
                case 1:
                    this.drawLobedLeaf(ctx, leaf.size);
                    break;
                case 2:
                    this.drawPointedLeaf(ctx, leaf.size);
                    break;
            }
            
            ctx.restore();
        };
        
        this.drawSimpleLeaf = (ctx, size) => {
            ctx.beginPath();
            ctx.moveTo(0, -size/2);
            ctx.bezierCurveTo(size/2, -size/3, size/3, size/2, 0, size/3);
            ctx.bezierCurveTo(-size/3, size/2, -size/2, -size/3, 0, -size/2);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, -size/2);
            ctx.lineTo(0, size/3);
            ctx.moveTo(0, -size/4);
            ctx.lineTo(size/3, -size/6);
            ctx.moveTo(0, -size/4);
            ctx.lineTo(-size/3, -size/6);
            ctx.moveTo(0, 0);
            ctx.lineTo(size/3, size/6);
            ctx.moveTo(0, 0);
            ctx.lineTo(-size/3, size/6);
            ctx.stroke();
        };
        
        this.drawLobedLeaf = (ctx, size) => {
            const lobes = 3;
            ctx.beginPath();
            
            for (let i = 0; i <= lobes * 2; i++) {
                const angle = (i / (lobes * 2)) * Math.PI * 2;
                const radius = i % 2 === 0 ? size : size * 0.7;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius * 0.6;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.6);
            ctx.lineTo(0, size * 0.6);
            for (let i = 1; i <= lobes; i++) {
                const angle = (i * Math.PI) / lobes;
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * size * 0.8, Math.sin(angle) * size * 0.5);
            }
            ctx.stroke();
        };
        
        this.drawPointedLeaf = (ctx, size) => {
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.bezierCurveTo(-size * 0.8, -size * 0.2, -size * 0.6, size * 0.4, 0, size * 0.3);
            ctx.bezierCurveTo(size * 0.6, size * 0.4, size * 0.8, -size * 0.2, 0, -size);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(0, size * 0.3);
            ctx.moveTo(0, -size * 0.5);
            ctx.lineTo(-size * 0.4, -size * 0.1);
            ctx.moveTo(0, -size * 0.5);
            ctx.lineTo(size * 0.4, -size * 0.1);
            ctx.moveTo(0, 0);
            ctx.lineTo(-size * 0.3, size * 0.2);
            ctx.moveTo(0, 0);
            ctx.lineTo(size * 0.3, size * 0.2);
            ctx.stroke();
        };
        
        const animateLeaves = () => {
            if (!AppState.seasonEffectsActive) return;
            
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            leaves.forEach(leaf => {
                leaf.y += leaf.speed;
                leaf.x += Math.sin(Date.now() * leaf.swaySpeed) * leaf.swayAmplitude * leaf.sway;
                leaf.rotation += leaf.rotationSpeed;
                
                if (leaf.y > this.canvas.height + leaf.size) {
                    leaf.y = -leaf.size;
                    leaf.x = Math.random() * this.canvas.width;
                }
                
                if (leaf.x > this.canvas.width + leaf.size) leaf.x = -leaf.size;
                if (leaf.x < -leaf.size) leaf.x = this.canvas.width + leaf.size;
                
                drawLeaf(ctx, leaf);
            });
            
            leafAnimationFrame = requestAnimationFrame(animateLeaves);
        };
        
        animateLeaves();
    }
    
    cleanup() {
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }
        if (leafAnimationFrame) {
            cancelAnimationFrame(leafAnimationFrame);
            leafAnimationFrame = null;
        }
    }
}

// ============================================================================
// SISTEMA DE NIEVE (INVIERNO)
// ============================================================================
class SistemaNieve {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.copos = [];
        this.animationId = null;
        this.inicializar();
    }
    
    inicializar() {
        this.ajustarCanvas();
        window.addEventListener('resize', () => this.ajustarCanvas());
        this.crearCopos(150);
        this.animar();
    }
    
    ajustarCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    crearCopos(cantidad) {
        const coloresNieve = ['#ffffff', '#e6f7ff', '#cceeff'];
        
        for (let i = 0; i < cantidad; i++) {
            this.copos.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 0.5,
                color: coloresNieve[Math.floor(Math.random() * coloresNieve.length)],
                sway: Math.random() * 0.5 - 0.25,
                swaySpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    dibujarCopo(copo) {
        this.ctx.beginPath();
        this.ctx.arc(copo.x, copo.y, copo.size, 0, Math.PI * 2);
        const gradiente = this.ctx.createRadialGradient(copo.x, copo.y, 0, copo.x, copo.y, copo.size);
        gradiente.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradiente.addColorStop(1, 'rgba(230, 247, 255, 0.4)');
        this.ctx.fillStyle = gradiente;
        this.ctx.fill();
        
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
    
    actualizarCopo(copo) {
        copo.y += copo.speed;
        copo.x += Math.sin(Date.now() * copo.swaySpeed) * copo.sway;
        copo.speed += (Math.random() - 0.5) * 0.05;
        copo.speed = Math.max(0.5, Math.min(3.0, copo.speed));
        
        if (copo.y > this.canvas.height + copo.size) {
            copo.y = -copo.size;
            copo.x = Math.random() * this.canvas.width;
            copo.size = Math.random() * 4 + 1;
            copo.speed = Math.random() * 2 + 0.5;
        }
        
        if (copo.x > this.canvas.width + copo.size) copo.x = -copo.size;
        if (copo.x < -copo.size) copo.x = this.canvas.width + copo.size;
    }
    
    animar() {
        if (!AppState.seasonEffectsActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.copos.forEach(copo => {
            this.actualizarCopo(copo);
            this.dibujarCopo(copo);
        });
        
        this.animationId = requestAnimationFrame(() => this.animar());
    }
    
    detener() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ============================================================================
// CONTROL DE EFECTOS ESTACIONALES
// ============================================================================
function initSeasonCanvas(season) {
    // Limpiar sistema anterior
    if (leafSystem) {
        leafSystem.cleanup();
        leafSystem = null;
    }
    
    // Limpiar canvas
    const canvas = document.getElementById('seasonCanvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configurar overlay según estación
    const seasonOverlay = document.getElementById('seasonOverlay');
    seasonOverlay.className = 'season-overlay';
    
    // Inicializar sistema según estación
    if (season === 'invierno') {
        // Usar sistema de nieve
        const snowSystem = new SistemaNieve('seasonCanvas');
        seasonOverlay.style.opacity = '0.1';
        window.snowSystem = snowSystem; // Guardar referencia
    } 
    else if (season === 'primavera' || season === 'otoño') {
        // Usar sistema WebGL de hojas
        try {
            leafSystem = new LeafSystemWebGL(canvas, season);
            seasonOverlay.style.opacity = '0.05';
            
            // Añadir efecto de color al overlay
            seasonOverlay.style.background = season === 'primavera' 
                ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.05) 0%, rgba(39, 174, 96, 0.03) 100%)'
                : 'linear-gradient(135deg, rgba(231, 76, 60, 0.05) 0%, rgba(192, 57, 43, 0.03) 100%)';
        } catch (error) {
            console.log("Error inicializando WebGL:", error);
        }
    }
    else if (season === 'verano') {
        seasonOverlay.classList.add('summer-overlay');
        seasonOverlay.style.opacity = '0.1';
        
        const summerSound = document.getElementById('summerSound');
        summerSound.volume = 0.3;
        
        if (AppState.soundEnabled) {
            summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
        }
    }
}

// ============================================================================
// FUNCIONES PARA CAMBIAR ESTACIÓN
// ============================================================================
function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'primavera';
    if (month >= 6 && month <= 8) return 'verano';
    if (month >= 9 && month <= 11) return 'otoño';
    return 'invierno';
}

function changeSeason(season) {
    const seasonNameMap = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    if (season === 'auto') {
        AppState.currentSeason = getCurrentSeason();
    } else {
        AppState.currentSeason = season;
    }
    
    document.getElementById('seasonName').textContent = seasonNameMap[AppState.currentSeason];
    initSeasonCanvas(AppState.currentSeason);
    
    const summerSound = document.getElementById('summerSound');
    if (AppState.currentSeason === 'verano' && AppState.soundEnabled) {
        summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
    } else {
        summerSound.pause();
    }
    
    console.log(`Estación cambiada a: ${seasonNameMap[AppState.currentSeason]}`);
}

// ============================================================================
// SISTEMA DE EJERCICIOS
// ============================================================================
function initializeExercises() {
    const savedExercises = localStorage.getItem('javaExercises2026');
    
    if (savedExercises) {
        AppState.exercises = JSON.parse(savedExercises);
    } else {
        AppState.exercises = exercisesData;
        localStorage.setItem('javaExercises2026', JSON.stringify(exercisesData));
    }
}

function saveExercises() {
    localStorage.setItem('javaExercises2026', JSON.stringify(AppState.exercises));
}

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
    exercisesList.innerHTML = '';
    
    let filteredExercises;
    
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
// CANVAS DEL TÍTULO ANIMADO
// ============================================================================
function initializeTitleCanvas() {
    const canvas = document.getElementById('titleCanvas');
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
                if (AppState.currentSeason === 'verano') {
                    summerSound.play().catch(e => console.log("Haz clic en la página para activar el sonido"));
                }
            } else {
                soundStatus.textContent = 'Apagado';
                summerSound.pause();
            }
        });
    }
    
    // Permitir la reproducción de audio después de la interacción
    document.addEventListener('click', () => {
        const summerSound = document.getElementById('summerSound');
        if (AppState.soundEnabled && AppState.currentSeason === 'verano' && summerSound.paused) {
            summerSound.play().catch(e => console.log("Reproducción de audio bloqueada"));
        }
    }, { once: true });
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
function initializeSeasonEffects() {
    const season = getCurrentSeason();
    AppState.currentSeason = season;
    
    const seasonNameMap = {
        'primavera': 'PRIMAVERA 🌸',
        'verano': 'VERANO ☀️',
        'otoño': 'OTOÑO 🍂',
        'invierno': 'INVIERNO ❄️'
    };
    
    const seasonNameElement = document.getElementById('seasonName');
    if (seasonNameElement) {
        seasonNameElement.textContent = seasonNameMap[season];
    }
    
    const seasonOverlay = document.getElementById('seasonOverlay');
    if (seasonOverlay) {
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
    }
    
    initSeasonCanvas(season);
}

function initializeApp() {
    initializeExercises();
    initializeSeasonEffects();
    initializeTitleCanvas();
    setupEventListeners();
    updateStats();
    renderExercises();
}

document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================================================
// FUNCIONES DE DESARROLLO (PARA PROBAR ESTACIONES)
// ============================================================================
window.changeSeason = changeSeason;
window.s = {
    primavera: () => changeSeason('primavera'),
    verano: () => changeSeason('verano'),
    otoño: () => changeSeason('otoño'),
    invierno: () => changeSeason('invierno'),
    auto: () => changeSeason('auto'),
    estado: () => console.log(`Estación actual: ${AppState.currentSeason}`)
};

// Asegúrate de limpiar el WebGL cuando la página se cierre
window.addEventListener('beforeunload', function() {
    if (leafSystem) {
        leafSystem.cleanup();
    }
});