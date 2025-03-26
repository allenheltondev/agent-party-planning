import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const events = new EventBridgeClient();

export const handler = async (event) => {
  const {html, subject} = event;

  await events.send(new PutEventsCommand({
    Entries: [
      {
        Detail: JSON.stringify({
          to: 'allenheltondev@gmail.com',
          subject,
          html
        }),
        DetailType: "Send Email",
        Source: "comms-agent"
      }
    ]
  }))
}
