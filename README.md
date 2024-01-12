<h1 align="center"><b>open-music-api</b></h1>

This repo is final project of learning course 'Belajar Fundamental Aplikasi Back-End' at Dicoding.\
Access the class: https://www.dicoding.com/academies/271

## Tech Stack

| Technologies       | Version           |
| ------------------ | ----------------- |
| NodeJs (NPM)       | v18.17.1 (v9.6.7) |
| PostgreSQL         | v14.10            |

## Used Packages

| Dependencies   | Packages           |
| -------------- | ------------------ |
| Framework      | hapiJS             |
| JWT            | hapiJWT            |
| Env Config     | dotenv             |
| Validation     | joi                |
| Bind Methods   | auto-bind          |
| Hashing        | bcrypt             |
| ID generator   | nanoid             |
| Migration      | node-pg-migrate    |
| DB Connection  | node-postgres (pg) |
| Standarization | eslint: standartJS |
| Hotreload      | nodemon            |

## Code Structure

```
├── migrations/                       // load migrations for database.
├── src/
│ ├── api/                            // load folders that is Hapi plugin.
│ │ ├── albums/                       // albums plugin. url/albums.
│ │ ├── authentications/              // authentications plugin. url/authentications.
│ │ ├── collaborations/               // collaborations plugin. url/collaborations.
│ │ ├── playlists/                    // playlists plugin. url/playlists.
│ │ ├── songs/                        // songs plugin. url/songs.
│ │ └── users/                        // users plugin. url/users.
│ ├── exceptions/                     // custom error exception.
│ ├── responses/                      // load APIs responses.
│ ├── services/                       // load whole functions that used for write, fetch, change, or delete a resource. (CRUD operation in resource)
│ │ └── postgres/
│ ├── tokens/                         // manage tokenizations.
│ ├── utils/                          // mapping object of models structure.
│ ├── validator/                      // validate inputted data payload.
│ │ ├── albums/
│ │ ├── authentications/
│ │ ├── collaborations/
│ │ ├── playlists/
│ │ ├── songs/
│ │ └── users/
│ ├── event-extensions.js             // handle server event extensions.
│ ├── plugins.js                      // handle server plugin APIs.
│ └── server.js                       // load the code for create, configure, and run HTTP server using Hapi, registration will happen in here.
└── package.json
```

## Run

1. Clone this repository
2. Run `npm install`
3. Create `.env` file then write the lines of code as shown in the `.env.example` file and adjust with your PostgreSQL configuration
4. Run `npm run migrate up`
5. Run `npm run start:prod` for production mode or `npm run start:dev` for development mode with nodemon

## Automatic Testing

Automatic Testing with Newman or import collection and environment API Test files into Postman. The Open Music API Test files has been shared from **Dicoding** in submission instruction page, The files name are:
- `Open Music API V2 Test.postman_collection.json`
- `OpenMusic API Test.postman_environment.json`

Using Newman:
1. Install newman globally with `npm install newman --g`
2. create folder `postman/v2` and save postman files inside of it.
3. Run `newman run postman/v2/'Open Music API V2 Test.postman_collection.json' --environment postman/v2/'OpenMusic API Test.postman_environment.json'`
4. Then make sure all tests were passed

## Entity Relational Database

The ERD is little bit different than ERD reference in submission guidance. 

![ERD](/docs/erd/openmusicV2_ERD.jpg)

## Adds-on

Using responses for return all responses from APIs. Here's the example:

```js
const postSuccess = { status: 'success', code: 201 }

const requestSuccessResponse = (h, message, data) => {
  const response = h.response({
    status: requestSuccess.status,
    message,
    data
  })

  response.code(requestSuccess.code)
  return response
}
```