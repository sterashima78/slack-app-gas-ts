/**
 * Slack API をコールする
 */
export const slackApi =
  (token: string) =>
  (apiMethod: string) =>
  (payload: unknown): GoogleAppsScript.URL_Fetch.HTTPResponse =>
    UrlFetchApp.fetch(`https://www.slack.com/api/${apiMethod}`, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      headers: { Authorization: `Bearer ${token}` },
      payload: payload,
    });

/**
 * response_url を使って応答するとき
 */
export const respond = (
  responseUrl: string,
  payload: unknown
): GoogleAppsScript.URL_Fetch.HTTPResponse =>
  UrlFetchApp.fetch(responseUrl, {
    method: "post",
    contentType: "application/json; charset=utf-8",
    payload: JSON.stringify(
      typeof payload === "string" ? { text: payload } : payload
    ),
  });

/**
 * Slack に応答する
 */
export const ack = (payload: unknown): GoogleAppsScript.Content.TextOutput =>
  ContentService.createTextOutput(
    typeof payload === "string" ? payload : JSON.stringify(payload)
  );

type InputValues = Record<
  string,
  Record<string, { type: string; value: string }>
>;
export const toInputValues = (inputs: InputValues): Record<string, string> =>
  Object.fromEntries(
    Object.values(inputs)
      .map((x) => Object.entries(x))
      .flatMap((v) => v.map(([name, { value }]) => [name, value]))
  );

export type Command = Record<
  string,
  (payload: unknown) => GoogleAppsScript.Content.TextOutput
>;

export type Commands = {
  channelEvent?: Command;
  globalShortcut?: Command;
  messageShortcut?: Command;
  blockAction?: Command;
  viewSubmission?: Command;
  slashCommand?: Command;
};
const parseRequest = (e: GoogleAppsScript.Events.DoPost) => {
  if (e.postData.type === "application/json") {
    return JSON.parse(e.postData.contents);
  } else if (typeof e.parameters.command !== "undefined") {
    return Object.fromEntries(
      Object.entries(e.parameters).map(([key, val]) => [key, val[0]])
    );
  } else if (
    e.postData.type === "application/x-www-form-urlencoded" &&
    Array.isArray(e.parameters.payload) &&
    e.parameters.payload.length > 0
  ) {
    return JSON.parse(e.parameters.payload[0]);
  } else {
    return { token: "" };
  }
};

const isChannelEvent = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  typeof payload["event"] === "object" &&
  typeof payload["event"].channel === "object" &&
  typeof commands?.channelEvent[payload["event"].channel] === "function";

const isGlobalShortcut = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  payload["type"] === "shortcut" &&
  typeof commands?.globalShortcut[payload["callback_id"]] === "function";

const isMessageShortcut = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  payload["type"] === "message_action" &&
  typeof commands?.messageShortcut[payload["callback_id"]] === "function";

const isBlockActions = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  payload["type"] === "block_actions" &&
  Array.isArray(payload["actions"]) &&
  payload["actions"].length > 0 &&
  typeof payload["actions"][0].action_id !== "undefined" &&
  typeof commands?.blockAction[payload["actions"][0].action_id] === "function";

const isViewSubmission = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  payload["type"] === "view_submission" &&
  typeof commands?.viewSubmission[payload["view"].callback_id] === "function";

const isSlashCommand = (commands: Commands, payload: unknown) =>
  typeof payload === "object" &&
  typeof payload["command"] !== "undefined" &&
  typeof commands?.slashCommand[payload["command"]] === "function";

export const createCommands =
  (command: Commands) =>
  (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    // 不正リクエスト
    if (typeof e.postData === "undefined") return ack("invalid request");
    const payload = parseRequest(e);
    if (payload.token !== process.env.SLACK_VERTIFICATION_TOKEN)
      return ack("invalid request");

    // チャレンジリクエスト
    if (typeof payload.challenge !== "undefined") return ack(payload.challenge);

    // チャンネルイベント
    if (isChannelEvent(command, payload))
      return command.channelEvent[payload.event.channel](payload);

    // グローバルショートカット
    if (isGlobalShortcut(command, payload))
      return command.globalShortcut[payload.callback_id](payload);

    // メッセージショートカット
    if (isMessageShortcut(command, payload))
      return command?.messageShortcut[payload.callback_id](payload);

    // ブロックアクション
    if (isBlockActions(command, payload))
      return command?.blockAction[payload.actions[0].action_id](payload);

    // モーダルの送信イベント
    if (isViewSubmission(command, payload))
      return command?.viewSubmission[payload.view.callback_id](payload);

    // スラッシュコマンド
    if (isSlashCommand(command, payload))
      return command?.slashCommand[payload.command](payload);

    // その他
    return ack("");
  };
