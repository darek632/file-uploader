//1. import router from express
//2. call router on our router variable
// 3.require controller functions to direct the server to execute 
// these during a routed request
const { Router } = require("express");
const path = require("node:path");
const projectController = require("../controllers/projectController");
const projectRouter = Router();
const multer  = require('multer');
const uploadFile = require("../middleware/upload");

const isAuth = require("../middleware/auth");



projectRouter.get("/", projectController.indexGet);

projectRouter.get("/upload-file", projectController.uploadFileGet);
projectRouter.post("/upload-file", isAuth, uploadFile,  projectController.uploadFilePost);
// the only route for uploading files
projectRouter.get("/folders", isAuth,projectController.foldersGet);
projectRouter.post("/folders", isAuth,projectController.createFolderPost);
//AKA VIEW ALL
// this is now the default see all view, as will now show files AND folders


projectRouter.get("/folders/:id", isAuth,projectController.oneFolderGet);
projectRouter.post("folders/:id/update", isAuth,projectController.updateFolderPost);
projectRouter.post("/folders/:id/delete", isAuth,projectController.deleteFolderPost);

projectRouter.get("/files/:id",isAuth,projectController.fileGet);
projectRouter.get("/files/:id/download", isAuth, projectController.fileDownloadGet);


module.exports = projectRouter;


//to do after LUNCH: 
// fix file with folder upload > URL is still in old format // DONE
// push changes (consolidating upload to one route and folders displaying ALL folders AND files) // DO NE
// add partials of nav bars/log in out // D O N E
// push those changes// DONE 
// add file validation // 
// push those changes
// add styling
// push those changes
// deploy site
// DONE!!