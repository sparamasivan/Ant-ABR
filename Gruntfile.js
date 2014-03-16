module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      options: {
        httpPath: '/',
        cssDir: 'css',
        sassDir: 'css-sass',
        imagesDir: 'images',
        httpGeneratedImagesPath: '../images/',
        noLineComments: true
      },

      dev: {},

      dist: {
        options: {
          cssDir: 'dist/css',
          outputStyle: 'compressed',
          specify: 'css-sass/screen.scss'
        }
      }
    },

    requirejs: {
      dist: {
        options: {
          mainConfigFile: 'js/require-config.js',
          baseUrl: './js',
          name: 'main',
          include: [
            'view/test/Accuplex',
            'view/test/CompleteBloodCount',
            'view/test/FelvFiv',
            'view/test/HeartwormAntigen',
            'view/test/OvaParasite',
            'view/test/SuperChemistry',
            'view/test/Thyroxine',
            'view/test/UrineAnalysis',
            'model/test/Accuplex',
            'model/test/CompleteBloodCount',
            'model/test/FelvFiv',
            'model/test/HeartwormAntigen',
            'model/test/OvaParasite',
            'model/test/SuperChemistry',
            'model/test/Thyroxine',
            'model/test/UrineAnalysis',
            'view/widget/WindowWidthHeight'
          ],
          out: 'dist/js/healthtracks-report.js',
          optimize: 'uglify',
          //optimize: 'none',
          optimizeAllPluginResources: true,
          preserveLicenseComments: false
        }
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      css: {
        files: 'css-sass/**',
        tasks: 'compass:dev',
        interrupt: true,
        debounceDelay: 0
      },
/*
      js: {
        files: 'js/**',
        tasks: 'requirejs',
        interrupt: true,
        debounceDelay: 0
      }
*/
    },

    clean: {
      dist: {
        src: [
          'dist'
        ]
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: [
              'fonts/**',
              'images/**',
              'js/lib/require.min.js',
              'js/require-config.js',
              'js/lib/respond.min.js',
              'js/lib/excanvas/excanvas.compiled.js',
              'report.html'
            ],
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      }
    },

    concurrent: {
      dist: [
        'compass:dist',
        'requirejs:dist',
        'copy:dist'
      ]
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('dist', [
    'clean:dist',
    'concurrent:dist'
  ]);

};
