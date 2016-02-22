global.Promise = require('bluebird');
const https = require('https');
const http = require('http');
const axios = require('axios');
const _ = require('lodash');
const parseString = require('xml2js').parseString;
const url = require('url');
const SLACK_URL = 'https://hooks.slack.com/services/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';
const VERSIONS_URL = 'https://omahaproxy.appspot.com/all.json';
const slack_req_opts = url.parse(SLACK_URL);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json'};

exports.getChromeVersions = function() {
  return axios.get(VERSIONS_URL)
       .then(function(resp) {
         var cros_os = _.find(resp.data, {'os' : 'cros'});
         var browserVersion = _.find(cros_os.versions, {'channel' : 'stable'});
         return browserVersion.version;
       })
};

exports.postToSlack = function(message) {
    return axios.post(SLACK_URL,
      {text: message},
      {headers: {'Content-Type': 'application/json'}}
    );
};

exports.handler = function(event, context) {
    exports
      .getChromeVersions()
      .then(function(version) {
        return exports.postToSlack('Latest stable cros version: ' + version);
      })
      .then(function(response) {
        if (response.status === 200) {
            context.succeed('posted to slack');
        } else {
            context.fail('status code: ' + response.status);
        }
      })
      .catch(function(err) {
        console.error(err);
        context.fail(err);
      });
};
