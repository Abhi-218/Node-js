// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("error", err);
      throw err;
    });

    app.listen(process.env.PORT || 7000, () => {
      console.log(`your server is running on port ${process.env.PORT || 7000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed : ", err);
  });

/*
const app = express()
( async () => {
    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on('erros',(error)=>{
        console.log("error" , error);
        throw error
      })
      app.listen(process.env.PORT,()=>{
        console.log(`app is running on ${process.env.PORT}`)
      })
    } catch (error) {
        console.error("error" , error);
        throw error
    }
})()
    */
