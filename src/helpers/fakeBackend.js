import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { GET_PRODUCTS } from "./url_helper";
import { products } from "../data/data";
import moment from "moment";

const fakeBackend = () => {
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onGet(new RegExp(`${GET_PRODUCTS}.*`)).reply((config) => {
    // Extract query parameters from the request
    const urlParams = new URLSearchParams(config.url.split("?")[1]);

    // Sample data
    let data = products;

    // Dynamically filter the data based on all query parameters
    urlParams.forEach((value, key) => {
      if (value) {
        if (key === "text") {
          // Match `text` value with `name` and `description`
          const searchText = value.toLowerCase();
          data = data.filter(
            (item) =>
              item.name.toLowerCase().includes(searchText) ||
              item.description.toLowerCase().includes(searchText)
          );
        } else if (key === "from" || key === "to") {
          // Handle date range filtering
          const fromDate = urlParams.get("from")
            ? moment(urlParams.get("from")).startOf("day") // Parse 'from' date and set to start of the day
            : null;
          const toDate = urlParams.get("to")
            ? moment(urlParams.get("to")).endOf("day") // Parse 'to' date and set to end of the day
            : null;

          data = data.filter((item) => {
            const itemDate = moment(item.launchDate, "DD MMM, YYYY"); // Parse 'launchDate' string into a moment object

            return (
              (!fromDate || itemDate.isSameOrAfter(fromDate)) && // Include from date
              (!toDate || itemDate.isSameOrBefore(toDate)) // Include to date
            );
          });
        } else {
          // Match other keys with their corresponding fields
          data = data.filter((item) => item[key]?.toString() === value);
        }
      }
    });

    return new Promise((resolve) => {
      setTimeout(() => resolve([200, data]), 500); // Simulate network latency
    });
  });
};

export default fakeBackend;
