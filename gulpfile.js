'use strict';
const 	gulp 				= require('gulp'),
				browserSync 		= require('browser-sync').create(),
        fs = require('fs-extra'),
				async 				= require('async'),
				mozjpeg 			= require('imagemin-mozjpeg'),
				gulpAutoprefixer 	= require('gulp-autoprefixer'),
				concat 				= require('gulp-concat'),
				notify 				= require('gulp-notify'),
				plumber 			= require('gulp-plumber'),
				sass 				= require('gulp-sass'),
				sassGlob 			= require('gulp-sass-glob'),
				uglify 				= require('gulp-uglify'),
				cssImageDimensions 	= require("gulp-css-image-dimensions"),
				replace 			= require('gulp-replace'),
				cssnano 			= require('gulp-cssnano'),
				htmlmin				= require('gulp-htmlmin'),
				xmlsitemap 			= require('gulp-sitemap'),
				imageResize 		= require('gulp-image-resize'),
				styleInject 		= require("gulp-style-inject"),
				imagemin 			= require('gulp-imagemin'),
        reload 				= browserSync.reload,
        config = require('./package.json'),

				// files
				app 				= './app',
				jsVendor		= './app/js/vendor',
				dist 				= 'dist',
				jsFiles 			= [app + '/js/*.js' , app + '/js/**/*.js'],
				data	 			= '/data/*.json',
				images 				= '/img/**/*.{png,jpg,jpeg,ico}',
				sassFiles 			= '/sass/**/*.scss',
				fonts				= '/font/*.scss',
				htmlFiles 			= '/*.html',
				cssFiles 			= '/css/*.css',
				cname				= '/CNAME';

// Setup browsersync.
gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: app,
            serveStaticOptions: {
              extensions: ["html"]
          }
        },
        ghostMode: false
    });
});

gulp.task('copy', async resolve => {
  await fs.emptyDir(`${jsVendor}`);
  console.log(`REMOVED: ${jsVendor}`);

  config.copy.forEach(element => {
    fs.copy(`${process.cwd()}/node_modules/${element}`, `${jsVendor}/${element}`, (err) => {
      if (err) { console.error(err); }
      else { console.log(`CREATED: ${jsVendor}/${element}`); }
    });
  });
});

// set scss files to the css folder into a css file
gulp.task('css',function() {
	gulp.src(app + sassFiles)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cssImageDimensions('../img/'))
		.pipe(gulpAutoprefixer({
	        browsers: ['last 40 versions'],
        	cascade: false
		}))
		.pipe(gulp.dest(app + '/css/'))
		.pipe(browserSync.stream());

    gulp.src(app + fonts)
    	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(sassGlob())
	    .pipe(sass())
      .pipe(gulpAutoprefixer({
            browsers: ['last 40 versions'],
            cascade: false
      }))
      .pipe(concat('fonts.css'))
      .pipe(gulp.dest(app + '/css/'))
		  .pipe(browserSync.stream());
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
gulp.task('serve', ['browsersync', 'css', 'copy'], function() {
	gulp.watch([app + htmlFiles]).on("change", reload);
	gulp.watch([jsFiles]).on("change", reload);
	gulp.watch([app + fonts], ['css']);
	gulp.watch([app + data]).on("change", reload);
	gulp.watch([app + sassFiles], ['css']);
});
 
gulp.task('jpg', function () {
	// compress images
	gulp.src(app + '/img/full/**/*.{png,jpg,jpeg,ico}')
	    .pipe(imageResize({ format : 'jpg' }))
	    .pipe(gulp.dest(app + '/img/resized/'));

    // make thumbnails
	gulp.src(app + '/img/full/**/*.{png,jpg,jpeg,ico}')
	    .pipe(imageResize({
	      percentage: 50
	    }))
	    .pipe(gulp.dest(app + '/img/thumbnail/'));
});

gulp.task('default', ['serve']);

gulp.task('build', [ 'css'], function() {

	async.series([
	    function (next) {
			gulp.src(app + cssFiles)	
				.pipe(cssnano())
				.pipe(gulp.dest( dist + '/css/'))
				.on('end', next);
		},
	    function (next) {
			gulp.src(app + '/css/fonts.css')	
				.pipe(gulp.dest( dist + '/css/'))
				.on('end', next);
		},		
	    function (next) {
			gulp.src(app + htmlFiles)
				.pipe(styleInject({encapsulated: false}))
			    .pipe(replace('<link rel="stylesheet" type="text/css" href="css/stylesheet.css">', ' '))
			    .pipe(replace('<style><!-- inject-style src="./dist/css/stylesheet.css" --></style>', ' '))
			    .pipe(replace('../img/', 'img/'))
				.pipe(htmlmin({collapseWhitespace: true}))
				.pipe(gulp.dest(dist))
				.on('end', next);
	    },
	    function (next) {
			gulp.src(app + cname)
				.pipe(concat('CNAME'))
				.pipe(gulp.dest(dist));
		}
  ]);
    const cnameUrl = config.homepage,
          cnameClean = cnameUrl.split('//')[1];

    fs.writeFile('dist/CNAME', cnameClean)
    gulp.src(app + htmlFiles , {read: false})
        .pipe(xmlsitemap( {siteUrl: cnameUrl} ))
        .pipe(gulp.dest(dist));

	gulp.src(app + data)
    .pipe(gulp.dest( dist + '/data/'));

  gulp.src(app + '/js/**')
   .pipe(gulp.dest( dist + '/js'));

	gulp.src(app + images)
		// .pipe(imagemin([mozjpeg()]))
		.pipe(gulp.dest(dist + '/img/'));

});