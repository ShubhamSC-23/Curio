# Article Publishing Platform - Backend API

Complete backend API for an article publishing platform with three user roles: **User**, **Author**, and **Admin**.

## 🚀 Features

### User Panel
- User registration and authentication
- Browse and read published articles
- Like and comment on articles
- Bookmark favorite articles
- Follow authors
- User profile management

### Author Panel
- Create, edit, and manage articles
- Draft and publish workflow
- View article statistics (views, likes, comments)
- Manage author profile
- Upload and manage media

### Admin Panel
- Approve/reject author applications
- Moderate articles (approve/reject)
- Manage categories and tags
- Review reported content
- User management
- Site analytics dashboard

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone and Setup

```bash
cd server
npm install
```

### 2. Install Additional Dependencies

```bash
npm install dotenv express-validator helmet express-rate-limit morgan cookie-parser slugify uuid nodemailer compression

npm install --save-dev nodemon
```

### 3. Database Setup

Make sure you've already created the database using the SQL file provided earlier:

```bash
mysql -u root -p < article_publishing_database.sql
```

### 4. Environment Configuration

Create a `.env` file in the server root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=article_publishing
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (for password reset, notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 5. File Structure

Organize your files according to this structure:

```
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── (other controllers)
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── rateLimiter.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── articleRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── authorRoutes.js
│   ├── models/
│   ├── utils/
│   ├── validators/
│   └── server.js
├── uploads/
│   ├── articles/
│   ├── profiles/
│   └── media/
├── logs/
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## 🏃 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT you specified in .env)

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "role": "user"  // Optional: "user" (default), "author"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

#### Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
PUT /api/v1/auth/reset-password/:resetToken
Content-Type: application/json

{
  "password": "NewSecurePass123"
}
```

#### Update Password (when logged in)
```http
PUT /api/v1/auth/update-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Using the Token

All protected routes require the JWT token in the Authorization header:

```http
Authorization: Bearer {your_jwt_token}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
  - Auth endpoints: 5 requests per 15 minutes
  - API endpoints: 100 requests per 15 minutes
- **Helmet.js**: Security headers
- **CORS**: Configured for your frontend
- **Input Validation**: All inputs are validated
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Built-in Express escaping

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@12345",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Create an environment variable for `baseURL` = `http://localhost:5000/api/v1`
3. Create an environment variable for `token` (set after login)
4. Use `{{baseURL}}` and `{{token}}` in your requests

## 📝 Next Steps

### Immediate Tasks

1. **Create Article Controller**: Implement CRUD operations for articles
2. **File Upload**: Set up Multer for image uploads
3. **Category Management**: CRUD for categories
4. **Comment System**: Nested comments with moderation
5. **Admin Dashboard**: Statistics and analytics

### Future Enhancements

1. **Email Service**: Set up Nodemailer for verification emails
2. **Real-time Notifications**: WebSocket/Socket.io integration
3. **Search Functionality**: Full-text search for articles
4. **Caching**: Redis for improved performance
5. **Image Processing**: Sharp/Jimp for image optimization
6. **API Documentation**: Swagger/OpenAPI
7. **Testing**: Jest/Mocha for unit and integration tests
8. **Logging**: Winston for better log management

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if MySQL is running
sudo service mysql status

# Restart MySQL
sudo service mysql restart

# Check connection
mysql -u root -p
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Environment Variables Not Loading

- Make sure `.env` file is in the server root
- Restart the server after changing `.env`
- Check for syntax errors in `.env`

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and MySQL**
