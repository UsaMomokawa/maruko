require("dotenv").config()

const { App } = require("@slack/bolt");

const app = new App({
  logLevel: "debug",
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN
});

(async () => {
  await app.start();
  console.log("🚀 Bolt app started");
})();

// メンションに反応する
// say() はイベント元のチャンネルにメッセージを返す
app.event("app_mention", async ({ _event, _context, _client, say }) => {
  await say("ワン! :dog:");
});
