exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  getPageTimeout: 60000,
  allScriptsTimeout: 600000,
  framework: 'custom',
  // path relative to the current config file
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'chrome',
    acceptSslCerts: 'true',
  },
  SELENIUM_PROMISE_MANAGER: false,
  // Spec patterns are relative to this directory.
  specs: [
    '../feature_files/*.feature'
  ],

  params: {
    baseUrl: '',
    downloadedPdf: '',
  },

  onPrepare: function () {
    //browser.ignoreSynchronization = true;`
    browser.waitForAngularEnabled(false);
    if (!process.env.SITE_URL) {
      browser.params.baseUrl = 'https://codility-frontend-prod.s3.amazonaws.com/media/task_static/qa_csharp_search/862b0faa506b8487c25a3384cfde8af4/static/attachments/reference_page.html';      
    } else {  
      browser.params.baseUrl = process.env.SITE_URL;
    }
  },

  cucumberOpts: {
    require: ['../step_definitions/*.js'],
    tags: ['@CodilityTest'],
    format: 'json:reports/TestResults.json',
    profile: false,
    'no-source': true
  },

  ignoreUncaughtExceptions: true
};