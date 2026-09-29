FarAPI — Full-Stack Web Application

A full-stack web application built with FastAPI, React, PostgreSQL, Docker, and Traefik.

This project started from the Full Stack FastAPI Template and has been configured and developed as a personal full-stack application.

🚀 Project Overview

FarAPI is a containerized full-stack application designed with a modern Python backend and React frontend.

The project uses Docker Compose to run the complete local development environment, including the backend API, PostgreSQL database, reverse proxy, email testing, browser testing, and database administration tools.

🛠️ Technology Stack
Backend

FastAPI — Python web framework for the REST API

SQLModel — Database ORM

Pydantic — Data validation and configuration

PostgreSQL — Relational database

JWT authentication

Pytest — Backend testing

Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Playwright — End-to-end testing

Infrastructure & Development

Docker / Docker Compose

Traefik — Reverse proxy

PostgreSQL

Mailpit — Local email testing

Adminer — Database administration

GitHub Actions — CI/CD

🏗️ Architecture
                         Browser
                            │
                            ▼
                        Traefik
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
             React UI              FastAPI
                                       │
                                       ▼
                                  PostgreSQL
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
                         ▼                           ▼
                     Mailpit                    Application Data

🐳 Docker Development Environment

The project uses Docker Compose to run the development environment.

Main services include:

Traefik — Reverse proxy and routing

FastAPI — Backend API

PostgreSQL — Application database

Adminer — Database management

Mailpit — Local email testing

Playwright — End-to-end testing

Start the application

Clone the repository and enter the project directory:

git clone <your-repository-url>
cd FarAPI-Project


Create your local environment file:

cp .env.example .env


Configure the required environment variables and start Docker Compose:

docker compose up -d


Check the running services:

docker compose ps

🔗 Local Development

The development environment provides access to:

Service	URL
Application	http://localhost:8081
FastAPI API	http://localhost:8000
FastAPI Docs	http://localhost:8000/docs
Traefik Dashboard	http://localhost:8090
Adminer	http://localhost:8080
Mailpit	http://localhost:8026
🧪 Testing

Backend tests can be run with:

docker compose exec backend pytest


End-to-end tests use Playwright.



Application
<img width="1917" height="917" alt="Screenshot 2026-09-29 202910" src="https://github.com/user-attachments/assets/f2df56c1-59c1-4e5c-8662-5e7ea7afb48a" />

Dashboard

<img width="1846" height="1052" alt="image" src="https://github.com/user-attachments/assets/a25af052-4fbc-4904-9fdb-d2ec1da2856c" />


API Documentation

<img width="1289" height="1080" alt="image" src="https://github.com/user-attachments/assets/dd734cee-cd80-46a7-b857-9666967f2b29" />


Docker Environment

<img width="1915" height="1022" alt="Screenshot 2026-09-29 203348" src="https://github.com/user-attachments/assets/21325e58-f8ea-46c7-9ea6-4252a3e7ba8b" />


🔐 Environment Variables

Sensitive configuration is stored in environment variables and should not be committed to GitHub.

Create your own .env file using the project's environment configuration and provide the required values for:

Database credentials

Secret key

Administrator credentials

Email configuration

Application configuration

📁 Project Structure
FarAPI-Project/
├── backend/
├── frontend/
├── compose.yml
├── compose.override.yml
├── compose.deploy.yml
├── README.md
├── development.md
└── ...

🎯 What This Project Demonstrates

This project demonstrates practical experience with:

Full-stack application development

REST API development with FastAPI

React and TypeScript frontend development

PostgreSQL database integration

Docker containerization

Multi-service development environments

Reverse proxy configuration with Traefik

API authentication

Automated testing

End-to-end testing with Playwright

Git and GitHub workflow

CI/CD with GitHub Actions

📌 Future Improvements

Potential future improvements include:

Production deployment

Custom domain and HTTPS

Expanded automated test coverage

Monitoring and logging

Improved production infrastructure

Automated deployment through GitHub Actions

📄 License

This project is based on the Full Stack FastAPI Template and retains the applicable MIT license.

See LICENSE for details.
