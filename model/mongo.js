var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/guaridaAdmin');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var reserveSchema = new mongoSchema({
    name : String,
    id: String,
    departamento: String,
    cantEstudiantes: String,
    piso: String,
    numSalon: String,
    horaEntrada: String,
    horaSalida: String,
    fecha: String,
    status: String,
    style: String
}, { collection: 'reservas' });

var adminSchema = new mongoSchema({
  name: String,
  username: String,
  password: String
}, {collection: 'guaridaAdmin'});

var allReservation = mongoose.model('Reservas',reserveSchema, 'reservas');
var allAdmin = mongoose.model('Admin', adminSchema, 'guaridaAdmin');
// create model if not exists.
module.exports = {
  allReservation: allReservation,
  allAdmin: allAdmin
};
