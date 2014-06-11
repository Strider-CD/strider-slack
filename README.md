### install
In your strider project cd node_modules and git clone this repo there, cd into it and npm install
In your strider env vars, add SLACK_DOMAIN and SLACK_WEBHOOK_TOKEN
In strider-simple-runner/lib/jobdata.js around line 59 you'll find listeners phase.done -- add this code: `require('strider-slack-hack').phase_done(data);`
customize the message in index.js

### why didnt you use the plugins?
i tried, but the instructions were missing/lousy/outdated

### why didn't you use the webhook plugin that comes with strider?
i tried, but it's broken https://github.com/Strider-CD/strider-webhooks/issues/4
