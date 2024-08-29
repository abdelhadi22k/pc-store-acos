
import express from "express";
import { isAdmin, isAuth } from './../stn/utils.js';
import Category from '../model/category.js';

const router = express.Router();


router.get("/", async (req, res) => {
    try {
      const category = await Category.find();
      res.send(category);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error get category", error: error.message });
    }
  });

  router.post("/add_Category",[isAdmin, isAuth] , async (req, res) => {
    try {
      const category = new Category({
        category: req.body.category,
        category_img: req.body.category_img
      });
      await category.save();
      res.send(category);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error Adding category", error: error.message });
    }
  });


  router.delete("/:id", async (req, res) => {
    try {
      const category = await Category.findByIdAndRemove(req.params.id);
  
      if (!category) {
        return res.status(404).send(`we don't have her this category `);
      }
      res.send(category);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error remove category", error: error.message });
    }
  });

  export default router;