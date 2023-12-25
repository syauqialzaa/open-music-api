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
| Env Config     | dotenv             |
| Validation     | joi                |
| Bind Methods   | auto-bind          |
| ID generator   | nanoid             |
| Migration      | node-pg-migrate    |
| DB Connection  | node-postgres (pg) |
| Standarization | eslint: standartJS |
| Hotreload      | nodemon            |

## Code Structure

```
├── src/
│ ├── api/                            // load folders that is Hapi plugin.
│ │ ├── albums/                       // albums plugin. url/albums.
│ │ └── songs/                        // songs plugin. url/songs
│ ├── exceptions/                     // custom error exception.
│ ├── services/                       // load whole functions that used for write, fetch, change, or delete a resource. (CRUD operation in resource)
│ │ └── postgres/
│ ├── utils/                          // mapping object of models structure.
│ ├── validator/                      // validate inputted data payload.
│ │ ├── albums/
│ │ └── songs/
│ ├── extensions.js                   // handle server event extensions.
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
- `Open Music API V1 Test.postman_collection.json`
- `OpenMusic API Test.postman_environment.json`

Using Newman:
1. Install newman globally with `npm install newman --g`
2. Run `newman run 'Open Music API V1 Test.postman_collection.json' --environment 'OpenMusic API Test.postman_environment.json'`
3. Then make sure all tests were passed