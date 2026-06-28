import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000 );

// scene.background = new THREE.Color(0x00ff00);

// ************CONSTANTS **********
const MAX_LEAN = Math.PI / 6;
const LEAN_SPEED = 0.06;
const MOVE_SPEED = 0.2;
const RETURN_SPEED = 0.04;

const STARTING_X_ANGLE = Math.PI/6;
const MAX_WHEELIE_ANGLE = Math.PI/3;
//******************** */

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function createCube(w, h, d, color) {
    const geometry = new THREE.BoxGeometry( w, h, d );
    const material = new THREE.MeshBasicMaterial( { color } );
    return new THREE.Mesh( geometry, material );
}

const cube = createCube(1, 1, 1, 0x00ff00);
scene.add( cube );

// const subtitle = new THREE.Text
// const line = new THREE.Line(
//     new THREE.BufferGeometry().setFromPoints([
//         new THREE.Vector3( - 5, -10, 0 ),
//         new THREE.Vector3( 0, 10, 0 ),
//         new THREE.Vector3( 5, -10, 0 )
//     ]),
//     new THREE.LineBasicMaterial( { color: 0x0000ff } )
// );

// scene.add(line);

camera.position.z = 100;
camera.position.x = 1;

// track
function createTrack() {
    // Define the 4 corners of the trapezium
    // Top vertex
    const v1 = new THREE.Vector3(0, 10, 0);  
    // Bottom vertices
    const v3 = new THREE.Vector3(5, -10, 0);
    const v2 = new THREE.Vector3(-5, -10, 0); 

    const vertices = new Float32Array([
        // triangle 1
        v1.x, v1.y, v1.z,
        v3.x, v3.y, v3.z,
        v2.x, v2.y, v2.z,
    
        // triangle 2
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    return new THREE.Mesh(geometry, material);
}

const track = createTrack();
track.rotation.x = STARTING_X_ANGLE;
track.position.set(0, 0, 0);

// adding model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 1));

let bike = null;
let bikeStartRoll = null;

loader.load( './assets/3d/bike.glb', function ( gltf ) {
    scene.remove(cube);
    scene.add(track);
    
    bike = gltf.scene;
    bike.position.set(0, -1, -2);
    bike.position.y = track.position.y + 0.05;
    
    // arrange acc to track:
    const normal = new THREE.Vector3(0, 1, 0);
    normal.applyQuaternion(track.quaternion);
    
    bike.position.addScaledVector(normal, 0.05);



    bike.scale.set(0.00007, 0.00007, 0.00007);
    bike.rotation.y = Math.PI;
    bike.rotation.x = STARTING_X_ANGLE;
    bike.rotation.z = 0;
    bikeStartRoll = bike.rotation.z;

    const box = new THREE.Box3().setFromObject(bike);

    bike.position.z -= box.min.z;

    scene.add( bike );
}, undefined, function ( error ) {
    console.error( error );
} );


// track.rotation.x = STARTING_X_ANGLE;


// keyboard stuff
const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function animate( time ) {
    if (!bike) {
        cube.rotation.x = time / 200;
        cube.rotation.y = time / 1000;
    }


    if (bike) {
        // leaning and moving laterally
        if (keys["ArrowLeft"] && bike.rotation.z > - MAX_LEAN) {
            bike.rotation.z -= LEAN_SPEED;
            bike.position.x -= MOVE_SPEED;
        } else if (keys["ArrowRight"] && bike.rotation.z < MAX_LEAN) {
            bike.rotation.z += LEAN_SPEED;
            bike.position.x += MOVE_SPEED;
        } else {
            // Return to upright
            if (bike.rotation.z > 0) {
                bike.rotation.z = Math.max(0, bike.rotation.z - RETURN_SPEED);
            } else {
                bike.rotation.z = Math.min(0, bike.rotation.z + RETURN_SPEED);
            }
        }

        // wheelie
        if (keys["ArrowUp"] && bike.rotation.x < MAX_WHEELIE_ANGLE) {
            bike.rotation.x += 0.005;
        } else {
            // return to normal
            if (bike.rotation.x > STARTING_X_ANGLE) {
                bike.rotation.x -= 0.01
            }
        }
    }

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );