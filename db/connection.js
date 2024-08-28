const mysql=require("mysql2");


const conn=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"Abhay@12345@",
    database:"reactexpress"
})

conn.connect((err)=>{
    if(err) throw err;
    console.log("db connected");
})

module.exports=conn;