// be sure to configure your function runtime with the `twilio-flex-token-validator` npm package
// https://www.twilio.com/console/runtime/functions/configure
// twilio-flex-token-validator:*

const JWEValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = JWEValidator(function(context, event, callback) {

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();

  client
  .taskrouter
  .workspaces(context.TWILIO_WORKSPACE_SID)
  .taskQueues
  .list()
  .then(queues => {
      const transformedQueues = queues.map(queue => {
          return {
              sid: queue.sid,
              name: queue.friendlyName
          }
      })
      response.setBody(JSON.stringify(transformedQueues));
      callback(null, response);
  }).catch(e => {
      callback(e);
  })
});