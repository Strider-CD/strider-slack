var Slack = require('slack-node');
var fs = require('fs');
var path = require('path')

module.exports = {
  config: require('./schema'),
  listen: function (io, context) {
    io.on('plugin.slack.fire', function(token, subdomain, payload) {
      slack = new Slack(token, subdomain);
      slack.webhook(payload, function(err, response) {
        if (err)
          console.error(err.stack);
        else
          console.log('Slack response:', response);
      })
    })
  },
  globalRoutes: function (app) {
    app.get('/bot_avatar', function (req, res) {
      var filePath = path.join(__dirname, 'static', 'bot_avatar.png')
      fs.createReadStream(filePath).pipe(res);
    })
    app.get('/ejs_hint/:kind', function (req, res) {
      if (req.user && req.user.account_level > 0)  {
        https://3c2ad4aa.ngrok.com/ext/slack/ejs_hint/manual_retest
        var filePath = path.join(__dirname, 'hints', req.params.kind)
        if (fs.existsSync(filePath)) {
          var readStream = fs.createReadStream(filePath);
          readStream.pipe(res);
        } else {
          res.send(404);
        }
      } else {
        res.send(401);
      }
    })
  }
}
