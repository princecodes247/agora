function LiveStream() {
  let _this = this;

  _this.isAlreadyCalling = false;
  _this.getCalled = false;
  _this.existingCalls = [];
  _this.host = '';
  _this.port = '';
  _this.protcol = '';
  _this.socket = null;
  _this.room = '';
  _this.user = '';
  _this.userList = [];
  _this.userListCallbacks = [];
  _this.updateUserList = () => {
    console.log('updateUserList');
  };
  _this.updateRooms = () => {
    console.log('updateUserList');
  };

  const { RTCPeerConnection, RTCSessionDescription } = window;
  _this.peerConnection = new RTCPeerConnection();

  _this.callUser = async (socketId) => {
    const offer = await _this.peerConnection.createOffer();
    await _this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  
    socket.emit("call-user", {
      offer,
      to: socketId
    });
  }

  let socket = io.connect(`${_this.protcol}://${_this.host}:${_this.port}`);
  socket.on("update-user-list", ({ users }) => {
    _this.updateUserList(users);
  });
  socket.on("refresh-rooms", ({ rooms }) => {
    _this.updateRooms(rooms);
  });
  
  socket.on("remove-user", ({ socketId }) => {
   
  });
  socket.on("call-made", async data => {
    if (_this.getCalled) {
      // const confirmed = confirm(
      //   `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
      // );
      let confirmed = true
        console.log("confirm call")
      if (!confirmed) {
        socket.emit("reject-call", {
          from: data.socket
        });
  
        return;
      }
    }
  
    await _this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await _this.peerConnection.createAnswer();
    await _this.peerConnection.setLocalDescription(new RTCSessionDescription(answer)).catch(err => console.log(err));
  
    socket.emit("make-answer", {
      answer,
      to: data.socket
    });
    _this.getCalled = true;
  });
  
  socket.on("answer-made", async data => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    ).catch(err => console.log(err))
  
    if (!_this.isAlreadyCalling) {
      _this.callUser(data.socket);
      _this.isAlreadyCalling = true;
    }
  });
  
  socket.on("call-rejected", data => {
    alert(`User: "Socket: ${data.socket}" rejected your call.`);
    _this.unselectUsersFromList();
  });
  
  _this.peerConnection.ontrack = function({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  };
  
  navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
      const localVideo = document.getElementById("local-video");
      if (localVideo) {
        localVideo.srcObject = stream;
      }
  
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    },
    error => {
      console.warn(error.message);
    }
  );
}





