/* Amplify Params - DO NOT EDIT
	API_SJWEBAUTHNTEST_GRAPHQLAPIENDPOINTOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT
	API_SJWEBAUTHNTEST_GRAPHQLAPIKEYOUTPUT
	AUTH_SJWEBAUTHNTEST483C852A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const crypto = require('crypto');
const base64url = require('base64url');
const AttestationChallengeBuilder = require('./utils/AttestationChallengeBuilder');
const Dictionaries = require('./utils/Dictionaries');
const DdbWebAuthnActions = require('./utils/DdbWebAuthnActions');
const { getUserById } = require('/opt/nodejs/cognitoActions');

const AUTH_USERPOOLID = process.env.AUTH_SJWEBAUTHNTEST483C852A_USERPOOLID;
const GRAPHQL_API_ID = process.env.API_SJWEBAUTHNTEST_GRAPHQLAPIIDOUTPUT;
const ENV = process.env.ENV;
const REGION = process.env.REGION;
const rpName = process.env.RP_NAME || 'amplify webauthn test';
const rpID = process.env.RP_ID || 'd1ael32fptzs8f.cloudfront.net';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { sub } = event.identity;
  const { email } = await getUserById(AUTH_USERPOOLID, sub)
    .then(res => res[0].Attributes.reduce((acc, { Name, Value }) => ({[Name]: Value, ...acc}), {})); 
  const user = {
    id: base64url(crypto.randomBytes(32)),
    name: email,
  };
  const attestation = new AttestationChallengeBuilder()
    .setUserInfo(user)
    .setAttestationType(Dictionaries.AttestationConveyancePreference.NONE)
    .setAuthenticator(Dictionaries.AuthenticatorAttachment.PLATFORM)
    .setRelyingPartyInfo({ id: rpID, name: rpName })
    .build();
  const { challenge } = attestation;
  const result = await DdbWebAuthnActions.query({
    region: REGION,
    apiId: GRAPHQL_API_ID,
    env: ENV,
    condition: { sub },
  });

  if (result.Count) {
    await DdbWebAuthnActions.update({
        region: REGION,
        apiId: GRAPHQL_API_ID,
        env: ENV,
        condition: { sub },
        data: { challenge },
      });
  } else {
    await DdbWebAuthnActions.create({
      region: REGION,
      apiId: GRAPHQL_API_ID,
      env: ENV,
      data: {
        sub,
        challenge,
      }
    });
  }

  return attestation;
};
