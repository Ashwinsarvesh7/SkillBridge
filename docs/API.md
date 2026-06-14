# SkillBridge API Documentation

Base URL: `http://localhost:8080/api`

All authenticated endpoints require header: `Authorization: Bearer <token>`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |

### Register Body
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "experienceLevel": "BEGINNER"
}
```

### Login Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "email": "...", "firstName": "...", "role": "USER" }
  }
}
```

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update profile |
| POST | `/users/me/photo` | Upload profile photo (multipart) |
| POST | `/users/me/skills` | Add skill |
| DELETE | `/users/me/skills/{id}` | Remove skill |
| GET | `/users/{id}` | Get user by ID |
| GET | `/users/search?skill=&category=&experienceLevel=` | Search users |
| GET | `/users/matches` | Get recommended skill matches |

## Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | List all skills |
| GET | `/skills/search?q=` | Search skills |
| GET | `/skills/categories` | List categories |

## Exchanges

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/exchanges` | Create exchange request |
| GET | `/exchanges` | Get all user exchanges |
| GET | `/exchanges/active` | Get active exchanges |
| PATCH | `/exchanges/{id}/respond` | Accept/reject `{"status":"ACCEPTED"}` |
| PATCH | `/exchanges/{id}/complete` | Mark complete |
| PATCH | `/exchanges/{id}/cancel` | Cancel request |

## Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Submit review |
| GET | `/reviews/user/{userId}` | Get user reviews |

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard data (matches, stats, notifications) |

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/{id}/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all read |

## Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/{otherUserId}` | Get conversation |
| POST | `/chat/send` | Send message |

### WebSocket
- Endpoint: `ws://localhost:8080/api/ws`
- Subscribe: `/user/{email}/queue/messages`
- Send: `/app/chat.send`

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports` | Report a user |

## Admin (ROLE_ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| PATCH | `/admin/users/{id}/disable` | Disable user |
| PATCH | `/admin/users/{id}/enable` | Enable user |
| GET | `/admin/reports` | Open reports |
| PATCH | `/admin/reports/{id}` | Resolve `{"status":"RESOLVED"}` |
| GET | `/admin/analytics` | Platform analytics |

## Default Admin Account
- Email: `admin@skillbridge.com`
- Password: `Admin@123`
