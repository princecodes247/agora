const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream
  addVideoStream(myVideo, myVideoStream , "id")

  myPeer.on('call', call => {
    console.log("ïncoming call", call)
    call.answer(myVideoStream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream, call.peer)
    })
  })

  socket.on('user-connected', userId => {
    console.log("user connected", userId)
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  console.log("funtion")
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, "123")
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream, id) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  let nameElem = document.createElement('p')
  nameElem.innerHTML = id + "<br/>"
  let videoCont = document.createElement('div')
  // Check if video grid already contains a video element
  
  if (!videoGrid.firstElementChild) {
  }
  videoCont.appendChild(video)
  videoCont.appendChild(nameElem)
  videoGrid.append(videoCont)
}



const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    console.log("muted")
    myVideoStream.getAudioTracks()[0].enabled = false;
    // setUnmuteButton();
  } else {
    // setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  console.log( myVideoStream.getVideoTracks()[0])
  if (enabled) {
    console.log("stopped")
    myVideoStream.getVideoTracks()[0].enabled = false;
    // setPlayVideo()
  } else {
    // setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

// For audio and video Controls
let muteUnmuteButton = document.getElementById('mute');
let playStopButton = document.getElementById('stop');

muteUnmuteButton.addEventListener('click', ()=>{
  muteUnmute()
  console.log("hit")
});

playStopButton.addEventListener('click', ()=>{
  playStop()
  console.log("hit")
});
