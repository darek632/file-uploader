//1. import router from express
//2. call router on our router variable
// 3.require controller functions to direct the server to execute 
// these during a routed request
const { Router } = require("express");
const path = require("node:path");
const projectController = require("../controllers/projectController");
const projectRouter = Router();
const multer  = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
})

const isAuth = require("../middleware/auth");



projectRouter.get("/", projectController.indexGet);

projectRouter.get("/upload-file", projectController.uploadFileGet);
projectRouter.post("/upload-file", isAuth, upload.single("uploaded_file"),  projectController.uploadFilePost);

projectRouter.get("/folders", isAuth,projectController.foldersGet);
projectRouter.post("/folders", isAuth,projectController.createFolderPost);
projectRouter.get("/files",isAuth, projectController.filesGet);

projectRouter.get("/folders/:id", isAuth,projectController.oneFolderGet);
projectRouter.post("folders/:id/update", isAuth,projectController.updateFolderPost);
projectRouter.post("/folders/:id/delete", isAuth,projectController.deleteFolderPost);
projectRouter.post("/folders/:id/upload", isAuth, 
    upload.single("uploaded_file"), 
    projectController.uploadToFolderPost);

projectRouter.get("/files/:id",isAuth,projectController.fileGet);
projectRouter.get("/files/:id/download", isAuth, projectController.fileDownloadGet);


module.exports = projectRouter;