# chrome-bot
This is an [AWS Lambda](https://aws.amazon.com/lambda/) service that will check the latest stable Chrome version and post it to a Slack channel via an [Incoming Webhook](https://api.slack.com/incoming-webhooks).

### Configuration
Create a `config.json` file at the project root in this format:
```javascript
{
  "SLACK_URL": "{Slack webhook URL}",
  "DYNAMO_TABLE": "{DynamoDB table name}"
}
```

### Slack webhook URL
You can get your webhook URL by following the steps provided [here](https://api.slack.com/incoming-webhooks).

You'll need to add _your_ webhook URL to `config.json`.

### Setting up AWS
This project utilizes [AWS Lambda](https://aws.amazon.com/lambda/) and [DynamoDB](https://aws.amazon.com/dynamodb/) services.
#### Lambda
Lambda is used to run the main handler function in `chromeBot.js`.
* Setup an IAM user with the `AWSLambdaFullAccess` policy.
* Configure AWS CLI with new IAM user creds
```bash
$ aws configuration
```
* Setup an event source for the lambda function
 * _CloudWatch Events - Schedule_ will allow cron expressions

#### DynamoDB
DynamoDB is used to store the last version so that only new versions will trigger a Slack post.
* Create a table in DynamoDB
* Add your table name to `config.json`
* Make sure the role running your Lambda function has DynamoDB permissions

```javascript
// DynamoDB document format:
{'os': 'cors', 'version': '48.0.2564.116'}
```

### deploying
Before you deploy, you'll need to install the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html).

Then you can _simply_ run the deploy script:
```bash
$ ./scripts/deploy.sh
```
