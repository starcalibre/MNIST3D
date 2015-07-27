'use strict';
/* global THREE */

function Scatterplot3(element, width, height, data) {
    this.defaultCameraPosition = new THREE.Vector3(1800, 330, 300);
    this.defaultCameraTarget = new THREE.Vector3(0, 50, 0);
    this.domainRangeX = 500;
    this.domainRangeY = 500;
    this.domainRangeZ = 500;
    this.rotateSpeed = 0.05;

    this.colorScale = {
        0: 0xff7f0e,
        1: 0x2ca02c,
        2: 0xd62728,
        3: 0x8c564b,
        4: 0x9467bd,
        5: 0x8c564b,
        6: 0xe377c2,
        7: 0x7f7f7f,
        8: 0xbcbd22,
        9: 0x17becf
    };

    this.$container = $('#' + element);
    this.width = width;
    this.height = height;
    var canvasRatio = width/height;
    this.data = data;
    this.points = [];
    this.pointsObject = new THREE.Object3D();

    this.rotateX = false;
    this.rotateY = false;
    this.rotateZ = false;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xFFFFFF, 1.0);

    this.$container.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(25, canvasRatio, 1, 10000);
    this.camera.position.copy(this.defaultCameraPosition);

    this.cameraControls = new THREE.OrbitControls(this.camera,
        this.renderer.domElement);
    this.cameraControls.target.copy(this.defaultCameraTarget);

    this.currentActivePoint = null;
    this.lastActivePoint = null;
    this.rayCaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.clock = new THREE.Clock();

    this.$container.on('click', function(event) {
        this.onClick(event);
    }.bind(this));

    this.addLighting();
    this.setScale();
    this.fillScene();
    this.animate();
}

Scatterplot3.prototype.toggleRotate = function(axis, rotate) {
    if(axis === 'x') {
        this.rotateX = rotate;
    }
    else if(axis === 'y') {
        this.rotateY = rotate;
    }
    else if(axis === 'z') {
        this.rotateZ = rotate;
    }
};

Scatterplot3.prototype.resetView = function() {
    this.camera.position.copy(this.defaultCameraPosition);
    this.cameraControls.target.copy(this.defaultCameraTarget);
    this.pointsObject.rotation.set(0, 0, 0);
    this.rotateX = false;
    this.rotateY = false;
    this.rotateZ = false;
};

Scatterplot3.prototype.onClick = function(event) {
    event.preventDefault();

    // click position is calculated relative to window,
    // not to the canvas element. use jQuery offset to catch
    // the right position
    var x = event.pageX - this.$container.offset().left;
    var y = event.pageY - this.$container.offset().top;

    // need to translate the mouse position to normalised device (NDC)
    // coordinates. mouse positions are given with origin (0, 0) in
    // the top-left, x range [0, width] y range [0, height]
    // NDC is range for x and y [-1, 1] with the origin in center at (0, 0).
    // note needs to be inverted!
    this.mouse.x = (x/(this.renderer.domElement.width)) * 2 - 1;
    this.mouse.y = -(y/(this.renderer.domElement.height)) * 2 + 1;

    // raycaster takes the x, y position of mouse, and casts from the
    // direction the camera is point
    this.rayCaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.rayCaster.intersectObjects(this.points);

    if(intersects.length > 0) {
        if(this.currentActivePoint) {
            // restyle previously clicked point
            this.lastActivePoint = this.currentActivePoint;
            var label = this.lastActivePoint.data.label;
            this.lastActivePoint.material.color.setHex(this.colorScale[label]);
        }
        // style new point
        this.currentActivePoint = intersects[0].object;
        this.currentActivePoint.material.color.setHex(0x000000);

        // trigger updatePoint event and pass the ID of the point
        // that was clicked
        $('body').trigger('updatePoint', this.currentActivePoint.data.id);
    }
};

Scatterplot3.prototype.addLighting = function() {
    var ambientLight = new THREE.AmbientLight(0x222222);

    var light = new THREE.DirectionalLight(0xFFFFFF, 1.25);
    light.position.set(this.domainRangeX, this.domainRangeY,
        this.domainRangeY);

    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.25);
    light2.position.set(-this.domainRangeX, -this.domainRangeY,
        -this.domainRangeY);

    this.scene.add(ambientLight);
    this.scene.add(light);
    this.scene.add(light2);
};

Scatterplot3.prototype.setScale = function () {
    // ignores here so jshint doesn't complain
    // about the snake case
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

    this.xScale = d3.scale.linear()
        .domain(xDomain)
        .range([-this.domainRangeX, this.domainRangeX]);

    this.yScale = d3.scale.linear()
        .domain(yDomain)
        .range([-this.domainRangeY, this.domainRangeY]);

    this.zScale = d3.scale.linear()
        .domain(zDomain)
        .range([-this.domainRangeZ, this.domainRangeZ]);
    /* jshint ignore:end */
};

Scatterplot3.prototype.render = function() {
    var delta = this.clock.getDelta();
    this.cameraControls.update(delta);

    this.pointsObject.rotation.x += this.rotateX ? this.rotateSpeed : 0;
    this.pointsObject.rotation.y += this.rotateY ? this.rotateSpeed : 0;
    this.pointsObject.rotation.z += this.rotateZ ? this.rotateSpeed : 0;

    this.renderer.render(this.scene, this.camera);
};

Scatterplot3.prototype.fillScene = function() {
    var sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
    var sphereMaterial;
    var newSphere;

    for(var i = 0; i < this.data.length; i++) {
        // we need to generate a unique material for each point
        // as the color changes when it's clicked
        sphereMaterial = new THREE.MeshPhongMaterial({
            color: this.colorScale[this.data[i].label],
            shininess: 15
        });
        newSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // snake case ahoy, nothing to see here jsHint..
        /* jshint ignore:start */
        newSphere.position.x = this.xScale(this.data[i].tsne_x);
        newSphere.position.y = this.yScale(this.data[i].tsne_y);
        newSphere.position.z = this.zScale(this.data[i].tsne_z);
        // bind some data to each sphere object, we need the label
        // to restore the spheres original color and the id to trigger
        // update events to the digit display canvas
        newSphere.data = {
            label: this.data[i].label,
            id: this.data[i].id
        };

        this.points.push(newSphere);
        this.pointsObject.add(newSphere);
        this.scene.add(this.pointsObject);
        /* jshint ignore:end */
    }
};

Scatterplot3.prototype.resize = function(width, height) {
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
};

Scatterplot3.prototype.animate = function() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
};


module.exports = Scatterplot3;
