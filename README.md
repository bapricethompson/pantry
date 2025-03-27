#  Pantry Manager

## Overview  
Pantry Manager is a web application that helps users keep track of their pantry items. Users can add food items to their pantry, categorize them, and view expiration dates. The system automatically sorts items by expiration date, ensuring that users can quickly see which foods are expiring soonest.

## Demo
[Watch this video](https://www.youtube.com/watch?v=6nT1EFvGOcc)

## Features  
- **Add Items** – Easily add food items with details such as name, quantity, expiration date, category, and storage location.  
- **Track Expiration Dates** – See what items are expiring next
- **Delete Items** – Remove items that are used up or no longer needed.  
- **Edit Items** – Update food details like name, quantity, or expiration date.  
- **Login/Accoutn Creation** – Create an account or login to see your pantry.  

## Tech Stack  
- **Frontend:** JavaScript, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  

## Deployed Application
[Click here to visit the site](https://s25-authentication-bapricethompson.onrender.com)


| Method | Endpoint        | Description                        | Request Body | Response |
|--------|---------------|------------------------------------|--------------|----------|
| GET    | `/foods`      | Retrieves all foods, sorted by expiration date. | None | JSON array of foods. |
| GET    | `/foods/:id`  | Retrieves a single food item by ID. | None | JSON object of the food item. |
| GET  | `/session` | Retrieves the current user session (if authorized) | None | `200` - User object,`401` - Unauthorized |
| DELETE | `/foods/:id`  | Deletes a food item by ID. | None | `200 OK` if deleted, `404 Not Found` if item doesn't exist. |
| DELETE | `/session` | Logs out the user by destroying the session | None | `200` - Successfully logged out |
| POST   | `/foods`      | Adds a new food item. | `{ name, quantity, expiration, category, storageLocation }` | `201 Created` if successful, `422 Unprocessable Entity` for validation errors. |
| POST   | `/users`  | Create a user | `{ email, password }` | `201 Created` if successful, `422 Unprocessable Entity` for validation errors `400` bad request, `422` duplicate email, `500` server error  |
| POST | `/session` | Authenticates a user and creates a session | `{ "email": "user@example.com", "password": "securepassword123" }` | `201` - Session created successfully, `401` - Unauthorized (wrong credentials) |
| PUT    | `/foods/:id`  | Updates a food item by ID. | `{ name, quantity, expiration, category, storageLocation }` | `200 OK` if updated, `404 Not Found` if item doesn't exist, `422 Unprocessable Entity` for validation errors. |
