# SkillBridge – Peer-to-Peer Skill Exchange Platform

A production-ready full-stack web application where users exchange skills with each other. Built with **Angular 21**, **Spring Boot 3**, **MySQL**, and **JWT authentication**.

![Tech Stack](https://img.shields.io/badge/Angular-21-red) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-green) ![MySQL](https://img.shields.io/badge/MySQL-8-blue)

## Features

- **Authentication** – Register, login, JWT, password encryption, route guards
- **User Profiles** – Photo, bio, teach/learn skills, experience level, completion progress
- **Skill Matching** – Bidirectional matching (you teach X, want Y → matched with opposite)
- **Exchange Requests** – Send, accept/reject, complete, history
- **Dashboard** – Recommendations, active exchanges, notifications, activity, stats
- **Search & Filter** – By skill, category, experience level
- **Reviews & Ratings** – Post-exchange feedback
- **Admin Panel** – User management, reports, analytics
- **Dark Mode** – Toggle light/dark theme
- **Real-time Chat** – WebSocket messaging
- **Skill Badges** – Bronze/Silver/Gold based on completed exchanges
- **Email Notifications** – Optional SMTP integration

## Project Structure

```
SkillBuilding-Platform/
├── src/                          # Angular frontend
│   └── app/
│       ├── auth/                 # Login & Register
│       ├── dashboard/            # Main dashboard
│       ├── profile/              # User profile
│       ├── search/               # Find users/skills
│       ├── requests/             # Exchange requests
│       ├── chat/                 # Real-time messaging
│       ├── admin/                # Admin panel
│       ├── services/             # API services
│       ├── shared/               # Layout components
│       └── models/               # TypeScript interfaces
├── skillbridge-backend/          # Spring Boot API
│   └── src/main/java/com/skillbridge/
│       ├── controller/           # REST controllers
│       ├── service/              # Business logic
│       ├── repository/           # JPA repositories
│       ├── entity/               # Database entities
│       ├── dto/                  # Data transfer objects
│       ├── security/             # JWT & Spring Security
│       └── config/               # App configuration
├── database/
│   └── schema.sql                # MySQL schema
└── docs/
    └── API.md                    # API documentation
```

## Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.8+
- **MySQL** 8.0+

## Setup Instructions

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

Or let Spring Boot auto-create tables (`spring.jpa.hibernate.ddl-auto=update`).

Update credentials in `skillbridge-backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Backend

```bash
cd skillbridge-backend
mvn spring-boot:run
```

API runs at: `http://localhost:8080/api`

### 3. Frontend

```bash
npm install
ng serve
```

App runs at: `http://localhost:4200`

## Default Accounts

| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | admin@skillbridge.com   | Admin@123  |

## API Documentation

See [docs/API.md](docs/API.md) for full REST API reference.

## Skill Matching Example

| User A        | User B        | Match? |
|---------------|---------------|--------|
| Teaches Java  | Teaches Angular | ✓ |
| Wants Angular | Wants Java    | ✓ |

The system recommends User B to User A when skills complement each other.

## Environment Variables (Optional)

| Variable       | Description        |
|----------------|--------------------|
| `MAIL_USERNAME`| SMTP email username |
| `MAIL_PASSWORD`| SMTP email password |

Set `skillbridge.mail.enabled=true` in `application.properties` to enable emails.

## Build for Production

```bash
# Frontend
ng build --configuration production

# Backend
cd skillbridge-backend
mvn clean package -DskipTests
java -jar target/skillbridge-backend-1.0.0.jar
```

## Interview Highlights

- Layered architecture (Controller → Service → Repository)
- JWT stateless authentication with Spring Security
- Reactive Angular with standalone components & lazy loading
- JPA/Hibernate with proper entity relationships
- WebSocket real-time chat with STOMP
- Global exception handling with consistent API responses
- Profile completion tracking & skill badge gamification

## License

MIT – Built for portfolio and interview showcase.
