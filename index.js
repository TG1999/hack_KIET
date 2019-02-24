const express = require("express");
const app = express();
var path = require("path");
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
const webpush = require("web-push");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(cookieparser());
var spawn = require("child_process").spawn;
spawn("python", ["detect_drowsiness.py"]);
app.use(bodyParser.json());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
const challan=require('./model/db').challan;
const user=require('./model/db').user;
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
const publickey =
  "BM4dDUFxek5tNg2Q_1ANpNIAH72SaTMrLmAcW2b_WaIM9f7FEdFitxkiwLCABLWAvWuVMnf-zE2Zl90R0IFYwlk";
const prvtkey = "FXdDTYKesce5zgO5QoIGMlWaH4bYVfrgUrAMkutvrl8";
webpush.setVapidDetails("mailto:test@test.com", publickey, prvtkey);
app.get('/viewchallan',(req,res)=>{
  var id=req.body.id;
  var vh_n=req.body.num;
  user.findAll({where:{
    veh_no:vh_n
  }}).then((resp)=>{
    if(Array.isArray(resp)){
      for(var r in resp)
      {
        challan.findAll({
          where:{
            veh_no:r.veh_no
          }
        }).then((resp)=>{
          res.send(resp)
        })
      }
    }
  })
})
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
var data = {};
var flag = false;
io.on("connection", socket => {
  console.log(socket.id);
  socket.on("loc", data_t => {
    data = data_t;
  });
  socket.on("loc_user", data1 => {
    lat2=28.7473;
    lon2=77.4899;
    var lat1 = 28.7522;
    // var lat2 = data1.lat;
    var lon1 =77.4988 ;
    console.log(data.lat,data.lon);
    // var lon2 = data1.lon;
d=getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
    console.log(d);
    if ((d >= 0 && d <= 1) && !flag) {
      flag=!flag;
      console.log(flag);
      io.emit("notif");
    }
  });
});
server.listen(2000, () => {
  console.log("running at http://localhost:2000");
});
