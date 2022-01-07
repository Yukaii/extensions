import moment from "moment";
import { Endpoint } from "../types";

export function shouldUpdateEndpoint (endpoint: Endpoint) {
  const now = moment();
  const lastFetchedAt = moment(endpoint.lastFetchedAt);
  const minutesPassed = now.diff(lastFetchedAt, "minutes");

  // default to 5 minutes
  const refreshInterval = endpoint.refreshInterval || 5;

  return !endpoint.renderedResults || (minutesPassed > 0 && minutesPassed > refreshInterval);
}
