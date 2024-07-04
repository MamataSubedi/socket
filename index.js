const io = require('socket.io')(5000,{
    cors:{
        origin: "http://localhost:5000"
    }
})
 
let activeUsers =[]

io.on("connection", (socket)=>{

    //add new User
    socket.on('new-user-add', (newUserId)=>{
        //if user is not previously added
        if(!activeUsers.some((user)=>user.userId === newUserId))
            {
                activeUsers.push({
                    userId: newUserId,
                    socketId:socket.id
                })
            }
console.log("Connected Users", activeUsers)
            io.emit('get-users', activeUsers)
    })

// send message
socket.on("send-message", (data)=> {
    const {receiverId}= data;
    const user = activeUsers.find((user)=> user.socketId !== socket.id)
    console.log("Sending from socket to:", receiverId)
console.log("Data", data)
if(user){
io.to(user.socketId).emit("receive-message",data)
}
   
})



    socket.on("disconnect", ()=>{
        activeUsers= activeUsers.filter((user)=> user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers)
        io.emit('get-users', activeUsers)
    })
})