var canvas = document.getElementById("renderCanvas"); // Get the canvas element

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var knuckles = null;
var inAir = false;

var actions = {};

var scene;
var camera;

var playerSpeed = 10;
var jumpHeight = 10;


/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    scene = new BABYLON.Scene(engine);

    // enable physics using cannon.js physics engine with standard gravity (9.8m/s^2)
    scene.enablePhysics();
    scene.collisionsEnabled = true;
    scene.workerCollisions = true;

    /*makes them trees*/
    trunkMaterial = new BABYLON.StandardMaterial("trunkMaterial", scene);
    trunkMaterial.diffuseTexture = new BABYLON.Texture("textures/trunk.jpg",scene)
    leafMaterial = new BABYLON.StandardMaterial("leafMaterial",scene);
    leafMaterial.diffuseTexture = new BABYLON.Texture("textures/leaf.jpg",scene);
    //Might possibly need to make several tree objects
    //Maybe an array filled with tree objects and update the positions? 
    var tree = QuickTreeGenerator(10, 10, 3, trunkMaterial, leafMaterial, scene);
    tree.position = new BABYLON.Vector3(30,0,20);
    
    
    // create camera that can be controlled by the canvas
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 90, BABYLON.Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI /2) * 0.9;
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 20;
    camera.attachControl(canvas, true);

    //scene.add(knuckles);

/*
    // create a camera that follows Knuckles (hopefully from behind)
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
    camera.radius = -30;
    camera.heightOffset = 10;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.005;
    camera.maxCameraSpeed = 10;
    camera.attachControl(canvas, true);

*/
    /* add lights to the scene */

    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 0.5;


    var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
    lightSphere.position = light.position;
    lightSphere.material = new BABYLON.StandardMaterial("light", scene);
    lightSphere.material.emissiveColor = new BABYLON.Color3(1, .5, 0);

    var light2 = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(30, 40, 20),
                          new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
    light2.intensity = 0.5;

    var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
    lightSphere2.position = light2.position;
    lightSphere2.material = new BABYLON.StandardMaterial("light", scene);
    lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    var light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light3.intensity = 0.5;

    // create ground from supplied heightmap in /textures/heightMap.png
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 10, scene, false, function () {
        ground.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });

        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass_tiled.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.position.y = -10.05;
        ground.material = groundMaterial;
        ground.checkCollisions = true;
        ground.name = "ground";
    });

    var ground2 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground2.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/secret_floor.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground2.position.y = -10.05;
        ground2.position.x = -500;
        ground2.material = groundMaterial;
        //ground.name = "ground";
    });
    var ground3 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground3.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground3, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/water.png", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground3.position.y = -10.05;
        ground3.position.x = 500;
        ground3.material = groundMaterial;
        //ground.name = "ground";
    });
    var ground4 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground4.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground4, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground4.position.y = -10.05;
        ground4.position.z = 500;
        ground4.material = groundMaterial;
        //ground.name = "ground";
    });
    var ground5 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground5.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground5, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground5.position.y = -10.05;
        ground5.position.z = -500;
        ground5.material = groundMaterial;
        ground.name = "ground";
    });
    var ground6 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground6.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground6, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground6.position.y = -10.05;
        ground6.position.x = -500;
        ground6.position.z = -500;
        ground6.material = groundMaterial;
        //ground.name = "ground";
    });
    var ground7 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground7.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground7, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground7.position.y = -10.05;
        ground7.position.x = 500;
        ground7.position.z = -500;
        ground7.material = groundMaterial;
        ground.name = "ground";
    });
    var ground8 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground8.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground8, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground8.position.y = -10.05;
        ground8.position.x = -500;
        ground8.position.z = 500;
        ground8.material = groundMaterial;
        //ground.name = "ground";
    });
    var ground9 = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 20, scene, true, function () {
        ground9.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground9, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground9.position.y = -10.05;
        ground9.position.x = 500;
        ground9.position.z = 500;
        ground9.material = groundMaterial;
        //ground.name = "ground";
    });

    // create skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:1500.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0,0,0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0,0,0);
    skybox.material = skyboxMaterial;



    /* -------- Import Knuckles -------- */

    // import Knuckles asynchronously from .obj file generated using Blender

    // Create shadow generators.
    // https://doc.babylonjs.com/api/classes/babylon.shadowgenerator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);

    BABYLON.SceneLoader.AppendAsync("models/Knuckles/", "Knuckles.obj", scene).then(function (scene) {

        // knuckles is the last mesh in the scene since we just added him
        let count = scene.meshes.length;
        let knuckles = scene.meshes[count-1];
        knuckles.name = "knuckles";

        // add rigidbody to knuckles
        knuckles.PhysicsImposter = new BABYLON.PhysicsImpostor(knuckles, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, restitution: 0.9, angularDampening: 1 }, scene);

        knuckles.PhysicsImposter.executeNativeFunction(function(world, body) {
            // lock Knuckles orientation about the y-axis so he doesn't fall over
            body.fixedRotation = true;
            body.updateMassProperties();
        });

        // Add shadow generators to knuckles.
        shadowGenerator.getShadowMap().renderList.push(knuckles);
        shadowGenerator2.getShadowMap().renderList.push(knuckles);

        // Allows knuckles to recieve shadows???
        knuckles.receiveShadows = true;

        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground2.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground3.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground4.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground5.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground6.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground7.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground8.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });
        knuckles.PhysicsImposter.registerOnPhysicsCollide(ground9.PhysicsImpostor, function(main, collided) {
            inAir = false;
        });

        light.parent = knuckles;

        // set camera to follow Knuckles
        camera.lockedTarget = knuckles;
    });

    /* ------- End Importing Knuckles -------- */

    // Allows landscape to recieve shadows.
    ground.receiveShadows = true;
    ground2.receiveShadows = true;
    ground3.receiveShadows = true;
    ground4.receiveShadows = true;
    ground5.receiveShadows = true;
    ground6.receiveShadows = true;
    ground7.receiveShadows = true;
    ground8.receiveShadows = true;
    ground9.receiveShadows = true;

    // print error message if everything has gone wrong...
    if (scene == null) {
        console.log("ERROR: Scene could not be set up properly!!");
    }

    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
            actions[event.sourceEvent.key] = true;
        })
    );
    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (event) {
            actions[event.sourceEvent.key] = false;
            console.log(event.sourceEvent.key);
        })
    );

    return scene;
};

function importKnuckles() {

}

function moveKnuckles() {
    var impulse = new BABYLON.Vector3(0, 0, 0);
    impulse = knuckles.PhysicsImposter.getLinearVelocity();

    if (actions["w"] || actions["W"] /*|| actions["ArrowUp"]*/) {
        console.log("forward");
        //knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0,0.1,0.2), knuckles.getAbsolutePosition());
        impulse.z = playerSpeed;
    }
    if (actions["a"] || actions["A"] /*|| actions["ArrowLeft"]*/) {
        console.log("left");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(-0.2,0.1,0), knuckles.getAbsolutePosition());
        impulse.x = -playerSpeed;
    }
    if (actions["s"] || actions["S"] /*|| actions["ArrowDown"]*/) {
        console.log("backward");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0,0.1,-0.2), knuckles.getAbsolutePosition());
        impulse.z = -playerSpeed;
    }
    if (actions["d"] || actions["D"] /*|| actions["ArrowRight"]*/) {
        console.log("right");
        impulse.x = playerSpeed;


    }
    if (actions[" "]) {
        if (!inAir) {
            console.log("jump");
            impulse.y += jumpHeight;
            inAir = true;
        }
    }

    console.log(impulse);
    //knuckles.PhysicsImposter.applyImpulse(impulse, knuckles.getAbsolutePosition());
    knuckles.PhysicsImposter.setLinearVelocity(impulse);
}

/******* End of the create scene function ******/

createScene(); //Call the createScene function

scene.registerBeforeRender(function() {
    //knuckles = scene.meshes[scene.meshes.length-1];
    knuckles = scene.getMeshByName("knuckles");
    if (!(knuckles === null)) {
        moveKnuckles();
    }
    else {
        console.log("can not find Knuckles");
    }
});

engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
    scene.render();
});


window.addEventListener("resize", function () { // Watch for browser/canvas resize events
    engine.resize();
});
