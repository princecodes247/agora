
let ls = LiveStream();

  let unselectUsersFromList = () => {
    const alreadySelectedUser = document.querySelectorAll(
      ".active-user.active-user--selected"
    );
  
    alreadySelectedUser.forEach(el => {
      el.setAttribute("class", "active-user");
    });
  }
  let createUserItemContainer = (socketId) => {
    const userContainerEl = document.createElement("div");
  
    const usernameEl = document.createElement("p");
  
    userContainerEl.setAttribute("class", "active-user");
    userContainerEl.setAttribute("id", socketId);
    usernameEl.setAttribute("class", "username");
    usernameEl.innerHTML = `Socket: ${socketId}`;
  
    userContainerEl.appendChild(usernameEl);
  
    userContainerEl.addEventListener("click", () => {
      unselectUsersFromList();
      userContainerEl.setAttribute("class", "active-user active-user--selected");
      const talkingWithInfo = document.getElementById("talking-with-info");
      talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
      ls.callUser(socketId);
    });
  
    return userContainerEl;
  }
  let updateRooms = (roomIDs) => {
    const roomsContainer = document.getElementById("rooms-container");
  
    roomIDs.forEach(roomID => {
      const alreadyExistingUser = document.getElementById(roomIDs);
      if (!alreadyExistingUser) {
        const userContainerEl = createUserItemContainer(roomIDs);
  
        activeUserContainer.appendChild(userContainerEl);
      }
    });
  }

  let updateUserList = (socketIds) => {
    const activeUserContainer = document.getElementById("active-user-container");
  
    socketIds.forEach(socketId => {
      const alreadyExistingUser = document.getElementById(socketId);
      if (!alreadyExistingUser) {
        const userContainerEl = createUserItemContainer(socketId);
  
        activeUserContainer.appendChild(userContainerEl);
      }
    });
  }

let removeRoom = (roomID) => {
  const elToRemove = document.getElementById(socketId);
  
  if (elToRemove) {
    elToRemove.remove();
  }
}







