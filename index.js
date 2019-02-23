const express=require('express');
const app=express();
var path= require('path');
const socketio=require('socket.io');
const http=require('http');
const server=http.createServer(app);
const io=socketio(server);
const webpush=require('web-push');
const cookieparser=require('cookie-parser');
const bodyParser = require("body-parser");
app.use(cookieparser());
app.use(bodyParser.json());
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})
const publickey='BM4dDUFxek5tNg2Q_1ANpNIAH72SaTMrLmAcW2b_WaIM9f7FEdFitxkiwLCABLWAvWuVMnf-zE2Zl90R0IFYwlk';
const prvtkey='FXdDTYKesce5zgO5QoIGMlWaH4bYVfrgUrAMkutvrl8';
webpush.setVapidDetails('mailto:test@test.com',publickey,prvtkey);
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
  
    // Send 201 - resource created
    res.status(201).json({});
  
    // Create payload
    const payload = JSON.stringify({ title: "Push Test" });
  
    // Pass object into sendNotification
    webpush
      .sendNotification(subscription, payload)
      .catch(err => console.error(err));
  });
var data={};
var flag=false;
io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on('loc',(data_t)=>{
        data=data_t;
    })
    socket.on('loc_user',(data1)=>{
        var lat1=data.lat;
        var lat2=data1.lat;
        var lon1=data.lon;
        var lon2=data1.lon;
        const k=Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon1-lon2);
        console.log(k);
        const d = Math.acos(k)*6731;
        if(d>=0 || d<=1 || !flag){
            flag=!flag;
            io.emit('notif')
        }
        console.log(data.lat,data.lon,data1.lat,data1.lon);
    })
})
server.listen(2000,()=>{
    console.log('running at http://localhost:2000')
})
