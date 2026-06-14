# How to Run SkillBridge

Follow these steps **in order**.

## Quick start

1. Copy local DB config (first time only):
   ```powershell
   copy skillbridge-backend\src\main\resources\application-local.properties.example skillbridge-backend\src\main\resources\application-local.properties
   ```
   Edit `application-local.properties` with your MySQL password.

2. Double-click **`start-backend.bat`** then **`start-frontend.bat`**

3. Open http://localhost:4200

**H2 mode (no MySQL):** `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev`

**VS Code:** Run task `SkillBridge: Run All` from Terminal → Run Task

---

## Step 1: MySQL (optional — for production-like setup)

1. Start **MySQL** (XAMPP, WAMP, or MySQL Workbench service).
2. Open `skillbridge-backend/src/main/resources/application.properties`.
3. Set your MySQL password in **one** of these ways:

   **Option A** – Edit `skillbridge-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   (XAMPP default is often an **empty** password: `spring.datasource.password=`)

   **Option B** – Copy the example file:
   ```powershell
   copy skillbridge-backend\src\main\resources\application-local.properties.example skillbridge-backend\src\main\resources\application-local.properties
   ```
   Then edit `application-local.properties` with your password.
4. (Optional) Create database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   If you skip this, Spring Boot will auto-create tables on first run.

## Step 2: Start Backend (port 8080)

**Option A – Double-click:**
```
start-backend.bat
```

**Option B – Terminal:**
```powershell
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

## Common Problems

| Problem | Fix |
|---------|-----|
| `mvn` not recognized | Use `mvnw.cmd` or `start-backend.bat` (no Maven install needed) |
| MySQL connection failed | Start MySQL service; fix password in `application.properties` |
| Port 8080 in use | Stop other apps on 8080 or change `server.port` in properties |
| Blank page / API errors | Start **backend first**, then frontend |
| Login fails | Backend must be running at http://localhost:8080/api |

## Run from IDE (VS Code / IntelliJ)

1. Open `skillbridge-backend` as Java project.
2. Run `SkillBridgeApplication.java` main method.
3. In another terminal: `npm start` from project root.
