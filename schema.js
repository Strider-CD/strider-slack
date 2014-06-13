var basicTemplate = function(icon, keyword) {
  return icon+" (<%= ref.branch %>) Tests are passing :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs><% if (trigger.url) { %>\n<<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>"
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
      default: basicTemplate(":white_check_mark:", "passing")
    },
    test_fail_message: {
      type: String,
      default: basicTemplate(":exclamation:", "failing")
    }
}
