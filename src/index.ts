import { bugModal, devModal, questionStart } from "./modal";
import { ack, respond, slackApi, toInputValues } from "./slack";

const blocks = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "こんにちは！\n問い合わせの種類を以下から選択してください！",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "新規開発に関する質問",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "質問する",
          emoji: true,
        },
        value: "develop",
        action_id: "question_develop",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "バグ報告",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "バグを報告",
          emoji: true,
        },
        value: "bug",
        action_id: "question_bug",
      },
    },
  ],
};
global.doPost = (e) => {
  console.log(e);
  if (e.parameter.command === "/hello") {
    return ContentService.createTextOutput(
      JSON.stringify({
        ...blocks,

        response_type: "in_channel",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } else if (e.postData.type === "application/x-www-form-urlencoded") {
    if (typeof e.parameters.payload !== "undefined") {
      const payload = JSON.parse(e.parameters.payload[0]);
      console.log(payload);

      if (payload.callback_id === "question") {
        slackApi(process.env.SLACK_BOT_TOKEN)("views.open")({
          view: JSON.stringify(questionStart()),
          trigger_id: payload.trigger_id,
          user_id: payload.user.id,
        });
        ack("");
      }
      if (payload.type === "view_submission") {
        if (payload.view.callback_id === "post-bug") {
          const state = toInputValues(payload.view.state.values);
          slackApi(process.env.SLACK_BOT_TOKEN)("chat.postMessage")({
            channel: "dev",
            text: `<@${payload.user.id}> さんからバグの報告がありました！\n\n*URL*\n\n${state.url}\n\n*やったこと*\n\n${state.actions}\n\n*期待する動き*\n\n${state.expect}\n\n*実際の動き*\n\n ${state.actual}`,
          });
          return ack("");
        }
      }
      if (
        Array.isArray(payload.actions) &&
        payload.actions[0].action_id === "question_bug"
      ) {
        slackApi(process.env.SLACK_BOT_TOKEN)("views.push")({
          view: JSON.stringify(bugModal()),
          trigger_id: payload.trigger_id,
          user_id: payload.user.id,
        });
        ack("");
      }
      if (
        Array.isArray(payload.actions) &&
        payload.actions[0].action_id === "question_develop"
      ) {
        slackApi(process.env.SLACK_BOT_TOKEN)("views.push")({
          view: JSON.stringify(devModal()),
          trigger_id: payload.trigger_id,
          user_id: payload.user.id,
        });
        ack("");
      }
    }
  } else {
    ack("");
  }
};
