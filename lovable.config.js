module.exports = {
  build: {
    command: "npm install && npm run build",
    output: "dist",
    publish: "dist/public",
    ignore: [
      "node_modules",
      ".git"
    ]
  },
  framework: "vite",
  env: {
    NODE_ENV: "production"
  },
  routes: [
    { handle: "filesystem" },
    { src: "/api/(.*)", dest: "/api/$1" },
    { src: "/(.*)", dest: "/index.html" }
  ]
};
