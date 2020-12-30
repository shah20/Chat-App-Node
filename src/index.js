const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.port || 4000;
const publicDirecotryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirecotryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.emit('message', 'Welcome! Connection successful.');
    socket.broadcast.emit('message', 'New user joined');

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.');
        }

        io.emit('message', message);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'User left')
    });

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
        callback();
    })
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})