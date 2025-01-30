const mongoose = require("mongoose");

// Adjust this path to the correct model
const Event = require("./src/schemas/models/dashboard"); // Replace "dashboard" if incorrect

require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    const updatePrices = async () => {
      const events = await Event.find();

      for (let event of events) {
        if (!event.price.toString().includes("₦")) {
          event.price = parseFloat(event.price); // Ensure it’s a number
          await event.save();
        }
      }

      console.log("All prices updated!");
      mongoose.connection.close();
    };

    updatePrices();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
