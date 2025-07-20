module.exports = {
  build: {
    command: "npm run build",
    output: "dist",
    publish: "dist/public"
  },
  routes: [
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index.html" }
  ]
};
