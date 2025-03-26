import { TopicClient } from '@gomomento/sdk';

const topics = new TopicClient({});

export const handler = async (event) => {
  try {
    const { message } = event;

    await topics.publish(process.env.CACHE_NAME, 'internal', message);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
