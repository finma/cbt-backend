#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("server:server");
const http = require("http");
const db = require("../db");
const WebSocket = require("../utils/WebSocket");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
global.io = require("socket.io")(server, { cors: { origin: "*" } });

global.io.on("connection", new WebSocket({ port }).connection);

/**
 * Listen on provided port, on all network interfaces.
 */

db.on("error", function (err) {
  console.log("connection mongodb error");
});

db.on("open", function () {
  // console.log("connect to mongodb");
  server.listen(port, () => console.log(`Server listen on port ${port}`));
  server.on("error", onError);
  server.on("listening", onListening);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
