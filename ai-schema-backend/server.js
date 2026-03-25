require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── Multer ── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ── MongoDB ── */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => { console.error(err); process.exit(1); });

/* ══ MODELS ══ */
const ChatSession = mongoose.model("ChatSession", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New Chat" },
  messages: [{
    role: { type: String, enum: ["user", "bot"] },
    text: String,
    schema: Object,
    fileUrl: String,
    fileName: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true }));

const SchemaData = mongoose.model("SchemaData", new mongoose.Schema(
  { description: String, generatedSchema: Object }, { timestamps: true }
));

/* ══ AUTH MIDDLEWARE ══ */
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ══ SCHEMA GENERATOR — 20 DOMAINS ══ */
function generateSchema(text) {
  const t = text.toLowerCase();
  const schema = {};

  if (t.includes("user") || t.includes("auth") || t.includes("login") || t.includes("signup") || t.includes("account"))
    schema.users = { _id: "ObjectId", name: "String", email: "String", password: "String", role: "String", avatar: "String", isVerified: "Boolean", createdAt: "Date" };

  if (t.includes("ecommerce") || t.includes("e-commerce") || t.includes("shop") || t.includes("store") || t.includes("marketplace")) {
    schema.products = { _id: "ObjectId", title: "String", description: "String", price: "Number", stock: "Number", categoryId: "ObjectId", images: "Array", rating: "Number" };
    schema.orders = { _id: "ObjectId", userId: "ObjectId", items: "Array", totalAmount: "Number", status: "String", shippingAddress: "String", placedAt: "Date" };
  }

  if (t.includes("blog") || t.includes("cms") || t.includes("article") || t.includes("post") || t.includes("publication")) {
    schema.posts = { _id: "ObjectId", title: "String", slug: "String", content: "String", authorId: "ObjectId", tags: "Array", status: "String", publishedAt: "Date" };
    schema.categories = { _id: "ObjectId", name: "String", slug: "String", description: "String" };
  }

  if (t.includes("chat") || t.includes("message") || t.includes("messaging") || t.includes("conversation") || t.includes("inbox")) {
    schema.conversations = { _id: "ObjectId", participants: "Array", lastMessage: "String", updatedAt: "Date" };
    schema.messages = { _id: "ObjectId", conversationId: "ObjectId", senderId: "ObjectId", content: "String", type: "String", readBy: "Array", sentAt: "Date" };
  }

  if (t.includes("social") || t.includes("feed") || t.includes("follow") || t.includes("like") || t.includes("instagram") || t.includes("twitter")) {
    schema.posts = schema.posts || { _id: "ObjectId", userId: "ObjectId", caption: "String", mediaUrl: "Array", likes: "Array", commentsCount: "Number", createdAt: "Date" };
    schema.follows = { _id: "ObjectId", followerId: "ObjectId", followingId: "ObjectId", createdAt: "Date" };
    schema.comments = { _id: "ObjectId", postId: "ObjectId", userId: "ObjectId", text: "String", createdAt: "Date" };
  }

  if (t.includes("hospital") || t.includes("healthcare") || t.includes("medical") || t.includes("doctor") || t.includes("patient") || t.includes("clinic")) {
    schema.patients = { _id: "ObjectId", name: "String", age: "Number", gender: "String", bloodGroup: "String", contact: "String", medicalHistory: "Array" };
    schema.doctors = { _id: "ObjectId", name: "String", specialization: "String", email: "String", schedule: "Array", fee: "Number" };
    schema.appointments = { _id: "ObjectId", patientId: "ObjectId", doctorId: "ObjectId", date: "Date", status: "String", notes: "String" };
  }

  if (t.includes("lms") || t.includes("course") || t.includes("education") || t.includes("learning") || t.includes("student") || t.includes("university")) {
    schema.courses = { _id: "ObjectId", title: "String", description: "String", instructorId: "ObjectId", price: "Number", modules: "Array", enrolledCount: "Number" };
    schema.enrollments = { _id: "ObjectId", userId: "ObjectId", courseId: "ObjectId", progress: "Number", completedAt: "Date" };
    schema.quizzes = { _id: "ObjectId", courseId: "ObjectId", questions: "Array", passMark: "Number" };
  }

  if (t.includes("food") || t.includes("restaurant") || t.includes("delivery") || t.includes("menu") || t.includes("recipe")) {
    schema.restaurants = { _id: "ObjectId", name: "String", address: "String", cuisine: "Array", rating: "Number", isOpen: "Boolean" };
    schema.menuItems = { _id: "ObjectId", restaurantId: "ObjectId", name: "String", price: "Number", category: "String", isAvailable: "Boolean" };
    schema.deliveryOrders = { _id: "ObjectId", userId: "ObjectId", restaurantId: "ObjectId", items: "Array", totalAmount: "Number", deliveryStatus: "String" };
  }

  if (t.includes("booking") || t.includes("reservation") || t.includes("hotel") || t.includes("travel") || t.includes("airbnb")) {
    schema.bookings = { _id: "ObjectId", userId: "ObjectId", resourceId: "ObjectId", checkIn: "Date", checkOut: "Date", status: "String", totalCost: "Number" };
    schema.resources = { _id: "ObjectId", name: "String", type: "String", pricePerNight: "Number", isAvailable: "Boolean", amenities: "Array" };
  }

  if (t.includes("payment") || t.includes("fintech") || t.includes("wallet") || t.includes("transaction") || t.includes("banking") || t.includes("invoice")) {
    schema.wallets = { _id: "ObjectId", userId: "ObjectId", balance: "Number", currency: "String", updatedAt: "Date" };
    schema.transactions = { _id: "ObjectId", senderId: "ObjectId", receiverId: "ObjectId", amount: "Number", method: "String", status: "String", reference: "String", createdAt: "Date" };
    schema.invoices = { _id: "ObjectId", userId: "ObjectId", items: "Array", totalAmount: "Number", dueDate: "Date", isPaid: "Boolean" };
  }

  if (t.includes("project") || t.includes("task") || t.includes("todo") || t.includes("kanban") || t.includes("management")) {
    schema.projects = { _id: "ObjectId", name: "String", description: "String", ownerId: "ObjectId", members: "Array", status: "String", deadline: "Date" };
    schema.tasks = { _id: "ObjectId", projectId: "ObjectId", title: "String", assigneeId: "ObjectId", priority: "String", status: "String", dueDate: "Date" };
  }

  if (t.includes("inventory") || t.includes("warehouse") || t.includes("stock") || t.includes("supply") || t.includes("logistics")) {
    schema.inventory = { _id: "ObjectId", productId: "ObjectId", quantity: "Number", warehouseId: "ObjectId", reorderLevel: "Number", updatedAt: "Date" };
    schema.warehouses = { _id: "ObjectId", name: "String", location: "String", capacity: "Number", manager: "String" };
    schema.suppliers = { _id: "ObjectId", name: "String", contact: "String", products: "Array", rating: "Number" };
  }

  if (t.includes("real estate") || t.includes("property") || t.includes("rent") || t.includes("house") || t.includes("apartment") || t.includes("realty")) {
    schema.properties = { _id: "ObjectId", title: "String", type: "String", price: "Number", location: "String", bedrooms: "Number", area: "Number", images: "Array", agentId: "ObjectId" };
    schema.agents = { _id: "ObjectId", name: "String", email: "String", phone: "String", listings: "Array" };
    schema.inquiries = { _id: "ObjectId", propertyId: "ObjectId", userId: "ObjectId", message: "String", createdAt: "Date" };
  }

  if (t.includes("job") || t.includes("hr") || t.includes("recruitment") || t.includes("career") || t.includes("resume") || t.includes("employee")) {
    schema.jobs = { _id: "ObjectId", title: "String", company: "String", location: "String", salary: "String", type: "String", requirements: "Array", postedAt: "Date" };
    schema.applications = { _id: "ObjectId", jobId: "ObjectId", userId: "ObjectId", resumeUrl: "String", status: "String", appliedAt: "Date" };
    schema.companies = { _id: "ObjectId", name: "String", industry: "String", size: "String", website: "String" };
  }

  if (t.includes("game") || t.includes("gaming") || t.includes("leaderboard") || t.includes("player") || t.includes("multiplayer")) {
    schema.players = { _id: "ObjectId", username: "String", level: "Number", xp: "Number", achievements: "Array", createdAt: "Date" };
    schema.leaderboards = { _id: "ObjectId", gameId: "ObjectId", playerId: "ObjectId", score: "Number", rank: "Number", updatedAt: "Date" };
    schema.gameRooms = { _id: "ObjectId", name: "String", players: "Array", status: "String", maxPlayers: "Number" };
  }

  if (t.includes("event") || t.includes("ticket") || t.includes("concert") || t.includes("conference") || t.includes("webinar")) {
    schema.events = { _id: "ObjectId", title: "String", description: "String", date: "Date", venue: "String", organizerId: "ObjectId", capacity: "Number", price: "Number" };
    schema.tickets = { _id: "ObjectId", eventId: "ObjectId", userId: "ObjectId", seatNumber: "String", status: "String", purchasedAt: "Date" };
  }

  if (t.includes("iot") || t.includes("sensor") || t.includes("device") || t.includes("smart home") || t.includes("telemetry")) {
    schema.devices = { _id: "ObjectId", name: "String", type: "String", ownerId: "ObjectId", status: "String", location: "String", registeredAt: "Date" };
    schema.sensorData = { _id: "ObjectId", deviceId: "ObjectId", metric: "String", value: "Number", unit: "String", recordedAt: "Date" };
  }

  if (t.includes("review") || t.includes("rating") || t.includes("feedback") || t.includes("testimonial"))
    schema.reviews = { _id: "ObjectId", userId: "ObjectId", targetId: "ObjectId", targetType: "String", rating: "Number", comment: "String", helpful: "Array", createdAt: "Date" };

  if (t.includes("notification") || t.includes("alert") || t.includes("push"))
    schema.notifications = { _id: "ObjectId", userId: "ObjectId", title: "String", body: "String", type: "String", read: "Boolean", link: "String", createdAt: "Date" };

  if (t.includes("file") || t.includes("upload") || t.includes("media") || t.includes("cloud") || t.includes("storage") || t.includes("document")) {
    schema.files = { _id: "ObjectId", ownerId: "ObjectId", filename: "String", originalName: "String", mimeType: "String", size: "Number", url: "String", folderId: "ObjectId", uploadedAt: "Date" };
    schema.folders = { _id: "ObjectId", name: "String", ownerId: "ObjectId", parentId: "ObjectId", createdAt: "Date" };
  }

  if (Object.keys(schema).length === 0)
    schema.records = { _id: "ObjectId", name: "String", description: "String", status: "String", metadata: "Object", createdAt: "Date" };

  return schema;
}

/* ══ BOT INTRO MESSAGES ══ */
function buildIntro(desc) {
  const t = desc.toLowerCase();
  const intros = {
    ecommerce: "Great choice! 🛒 I'm analyzing your e-commerce requirements and designing optimized collections for products, orders, payments, and users...",
    blog: "Perfect! ✍️ Setting up a full-featured blog schema with posts, categories, authors, tags and comments...",
    chat: "On it! 💬 Designing a real-time messaging schema with conversations, messages, participants and read receipts...",
    hospital: "Understood! 🏥 Building a comprehensive healthcare schema with patients, doctors, appointments and medical records...",
    course: "Excellent! 🎓 Creating an LMS schema with courses, modules, enrollments, quizzes and student progress tracking...",
    food: "Yum! 🍔 Designing a food delivery schema with restaurants, menus, orders and real-time delivery tracking...",
    booking: "Sure! 📅 Generating a booking system schema with reservations, availability, resources and payment tracking...",
    payment: "Got it! 💳 Building a fintech schema with wallets, transactions, invoices and payment methods...",
    social: "Cool! 📱 Creating a social media schema with posts, follows, likes, comments and user feeds...",
    game: "Let's go! 🎮 Designing a gaming schema with players, leaderboards, game rooms and achievements...",
    project: "On it! 📋 Setting up a project management schema with projects, tasks, members and kanban workflows...",
    real: "Perfect! 🏠 Generating a real estate schema with properties, agents, listings and inquiries...",
    job: "Sure! 💼 Building a job portal schema with listings, applications, companies and candidate profiles...",
    inventory: "Got it! 📦 Designing an inventory schema with stock tracking, warehouses and supplier management...",
    event: "Awesome! 🎫 Creating an events schema with venues, tickets, attendees and booking systems...",
    iot: "Interesting! 🔌 Building an IoT schema with devices, sensor data streams and telemetry records...",
  };
  for (const [key, msg] of Object.entries(intros)) {
    if (t.includes(key)) return msg;
  }
  return `Sure! 🧠 Analyzing your "${desc}" requirements and generating the optimal MongoDB schema structure...`;
}

/* ══ ROUTES ══ */
app.get("/", (req, res) => res.send("Backend running 🚀"));
app.use("/api/auth", authRoutes);

// Sessions
app.post("/api/sessions", authMiddleware, async (req, res) => {
  try {
    const session = new ChatSession({ userId: req.user.userId, title: "New Chat", messages: [] });
    await session.save();
    res.json(session);
  } catch { res.status(500).json({ error: "Failed to create session" }); }
});

app.get("/api/sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.userId }).sort({ updatedAt: -1 }).select("title updatedAt createdAt messages");
    res.json(sessions);
  } catch { res.status(500).json({ error: "Failed to fetch sessions" }); }
});

app.get("/api/sessions/:id", authMiddleware, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!session) return res.status(404).json({ error: "Not found" });
    res.json(session);
  } catch { res.status(500).json({ error: "Failed to fetch session" }); }
});

app.delete("/api/sessions/:id", authMiddleware, async (req, res) => {
  try {
    await ChatSession.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete" }); }
});

// Generate
app.post("/api/generate", authMiddleware, async (req, res) => {
  try {
    const { description, sessionId } = req.body;
    if (!description) return res.status(400).json({ success: false, error: "Description required" });

    const schema = generateSchema(description);
    const intro = buildIntro(description);

    let session;
    if (sessionId) session = await ChatSession.findOne({ _id: sessionId, userId: req.user.userId });
    if (!session) session = new ChatSession({ userId: req.user.userId, title: description.slice(0, 50), messages: [] });
    if (session.messages.length === 0) session.title = description.length > 45 ? description.slice(0, 45) + "..." : description;

    session.messages.push({ role: "user", text: description });
    session.messages.push({ role: "bot", text: intro, schema });
    await session.save();

    res.json({ success: true, data: schema, intro, sessionId: session._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// File upload
app.post("/api/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    let extractedText = "";
    const ext = path.extname(req.file.originalname).toLowerCase();
    if ([".txt", ".json", ".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
      extractedText = fs.readFileSync(req.file.path, "utf8").slice(0, 800);
    }
    res.json({ success: true, fileUrl, fileName: req.file.originalname, extractedText });
  } catch { res.status(500).json({ error: "Upload failed" }); }
});

// Legacy
app.post("/generate", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ success: false, error: "Description required" });
    const schema = generateSchema(description);
    await new SchemaData({ description, generatedSchema: schema }).save();
    res.json({ success: true, data: schema });
  } catch { res.status(500).json({ success: false, error: "Something went wrong" }); }
});

app.get("/all", async (req, res) => {
  try { res.json(await SchemaData.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ error: "Failed" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));