# API Test Specification & Test Cases

**Project:** Restful-Booker REST API Automation Suite  
**Target Base URL:** `https://restful-booker.herokuapp.com`  
**Authentication Type:** Cookie-based Token Auth (`token=<JWT_TOKEN>`)  
**Format:** JSON  

---

## Test Execution Matrix

| Test ID | Test Scenario | HTTP Method | Endpoint | Headers | Request Body | Expected Status | Expected Response & Validations | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-API-01** | Ping / Health Check | `GET` | `/ping` | None | None | `201 Created` | Server status verified healthy | P1 |
| **TC-API-02** | Generate Auth Token | `POST` | `/auth` | `Content-Type: application/json` | `{"username":"admin", "password":"password123"}` | `200 OK` | `token` string received and saved to environment | P1 |
| **TC-API-03** | Create New Booking | `POST` | `/booking` | `Content-Type: application/json`, `Accept: application/json` | Valid guest JSON payload | `200 OK` | `bookingid` generated as number, guest name matches "Anzar Ali" | P1 |
| **TC-API-04** | Get Booking Details by ID | `GET` | `/booking/:id` | `Accept: application/json` | None | `200 OK` | Response details match created booking (`depositpaid: true`, etc.) | P1 |
| **TC-API-05** | Full Booking Update | `PUT` | `/booking/:id` | `Content-Type: application/json`, `Cookie: token={{token}}` | Full updated JSON payload | `200 OK` | Updated price (`350`) and checkout date (`2026-10-25`) confirmed | P1 |
| **TC-API-06** | Partial Booking Update | `PATCH` | `/booking/:id` | `Content-Type: application/json`, `Cookie: token={{token}}` | `{"additionalneeds": "VIP Lounge & Airport Transfer"}` | `200 OK` | Only `additionalneeds` field updated; other fields unchanged | P2 |
| **TC-API-07** | Delete Booking with Auth | `DELETE` | `/booking/:id` | `Cookie: token={{token}}` | None | `201 Created` | Resource deleted from database | P1 |
| **TC-API-08** | Negative: Fetch Deleted Booking | `GET` | `/booking/:id` | `Accept: application/json` | None | `404 Not Found` | Verifies that deleted resource is no longer accessible | P1 |
| **TC-API-09** | Negative: Unauthorized Deletion | `DELETE` | `/booking/1` | `Cookie: token=invalid_token` | None | `403 Forbidden` | Server blocks deletion without valid authentication token | P2 |

---

## Environment Variables Mapping

| Variable | Scope | Purpose | Example Value |
| :--- | :--- | :--- | :--- |
| `baseUrl` | Environment | Target API host URL | `https://restful-booker.herokuapp.com` |
| `token` | Environment (Dynamic) | Session token generated from `POST /auth` | `7a12b3c4d5e6` |
| `bookingId` | Environment (Dynamic) | Generated ID from `POST /booking` | `2734` |
