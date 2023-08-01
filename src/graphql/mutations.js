/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const registerResponse = /* GraphQL */ `
  mutation RegisterResponse($input: RegisterResponseInput) {
    registerResponse(input: $input) {
      verified
    }
  }
`;
export const verify = /* GraphQL */ `
  mutation Verify($input: VerifyInput, $account: String!) {
    verify(input: $input, account: $account) {
      verified
    }
  }
`;
export const createWebAuthn = /* GraphQL */ `
  mutation CreateWebAuthn(
    $input: CreateWebAuthnInput!
    $condition: ModelWebAuthnConditionInput
  ) {
    createWebAuthn(input: $input, condition: $condition) {
      sub
      challenge
      authrInfo {
        fmt
        publicKey
        counter
        credID
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateWebAuthn = /* GraphQL */ `
  mutation UpdateWebAuthn(
    $input: UpdateWebAuthnInput!
    $condition: ModelWebAuthnConditionInput
  ) {
    updateWebAuthn(input: $input, condition: $condition) {
      sub
      challenge
      authrInfo {
        fmt
        publicKey
        counter
        credID
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteWebAuthn = /* GraphQL */ `
  mutation DeleteWebAuthn(
    $input: DeleteWebAuthnInput!
    $condition: ModelWebAuthnConditionInput
  ) {
    deleteWebAuthn(input: $input, condition: $condition) {
      sub
      challenge
      authrInfo {
        fmt
        publicKey
        counter
        credID
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createAuthenticator = /* GraphQL */ `
  mutation CreateAuthenticator(
    $input: CreateAuthenticatorInput!
    $condition: ModelAuthenticatorConditionInput
  ) {
    createAuthenticator(input: $input, condition: $condition) {
      fmt
      publicKey
      counter
      credID
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAuthenticator = /* GraphQL */ `
  mutation UpdateAuthenticator(
    $input: UpdateAuthenticatorInput!
    $condition: ModelAuthenticatorConditionInput
  ) {
    updateAuthenticator(input: $input, condition: $condition) {
      fmt
      publicKey
      counter
      credID
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAuthenticator = /* GraphQL */ `
  mutation DeleteAuthenticator(
    $input: DeleteAuthenticatorInput!
    $condition: ModelAuthenticatorConditionInput
  ) {
    deleteAuthenticator(input: $input, condition: $condition) {
      fmt
      publicKey
      counter
      credID
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
