const express = require("express");
const {connectMongoDB} = require("./database");
require("dotenv").config();


const PORT = process.env.PORT;

const app = express();

//connecting to MongoDB instance
connectMongoDB()

app.use(express.json());
//app.use();

app.get("/", (req, res) => {
  res.send("Hey, welcome to blogging API");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
