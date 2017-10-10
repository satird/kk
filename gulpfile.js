var gulp = require("gulp"),
    less = require("gulp-less"),
    server = require("browser-sync"),
    cssnano = require("gulp-cssnano"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglifyjs"),
    rename = require("gulp-rename"),
    autoprefixer = require("autoprefixer"),
    plumber = require("gulp-plumber"),
    gutil = require("gulp-util"),
	minify = require("gulp-csso"),
	postcss = require("gulp-postcss"),
	svgstore = require("gulp-svgstore"),
	svgmin = require("gulp-svgmin"),
	mqpacker = require("css-mqpacker"),
	imagemin = require("gulp-imagemin"),
	run = require ("run-sequence"),
	del = require ("del");
	
	
gulp.task("less", function() {
    gulp.src("src/less/style.less")
	.pipe(plumber(function (error) {
	 gutil.log(error.message);
	 this.emit('end');
}))
   .pipe(less())
   .pipe(postcss([
  autoprefixer({browsers: [
  "last 1 version",
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Opera versions",
  "last 2 Edge versions"
]}),
  mqpacker({
  sort: false
  })
  ]))
  .pipe(gulp.dest("build/css"))
  .pipe(cssnano())
  .pipe(rename({suffix: ".min"}))
  .pipe(gulp.dest("build/css"))
  .pipe(server.reload({stream: true}))
});

gulp.task("images", function() {
	return gulp.src("build/src/img/**/*.{png,jpg,gif,jpeg}")
	.pipe(imagemin([
	imagemin.optipng({optimizationLevel: 3}),
	imagemin.jpegtran({progressive: true})
	]))
	.pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
	return gulp.src("build/src/img/icons/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		})) 
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.{woff,woff2}",
		"src/img/**/*",
		"src/js/**",
		"*.html",
	], {
		base: "."
		})
		.pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
	return del("build");
});

gulp.task("serve", function() {
  server({
    server: {
		baseDir: "build"  
	},
	notify: false
  });
});

gulp.task("watch", ["serve"], function() {
  gulp.watch("src/less/**/*.less", ["less"]);
  gulp.watch("*.html", server.reload);
  gulp.watch("js/**/*.js", server.reload);
});

gulp.task("build", function(fn) {
	run(
	"clean",
	"copy",
	"less",
	"images",
	"symbols",
	"watch",
	fn
	);
});

gulp.task("default", ["build"], function() {});