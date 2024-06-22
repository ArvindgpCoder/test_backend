const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./UserRoutes.jsx'); // Adjust the path based on the correct file extension
const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require("body-parser");
const AuthMiddleware = require('./AuthMiddleware.jsx');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose.connect("mongodb+srv://arvindgpta786:parinahi1@cluster3.9zrvtt9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3");

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use(bodyParser.urlencoded({ extended: true }));

// Allow CORS for all routes
app.use(cors());

// Example of a protected route
app.get('/protected-route', AuthMiddleware, (req, res) => {
  res.status(200).send('This is a protected route');
});

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.broadcast.emit("callEnded", socket.id);
  });

  socket.on('calluser', ({ userToCall, signalData, from, name }) => {
    console.log(`Calling user: ${userToCall} from: ${from} with signal: ${signalData}`);
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on('answercall', ({ signal, to }) => {
    console.log(`Answering call to: ${to} with signal: ${signal}`);
    io.to(to).emit("callaccepted", signal);
  });

  socket.on('code', (data) => {
    io.emit('code', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
