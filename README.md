# chrome-bot
This is an [AWS Lambda](https://aws.amazon.com/lambda/) service that will check the latest stable Chrome version and post it to a Slack channel via an [Incoming Webhook](https://api.slack.com/incoming-webhooks).

### setting up slack
You can get your webhook URL by following the steps provided [here](https://api.slack.com/incoming-webhooks).

You'll need to create a `config.json` file in the root of the project that contains _your_ webhook URL.
```javascript
{
  "SLACK_URL": "https://hooks.slack.com/services/{custom}"
}
```

### setting up aws
* [Install AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* Setup an IAM user with the `AWSLambdaFullAccess` policy.
* Configure AWS CLI with new IAM user creds
```bash
$ aws configuration
```
* Setup an event source for the lambda function
 * _CloudWatch Events - Schedule_ will allow cron expressions

### deploying
Run the deploy script
```bash
$ ./scripts/deploy.sh
```
