const fs=require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB,{
  useNewUrlParser:true,
})
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.log("DB connection error:", err);
  });

//READ JSON FILE
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//IMPORT DATA INTO DATABASE
const importData=async ()=>{
    try{
        await Tour.create(tours);
        console.log("data successfully loaded");
        process.exit();
    }catch(err){
        console.log(err);
    }
};

//Delete all Data from collection
const deleteData=async ()=>{
    try{
        await Tour.deleteMany();
        console.log('data successfully deleted');
        process.exit();
    }catch(err){
        console.log(err);
    }
};
if(process.argv[2]==='--import'){
    importData()
}
else if(process.argv[2]==='--delete'){
    deleteData();
}
console.log(process.argv);