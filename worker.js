module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    cb(null, {
      listen: function (io, context) {
        function onTested(id, data) {
          io.removeListener('job.status.tested', onTested)
          try {
            io.emit('plugin.slack.fire', config.token, config.subdomain, {
              channel: "#general",
              username: "Strider-CD",
              text: job.project.name+' tests '+(data.exitCode === 0 ? "passed" : "failed")
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
  },
}
