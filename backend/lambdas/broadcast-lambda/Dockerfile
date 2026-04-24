FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM public.ecr.aws/lambda/java:21

RUN microdnf install -y unzip
COPY --from=build /app/target/*-bin.zip /tmp/bundle.zip
RUN unzip /tmp/bundle.zip -d ${LAMBDA_TASK_ROOT} && rm /tmp/bundle.zip

CMD ["com.artcorner.erp.LambdaHandler::handleRequest"]
