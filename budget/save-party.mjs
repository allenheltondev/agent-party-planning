import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { buildResponse } from '../utils/helpers.mjs';

const client = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const { partyDate, partyName, partyCost } = event;

    const command = new PutItemCommand({
      TableName: process.env.BUDGET_TABLE,
      Item: marshall({
        pk: new Date().getFullYear().toString(),
        sk: `party#${partyDate}`,
        name: partyName,
        amount: partyCost,
        date: partyDate,
      }),
    });

    await client.send(command);

    return buildResponse(event, { message: 'Party saved successfully' });
  } catch (err) {
    console.error(err);
    return buildResponse(event, { message: 'Error saving party' });
  }
};
