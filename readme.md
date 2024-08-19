# FantaLOL Server

## API Server Routes

-   **`/auth`**: authentication routes
    -   **POST `/register`**  
        **Request** sent by client
        ```
        {"email": "example@email.com", "password": "12345", "username": "batman"}
        ```
        **Response** by the server
        ```
        {"msg": "User registered", "email": "example@email.com", "username": "batman"}
        ```

### Authentication APIs

-   **POST `/api/login`**: Authenticate and login the user.

    -   **Request**: JSON object with _username_ equal to email:
        ```
        { "username": "a@p.it", "password": "password" }
        ```
    -   **Response body**: JSON object with the student's info and, if the user has a study plan, studyPlan; or a description of the errors:
        ```
        { "email": "a@p.it", "name": "Luigi Verdi",
          "fullTime": false,
          "studyPlan": [ "01OTWOV", "01URSPD", "01NYHOV", "01TYMOV", "01SQJOV" ] }
        ```
    -   Codes: `200 OK`, `401 Unauthorized` (incorrect email and/or password), `400 Bad Request` (invalid request body), `500 Internal Server Error`.

-   **DELETE `/api/session`**: Logout the user.

    -   Codes: `200 OK`, `401 Unauthorized`.

-   **GET `/api/current-user`**: Get info on the logged in user.
    -   Codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`.
    -   **Response body**: JSON object with the same info as in login:
        ```
        { "email": "a@p.it", "name": "Luigi Verdi",
          "fullTime": false,
          "studyPlan": [ "01OTWOV", "01URSPD", "01NYHOV", "01TYMOV", "01SQJOV" ] }
        ```

## API Server2

-   **POST `/api/stats`** : Returns the average percentage for the requested courses.
    -   **Request Headers**: JWT token with fullTime flag
    -   **Request**: JSON object with a list of course codes
        ```
        { "courses": [ "01NYHOV", "01OTWOV" ] }
        ```
    -   **Response body**: EJSON object with the percentage
        ```
        { "successRate": 10.0216 }
        ```
    -   Codes: `200 OK`, `401 Unauthorized`, `400 Bad Request` (invalid request body).

## Database Tables

-   Table `users`: _user_id_, _email_, _hash_, _salt_, _good_client_  
    _good_client_ : good customers have a reduced production time (0: not good customer, 1: good customer)
-   Table `cars`: _car_id_, _kw_, _price_, _max_accessories_  
    _max_accessories_: maximum number of accessories that can be selected for the car
-   Table `accessories`: _accessory_id_, _name_, _price_, _availability_, _requires_  
    _requires_: id of the accessory required to select it
-   Table `configuration`: _user_id_, _car_id_, _accessory_id_  
    Table to save the configuration of the authenticated user. A row of this table means that the accessory of the selected car model is in the configuration

## Users Credentials

| email                      | password | name           | career type |
| -------------------------- | -------- | -------------- | ----------- |
| s123456@studenti.polito.it | password | Mario Rossi    | full-time   |
| a@p.it                     | password | Luigi Verdi    | part-time   |
| b@p.it                     | password | Maria Bianchi  | part-time   |
| c@p.it                     | password | Francesca Neri | full-time   |
| d@p.it                     | password | John Doe       | none        |
