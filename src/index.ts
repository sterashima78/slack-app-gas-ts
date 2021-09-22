global.doGet = () =>
  ContentService.createTextOutput(
    JSON.stringify({ env: `${process.env.NODE_ENV}hoge` })
  );
