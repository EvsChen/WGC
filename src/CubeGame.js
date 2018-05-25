export default class CubeGame {
    /**
    * @param: {string} domId
    */
    constructor(domId) {
        const canvasWidth = 600;
        const canvasHeight = 400;
        let container = {}
        if (domId) {
            container = document.getElementById(domId);
        } else {
            container = document.createElement('div');
            document.body.appendChild(container);
        }
        const scene = new THREE.Scene();
        scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene = scene;
        const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
        this.camera = camera;
        camera.position.set(0, -10, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer = renderer;
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.domElement.style.width = canvasWidth;
        renderer.domElement.style.height = canvasHeight;
        container.appendChild(renderer.domElement);

        // cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00fff00 });
        const cube = new THREE.Mesh(cubeGeometry, material);
        this.cube = cube;
        scene.add(cube);

        // reference
        const refMaterial = new THREE.MeshLambertMaterial({ color: 0x0006aff });
        const reference = new THREE.Mesh(cubeGeometry, refMaterial);
        reference.position.set(5, 5, 0);
        scene.add(reference);

        // light
        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);
        const dirLight = new THREE.DirectionalLight();
        dirLight.position.set(-5, 0, 5);
        scene.add(dirLight);

        // ground
        const groundGeo = new THREE.PlaneBufferGeometry(20, 20);
        const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
        groundMat.color.setHSL(0.095, 1, 0.75);
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.z = -2;
        scene.add(ground);
        ground.receiveShadow = true;

        // controls.update();
        renderer.render(scene, camera);

        function animate() {
            requestAnimationFrame(animate);
            // controls.update();
            renderer.render(scene, camera);
        }
        animate();


        // window.addEventListener('keydown', handleKeyDown, false);
        // function handleKeyDown(e) {
        //     switch (e.keyCode) {
        //         // left arrow
        //         case 37:
        //             cube.position.x -= 0.3;
        //             console.log('left clicked');
        //             break;
        //         // up arrow
        //         case 38:
        //             cube.position.y += 0.3;
        //             console.log('up clicked');
        //             break;
        //         // right arrow
        //         case 39:
        //             cube.position.x += 0.3;
        //             console.log('right clicked');
        //             break;
        //         // down arrow
        //         case 40:
        //             cube.position.y -= 0.3;
        //             console.log('down clicked');
        //             break
        //     }
        //     renderer.render(scene, camera);
        // }
    }

    getCube() {
        return this.cube;
    }
    /**
     * 
     * @param {Object} cubeState 
     * @param {number} cubeState.plusX
     * @param {number} cubeState.plusY
     */
    setCube(cubeState) {
        this.cube.position.x += cubeState.plusX;
        this.cube.position.y += cubeState.plusY;
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
