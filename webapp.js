var Slack = require('slack-node');

module.exports = {
  config: {
    token: { type: String, default: '' },
    subdomain: { type: String, default: '' },
    channel: { type: String, default: '#general' },
    username: { type: String, default: '<%= project.name %>' },
    icon_url: { type: String, default: 'http://media.stridercd.com/img/logo.png' },
    test_pass_text: {
      type: String,
      default: ':white_check_mark: Tests are passing'
    },
    test_fail_text: {
      type: String,
      default: ':exclamation: Tests are failing'
    },
  },
  listen: function (io, context) {
    io.on('plugin.slack.fire', function(token, subdomain, payload) {
      slack = new Slack(token, subdomain);
      slack.webhook(payload, function(err, response) {
        if (err) console.error(err); else console.log(response);
      })
    })
  }
}
