const {
  API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT,
  ENV,
  REGION,
} = process.env;
const DdbWebAuthnActions = require('./utils/DdbWebAuthnActions');
/**
 * @type {import('@types/aws-lambda').CreateAuthChallengeTriggerHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    const sub = event.request.userAttributes.sub;
    const results = await DdbWebAuthnActions.query({
      region: REGION,
      apiId: API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT,
      env: ENV,
      condition: { sub },
    });

    if (results?.Items[0]?.authenticator) {
      event.response.publicChallengeParameters = { trigger: 'true' };
      event.response.privateChallengeParameters = {};
      event.response.privateChallengeParameters.answer = JSON.stringify(results.Items[0]);
      // event.response.challengeMetadata = 'CUSTOM_CHALLENGE';
    }
  }
  console.log('return', event);

  return event;
};
