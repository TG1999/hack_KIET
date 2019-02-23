const express=require('express');
const app=express();
var path= require('path');
const socketio=require('socket.io');
const http=require('http');
const server=http.createServer(app);
const io=socketio(server);
const cookieparser=require('cookie-parser');
app.use(cookieparser());
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})
var data={};
var flag=false;
io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on('loc',(data_t)=>{
        data=data_t;
        console.log(data.lat,data.lon)
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
