let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();

const { getMovies, createMovie } = require("./model");

let { DATABASE_URL, PORT } = require("./config");

let app = express();
app.use(jsonParser);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

app.get("/api/moviedex", async (_, res) => {
  try {
    const allMovies = await getMovies();

    return res.status(200).json(allMovies);
  } catch (error) {
    console.log(error);
    res.statusMessage = "Server error";
    return res.sendStatus(500);
  }
});

app.post("/api/moviedex", async (req, res) => {
  try {
    const { title, year, rating } = req.body;
    if (title && year && rating) {
      const movie = await createMovie({
        film_title: title,
        year: year,
        rating: rating
      });

      res.statusMessage = "Movie entry created successfuly";
      return res.status(201).json(movie);
    }
    res.statusMessage = "Missing Parameters";
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    res.statusMessage = "Server error";
    return res.status(500);
  }
});

let server;

function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      response => {
        if (response) {
          return reject(response);
        } else {
          server = app
            .listen(port, () => {
              console.log("App is running on port " + port);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              return reject(err);
            });
        }
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing the server");
      server.close(err => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}
runServer(PORT, DATABASE_URL);

module.exports = {
  app,
  runServer,
  closeServer
};
