var Slack = require('slackihook')
  , fs = require('fs')
  , path = require('path')

module.exports = {
  config: require('./schema'),
  globalRoutes: function (app) {
    app.post('/test', function (req, res) {
      slack = new Slack(req.body.config.webhookURL);
      slack.send({
        channel: req.body.config.channel,
        username: 'Strider',
        icon_url: req.body.config.icon_url,
        text: 'Slack plugin test!'
      }, function(err, out) {
        if (err) return res.status(500).end(err.stack);
        else return res.status(201).end(out);
      })
    })
    app.get('/bot_avatar', function (req, res) {
      var filePath = path.join(__dirname, 'static', 'bot_avatar.png')
      fs.createReadStream(filePath).pipe(res);
    })
    app.get('/ejs_hint/:kind', function (req, res) {
      if (req.user && req.user.account_level > 0)  {
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
