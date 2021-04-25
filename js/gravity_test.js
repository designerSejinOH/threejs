//윈도우 크기 변수
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
var speed = 0;
var gravity = 0.1;
let object;
var objX = 120;
var objY = 120;
var objZ = 120;

//모듈 임포트
import * as THREE from "./three/build/three.module.js";
import {
	OrbitControls
} from "./three/examples/jsm/controls/OrbitControls.js";


//-1. 씬만들기
const scene = new THREE.Scene();
//-2. 카메라만들기
var fov = 30; //Field of view 시야각
var asp = WIDTH / HEIGHT; //Aspect 측면
var near = 1;
var far = 10000;
const camera = new THREE.PerspectiveCamera(fov, asp, near, far);
camera.position.set(1000, 50, 1500);


//-4. 윈도우사이즈 정하기
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);

document.body.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;

renderer.shadowMap.enabled = true;;
//Orbit Controls
// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1000;
controls.maxDistance = 5000;

//-5. 오브젝트 만들고 씬에 추가하기
//조명
scene.add(new THREE.AmbientLight(0x666666));

const light = new THREE.DirectionalLight(0xdfebff, 1);
light.position.set(50, 200, 100);
light.position.multiplyScalar(1.3);

light.castShadow = true;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

const d = 300;

light.shadow.camera.left = -d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = -d;

light.shadow.camera.far = 1000;

scene.add(light);
//땅
let mesh = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshPhongMaterial({
	color: 'gray'
}));
mesh.position.y = -250;
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);
//오브젝트
const geometry = new THREE.SphereGeometry(objX, objY, objZ);
const material = new THREE.MeshPhongMaterial({
	color: 'sray'
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.y = 500;


//고정 프레임 값
var framesPerSecond = 120;
//window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}
// 에니메이션 효과를 자동으로 주기 위한 보조 기능입니다.
var animate = function () {
	// 프레임 처리
	setTimeout(function () {
		requestAnimationFrame(animate);
	}, 1000 / framesPerSecond);
	//    : 애니메이션 영역
	cube.rotation.x += speed / 100;
	cube.position.y -= speed;
	speed += gravity;
	if (cube.position.y < -250 + objZ) {
		speed *= -0.95;
	}
	controls.update();

	// 랜더링을 수행합니다.
	renderer.render(scene, camera);
};
// animate()함수를 최초에 한번은 수행해주어야 합니다.
animate();
