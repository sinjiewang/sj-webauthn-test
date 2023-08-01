/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const register = /* GraphQL */ `
  query Register {
    register {
      challenge
      user {
        id
        name
        displayName
      }
      attestation
      authenticatorSelection {
        authenticatorAttachment
      }
      rp {
        name
        id
      }
      pubKeyCredParams {
        alg
        type
      }
    }
  }
`;
export const prelogin = /* GraphQL */ `
  query Prelogin($account: String!) {
    prelogin(account: $account) {
      allowCredentials {
        type
        id
        transports
      }
      challenge
    }
  }
`;
export const getWebAuthn = /* GraphQL */ `
  query GetWebAuthn($sub: String!) {
    getWebAuthn(sub: $sub) {
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
export const listWebAuthns = /* GraphQL */ `
  query ListWebAuthns(
    $sub: String
    $filter: ModelWebAuthnFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listWebAuthns(
      sub: $sub
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getAuthenticator = /* GraphQL */ `
  query GetAuthenticator($id: ID!) {
    getAuthenticator(id: $id) {
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
export const listAuthenticators = /* GraphQL */ `
  query ListAuthenticators(
    $filter: ModelAuthenticatorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuthenticators(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        fmt
        publicKey
        counter
        credID
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
