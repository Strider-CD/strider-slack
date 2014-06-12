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
      default: ":white_check_mark: Tests are passing for <%= _.map(ref, function(k,v){ return k+' '+v }).join(', ') %> :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs>"
    },
    test_fail_message: {
      type: String,
      default: ":exclamation: Tests are failing for <%= _.map(ref, function(k,v){ return k+' '+v }).join(', ') %> :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs>"
    }
}
