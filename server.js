const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');


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



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
