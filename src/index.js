const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.port || 4000;
const publicDirecotryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirecotryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // socket.emit() - to particular connection
    // io.emit() - to every connection
    // socket.broadcast.emit - to all but socket
    // io.to().emit() - to particular room
    // socket.broadcast.to().emit() - to all in particular room but socket

    socket.on('join', (options, callback) => {

        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', `Welcome! ${user.username}`));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.');
        }

        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, location));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})