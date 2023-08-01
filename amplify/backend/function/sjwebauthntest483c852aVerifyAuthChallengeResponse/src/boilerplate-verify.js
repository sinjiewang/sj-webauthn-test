const Webauthn = require('webauthn');
const base64url = require('base64url');

/**
 * @type {import('@types/aws-lambda').VerifyAuthChallengeResponseTriggerHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  event.response.answerCorrect = false;

  const answer = JSON.parse(event.request.privateChallengeParameters.answer);
  const {
    id,
    rawId,
    response,
    type,
  } = JSON.parse(event.request.challengeAnswer);

  if (!id || !rawId || !response || !type) {
    console.error('response missing one or more of id/rawId/response/type fields');
    return event;
  }

  let clientData;
  try {
    const json = base64url.decode(response.clientDataJSON);

    clientData = JSON.parse(json);
  } catch (err) {
    console.error('failed to decode client data');
    return event;
  }

  const { challenge } = clientData;

  if (answer.challenge != challenge) {
    console.error('mismatched challenge', answer.challenge, challenge);
    return event;
  }

  const { verified } = Webauthn.verifyAuthenticatorAssertionResponse(response, answer.authenticator, true);

  if (verified) {
    event.response.answerCorrect = true;
  }

  console.log('return', event);

  return event;
};
