const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const usersList = document.getElementById("users");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
let userId = "";
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    socket.on("user-connected", (details) => {
      connectToNewUser(userId, stream);
      console.log("on connect" + details);
      details.users.forEach((user) => {
        usersList.innerHTML += user + "<br>";
      });
      console.log(details.userId);
      addVideoStream(myVideo, stream, userId);
    });
    addVideoStream(myVideo, stream, userId);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream, userId);
      });
    });
  });

socket.on("user-disconnected", (details) => {
  console.log(details.userId);
  details.users.forEach((user) => {
    usersList.innerHTML += user + "<br>";
  });
  if (peers[details.userId]) peers[details.userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, userId);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream, userId) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  let nameHolder = document.createElement("div");
  nameHolder.innerHTML = "<h1>" + userId + "</h1>";
  videoGrid.append(nameHolder);
  videoGrid.append(video);
}

// Messaging System

// input value
//   let text = $("input");
//   // when press enter send message
//   $('html').keydown(function (e) {
//     if (e.which == 13 && text.val().length !== 0) {
//       socket.emit('message', text.val());
//       text.val('')
//     }
//   });
//   socket.on("createMessage", message => {
//     $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
//     scrollToBottom()
//   })
// })
