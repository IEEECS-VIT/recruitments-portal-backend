# IEEE_Registrations_Page_Backend

Certainly! Below are the documentation for each of the provided routes:

### Check User

- **Description**: This endpoint checks if a user exists based on their email.
- **URL**: `/check_user`
- **Method**: POST
- **Authentication Required**: No
- **Request Body**:
  - `email` (string): Email of the user to check.
- **Response**:
  - Found (200 OK):
    ```json
    {
        "message": "Found!",
        "accessToken": "Generated access token"
    }
    ```
  - Not Found (404 Not Found):
    ```json
    {
        "message": "Not Found!"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "DB Error!"
    }
    ```

### Get Domains

- **Description**: This endpoint retrieves domains associated with a given email.
- **URL**: `/get_domains/:email`
- **Method**: GET
- **Authentication Required**: Yes
- **Parameters**:
  - `email` (string): Email of the user.
- **Response**:
  - Success (200 OK): Array of domains.
  - Not Found (404 Not Found):
    ```json
    {
        "message": "Details not found for the provided email"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "An error occurred while fetching details"
    }
    ```

### Put Domains

- **Description**: This endpoint updates domains associated with a given email.
- **URL**: `/put_domains/:email`
- **Method**: PUT
- **Authentication Required**: Yes
- **Parameters**:
  - `email` (string): Email of the user.
- **Request Body**:
  - `Domains` (object): Updated domains information.
- **Response**:
  - Success (200 OK): Updated detail object.
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "Internal Server Error"
    }
    ```

### Profile

- **Description**: This endpoint retrieves profile details for a given email.
- **URL**: `/profile/:email`
- **Method**: GET
- **Authentication Required**: Yes
- **Parameters**:
  - `email` (string): Email of the user.
- **Response**:
  - Success (200 OK): Profile details object.
  - Not Found (404 Not Found):
    ```json
    {
        "message": "User not found"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "An error occurred while fetching details"
    }
    ```

### Question

- **Description**: This endpoint retrieves questions for a given domain and email.
- **URL**: `/question/:domain/:email`
- **Method**: POST
- **Authentication Required**: Yes
- **Parameters**:
  - `domain` (string): Domain associated with the questions.
  - `email` (string): Email of the user.
- **Response**:
  - Success (200 OK): Array of questions.
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "An error occurred while fetching questions"
    }
    ```

### Set Report

- **Description**: This endpoint sets evaluation reports for a given email.
- **URL**: `/eval/set_report`
- **Method**: POST
- **Authentication Required**: Yes
- **Request Body**:
  - `result` (string): Evaluation result.
  - `email` (string): Email of the user.
  - `round` (string): Round of evaluation.
- **Response**:
  - Success (200 OK):
    ```json
    {
        "message": "Round details updated successfully",
        "updatedDetail": "Updated detail object"
    }
    ```
  - Not Found (404 Not Found):
    ```json
    {
        "message": "User not found"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "Internal Server Error"
    }
    ```

### Submit Response

- **Description**: This endpoint allows users to submit their responses for evaluation.
- **URL**: `/response/submit`
- **Method**: PATCH
- **Authentication Required**: Yes
- **Request Body**:
  - `email` (string): Email of the user submitting the response.
  - `domain` (string): Domain associated with the response.
  - `questions` (array): Array of questions and their corresponding answers.
    Example
    ```json
    {
    "email": email,
    "domain": domain,
    "questions": [
        {
            "q": "What is your fav?",
            "ans": "India"
        },
        {
            "q": "What is your favorite food?",
            "ans": "Pizza"
        }
    ]
}
    ```
    
- **Response**:
  - Success (200 OK):
    ```json
    {
        "message": "Response recorded successfully"
    }
    ```
  - Not Found (404 Not Found):
    ```json
    {
        "message": "Response not found"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "Error message"
    }
    ```

### Get Response Time

- **Description**: This endpoint retrieves the end time of the response associated with the provided domain and email.
- **URL**: `/response/get_time/:domain/:email`
- **Method**: GET
- **Authentication Required**: No
- **Parameters**:
  - `domain` (string): Domain associated with the response.
  - `email` (string): Email of the user.
- **Response**:
  - Success (200 OK):
    ```json
    {
        "time": "End time of the response"
    }
    ```
  - Not Found (404 Not Found):
    ```json
    {
        "error": "Time not found"
    }
    ```
  - Server Error (500 Internal Server Error):
    ```json
    {
        "error": "Internal Server Error"
    }
    ```

### Get User Responses

- **Description**: This endpoint retrieves all responses associated with the provided email.
- **URL**: `/response/:email`
- **Method**: GET
- **Authentication Required**: Yes
- **Parameters**:
  - `email` (string): Email of the user.
- **Response**:
  - Success (200 OK): Array of response documents.
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "Error message"
    }
    ```

### Domain

- **Description**: This endpoint retrieves documents from a MongoDB collection based on the provided domain name.
- **URL**: `/:domain`
- **Method**: GET
- **Authentication Required**: No
- **Parameters**:
  - `domain` (string): Domain name.
- **Response**:
  - Success (200 OK): Array of documents.
  - Server Error (500 Internal Server Error):
    ```json
    {
        "message": "Error message"
    }
    ```

These are the documentations for each API route defined in the provided configuration.
