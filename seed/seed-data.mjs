import { DynamoDB, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient();

export const handler = async (event) => {
  await seedLogisticsTable();
  await seedBudgetTable();
};

const seedLogisticsTable = async () => {
  const inventory = [
    { pk: "INVENTORY", sk: "chair", quantity: 50 },
    { pk: "INVENTORY", sk: "projector", quantity: 2 },
    { pk: "INVENTORY", sk: "speaker_system", quantity: 1 }
  ];

  for(const item of inventory){
    await ddb.send(new PutItemCommand({
      TableName: process.env.LOGISTICS_TABLE,
      Item: marshall(item)
    }));

  }
}

const seedBudgetTable = async () => {
  await ddb.send(new PutItemCommand({
    TableName: process.env.BUDGET_TABLE,
    Item: marshall({
      pk: new Date().getFullYear().toString(),
      sk: 'budget',
      amount: 3000,
    })
  }));
}
