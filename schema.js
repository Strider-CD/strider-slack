var basicTemplate = function(icon, message) {
  return icon+" (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|"+message+"><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>"
}

module.exports = {
    token: {
      type: String,
      default: ''
    },
    subdomain: {
      type: String,
      default: ''
    },
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
      default: 'http://media.stridercd.com/img/logo.png'
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
      default: basicTemplate(":white_check_mark:", "Deploy was successful")
    },
    deploy_fail_message: {
      type: String,
      default: basicTemplate(":exclamation:", "Deploy exited with a non-zero status!")
    }
}
