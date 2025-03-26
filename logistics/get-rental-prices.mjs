import priceList from './price-list.json' assert { type: 'json' };
import { buildResponse } from '../utils/helpers.mjs';

export const handler = async (event) => {
  return buildResponse(event, priceList);
};
