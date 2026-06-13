# MindCare - AI-Powered Mental Health Web Application

MindCare is a production-ready, full-stack mental health tracking platform powered by artificial intelligence. It helps users monitor their mood, journal their thoughts, track habits, and receive personalized insights backed by NLP and machine learning.

## 🌟 Features

### Core Functionality
- **Authentication**: Secure JWT-based authentication with Spring Security
- **Mood Tracking**: 1-10 scale mood logging with emotion and intensity tracking
- **Journal Entries**: Rich text journaling with AI sentiment analysis
- **Habit Tracking**: Monitor sleep, exercise, meditation, medication, and more
- **Reminders**: Scheduled reminders with recurring patterns (Daily, Weekly, Monthly)
- **Analytics Dashboard**: Comprehensive mood trends, habit correlation, and trigger detection

### AI Features
- **Sentiment Analysis**: Analyze journal entries for emotional content
- **Emotion Detection**: Identify specific emotions from text
- **Personalized Recommendations**: AI-driven suggestions based on mood and habits
- **Weekly Insights**: Automated mood pattern analysis and trend detection
- **Smart Prompts**: Dynamic journaling prompts to encourage reflection

## 🏗️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MongoDB with Spring Data MongoDB
- **Authentication**: Spring Security + JWT
- **Build Tool**: Maven
- **Scheduler**: Spring @Scheduled annotation

### Frontend
- **Framework**: React 18.2 with Hooks
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: React Icons

### Infrastructure
- **Frontend Deployment**: Netlify/Vercel
- **Backend Deployment**: Render
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
Mental_Health/
├── backend/
│   ├── src/main/java/com/mentalhealth/
│   │   ├── controller/          # REST API endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── model/               # Entity classes
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Spring configuration
│   │   ├── security/            # JWT utilities
│   │   ├── exception/           # Exception handlers
│   │   ├── util/                # Utilities (Scheduler)
│   │   ├── ai/                  # AI services
│   │   └── MentalHealthApplication.java
│   ├── src/main/resources/
│   │   └── application.yml      # Configuration
│   └── pom.xml                  # Dependencies
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   ├── pages/               # Page components
    │   ├── api/                 # API client
    │   ├── App.jsx              # Main app
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. **Clone and navigate**
```bash
cd Mental_Health/backend
```

2. **Install dependencies**
```bash
mvn clean install
```

3. **Configure MongoDB**
   - Create `.env` file or set environment variables:
   ```
   MONGO_USER=your_user
   MONGO_PASSWORD=your_password
   MONGO_CLUSTER=your_cluster
   MONGO_DB=mental_health
   JWT_SECRET=your_super_secret_key_minimum_32_characters
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

4. **Run the backend**
```bash
mvn spring-boot:run
```
The backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd Mental_Health/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Mood
- `POST /api/mood` - Add mood entry
- `GET /api/mood` - Get all mood entries
- `GET /api/mood/{id}` - Get specific mood entry
- `PUT /api/mood/{id}` - Update mood entry
- `DELETE /api/mood/{id}` - Delete mood entry
- `GET /api/mood/range?startDate=&endDate=` - Get moods by date range

### Journal
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get all journal entries
- `GET /api/journal/{id}` - Get specific journal entry
- `PUT /api/journal/{id}` - Update journal entry
- `DELETE /api/journal/{id}` - Delete journal entry

### Habits
- `POST /api/habits` - Log habit
- `GET /api/habits` - Get all habits
- `GET /api/habits/{id}` - Get specific habit
- `PUT /api/habits/{id}` - Update habit
- `DELETE /api/habits/{id}` - Delete habit
- `GET /api/habits/type/{habitType}` - Get habits by type
- `GET /api/habits/range?startDate=&endDate=` - Get habits by date range

### Reminders
- `POST /api/reminders` - Create reminder
- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/{id}` - Get specific reminder
- `PUT /api/reminders/{id}` - Update reminder
- `DELETE /api/reminders/{id}` - Delete reminder

### Analytics
- `GET /api/analytics/weekly` - Weekly mood statistics
- `GET /api/analytics/trends?startDate=&endDate=` - Mood trends
- `GET /api/analytics/habit-correlation` - Habit correlation analysis
- `GET /api/analytics/triggers` - Mood triggers
- `GET /api/analytics/dashboard` - Complete dashboard data

## 🔐 Security

- **JWT Authentication**: Stateless authentication with expiring tokens
- **Password Hashing**: BCrypt for secure password storage
- **CORS Configuration**: Configured for development (customize for production)
- **Input Validation**: Hibernate Validator with custom exception handling
- **Exception Handling**: Global exception handler with security context

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create account** on render.com
2. **Connect your GitHub repo**
3. **Create new Web Service**
4. **Configure environment variables**:
   - `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_CLUSTER`, `MONGO_DB`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
5. **Build command**: `mvn clean install`
6. **Start command**: `java -jar target/mental-health-app-1.0.0.jar`

### Frontend Deployment (Netlify/Vercel)

#### Netlify
1. **Connect GitHub repo**
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables**: `VITE_API_URL=your_backend_url`

#### Vercel
1. **Connect GitHub repo**
2. **Framework preset**: Vite
3. **Deploy** (automatic)

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update `.env` or environment variables

## 🤖 AI Integration

### Current Implementation
The application includes rule-based AI for:
- Sentiment analysis
- Emotion detection
- Recommendation generation
- Journaling prompts

### OpenAI Integration (Optional)
To upgrade to OpenAI API:
1. Get API key from openai.com
2. Set `OPENAI_API_KEY` environment variable
3. Modify `AiService.java` to use OpenAI for more advanced NLP

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (USER/ADMIN),
  enabled: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### MoodEntry Collection
```javascript
{
  _id: ObjectId,
  userId: String (reference to User),
  moodScore: Number (1-10),
  emotion: String,
  intensity: String (low/medium/high),
  trigger: String (optional),
  notes: String (optional),
  entryDate: Date,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### JournalEntry Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  content: String,
  moodScoreAtTime: Number,
  detectedSentiment: String,
  sentimentScore: Double (-1 to 1),
  detectedEmotions: [String],
  suggestedPrompts: [String],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### HabitLog Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  habitType: String,
  value: Number,
  unit: String (hours/minutes/glasses/pills/etc),
  notes: String (optional),
  logDate: Date,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Reminder Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  message: String,
  reminderType: String,
  recurring: Boolean,
  recurrencePattern: String (DAILY/WEEKLY/MONTHLY),
  scheduledTime: DateTime,
  sent: Boolean,
  sentAt: DateTime (optional),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## 🧪 Testing the API

### Using cURL

**Register**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&username=testuser&firstName=Test&lastName=User&password=password123"
```

**Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Add Mood Entry**
```bash
curl -X POST http://localhost:8080/api/mood \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moodScore": 7,
    "emotion": "happy",
    "intensity": "high",
    "trigger": "good day at work",
    "notes": "Great day!"
  }'
```

## 📝 Best Practices

### Code Organization
- ✅ Clean layered architecture (Controller → Service → Repository → Model)
- ✅ DTOs for API communication
- ✅ Centralized exception handling
- ✅ Comprehensive logging
- ✅ Input validation with annotations

### Security
- ✅ JWT for stateless authentication
- ✅ BCrypt for password hashing
- ✅ CORS configuration
- ✅ Authorization checks at service level

### Frontend
- ✅ React Hooks for state management
- ✅ Custom hooks for API calls
- ✅ Component-based architecture
- ✅ Responsive Tailwind CSS design
- ✅ Error handling and loading states

## 🐛 Troubleshooting

### "Connection refused" on backend startup
- Ensure MongoDB is running and accessible
- Check connection string in `application.yml`
- Verify credentials and IP whitelist on MongoDB Atlas

### CORS errors
- Frontend and backend must have matching CORS configuration
- Check `SecurityConfig.java` for allowed origins

### JWT token invalid
- Ensure `JWT_SECRET` is set and consistent
- Check token expiration time
- Verify Bearer token format in Authorization header

### Reminders not triggering
- Ensure backend scheduler is enabled (@EnableScheduling)
- Check reminder time is not in the past
- Monitor logs for scheduler execution

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Video call with therapist integration
- [ ] Community features
- [ ] Advanced AI using GPT-4
- [ ] Social sharing with privacy controls
- [ ] Integration with fitness trackers
- [ ] Voice journaling support
- [ ] Export data as PDF reports
- [ ] Dark mode UI
- [ ] Multi-language support

---

**Built with ❤️ for mental health awareness**
