require("dotenv").config();

const app = require("./index");
// const { databaseValidation } = require("../config/database");

// databaseValidation();

const { PORT = 3000, HOST } = process.env;

app.listen(PORT, () => {
  console.log(`Local is running : http://${HOST}:${PORT}`);
});
