# Vacation Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Submit a Vacation Request

Endpoint: `POST /vacations`

Description: Submit a new vacation request for a user.

Request Body:
```json
{
  "user_id": 1,
  "start_date": "2025-11-01",
  "end_date": "2025-11-05",
  "reason": "Family vacation" // optional
}
```

Validation Rules:
- `user_id` is required and must exist in the database
- `start_date` is required and cannot be in the past
- `end_date` is required
- `start_date` must be before or equal to `end_date`
- `reason` is optional

Success Response (201 Created):
```json
{
  "id": 1,
  "user_id": 1,
  "start_date": "2025-11-01",
  "end_date": "2025-11-05",
  "reason": "Family vacation",
  "status": "pending",
  "comments": null,
  "created_at": "2025-10-17 10:00:00",
  "updated_at": "2025-10-17 10:00:00",
  "user_name": "Avi Cohen",
  "user_role": "requester"
}
```

Error Responses:
- `400 Bad Request` - Validation failed
  ```json
  {
    "error": "Validation failed",
    "errors": ["start_date is required", "end_date cannot be before start_date"]
  }
  ```
- `404 Not Found` - User not found
  ```json
  {
    "error": "User not found"
  }
  ```
- `500 Internal Server Error` - Server error

---

### 2. Retrieve Vacation Requests

Endpoint: `GET /vacations`

Description: Retrieve all vacation requests or filter by requester.

Query Parameters:
- `user_id` (optional) - Filter requests by specific user ID (for requesters to see only their requests)

Examples:
- Get all requests (for validators): `GET /vacations`
- Get requests for specific user: `GET /vacations?user_id=1`

Success Response (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "start_date": "2025-11-01",
    "end_date": "2025-11-05",
    "reason": "Family vacation",
    "status": "approved",
    "comments": null,
    "created_at": "2025-10-17 10:00:00",
    "updated_at": "2025-10-17 10:30:00",
    "user_name": "Avi Cohen",
    "user_role": "requester"
  },
  {
    "id": 2,
    "user_id": 2,
    "start_date": "2025-12-20",
    "end_date": "2025-12-31",
    "reason": "Holiday break",
    "status": "pending",
    "comments": null,
    "created_at": "2025-10-17 11:00:00",
    "updated_at": "2025-10-17 11:00:00",
    "user_name": "Anat Levy",
    "user_role": "requester"
  }
]
```

Error Response:
- `500 Internal Server Error` - Server error

---

### 3. Approve a Vacation Request

Endpoint: `PATCH /vacations/:id/approve`

Description: Approve a vacation request with optional comments.

Request Body:
```json
{
  "comments": "Approved for the requested dates" // optional
}
```

Success Response (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "start_date": "2025-11-01",
  "end_date": "2025-11-05",
  "reason": "Family vacation",
  "status": "approved",
  "comments": "Approved for the requested dates",
  "created_at": "2025-10-17 10:00:00",
  "updated_at": "2025-10-17 10:30:00",
  "user_name": "Avi Cohen",
  "user_role": "requester"
}
```

Error Responses:
- `404 Not Found` - Vacation request not found
- `500 Internal Server Error` - Server error

---

### 4. Reject a Vacation Request

Endpoint: `PATCH /vacations/:id/reject`

Description: Reject a vacation request with optional comments explaining the reason.

Request Body:
```json
{
  "comments": "Insufficient coverage during this period" // optional
}
```

Validation Rules:
- `comments` is optional

Success Response (200 OK):
```json
{
  "id": 3,
  "user_id": 3,
  "start_date": "2025-10-10",
  "end_date": "2025-10-12",
  "reason": "Personal time off",
  "status": "rejected",
  "comments": "Insufficient coverage during this period",
  "created_at": "2025-10-17 09:00:00",
  "updated_at": "2025-10-17 10:45:00",
  "user_name": "Bob Green",
  "user_role": "requester"
}
```

Error Responses:
- `404 Not Found` - Vacation request not found
- `500 Internal Server Error` - Server error

---

## Users Endpoints

### Get All Users

Endpoint: `GET /users`

Description: Retrieve all users in the system.

Success Response (200 OK):
```json
[
  {
    "id": 1,
    "name": "Avi Cohen",
    "role": "requester",
    "created_at": "2025-10-17 06:00:00",
    "updated_at": "2025-10-17 06:00:00"
  },
  {
    "id": 4,
    "name": "Daniel HR",
    "role": "validator",
    "created_at": "2025-10-17 06:00:00",
    "updated_at": "2025-10-17 06:00:00"
  }
]
```

### Get Users by Role

Endpoint: `GET /users/role/:role`

Description: Retrieve users filtered by role.

Parameters:
- `role` - Either `requester` or `validator`

Example: `GET /users/role/requester`

Success Response (200 OK):
```json
[
  {
    "id": 1,
    "name": "Avi Cohen",
    "role": "requester",
    "created_at": "2025-10-17 06:00:00",
    "updated_at": "2025-10-17 06:00:00"
  }
]
```

---

## RESTful Principles Applied

1. Resource-Based URLs: Endpoints are organized around resources (`/vacations`, `/users`)
2. HTTP Methods: Proper use of GET, POST, PUT, PATCH, DELETE
3. Status Codes: Appropriate HTTP status codes (200, 201, 400, 404, 500)
5. JSON Format: All requests and responses use JSON
6. Validation: Input validation with clear error messages
7. Error Handling: Consistent error response format

## Error Response Format

All errors follow this format:
```json
{
  "error": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"], // optional array for validation errors
  "message": "Technical error message" // optional for 500 errors
}
```
