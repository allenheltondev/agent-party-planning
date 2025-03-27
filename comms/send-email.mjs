import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { buildResponse, getParams } from '../utils/helpers.mjs';
const events = new EventBridgeClient();

export const handler = async (event) => {
  const { html, subject } = getParams(event, ['html', 'subject']);

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
  }));

  return buildResponse(event, { message: 'Email sent successfully' });
};
