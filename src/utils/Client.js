
/**
 * Dependencies
 * @ignore
 */

/**
 * Module Dependencies
 * @ignore
 */
import base64url from './base64url';
import { API } from '@aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

/**
 * Client
 * @ignore
 */
class Client {
  // constructor (options = {}) {
  //   const defaults = {
  //     pathPrefix: '/webauthn',
  //     credentialEndpoint: '/register',
  //     assertionEndpoint: '/login',
  //     challengeEndpoint: '/response',
  //     logoutEndpoint: '/logout',
  //   }

  //   Object.assign(this, defaults, options)
  // }

  static publicKeyCredentialToJSON (pubKeyCred) {
    if (ArrayBuffer.isView(pubKeyCred)) {
      return Client.publicKeyCredentialToJSON(pubKeyCred.buffer)
    }

    if (pubKeyCred instanceof Array) {
      const arr = []

      for (let i of pubKeyCred) {
        arr.push(Client.publicKeyCredentialToJSON(i))
      }

      return arr
    }

    if (pubKeyCred instanceof ArrayBuffer) {
      return base64url.encode(pubKeyCred)
    }

    if (pubKeyCred instanceof Object) {
      const obj = {}

      for (let key in pubKeyCred) {
        obj[key] = Client.publicKeyCredentialToJSON(pubKeyCred[key])
      }

      return obj
    }

    return pubKeyCred
  }

  static generateRandomBuffer (len) {
    const buf = new Uint8Array(len || 32)
    window.crypto.getRandomValues(buf)
    return buf
  }

  static preformatMakeCredReq (makeCredReq) {
    makeCredReq.challenge = base64url.decode(makeCredReq.challenge)
    makeCredReq.user.id = base64url.decode(makeCredReq.user.id)
    return makeCredReq
  }

  static preformatGetAssertReq (getAssert) {
    getAssert.challenge = base64url.decode(getAssert.challenge)

    for (let allowCred of getAssert.allowCredentials) {
      allowCred.id = base64url.decode(allowCred.id)
    }

    return getAssert
  }

  async getMakeCredentialsChallenge (/*formBody*/) {
    return API.graphql({
      query: queries.register,
    }).then(res => res.data.register);
  }

  async sendRegisterResponse (body) {
    const { id, rawId, type } = body;
    const { attestationObject, clientDataJSON } = body.response;

    return API.graphql({
      query: mutations.registerResponse,
      variables: {
        input: {
          id, rawId, type,
          response: {attestationObject, clientDataJSON},
        }
      },
    })
    .then(res => res.data.registerResponse)
    .then(({ verified }) => {
      if (verified) console.warn('register success');
      else throw new Error('register fail')
    });
  }

  async getGetAssertionChallenge (data) {
    return API.graphql({
      query: queries.prelogin,
      variables: data,
    }).then(res => res.data.prelogin);
  }

  async sendWebAuthnResponse (body, data) {
    const { id, rawId, type, response } = body;
    const { account } = data;
    return API.graphql({
      query: mutations.verify,
      variables: {
        input: { id, rawId, type, response },
        account,
      },
    })
    .then(res => res.data.verify)
    .then(({ verified }) => {
      if (verified) console.warn('auth success');
      else throw new Error('auth fail')
    });
  }

  async register () {
    const challenge = await this.getMakeCredentialsChallenge()
    console.log('REGISTER CHALLENGE', challenge)

    const publicKey = Client.preformatMakeCredReq(challenge)
    console.log('REGISTER PUBLIC KEY', publicKey)

    const credential = await navigator.credentials.create({ publicKey })
    console.log('REGISTER CREDENTIAL', credential)

    const credentialResponse = Client.publicKeyCredentialToJSON(credential)
    console.log('REGISTER RESPONSE', credentialResponse)

    return await this.sendRegisterResponse(credentialResponse)
  }

  async login (data = {}) {
    const challenge = await this.getGetAssertionChallenge(data)
    console.log('LOGIN CHALLENGE', challenge)

    const publicKey = Client.preformatGetAssertReq(challenge)
    console.log('LOGIN PUBLIC KEY', publicKey)

    const credential = await navigator.credentials.get({ publicKey })
    console.log('LOGIN CREDENTIAL', credential)

    const credentialResponse = Client.publicKeyCredentialToJSON(credential)
    console.log('LOGIN RESPONSE', credentialResponse)

    // return await this.sendWebAuthnResponse(credentialResponse, data)
    return credentialResponse
  }

  async logout () {
    const response = await fetch(`${this.pathPrefix}${this.logoutEndpoint}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.status !== 200) {
      throw new Error('Server responded with error.')
    }

    return await response.json()
  }
}

/**
 * Exports
 * @ignore
 */
export default Client
