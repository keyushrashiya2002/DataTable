import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

export const getProducts = (data) => {
  return api.get(url.GET_PRODUCTS, data);
};
