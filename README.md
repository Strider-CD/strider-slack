### install

cd into strider deployment and run
```
cd node_modules/strider-simple-runner/node_modules
git clone https://github.com/DFTi/strider-slack-hack.git
cd strider-slack-hack
npm install
```

customize the message in index.js if you want

In your strider runner's env vars, add your SLACK_DOMAIN and SLACK_WEBHOOK_TOKEN

In `strider-simple-runner/lib/jobdata.js` around line 59 you'll find listeners phase.done -- add this code: `require('strider-slack-hack').phase_done(data);`

restart strider

### why didnt you use the plugins?
i tried, but the instructions were missing/lousy/outdated

### why didn't you use the webhook plugin that comes with strider?
i tried, but it's broken as of https://github.com/Strider-CD/strider-webhooks/issues/4
