let crypto = require('crypto');

let fs=require("fs")

let sqlite3=require('sqlite3')
const { open }=require('sqlite')
let con;
open({
  filename: 'database.db',
  driver: sqlite3.Database
}).then((db) => {
    console.log("Connected!");
    con=db;
    // db.exec("CREATE DATABASE IF NOT EXISTS doctor", (err) => {
      // if (err) {
      //   console.error(err);
      //   return;
      // }
      // db.exec("USE doctor");
    
    db.exec("CREATE TABLE IF NOT EXISTS doctor(uid INTEGER PRIMARY KEY AUTOINCREMENT,profile TEXT,name TEXT,email TEXT,pass TEXT,token TEXT,education TEXT,experience TEXT,address TEXT);")
    db.exec("CREATE TABLE IF NOT EXISTS room(uid INTEGER PRIMARY KEY AUTOINCREMENT,creatorid INTEGER,creatorname TEXT,totaldoc INTEGER DEFAULT 1);")
    db.exec('CREATE TABLE IF NOT EXISTS patient(uid INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT,pass TEXT,phone TEXT,age INTEGER,sex TEXT,cholesterol TEXT,diabetes TEXT,familyhistory TEXT,smoking TEXT,obesity TEXT,exercisehoursperweek TEXT,diet TEXT,previousheartproblems TEXT,medicationuse TEXT,stresslevel TEXT,sedentaryhoursperday TEXT,bmi TEXT,triglycerides TEXT,physicalactivitydaysperweek TEXT,sleephoursperday TEXT);')
    // name,email,pass,phone,age,	sex,	cholesterol,diabetes,familyhistory,smoking,obesity,exercisehoursperweek,diet,previousheartproblems,medicationuse,stresslevel,sedentaryhoursperday,bmi,triglycerides,physicalactivitydaysperweek,sleephoursperday,	Heart Attack,
// bloodpressure,heartrate



    // })

})
  


exports.createPatient=async(name,email,pass,phone,age,	sex,	cholesterol,diabetes,familyhistory,smoking,obesity,exercisehoursperweek,diet,previousheartproblems,medicationuse,stresslevel,sedentaryhoursperday,bmi,triglycerides,physicalactivitydaysperweek,sleephoursperday)=>{
  let upass=crypto.createHash('sha256').update(pass).digest('base64');
  const cmd="SELECT uid FROM patient WHERE email=?;"
  let data=await getData(cmd,[email])
  
  if(data[0]?.uid){
    return "This email already exists.";
  }else{
    await getData("INSERT INTO patient(name,email,pass,phone,age,	sex,	cholesterol,diabetes,familyhistory,smoking,obesity,exercisehoursperweek,diet,previousheartproblems,medicationuse,stresslevel,sedentaryhoursperday,bmi,triglycerides,physicalactivitydaysperweek,sleephoursperday) VALUES(?,?,?,?,?,	?,	?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[name,email,upass,phone,age,	sex,	cholesterol,diabetes,familyhistory,smoking,obesity,exercisehoursperweek,diet,previousheartproblems,medicationuse,stresslevel,sedentaryhoursperday,bmi,triglycerides,physicalactivitydaysperweek,sleephoursperday])
    await getData('UPDATE patient SET profile=? WHERE email=?',[namespaceremover(name)+''+da[0].uid,email])
    return "OK"
  }
}

async function getData(cmd,arg){
  let p = await con.all(cmd,arg)
  return p;
}



exports.addnewroom=async(user)=>{
  let check=await getData('SELECT * FROM room WHERE creatorid=?;',[user.uid]);
  if(check.length>0){
    return false;
  }
  let cmd='INSERT INTO room(creatorid,creatorname) VALUES(?,?);'
  await getData(cmd,[user.uid,user.name])
  let id=await getData('SELECT * FROM room WHERE creatorid=?;',[user.uid]);

  return id[0].uid;
}
exports.removeallmeeting=async()=>{
  let cmd='DELETE FROM room';
  await getData(cmd,[]);
}
exports.deleteameeting=async(meetingid)=>{
  let cmd='DELETE FROM room WHERE uid=?';
  await getData(cmd,[meetingid]);
}

exports.checkroom=async(meetingid)=>{
  let cmd='SELECT * FROM room WHERE uid=?';
  let ret=await getData(cmd,[meetingid]);
  if(ret.length>0){
    return true;
  }
  return false;

}
exports.getallroom=async()=>{
  let cmd='SELECT * FROM room';
  let ret=await getData(cmd,[]);
  return ret;
}
exports.updatejoin=async(meetingid,added)=>{
  let cmd;
if(added){
  cmd='UPDATE room SET totaldoc=totaldoc+1 WHERE uid=?';
}else{
  cmd='UPDATE room SET totaldoc=totaldoc-1 WHERE uid=?';
}
  let ret=await getData(cmd,[meetingid]);
  if(ret.length>0){
    return true;
  }
  return false;

}



exports.checktoken=async(token)=>{
  let cmd="SELECT * FROM doctor WHERE token=?;"
  let data=await getData(cmd,[token])
  if(data[0]?.uid){
    return data[0];
  }
  cmd="SELECT * FROM patient WHERE token=?;"
  data=await getData(cmd,[token])
  if(data[0]?.uid){
    return {...data[0],patient:true}
  }
  return undefined;
}




function namespaceremover(name){
  
  let res='';
  for (let i=0;i<name.length;i++){
    if((name[i]>='a'&&name[i]<='z')||(name[i]>='A'&&name[i]<='Z'))res+=name[i];}
  return res.toLowerCase();
}


exports.createUser=async(name,email,pass,education,experience,address)=>{
  let upass=crypto.createHash('sha256').update(pass).digest('base64');
  const cmd="SELECT uid FROM doctor WHERE email=?;"
  let data=await getData(cmd,[email])
  
  if((data&&data[0]?.uid)||data?.uid){
    return "This email already exists.";
  }else{
    await getData("INSERT INTO doctor(name,email,pass,education,experience,address) VALUES(?,?,?,?,?,?);",[name,email,upass,education,experience,address])
    await getData('UPDATE doctor SET profile=? WHERE email=?',[namespaceremover(name)+''+da[0].uid,email])
    return "OK"
  }

}




exports.getProfileDetails=async(link)=>{
  let data=await getData('SELECT * FROM doctor WHERE profile=?',[link]);
  
  if(data.length>0){
    delete data[0].pass
    return data;
  }
}


exports.checkauth=async(user,pass)=>{
    let upass=crypto.createHash('sha256').update(pass).digest('base64');
    let salt = crypto.randomBytes(27).toString('hex'); 
    
    let cmd="SELECT uid FROM doctor WHERE email=? AND pass=?;"
    let data=await getData(cmd,[user,upass])
    if(data[0]?.uid){
      await getData("UPDATE doctor SET token=? WHERE uid=?;",[salt,data[0].uid])
      return {cookie:salt,name:data[0].name,img:data[0].img,profile:data[0].profile};
    }
    cmd='SELECT uid FROM patient WHERE email=? AND pass=?;'
    data=await getData(cmd,[user,upass]);
    if(data[0]?.uid){
      await getData("UPDATE patient SET token=? WHERE uid=?;",[salt,data[0].uid])
      return {cookie:salt,name:data[0].name,img:data[0].img,userType:data[0].userType,profile:data[0].profile};
    }
    return undefined;
}











