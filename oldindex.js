const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
let users = []

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    console.log(userId)
    users.push(userId)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', {userId, users})

    socket.on('disconnect', () => {
      console.log("users:" + users)
      // Remove user from users list
      users = users.filter(user => user !== userId)
      console.log("new-=users:" + users)
      socket.to(roomId).broadcast.emit('user-disconnected', {userId, users})
    })
  })

})

// server.listen(3000)

server.listen(process.env.PORT||3030)
// app.listen(process.env.PORT||443)