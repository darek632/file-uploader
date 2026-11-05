require("dotenv").config();
const prisma = require("../db/prisma");


prisma.file 
    .deleteMany()
    .then(({count})=> console.log(`Deleted ${count} files`))
    .finally(()=> prisma.$disconnect());