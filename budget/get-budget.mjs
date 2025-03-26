import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { buildResponse } from '../utils/helpers.mjs';

const client = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const year = new Date().getFullYear();

    const command = new QueryCommand({
      TableName: process.env.BUDGET_TABLE,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: marshall({ ':pk': year }),
    });

    const response = await client.send(command);

    const budgetItems = response.Items.map((item) => unmarshall(item));

    const annualBudget = budgetItems.find((item) => item.sk === 'budget')?.amount ?? 5000;
    const parties = budgetItems.filter((item) => item.sk !== 'budget').map(item => {
      return {
        name: item.name,
        amount: item.amount,
        date: item.date,
      };
    });

    return buildResponse(event, {
      annualBudget,
      parties,
    });
  } catch (err) {
    console.error(err);
    return buildResponse(event, { message: 'Error getting budget' });
  }
};
