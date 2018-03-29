var canvas = document.getElementById("renderCanvas"); // Get the canvas element

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // enable physics using cannon.js physics engine with standard gravity (9.8m/s^2)
    scene.enablePhysics();

    // Add a camera to the scene and attach it to the canvas
    //var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    //camera.attachControl(canvas, true);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 90, BABYLON.Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI /2) * 0.9;
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 20;
    camera.attachControl(canvas, true);

    // Add lights to the scene
    //var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 0.5;

    var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
    lightSphere.position = light.position;
    lightSphere.material = new BABYLON.StandardMaterial("light", scene);
    lightSphere.material.emissiveColor = new BABYLON.Color3(1, .5, 0);

    // light2
    var light2 = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(30, 40, 20),
                          new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
    light2.intensity = 0.5;

    var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
    lightSphere2.position = light2.position;
    lightSphere2.material = new BABYLON.StandardMaterial("light", scene);
    lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    // Ground
    //var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 500, 0, 10, scene, false);
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 505, 0, 10, scene, false, function () {
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.position.y = -10.05;
        ground.material = groundMaterial;
    });

    // Greate shadow generators.
    // https://doc.babylonjs.com/api/classes/babylon.shadowgenerator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);

    var knuckles = BABYLON.SceneLoader.AppendAsync("models/Knuckles/", "Knuckles.obj", scene).then(function (scene) {
        // add rigidbody to Knuckles
        var count = scene.meshes.length;
        scene.meshes[count-1].PhysicsImposter = new BABYLON.PhysicsImpostor(scene.meshes[count-1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);

        // Add shadow generators to knuckles.
        shadowGenerator.getShadowMap().renderList.push(scene.meshes[count-1]);
        shadowGenerator2.getShadowMap().renderList.push(scene.meshes[count-1]);

        // Allows knuckles to recieve shadows???
        scene.meshes[count-1].receiveShadows = true;
    });

    // Allows landscape to recieve shadows.
    ground.receiveShadows = true;

    if (scene == null) {
        console.log("broken");
    }

    return scene;
};

/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
    scene.render();
});


window.addEventListener("resize", function () { // Watch for browser/canvas resize events
    engine.resize();
});
