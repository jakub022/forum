FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY forum-backend/pom.xml .
COPY forum-backend/src ./src

COPY forum-backend/mvnw .
COPY forum-backend/.mvn ./.mvn

RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk
VOLUME /tmp

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT [ "java", "-jar", "/app.jar" ]
EXPOSE 8080