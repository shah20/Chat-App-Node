const socket = io();

// Elements
const $msgBox = document.querySelector('#msgBox');
const $sendButton = document.querySelector('#sendButton');
const $sendLocation = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
    createMessage(messageTemplate, message);
});

socket.on('locationMessage', (message) => {
    createMessage(locationTemplate, message);
});

socket.on('roomData', ({ room, users }) => {
    console.log('room', room);
    console.log('users', users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
})

function createMessage(template, message) {
    console.log(message);
    const html = Mustache.render(template, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A'),
        username: message.username
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
}

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMarginBottom = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMarginBottom;

    const visibleHeight = $messages.offsetHeight;

    const containerHeight = $messages.scrollHeight;

    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }



}

$sendButton.addEventListener('click', () => {
    const msg = $msgBox.value;

    if (msg.trim()) {
        $sendButton.setAttribute('disabled', 'disabled');

        socket.emit('sendMessage', msg, (error) => {
            $sendButton.removeAttribute('disabled');
            $msgBox.value = '';
            $msgBox.focus();

            if (error) {
                return console.log(error);
            }
            console.log('Message delivered!');
        });
    }
});

$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not suppported')
    }

    $sendLocation.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocation.removeAttribute('disabled');
            console.log('Location shared!')
        });
    });

});


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});