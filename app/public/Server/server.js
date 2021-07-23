const express = require('express');
// const cookieParser = require('cookie-parser');
const app = express()
const path = require('path')


app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json({ limit: '50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const {authrouter,setPassword} = require('./auth');
const {videoRouter,setVidsPath,setSettings,setFFmpegLocation} = require('./video');

app.use('/video', videoRouter);
app.use('/auth', authrouter);

let serverPassword = ''

app.use('*',(req, res)=> {
  res.status(404).send("404")
});

const server = require('http').createServer(app);

// a away to remove the counter
var sockets = {}, nextSocketId = 0;
server.on('connection', function (socket) {
  // Add a newly connected socket
  var socketId = nextSocketId++;
  sockets[socketId] = socket;
  // Remove the socket when it closes
  socket.on('close', function () {
    delete sockets[socketId];
  });

})

const startServer = (path='',port=3333,pswEnabled=false,password='',ffmpegLocation)=>{
  setFFmpegLocation(ffmpegLocation)
  setVidsPath(path)
  setPassword(pswEnabled,password)
  serverPassword = password
  server.listen(port,()=>{
      console.log("started on "+port)
    })

}

const stopServer = ()=>{
  server.close()
  for (var socketId in sockets) {
    sockets[socketId].destroy();
  }
}

const setStreamSettings = (settings)=>{
  setSettings(settings)
}

  module.exports = {startServer,stopServer,setStreamSettings}
