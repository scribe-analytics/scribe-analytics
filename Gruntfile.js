module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    nodeunit: {
      all: ['test/**/test-*.js']
    },
    jshint: {
      files: ['gruntfile.js', 'src/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        eqnull: true,
        expr: true,

        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    rig: {
      compile: {
        files: {
          'dist/<%= pkg.name %>.js': ['src/scribe-rigger.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'dist/',
        src: '<%= pkg.name %>.js',
        dest: 'dist/'
      }
    },
    jsdoc : {
        dist : {
            src: ['src/*.js', 'README.md'],
            options: {
                destination: 'doc'
            }
        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'rig', 'nodeunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint', 'rig', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'rig', 'uglify', 'compress', 'jsdoc', 'nodeunit']);
};
