// start programming~
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" },
})

const timers = {}

io.on("connection", (socket) => {
  //console.log("Connected to server with id:", socket.id)

  socket.on("update-timer", ({ key, timeLeft }) => {
    timers[key] = timeLeft
    console.log("all-timers", timers)
    //console.log(`Received timer update → key: ${key}, timeLeft: ${timeLeft}s`)
    io.emit("timer-updated", { key, timeLeft })
  })

  socket.on("delete-timer", (key) => {
    delete timers[key]
    console.log(`Received timer deleted → key: ${key}`)
    io.emit("timer-deleted", key)
  })

})

server.listen(3000, () => {
  console.log("Server listening on port 3000")
})