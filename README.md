## Description

Developed Api's and Testcases (UNIT and e2e)

Developed a set of services and controllers for user creation and user operations within a NestJS application. These operations include creating users, get all users with filters, get user by user id, update and delete user by user id, blocking and unblocking users and retrieving lists of blocked and unblocked users. The project also incorporates MongoDB for data persistence and Redis for caching. The application follows a modular architecture, ensuring a clean separation of concerns and maintainable code

### Key Components

#### User Module and Service:

Implemented CRUD operations (addUser, getAllUsers, getUserById, updateUser, deleteUser).
Validation and sanitization using DTOs, Schemas and class-validator.
Redis caching to handle frequently accessed data. Restricted showcasing sensitive data or unnessesary data like passwords, versions etc.. in api response.

#### Redis Cache Integration:

Integrated Redis using cache-manager and storing username and ensured no duplicate usernames by checking cache and database.
#### UserOperationsService: 
This service handles the core logic for blocking, unblocking, and retrieving users.

blockUser: Adds a user to the blocked users list.
unblockUser: Removes a user from the blocked users list.
getBlockedUsers: Retrieves the list of blocked users.
getUnblockedUsers: Retrieves the list of unblocked users.

## Prerequisites

Node Js, MongoDB, Redis Cache to be installed in mongodb

#### Connected Local Mongodb and Redis cache

If want to change then modify on default.json file in config folder

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev


```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e


```

## API's Developed

## Users Service

#### Add User

http://localhost:3000/api/v1/users (POST)

Payload:- req.body (JSON)  ** Pass date of birth as string in a from of DD-MM-YYYY, It bill be stored in db in Date format.

{
"username": "U101",
"password": "Pass@12345",
"firstname": "qwerty",
"lastname": "qwerty",
"dateofbirth": "14-07-2000"
}

Response:

-> Positive Response :
{
"username": "U101",
"password": "Pass@12345",
"firstname": "qwerty",
"lastname": "qwerty",
"dateofbirth": "2000-07-14T00:00:00.000Z",
"blockedusers": [],
"userid": "6693ca3adc859838e14b52c8",
"createdAt": "2024-07-14T12:53:14.277Z",
"updatedAt": "2024-07-14T12:53:14.277Z"
}

-> Conflit Response:
{
"message": "Username already taken -cache",
"error": "Conflict",
"statusCode": 409
}

#### Get All Users with filters

http://localhost:3000/api/v1/users/?keyword=u&limit=100&page=1&skip=0&minage=0&maxage=2 (GET)

Payload: Query Params

Response :

-> Positive Response - List of user objects

[{
"username": "U10",
"firstname": "userone",
"lastname": "qwerty",
"dateofbirth": "2015-07-12T00:00:00.000Z",
"blockedusers": [],
"userid": "6693881f0fb02e5af7949a55",
"createdAt": "2024-07-14T08:11:11.081Z",
"updatedAt": "2024-07-14T08:11:11.081Z"
}]

#### Get User By userId

http://localhost:3000/api/v1/users/66938f74dc0e82689d6e2ae1 (GET)

Payload: userid in params

Resposne :

-> Positive Response :
{
"username": "U10",
"firstname": "userone",
"lastname": "qwerty",
"dateofbirth": "2015-07-12T00:00:00.000Z",
"blockedusers": [],
"userid": "6693881f0fb02e5af7949a55",
"createdAt": "2024-07-14T08:11:11.081Z",
"updatedAt": "2024-07-14T08:11:11.081Z"
}

-> Conflit Response :
{
"message": "User not found",
"error": "Not Found",
"statusCode": 404
}

#### Update User

http://localhost:3000/api/v1/users/669378788987e11fdf7fbdd9 (PATCH)

Payload : req.body (JSON) & userid in params

{
"password": "Pass@54321",
"firstname": "Naveen",
"lastname": "P",
"dateofbirth": "12-07-2022"
}

Resposne :

-> Positive Response :
{
"username": "naveen1",
"firstname": "Naveen",
"lastname": "P",
"dateofbirth": "2022-07-12T00:00:00.000Z",
"blockedusers": [],
"userid": "669378788987e11fdf7fbdd9",
"createdAt": "2024-07-14T07:04:25.853Z",
"updatedAt": "2024-07-14T07:44:32.438Z"
}

-> Conflit Response :
{
"message": "User not found",
"error": "Not Found",
"statusCode": 404
}

#### Delete User

http://localhost:3000/api/v1/users/669362256d77d26c4f4758af (DELETE)

Payload : userid in params

Response:

-> Positive Response :
{
"username": "naveen12",
"firstname": "Naveen",
"lastname": "P",
"dateofbirth": "2023-07-12T00:00:00.000Z",
"blockedusers": [],
"userid": "669362256d77d26c4f4758af",
"createdAt": "2024-07-14T05:29:09.628Z",
"updatedAt": "2024-07-14T05:29:09.628Z"
}

-> Conflit Response :
{
"message": "User not found",
"error": "Not Found",
"statusCode": 404
}

## Users Operations (Block or Unblock other users)

#### Block User

http://localhost:3000/api/v1/userOperations/blockUser (POST)

Payload:- req.body (JSON)

{
"userId":"669387990fb02e5af7949a31",
"blockUserId":"669388100fb02e5af7949a51"
}

Response:

-> Positive Response :
{
"acknowledged": true,
"modifiedCount": 1,
"upsertedId": null,
"upsertedCount": 0,
"matchedCount": 1
}

-> Conflit Response:
{
"message": "Username already taken -cache",
"error": "Conflict",
"statusCode": 409
}

#### Unblock User

http://localhost:3000/api/v1/userOperations/unblockUser (POST)

Payload:- req.body (JSON)

{
"userId":"669387990fb02e5af7949a3",
"unblockUserId":"669388100fb02e5af7949a5"
}

Response:

-> Positive Response :
{
"acknowledged": true,
"modifiedCount": 1,
"upsertedId": null,
"upsertedCount": 0,
"matchedCount": 1
}

-> Conflit Response:
{
"message": "You cant block or unblock yourself",
"error": "Conflict",
"statusCode": 409
}

#### Get All Blocked Users

http://localhost:3000/api/v1/userOperations/669387990fb02e5af7949a31/blocked (GET)

Payload:- user id in params

Response:

-> Positive Response : List of Blocked users

[
{
"username": "U2",
"firstname": "userone",
"lastname": "qwerty",
"dateofbirth": "2023-07-12T00:00:00.000Z",
"userid": "669387a80fb02e5af7949a35"
}
]

-> Conflit Response:
{
"message": "User not found",
"error": "Not Found",
"statusCode": 404
}

#### Get All Un-blocked Users

http://localhost:3000/api/v1/userOperations/669387990fb02e5af7949a31/unblocked (GET)

Payload:- user id in params

Response:

-> Positive Response : List of Un-Blocked users

[
{
"username": "U2",
"firstname": "userone",
"lastname": "qwerty",
"dateofbirth": "2023-07-12T00:00:00.000Z",
"userid": "669387a80fb02e5af7949a35"
}
]

-> Conflit Response:
{
"message": "User not found",
"error": "Not Found",
"statusCode": 404
}

### Responses may vary from payload to payload. 