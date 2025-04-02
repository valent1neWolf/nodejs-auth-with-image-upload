const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const {
  uploadImage,
  fetchImagesController,
  deleteImageController,
} = require("../controllers/image-controller");
const uploadMiddleware = require("../middleware/upload-middleware");
const router = require("./auth-routes");
const route = express.Router();

//kép feltöltése
route.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"), //ha többet akarnák feltölteni, akkor array-t kéne használni
  uploadImage
);

//összes kép meghívása
route.get("/get", authMiddleware, fetchImagesController);

route.delete("/delete/:id", authMiddleware, deleteImageController);

module.exports = route;
