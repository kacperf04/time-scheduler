# Time-Scheduler (in development)

## Overview
Time-Scheduler is a modern, full-stack web application designed to streamline the process of managing employee schedules and tracking availability. Built with a clean, user-friendly interface and a robust backend, the platform allows users to log in, view interactive weekly calendars, and seamlessly input their working availability.

The project was developed to provide a seamless, type-safe scheduling experience, utilizing a decoupled architecture that separates a dynamic React frontend from a high-performance Python backend.

## Key Features

* **Interactive Weekly Calendar:** A highly visual, component-based weekly calendar (`WeeklyCalendar`) that allows users to easily view schedules, navigate between weeks, and manage time slots.
* **Employee Availability Tracking:** Dedicated modules for employees to input, update, and track their available working hours.
* **Secure User Authentication:** Full authentication flow (Register/Login) protected by JWT (JSON Web Tokens) and bcrypt password hashing.
* **Personalized Dashboard:** A central hub for authenticated users to manage their profiles and view their upcoming schedules.
* **Responsive Modern UI:** Designed with Tailwind CSS v4 and Lucide React icons to ensure a clean, mobile-first, and accessible user experience.

## Architecture & Technology

The application is built using a modern, scalable tech stack, split into clearly defined services:

**Frontend (Client)**
* **Next.js (App Router) & React 19:** Powers the user interface, providing fast rendering and an optimized routing experience.
* **TypeScript:** Ensures type safety and highly predictable code behavior across components and API integrations.
* **Tailwind CSS:** Used for rapid, utility-first styling.

**Backend (API)**
* **FastAPI:** A lightning-fast, modern Python framework that handles business logic, API endpoints, and data validation (via Pydantic).
* **SQLAlchemy & Alembic:** Manages the relational database models (Employees, Availabilities) and tracks database migrations.
* **PostgreSQL:** A powerful, open-source relational database used to store user, schedule, and availability data.

**Infrastructure**
* **Docker & Docker Compose:** The PostgreSQL database is containerized.

## What's next?
- [ ] Advanced Scheduling Solvers: Integrating automated scheduling algorithms to handle complex constraints, including Constraint Programming (CP), Graph algorithms (Max Flow/Min Cut), and Evolutionary Heuristics.
- [ ] Developing a master benchmarking suite that will compare outputs and choose the best one.
