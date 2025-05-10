import mongoose from "mongoose";
import Whisky from "../models/whisky.js";
import whiskyData from "./whiskies.js";

mongoose.connect('mongodb://localhost:27017/whisky');

const db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
})

const whiskiesData = async () => {
    await Whisky.insertMany(whiskyData);
}

whiskiesData();