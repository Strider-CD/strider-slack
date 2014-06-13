var ejs = require('ejs');
module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    // Are we missing a trigger type hint? Log it out now: 
    // console.log(job);
    cb(null, {
      listen: function (io, context) {
        function onTested(id, data) {
          io.removeListener('job.status.tested', onTested)
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
              text: compile(config['test_'+result+'_message'])
            })
          } catch (e) {
            context.comment('Slack plugin error. '+e.message);
            console.error(e);
            return
          }
        }
        io.on('job.status.tested', onTested)
      }
    })
  }
}
