global.Promise = require('bluebird');
const _        = require('lodash');
const axios    = require('axios');
const config   = require('./config.json');

function getLatestChromeVersion() {
  return axios
    .get('https://omahaproxy.appspot.com/all.json')
    .then(function(resp) {
      var cros_os = _.find(resp.data, { 'os': 'cros' });
      var browserVersion = _.find(cros_os.versions, { 'channel': 'stable' });
      return browserVersion.version;
    });
};

function postToSlack(version) {
  var message = 'Latest stable cros version: ' + version;
  var data = { text: message };
  var options = { headers: { 'Content-Type': 'application/json' }};
  return axios
    .post(config.SLACK_URL, data, options)
    .then(function(resp) {
      return message;
    });
};

exports.handler = function(event, context) {
  getLatestChromeVersion()
  .then(postToSlack)
  .then(context.succeed)
  .catch(context.fail);
};
