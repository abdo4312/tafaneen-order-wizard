module.exports = {
  build: {
    command: "npm install && npm run build",
    output: "dist/public",
    ignore: [
      "node_modules",
      ".git"
    ]
  },
  routes: [
    { src: "/api/(.*)", dest: "/api/$1" },
    { 
      src: "/(.*)", 
      dest: "/index.html",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    }
  ],
  env: {
    NODE_ENV: "production"
  }
};
