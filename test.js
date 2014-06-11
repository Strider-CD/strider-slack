process.env.SLACK_DOMAIN = "your subdomain";
process.env.SLACK_WEBHOOK_TOKEN = "your webhook token";

require('./index.js').phase_done({
  phase: 'test',
  exitCode: 0
});
