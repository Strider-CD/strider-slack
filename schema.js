var basicTemplate = function(icon, message) {
  return icon+" (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|"+message+"><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>"
}

module.exports = {
  webhookURL: String,
  channel: {
    type: String,
    default: '#general'
  },
  username: {
    type: String,
    default: '<%= project.name %>'
  },
  icon_url: {
    type: String,
    default: '/ext/slack/bot_avatar'
  },
  test_pass_message: {
    type: String,
    default: basicTemplate(":white_check_mark:", "Tests are passing")
  },
  test_fail_message: {
    type: String,
    default: basicTemplate(":exclamation:", "Tests are failing")
  },
  deploy_pass_message: {
    type: String,
    default: basicTemplate(":ship:", "Deploy was successful")
  },
  deploy_fail_message: {
    type: String,
    default: basicTemplate(":boom:", "Deploy exited with a non-zero status!")
  }
}
