import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
// let connected = false;
// const connectDb = async () => {
//   if (connected) {
//     console.log("mongodb already connected ...");
//     return;
//   }
// };

const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }
  if (connectionState === 2) {
    console.log("connecting ...");
    return;
  }
  try {
    mongoose.connect(MONGODB_URI as string, {
      dbName: "next14respApi",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (error: any) {
    console.log("Error", error);
    throw new Error("Error", error);
  }
};

export default connect;
