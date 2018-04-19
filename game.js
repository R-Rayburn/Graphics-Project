var canvas = document.getElementById("renderCanvas"); // Get the canvas element

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var knuckles = null;

var actions = {};


/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // enable physics using cannon.js physics engine with standard gravity (9.8m/s^2)
    scene.enablePhysics();


    // create camera that can be controlled by the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 90, BABYLON.Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI /2) * 0.9;
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 20;
    camera.attachControl(canvas, true);


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

    // create ground from supplied heightmap in /textures/heightMap.png
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 10, scene, false, function () {
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.position.y = -10.05;
        ground.material = groundMaterial;
    });

    // create skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0,0,0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0,0,0);
    skybox.material = skyboxMaterial;

    // Greate shadow generators.
    // https://doc.babylonjs.com/api/classes/babylon.shadowgenerator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);


    // import Knuckles asynchronously from .obj file generated using Blender
    BABYLON.SceneLoader.AppendAsync("models/Knuckles/", "Knuckles.obj", scene).then(function (scene) {

        // knuckles is the last mesh in the scene since we just added him
        let count = scene.meshes.length;
        let knuckles = scene.meshes[count-1];

        // add rigidbody to knuckles
        knuckles.PhysicsImposter = new BABYLON.PhysicsImpostor(knuckles, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9, angularDampening: 1 }, scene);

        knuckles.PhysicsImposter.executeNativeFunction(function(world, body) {
            body.fixedRotation = true;
            body.updateMassProperties();
        });

        // Add shadow generators to knuckles.
        shadowGenerator.getShadowMap().renderList.push(knuckles);
        shadowGenerator2.getShadowMap().renderList.push(knuckles);

        // Allows knuckles to recieve shadows???
        knuckles.receiveShadows = true;

        // lock Knuckles orientation about the y-axis so he doesn't fall over
        // still working on this...

        // set camera to follow Knuckles
        camera.lockedTarget = knuckles;
    });

    // Allows landscape to recieve shadows.
    ground.receiveShadows = true;

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

function moveKnuckles() {
    if (actions["w"] || actions["W"] /*|| actions["ArrowUp"]*/) {
        console.log("forward");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0,0,0.2), knuckles.getAbsolutePosition());
    }
    if (actions["a"] || actions["A"] /*|| actions["ArrowLeft"]*/) {
        console.log("left");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(-0.2,0,0), knuckles.getAbsolutePosition());
    }
    if (actions["s"] || actions["S"] /*|| actions["ArrowDown"]*/) {
        console.log("backward");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0,0,-0.2), knuckles.getAbsolutePosition());
    }
    if (actions["d"] || actions["D"] /*|| actions["ArrowRight"]*/) {
        console.log("right");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0.2,0,0), knuckles.getAbsolutePosition());
    }
    if (actions[" "]) {
        console.log("jump");
        knuckles.PhysicsImposter.applyImpulse(new BABYLON.Vector3(0,1,0), knuckles.getAbsolutePosition());
    }
}

/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

scene.registerBeforeRender(function() {
    knuckles = scene.meshes[scene.meshes.length-1];
    if (!(knuckles === null)) {
        moveKnuckles();
    }
});

engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
    scene.render();
});


window.addEventListener("resize", function () { // Watch for browser/canvas resize events
    engine.resize();
});
