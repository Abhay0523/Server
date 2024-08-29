const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
require("./db/connection");
const router=require("./Routes/userRoutes")


const app=express();
const port=8001;


app.use(cors());
app.use(express.json()); // Make sure body-parser middleware is replaced by express.json()
app.use(router);




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});