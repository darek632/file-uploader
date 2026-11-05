const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const multer  = require('multer');
const path = require("path");
const crypto = require("crypto");
const supabase = require("../lib/supabase");


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
   const { originalname, size, mimetype, buffer} = req.file;
   const storagePath = `${req.user.id}/${crypto.randomUUID()}${path.extname(originalname)}`;

   const { error } = await supabase.storage.
   from("files")
   .upload(storagePath, buffer, {contentType: mimetype});

   if (error) return res.status(500).send("Upload failed: " + error.message);

   const {data} = supabase.storage.from("files").getPublicUrl(storagePath);

    await db.createFile(originalname, storagePath, data.publicUrl, size,mimetype, req.user.id);
    res.redirect("/files");


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

exports.filesGet = async (req,res) => { 
    const files = await db.getFilesByUser(req.user.id);
    res.render("files", {files});
}

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

 const { originalname, size, mimetype, buffer} = req.file;
   const storagePath = `${req.user.id}/${crypto.randomUUID()}${path.extname(originalname)}`;

   const { error } = await supabase.storage
   .from("files")
   .upload(storagePath, buffer, {contentType: mimetype});

   if (error) return res.status(500).send("Upload failed: " + error.message);

   const {data} = supabase.storage.from("files").getPublicUrl(storagePath);

    await db.createFile(originalname, storagePath, data.publicUrl, size,mimetype, req.user.id,folderId);


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

    const { data } = supabase.storage
    .from("files")
    .getPublicUrl(file.filename, {download : file.originalname});


    // const filePath = path.join(__dirname,"..", "uploads", file.filename);
    // for use when files are stored locally in ../uploads

    res.redirect(data.publicUrl);

}
