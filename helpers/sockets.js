let connections = [];
let users = [];

let Chat = require('../models/Message')
let User = require('../models/User')

module.exports = (io) => {
    io.on('connection', (socket) => {

        connections.push(socket);
        console.log('Connected: %s', connections.length);

        socket.on('disconnect', (data) => {
            connections.splice(connections.indexOf(socket.id), 1);
            users.splice(users.indexOf(socket.id), 1)
            updateUsers()
            console.log('Connected: %s', connections.length);
        })

        socket.on('username', (data) => {
            users = [...users, {
                id: socket.id,
                username: data.username
            }];
            updateUsers()
            Chat.find().then(chatMessages => {
                socket.emit('load chat', {
                    chat: chatMessages,
                    users: users,
                    currentuser: data.username

                })
            })


        })
        // send new message
        socket.on('new message', (data, cb) => {


            let text = data.text.split("/");
            let message = data.text.split(":")
            let sender = getUsernameOfSocket(socket.id)
            // check if private

            if (text[0] === 'private') {
                // send private to specific user
                console.log('private message');
                console.log(text)

                // check for user
                let destinationUser = text[1].split(':');

                console.log(destinationUser[0])
                let idx = -1;
                users.forEach((user, index) => {
                    if (user.username === destinationUser[0]) {
                        idx = index
                    }
                })
                console.log(idx)
                if (idx != -1) {
                    io.to(`${users[idx].id}`).emit('private message', {
                        msg: message[1],
                        sender: sender
                    })
                    cb({
                        msg: message[1],
                        sender: sender
                    })
                }
            } else {
                // send to publick
                let newChatMessage = new Chat({
                    msg: data.text,
                    sender: data.sender
                })

                newChatMessage.save().then(message => {
                    io.sockets.emit('new message', {
                        msg: message.msg,
                        sender: message.sender
                    })
                })
            }


        })
        socket.on('update soket username', data => {
            let newUserName = {
                id: socket.id,
                username: data
            };
            users.forEach(user => {
                if (user.id === newUserName.id) {
                    users.splice(users.indexOf(user), 1);
                }
            })

            users = [...users, newUserName];
            updateUsers()

        })

        function updateUsers() {
            io.sockets.emit('updateUsers', users)
        }

        function getUsernameOfSocket(id) {
            let username;

            users.forEach(user => {
                if (user.id === id) {
                    username = user.username;
                }
            })
            return username;
        }
    })
}