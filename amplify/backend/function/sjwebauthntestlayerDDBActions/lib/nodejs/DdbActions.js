const { v4: uuidv4 } = require('uuid');
const { ddbQuery, ddbPut, ddbUpdate, ddbDelete } = require('./dynamodbOperator');

module.exports = class DdbActions {
  static TABLE = "";

  static async query({ region, apiId, env, condition }={}) {
    const { TABLE } = this;
    const expressions = [];
    const names = {};
    const values = {};
  
    Object.entries(condition).forEach(([key, value], index) => {
      const keyIndex = `#key${index}`;
      const valueIndex = `:val${index}`;
      expressions.push(`${keyIndex} = ${valueIndex}`);
      names[keyIndex] = key;
      values[valueIndex] = value;
    });
  
    const queryData = {
      TableName : `${TABLE}-${apiId}-${env}`,
      KeyConditionExpression: expressions.join(' and '),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    };
  
    return ddbQuery(region, queryData);
  }

  static async create({ region, apiId, env, data }={}) {
    const { TABLE } = this;
    const now = new Date().toISOString();
    const itemId = uuidv4();
    const putData = {
      TableName : `${TABLE}-${apiId}-${env}`,
      Item: {
        'createdAt': now,
        'updatedAt': now,
        'id': itemId,
        '__typename': TABLE,
        ...data,
      }
    };
  
    return ddbPut(region, putData).then(() => putData.Item);
  }

  static async update({ region, apiId, env, condition, data }={}) {
    const { TABLE } = this;
    const expressions = [];
    const names = {};
    const values = {};
  
    data.updatedAt = new Date().toISOString();
  
    Object.entries(data).forEach(([key, value], index) => {
      const keyIndex = `#key${index}`;
      const valueIndex = `:val${index}`;
      expressions.push(`${keyIndex} = ${valueIndex}`);
      names[keyIndex] = key;
      values[valueIndex] = value;
    });
  
    const updateData = {
      TableName : `${TABLE}-${apiId}-${env}`,
      Key: condition,
      UpdateExpression: `set ${ expressions.join(', ') }`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    };
  
    return ddbUpdate(region, updateData);
  }

  static async delete({ region, apiId, env, condition }={}) {
    const { TABLE } = this;
    const deleteData = {
      TableName : `${TABLE}-${apiId}-${env}`,
      Key: condition,
    };
  
    return ddbDelete(region, deleteData);
  }
};
