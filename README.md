#  Pantry Manager

## Overview  
Pantry Manager is a web application that helps users keep track of their pantry items. Users can add food items to their pantry, categorize them, and view expiration dates. The system automatically sorts items by expiration date, ensuring that users can quickly see which foods are expiring soonest.

## Features  
- **Add Items** – Easily add food items with details such as name, quantity, expiration date, category, and storage location.  
- **Track Expiration Dates** – See what items are expiring next
- **Delete Items** – Remove items that are used up or no longer needed.  
- **Edit Items** – Update food details like name, quantity, or expiration date.  

## Tech Stack  
- **Frontend:** JavaScript, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  




| Method | Endpoint        | Description                        | Request Body | Response |
|--------|---------------|------------------------------------|--------------|----------|
| GET    | `/foods`      | Retrieves all foods, sorted by expiration date. | None | JSON array of foods. |
| GET    | `/foods/:id`  | Retrieves a single food item by ID. | None | JSON object of the food item. |
| DELETE | `/foods/:id`  | Deletes a food item by ID. | None | `200 OK` if deleted, `404 Not Found` if item doesn't exist. |
| POST   | `/foods`      | Adds a new food item. | `{ name, quantity, expiration, category, storageLocation }` | `201 Created` if successful, `422 Unprocessable Entity` for validation errors. |
| PUT    | `/foods/:id`  | Updates a food item by ID. | `{ name, quantity, expiration, category, storageLocation }` | `200 OK` if updated, `404 Not Found` if item doesn't exist, `422 Unprocessable Entity` for validation errors. |
