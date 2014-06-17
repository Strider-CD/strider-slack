var ejs = require('ejs');

function notifyOn(phase, config, job, io, context) {
  function onPhaseDone(id, data) {
    io.removeListener('job.status.'+phase+'ed', onPhaseDone);
    var result = (data.exitCode === 0 ? 'pass' : 'fail');
    try {
      var _ = require('lodash');
      var compile = function (tmpl) {
        return ejs.compile(tmpl)(_.extend(job, {
          _:_ // bring lodash into scope for convenience
        }))
      };
      io.emit('plugin.slack.fire', config.token, config.subdomain, {
        channel: config.channel,
        username: compile(config.username),
        icon_url: config.icon_url,
        text: compile(config[phase+'_'+result+'_message'])
      })
    } catch (e) {
      var emsg = 'Slack plugin had an error: '+e.message;
      context.comment(emsg);
      console.error(emsg);
      return
    }
  }
  io.on('job.status.'+phase+'ed', onPhaseDone)
}

module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    // Are we missing a trigger type hint? Log it out now: 
    // console.log(job);
    cb(null, {
      listen: function (io, context) {
        notifyOn('test', config, job, io, context);
        if (/DEPLOY/.test(job.type))
          notifyOn('deploy', config, job, io, context);
      }
    })
  }
}
