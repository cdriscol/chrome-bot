var AWS       = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var tableName = 'chrome-bot';
Promise.promisifyAll(Object.getPrototypeOf(docClient));

function getOsVersion(os) {
  var params = {
    TableName: tableName,
    Key: { 'os': os }
  };

  return docClient
    .getAsync(params)
    .then(function(item) {
      return item.Item ? item.Item.version : undefined;
    })
    .catch(function(err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      throw err;
    });
}

function saveOsVersion(os, version) {
  var params = {
    TableName: tableName,
    Key: { 'os': os },
    UpdateExpression: 'set version=:v',
    ExpressionAttributeValues: { ':v': version },
    ReturnValues: 'UPDATED_NEW'
  };

  return docClient
    .updateAsync(params)
    .then(function(item) {
      return item.version;
    })
    .catch(function(err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      throw err;
    });
}

module.exports = {
  getOsVersion: getOsVersion,
  saveOsVersion: saveOsVersion
};
