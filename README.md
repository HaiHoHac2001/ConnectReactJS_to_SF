# 🎌 Japanese Learning Login System

A simple and elegant login system for Japanese language learners with Salesforce integration.

## 🚀 Features

- **Simple Login Form**: Clean email/password login interface
- **Salesforce Integration**: Connects to custom Salesforce REST API
- **User Dashboard**: Displays learning progress and statistics
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Data**: Shows current level, scores, and accuracy from Salesforce

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JSForce** - Salesforce API integration
- **Axios** - HTTP client for OAuth2
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Salesforce Developer Account
- Salesforce Connected App credentials

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd JapanesListening
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
# Salesforce Configuration
SF_LOGIN_URL=https://login.salesforce.com
SF_CLIENT_ID=your_client_id_here
SF_CLIENT_SECRET=your_client_secret_here
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## 🔐 Salesforce Setup

### 1. Create Connected App
1. Go to Salesforce Setup → App Manager
2. Click "New Connected App"
3. Fill in basic information
4. Enable OAuth Settings
5. Add these OAuth Scopes:
   - Access and manage your data (api)
   - Perform requests on your behalf at any time (refresh_token, offline_access)
6. Set Callback URL to: `http://localhost:3000/callback`
7. Save and note down Client ID and Client Secret

### 2. Create Custom Object (Optional)
If you need a custom learner object:
1. Go to Setup → Object Manager
2. Create Custom Object "Japanese_Learner__c"
3. Add fields:
   - `FirstName__c` (Text)
   - `LastName__c` (Text)
   - `Email__c` (Email)
   - `CurrentLevel__c` (Picklist: N5, N4, N3, N2, N1)
   - `EnrollmentDate__c` (Date)
   - `LastLoginDate__c` (DateTime)

## 📁 Project Structure

```
JapanesListening/
├── backend/
│   ├── config/
│   │   └── salesforce.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── learnerRoutes.js
│   ├── services/
│   │   └── learnerService.js
│   ├── .env (create this)
│   ├── env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthRequired.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Header.js
│   │   │   ├── LearnerCard.js
│   │   │   ├── LearnerList.js
│   │   │   ├── LearnerModal.js
│   │   │   └── SalesforceLoginModal.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/auto-login` - Automatic Salesforce login
- `POST /api/auth/salesforce-login` - Manual Salesforce login
- `POST /api/auth/validate-token` - Validate access token
- `POST /api/auth/logout` - Logout from Salesforce

### Learners
- `GET /api/learners` - Get all learners
- `GET /api/learners/:id` - Get learner by ID
- `GET /api/learners/level/:level` - Get learners by JLPT level
- `GET /api/learners/search?q=term` - Search learners
- `GET /api/learners/stats` - Get learner statistics
- `GET /api/learners/test/connection` - Test Salesforce connection

### Health
- `GET /api/health` - Health check endpoint

## 🎯 Key Features Explained

### Auto-Login Flow
1. Frontend loads → AuthContext checks for existing token
2. If no valid token → Calls `/api/auth/auto-login`
3. Backend uses OAuth2 password flow to get Salesforce token
4. Token stored in localStorage for future use
5. App automatically connects without user intervention

### Connection Status
- **Green (Connected)**: Authenticated and connected to Salesforce
- **Blue (Server Only)**: Backend running but not authenticated
- **Red (Offline)**: Cannot connect to backend
- **Yellow (Checking)**: Connection status being verified

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized on auto-login**
   - Check Salesforce credentials in `.env`
   - Verify Connected App settings
   - Check if IP restrictions are applied

2. **CORS errors**
   - Ensure `FRONTEND_URL` in `.env` matches your frontend URL
   - Check if both servers are running

3. **Module not found errors**
   - Run `npm install` in both backend and frontend directories
   - Delete `node_modules` and reinstall if needed

4. **Salesforce API errors**
   - Check API version compatibility
   - Verify object and field names
   - Check user permissions in Salesforce

## 📝 Environment Variables

### Backend (.env)
```env
SF_LOGIN_URL=https://login.salesforce.com
SF_CLIENT_ID=your_salesforce_client_id
SF_CLIENT_SECRET=your_salesforce_client_secret
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.

---

**Note**: Remember to never commit your `.env` file or expose your Salesforce credentials publicly!