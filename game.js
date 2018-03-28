var canvas = document.getElementById("renderCanvas"); // Get the canvas element

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

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
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 500, 500, 500, 0, 10, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.position.y = -10.05;
    ground.material = groundMaterial;


    // Add and manipulate meshes in the scene
    //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

    BABYLON.SceneLoader.Append("models/Knuckles/", "Knuckles.obj", scene, function(scene) {
        Console.log("Loaded...");
    });


    /*
    BABYLON.SceneLoader.Append("ugandan_knuckles/", "scene.gltf", scene, function (scene) {
        // do something with the scene
        Console.log("loaded...")
    });
    */


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
