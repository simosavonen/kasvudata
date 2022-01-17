<br>
<br>
<h1 align="center"><img height=50px src="./logo.png" alt="Kasvudata logo"> Kasvudata</h1>
<p align="center">Upload and review sensor readings to keep the crops happy and your farm productive.</p> 

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/simosavonen/kasvudata.svg)](https://github.com/simosavonen/kasvudata/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/simosavonen/kasvudata.svg)](https://github.com/simosavonen/kasvudata/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Running the tests](#tests)
- [API reference](#apidoc)
- [Built Using](#built_using)


## 🧐 About <a name = "about"></a>
The assignment was to create a fullstack application that would let users upload weather related data in CSV form for parsing and displaying. Emphasis was to be given to writing clean code and good instructions.

Kasvudata is many things: a NodeJS backend, that can parse the CSV files and store them in a MongoDB database, be it in the cloud, running locally or inside a Docker container. The backend is a REST API, documented with Swagger.

The frontend is a simple React client for displaying the 30 most recent entries of the sensor data.

  
## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites
Make sure you have a recent version of <a href="https://nodejs.org/en/" rel="noopener">Node.js</a> installed. To use the containers you will need to install <a href="https://www.docker.com/" rel="noopener">Docker</a> for your system. 

### The backend server
Clone the repository.

```
git clone https://github.com/simosavonen/kasvudata.git
cd kasvudata
```

Rename the two .env.sample files as .env, located at the root of the project and in `/server` directory.

Start two docker containers, one for the backend and one for MongoDB, by running the command:

```
docker-compose up
```

The command to shut down the docker containers: `docker-compose down`

The backend should now be running at http://localhost:6868/api

### 📓 API reference <a name = "apidoc"></a>
The Swagger generated API documentation is found at http://localhost:6868/api-docs

To upload CSV files, you can use the Swagger api-docs or open http://localhost:6868/api/files

### The frontend client
Install Node.js modules and start the React client

```
cd client
npm install
npm start
```

The client will start at http://localhost:3000 and is configured to look for the backend at port 6868.

It is very limited in functionality. You should see a table of weather sensor data if you uploaded the CSV files. The client expands a row when clicked on, to reveal more data points.

It's also possible to run the command `npm run build` and copy the contents of the `/client/build` directory to `/server/public`, the backend is configured to serve static files from that directory.
TODO: automate this.


## 🔧 Running the tests <a name = "tests"></a>

To run the battery of tests for the backend, install Node.js modules on your local machine.

```
cd server
npm install
npm run test
``` 

The tests are found in directory `/server/tests` and they use an in-memory version of MongoDB. This lets developers in a team run tests without interfering each other, compared to using a shared database.


## ⛏️ Built Using <a name = "built_using"></a>
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [MongoDB](https://mongodb.com) - Document Database
- [Swagger](https://swagger.io/) - API Documentation
- [Docker](https://www.docker.com/) - Container platform
