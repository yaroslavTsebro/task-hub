db.createUser({
  user: "adminUser",
  pwd: "securePassword",
  roles: [
    {
      role: "readWrite",
      db: "task_hub",
    },
  ],
});

db.createCollection("projects");