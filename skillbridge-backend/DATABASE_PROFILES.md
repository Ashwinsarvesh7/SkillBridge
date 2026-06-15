# Multi-Database Setup: MySQL & PostgreSQL

## Overview
SkillBridge Backend now supports both **MySQL** (for local development) and **PostgreSQL** (for production deployment) using Spring Profiles. The application can seamlessly switch between databases without changing business logic.

## Architecture
- **Database-agnostic code**: All business logic and repositories work with both databases
- **Profile-specific configuration**: Database connection and dialect settings are managed through Spring Profiles
- **Environment-based activation**: Profiles are selected via the `SPRING_PROFILES_ACTIVE` environment variable or `spring.profiles.active` property

## Database Profiles

### MySQL Profile (`mysql`)
**Use case**: Local development  
**Default**: Yes (active by default)  
**Configuration file**: `application-mysql.properties`

**Settings**:
- **Driver**: MySQL Connector/J
- **Dialect**: `org.hibernate.dialect.MySQLDialect`
- **DDL Mode**: `update` (automatically creates/updates schema)
- **Default URL**: `jdbc:mysql://localhost:3306/skillbridge`
- **Connection Pool**: 5-10 connections

### PostgreSQL Profile (`postgres`)
**Use case**: Production deployment  
**Configuration file**: `application-postgres.properties`

**Settings**:
- **Driver**: PostgreSQL JDBC Driver
- **Dialect**: `org.hibernate.dialect.PostgreSQLDialect`
- **DDL Mode**: `validate` (requires schema to exist)
- **Default URL**: `jdbc:postgresql://localhost:5432/skillbridge`
- **Connection Pool**: 10-20 connections
- **Optimizations**: Batch processing enabled

## Switching Between Databases

### Method 1: Environment Variable (Recommended for Production)
Set the `SPRING_PROFILES_ACTIVE` environment variable before starting the application:

```bash
# Use MySQL (local development)
set SPRING_PROFILES_ACTIVE=mysql
./mvnw.cmd spring-boot:run

# Use PostgreSQL (production)
export SPRING_PROFILES_ACTIVE=postgres
./mvnw spring-boot:run
```

### Method 2: Application Properties File
Edit `application.properties` or `application-local.properties`:

```properties
# Use MySQL (default)
spring.profiles.active=mysql

# Or use PostgreSQL
spring.profiles.active=postgres
```

### Method 3: Command Line
Pass the profile directly when running:

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=postgres"
```

### Method 4: Docker/Container Deployment
Set as environment variable in your deployment configuration:

```dockerfile
ENV SPRING_PROFILES_ACTIVE=postgres
```

## Local Development Setup

### MySQL (Default)

1. Ensure MySQL 8.0+ is running:
   ```bash
   mysql --version
   ```

2. Create the database:
   ```sql
   CREATE DATABASE skillbridge_db;
   ```

3. Copy the example config to local:
   ```bash
   cp application-local.properties.example application-local.properties
   ```

4. Update `application-local.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   spring.datasource.url=jdbc:mysql://localhost:3306/skillbridge_db
   ```

5. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### PostgreSQL (Local Testing)

1. Ensure PostgreSQL 12+ is installed and running:
   ```bash
   psql --version
   ```

2. Create the database and user:
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

4. Run migrations/schema setup (if using Flyway/Liquibase in future):
   ```bash
   ./mvnw flyway:migrate -Dspring.profiles.active=postgres
   ```

5. Run the application:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=postgres"
   ```

## Environment Variables

The application respects these environment variables:

```bash
# Database Profile Selection
SPRING_PROFILES_ACTIVE=mysql|postgres

# Database Connection (overrides defaults in profile config)
DB_URL=jdbc:mysql://hostname:3306/dbname
DB_USERNAME=username
MYSQL_PASSWORD=password          # for MySQL profile
POSTGRES_PASSWORD=password       # for PostgreSQL profile

# JWT Configuration
JWT_SECRET=your-secret-key

# Mail Configuration (optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Database Schema Management

### For MySQL (Development)
- Hibernate DDL: `update` mode
- Schema automatically created/updated on application startup
- Suitable for rapid development iteration

### For PostgreSQL (Production)
- Hibernate DDL: `validate` mode
- Schema MUST exist before application startup
- Safer for production (prevents accidental schema changes)
- Use database migration tools (Flyway, Liquibase) for schema versioning

### Future Migration Path
1. Set up Flyway or Liquibase for version-controlled migrations
2. Create migration scripts compatible with both MySQL and PostgreSQL
3. Run migrations before application startup
4. Switch PostgreSQL from `validate` to `validate` mode

## Code Changes Not Required

✅ **These remain unchanged**:
- Entity definitions (`@Entity`, `@Column`, etc.)
- Repository interfaces (`JpaRepository`, custom queries)
- Service layer business logic
- Controller endpoints
- All other application code

✅ **Database-specific code is isolated**:
- Connection configuration (in profile files)
- Dialect selection (in profile files)
- Connection pooling (in profile files)

## Testing

### Test MySQL Profile
```bash
set SPRING_PROFILES_ACTIVE=mysql
mvnw test
```

### Test PostgreSQL Profile
```bash
set SPRING_PROFILES_ACTIVE=postgres
mvnw test
```

## Troubleshooting

### Issue: "No database profile active"
**Solution**: Ensure `SPRING_PROFILES_ACTIVE` is set or check `application.properties` has `spring.profiles.active=mysql` as default.

### Issue: "Hibernate dialect not recognized"
**Solution**: Verify the correct profile is active. Check logs for: `The following profiles are active: mysql|postgres`

### Issue: PostgreSQL connection fails locally
**Solution**: Verify PostgreSQL is running:
```bash
psql -U skillbridge -d skillbridge_db -c "SELECT version();"
```

### Issue: MySQL connection times out
**Solution**: Check MySQL is running and accessible:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

## Performance Notes

- **MySQL**: Better for development with schema auto-updates
- **PostgreSQL**: Better for production with batch processing and connection optimization
- **Connection pooling**: Configurable per profile (HikariCP)
- **Query optimization**: Hibernate automatically uses database-specific optimizations

## Next Steps

1. **Database Migrations**: Implement Flyway/Liquibase for schema versioning
2. **Docker Compose**: Add PostgreSQL service to local development Docker Compose
3. **CI/CD**: Configure pipeline to test both profiles
4. **Monitoring**: Add database connection monitoring per profile
