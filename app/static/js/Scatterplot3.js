'use strict';
/* global THREE */
/* exported generateMaterial */

function Scatterplot3(element, width, height, data) {
    this.container = document.getElementById(element);
    this.width = width;
    this.height = height;
    var canvasRatio = width/height;
    this.data = data;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0xFFFFFF, 1.0 );

    this.container.appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 25, canvasRatio, 1, 10000 );
    this.camera.position.set( -510, 240, 100 );

    this.cameraControls = new THREE.OrbitControls(this.camera,
        this.renderer.domElement);
    this.cameraControls.target.set(0,50,0);

    this.clock = new THREE.Clock();

    this.addLighting();
    this.setScale();
    this.fillScene();
    this.animate();
}

Scatterplot3.prototype.addLighting = function() {
    var ambientLight = new THREE.AmbientLight( 0x222222 );

    var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light.position.set( 200, 400, 500 );

    var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light2.position.set( -200, -400, 500 );

    this.scene.add(ambientLight);
    this.scene.add(light);
    this.scene.add(light2);
};

Scatterplot3.prototype.setScale = function () {
    /* jshint ignore:start */
    var xDomain = d3.extent(this.data, function(d) {
        return d.tsne_x;
    });

    var yDomain = d3.extent(this.data, function(d) {
        return d.tsne_y;
    });

    var zDomain = d3.extent(this.data, function(d) {
        return d.tsne_z;
    });

    var range = 500;

    this.xScale = d3.scale.linear()
        .domain(xDomain)
        .range([-range, range]);

    this.yScale = d3.scale.linear()
        .domain(yDomain)
        .range([-range, range]);

    this.zScale = d3.scale.linear()
        .domain(zDomain)
        .range([-range, range]);

    this.colorScale = {
        0: generateMaterial(0xff7f0e),
        1: generateMaterial(0x2ca02c),
        2: generateMaterial(0xd62728),
        3: generateMaterial(0x8c564b),
        4: generateMaterial(0x9467bd),
        5: generateMaterial(0x8c564b),
        6: generateMaterial(0xe377c2),
        7: generateMaterial(0x7f7f7f),
        8: generateMaterial(0xbcbd22),
        9: generateMaterial(0x17becf)
    };
    /* jshint ignore:end */
};

Scatterplot3.prototype.render = function() {
    var delta = this.clock.getDelta();
    this.cameraControls.update(delta);

    this.renderer.render(this.scene, this.camera);
};

Scatterplot3.prototype.fillScene = function() {
    var sphereGeometry;
    var sphereMaterial;
    var newSphere;

    for(var i = 0; i < this.data.length; i++) {
        sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
        sphereMaterial = this.colorScale[this.data[i].label];
        newSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        /* jshint ignore:start */
        newSphere.position.x = this.xScale(this.data[i].tsne_x);
        newSphere.position.y = this.xScale(this.data[i].tsne_y);
        newSphere.position.z = this.xScale(this.data[i].tsne_z);
        this.scene.add(newSphere);
        /* jshint ignore:end */
    }
};

Scatterplot3.prototype.animate = function() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
};

function generateMaterial(colorHex) {
    return new THREE.MeshPhongMaterial({
        color: colorHex,
        specular: 0x6E23BB,
        shininess: 20
    });
}

module.exports = Scatterplot3;
