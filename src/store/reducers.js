import { combineReducers } from "redux";

// Product
import Product from "./product/slice";

const rootReducer = combineReducers({
  Product,
});

export default rootReducer;
