const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

/**
 * AUTHENTICATION MIDDLEWARE
 * Protects all /customer/auth/* routes
 */
app.use("/customer/auth/*", (req, res, next) => {
  if (
    req.session &&
    req.session.authorization &&
    req.session.authorization.accessToken
  ) {
    try {
      jwt.verify(req.session.authorization.accessToken, "access");
      next();
    } catch (err) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  } else {
    return res.status(403).json({ message: "User not authenticated" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
