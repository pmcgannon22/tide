module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
	'app/lib/angular/angular.js',
	'app/lib/angular/angular-*.js',
	'public/js/**/*.js',
	'public/js/*.js',
	'test/unit_tests/**/*.js',
	'node_modules/socket.io',
    ],

    exclude : [
	'app/lib/angular/angular-loader.js',
	'app/lib/angular/*.min.js',
	'app/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

      frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
