/**
 * Slack API をコールする
 */
export const slackApi =
  (token: string) => (apiMethod: string) => (payload: object) =>
    UrlFetchApp.fetch(`https://www.slack.com/api/${apiMethod}`, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      headers: { Authorization: `Bearer ${token}` },
      payload: payload,
    });

/**
 * response_url を使って応答するとき
 */
export const respond = (responseUrl: string, payload: object | string) =>
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
export const ack = (payload: object | string) =>
  ContentService.createTextOutput(
    typeof payload === "string" ? payload : JSON.stringify(payload)
  );

type InputValues = Record<
  string,
  Record<string, { type: string; value: string }>
>;
export const toInputValues = (inputs: InputValues) =>
  Object.fromEntries(
    Object.values(inputs)
      .map((x) => Object.entries(x))
      .flatMap((v) => v.map(([name, { value }]) => [name, value]))
  );

// export type Router = {
//   channel: Record<string, (payload: any) => void>;
//   globalShortcut: Record<string, (payload: any) => void>;
//   messageShortcut: Record<string, (payload: any) => void>;
// };
// export const routering =
//   (command: Router) => (e: GoogleAppsScript.Events.DoPost) => {
//     if (typeof e.postData === "undefined") return ack("invalid request");
//     if (e.postData.type === "application/json") {
//       // Events API (イベント API / URL 検証リクエスト)

//       const payload = JSON.parse(e.postData.contents);
//       if (payload.token !== legacyVerificationToken) {
//         return ack("invalid request");
//       }
//       if (typeof payload.challenge !== "undefined") {
//         return ack(payload.challenge);
//       }
//       if (
//         typeof payload.event.channel !== "undefined" &&
//         typeof command.channel[payload.event.channel] === "function"
//       ) {
//         command.channel[payload.event.channel](payload);
//       }
//       return ack("");
//     } else if (e.postData.type === "application/x-www-form-urlencoded") {
//       if (typeof e.parameters.payload !== "undefined") {
//         // Interactivity & Shortcuts (ボタン操作やモーダル送信、ショートカットなど)

//         const payload = JSON.parse(e.parameters.payload[0]);
//         if (payload.token !== legacyVerificationToken) {
//           return ack("invalid request");
//         }

//         // -------------------------------------------------------------
//         // TODO: ここにあなたの処理を追加します
//         if (
//           payload.type === "shortcut" &&
//           typeof command.globalShortcut[payload.callback_id] === "function"
//         ) {
//           command.globalShortcut[payload.callback_id](payload);
//         } else if (
//           payload.type === "message_action" &&
//           typeof command.messageShortcut[payload.callback_id] === "function"
//         ) {
//           command.messageShortcut[payload.callback_id](payload);
//         } else if (payload.type === "block_actions") {
//           // Block Kit (message 内の blocks) 内のボタンクリック・セレクトメニューのアイテム選択イベント
//           console.log(`Action data: ${JSON.stringify(payload.actions[0])}`);
//         } else if (payload.type === "view_submission") {
//           if (payload.view.callback_id === "modal-id") {
//             // モーダルの submit ボタンを押してデータ送信が実行されたときのハンドリング
//             const stateValues = payload.view.state.values;
//             console.log(`View submssion data: ${JSON.stringify(stateValues)}`);
//             // 空のボディで応答したときはモーダルを閉じる
//             // response_action で errors / update / push など指定も可能
//             return ack("");
//           }
//         }
//         // -------------------------------------------------------------
//       } else if (typeof e.parameters.command !== "undefined") {
//         // ----------------------------
//         // Slash Commands (スラッシュコマンドの実行)
//         // ----------------------------

//         const payload = {};
//         for (const [key, value] of Object.entries(e.parameters)) {
//           payload[key] = value[0];
//         }
//         if (payload.token !== legacyVerificationToken) {
//           return ack("invalid request");
//         }

//       }
//     }
//     // 200 OK を返すことでペイロードを受信したことを Slack に対して伝える
//     return ack("");
//   };
