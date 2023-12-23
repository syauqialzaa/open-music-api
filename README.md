<h1 align="center"><b>open-music-api</b></h1>

This repo is final project of learning course 'Belajar Fundamental Aplikasi Back-End' at Dicoding.\
Access the class: https://www.dicoding.com/academies/271

## Tech Stack

| Technologies       | Version           |
| ------------------ | ----------------- |
| NodeJs (NPM)       | v18.17.1 (v9.6.7) |
| PostgreSQL         | v14.10            |

## Used Libraries

| Dependencies   | Libraries          |
| -------------- | ------------------ |
| Framework      | hapiJS             |
| Env Config     | dotenv             |
| Validation     | joi                |
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
│ └── server.js                       // load the code for create, configure, and run HTTP server using Hapi, registration will happen in here.
└── package.json
```

## Run

1. Clone this repository
2. Run `npm install`
3. Create `.env` file then write the lines of code as shown in the `.env.example` file and adjust with your configuration
4. Run `npm run migrate up`
5. Run `npm run start:prod` for production mode or `npm run start:dev` for development mode with nodemon