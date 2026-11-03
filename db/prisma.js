// require("dotenv").config();
// only require dotenv here when running separate test files such as test-db
const { PrismaClient } = require("../generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

module.exports = new PrismaClient({ adapter });