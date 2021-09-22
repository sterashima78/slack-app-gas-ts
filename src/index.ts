const SLACK_BOT_TOKEN_KEY = "SLACK_BOT_TOKEN";
global.doPost = () =>
  ContentService.createTextOutput(
    JSON.stringify({
      text: "Hello World !!",
      response_type: "in_channel",
    })
  ).setMimeType(ContentService.MimeType.JSON);
