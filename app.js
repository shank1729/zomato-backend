require("dotenv").config();
const fs=require("fs");
let path=require("path");
const express=require('express');
const  mongoose=require('mongoose');
const cors=require("cors");

const apiRouter=require("./app/routes/apiRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // get post data
app.get("/.well-known/pki-validation/86111B37272609CF88036152497F7944.txt", (req, res) => {
let options = {
      root: path.join(__dirname)
    };
    res.sendFile('86111B37272609CF88036152497F7944.txt',options,function (err) {
      if (err) {
          next(err);
      } else {
          console.log('Sent');
      }
  })
  })
app.use("/api", apiRouter);

// const MONGODB_URI = "mongodb://127.0.0.1:27017/zomatoapi";

console.log("connecting to db...");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log("connected !!!");
      console.log(`zomato api is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });