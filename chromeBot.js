global.Promise  = require('bluebird');
var _           = require('lodash');
var axios       = require('axios');
var config      = require('./config.json');
var dataService = require('./dataService');
var os          = 'cros';

function getLatestChromeVersion() {
  return axios
    .get('https://omahaproxy.appspot.com/all.json')
    .then(function(resp) {
      var cros_os = _.find(resp.data, { 'os': os });
      var browserVersion = _.find(cros_os.versions, { 'channel': 'stable' });
      return browserVersion.version;
    });
};

function postToSlack(version) {
  var message = 'Latest stable cros version updated to ' + version;
  var data = { text: message };
  var options = { headers: { 'Content-Type': 'application/json' }};
  return axios
    .post(config.SLACK_URL, data, options)
    .then(function(resp) {
      return message;
    });
};

exports.handler = function(event, context) {
  Promise.all([
    dataService.getOsVersion(os),
    getLatestChromeVersion()
  ])
  .spread(function(lastVersion, currentVersion) {
    if(lastVersion !== currentVersion) {
      return postToSlack(currentVersion)
        .then(function() {
          return dataService.saveOsVersion(os, currentVersion);
        })
        .then(function() {
          return 'Updated version to ' + currentVersion;
        });
    } else {
      return 'Same version as before: ' + currentVersion;
    }
  })
  .then(context.succeed)
  .catch(context.fail);
};
