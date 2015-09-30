var mysql = require('mysql');
var Promise = require('bluebird');

module.exports = function (dbParams, servicesSetup) {

    if (!dbParams) throw Error('Database parameters not supplied');
        if (!servicesSetup) throw Error('Service setup callback not supplied');

		this.dbParams = dbParams;
		var pool = mysql.createPool(dbParams);

    var setupProvider = function(req, res, next){

    	var poolConnection;
    	req.getServices = function () {
            return new Promise(function(resolve, reject){
                pool.getConnection(function (err, connection) {
                    if (err){
                        return resolve(err);
                    }
                    poolConnection = connection;
                    resolve(servicesSetup(poolConnection));
                });
            });
        };

		var end = res.end;
		res.end = function(data, encoding){
            if (poolConnection){
            	poolConnection.release();
            }
            res.end = end;
            res.end(data, encoding);

		};

		//
    	next();
    }

	return setupProvider;

};
