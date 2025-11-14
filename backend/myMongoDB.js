import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "guessCountryGame";

let client;
let db;

async function connect() {
  if (client && db) {
    return { client, db };
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
  };

  client = new MongoClient(uri, options);
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  db = client.db(dbName);

  return { client, db };
}

export default function MyMongoDB() {
  const me = {};

  // Functions for CRUD operations
  me.getCountriesTotalPages = async ({
    query,
    limit,
    collection = "adminCountries", // Default to admin-created data
  }) => {
    const { db } = await connect();
    const countries = db.collection(collection);
    const totalDocs = await countries.countDocuments(query);
    return Math.ceil(totalDocs / limit);
  };

  me.getAllCountries = async ({
    query = {},
    page = 1,
    collection = "adminCountries", // Default to admin-created data
  }) => {
    const limit = 20;
    const { db } = await connect();

    const countriesCollection = db.collection(collection);

    const totalPages = await me.getCountriesTotalPages({
      query,
      limit,
      collection,
    });

    if (totalPages === 0) {
      return { data: [], totalPages: 0, page: 1 };
    }

    page = Math.min(Math.max(page, 1), totalPages);

    const data = await countriesCollection
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .toArray();

    return { data, totalPages, page };
  };

  me.getAdminCountryById = async (countryId) => {
    const { db } = await connect();
    const countries = db.collection("adminCountries");
    const mongoID = ObjectId.createFromHexString(countryId);
    return await countries.findOne({ _id: mongoID });
  };

  me.addCountry = async (formData) => {
    const { db } = await connect();
    const countries = db.collection("adminCountries");

    const document = {
      // countryId: formData.countryId,
      name: formData.name,
      capitals: formData.capitals,
      population: parseInt(formData.population),
      region: formData.region,
      languages: formData.languages,
      countryCode: formData.countryCode?.toLowerCase(),
      flagUrl:
        formData.flagUrl ||
        `https://flagcdn.com/w320/${formData.countryCode?.toLowerCase()}.png`,
      createdAt: new Date(),
    };

    return await countries.insertOne(document);
  };

  me.updateCountry = async (countryId, updateData) => {
    const { db } = await connect();
    const countries = db.collection("adminCountries");

    const allowedUpdates = {};
    for (const key of [
      "name",
      "capitals",
      "population",
      "region",
      "languages",
      "countryCode",
      "flagUrl",
    ]) {
      if (updateData[key] !== undefined) allowedUpdates[key] = updateData[key];
    }
    allowedUpdates.updatedAt = new Date();

    const mongoID = ObjectId.createFromHexString(countryId);
    return await countries.updateOne(
      { _id: mongoID },
      { $set: allowedUpdates },
    );
  };

  me.deleteCountry = async (countryId) => {
    const { db } = await connect();
    const countries = db.collection("adminCountries");

    const mongoID = ObjectId.createFromHexString(countryId);
    return await countries.deleteOne({ _id: mongoID });
  };

  // Functions for guessing country name game
  me.getRandomCountry = async () => {
    const { db } = await connect();
    const collection = db.collection("adminCountries");

    // Get 4 random countries
    const countries = await collection
      .aggregate([{ $sample: { size: 4 } }])
      .toArray();

    if (countries < 4) {
      throw new Error(
        "Not enough countries in database. Need at least 4 coutries.",
      );
    }

    // Set the first one as the correct country
    const correctCountry = countries[0];

    // Extract all 4 countries for options
    const options = countries.map((country) => country);

    // Shuffle the options so correct answer is not always the first one
    const shuffledOptions = shuffleArray(options);

    return {
      _id: correctCountry._id,
      name: correctCountry.name,
      flagUrl: correctCountry.flagUrl,
      capitals: correctCountry.capitals,
      population: correctCountry.population,
      region: correctCountry.region,
      languages: correctCountry.languages,
      options: shuffledOptions,
    };
  };

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Check the answer
  me.checkAnswer = async (countryId, userAnswer) => {
    const { db } = await connect();
    const countries = db.collection("adminCountries");
    const mongoID = ObjectId.createFromHexString(countryId);

    const country = await countries.findOne({ _id: mongoID });

    if (!country) {
      throw new Error("Country not found");
    }

    const correctAnswer = country.name.trim();
    const userAnswerNormalized = userAnswer.trim();

    const isCorrect = correctAnswer === userAnswerNormalized;

    return {
      correct: isCorrect,
      correctAnswer: country.name,
    };
  };

  return me;
}
