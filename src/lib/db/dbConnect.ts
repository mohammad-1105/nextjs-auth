import { DB_NAME } from "@/constants";
import mongoose, { MongooseError } from "mongoose";

interface ConnectionObject {
  isConnected?: number;
}

const connectionObject: ConnectionObject = {};

export const dbConnect = async () => {
  // check if the db is already connected
  if (connectionObject.isConnected) {
    console.log("=> using existing database connection");
    return null;
  }

  // Now connecting DB
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    connectionObject.isConnected = connectionInstance.connections[0].readyState;
    console.log(
      `=> | connected to database 🎊🎊🥳🥳| DB HOST :: ${connectionInstance.connections[0].host}`
    );
  } catch (error) {
    if (error instanceof MongooseError) {
      console.error("=> Mongoose Error while connecting DB :: ", error.message);
    }
    console.error("=> Unexpected Error while connecting DB :: ", error);
    process.exit(1);
  }
};
