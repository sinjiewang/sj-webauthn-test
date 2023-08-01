/* Amplify Params - DO NOT EDIT
	API_SJWEBAUTHNTEST_GRAPHQLAPIENDPOINTOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIKEYOUTPUT
	AUTH_SJWEBAUTHNTEST483C852A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AssertionChallengeBuilder = require('./utils/AssertionChallengeBuilder');
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
  
  results = await DdbWebAuthnActions.query({
    region: REGION,
    apiId: GRAPHQL_API_ID,
    env: ENV,
    condition: { sub },
  });

  if (!results.Count || !results.Items[0].authenticator) {
    Promise.reject(new Error('user has not registered an authenticator.'));
  }

  const { credID } = results.Items[0].authenticator;
  const assertion = new AssertionChallengeBuilder()
    .addAllowedCredential({ id: credID })
    .build();
  const { challenge } = assertion;

  await DdbWebAuthnActions.update({
    region: REGION,
    apiId: GRAPHQL_API_ID,
    env: ENV,
    condition: { sub },
    data: { challenge },
  });

  return assertion;
};
