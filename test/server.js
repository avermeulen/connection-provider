var express = require('express');
var app = express();
var connectionProvider = require('../index.js');

var dbOptions = {
    host: 'localhost',
    user: 'gh',
    password: 'password',
    port: 3306,
    database: 'gh_tracker'
};

var Service = function(connection){
  this.users = function(cb){
    connection.query("select * from coders", cb);
  };
}

var serviceSetupCallback = function(connection){
	return {
		userService : new Service(connection),
	}
};

app.use(connectionProvider(dbOptions, serviceSetupCallback));

app.get('/', function (req, res, next) {
  req.getServices()
  .then(function(services){
      var userService = services.userService;
      userService.users(function(err, users){
          if (err) return next(err);
          res.send(users);
      });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
