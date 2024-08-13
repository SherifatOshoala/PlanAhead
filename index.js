require("dotenv").config();

const sequelize = require("./config/sequelize");
const displayRoutes = require("express-routemap");
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 3000;
app.use(express.json());

const customerRoutes = require('./routes/customer.routes.js')
const todoRoutes = require('./routes/todo.routes.js')
const messages = require("./messages");

app.use(customerRoutes)
app.use(todoRoutes)

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: messages.landing,
  });
});

try {
  (async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    app.listen(port, () => {
      displayRoutes(app);
      console.log(`plan_ahead is listening on port: ${port}`);
    });
  })();
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}
