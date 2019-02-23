const express=require('express');
const app=express();
var path= require('path');
const cookieparser=require('cookie-parser');
app.use(cookieparser());
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.listen(2000,()=>{
    console.log('running at http://localhost:2000')
})
