const prisma = require("./db/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: { username: "testuser", password: hashed },
  });
  console.log("Created:", user);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
}


main()
  .catch((e) => {
    console.error("Connection failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());