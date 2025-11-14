// All country-related endpoints
import express from "express";

import MyMongoDB from "../backend/myMongoDB.js";

const router = express.Router();
const myDB = MyMongoDB();

// Get admin-created countries (default)
router.get("/", async (req, res) => {
  try {
    const countries = await myDB.getAllCountries({
      query: {},
      page: 1,
    });
    res.json(countries.data);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

// Get mock country data
router.get("/mock", async (req, res) => {
  try {
    const countries = await myDB.getAllCountries({
      query: {},
      page: 1,
      collection: "mockCountries",
    });
    res.json(countries.data);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

// Get admin-created countries by id
router.get("/:id", async (req, res) => {
  try {
    const country = await myDB.getAdminCountryById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.json(country);
  } catch (err) {
    console.error("Error fetching country:", err);
    res.status(500).json({ message: "Failed to fetch country" });
  }
});

// Add admin-created countries
router.post("/", async (req, res) => {
  try {
    const {
      name,
      capitals,
      population,
      region,
      languages,
      countryCode,
      flagUrl,
    } = req.body;

    if (!name || !capitals || !population || !region || !languages) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(capitals)) {
      return res.status(400).json({ message: "Capitals must be arrays" });
    }

    if (!Array.isArray(languages)) {
      return res.status(400).json({ message: "Languages must be arrays" });
    }

    const countryData = {
      name: name.trim(),
      capitals: capitals.map((i) => i.trim()).filter(Boolean),
      population: parseInt(population),
      region: region.trim(),
      languages: languages.map((i) => i.trim()).filter(Boolean),
      countryCode: countryCode?.trim().toLowerCase(),
      flagUrl: flagUrl?.trim(),
      isPublic: false,
    };

    const result = await myDB.addCountry(countryData);

    res.status(201).json({
      message: "Country data uploaded successfully",
      countryId: result.insertedId,
    });
  } catch (err) {
    console.error("Error uploading country data:", err);
    res.status(500).json({ message: "Failed to upload country data" });
  }
});

// Update admin-created countries
router.put("/:id", async (req, res) => {
  try {
    console.log("📩 PUT /api/countries/:id called");
    console.log("Country ID:", req.params.id);
    console.log("Request body:", req.body);

    const {
      name,
      capitals,
      population,
      region,
      languages,
      flagUrl,
      countryCode,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (capitals)
      updateData.capitals = capitals.map((i) => i.trim()).filter((i) => i);
    if (population) updateData.population = parseInt(population);
    if (region) updateData.region = region.trim();
    if (languages)
      updateData.languages = languages.map((i) => i.trim()).filter((i) => i);
    if (countryCode !== undefined)
      updateData.countryCode = countryCode.trim().toLowerCase();
    if (flagUrl !== undefined)
      updateData.flagUrl =
        flagUrl || `https://flagcdn.com/w320/${countryCode?.toLowerCase()}.png`;

    console.log("📈 Update country data:", updateData);

    const result = await myDB.updateCountry(req.params.id, updateData);

    console.log("✅ Update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json({ message: "Country data updated successfully" });
  } catch (err) {
    console.error("❌ Error updating country data:", err);
    res
      .status(500)
      .json({ message: "Failed to update country data", error: err.message });
  }
});

// Delete admin-created countries
router.delete("/:id", async (req, res) => {
  try {
    const result = await myDB.deleteCountry(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.json({ message: "Country data deleted successfully" });
  } catch (err) {
    console.error("Error deleting country data:", err);
    res.status(500).json({ message: "Failed to delete country data" });
  }
});

export default router;
