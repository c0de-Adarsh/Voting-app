const mongoose = require('mongoose');
require('dotenv').config();

//const mongoURL = process.env.MONGODB_URL;

const mongoURL = process.env.MONGODB_URL_LOCAL;


 mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 })

 const db = mongoose.connection;

  db.on('connected',()=>{
    console.log('Connected to MongoDB server')
  });

  db.on('error', (err)=>{
    console.error('mongodb connection error',err)
  })

  db.on('disconnect',()=>{
    console.log('mongodb disconnected successfully')
  })

  module.exports = db;