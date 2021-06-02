var browserstack = require('browserstack-local');

exports.config = {
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
  'specs': [ '../feature_files/*.feature' ],
  'getPageTimeout': 60000,
  'allScriptsTimeout': 500000,
  'capabilities': {
    'browserstack.local': true,
    'browserstack.debug': true,
    'resolution': '1600x1200',
    'browserstack.localIdentifier': process.env.IDENTIFIER,
    'browserstack.idleTimeout' : '300',
    'browserName': 'Chrome',
    'os' : 'Windows',
    'os_version' : '10',
    'shardTestFiles': true,
    'maxInstances': process.env.MAX_SESSIONS
  },

  SELENIUM_PROMISE_MANAGER: false,
  // specifying number of parallel sessions to be run
  maxSessions: process.env.MAX_SESSIONS,
  //Parameters
  params: {
    baseUrl: '',
    downloadedPdf: '',
  },
  // Code to start browserstack local before start of test
  beforeLaunch: function(){
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({
          'key': exports.config['browserstackKey'],
          'forceLocal': 'true',
          'force': 'true',          
          'localIdentifier': process.env.IDENTIFIER,
        }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  onPrepare: function () {
    browser.waitForAngularEnabled(false);
    if (!process.env.SITE_URL) {
      browser.params.baseUrl = 'https://www.commbank.com.au/';
    } else {
      browser.params.baseUrl = process.env.SITE_URL;
    }
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function(){
    return new Promise(function(resolve, reject){
      exports.bs_local.stop(resolve);
    });
  },

  cucumberOpts: {
    require: ['../step_definitions/*.js'],
    tags: ['@TEST'],
    format: 'json:reports/TestResults.json',
    profile: false,
    'no-source': true
    },
    ignoreUncaughtExceptions: true
};