const mongoose = require("mongoose");

async function connectToMongoDb() {
  try {
    const mongoDbInstance = await mongoose.connect(process.env.MongoDbURL);
    console.log(`mongodb Connected ! db host: ${mongoDbInstance.connection.host}`);
  } catch (error) {
    console.log("mongodb connection err", error);
  }
}

module.exports = {
  connectToMongoDb,
};
