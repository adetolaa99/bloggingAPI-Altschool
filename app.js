const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectMongoDB } = require("./database");
const userauthRoute = require("./routes/userauth");
const blogRoute = require("./routes/blog");

require("dotenv").config();

const app = express();

//connecting to MongoDB instance
connectMongoDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userauthRoute);
app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("Hello, welcome to blogging API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
