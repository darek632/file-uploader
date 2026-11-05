const prisma = require("./prisma");


exports.getUserByUsername = (username) =>
  prisma.user.findUnique({ where: { username } });

exports.createUser = (username, password) => prisma.user.create({ data: { username, password } });

exports.getUserById = (id) =>  prisma.user.findUnique({where: {id}});

exports.createFile = (originalname,filename,url,size,mimetype,userId, folderId = null) => { 
    return prisma.file.create({data: {
        originalname,
        filename,
        url, //in the same order as in the schema
        size,
        mimetype,
        userId,
        folderId

    }})
}

exports.fileGet = (fileId,userId) => { 
    return prisma.file.findUnique({where: {id:fileId,userId }})
}

exports.createFolder = (name,userId) => 
    prisma.folder.create( {data: { name, userId}});


exports.getFilesByUser = (userId) => 
    prisma.file.findMany({where: {userId}, orderBy: {originalname: "asc"}});

exports.getFoldersByUser = (userId) =>
  prisma.folder.findMany({ where: { userId }, orderBy: { name: "asc" } });




exports.getFolderById = (id, userId) =>
  prisma.folder.findFirst({ where: { id, userId }, include: { files: true } });

//using id of folder and userId from the req.user.id to prevent anyone from accessing someone else's folder just using folderId/ changing in URL.


exports.updateFolder = (id, userId, name) =>
  prisma.folder.updateMany({ where: { id, userId }, data: { name } });


exports.deleteFolder = (id, userId) =>
  prisma.folder.deleteMany({ where: { id, userId } });


// one line no curly braces so no 'return'
