var gulp = require("gulp");
var paths = {
  sass: [
    "./src/variables.scss",
    "./src/style.scss",
    "./src/style/**/*.scss",
    "./src/**/*.scss"
  ],
  ts: ["./src/**/*.ts"],
  html: ["./src/**/*.html"]
};
gulp.task("watch", function() {
  gulp.watch(paths.sass, ["sass"]);
});
