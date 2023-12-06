const express=require('express');
const { checkauth, createUser, getfoodlist, getfooddetails, getbabysitterdetails, getbabysitteritem, uploadfood, getProfileDetails, updateProfilePicture, updateProfile, uploadProjects, getProjectlist, getProjectDetails, requestbit, acceptbidder, loadmessage, sendmessage, submitreview, cashreq, loadb, videolist, uploadvideo, uploadlike, sendcomment, commentlist, loadnotification, checktoken, addnewroom, getallroom } = require('./database');
const r=express.Router()
module.exports= r;

r.all('*',async(req,res,next)=>{
    let cook=req.headers.authorization;
    if(!cook){
        res.send("Failed to process");
        return;
    }
    let user=await checktoken(cook);
    if(!user){
        res.send('Failed to process');
        return ;
    }
    req.app.locals.user=user;
    next();

})


r.get('/profile',async(req,res)=>{
    let user=req.app.locals.user;
    if(!user){
        res.json({status:'Something went wrong'});
        return ;
    }
    delete user.pass;
    delete user.token;
    res.json({status:'OK',user});
})



   
r.post('/updateprofile',async(req,res)=>{

    const {cookie,data}=req.body;
    if(!cookie||!data){
        res.json({status:'Failed to load image!'});
        return;
    }
    let da=await updateProfile(data,cookie);
    if(da){
        res.json({status:'OK'})
    }else{
        res.json({status:'Failed to upload profile picture!'})
    }

})


r.get('/addnewroom',async(req,res)=>{
    let user=req.app.locals.user;
    
    let roomid=await addnewroom(user)
    if(roomid){
        res.json({status:'OK',roomid})
    }else{
        res.json({status:'Failed to create room!'})
    }

})


r.get('/listallroom',async(req,res)=>{
    let rooms=await getallroom()
    if(rooms){
        res.json({status:'OK',rooms})
    }else{
        res.json({status:'Failed to load room'})
    }

    
})