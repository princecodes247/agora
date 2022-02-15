const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/chat', (req, res) => {
  res.render('chat', { chatId: "1"})
})

io.on('connection', socket => {
   socket.on('chat', (data) =>{
        io.sockets.emit('chat', data);
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })
})

server.listen(process.env.PORT||3030)
// app.listen(process.env.PORT||443)