'use strict';

function Scatterplot3(element, width, height) {
    this.container = document.getElementById(element);
    this.width = width;
    this.height = height;
    var canvasRatio = width/height;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0xFFFFFF, 1.0 );

    this.container.appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 25, canvasRatio, 1, 10000 );
    this.camera.position.set( -510, 240, 100 );

    this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControls.target.set(0,50,0);

    this.clock = new THREE.Clock();

    this.addLighting();
    this.fillScene();
    this.animate();
}

Scatterplot3.prototype.addLighting = function() {
    var ambientLight = new THREE.AmbientLight( 0x222222 );

    var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light.position.set( 200, 400, 500 );

    var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light2.position.set( -500, 250, -200 );

    this.scene.add(ambientLight);
    this.scene.add(light);
    this.scene.add(light2);
};

Scatterplot3.prototype.render = function() {
    var delta = this.clock.getDelta();
    this.cameraControls.update(delta);

    this.renderer.render(this.scene, this.camera);
};

Scatterplot3.prototype.fillScene = function() {
    var sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
    var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    this.scene.add(sphere);
};

Scatterplot3.prototype.animate = function() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
};

module.exports = Scatterplot3;
