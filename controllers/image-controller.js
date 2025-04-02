const mongoose = require("mongoose");
const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please uplaod an image.",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //feltöltsük a file-t
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    res.status(201).json({
      success: true,
      message: "Image saved succesfully.",
      image: newImage,
    });
    await newImage.save();

    //töröl
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while trying to upload the image. Please try again.",
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit; //pl. 2.oldal esetén, ha a megjeleníthető elemek száma: (2-1)*5=5

    const sortby = req.query.sortby || "createdAt";
    const sortOrder = req.query.sortorder === "asc" ? 1 : -1; //ha az asc érték van megadva, akkor 1, egyébként -1
    const totalImages = await Image.countDocuments({}); //megszámolja az összes képet
    const totalPages = Math.ceil(totalImages / limit); //összes kép száma/osztható elemek száma

    const sortObj = {}; //rendezési objektum
    sortObj[sortby] = sortOrder; //rendezési objektum feltöltésének a módja
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No images found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while trying to get the images. Please try again.",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const getCurrrentImageToDelete = req.params.id;
    const image = await Image.findById(getCurrrentImageToDelete);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    if (image.uploadedBy.toString() !== req.userInfo.userId) {
      //ha nem egyezik a törölni akaró user azonosítója a feltöltőével, akkor nem engedjük a törlést
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image.",
      });
    }
    await cloudinary.uploader.destroy(image.publicId); //a cloudinary-ból is töröljük
    await Image.findByIdAndDelete(getCurrrentImageToDelete); //a db-ből is töröljük

    res.status(200).json({
      success: true,
      message: "Image deleted succesfully.",
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while trying to delete the image. Please try again." +
        error,
    });
  }
};

module.exports = { uploadImage, fetchImagesController, deleteImageController };
