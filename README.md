# Restful-Booker REST API Automation Suite

[![REST API Automation CI](https://github.com/anzarali/restful-booker-api-suite/actions/workflows/api-ci.yml/badge.svg)](https://github.com/anzarali/restful-booker-api-suite/actions)
![Postman](https://img.shields.io/badge/Postman-v10-orange)
![Newman](https://img.shields.io/badge/Newman-v6.2-blue)
![Reporter](https://img.shields.io/badge/Reporter-htmlextra-green)
![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen)
![License](https://img.shields.io/badge/License-MIT-purple)

A production-grade, beginner-friendly **REST API Test Automation Suite** built for the [Restful-Booker](https://restful-booker.herokuapp.com/) hotel reservation API. 

This project demonstrates the complete **CRUD (Create, Read, Update, Delete)** testing lifecycle, dynamic auth token generation, environment variable chaining, negative status code assertions, and visual HTML report generation.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    A["01. POST /auth\n(Generate Auth Token)"] -->|Saves {{token}}| B["02. POST /booking\n(Create Hotel Booking)"]
    B -->|Saves {{bookingId}}| C["03. GET /booking/{{bookingId}}\n(Verify Guest Details)"]
    C --> D["04. PUT /booking/{{bookingId}}\n(Full Update with Token)"]
    D --> E["05. PATCH /booking/{{bookingId}}\n(Partial Update with Token)"]
    E --> F["06. DELETE /booking/{{bookingId}}\n(Delete with Token -> 201 Created)"]
    F --> G["07. Negative Test: GET /booking/{{bookingId}}\n(Asserts 404 Not Found)"]
    G --> H["08. Negative Test: DELETE /booking/1\n(Invalid Token -> Asserts 403 Forbidden)"]
```

---

## 📋 Test Coverage Matrix

| # | Request | Method | Endpoint | Key Assertions |
| :- | :--- | :--- | :--- | :--- |
| **01** | **Generate Auth Token** | `POST` | `/auth` | Status `200 OK`, extracts `token`, sets `{{token}}` variable |
| **02** | **Create Booking** | `POST` | `/booking` | Status `200 OK`, verifies guest name "Anzar Ali", sets `{{bookingId}}` |
| **03** | **Get Booking by ID** | `GET` | `/booking/{{bookingId}}` | Status `200 OK`, verifies name, price ($250), dates |
| **04** | **Full Update** | `PUT` | `/booking/{{bookingId}}` | Status `200 OK`, verifies updated price ($350) & checkout date |
| **05** | **Partial Update** | `PATCH` | `/booking/{{bookingId}}` | Status `200 OK`, verifies updated additional needs |
| **06** | **Delete Booking** | `DELETE` | `/booking/{{bookingId}}` | Status `201 Created` (deletion confirmed) |
| **07** | **Negative: Deleted Resource** | `GET` | `/booking/{{bookingId}}` | Status `404 Not Found` (proves data was removed) |
| **08** | **Negative: Unauthorized** | `DELETE` | `/booking/1` | Status `403 Forbidden` (proves unauthorized access is blocked) |

---

## 📁 Repository Structure

```
restful-booker-api-suite/
├── .github/
│   └── workflows/
│       └── api-ci.yml                      # CI/CD workflow executing tests on PRs
├── postman/
│   ├── RestfulBooker_Collection.json       # Complete Postman Collection with assertions
│   └── RestfulBooker_Environment.json      # Dynamic environment variables
├── reports/
│   └── api-execution-report.html           # Interactive HTML Extra visual dashboard
├── tests/
│   └── api-runner.js                       # Standalone Node.js JavaScript test runner
├── API_TEST_CASES.md                       # Structured manual/automation test case spec
├── package.json                            # Automation runner scripts
└── README.md
```

---

## 🚀 How to Run the Tests

### Option A: Command Line (Newman CLI)
```bash
# 1. Install dependencies
npm install

# 2. Run tests in terminal (CLI reporter)
npm test

# 3. Run tests and generate interactive HTML dashboard
npm run test:report
```
*The HTML report will be generated at `reports/api-execution-report.html`!*

### Option B: Standalone JavaScript Runner
```bash
# Run tests directly using pure Node.js (no Newman required)
npm run test:code
```

### Option C: In Postman Desktop App
1. Open the **Postman** application.
2. Click **Import** (top left).
3. Drag and drop both files from the `postman/` directory:
   * `postman/RestfulBooker_Collection.json`
   * `postman/RestfulBooker_Environment.json`
4. Select the environment `RestfulBooker_Environment` in the top right dropdown.
5. Click on the collection name &rarr; Click **Run collection** &rarr; Click **Run RestfulBooker_CRUD_Suite**.

---

## 📊 Visual HTML Report (htmlextra)
Running `npm run test:report` automatically creates a visual report with:
* Summary bar with passed/failed counts.
* Request headers, URLs, and payloads.
* Response body formatting and exact assertion results.


