 const uiCtrl = (() => {
     let uiSelectors = {
         messageForm: 'msgForm',
         message: 'message',
         chatBoard: 'chatBoard',
         loginForm: 'loginForm',
         logoutBtn: 'logout',
         user: 'user',
         password: 'password',
         usersList: 'users',
         registerForm: 'registerForm',
         editUsernameForm: 'editUsername',
         submit: 'submit'


     }
     return {
         getUiSelectors: function () {
             return uiSelectors;
         },
     }

 })();
 const app = ((uiCtrl) => {
     let socket = io();
     let user = JSON.parse(localStorage.getItem('user'));
     let loginEventListeners = function () {

         let uiSelectors = uiCtrl.getUiSelectors();

         //  document.getElementById(uiSelectors.loginForm).addEventListener('submit', (e) => {
         //      e.preventDefault();
         //      if (username.value == "") {
         //          let alert = document.getElementsByClassName('alert alert-danger')
         //          if (alert.length > 0) {
         //              alert.innerHTML = "";
         //          } else {
         //              let div = document.createElement('div');
         //              div.className = "alert alert-danger";
         //              div.role = "alert";
         //              div.innerText = 'User name must be longer that 1 character'
         //              document.getElementById(uiSelectors.loginForm).insertAdjacentElement("afterend", div)
         //              return;
         //          }

         //      } else {
         //          console.log('ok')
         //          socket.emit('login', {
         //              username: username.value,
         //              password: password.value
         //          });
         //      }

         //  });

         //  socket.on('username not found', (data) => {
         //      let alert = document.getElementsByClassName('alert alert-warning')
         //      if (alert.length > 0) {
         //          alert.innerHTML = "";
         //      } else {
         //          let div = document.createElement('div');
         //          div.className = "alert alert-warning";
         //          div.role = "alert";
         //          div.innerText = `User ${data.username} not found, please register or check username`
         //          document.getElementById(uiSelectors.loginForm).insertAdjacentElement("beforebegin", div)
         //          return;
         //      }

         //  })
         //  socket.on('loging in', (data) => {
         //      console.log(data);
         //      fetch('http://localhost:3000/user/login', {
         //          method: 'POST',
         //          headers: {
         //              'Content-Type': 'application/json',
         //              'Authorization': 'bearer'
         //          },
         //          body: JSON.stringify(data)
         //      }).then(res => res.json()).then(res => {
         //          console.log(res)
         //          if (res.msg == 'success') {

         //              window.location.href = 'http://localhost:3000';
         //              // check for user 

         //              if (!user) {
         //                  localStorage.setItem('user', JSON.stringify(res.user))

         //              } else {
         //                  let user = JSON.parse(localStorage.getItem('user'))
         //                  for (let i = 0; i < user.length; i++) {
         //                      if (user[i] == res.user) {
         //                          return;
         //                      } else {
         //                          localStorage.setItem('user', JSON.stringify(res.user))
         //                      }
         //                  }
         //              }

         //          }
         //      })
         //  })
     }

     let chatEventListeres = function () {
         // get selector
         let uiSelectors = uiCtrl.getUiSelectors();


         hideChat()

         let html = `
                <div class="row justify-content-center" id="login">
                    <div class="col-4">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="usename">Username</label>
                                <input type="text" class="form-control" id="username">
                            </div>
                            <button type="submit" class="btn btn-primary">Enter Chat</button>
                        </form>
                    </div>
                </div>`

         document.body.insertAdjacentHTML('afterbegin', html)

         let idForm = document.getElementById('loginForm')
         idForm.addEventListener('submit', (e) => {
             e.preventDefault()
             let username = document.querySelector('#username')

             if (username.value === '' || username.value.trim() === '' || username.value.length < 1) {
                 let alert = document.querySelector('.alert');
                 if (alert) {
                     document.querySelector('.alert').remove()
                 }
                 let warningDiv = document.createElement('div');
                 warningDiv.className = 'alert alert-danger';
                 warningDiv.role = 'alert';
                 warningDiv.innerHTML = 'Enter username'
                 idForm.append(warningDiv);
                 return
             }

             socket.emit('username', {
                 username: username.value
             })

         })

         // send message event
         document.getElementById(uiSelectors.messageForm).addEventListener('submit', (e) => {
             e.preventDefault();

             let message = document.querySelector('#message');
             let user = document.querySelector('#user')

             if (message.value.length < 1 || user.value.length < 1) {
                 return;
             }
             socket.emit('new message', {
                 text: message.value,
                 sender: user.value
             }, (data) => {
                 let p = document.createElement('p');
                 p.innerHTML = `<strong>me: ${data.msg}</strong>`
                 chatBoard.appendChild(p);
                 chatBoard.scrollTo(0, chatBoard.scrollHeight)
             });
             message.value = "";

         })


         // new message
         socket.on('new message', (data) => {

             let p = document.createElement('p');
             p.innerHTML = `${data.sender}: ${data.msg}`
             chatBoard.appendChild(p);
             chatBoard.scrollTo(0, chatBoard.scrollHeight)



         });

         socket.on('load chat', (data) => {
             console.log(data);
             document.querySelector('#login').style.display = 'none';
             showChat()
             //  document.getElementById(uiSelectors.chatBoard).innerHTML = "";
             document.getElementById(uiSelectors.user).value = data.currentuser
             if (data.chat.length == 0) {
                 chatBoard.innerHTML = 'No messages yet';

             } else {
                 data.chat.forEach(msg => {
                     let p = document.createElement('p');
                     p.innerHTML = `${msg.sender}: ${msg.msg}`
                     chatBoard.appendChild(p)
                 })

             }

             setEventListenersForUsers()
         })

         document.getElementById(uiSelectors.user).addEventListener('keydown', (e) => {

             let username = e.target.value;
             console.log(e)
             console.log(e.key)
             if (e.keyCode === 13) {
                 console.log('event emited')
                 socket.emit('update soket username', username)
             }
         })

     }

     socket.on('updateUsers', (data) => {
         let oldUserList = document.querySelectorAll('.list-group-item');
         oldUserList.forEach(li => {
             li.remove()
         })
         data.forEach(user => {
             let li = document.createElement('li');
             li.classList = 'list-group-item';
             li.innerHTML = `${user.username}`
             document.querySelector('.list-group').insertAdjacentElement('beforeend', li)
         });
         setEventListenersForUsers()



     })

     socket.on('private message', (data) => {
         console.log(data);
         let p = document.createElement('p');
         p.innerHTML = `<strong>${data.sender}: ${data.msg}</strong>`
         chatBoard.appendChild(p)
         chatBoard.scrollTo(0, chatBoard.scrollHeight)

     })


     function hideChat() {
         document.querySelector("#usersAndChatboard").style.display = 'none'
         document.querySelector("#userAndMessage").style.display = 'none'
     }

     function showChat() {
         document.querySelector("#usersAndChatboard").style.display = 'flex'
         document.querySelector("#userAndMessage").style.display = 'flex'
     }

     function setEventListenersForUsers() {
         let users = document.querySelectorAll('.list-group-item');
         let message = document.querySelector('#message');
         users.forEach(li => {
             console.log(li)

             li.addEventListener('click', (e) => {
                 console.log('OK')
                 e.preventDefault()
                 if (li.innerHTML === e.target.innerText) {
                     message.innerText = `private/${e.target.innerText}: `
                 }
             })
         })
     }



     return {
         init: function () {

             if (document.getElementById('login')) {
                 loginEventListeners()
             } else if (document.getElementById('msgForm')) {
                 chatEventListeres();
             } else {

             }
         }
     }
 })(uiCtrl);

 app.init();