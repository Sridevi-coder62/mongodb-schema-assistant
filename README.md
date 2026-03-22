# 🗄️ AI-Based MongoDB Schema Generator

> A smart web application that automatically generates MongoDB schemas based on simple text descriptions — built for developers and learners who want to skip the hassle of manual database design.

![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📌 Project Synopsis

Designing database schemas manually requires deep knowledge, takes significant time, and often leads to inefficient structures — especially for beginners.

The **AI-Based MongoDB Schema Generator** solves this by letting users simply *describe* what they need in plain English. The system interprets the input and instantly generates a structured MongoDB schema — complete with collections, fields, and data types.

### Supported Application Types
- 🛒 E-commerce Applications
- 📝 Blog Platforms
- 💬 Chat Applications
- 📅 Booking Systems
- 💳 Payment Systems
- ⭐ Review & Rating Systems
- 🔔 Notification Systems
- 📁 File Upload Systems
- 👤 User Management Systems
- 🔐 Authentication Systems

---

## 🎨 Frontend Design

Built with **React.js + Vite + Tailwind CSS** — a premium dark terminal-style UI inspired by modern developer tools.

### UI Components
```
src/
├── components/
│   ├── ChatInput.jsx      # Text input + file upload
│   ├── ChatWindow.jsx     # Message display with syntax highlighting
│   └── Sidebar.jsx        # History panel + new chat button
└── pages/
    └── ChatPage.jsx       # Main layout page
```

### Key UI Features
- 🌑 **Dark terminal aesthetic** with cyan/blue accent colors
- ✨ **Syntax highlighted schema output** — each data type has its own color:
  - 🟢 `String` — Green
  - 🟠 `Number` — Amber
  - 🟣 `Date` — Purple
  - 🔵 `ObjectId` — Cyan
  - 🟤 `Boolean` — Coral
  - 🩷 `Array` — Pink
- 📋 **One-click copy** for generated schemas
- 📁 **File upload** support (.json, .txt, .js, .ts, .jsx)
- 🕒 **History sidebar** with timestamps showing past sessions
- ⚡ **Quick-start hint cards** for common schema types
- 📱 **Responsive layout** with smooth animations

### Color Palette
| Element | Color |
|---|---|
| Background | `#080c12` |
| Sidebar | `#06090f` |
| Accent | `#00e5ff` Cyan |
| Primary | `#0066ff` Blue |
| Text | `#c8dff0` |

---

## ⚙️ Backend Design

Built with **Node.js + Express.js** — a clean REST API with keyword-based schema generation logic.

### Folder Structure
```
ai-schema-backend/
├── server.js          # Main server file
├── package.json
└── .env               # Environment variables (not pushed to GitHub)
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/generate` | Accepts description → returns generated schema |
| `GET` | `/all` | Returns full history of generated schemas |

### How It Works
```
User types: "I need schema for payment"
        ↓
Backend detects keyword: "payment"
        ↓
Returns: payments { userId, amount, method, status }
        ↓
Saves to MongoDB + sends response to frontend
```

### Database Model
```javascript
{
  description: String,       // What the user typed
  generatedSchema: Object,   // The generated schema
  createdAt: Date,           // Timestamp (auto)
  updatedAt: Date            // Timestamp (auto)
}
```

---

## 🛠️ Tools & Technologies

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| JavaScript ES6+ | Programming language |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| CORS | Cross-origin requests |
| dotenv | Environment variables |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | NoSQL database |

### DevOps & Tools
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Git | Version control |
| GitHub | Code hosting |
| VS Code | Code editor |
| Thunder Client | API testing |

---

## 🚀 System Architecture
```
User Interface (React + Vite)
        ↓ HTTP Request
Backend Server (Node.js + Express)
        ↓ Mongoose
MongoDB Database
        ↓
Response back to Frontend
```

---

## 🐳 Docker Setup
```bash
docker-compose up --build
```

All 3 services start automatically:
- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- MongoDB → localhost:27017

---

## 📦 Local Setup
```bash
# Clone the repo
git clone https://github.com/Sridevi-coder62/mongodb-schema-assistant.git

# Setup backend
cd ai-schema-backend
npm install
node server.js

# Setup frontend
cd ..
npm install
npm run dev
```

---

## ✨ Features

- ✅ Generate MongoDB schemas from plain English
- ✅ Supports 10+ application domain types
- ✅ Syntax highlighted schema output
- ✅ Chat-style interface
- ✅ History of all generated schemas
- ✅ File upload support
- ✅ One-click copy for schemas
- ✅ Fully Dockerized
- ✅ MongoDB persistence

---

## 🔮 Future Enhancements

- Real AI model integration
- Auto relationship detection
- Export schema as Mongoose model code
- Visual schema diagram
- Cloud deployment

---

## 👩‍💻 Developer

**Sridevi K**
- GitHub: [@Sridevi-coder62](https://github.com/Sridevi-coder62)
- BCA Student | Kristu Jayanti College
- Member of ACM-W | UiPath Core Team

---

## 📚 References

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)
