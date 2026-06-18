# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build with environment variables
ARG REACT_APP_API_GATEWAY_URL=http://localhost:8080
ARG REACT_APP_KEYCLOAK_URL=http://localhost:8180
ARG REACT_APP_KEYCLOAK_REALM=library-realm
ARG REACT_APP_KEYCLOAK_CLIENT_ID=library-frontend

ENV REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL
ENV REACT_APP_KEYCLOAK_URL=$REACT_APP_KEYCLOAK_URL
ENV REACT_APP_KEYCLOAK_REALM=$REACT_APP_KEYCLOAK_REALM
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$REACT_APP_KEYCLOAK_CLIENT_ID

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
