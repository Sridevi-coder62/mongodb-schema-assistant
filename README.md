# 🗄️ AI-Based MongoDB Schema Generator

<div align="center">

![SchemaAI Banner](https://img.shields.io/badge/SchemaAI-v2.0-00e5ff?style=for-the-badge&labelColor=020408)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Describe your application in plain English — get a production-ready MongoDB schema instantly.**

[🚀 Live Demo](#) · [📖 Docs](#-local-setup) · [🐳 Docker](#-docker-setup) · [📸 Screenshots](#-screenshots)

</div>

---

## 📌 What Is This?

**AI-Based MongoDB Schema Generator** is a full-stack web application that automatically generates MongoDB database schemas from simple text descriptions.

Instead of manually designing collections and fields, you simply type:

> *"I need schema for a hospital management system"*

And instantly receive a structured, ready-to-use MongoDB schema with proper collections, fields, and data types — displayed in a beautiful ChatGPT-style interface.

---

## ✨ What's New in v2.0

| Feature | v1.0 | v2.0 |
|---|---|---|
| Schema domains | 10 | **20** |
| Chat history | Global | **Per-user sessions** |
| Authentication | ❌ | **✅ JWT + Bcrypt** |
| File upload | ❌ | **✅ .json, .js, .txt, .md...** |
| Bot response | Plain text | **Word-by-word typing animation** |
| UI style | Basic dark | **Neon / Cyberpunk** |
| History loading | View only | **Click to reload full chat** |
| Homepage | ❌ | **✅ Landing page** |

---

## 🎨 UI Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  S SCHEMAAI                              ● LIVE           v2.0  │
├──────────────────┬──────────────────────────────────────────────┤
│                  │  MONGODB SCHEMA GENERATOR › describe model   │
│  + NEW SCHEMA    │                                              │
│                  │  ┌─ User ──────────────────────────────────┐ │
│  HISTORY         │  │ E-commerce app with products...         │ │
│  · E-commerce... │  └─────────────────────────────────────────┘ │
│  · Hospital sy.. │                                              │
│  · Blog platfo.. │  AI  Sure! 🛒 I'm analyzing your e-commerce  │
│  · Chat app...   │      requirements and designing optimized    │
│                  │      collections for products, orders...     │
│  ─────────────── │      ┌─ MONGODB SCHEMA ──────────────── COPY┐│
│  S  Sridevi      │      │ "products": {                        ││
│     user@mail    │      │   "title": "String",                 ││
│                  │      │   "price": "Number",                 ││
│                  │      └──────────────────────────────────────┘│
│                  │  ┌─────────────────────────────── 📎 ──────┐ │
│                  │  │ Describe your database schema...        │ │
│                  │  └─────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## 🧠 Supported Domains (20 Total)

| # | Domain | Collections Generated |
|---|---|---|
| 1 | 🛒 E-Commerce | products, orders, carts |
| 2 | 📝 Blog / CMS | posts, categories, tags |
| 3 | 💬 Chat & Messaging | conversations, messages |
| 4 | 📱 Social Media | posts, follows, comments |
| 5 | 🏥 Healthcare | patients, doctors, appointments |
| 6 | 🎓 Education / LMS | courses, enrollments, quizzes |
| 7 | 🍔 Food Delivery | restaurants, menus, orders |
| 8 | 🏨 Hotel / Booking | bookings, resources |
| 9 | 💳 Fintech / Payments | wallets, transactions, invoices |
| 10 | 📋 Project Management | projects, tasks |
| 11 | 📦 Inventory | stock, warehouses, suppliers |
| 12 | 🏠 Real Estate | properties, agents, inquiries |
| 13 | 💼 Job Portal / HR | jobs, applications, companies |
| 14 | 🎮 Gaming | players, leaderboards, rooms |
| 15 | 🎫 Events & Ticketing | events, tickets |
| 16 | 🔌 IoT / Smart Devices | devices, sensorData |
| 17 | ⭐ Review & Rating | reviews |
| 18 | 🔔 Notifications | notifications |
| 19 | 📁 File / Media Storage | files, folders |
| 20 | 👤 User Management | users |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   DOCKER NETWORK                    │
│                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌───────┐ │
│  │   Frontend   │───▶│   Backend    │───▶│ Mongo │ │
│  │  React+Vite  │    │  Node+Express│    │  DB   │ │
│  │  Port: 5173  │    │  Port: 5000  │    │ 27017 │ │
│  └──────────────┘    └──────────────┘    └───────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Request flow:**
```
User types description
       ↓
React frontend (ChatPage)
       ↓  POST /api/generate
Express backend + JWT auth
       ↓
Keyword schema generator (20 domains)
       ↓
Save to MongoDB (ChatSession per user)
       ↓
Response with schema + bot intro
       ↓
Word-by-word typing animation → Schema display
```

---

## 🗂️ Project Structure

```
mongodb-schema-assistant/
│
├── 📁 ai-schema-backend/          # Node.js + Express API
│   ├── 📁 models/
│   │   └── User.js                # User schema (Mongoose)
│   ├── 📁 routes/
│   │   └── authRoutes.js          # Register + Login (JWT)
│   ├── 📁 uploads/                # Uploaded files (gitignored)
│   ├── server.js                  # Main server + all routes
│   ├── Dockerfile                 # Backend container
│   ├── .env                       # Environment variables
│   └── package.json
│
├── 📁 src/                        # React frontend
│   ├── 📁 pages/
│   │   ├── HomePage.jsx           # Landing page
│   │   ├── LoginPage.jsx          # Auth - login
│   │   ├── RegisterPage.jsx       # Auth - register
│   │   └── ChatPage.jsx           # Main chat interface
│   ├── App.jsx                    # Routes
│   └── main.jsx
│
├── Dockerfile                     # Frontend container
├── nginx.conf                     # SPA routing config
├── docker-compose.yml             # All 3 services
└── README.md
```

---

## ⚙️ API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create new user | ❌ |
| POST | `/api/auth/login` | Login → returns JWT | ❌ |

### Chat Sessions
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/sessions` | Get all user's sessions | ✅ |
| GET | `/api/sessions/:id` | Load session with messages | ✅ |
| POST | `/api/sessions` | Create new session | ✅ |
| DELETE | `/api/sessions/:id` | Delete a session | ✅ |

### Schema Generation
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/generate` | Generate schema + save to session | ✅ |
| POST | `/api/upload` | Upload file | ✅ |

---

## 🐳 Docker Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run everything with one command

```bash
# Clone the repo
git clone https://github.com/Sridevi-coder62/mongodb-schema-assistant.git
cd mongodb-schema-assistant

# Start all 3 services
docker-compose up --build
```

**Services start automatically:**

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:5173 |
| ⚙️ Backend | http://localhost:5000 |
| 🍃 MongoDB | localhost:27017 |

### Stop containers
```bash
docker-compose down
```

### Stop and remove volumes (reset DB)
```bash
docker-compose down -v
```

---

## 💻 Local Setup (Without Docker)

### 1. Clone the repo
```bash
git clone https://github.com/Sridevi-coder62/mongodb-schema-assistant.git
cd mongodb-schema-assistant
```

### 2. Setup Backend
```bash
cd ai-schema-backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ai-schema-db
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

Start backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd ..
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-schema-db` |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens | `mysecretkey123` |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 18 | Runtime environment |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | File upload handling |
| cors | Cross-origin requests |
| dotenv | Environment variables |

### Database & DevOps
| Technology | Purpose |
|---|---|
| MongoDB 7 | NoSQL database |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Frontend static file serving |
| Git + GitHub | Version control |

---

## ✅ Features

- ✅ Generate MongoDB schemas from plain English descriptions
- ✅ Supports **20 application domain types**
- ✅ **JWT authentication** — secure login & registration
- ✅ **Per-user chat sessions** — private, persistent history
- ✅ **Click history to reload** full past conversations
- ✅ **Word-by-word typing animation** like ChatGPT
- ✅ **File upload** — auto-generate schemas from existing code files
- ✅ Syntax highlighted schema output (6 data type colors)
- ✅ One-click **copy schema** to clipboard
- ✅ **Neon/Cyberpunk UI** — dark theme with glowing accents
- ✅ Beautiful **landing/home page**
- ✅ User profile panel with logout
- ✅ Fully **Dockerized** (3-service setup)
- ✅ MongoDB persistence across restarts

---

## 🔮 Future Enhancements

- [ ] Real AI model integration (OpenAI / Gemini)
- [ ] Auto relationship detection between collections
- [ ] Export schema as Mongoose model code
- [ ] Visual schema diagram (ERD)
- [ ] Cloud deployment (AWS / Railway / Render)
- [ ] Schema versioning and editing
- [ ] Team collaboration support

---

## 👩‍💻 Developer

**Sridevi K**

- 🐙 GitHub: [@Sridevi-coder62](https://github.com/Sridevi-coder62)
- 🎓 BCA Student | Kristu Jayanti College
- 👥 Member of ACM-W | UiPath Core Team

---

## 📚 References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

---

<div align="center">

Made with ❤️ by Sridevi K · BCA Student · Kristu Jayanti College

⭐ Star this repo if it helped you!

</div>
