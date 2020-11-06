import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


export default class LoaderManager {
    constructor(sceneManager) {
        this.game = sceneManager.game;
        this.scene = sceneManager.scene;
        this.mirror = sceneManager.mirror;
        this.shadowGenerator = sceneManager.shadowGenerator;

        this.cushinModel = null;
    }

    loadMainMesh () { //Create Bts Scene
        let assetsManager = new BABYLON.AssetsManager(this.scene);
        let model_task = assetsManager.addMeshTask("task", "", "./models/", "FM19156CWN 1pc.glb");
    
        model_task.onSuccess = (task) => { //Test --On Mesh Success
            this.cushinModel = task.loadedMeshes[0]; //_root_
            this.cushinModel.scaling = new BABYLON.Vector3(16, 16, -16)

            for (let j = 0; j < task.loadedMeshes.length; j++) {
                let mesh = task.loadedMeshes[j];
                if (mesh.getTotalVertices() > 0) { //if it's mesh
                    this.mirror.renderList.push(mesh);
                    this.shadowGenerator.getShadowMap().renderList.push(mesh);
                    this.shadowGenerator.addShadowCaster(mesh,true);    
                }
            }
            let color_cloth_M = this.scene.getMaterialByName("color_cloth_M");
            color_cloth_M.albedoColor = new BABYLON.Color3.White();

            let topCloth = this.scene.getMaterialByName("top_cloth_M");
            topCloth.metallic = 0.35;
            topCloth.roughness = 0.40;
        }
        
        
        assetsManager.onProgress = (remainingCount, totalCount, lastFinishedTask) => {
            this.game.engine.loadingUIText = 'loading Assets ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        };
          
        assetsManager.onFinish = (tasks) => { //On ALL Done
            // console.log(" tasks ", tasks);
            // for (let i = 0; i < tasks.length; i++) {
            //     for (let j = 0; j < tasks[i].loadedMeshes.length; j++) {
            //         console.log(tasks[i].loadedMeshes[j].name, "   ", j);
            //     }
            // }
        };
        // Start loading
        assetsManager.load();
    }
}

// for (let j = 0; j < task.loadedMeshes.length; j++) {
//     console.log(task.loadedMeshes[j].name, "   ", j);
// }