const express = require('express');
const dotenv  =require('dotenv');
const connectDB = require('./config/db');


const app = express();
dotenv.config();

//databse connection test
connectDB.query('SELECT NOW()')
.then(res=>{
    console.log('databse is connected',res.rows[0]);

})
.catch(err=>{
    console.error('Database connection error',err);
})

app.get('/',(req,res)=>{
      res.send("hello API is running ");
})
app.listen(process.env.PORT,()=> {
    console.log(`server is running on ${process.env.PORT}`);
})