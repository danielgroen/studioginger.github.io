"use strict";
const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  fs = require("fs-extra"),
  gulpAutoprefixer = require("gulp-autoprefixer"),
  concat = require("gulp-concat"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  sass = require("gulp-sass"),
  sassGlob = require("gulp-sass-glob"),
  cssImageDimensions = require("gulp-css-image-dimensions"),
  replace = require("gulp-replace"),
  htmlmin = require("gulp-htmlmin"),
  xmlsitemap = require("gulp-sitemap"),
  imageResize = require("gulp-image-resize"),
  reload = browserSync.reload,
  config = require("./package.json"),
  // files
  app = "./src",
  jsVendor = app + "/js/vendor",
  dist = "dist",
  jsFiles = [app + "/js/*.js", app + "/js/**/*.js"],
  data = "/data/*.json",
  images = "/img/**/*.{png,jpg,jpeg,ico}",
  sassFiles = "/sass/**/*.scss",
  fonts = "/font/*.scss",
  htmlFiles = "/*.html";

// Setup browsersync.
gulp.task("browsersync", (cb) => {
  browserSync.init({
    server: {
      baseDir: app,
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    ghostMode: false,
  });
  cb();
});

gulp.task("copy", async (resolve) => {
  await fs.emptyDir(`${jsVendor}`);
  console.log(`REMOVED: ${jsVendor}`);

  config.copy.forEach((element) => {
    fs.copy(
      `${process.cwd()}/node_modules/${element}`,
      `${jsVendor}/${element}`,
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`CREATED: ${jsVendor}/${element}`);
        }
      }
    );
  });
});

// set scss files to the css folder into a css file
gulp.task("css", function (done) {
  gulp
    .src(app + sassFiles)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cssImageDimensions("../img/"))
    .pipe(
      gulpAutoprefixer({
        browsers: ["last 40 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest(app + "/css/"))
    .pipe(browserSync.stream());

  gulp
    .src(app + fonts)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      gulpAutoprefixer({
        browsers: ["last 40 versions"],
        cascade: false,
      })
    )
    .pipe(concat("fonts.css"))
    .pipe(gulp.dest(app + "/css/"))
    .pipe(browserSync.stream());

  return done();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

gulp.task("watch", () => {
  const options = { interval: 500 };

  gulp.watch(app + htmlFiles).on("change", reload);
  gulp.watch(jsFiles).on("change", reload);
  gulp.watch(app + data).on("change", reload);
  gulp.watch(app + fonts, options, gulp.series("css"));
  gulp.watch(app + sassFiles, options, gulp.series("css"));
});

gulp.task(
  "serve",
  gulp.series(
    gulp.parallel(["css", "copy"]),
    gulp.series("browsersync"),
    gulp.parallel("watch")
  )
);

gulp.task("jpg", gulp.series("browsersync"), function (done) {
  // compress images
  gulp
    .src(app + "/img/full/**/*.{png,jpg,jpeg,ico}")
    .pipe(imageResize({ format: "jpg" }))
    .pipe(gulp.dest(app + "/img/resized/"));

  // make thumbnails
  gulp
    .src(app + "/img/full/**/*.{png,jpg,jpeg,ico}")
    .pipe(
      imageResize({
        percentage: 50,
      })
    )
    .pipe(gulp.dest(app + "/img/thumbnail/"));

  return done();
});

gulp.task("default", gulp.series("serve"));

gulp.task("build", async function (done) {
  await fs.copy(app, dist);

  await gulp
    .src(dist + htmlFiles)
    .pipe(replace("../img/", "img/"))
    .pipe(htmlmin({ collapseWhitespace: true }));

  await fs.rmdirSync(`${dist}/sass`, { recursive: true });

  const cnameUrl = config.homepage;

  gulp
    .src(app + htmlFiles, { read: false })
    .pipe(xmlsitemap({ siteUrl: cnameUrl }))
    .pipe(gulp.dest(dist));

  return done();
});
