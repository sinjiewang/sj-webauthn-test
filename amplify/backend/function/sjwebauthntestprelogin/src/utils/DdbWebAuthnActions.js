const DdbActions = require('/opt/nodejs/DdbActions');

class DdbWebAuthnActions extends DdbActions {
  static TABLE = 'WebAuthn';
};

module.exports = DdbWebAuthnActions;
