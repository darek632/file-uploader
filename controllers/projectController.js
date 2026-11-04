const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const multer  = require('multer')
const upload = multer({ dest: '../uploads/' })
const path = require("path");

// here will be a list of all of my controller functions. 

// exports.itemsGet = async (req,res) => { 

//     const allItems = await db.getAllItems();

    
//     res.render("index", {title: "{title of your main page}", allItems})
// };

// exports.itemsCreatePost = async (req,res) => { 
//     const {partName,brand } = req.body;
//     await db.insertItem(partName,brand);

//     res.redirect("/");

// }


exports.indexGet = async (req,res) => {
    
    res.render("index", {user: req.user});
}

exports.uploadFileGet = (req,res) => res.render("upload-file");

exports.uploadFilePost = async (req,res) => { 
      if (!req.file) {
        return res.status(400).send("No file uploaded");
  }
   const { originalname, filename, size, mimetype } = req.file;
    await db.createFile(originalname, filename, size, mimetype, req.user.id);
    res.redirect("/upload-file");


}

exports.foldersGet = async (req,res) => {
    const folders = await db.getFoldersByUser(req.user.id);

    res.render("folders", {folders});
}

exports.createFolderPost = async (req,res) => { 
    await db.createFolder(req.body.name,req.user.id);
    res.redirect("/folders");
};

exports.oneFolderGet = async (req,res) => { 
    const folder = await db.getFolderById(Number(req.params.id), req.user.id);
    if(!folder) return res.status(404).send("Folder not found");
    res.render("folder", {folder});

};

exports.updateFolderPost = async (req,res) => {
    await db.updateFolder(Number(req.params.id), req.user.id, req.body.name);
    res.redirect(`/folders/${req.params.id}`);
};

exports.deleteFolderPost = async (req,res) => { 
    await db.deleteFolder(Number(req.params.id), req.user.id);
    res.redirect("/folders");
}


exports.uploadToFolderPost = async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  const folderId = Number(req.params.id);
  const folder = await db.getFolderById(folderId, req.user.id);
  if (!folder) return res.status(404).send("Folder not found");

  const { originalname, filename, size, mimetype } = req.file;
  await db.createFile(originalname, filename, size, mimetype, req.user.id, folderId);
  res.redirect(`/folders/${folderId}`);
};

exports.fileGet = async (req,res) => { 
    const file = await db.fileGet(Number(req.params.id),req.user.id);
    if (!file) return res.status(404).send("File not found");
    res.render("file", {file});

}

exports.fileDownloadGet = async (req,res) => { 
    const file = await db.fileGet(Number(req.params.id), req.user.id);
    if (!file) return res.status(404).send("File not found");

    const filePath = path.join(__dirname,"..", "uploads", file.filename);

    res.download(filePath,file.originalname);

}
