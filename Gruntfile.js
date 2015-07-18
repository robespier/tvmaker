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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
};
