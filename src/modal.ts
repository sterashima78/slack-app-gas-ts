export const questionStart = (): unknown => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "問い合わせ",
    emoji: true,
  },
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
});

export const bugModal = (): unknown => ({
  type: "modal",
  callback_id: "post-bug",
  title: {
    type: "plain_text",
    text: "バグ報告",
    emoji: true,
  },
  submit: {
    type: "plain_text",
    text: "送信する",
    emoji: true,
  },
  close: {
    type: "plain_text",
    text: "戻る",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "バグの内容について教えて下さい",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "url",
      },
      label: {
        type: "plain_text",
        text: "問題が発生したページのURL",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "actions",
      },
      label: {
        type: "plain_text",
        text: "行った操作",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "expect",
      },
      label: {
        type: "plain_text",
        text: "期待する動作",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "actual",
      },
      label: {
        type: "plain_text",
        text: "実際の動作",
        emoji: true,
      },
    },
  ],
});

export const devModal = (): unknown => ({
  type: "modal",
  callback_id: "post-dev",
  title: {
    type: "plain_text",
    text: "開発の相談",
    emoji: true,
  },
  submit: {
    type: "plain_text",
    text: "送信する",
    emoji: true,
  },
  close: {
    type: "plain_text",
    text: "戻る",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "相談したい開発内容について教えてください",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "plain_text_input-action",
      },
      label: {
        type: "plain_text",
        text: "やりたいこと",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "plain_text_input-action",
      },
      label: {
        type: "plain_text",
        text: "期待する動作",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "希望するリリース期限を教えてください",
      },
      accessory: {
        type: "datepicker",
        placeholder: {
          type: "plain_text",
          emoji: true,
        },
        action_id: "datepicker-action",
      },
    },
  ],
});
