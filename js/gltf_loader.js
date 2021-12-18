import * as THREE from './three/build/three.module.js';

			import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
			import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';

			let camera, scene, renderer;

			init();
			render();

			function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.10, 200 );
				camera.position.set( - 0.5, 0.6, 2.7 );

				scene = new THREE.Scene();

				new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'data/' )
					.load( 'venice_sunset_1k.hdr', function ( texture ) {

						const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

						scene.background = envMap;
						scene.environment = envMap;

						texture.dispose();
						pmremGenerator.dispose();

						render();

						// model

						// use of RoughnessMipmapper is optional
						const roughnessMipmapper = new RoughnessMipmapper( renderer );

						const loader = new GLTFLoader().setPath( 'data/' );
						loader.load( 'cake.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									// TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
									// roughnessMipmapper.generateMipmaps( child.material );

								}

							} );
              gltf.scene.position.y = 0;
							scene.add( gltf.scene );

							roughnessMipmapper.dispose();

							render();

						} );

					} );

				renderer = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );

				const pmremGenerator = new THREE.PMREMGenerator( renderer );
				pmremGenerator.compileEquirectangularShader();

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 5;
				controls.maxDistance = 10;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			//

function render() {
        
				renderer.render( scene, camera );

			}