var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var fs = require('fs');
const socketIo = require('socket.io');
const http = require('http');
const server = http.Server(app);
const io = socketIo(server);
const path = require("path");
const passport = require("passport");
const cors = require("cors");

//Getting the appropiate Schema for reservations and admins
var mongoOpReservation = require("./model/mongo").allReservation;
var mongoOpAdmin = require("./model/mongo").allAdmin;

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

app.use(cors());

require("./config/passport")(passport);

//Permissions to access server (CORS)
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type', 'Authorization', 'Accept');

    res.header('Access-Control-Expose-Headers', 'Authorization');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
const admin = require("./routes/admin");
app.use("/admin", admin);

router.get("/", function(req, res){
// res.json({"error": false, "message": "Hola chamacos!"});
var str = fs.readFileSync('./public/index.html','utf-8');
  res.send(str);
});

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/admin")
    .get(function(req,res){
        var response = {};
        mongoOpAdmin.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(data);
        });
    })
    .post(function(req,res){
        var db = new mongoOpAdmin();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.username = req.body.username;
        db.password = req.body.password;
        // Hash the password using SHA1 algorithm.
        // db.password =  require('crypto')
        //                   .createHash('sha1')
        //                   .update(req.body.password)
        //                   .digest('base64');

	    db.name = req.body.name;
        db.find(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

router.route("/admin/:id")
    .get(function(req,res){
        var response = {};
        mongoOpAdmin.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
    })
})
    .put(function(req,res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoOpAdmin.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
            // we got data from Mongo.
            // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
        var response = {};
        // find the data
        mongoOpAdmin.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoOpAdmin.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        })
    });

//GETS FOR RESERVES

router.route("/reservas")
    .get(function(req,res){
        var response = {};
        mongoOpReservation.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
                res.json(data);
            }
        });
    })
    .post(function(req,res){
        var db = new mongoOpReservation();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.style = req.body.style;
        // Hash the password using SHA1 algorithm.
        db.status = req.body.status;
	    db.piso = req.body.piso;
        db.numSalon = req.body.numSalon;
        db.fecha = req.body.fecha;
        db.horaSalida = req.body.horaSalida;
        db.horaEntrada = req.body.horaEntrada;
        db.departamento = req.body.departamento;
        db.name = req.body.name;
        db.id = req.body.id;
        db.cantEstudiantes = req.body.cantEstudiantes;

        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    })
router.route("/reservas/:fecha")
    .get(function (req, res) {
        var response = {};
        mongoOpReservation.find({fecha: req.params.fecha}, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                response = { data };
            }
            res.json(data);
        })
    })   
    router.route("/reservas/:id")
        .get(function(req,res){
            var response = {};
            mongoOpReservation.find({id: req.params.id},function(err,data){
            // Mongo command to fetch all data from collection.
                if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                } else {
                    response = {"error" : false,"message" : data};
                }
                res.json(data);
            });
        })

        .delete(function(req,res){
          var response = {};
          // find the data
          mongoOpReservation.findById(req.params.id,function(err,data){
              if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
              } else {
                  // data exists, remove it.
                  mongoOpReservation.remove({_id : req.params.id},function(err){
                      if(err) {
                          response = {"error" : true,"message" : "Error deleting data"};
                      } else {
                          response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                      }
                      res.json(response);
                  });
              }
          })
        })
        .put(function(req,res) {
            var response = {};
            // first find out record exists or not
            // if it does then update the record
            mongoOpReservation.findById(req.params.id,function(err,data){
                if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                } else {
                    // save the data
                    data.save(function(err){
                        if(err) {
                            response = {"error" : true,"message" : "Error updating data"};
                        } else {
                            response = {"error" : false,"message" : "Data is updated for "+req.params._id};
                        }
                        res.json(response);
                    })
                }
            });
        })

router.route("/reservas/:fecha/:horaEntrada")
	.get(function(req, res) {
        var response = {};
        var addTwo =(Number(req.params.horaEntrada.substr(0, 2)) + 2);
        var horaSalida = String(addTwo) + req.params.horaEntrada.substr(2, 3);
		mongoOpReservation.find( { fecha: req.params.fecha },function(err, data) {
		//Mongo Query to fecth data based on Starting time.
		if(err) {
			response = {"error": true, "message": "Error"};
		} else {
            var newData = [];
            for(var i = 0; i < data.length; i++) {
                if((req.params.horaEntrada >= data[i].horaEntrada && req.params.horaEntrada < data[i].horaSalida && data[i].status === 'Confirmado')) {
                    newData.push(data[i]);
                }
            }
			response = {"error": false, "message": newData};
		}
		res.json(response);
	})
});

router.route("/reservas/:fecha/:piso/:numSalon")
    .get(function(req,res){
        var respose = {};

        mongoOpReservation.find({fecha: req.params.fecha, piso: req.params.piso, numSalon: req.params.numSalon}, function(err, data){
            if (err) {
                response = {"error": true, "message": "Error fetching tha data"};
            } else {
                respose = {"error": false, "message": data};
                res.json(data);
            }
        });
    });

router.route("/reservas/:id/:horaEntrada/:fecha/:piso")
.put(function(req,res){
    var response = {};
    // find the data
    mongoOpReservation.findOneAndUpdate({ id: req.params.id, fecha: req.params.fecha, horaEntrada: req.params.horaEntrada, piso: req.params.piso, status: "Confirmado" },{$set: { status: 'Cancelado'}}, function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            //console
            console.log(data);
        }
    });
})


app.use('/', router);

app.listen(3000);
console.log("Listening to port 3000");
//server.listen(8080);

io.on('connection', (socket) => {
	socket.emit('hello', {
		greeting: 'Hola Bryan'
	});
});
