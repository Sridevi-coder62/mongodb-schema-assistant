require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ==============================
   Middleware
============================== */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

/* ==============================
   MongoDB Connection
============================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });

/* ==============================
   Schema Model
============================== */

const schemaModel = new mongoose.Schema(
  {
    description: String,
    generatedSchema: Object,
  },
  { timestamps: true }
);

const SchemaData = mongoose.model("SchemaData", schemaModel);

/* ==============================
   Routes
============================== */

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ==============================
   SMART SCHEMA GENERATOR
============================== */

app.post("/generate", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: "Description required",
      });
    }

    const text = description.toLowerCase();
    let schema = {};

    // USERS
    if (text.includes("user")) {
      schema.users = {
        name: "String",
        email: "String",
        password: "String",
        role: "String",
        createdAt: "Date",
      };
    }

    // AUTH
    if (text.includes("auth") || text.includes("login")) {
      schema.auth = {
        email: "String",
        password: "String",
        token: "String",
      };
    }

    // PRODUCTS
    if (text.includes("product")) {
      schema.products = {
        title: "String",
        price: "Number",
        description: "String",
        stock: "Number",
      };
    }

    // ORDERS
    if (text.includes("order")) {
      schema.orders = {
        userId: "ObjectId",
        products: "Array",
        totalAmount: "Number",
        status: "String",
      };
    }

    // BLOG / POSTS
    if (text.includes("blog") || text.includes("post")) {
      schema.posts = {
        title: "String",
        content: "String",
        authorId: "ObjectId",
        createdAt: "Date",
      };
    }

    // COMMENTS
    if (text.includes("comment")) {
      schema.comments = {
        postId: "ObjectId",
        userId: "ObjectId",
        text: "String",
      };
    }

    // CHAT
    if (text.includes("chat") || text.includes("message")) {
      schema.messages = {
        senderId: "ObjectId",
        receiverId: "ObjectId",
        message: "String",
        timestamp: "Date",
      };
    }

    // PAYMENTS
    if (text.includes("payment")) {
      schema.payments = {
        userId: "ObjectId",
        amount: "Number",
        method: "String",
        status: "String",
      };
    }

    // BOOKINGS
    if (text.includes("booking")) {
      schema.bookings = {
        userId: "ObjectId",
        date: "Date",
        status: "String",
      };
    }

    // REVIEWS
    if (text.includes("review")) {
      schema.reviews = {
        userId: "ObjectId",
        productId: "ObjectId",
        rating: "Number",
        comment: "String",
      };
    }

    // NOTIFICATIONS
    if (text.includes("notification")) {
      schema.notifications = {
        userId: "ObjectId",
        message: "String",
        read: "Boolean",
      };
    }

    // FOLLOW SYSTEM
    if (text.includes("follow")) {
      schema.follows = {
        followerId: "ObjectId",
        followingId: "ObjectId",
      };
    }

    // CATEGORY
    if (text.includes("category")) {
      schema.categories = {
        name: "String",
        description: "String",
      };
    }

    // FILE UPLOAD
    if (text.includes("file") || text.includes("upload")) {
      schema.files = {
        filename: "String",
        url: "String",
        uploadedAt: "Date",
      };
    }

    // DEFAULT
    if (Object.keys(schema).length === 0) {
      schema = {
        data: {
          field1: "String",
          field2: "String",
        },
      };
    }

    // SAVE TO DB
    const newEntry = new SchemaData({
      description,
      generatedSchema: schema,
    });

    await newEntry.save();

    res.json({
      success: true,
      data: schema,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

/* ==============================
   Get History
============================== */

app.get("/all", async (req, res) => {
  try {
    const data = await SchemaData.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/* ==============================
   Start Server
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});