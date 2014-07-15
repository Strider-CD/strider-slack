var ejs = require('ejs');
/*
    this.status('phase.done', {
      phase: this.phase,
      time: now,
      exitCode: code,
      next: nextPhase,
      elapsed: now.getTime() - started.getTime()
    })
 */

function phaseWatch(config, job, io, context) {
  var phase = null;
  function onDeployError(id, data) {
    slackPOST(io, job, {exitCode: 1}, context, config, 'deploy');
    cleanup();
  }
  function onPhaseDone(id, data) {
    phase = data.phase;
    if (phase === "test" || phase === "deploy") {
      slackPOST(io, job, data, context, config, phase);
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

module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    // Are we missing a trigger type hint? Log it out now: 
    // console.log(job);
    cb(null, {
      listen: function (io, context) {
        phaseWatch(config, job, io, context);
      }
    })
  }
}

function slackPOST(io, job, data, context, config, phase) {
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
    var emsg = 'Slack plugin had an error: '+e.message+'\n'+e.backtrace.join('\n');
    context.comment(emsg);
    console.error(emsg);
    return
  }
}
