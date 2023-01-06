import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight

// allows you to see inside the scene, mimics what human eyeballs see
// arguments are field of view, aspect ratio, 2 view frustum arguments (control what's visible relative to camera)
const camera = new THREE.PerspectiveCamera(1000, aspectRatio, 1, 1200);
camera.rotation.x = .56
camera.position.y = -2
// renders actual graphics to scene
const renderer = new THREE.WebGLRenderer({
    // selects dom element to use, should be an html canvas
    canvas: document.querySelector('#bg'),
    alpha: true
})

// configuration
renderer.setPixelRatio( window.devicePixelRaio );
renderer.setSize( window.innerWidth, window.innerHeight);

camera.position.setZ(30);

// actually draws it
renderer.render(scene, camera)


const sliders = {
    widthSeg: 50,
    heightSeg: 50,
    heightMap: '/heightmap.jpg',
    vertTexture: .3,
    horTexture: .3,
    dispScale: 150,
}

const groundGeo = new THREE.PlaneGeometry(1000,1000,sliders.widthSeg,sliders.heightSeg)

let disMap = new THREE.TextureLoader().load(sliders.heightMap);
    
disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
disMap.repeat.set(sliders.horTexture, sliders.vertTexture)

const groundMat = new THREE.MeshStandardMaterial ({
    color: 0x1E90FF,
    wireframe: true,
    displacementMap: disMap,
    displacementScale: sliders.dispScale,

})

const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -0.5;

// like a floodlight
const ambientLight = new THREE.AmbientLight(0xFF69B4);

// calls the light to the scene like the mesh
scene.add(ambientLight)


// // *** GEOMETRY, MATERIAL, MESH ***
// // the steps taken to create a three.js mesh object are creating a geomery, a material (like a shader), mesh (geometry + material)

// const geometry = new THREE.TorusGeometry(10,3,16,100);

// // // usually materials require light source but basic material does not, just takes color/wireframe parameters 
// // const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true} );

// // standard materials use light source 
// const material = new THREE.MeshStandardMaterial({color: 0xFF6347}  )

// //Meshes put a geometry and a material together 
// const torus = new THREE.Mesh( geometry, material );

// // calls the scene to the browser
// scene.add(torus)

// // *** LIGHT ***
// // this creates a light that "illuminates" the standard material, takes a hex color value as an an argument
// const pointLight = new THREE.PointLight(0xffffff);
// // set the position of the point light on the x,y,z axes with 3 corresponding parameters
// pointLight.position.set(50,50,50)

// // like a floodlight
// const ambientLight = new THREE.AmbientLight(0xffffff);

// // calls the light to the scene like the mesh
// scene.add(pointLight, ambientLight)




// ** ANIMATION LOOP **
// you call this recursive function instead of renderer.render() so that when the browser refreshes the screen
// -it runs requestAnimationFrame to make "room" for the animation and also calls the render method aka a game loop
function animate(){
    requestAnimationFrame( animate )
    // torus.rotation.x += 0.01
    // torus.rotation.y += 0.005
    // torus.rotation.z += 0.01
    camera.position.z += 0.03
    camera.position.x += 0.01
    
    renderer.render(scene, camera)
    // this will update the OrbitControls so the camera changes update when the canvas "repaints"
    // controls.update();
}

animate()