/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const AWS = require('aws-sdk');

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

async function signUp(userPoolClientId, userName, password, options = {}) {
  var params = {
    ClientId: userPoolClientId, /* required */
    Password: password, /* required */
    Username: userName, /* required */
    ...options
  };

  try {
    const result = await cognitoIdentityServiceProvider.signUp(params).promise();
    console.log(`Success adding ${result}`);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserAttributes(userPoolId, username, options = {}) {
  var params = {
    UserPoolId: userPoolId, /* required */
    Username: username,
    ...options
  };
  try {
    const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
    console.log(`Success update ${username} with options:${JSON.stringify(options)}`);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createUser(userPoolId, options = {}) {
  var params = {
    UserPoolId: userPoolId, /* required */
    ...options
  };
  try {
    const result = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
    console.log(`Success adding ${result}`);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function addUserToGroup(userPoolId, username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUserFromGroup(userPoolId, username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username} from ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminRemoveUserFromGroup(params).promise();
    console.log(`Removed ${username} from ${groupname}`);
    return {
      message: `Removed ${username} from ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminConfirmSignUp(params).promise();
    console.log(`Confirmed ${username} registration`);
    return {
      message: `Confirmed ${username} registration`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteUser(userPoolId, username) {
  var params = {
    UserPoolId: userPoolId, /* required */
    Username: username /* required */
  };
  try {
    const result = await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
    console.log(`Deleted ${username}`);
    return result;
  } catch (err) {
    console.log('deleteUser fail:', err);
    throw err;
  }
}

async function disableUser(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminDisableUser(params).promise();
    console.log(`Disabled ${username}`);
    return {
      message: `Disabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function enableUser(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminEnableUser(params).promise();
    console.log(`Enabled ${username}`);
    return {
      message: `Enabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUser(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to retrieve information for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUserById(userPoolId, userSub) {
  console.log(`Attempting to retrieve information for ${userSub}`);

  var filter = "sub = \"" + userSub + "\"";
  var req = {
    "Filter": filter,
    "UserPoolId": userPoolId
  };

  try {
    const result = await cognitoIdentityServiceProvider.listUsers(req).promise();
    return result.Users;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUserByEmail(userPoolId, email) {
  console.log(`Attempting to retrieve information for ${email}`);

  var filter = "email = \"" + email + "\"";
  var req = {
    "Filter": filter,
    "UserPoolId": userPoolId
  };

  try {
    const result = await cognitoIdentityServiceProvider.listUsers(req).promise();
    return result.Users;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUserInfo(userSub) {
  return getUserById(USERPOOLID, userSub)
    .then((user) => {
      if (!user.UserAttributes) {
        return Promise.resolve({ sub: userSub });
      }
      return Promise.resolve(user.UserAttributes.reduce((acc, cur) => {
        const regCustomAttr = /^custom:(\S+)/;
        const { Name, Value } = cur;
        if (regCustomAttr.test(Name)) {
          if (!acc.custom) {
            acc.custom = {};
          }
          acc.custom[Name.match(regCustomAttr)[1]] = Value;
        } else {
          acc[Name] = Value;
        }
        return acc;
      }, {}));
    });
};

async function listUsers(userPoolId, Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log('Attempting to list users');

  try {
    const result = await cognitoIdentityServiceProvider.listUsers(params).promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroups(userPoolId, Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log('Attempting to list groups');

  try {
    const result = await cognitoIdentityServiceProvider.listGroups(params).promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroupsForUser(userPoolId, username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list groups for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminListGroupsForUser(params).promise();
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach(val => {
      delete val.UserPoolId, delete val.LastModifiedDate, delete val.CreationDate, delete val.Precedence, delete val.RoleArn;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersInGroup(userPoolId, groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list users in group ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(userPoolId, username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to signout ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminUserGlobalSignOut(params).promise();
    console.log(`Signed out ${username} from all devices`);
    return {
      message: `Signed out ${username} from all devices`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  signUp,
  addUserToGroup,
  removeUserFromGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  createUser,
  deleteUser,
  getUser,
  getUserById,
  getUserByEmail,
  getUserInfo,
  listUsers,
  listGroups,
  listGroupsForUser,
  listUsersInGroup,
  signUserOut,
  updateUserAttributes
};
