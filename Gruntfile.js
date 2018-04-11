module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ['less']
                },
                files: {
                    'css/styles.css': 'css/_styles.less' // destination file / source file
                }
            }
        },
        browserify: {
            main: {
                src: 'scripts/_functions.js',
                dest: 'scripts/functions.js'
            }
        },
        watch: {
            files: ['**/*.less', 'public/scripts/*'], // which files to watch
            tasks: ['less', 'default']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('default', ['browserify', 'watch']);
};