# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Faster Maven JVM startup inside short-lived build containers
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN --mount=type=cache,target=/root/.m2 \
    chmod +x mvnw && ./mvnw -B -q dependency:go-offline -DskipTests

COPY src src
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -B -q -DskipTests -T 1C package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/reporting-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
