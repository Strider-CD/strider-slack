var ejs = require('ejs')
  , _ = require('lodash')
  , Slack = require('slackihook')

module.exports = {
  init: function (config, job, context, cb) {
    // Are we missing a trigger type hint? Log it out now: 
    // console.log(job);
    
    cb(null, {
      listen: function (io, context) {
        var phase = null;
        function onDeployError(id, data) {
          slackPOST(io, job, {exitCode: 1}, context, config, 'deploy')
          cleanup();
        }
        function onPhaseDone(id, data) {
          phase = data.phase;
          if (phase === "test" || phase === "deploy") {
            slackPOST(io, job, data, context, config, phase)
            if (data.next === "deploy") {
              io.on('job.status.phase.errored', onDeployError);
            } else {
              cleanup();
            }
          }
        }
        function cleanup() {
          io.removeListener('job.status.phase.done', onPhaseDone);
          io.removeListener('job.status.phase.errored', onDeployError);
          io.removeListener('job.status.cancelled', cleanup);
        }
        io.on('job.status.cancelled', cleanup);
        io.on('job.status.phase.done', onPhaseDone);
      }
    })
  }
}

function slackPOST(io, job, data, context, config, phase) {
  var result = (data.exitCode === 0 ? 'pass' : 'fail');
  try {
    var compile = function (tmpl) {
      return ejs.compile(tmpl)(_.extend(job, {
        _:_ // bring lodash into scope for convenience
      }))
    };
    slack = new Slack(config.webhookURL);
    slack.send({
      channel: config.channel,
      username: compile(config.username),
      icon_url: config.icon_url,
      text: compile(config[phase+'_'+result+'_message'])
    }, function(err) {
      // It's too late to add notes to the job; just log
      if (err) console.error(err.stack)
    })
    io.emit('job.status.command.comment', job._id, {
      comment: 'Slack payload sent',
      plugin: 'slack',
      time: new Date(),
    })
  } catch (e) {
    console.error(e.stack)
    io.emit('job.status.command.comment', job._id, {
      comment: e.stack,
      plugin: 'slack',
      time: new Date(),
    })
  }
}
