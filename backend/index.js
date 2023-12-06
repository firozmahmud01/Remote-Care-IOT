const express=require('express');
const { checkauth, createUser } = require('./database');

const AllApi =require('./api')
const cors=require('cors');
const startsock  = require('./commiunication');
const app=express();
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())
app.use('/images',express.static('images'))
startsock();

app.post('/login',async(req,res)=>{
    let {user,pass}=req.body;
    if(!user||!pass){
        res.json({status:"Failed to get data."})
        return ;
    }

    let data=await checkauth(user,pass);
    if(data){
        res.json({data,status:'OK'});
    }else{
        res.json({status:"Wrong email or password."});
    }

})



app.post('/signup',async(req,res)=>{
    let {name,email,pass,education,experience,address}=req.body;
    if(!name||!email||!pass||!education||!experience||!address){
        res.json({status:"Failed to get data."})
        return ;
    }

    let data=await createUser(name,email,pass,education,experience,address);
    if(data=='OK'){
        res.json({status:data,message:'You can now login with your data'});
    }else{
        res.json({status:data});
    }
})

app.use('/api',AllApi);
app.listen(4000);
