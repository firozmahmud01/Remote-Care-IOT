const { checkroom, checktoken, updatejoin, deleteameeting } =require('./database')

const http=require('http').createServer()
const {Server}=require('socket.io')
const io=new Server(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const allid={}
const rooms={}
const users={}
const muted={}
function removeuserfromroom(rid,id){
    if(!rooms[rid])return;
    let another=[]
    for(let i=0;i<rooms[rid].length;i++){
        if(rooms[rid][i]==id){
            continue;
        }
        another.push(rooms[rid][i]);
    }
    rooms[rid]=another;
}

module.exports= function(){
io.on('connection',sock=>{
// sock.emit('newjoin');
sock.on('wanttojoin',async(roomid,token)=>{
    let user=await checktoken(token)
    if(await checkroom(roomid) && user){
        
        // if(users[user.uid]){
        //     console.log(user.name+' joined again')
        //     olduser=users[user.uid];
        //     delete allid[olduser[1]]
        //     muted[sock.id]=muted[olduser[1]];
        //     delete muted[olduser[1]];
        //     removeuserfromroom(olduser[0],olduser[1])
        //     if(!rooms[roomid]){
        //         rooms[roomid]=[]
        //     }
        //     io.to(roomid).emit('updateuser',olduser[1],sock.id);
        //     sock.emit('updateyourid',sock.id);
        //     allid[sock.id]=[roomid,user.name];
        //     rooms[roomid].push(sock.id)
        //     users[user.uid]=[roomid,sock.id]
        // }else{
            console.log(user.name+' joined as new')
            users[user.uid]=[roomid,sock.id]
            muted[sock.id]=true;
            if(!rooms[roomid]){
                rooms[roomid]=[]
            }
            io.to(roomid).emit('newuser',sock.id,user.name);
            sock.emit('joinresponse','OK',sock.id,rooms[roomid].map((d)=>[...allid[d],d,muted[d]]));
            allid[sock.id]=[roomid,user.name];
            await updatejoin(roomid,true);
            rooms[roomid].push(sock.id)
    // }
    sock.join(roomid)
    }else{
        sock.emit('joinresponse',"Invalid room id!")
    }
})


    sock.on('handshake',async(data,userid)=>{
        if(!allid[sock.id])return;
        io.to(allid[sock.id][0]).emit('wanttohandshake',userid,data,sock.id)
    })
    sock.on('handshakeresponse',async(data,userid)=>{
        if(!allid[sock.id])return;
        io.to(allid[sock.id][0]).emit('handshakeres',userid,data,sock.id);
    })
    sock.on('muted',async(ismuted)=>{
        if(!allid[sock.id])return;
        muted[sock.id]=ismuted;
        console.log(allid[sock.id][1]+' is '+(ismuted?'muted':'unmuted'))
        io.to(allid[sock.id][0]).emit('muted',sock.id,ismuted)
    })





    
    
    sock.on('disconnect',async()=>{
        let id=sock.id
        if(allid[id]){
            let rid=allid[id][0]
            delete muted[id];
            let ke=Object.keys(users)
            for(let key of ke){
                if(users[key][1]==id){
                    delete users[key];
                    break;
                }
            }
            console.log('user removed:'+sock.id)
            io.to(rid).emit('deleteuser',id)
            removeuserfromroom(rid,id)
            await updatejoin(rid,false);
            if(rooms[rid]?.length==0){
                delete rooms[rid]
                await deleteameeting(rid)
            }
            if(allid[id])delete allid[id]
        }
        
    })
    
    
    
})

http.listen(3100)
}