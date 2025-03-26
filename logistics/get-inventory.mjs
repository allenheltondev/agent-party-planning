import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { buildResponse } from "../utils/helpers.mjs";

const ddb = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const response = await ddb.send(new QueryCommand({
      TableName: process.env.LOGISTICS_TABLE,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: marshall({ ':pk': 'INVENTORY' }),
    }));

    const items = response.Items?.map((item) => {
      const inventoryItem = unmarshall(item);
      return {
        name: inventoryItem.sk,
        quantity: inventoryItem.quantity,
      };
    }) ?? [];

    return buildResponse(event, items);
  } catch (err) {
    console.error(err);
    buildResponse(event, { message: 'Error getting inventory' });
  }
};
