var Slack = require('slack-node');
var fs = require('fs');

module.exports = {
  config: require('./schema'),
  listen: function (io, context) {
    io.on('plugin.slack.fire', function(token, subdomain, payload) {
      slack = new Slack(token, subdomain);
      slack.webhook(payload, function(err, response) {
        if (err) console.error(err.message); else console.log(response);
      })
    })
  },
  globalRoutes: function (app) {
    console.log("ROUTES LOADED");
    app.get('/ejs_hint/:kind', function (req, res) {
      if (req.user && req.user.account_level > 0)  {
        console.log("OK");
        var filePath = __dirname+'/hints/'+req.params.kind;
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
