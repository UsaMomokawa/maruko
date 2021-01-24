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

// 散歩 という単語に反応する
app.message("散歩", async ({ _message, say }) => {
  await say({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "散歩する :interrobang::interrobang:"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "できなかった"
              },
              "value": "did_not_walk",
              "action_id": "did_not_walk_button"
            },
            {
              "type": "button",
              "style": "primary",
              "text": {
                "type": "plain_text",
                "text": "散歩したよ"
              },
              "value": "walked",
              "action_id": "walked_button"
            }
          ]
        }
      ]
    });
});

// ボタンに反応する
app.action("walked_button", async ({ ack, say }) => {
  await ack();
  await say("やった〜！ :+1::+1:");
});

app.action("did_not_walk_button", async ({ ack, say }) => {
  await ack();
  await say(":pleading_face:");
});
