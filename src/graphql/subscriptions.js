/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWebAuthn = /* GraphQL */ `
  subscription OnCreateWebAuthn($filter: ModelSubscriptionWebAuthnFilterInput) {
    onCreateWebAuthn(filter: $filter) {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateWebAuthn = /* GraphQL */ `
  subscription OnUpdateWebAuthn($filter: ModelSubscriptionWebAuthnFilterInput) {
    onUpdateWebAuthn(filter: $filter) {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteWebAuthn = /* GraphQL */ `
  subscription OnDeleteWebAuthn($filter: ModelSubscriptionWebAuthnFilterInput) {
    onDeleteWebAuthn(filter: $filter) {
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
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAuthenticator = /* GraphQL */ `
  subscription OnCreateAuthenticator(
    $filter: ModelSubscriptionAuthenticatorFilterInput
  ) {
    onCreateAuthenticator(filter: $filter) {
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
export const onUpdateAuthenticator = /* GraphQL */ `
  subscription OnUpdateAuthenticator(
    $filter: ModelSubscriptionAuthenticatorFilterInput
  ) {
    onUpdateAuthenticator(filter: $filter) {
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
export const onDeleteAuthenticator = /* GraphQL */ `
  subscription OnDeleteAuthenticator(
    $filter: ModelSubscriptionAuthenticatorFilterInput
  ) {
    onDeleteAuthenticator(filter: $filter) {
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
