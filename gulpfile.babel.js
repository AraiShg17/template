const gulp = require('gulp');
const ejs = require('gulp-ejs');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const connect = require('gulp-connect');
const browserSync = require('browser-sync');

const uglify = require('gulp-uglify');

const htmlmin = require('gulp-html-minifier');
const htmlbeautify = require('gulp-html-beautify');


const folder = '/';

gulp.task('connect',() => {
  connect.server({
    root: './public',
    livereload: true
  });
});

// Static server
gulp.task('browser-sync',() => {
	browserSync({
		server: {
			baseDir: './public'
		},
        startPath: './',
        open: 'external',
        notify: false
	});
});
// Reload all Browsers
gulp.task('bs-reload',() => {
	browserSync.reload();
});


//ejsコンパイル
gulp.task('ejs',() => {

    gulp.src(['src/**/*.ejs','!src/_ejs/*.ejs'])
        .pipe(plumber())
        .pipe(ejs({}))
        .pipe(rename({extname: '.html'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(htmlbeautify({indentSize: 1}))
        .pipe(gulp.dest('public/'));
});

//es6コンパイル
gulp.task( 'jses6',() => {
   gulp.src(['src'+folder+'js/**/*.js','!src'+folder+'js/libs/*.js'])
	.pipe(plumber())
    .pipe(babel({
	   presets: ['es2015']
    }))
	.pipe(cache('js-cache')) // jsをキャッシュさせつつ、
	//.pipe(uglify())
	.pipe(gulp.dest('public'+folder+'js/'));

    gulp.src('src'+folder+'js/libs/*.js')
        .pipe(cache('js-cache')) // jsをキャッシュさせつつ、
        .pipe(gulp.dest('public'+folder+'js/libs/'));

});


// Sassコンパイル
gulp.task('css',() => {
  gulp.src(['src'+folder+'_scss/*.scss'])
	.pipe( plumber())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer({
            grid: true
        }),
        cssnext({
          browsers: [
              'last 2 version'
          ],
            warnForDuplicates: false
      }),

    ]))
    .pipe(gulp.dest('public'+folder+'css/'));
});


// 出力フォルダに移動
gulp.task('build',() => {
  gulp.src(['src'+folder+'**/','!src'+folder+'_**','!src'+folder+'_**/**','!src'+folder+'**/_**','!src'+folder+'**/*.js','!src'+folder+'**/*.ejs'])
    .pipe(gulp.dest('public'+folder))
		.pipe(connect.reload());
});

// gulp-watchで監視
gulp.task('default',['css','ejs','jses6','build','connect','browser-sync'],(e) => {
   	gulp.watch(['src'+folder+'**/*.js'],(event) => {
       gulp.start(['jses6']); // jsに変更があったら実行。
    });
   	gulp.watch(['src'+folder+'**/*.scss'],(event) => {
        gulp.start(['css']); // cssに変更があったら実行。
    });
    gulp.watch(['src'+folder+'**/*.ejs'],(event) => {
        gulp.start(['ejs']); // ejsに変更があったら実行。
    });
   	gulp.watch(['src'+folder+'**/**'],(event) => {
		gulp.start(['build']); // 変更があったら実行。
		gulp.start(['bs-reload']);
    });
});
