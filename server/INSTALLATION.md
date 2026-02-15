# Complete Backend Installation Guide

## 📦 What You're Getting

A fully structured Node.js/Express backend with:
- ✅ Complete authentication system (register, login, password reset)
- ✅ JWT token-based authentication
- ✅ Role-based access control (User, Author, Admin)
- ✅ File upload configuration
- ✅ Email service utilities
- ✅ Pagination helpers
- ✅ Security middleware (rate limiting, helmet, CORS)
- ✅ Error handling
- ✅ All route structures ready

## 🚀 Quick Start (3 Steps)

### Step 1: Extract Files
Extract the `backend-complete` folder to your project directory.

### Step 2: Install Dependencies
```bash
cd backend-complete
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
cd backend-complete
npm install
npm install dotenv express-validator helmet express-rate-limit morgan cookie-parser slugify uuid nodemailer compression
npm install --save-dev nodemon
```

### Step 3: Configure & Run
```bash
# Copy and edit environment variables
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret

# Start the server
npm run dev
```

## 📁 Project Structure

```
backend-complete/
├── src/
│   ├── config/
│   │   └── database.js              # MySQL connection
│   ├── controllers/
│   │   └── authController.js        # Authentication logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Global error handler
│   │   ├── notFound.js              # 404 handler
│   │   ├── rateLimiter.js           # Rate limiting
│   │   └── upload.js                # File upload config
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints (COMPLETE)
│   │   ├── userRoutes.js            # User endpoints (placeholder)
│   │   ├── articleRoutes.js         # Article endpoints (placeholder)
│   │   ├── categoryRoutes.js        # Category endpoints (placeholder)
│   │   ├── commentRoutes.js         # Comment endpoints (placeholder)
│   │   ├── adminRoutes.js           # Admin endpoints (placeholder)
│   │   └── authorRoutes.js          # Author endpoints (placeholder)
│   ├── utils/
│   │   ├── email.js                 # Email sending utilities
│   │   ├── pagination.js            # Pagination helpers
│   │   └── slugify.js               # Slug generation
│   ├── models/                      # (Empty - ready for your models)
│   ├── validators/                  # (Empty - ready for validators)
│   └── server.js                    # Main application file
├── uploads/
│   ├── articles/                    # Article images
│   ├── profiles/                    # Profile pictures
│   └── media/                       # Other media
├── logs/                            # Application logs
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── README.md                        # Documentation
└── setup.sh                         # Installation script
```

## 🔧 Configuration

### Environment Variables (.env)

**Required Settings:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=article_publishing

# JWT
JWT_SECRET=generate_a_secure_random_string_at_least_32_characters
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Optional Settings:**
```env
# Server
PORT=5000
NODE_ENV=development

# Email (for password reset, notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# Frontend
FRONTEND_URL=http://localhost:3000
```

## ✅ What's Working Now

### Authentication Endpoints (FULLY FUNCTIONAL)

All endpoints are at: `http://localhost:5000/api/v1/auth`

1. **POST /register**
   ```json
   {
     "email": "user@example.com",
     "username": "johndoe",
     "password": "SecurePass123",
     "full_name": "John Doe",
     "role": "user"
   }
   ```

2. **POST /login**
   ```json
   {
     "email": "user@example.com",
     "password": "SecurePass123"
   }
   ```

3. **GET /me** (requires token)
   ```
   Headers: Authorization: Bearer {token}
   ```

4. **POST /logout** (requires token)

5. **POST /forgot-password**
   ```json
   {
     "email": "user@example.com"
   }
   ```

6. **PUT /reset-password/:token**
   ```json
   {
     "password": "NewPassword123"
   }
   ```

7. **PUT /update-password** (requires token)
   ```json
   {
     "currentPassword": "OldPass123",
     "newPassword": "NewPass123"
   }
   ```

## 🧪 Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@12345",
    "full_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api/v1`
3. Create environment variable: `token`
4. After login, save the token to use in protected routes

## 📚 Utility Functions Available

### Email Utilities (src/utils/email.js)
```javascript
const { sendEmail, sendVerificationEmail, sendPasswordResetEmail } = require('./utils/email');

// Send custom email
await sendEmail({ to: 'user@example.com', subject: 'Hello', html: '<p>Hi</p>' });

// Send verification email
await sendVerificationEmail(email, name, verificationUrl);

// Send password reset email
await sendPasswordResetEmail(email, name, resetUrl);
```

### Pagination (src/utils/pagination.js)
```javascript
const { getPagination, paginatedResponse } = require('./utils/pagination');

const pagination = getPagination(page, limit, totalCount);
const response = paginatedResponse(data, pagination);
```

### Slug Generation (src/utils/slugify.js)
```javascript
const { createSlug, createUniqueSlug } = require('./utils/slugify');

const slug = createSlug('My Article Title'); // 'my-article-title'
const uniqueSlug = await createUniqueSlug('Title', checkExistsFunction);
```

### File Upload (src/middleware/upload.js)
```javascript
const { uploadConfigs } = require('../middleware/upload');

// In your route
router.post('/upload', uploadConfigs.profileImage, async (req, res) => {
  const filePath = req.file.path;
  // Save to database
});
```

## 🔒 Security Features Included

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication
- ✅ Rate limiting (prevents brute force)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection

## 🛠️ Next Development Steps

### 1. Create Article Controller
```javascript
// src/controllers/articleController.js
exports.getArticles = async (req, res, next) => {
  // Implement
};
```

### 2. Add Validation
```javascript
// src/validators/articleValidator.js
const { body } = require('express-validator');

exports.createArticleValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];
```

### 3. Create Models (Optional)
```javascript
// src/models/Article.js
class Article {
  static async findAll() {
    // Database queries
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Database Connection Failed
```bash
# Check MySQL status
sudo service mysql status

# Start MySQL
sudo service mysql start

# Verify database exists
mysql -u root -p
SHOW DATABASES;
USE article_publishing;
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📖 Additional Resources

- **Express.js**: https://expressjs.com/
- **MySQL2**: https://github.com/sidorares/node-mysql2
- **JWT**: https://jwt.io/introduction
- **Multer**: https://github.com/expressjs/multer
- **Nodemailer**: https://nodemailer.com/

## 🎉 You're All Set!

Your backend is ready to use. The authentication system is complete and production-ready. You can now:

1. ✅ Test the auth endpoints
2. ⏭️ Build article CRUD operations
3. ⏭️ Implement file uploads
4. ⏭️ Create admin dashboard
5. ⏭️ Add comment system
6. ⏭️ Build author features

---

**Need Help?** Check the README.md or create an issue in your repository.

**Happy Coding! 🚀**
