FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM public.ecr.aws/lambda/java:21

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=build /app/target/erp-0.0.1-SNAPSHOT.jar ${LAMBDA_TASK_ROOT}/lib/app.jar

CMD ["com.artcorner.erp.LambdaHandler::handleRequest"]
