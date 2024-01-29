<h1 align="center"><b>open-music-api</b></h1>

This repo is final project of learning course 'Belajar Fundamental Aplikasi Back-End' at Dicoding.\
Access the class: https://www.dicoding.com/academies/271

## Tech Stack

| Technologies       | Version           |
| ------------------ | ----------------- |
| NodeJs (NPM)       | v18.17.1 (v9.6.7) |
| PostgreSQL         | v14.10            |

## Used Packages

| Dependencies        | Packages           |
| ------------------- | ------------------ |
| Framework           | hapiJS             |
| JWT                 | hapiJWT            |
| Static File Handler | hapiInert          |
| Message Broker      | amqlib             |
| Env Config          | dotenv             |
| Validation          | joi                |
| Bind Methods        | auto-bind          |
| Hashing             | bcrypt             |
| ID generator        | nanoid             |
| Migration           | node-pg-migrate    |
| DB Connection       | node-postgres (pg) |
| Standarization      | eslint: standartJS |
| Hotreload           | nodemon            |
| Cache               | redis              |

## Code Structure

```
├── config/                           // apps configuration.
├── docs/
├── migrations/                       // load migrations for database.
├── src/
│ ├── api/                            // load folders that is Hapi plugin.
│ │ ├── albums/                       // albums plugin. url/albums.
│ │ ├── authentications/              // authentications plugin. url/authentications.
│ │ ├── collaborations/               // collaborations plugin. url/collaborations.
│ │ ├── exports/                      // exports plugin. url/exports.
│ │ ├── playlists/                    // playlists plugin. url/playlists.
│ │ ├── songs/                        // songs plugin. url/songs.
│ │ ├── uploads/                      // uploads plugin. url/uploads.
│ │ └── users/                        // users plugin. url/users.
│ ├── exceptions/                     // custom error exception.
│ ├── responses/                      // load APIs responses.
│ ├── services/                       // load whole functions that used for write, fetch, change, or delete a resource. (CRUD operation in resource)
│ │ ├── postgres/
│ │ ├── rabbitmq/
│ │ ├── redis/
│ │ └── storage/
│ ├── token/                         // manage tokenizations.
│ ├── utils/                          // mapping object of models structure.
│ ├── validator/                      // validate inputted data payload.
│ │ ├── albums/
│ │ ├── authentications/
│ │ ├── collaborations/
│ │ ├── exports/
│ │ ├── playlists/
│ │ ├── songs/
│ │ ├── uploads/
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
- `Open Music API V3 Test.postman_collection.json`
- `OpenMusic API Test.postman_environment.json`

Using Newman:
1. Install newman globally with `npm install newman --g`
2. create folder `postman/v3` and save postman files inside of it.
3. Run `newman run postman/v3/'Open Music API V3 Test.postman_collection.json' --environment postman/v3/'OpenMusic API Test.postman_environment.json'`
4. Then make sure all tests were passed

## Entity Relational Database

The ERD is little bit different than ERD reference in submission guidance. 

![ERD](/docs/erd/openmusicV3_ERD.jpg)

## Adds-on

Using responses for return all responses from APIs. Here's the example:

```js
const success = {
  status: 'success',
  post: { code: 201 },
  request: { code: 200 }
}

const postSuccessResponse = (h, { message = undefined, data = undefined }) => {
  const response = h.response({
    status: success.status,
    message,
    data
  })

  response.code(success.post.code)
  return response
}
```

There is a Open Music API Queue Consumer repository:\
link: https://github.com/syauqialzaa/open-music-api-queue-consumer

To run it, `npm install` then `npm run start:prod`.