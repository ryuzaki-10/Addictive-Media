const buffer = require('buffer');
const express = require("express");
const mysql =  require("mysql");
const ejs = require("ejs");
const filesaver = require("file-saver");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

//creating a connnection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : ''   
  });

  db.connect((err)=>{
    if(err){
    throw err;
    }
    console.log("Mysql connected..."); 
  });

  function useDB()
  {
    let query0 = "USE DETAILDB"
    db.query(query0,(err,result)=>{
        if(err) throw err;
              
    });
  }

  function execute(query)
  {    
    db.query(query,(err,result)=>{
        if(err) throw err;
               
    });

  }

app.get("/",(req,res)=>{
    let query0 = "CREATE DATABASE IF NOT EXISTS DETAILDB";
   execute(query0);
   useDB();

    let query2 = "CREATE TABLE IF NOT EXISTS DETAILS (ID MEDIUMINT NOT NULL AUTO_INCREMENT,NAME VARCHAR(100), CREATEDATE DATE,COUNTRY VARCHAR(100), FILES MEDIUMBLOB, PRIMARY KEY(ID))";
    execute(query2);
    res.render("home");
   
})

app.get("/list",(req,res)=>{
    useDB();
    let query3 = "SELECT * FROM DETAILS";
    db.query(query3,(err,result,field)=>{
        if(err) throw err;        
        res.render("listing",{data:result});
    });
    
})

app.post("/namesort",(req,res)=>{
   useDB();

    let query3 = "SELECT * FROM DETAILS ORDER BY NAME";
    db.query(query3,(err,result,field)=>{
        if(err) throw err;
       
        res.render("listing",{data:result});
    });
})

app.post("/datesort",(req,res)=>{
   useDB();
    let query3 = "SELECT * FROM DETAILS ORDER BY CREATEDATE";
    db.query(query3,(err,result,field)=>{
        if(err) throw err;
        console.log(result[0].NAME);
        res.render("listing",{data:result});
    });
})

app.post("/form",(req,res)=>{
   useDB();
    let query1 = "INSERT INTO DETAILS(NAME, CREATEDATE, COUNTRY, FILES) VALUES('"+String(req.body.name)+"', '"+req.body.date+"', '"+req.body.myCountry+"', '"+req.body.file+"' )";
   execute(query1);
    res.redirect("/list");
})

app.post("/delete",(req,res)=>{
   useDB();
    var id = req.body.id;
    let query1 = "DELETE FROM DETAILS WHERE ID="+id+";";
   execute(query1);
    res.redirect("/list");
})

app.post("/download",(req,res)=>{
   useDB();
   var id = req.body.id;
    let query = "Select FILES FROM DETAILS WHERE ID="+id+";";
    db.query(query,(err,result,field)=>{
        if(err) throw err;        
        res.redirect("/list");
    });
})

app.listen("3000",()=>{
    console.log("Server running");
})