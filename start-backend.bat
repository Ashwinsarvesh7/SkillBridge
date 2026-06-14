@echo off
echo Starting SkillBridge Backend...
cd /d "%~dp0skillbridge-backend"

if not exist ".mvn\wrapper\maven-wrapper.jar" (
  echo Downloading Maven Wrapper...
  mkdir ".mvn\wrapper" 2>nul
  powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '.mvn\wrapper\maven-wrapper.jar'"
)

echo.
echo Make sure MySQL is running and password in application.properties matches your MySQL root password.
echo Default config: username=root, password=root
echo.
echo Using MySQL (configure password in application-local.properties)
echo For H2 dev mode without MySQL: mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
echo.
call mvnw.cmd spring-boot:run
pause
