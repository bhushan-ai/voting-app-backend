const dotenv = require("dotenv");
dotenv.config("./.env");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const { connectToMongoDb } = require("./DbConnection");

connectToMongoDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("something Went wrong while connecting to mongodb ", err);
  });
