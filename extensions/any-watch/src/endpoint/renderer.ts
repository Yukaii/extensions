import { getPreferenceValues } from "@raycast/api";

import fetch from "node-fetch";
import * as jq from "node-jq"

import { Endpoint, Preferences } from "../types";

export async function renderEndpointAttributes (endpoint: Endpoint) {
  const {
    url,
    accessoryTitle,
    subTitle,
    summary,
  } = endpoint

  const preferences: Preferences = await getPreferenceValues()

  let data = '{}'
  try {
    data = await fetch(url).then(res => res.text())
  } catch (e) {
    console.error(e)
  }

  const renderedAccessoryTitle = accessoryTitle && await renderJqTemplateString(accessoryTitle, data, preferences.jqPath)
  const renderedSubTitle = subTitle && await renderJqTemplateString(subTitle, data, preferences.jqPath)
  const renderedSummary = summary && await renderJqTemplateString(summary, data, preferences.jqPath)

  return {
    renderedAccessoryTitle,
    renderedSubTitle,
    renderedSummary,
  }
}

export async function renderJqTemplateString (str: string, dataSource: string, jqPath: string) {
  let result = str

  for (const match of str.matchAll(/{{(.+?)}}/g)) {
    const [whole, expression] = match

    const value = await jq.run(expression, dataSource, { input: 'string' }, jqPath)

    result = result.replace(whole, value.toString())
  }

  return result
}
