const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,//"localhost",//database1.cjfpmlx9f5nv.ap-southeast-1.rds.amazonaws.com",//
    user: process.env.DB_USER,//"root",//"admin",//
    password: process.env.DB_PASSWORD,//"root",//YS1UcNUMkKwg7Upbv55T",//
    database: process.env.DB_DATABASE//"ngahiji"//"nodejs"//
});

db.connect(function(error){
    if(error){
        console.error(error);
    } else {
        console.info("Connected to Database");
    }
});

module.exports = db;