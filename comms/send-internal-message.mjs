import { TopicClient } from '@gomomento/sdk';
import { buildResponse, getParam } from '../utils/helpers.mjs';
const topics = new TopicClient({});

export const handler = async (event) => {
  try {
    const message  = getParam(event, 'message');
    console.log(event, message);

    await topics.publish(process.env.CACHE_NAME, 'internal', message);
    return buildResponse(event, { message: 'Message published successfully' });
  } catch (err) {
    console.error(err);
    return buildResponse(event, { message: 'Error publishing message' });
  }
};
