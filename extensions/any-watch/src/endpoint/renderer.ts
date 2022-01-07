import { getPreferenceValues, showToast, ToastStyle } from "@raycast/api";

import fetch from "node-fetch";
import * as jq from "node-jq"

import { Endpoint, Preferences } from "../types";

export async function renderEndpointAttributes (endpoint: Endpoint) {
  const { url, status, summary, } = endpoint

  const preferences: Preferences = await getPreferenceValues()

  let data = '{}'
  try {
    data = await fetch(url).then(res => res.text())
  } catch (e) {
    console.error(e)
  }

  let renderedStatus = status || ''
  let renderedSummary = summary || ''
  
  try {
    renderedStatus = await renderJqTemplateString(renderedStatus, data, preferences.jqPath)
    renderedSummary = await renderJqTemplateString(renderedSummary, data, preferences.jqPath)
  } catch (e) {
    showToast(ToastStyle.Failure, `Error rendering endpoint: ${e}`)
  }
  
  return {
    status: renderedStatus,
    summary: renderedSummary,
  }
}

export async function renderJqTemplateString (str: string, dataSource: string, jqPath: string) {
  let result = str

  for (const match of str.matchAll(/{{(.+?)}}/g)) {
    const [whole, expression] = match

    const value = await jq.run(expression, dataSource, { input: 'string' }, jqPath)

    result = result.replaceAll(whole, value.toString())
  }

  return result
}
