module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            ngApp: {
                options: {
                    banner: '(function(angular, undefined) {\n',
                    footer: '})(angular);'
                },
                src: [
                    'src/js/**/*.js'
                ],
                dest: 'tmp/app.js'
            },
            appBundle: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-aria/angular-aria.js',
                    'bower_components/angular-material/angular-material.js',
                    '<%= concat.ngApp.dest %>'
                ],
                dest: 'app/js/scripts.js'
            },
        },
        jshint: {
            options: {
                jshintrc: true
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            ngApp: {
                src: ['<%= concat.ngApp.dest %>']
            },
        },
        watch: {
            lintGruntfile: {
                files: '<%= jshint.grunt.src %>',
                tasks: ['jshint:grunt']
            },
            lintNgApp: {
                files: '<%= concat.ngApp.dest %>',
                tasks: ['jshint:ngApp']
            },
            ngApp: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:ngApp', 'concat:appBundle']
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
