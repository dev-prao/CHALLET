FROM amazoncorretto:21

ARG JAR_FILE=build/libs/ChalletDiscovery-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8761

ENTRYPOINT ["java","-jar","/app.jar"]
