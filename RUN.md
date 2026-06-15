# How to Run SkillBridge

Follow these steps **in order**.

## Quick start

1. Copy local DB config (first time only):
   ```powershell
   copy skillbridge-backend\src\main\resources\application-local.properties.example skillbridge-backend\src\main\resources\application-local.properties
   ```
   Edit `application-local.properties` with your MySQL password (or PostgreSQL if preferred).

2. Double-click **`start-backend.bat`** then **`start-frontend.bat`**

3. Open http://localhost:4200

**Database Profiles:**
- **MySQL (default):** For local development — runs by default
- **PostgreSQL:** For production — set `SPRING_PROFILES_ACTIVE=postgres`
- **H2 (in-memory):** For testing — `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev`

**See [DATABASE_PROFILES.md](skillbridge-backend/DATABASE_PROFILES.md) for detailed multi-database setup.**

**VS Code:** Run task `SkillBridge: Run All` from Terminal → Run Task

---

## Step 1: Database Setup

### Using MySQL (Local Development - Default)

1. Start **MySQL** (XAMPP, WAMP, or MySQL Workbench service).
2. Copy the example file:
   ```powershell
   copy skillbridge-backend\src\main\resources\application-local.properties.example skillbridge-backend\src\main\resources\application-local.properties
   ```
3. Edit `application-local.properties` with your MySQL password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.datasource.url=jdbc:mysql://localhost:3306/skillbridge_db
   ```
4. (Optional) Create database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   If you skip this, Spring Boot will auto-create tables on first run.

### Using PostgreSQL (Production/Testing)

1. Start **PostgreSQL** service.
2. Create database and user:
   ```sql
   CREATE ROLE skillbridge WITH LOGIN PASSWORD 'your_password';
   CREATE DATABASE skillbridge_db OWNER skillbridge;
   ```
3. Update `application-local.properties`:
   ```properties
   spring.profiles.active=postgres
   spring.datasource.username=skillbridge
   spring.datasource.password=your_password
   spring.datasource.url=jdbc:postgresql://localhost:5432/skillbridge_db
   ```
4. Run the backend with PostgreSQL profile:
   ```powershell
   $env:SPRING_PROFILES_ACTIVE="postgres"
   cd skillbridge-backend
   .\mvnw.cmd spring-boot:run
   ```

## Step 2: Start Backend (port 8080)

**Option A – Double-click:**
```
start-backend.bat
```

**Option B – Terminal (MySQL):**
```powershell
cd skillbridge-backend
.\mvnw.cmd spring-boot:run
```

**Option B – Terminal (PostgreSQL):**
```powershell
$env:SPRING_PROFILES_ACTIVE="postgres"
cd skillbridge-backend
.\mvnw.cmd spring-boot:run
```

Wait until you see: `Started SkillBridgeApplication`

Backend URL: http://localhost:8080/api

## Step 3: Start Frontend (port 4200)

**New terminal window:**

**Option A – Double-click:**
```
start-frontend.bat
```

**Option B – Terminal:**
```powershell
npm install
npm start
```

Open: http://localhost:4200

## Step 4: Login

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | admin@skillbridge.com | Admin@123  |

Or click **Register** to create a new account.

---

## Switching Databases

### From PowerShell (Windows):
```powershell
# Use MySQL (default)
$env:SPRING_PROFILES_ACTIVE="mysql"
cd skillbridge-backend
.\mvnw.cmd spring-boot:run

# Use PostgreSQL
$env:SPRING_PROFILES_ACTIVE="postgres"
cd skillbridge-backend
.\mvnw.cmd spring-boot:run
```

### From Command Prompt (Windows):
```batch
# Use PostgreSQL
set SPRING_PROFILES_ACTIVE=postgres
cd skillbridge-backend
mvnw.cmd spring-boot:run
```

### From Bash/Linux:
```bash
export SPRING_PROFILES_ACTIVE=postgres
cd skillbridge-backend
./mvnw spring-boot:run
```

---

## Common Problems

| Problem | Fix |
|---------|-----|
| `mvn` not recognized | Use `mvnw.cmd` or `start-backend.bat` (no Maven install needed) |
| MySQL connection failed | Start MySQL service; fix password in `application-local.properties` |
| PostgreSQL connection failed | Verify PostgreSQL is running and credentials are correct |
| Port 8080 in use | Stop other apps on 8080 or change `server.port` in properties |
| Blank page / API errors | Start **backend first**, then frontend |
| Login fails | Backend must be running at http://localhost:8080/api |
| Wrong database profile active | Check `SPRING_PROFILES_ACTIVE` environment variable or `application.properties` |

## Run from IDE (VS Code / IntelliJ)

1. Open `skillbridge-backend` as Java project.
2. Run `SkillBridgeApplication.java` main method.
3. In another terminal: `npm start` from project root.

**Note:** To select a specific database profile in your IDE, set the `SPRING_PROFILES_ACTIVE` environment variable in your run configuration.
