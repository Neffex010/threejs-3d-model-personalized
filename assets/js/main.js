import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, stats, loader;
let mixer;

// Diccionario para guardar nuestras animaciones y rastrear la actual
const actions = {};
let currentAction = null;

const timer = new THREE.Timer();
timer.connect(document);

init();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // Suelo
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // Inicializamos el cargador
    loader = new FBXLoader(manager);
    
    // 1. Cargar el personaje y sus animaciones
    loadCharacterSetup();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
    
    // 2. Escuchar el teclado
    window.addEventListener('keydown', onKeyDown);

    stats = new Stats();
    container.appendChild(stats.dom);
}

function loadCharacterSetup() {
    // Primero cargamos el modelo base (T-Pose)
    loader.load('models/fbx/skin.fbx', function (object) {
        
        mixer = new THREE.AnimationMixer(object);

        // Configuramos sombras para el personaje
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        // Ahora cargamos las animaciones por separado
        loadAnimation('models/fbx/Shoved.fbx', 'shoved');
		loadAnimation('models/fbx/excited.fbx', 'excited');
        loadAnimation('models/fbx/Bboy.fbx', 'bboy');
		loadAnimation('models/fbx/Brooklyn.fbx', 'brooklyn');
	
        // Puedes agregar más aquí: loadAnimation('models/fbx/jump.fbx', 'jump');
    });
}

function loadAnimation(path, name) {
    loader.load(path, function (animObject) {
        const clip = animObject.animations[0];

        // --- EL TRUCO PARA REPARAR ANIMACIONES DE MIXAMO ---
        // Recorremos todos los huesos de la animación y les borramos 
        // cualquier texto que esté antes del símbolo "|"
        clip.tracks.forEach(function (track) {
            track.name = track.name.replace(/.*\|/, '');
        });
        // --------------------------------------------------

        const action = mixer.clipAction(clip);
        
        // Lo guardamos en nuestro diccionario
        actions[name] = action;

        // Si quieres que inicie moviéndose automáticamente, descomenta lo siguiente:
        
        if (name === 'excited') {
            currentAction = action;
            currentAction.play();
        }
        
    });
}

function onKeyDown(event) {
    let nextActionName;

    // Mapeamos las teclas a los nombres de las animaciones
    switch (event.key) {
        case '1':
           nextActionName = 'shoved';
            break;
        case '2':
            
			 nextActionName = 'excited';
            break;
        case '3':
            nextActionName = 'bboy';
            break;
		case '4':
            nextActionName = 'brooklyn';
            break;
		case '5':
            nextActionName = 'run';
            break;
			
    }

    // Si presionamos una tecla válida, la animación existe y no es la actual...
    if (nextActionName && actions[nextActionName] && currentAction !== actions[nextActionName]) {
        const nextAction = actions[nextActionName];
        
        // ¡LA SOLUCIÓN ESTÁ AQUÍ! 
        // Solo hacemos fadeOut si currentAction no es null
        if (currentAction) {
            currentAction.fadeOut(0.5);
        }
        
        nextAction.reset().fadeIn(0.5).play();
        
        // Actualizamos la acción actual
        currentAction = nextAction;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    timer.update();
    const delta = timer.getDelta();

    // Actualizamos el mixer de animaciones
    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
    stats.update();
}