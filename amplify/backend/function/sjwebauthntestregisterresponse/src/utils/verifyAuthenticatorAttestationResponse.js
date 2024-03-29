const Webauthn = require('webauthn');
const base64url = require('base64url');
const cbor = require('cbor');
const iso_3166_1 = require('iso-3166-1');
const { Certificate } = require('@fidm/x509');

const verifyAuthenticatorAttestationResponse = function(webauthnResponse) {
  const attestationBuffer = base64url.toBuffer(webauthnResponse.attestationObject);
    const ctapMakeCredResp = cbor.decodeAllSync(attestationBuffer)[0];

    console.log('CTAP_RESPONSE', ctapMakeCredResp)

    const authrDataStruct = Webauthn.parseMakeCredAuthData(ctapMakeCredResp.authData);
    console.log('AUTHR_DATA_STRUCT', authrDataStruct)

    if (!(authrDataStruct.flags & 0x01)) // U2F_USER_PRESENTED
      throw new Error('User was NOT presented durring authentication!');

    const publicKey = Webauthn.COSEECDHAtoPKCS(authrDataStruct.COSEPublicKey)

    const response = { 'verified': false };
    if (ctapMakeCredResp.fmt === 'none') {
      console.log('None attestation')
      response.verified = true;
    } else if (ctapMakeCredResp.fmt === 'fido-u2f') {
      const clientDataHash = Webauthn.hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
      const reservedByte = Buffer.from([0x00]);
      const signatureBase = Buffer.concat([reservedByte, authrDataStruct.rpIdHash, clientDataHash, authrDataStruct.credID, publicKey]);

      const PEMCertificate = Webauthn.ASN1toPEM(ctapMakeCredResp.attStmt.x5c[0]);
      const signature = ctapMakeCredResp.attStmt.sig;

      response.verified = Webauthn.verifySignature(signature, signatureBase, PEMCertificate)
    } else if (ctapMakeCredResp.fmt === 'packed' && ctapMakeCredResp.attStmt.hasOwnProperty('x5c')) {
      console.log('Packed attestation')
      const clientDataHash = Webauthn.hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
      const signatureBase = Buffer.concat([ctapMakeCredResp.authData, clientDataHash]);

      const PEMCertificate = Webauthn.ASN1toPEM(ctapMakeCredResp.attStmt.x5c[0]);
      const signature = ctapMakeCredResp.attStmt.sig;

      const pem = Certificate.fromPEM(PEMCertificate);

      // Getting requirements from https://www.w3.org/TR/webauthn/#packed-attestation
      const aaguid_ext = pem.getExtension('1.3.6.1.4.1.45724.1.1.4')

      response.verified = // Verify that sig is a valid signature over the concatenation of authenticatorData
        // and clientDataHash using the attestation public key in attestnCert with the algorithm specified in alg.
        Webauthn.verifySignature(signature, signatureBase, PEMCertificate) &&
        // version must be 3 (which is indicated by an ASN.1 INTEGER with value 2)
        pem.version == 3 &&
        // ISO 3166 valid country
        typeof iso_3166_1.whereAlpha2(pem.subject.countryName) !== 'undefined' &&
        // Legal name of the Authenticator vendor (UTF8String)
        pem.subject.organizationName &&
        // Literal string “Authenticator Attestation” (UTF8String)
        pem.subject.organizationalUnitName === 'Authenticator Attestation' &&
        // A UTF8String of the vendor’s choosing
        pem.subject.commonName &&
        // The Basic Constraints extension MUST have the CA component set to false
        !pem.extensions.isCA &&
        // If attestnCert contains an extension with OID 1.3.6.1.4.1.45724.1.1.4 (id-fido-gen-ce-aaguid)
        // verify that the value of this extension matches the aaguid in authenticatorData.
        // The extension MUST NOT be marked as critical.
        (aaguid_ext != null ?
          (authrDataStruct.hasOwnProperty('aaguid') ?
            !aaguid_ext.critical && aaguid_ext.value.slice(2).equals(authrDataStruct.aaguid) : false)
          : true);

      // Self signed
    } else if (ctapMakeCredResp.fmt === 'packed') {
      console.log('Self signed attestation')
      const clientDataHash = Webauthn.hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
      const signatureBase = Buffer.concat([ctapMakeCredResp.authData, clientDataHash]);
      const PEMCertificate = Webauthn.ASN1toPEM(publicKey);

      const { attStmt: { sig: signature, alg } } = ctapMakeCredResp

      response.verified = // Verify that sig is a valid signature over the concatenation of authenticatorData
        // and clientDataHash using the attestation public key in attestnCert with the algorithm specified in alg.
        Webauthn.verifySignature(signature, signatureBase, PEMCertificate) && alg === -7
    } else if (ctapMakeCredResp.fmt === 'android-safetynet') {
      console.log("Android safetynet request\n")
      console.log(ctapMakeCredResp)

      let [header, payload, signature] = ctapMakeCredResp.attStmt.response.toString('utf8').split('.')
      const signatureBase = Buffer.from([header, payload].join('.'))

      header = JSON.parse(base64url.decode(header))
      payload = JSON.parse(base64url.decode(payload))
      signature = base64url.toBuffer(signature)

      console.log('JWS HEADER', header)
      console.log('JWS PAYLOAD', payload)
      console.log('JWS SIGNATURE', signature)

      const PEMCertificate = Webauthn.ASN1toPEM(Buffer.from(header.x5c[0], 'base64'))

      const pem = Certificate.fromPEM(PEMCertificate)

      console.log('PEM', pem)

      response.verified = // Verify that sig is a valid signature over the concatenation of authenticatorData
        // and clientDataHash using the attestation public key in attestnCert with the algorithm specified in alg.
        Webauthn.verifySignature(signature, signatureBase, PEMCertificate) &&
        // version must be 3 (which is indicated by an ASN.1 INTEGER with value 2)
        pem.version == 3 &&
        pem.subject.commonName === 'attest.android.com'
    } else {
      throw new Error(`Unsupported attestation format: ${ctapMakeCredResp.fmt}`);
    }

    if (response.verified) {
      response.authrInfo = {
        fmt: 'fido-u2f',
        publicKey: base64url.encode(publicKey),
        counter: authrDataStruct.counter,
        credID: base64url.encode(authrDataStruct.credID)
      }
      console.log('RESPONSE', response)
    } else {
      console.error('MakeCredential request could not be verified')
    }

    return response
};

module.exports = verifyAuthenticatorAttestationResponse;
