import express from "express";
import expressAsyncHandler from "express-async-handler";
import Offer from "../model/offer.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const offer = await Offer.find();
        res.send(offer);
    } catch (error) {
        res.status(500).send({ message: "Error get offer", error: error.message });
    }
});

router.post("/add_offer", async (req, res) => {
    try {
        const offer = new Offer({
            offer_name: req.body.offer_name,
            offer_image: req.body.offer_image,
            offer_title: req.body.offer_title,
            offer_description: req.body.offer_description,
        });
        await offer.save();
        res.send(offer);
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error Adding offer", error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            {
                offer_name: req.body.offer_name,
                offer_image: req.body.offer_image,
                offer_title: req.body.offer_title,
                offer_description: req.body.offer_description,
            },
            { new: true }
        );
        if (!offer) {
            return res.status(404).send(`we don't have her this offer`);
        }
        res.send(offer);
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error update offer", error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const offer = await Offer.findByIdAndRemove(req.params.id);

        if (!offer) {
            return res.status(404).send(`we don't have her this offer `);
        }
        res.send(offer);
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error remove offer", error: error.message });
    }
});

export default router;
