# Connection Provider

Express JS middleware that enables decoupling resources and components, making testing easier.

Only supporting mysql connections.

## How to use it:

```javascript

//In Express JS

var mysqlDetails = {
      host: 'localhost',
      user: 'user_name',
      password: 'password',
      port: 3306,
      database: 'db_name'
};

var serviceSetupCallback = function(connection){
	return {
		serviceName : new ServiceName(connection),
    // you can inject other resources as well
		//processor : new Processor(new UpdateDetails(connection, io))
	}
};

var myConnectionProvider = new ConnectionProvider(mysqlDetails, serviceSetupCallback);

app.use(myConnectionProvider.setupProvider);

//this enables

app.get('/users', function(req, res){

  req.services(function(services){

    serviceName = services.serviceName;

    var users = serviceName.getUsers();

    res.send(users);

  });

});

```
