// Quiz game endpoints
import express from "express";

import MyMongoDB from "../backend/myMongoDB.js";

const router = express.Router();
const myDB = MyMongoDB();

// GET random country for the game
router.get("/random", async (req, res) => {
  try {
    const country = await myDB.getRandomCountry();
    res.json(country);
  } catch (err) {
    console.error("Error getting random country:", err);
    res.status(500).json({ message: "Failed to get random country" });
  }
});

// POST check user's answer
router.post("/check-answer", async (req, res) => {
  try {
    const { countryId, userAnswer } = req.body;

    if (!countryId || !userAnswer) {
      return res
        .status(404)
        .json({ error: "countryId and userAnswer are required" });
    }

    const result = await myDB.checkAnswer(countryId, userAnswer);
    res.json(result);
  } catch (err) {
    console.log("Error checking answer:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
