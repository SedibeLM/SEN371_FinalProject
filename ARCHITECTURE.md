# CampusLearn - System Architecture

## Overview
CampusLearn is a Learning Management System (LMS) designed to facilitate online learning through topic management, material sharing, and student-tutor interactions.

## Technology Stack

### Frontend
- **Framework**: React.js (v18+)
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: CSS Modules
- **Type System**: TypeScript

### Backend
- **Language**: Java
- **Build Tool**: Maven/Gradle (to be determined)
- **Persistence**: JPA/Hibernate (based on service classes)

## System Components

### 1. Frontend Structure
```
src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── layouts/       # Layout components
├── utils/         # Utility functions
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

### 2. Backend Services

#### Core Domain Models
- **Topic**: Represents learning topics with status (OPEN/CLOSED)
- **Material**: Handles course materials with file information
- **Subscription**: Manages student-course relationships
- **Thread/Message**: Handles discussions (implied by requirements)
- **User**: Base class for Students, Tutors, and Admins

#### Service Layer
- **TopicService**: Manages topic lifecycle
- **MaterialService**: Handles file uploads and validations
- **SubscriptionService**: Manages course enrollments
- **MessageService**: Handles forum discussions

## Data Flow

1. **Authentication Flow**:
   - User logs in via `/auth/login`
   - JWT token issued for subsequent requests
   - Role-based access control (STUDENT, TUTOR, ADMIN)

2. **Topic Management**:
   - Tutors create/manage topics
   - Students view available topics
   - Topics can be OPEN or CLOSED

3. **Material Management**:
   - File uploads (≤20MB)
   - Type validation
   - Access control based on subscription

4. **Subscription System**:
   - Students subscribe to topics
   - Prevents duplicate subscriptions
   - Manages access to materials and discussions

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Topics
- `GET /api/topics` - List all topics
- `POST /api/topics` - Create new topic
- `GET /api/topics/{id}` - Get topic details
- `PUT /api/topics/{id}` - Update topic
- `DELETE /api/topics/{id}` - Delete topic

### Materials
- `POST /api/topics/{id}/materials` - Upload material
- `GET /api/topics/{id}/materials` - List materials for topic

### Subscriptions
- `POST /api/topics/{id}/subscribe` - Subscribe to topic
- `DELETE /api/topics/{id}/subscribe` - Unsubscribe from topic

## Dependencies

### Frontend
- react
- react-dom
- react-router-dom
- vite
- @vitejs/plugin-react

### Backend
- Spring Boot (implied by service classes)
- Spring Security
- JPA/Hibernate
- JWT for authentication

## Environment Variables

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENV=development
```

### Backend
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campuslearn
spring.datasource.username=user
spring.datasource.password=pass
jwt.secret=your-secret-key
```

## Future Considerations
- Implement real-time updates with WebSockets
- Add file storage service (S3 compatible)
- Implement search functionality
- Add analytics dashboard

## Deployment Architecture

### Development
- Frontend: Vite dev server
- Backend: Spring Boot embedded server
- Database: Local PostgreSQL

### Production
- Frontend: Static files served via Nginx
- Backend: Containerized Spring Boot app
- Database: Managed PostgreSQL service
- Caching: Redis for session management
- Storage: S3-compatible storage for uploads

## Security Considerations
- All API endpoints secured with JWT
- File type validation on upload
- Input sanitization
- Role-based access control
- Rate limiting on authentication endpoints
