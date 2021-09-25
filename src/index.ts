import { bugModal, devModal, questionStart } from "./modal";
import { ack, routering, slackApi, toInputValues } from "./slack";

global.doPost = routering({
  slashCommand: {
    "/hello": () =>
      ContentService.createTextOutput(
        JSON.stringify({
          text: "Hello World!!",
          response_type: "in_channel",
        })
      ).setMimeType(ContentService.MimeType.JSON),
  },
  globalShortcut: {
    question: (payload) => {
      slackApi(process.env.SLACK_BOT_TOKEN)("views.open")({
        view: JSON.stringify(questionStart()),
        trigger_id: payload.trigger_id,
        user_id: payload.user.id,
      });
      return ack("");
    },
  },
  blockAction: {
    question_bug: (payload) => {
      slackApi(process.env.SLACK_BOT_TOKEN)("views.push")({
        view: JSON.stringify(bugModal()),
        trigger_id: payload.trigger_id,
      });
      return ack("");
    },
    question_develop: (payload) => {
      slackApi(process.env.SLACK_BOT_TOKEN)("views.push")({
        view: JSON.stringify(devModal()),
        trigger_id: payload.trigger_id,
      });
      return ack("");
    },
  },
  viewSubmission: {
    "post-bug": (payload) => {
      const state = toInputValues(payload.view.state.values);
      slackApi(process.env.SLACK_BOT_TOKEN)("chat.postMessage")({
        channel: "dev",
        text: `<@${payload.user.id}> さんからバグの報告がありました！\n\n*URL*\n\n${state.url}\n\n*やったこと*\n\n${state.actions}\n\n*期待する動き*\n\n${state.expect}\n\n*実際の動き*\n\n ${state.actual}`,
      });
      return ack("");
    },
  },
});
