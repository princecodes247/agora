// Make connection
const socket = io('/')

function Chat () {
    let sendMessage = (from, message, to) => {
// Implement To
    socket.emit('chat', {
        message: message,
        name: from,
    })
    }
    let listenForMessage = () => {
        socket.on('chat', (data) => {
        // Change
});
    }
    let setTyping = () => {
        socket.emit('typing', name.value);
    }
    let listenForTyping = () => {
        socket.on('typing', (data) => {
        //   Change
        })
    }
}


