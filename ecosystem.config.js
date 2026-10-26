module.exports = {
  apps: [
    {
      name: "bhaya-india",
      script: "npm",
      args: "start",
      cwd: "/var/www/bhaya-india", // Or your actual VPS deployment directory
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
