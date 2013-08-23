module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      dev: {
        options: {
          httpPath: '/',
          cssDir: 'css',
          sassDir: 'css-sass',
          imagesDir: 'images',
          httpGeneratedImagesPath: '../images/',
          noLineComments: true,
          //outputStyle: 'compressed',
        }
      }
    },

    requirejs: {
      dev: {
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
          out: 'dist/main.js',
          optimize: 'uglify',
          //optimize: 'none',
          optimizeAllPluginResources: true,
          preserveLicenseComments: false
        }
      }
    },

    watch: {
      css: {
        files: 'css-sass/**',
        tasks: 'compass',
        interrupt: true,
        debounceDelay: 0
      },

      js: {
        files: 'js/**',
        tasks: 'requirejs',
        interrupt: true,
        debounceDelay: 0
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['compass', 'requirejs']);

};
