import fetch from "cross-fetch";

import type { ActionsToPayloadMap as NoteActionsToPayloadMap } from "./note";
import type { ActionsToPayloadMap as DeckActionsToPayloadMap } from "./deck";
import type { ActionsToPayloadMap as ModelActionsToPayloadMap } from "./model";
import type { ActionsToPayloadMap as MediaActionsToPayloadMap } from "./media";
import type { ActionsToPayloadMap as MiscellaneousActionsToPayloadMap } from "./miscellaneous";
import type { ActionsToPayloadMap as CardActionsToPayloadMap } from "./card";

export * as CardTypes from "./card";
export * as NoteTypes from "./note";
export * as ModelTypes from "./model";
export * as MediaTypes from "./media";

type ActionsToPayloadMap = NoteActionsToPayloadMap &
  DeckActionsToPayloadMap &
  ModelActionsToPayloadMap &
  MediaActionsToPayloadMap &
  MiscellaneousActionsToPayloadMap &
  CardActionsToPayloadMap;

export type ActionNames = keyof ActionsToPayloadMap;

/**
 * If a number, then it represents the port number of the API origin, then
 * http://127.0.0.1 is used as protocol and host.
 * If a string, then it is treated as the API origin.
 */
export type ApiOrigin = string | number;
function getApiOrigin(input?: ApiOrigin): string {
  if (input) {
    return typeof input === "number" ? `http://127.0.0.1:${input}` : input;
  }
  return "http://127.0.0.1:8765";
}

/**
 * Can be any type that is also a valid json type, but usually a string.
 *
 * Must match the value set in the `"apiKey"` property of the Anki-Connect configuration.
 */
export type ApiKey = string | number | boolean | null | { [key: string]: ApiKey } | ApiKey[];

export interface InvokeArgs<
  ActionName extends ActionNames,
  VersionNumber extends 6,
  RequestParams = ActionsToPayloadMap[ActionName][VersionNumber]["request"]
> {
  action: ActionName;
  version: VersionNumber;
  request: RequestParams;
  origin?: ApiOrigin;
  key?: ApiKey;
}

export type InvokeResponse<
  ActionName extends ActionNames,
  VersionNumber extends 6
> = ActionsToPayloadMap[ActionName][VersionNumber]["response"];

/**
 * Call anki-connect API
 *
 * See https://github.com/microsoft/TypeScript/issues/29131
 */
export async function invoke<ActionName extends ActionNames, VersionNumber extends 6>(
  args: InvokeArgs<ActionName, VersionNumber>
): Promise<InvokeResponse<ActionName, VersionNumber>> {
  const action = args.action;
  const version = args.version;
  const params = args.request;
  const origin = getApiOrigin(args.origin);
  const key = args.key;

  const data = await fetch(origin, {
    body: JSON.stringify({
      action,
      version,
      params,
      ...(key !== undefined && {
        key,
      }),
    }),
    method: "POST",
  }).then((response) => response.json());

  if (Object.getOwnPropertyNames(data).length !== 2) {
    throw new Error("response has an unexpected number of fields");
  }
  if (!("error" in data)) {
    throw new Error("response is missing required error field");
  }
  if (!("result" in data)) {
    throw new Error("response is missing required result field");
  }
  if (data.error) {
    throw new Error(`Anki-connect request failed: "${data.error}"`);
  }
  return data.result;
}
