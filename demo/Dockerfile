# Java 17 
FROM eclipse-temurin:17-jdk

# jar파일
COPY build/libs/demo-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]