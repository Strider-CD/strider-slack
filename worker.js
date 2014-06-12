var ejs = require('ejs');
module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    cb(null, {
      listen: function (io, context) {
        function onTested(id, data) {
          io.removeListener('job.status.tested', onTested)
          try {
            var text = (data.exitCode === 0 ? config.test_pass_text : config.test_fail_text);
            io.emit('plugin.slack.fire', config.token, config.subdomain, {
              channel: config.channel,
              username: ejs.compile(config.username)(job),
              text: ejs.compile(text)(job)
            })
            context.comment('Fired slack payload!');
          } catch (e) {
            context.comment('Failed to fire slack payload: ' + e.message);
            return
          }
        }
        io.on('job.status.tested', onTested)
      }
    })
  }
}
