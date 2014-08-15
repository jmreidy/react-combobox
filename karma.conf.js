var proxyquire = require('proxyquireify');
var _ = require('lodash');

var baseConfig = {
  basePath: '',

  frameworks: [
    'mocha',
    'chai',
    'sinon',
    'browserify'
  ],

  files: [
  ],

  exclude: [],

  browserify: {
    files: [
      'test/*.test.js'
    ],
    transform: ['reactify'],
    plugin: [proxyquire.plugin]
  },

  preprocessors: {
    '/**/*.browserify': 'browserify'
  },


  reporters: ['spec'],

  colors: true,

  autoWatch: true,

  browsers: ['Chrome'],

  singleRun: false,

  //npm auto-loads plugins
};

var customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

module.exports = function (config) {
  baseConfig.logLevel = config.LOG_INFO;

  if (process.env.NODE_ENV === 'ci') {
    config.set(_.extend(baseConfig, {
      browsers: Object.keys(customLaunchers),
      reports: ['spec', 'saucelabs'],
      singleRun: true,
      customLaunchers: customLaunchers,
      sauceLabs: {
        testName: 'React-Combobox Unit Tests'
      }
    }));
  }
  else {
    config.set(baseConfig);
  }

};
