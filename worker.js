var ejs = require('ejs');
module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    console.log(process.env);
    cb(null, {
      listen: function (io, context) {
        function onTested(id, data) {
          io.removeListener('job.status.tested', onTested)
          var result = (data.exitCode === 0 ? 'pass' : 'fail');
          try {
            io.emit('plugin.slack.fire', config.token, config.subdomain, {
              channel: config.channel,
              username: ejs.compile(config.username)(job),
              icon_url: config.icon_url,
              text: ejs.compile(config['test_'+result+'_message'])(job)
            })
          } catch (e) {
            context.comment('Slack plugin error. '+e.message);
            return
          }
        }
        io.on('job.status.tested', onTested)
      }
    })
  }
}
