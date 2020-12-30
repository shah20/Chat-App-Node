const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
});

document.querySelector('#sendButton').addEventListener('click', () => {
    const msg = document.querySelector('#msgBox').value;
    socket.emit('sendMessage', msg, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

document.querySelector('#sendLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not suppported')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        });
    });

});
