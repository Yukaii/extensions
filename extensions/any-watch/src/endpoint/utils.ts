import moment from "moment";
import { Endpoint, RawEndpointInput } from "../types";

export function shouldUpdateEndpoint (endpoint: Endpoint) {
  const now = moment();
  const lastFetchedAt = moment(endpoint.lastFetchedAt);
  const minutesPassed = now.diff(lastFetchedAt, "minutes");

  // default to 5 minutes
  const refreshInterval = endpoint.refreshInterval || 5;

  return !endpoint.renderedResults || (minutesPassed > 0 && minutesPassed > refreshInterval);
}


export function buildEndpoint (values: RawEndpointInput): Endpoint {
  const endpoint: Endpoint = {
    title: values.title || "",
    url: values.url || "",
    icon: values.icon || "",
    status: values.status || "",
    accessoryIcon: values.accessoryIcon || "",
    summary: values.summary || "",
    refreshInterval: values.refreshInterval ? parseInt(values.refreshInterval) : 5,
  };

  return endpoint;
}

export function validateEndpointFormValues (values: RawEndpointInput) {
  if (!values.title) {
    return "Title is required";
  }

  if (!values.url) {
    return "URL is required";
  }

  return "";
}