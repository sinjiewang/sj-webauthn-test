/* Amplify Params - DO NOT EDIT
	API_SJWEBAUTHNTEST_GRAPHQLAPIENDPOINTOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIKEYOUTPUT
	AUTH_SJWEBAUTHNTEST483C852A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const Webauthn = require('webauthn');
const base64url = require('base64url');
const DdbWebAuthnActions = require('./utils/DdbWebAuthnActions');
const { getUserByEmail } = require('/opt/nodejs/cognitoActions');

const AUTH_USERPOOLID = process.env.AUTH_SJWEBAUTHNTEST483C852A_USERPOOLID;
const GRAPHQL_API_ID = process.env.API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT;
const ENV = process.env.ENV;
const REGION = process.env.REGION;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const email = event.arguments.account;
  let results = await getUserByEmail(AUTH_USERPOOLID, email);

  if (!results.length) {
    Promise.reject(new Error('user does not exist.'));
  }

  const { sub } = results[0].Attributes.reduce((acc, { Name, Value }) => ({[Name]: Value, ...acc}), {});
  const {
    id,
    rawId,
    response,
    type,
  } = event.arguments.input;

  if (!id || !rawId || !response || !type) {
    return Promise.reject(new Error('response missing one or more of id/rawId/response/type fields'));
  }

  let clientData;
  try {
    const json = base64url.decode(response.clientDataJSON);

    clientData = JSON.parse(json);
  } catch (err) {
    return Promise.reject(new Error('failed to decode client data'));
  }

  const { challenge } = clientData;

  results = await DdbWebAuthnActions.query({
    region: REGION,
    apiId: GRAPHQL_API_ID,
    env: ENV,
    condition: { sub },
  });

  if (!results.Count || results.Items[0].challenge != challenge) {
    return Promise.reject(new Error('mismatched challenge'));
  }

  const { authenticator } = results.Items[0];
  const { verified } = Webauthn.verifyAuthenticatorAssertionResponse(response, authenticator, true);

  return { verified };
};