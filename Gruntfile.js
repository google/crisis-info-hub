// Copyright 2015 the Secure GAE Scaffold Project Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = function(grunt) {

  // The target directory for the final build product.
  var targetDirectory = 'out';

  grunt.initConfig({
    appengine: {
      app: {
        root: targetDirectory,
        manageScript: [process.env.HOME,
                       'bin', 'google_appengine', 'appcfg.py'].join('/'),
        runFlags: {
          port: 8080
        },
        runScript: [process.env.HOME,
                    'bin', 'google_appengine', 'dev_appserver.py'].join('/')
      }
    },

    build: grunt.file.readJSON('config.json'),

    clean: [targetDirectory],

    closureBuilder: {
      options: {
        closureLibraryPath: 'closure-library',
        compile: true,
        compilerFile: [process.env.HOME,
                      'bin', 'google_closure', 'compiler.jar'].join('/'),
        compilerOpts: {
          compilation_level: grunt.option('dev', false) ?
            'SIMPLE_OPTIMIZATIONS' : 'ADVANCED_OPTIMIZATIONS'
        },
        namespaces: 'app',
      },
      js: {
        src: [ 'closure-library', 'js' ],
        dest: [ targetDirectory, 'static', 'app.js'].join('/'),
      }
    },

    copy: {
      source: {
        cwd: 'src/',
        dest: [targetDirectory, ''].join('/'),
        expand: true,
        src: '**'
      },
      static: {
        cwd: 'static',
        dest: [targetDirectory, 'static', ''].join('/'),
        expand: true,
        src: '**'
      }
    },
  });

  grunt.loadNpmTasks('grunt-appengine');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('nop', function() {});

  grunt.registerTask('yaml', 'Generates app.yaml',
      function() {
        var appid = grunt.option('appid') ||
                    grunt.config.get('build.appid', false);

        if (typeof(appid) !== 'string' || appid.length == 0) {
          grunt.fatal('no appid');
        }

        var uncommitedChanges = false;
        var done = this.async();

        var logCallback = function(error, result, code) {
          if (code != 0) {
            grunt.log.writeln('git log error: ' + result);
            done(false);
          }
          var hash = String(result).split(' ')[0].substr(0, 16);
          var versionString = hash + (uncommitedChanges ? '-dev' : '');
          var yamlData = grunt.file.read('app.yaml.base');
          yamlData = yamlData.replace('__APPLICATION__', appid);
          yamlData = yamlData.replace('__VERSION__', versionString);
          grunt.log.writeln('Generating yaml for application: ' + appid);
          grunt.file.write([targetDirectory, 'app.yaml'].join('/'), yamlData);
          done();
        };

        var statusCallback = function(error, result, code) {
          if (code != 0) {
            grunt.log.writeln('git status error: ' + result);
            done(false);
          }
          if (String(result).indexOf('\nnothing to commit, working ' +
                'directory clean') == -1) {
            uncommitedChanges = true;
          }
          grunt.util.spawn(
              {cmd: 'git', args: ['log', '--format=oneline', '-n', '1']},
              logCallback);
        };

        grunt.util.spawn({cmd: 'git', args: ['status']}, statusCallback);
        });

  grunt.registerTask('default',
      ['copy:source', 'copy:static',
      grunt.config.get('build.use_closure') ? 'closureBuilder' : 'nop',
      'yaml']);
};

