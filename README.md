# CoopTrack — Cooperative Management System

## 1. Project Overview

**CoopTrack** is a web-based cooperative management system developed using Java, Javalin, SQLite, HTML, CSS, and JavaScript.

The system helps a cooperative manage its members, tasks, contributions, support records, and invitation keys through a web interface backed by a REST API.

The project demonstrates Object-Oriented Programming (OOP) concepts, including encapsulation, inheritance, abstraction, and polymorphism, together with database operations and RESTful web services.

## 2. Objectives

The main objectives of CoopTrack are to:

- Register and manage cooperative members.
- Create, view, and update tasks.
- Record and view member contributions.
- Record and view support entries.
- Generate and validate invitation keys.
- Store application records in an SQLite database.
- Demonstrate OOP principles in a practical application.
- Provide a web interface for interacting with the system.

## 3. Technologies Used

| Technology     | Purpose                                    |
| -------------- | ------------------------------------------ |
| Java 26        | Backend application and OOP implementation |
| Maven          | Dependency management and project building |
| Javalin 7.2.4  | HTTP server and REST API                   |
| SQLite         | Persistent database storage                |
| SQLite JDBC    | Communication between Java and SQLite      |
| HTML           | Web page structure                         |
| CSS            | Website styling                            |
| JavaScript     | Frontend interaction and API requests      |
| Git and GitHub | Version control and source code hosting    |

## 4. Main Features

### Member Management

- Register cooperative members.
- Retrieve member records.
- Store member information, including names and email addresses.

### Task Management

- Create and retrieve tasks.
- Assign tasks to members.
- Update existing tasks.
- Track task progress and deadlines.

### Contribution Management

- Record member contributions.
- Retrieve contribution records.
- Store descriptions and monetary amounts.

### Support Management

- Record support entries.
- Retrieve support records.
- Store descriptions and amounts.

### Invitation Key Management

- Generate invitation keys.
- Retrieve invitation records.
- Validate invitation keys.
- Reject invalid or previously used keys.

### Data Persistence

CoopTrack uses SQLite to store application data so that records can remain available between application sessions. The database is stored in `data/cooptrack.db`.

**Important:** Keep the existing database file. Do not delete or recreate it when updating the application.

## 5. Object-Oriented Design

The project uses six main domain classes.

### 5.1 Member

Represents a cooperative member.

Responsibilities:

- Store member information such as ID, name, and email.
- Provide methods for accessing and updating member information.
- Define whether a member can manage tasks.

### 5.2 Admin

Represents an administrator and extends the `Member` class.

Responsibilities:

- Inherit common member properties and behaviour.
- Override `canManageTasks()` to allow task management.
- Manage collections of members, tasks, records, and invitation keys.

**OOP concept:** Inheritance and method overriding.

### 5.3 Task

Represents a task assigned within the cooperative.

Responsibilities:

- Store task details, including title, assignee, deadline, work days, and progress.
- Provide methods to access and update task information.
- Validate that the number of work days is not negative.

### 5.4 Record (Abstract Class)

Defines the common structure for cooperative records.

Responsibilities:

- Store shared record information, such as ID, member, type, description, amount, and creation date.
- Define abstract methods for record summaries and record types.
- Validate monetary amounts.

**OOP concept:** Abstraction through an abstract class.

### 5.5 ContributionRecord

Represents a contribution made by a cooperative member.

Responsibilities:

- Extend the abstract `Record` class.
- Identify the record as a contribution.
- Provide a contribution-specific summary.

**OOP concept:** Inheritance and polymorphism.

### 5.6 SupportRecord

Represents a support record associated with a cooperative member.

Responsibilities:

- Extend the abstract `Record` class.
- Identify the record as a support entry.
- Provide a support-specific summary.

**OOP concept:** Inheritance and polymorphism.

### Class Hierarchy

```text
                 Member
                   |
              +----+----+
              |         |
            Admin    (other members)

              Record (abstract)
                 |
          +------+------+
          |             |
 ContributionRecord  SupportRecord

                 Task
```

`Admin` inherits from `Member`, while `ContributionRecord` and `SupportRecord` inherit from `Record`. `Task` is a separate domain class.

### Exception Handling

The project also includes `InvalidKeyException`, a checked exception used when an invitation key is invalid or cannot be found.

This exception is an additional supporting class, not one of the six main domain classes.

## 6. Project Structure

```text
CoopTrack/
├── data/
│   └── cooptrack.db
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── cooptrack/
│       │           ├── Main.java
│       │           ├── Member.java
│       │           ├── Admin.java
│       │           ├── Task.java
│       │           ├── Record.java
│       │           ├── ContributionRecord.java
│       │           ├── SupportRecord.java
│       │           └── InvalidKeyException.java
│       └── resources/
│           └── public/
│               ├── index.html
│               ├── css/
│               │   └── style.css
│               └── js/
│                   └── app.js
├── pom.xml
├── .gitignore
└── README.md
```

The `target/` directory is generated by Maven during the build and does not need to be committed to GitHub.

## 7. Requirements Before Running

Install the following:

- Java Development Kit (JDK) 26.
- Apache Maven.
- Git (optional, for cloning and version control).
- A modern web browser.
- Visual Studio Code or another Java-compatible IDE.

Verify the Java and Maven installations:

```cmd
java -version
mvn -version
```

## 8. Installation and Setup

### Step 1: Obtain the Project

Clone the repository:

```cmd
git clone https://github.com/Leonard27-coder/Coop-Track-cooperative-.git
cd Coop-Track-cooperative-
```

Alternatively, open the existing project folder in VS Code.

### Step 2: Build the Project

Run:

```cmd
mvn clean package
```

Maven downloads the required dependencies, compiles the Java source files, and packages the application.

A successful build displays:

```text
BUILD SUCCESS
```

### Step 3: Start the Application

Run:

```cmd
mvn exec:java
```

The application starts its Javalin web server on port `7070`.

### Step 4: Open the Website

Visit:

http://localhost:7070/

### Step 5: Check the Backend

Open:

http://localhost:7070/api/health

Expected response:

```json
{
  "status": "ok",
  "application": "CoopTrack"
}
```

Keep the terminal running while using the application.

**Note:** If port `7070` is already in use, another instance of the application may be running. Check the existing server before attempting to start another instance.

## 9. REST API Endpoints

The backend exposes the following API endpoints.

| Method | Endpoint                    | Purpose                     |
| ------ | --------------------------- | --------------------------- |
| GET    | `/api/health`               | Check application health    |
| GET    | `/api/members`              | Retrieve members            |
| POST   | `/api/members`              | Register a member           |
| GET    | `/api/tasks`                | Retrieve tasks              |
| POST   | `/api/tasks`                | Create a task               |
| PUT    | `/api/tasks/{id}`           | Update a task               |
| GET    | `/api/contributions`        | Retrieve contributions      |
| POST   | `/api/contributions`        | Record a contribution       |
| GET    | `/api/support`              | Retrieve support records    |
| POST   | `/api/support`              | Create a support record     |
| GET    | `/api/invitations`          | Retrieve invitation records |
| POST   | `/api/invitations`          | Generate an invitation key  |
| POST   | `/api/invitations/validate` | Validate an invitation key  |

The API uses JSON for request and response data where applicable. Invalid requests can return an HTTP error response with a JSON message.

### Example: Health Check

Request:

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "application": "CoopTrack"
}
```

### Example: Create a Member

Request:

```http
POST /api/members
Content-Type: application/json
```

Example request body:

```json
{
  "name": "Example Member",
  "email": "member@example.com"
}
```

The server processes the request and stores the member if the supplied information is valid.

### Example: Create a Task

Request:

```http
POST /api/tasks
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Prepare monthly report",
  "assignee": "Example Member",
  "deadline": "2026-11-15",
  "workDays": 5
}
```

The actual accepted fields and validation rules are determined by the backend implementation.

## 10. Validation and Error Handling

CoopTrack includes validation to improve data quality and application reliability.

Examples include:

- Required text fields must not be empty.
- Monetary amounts must not be negative or non-finite.
- Task work days must not be negative.
- Invalid invitation keys are rejected.
- Previously used invitation keys cannot be accepted again.
- API errors are returned to the client as HTTP error responses where applicable.

## 11. Database

CoopTrack uses SQLite for persistent storage.

Database location:

```text
data/cooptrack.db
```

The database contains the records needed by the application's management features.

Do not delete the database file when rebuilding the project. Maven's `clean` command removes the generated `target/` directory, not the separate `data/` directory.

## 12. Version Control

The project is maintained using Git and hosted on GitHub.

Repository:

https://github.com/Leonard27-coder/Coop-Track-cooperative-

To inspect the current Git status:

```cmd
git status
```

To save future changes:

```cmd
git add README.md
git commit -m "Add project documentation"
git push origin main
```

Review the files before staging changes, and avoid committing local database files, generated build output, or temporary backup files.

## 13. Future Improvements

Potential future enhancements include:

- Role-based authentication and authorization.
- Improved reporting and summary dashboards.
- Search and filtering for members and tasks.
- More comprehensive automated tests.
- Better validation feedback in the frontend.
- Task expiry and invitation-key expiry, if required by the project specification.

These are possible future enhancements and are not necessarily implemented in the current version.

## 14. Conclusion

CoopTrack demonstrates how Java OOP principles can be applied to a practical cooperative management application. By combining a web frontend, a REST API, SQLite persistence, validation, and a structured class hierarchy, the project provides a foundation for managing cooperative activities and demonstrates practical software development skills.
