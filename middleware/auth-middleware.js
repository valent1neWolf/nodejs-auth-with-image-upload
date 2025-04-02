const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "no token provided.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); //a verify jwt metódussal fejtsük vissza tokent, amire szükségünk van a titkos kulcsra
    console.log(decodedToken);

    req.userInfo = decodedToken;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = authMiddleware;
