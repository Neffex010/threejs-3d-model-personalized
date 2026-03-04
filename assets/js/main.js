import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, stats, loader;
let mixer;

// Diccionario de animaciones
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
    
    // Eventos de teclado (Al presionar y al soltar)
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    stats = new Stats();
    container.appendChild(stats.dom);
}

function loadCharacterSetup() {
    loader.load('models/fbx/skin.fbx', function (object) {
        mixer = new THREE.AnimationMixer(object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        // Cargamos las animaciones
        loadAnimation('models/fbx/zombie.fbx', 'zombie');
        loadAnimation('models/fbx/Thriller.fbx', 'Thriller');
        loadAnimation('models/fbx/excited.fbx', 'excited');
        loadAnimation('models/fbx/Breakdance.fbx', 'breakdance');
        loadAnimation('models/fbx/Breakdance1.fbx', 'breakdance1');
        loadAnimation('models/fbx/Snake.fbx', 'snake');
    });
}

function loadAnimation(path, name) {
    loader.load(path, function (animObject) {
        const clip = animObject.animations[0];

        // Truco para limpiar el nombre de los huesos
        clip.tracks.forEach(function (track) {
            track.name = track.name.replace(/.*\|/, '');
        });

        const action = mixer.clipAction(clip);
        actions[name] = action;

        // Iniciar automáticamente
        if (name === 'zombie') {
            currentAction = action;
            currentAction.play();
        }
    });
}

// --- LÓGICA CUANDO PRESIONAS LA TECLA ---
function onKeyDown(event) {
    let nextActionName;
    let teclaId;

    switch (event.key) {
        case '1':
            nextActionName = 'Thriller';
            teclaId = 'tecla-1';
            break;
        case '2':
            nextActionName = 'excited';
            teclaId = 'tecla-2';
            break;
        case '3':
            nextActionName = 'breakdance';
            teclaId = 'tecla-3';
            break;
        case '4':
            nextActionName = 'breakdance1';
            teclaId = 'tecla-4';
            break;
        case '5':
            nextActionName = 'snake';
            teclaId = 'tecla-5';
            break;
    }

    // Efecto visual en la pantalla: añade la clase "activa"
    if (teclaId) {
        const teclaUI = document.getElementById(teclaId);
        if (teclaUI) teclaUI.classList.add('activa');
    }

    // Cambio de animación 3D
    if (nextActionName && actions[nextActionName] && currentAction !== actions[nextActionName]) {
        const nextAction = actions[nextActionName];
        
        if (currentAction) {
            currentAction.fadeOut(0.5);
        }
        
        nextAction.reset().fadeIn(0.5).play();
        currentAction = nextAction;
    }
}

// --- LÓGICA CUANDO SUELTAS LA TECLA ---
function onKeyUp(event) {
    let teclaId;

    switch (event.key) {
        case '1': teclaId = 'tecla-1'; break;
        case '2': teclaId = 'tecla-2'; break;
        case '3': teclaId = 'tecla-3'; break;
        case '4': teclaId = 'tecla-4'; break;
        case '5': teclaId = 'tecla-5'; break;
    }

    // Efecto visual en la pantalla: quita la clase "activa" para que la tecla suba
    if (teclaId) {
        const teclaUI = document.getElementById(teclaId);
        if (teclaUI) teclaUI.classList.remove('activa');
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

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
    stats.update();
}