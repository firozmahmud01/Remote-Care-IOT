import { CallEnd, Mic, MicOff } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import { useEffect, useState } from "react"

import Peer from "simple-peer";
import {io} from 'socket.io-client'
import { host } from "./AllApi";
let myaudio=undefined;
let sock=undefined;
let myid=undefined;
let others={}
let onetime=true;
export default function MainRoom({roomid}){
    const [mic,setMic]=useState(false);

    useEffect(()=>{
        if(onetime==true){
            onetime=false;
            try{
                initiate(roomid)
            }catch(ex){
                
            }
        }
    })

    return (<div>
<div style={{position:'fixed',top:'10px',left:'10px'}}>
        <Button variant="contained" color="primary">Submit your Report</Button>
    </div>
    <div style={{
        width:'145px',
        bottom:'0px',
        marginLeft:'50%',
        transform:'translateX(-50%);',
        position:'fixed'
    }}>
        <div id='audio'/>
    
    <IconButton size="large" color="primary" 
    onClick={()=>{
        if(mic){
            stopAudio()
        }else{
            startAudio()
        }
        setMic(!mic)
        
    }}>
    {mic?(<Mic></Mic>):(<MicOff/>)}
    </IconButton>
    <IconButton size="large" color="primary" onClick={()=>{
        document.location.reload();
    }}>
    <CallEnd></CallEnd>
    </IconButton>
    
        </div>
</div>)
}

function stopAudio(){
    if(sock){
        sock.emit('muted',true)
    }
    myaudio.getAudioTracks()[0].enabled=false;
}
function startAudio(){
    if(sock)sock.emit('muted',false)
    myaudio.getAudioTracks()[0].enabled=true;
}

function adduseraudio(stream,id){
    try{
    let vid=document.createElement('video')
    let coun=stream.getVideoTracks()
    if(coun.length>0)return;
    console.log('audio added')
    vid.srcObject=stream;
    vid.hidden=true;
    vid.id=id
    document.getElementById('audio').appendChild(vid)
    vid.play()
    }catch(ex){}
}
async function addsenderevent(sock,idu){
    try{
    others[idu].peer.on('close',()=>{
        try{
            document.getElementById(idu)?.remove()
        }catch(e){

        }
    })
    others[idu].peer.on('error',(err)=>{
        try{
            document.getElementById(idu)?.remove()
        }catch(e){

        }
    })
    others[idu].peer.on('signal',(dat)=>{
        sock.emit('handshake',dat,idu);
    })
    others[idu].peer.on('stream',stream=>{
        adduseraudio(stream,idu)
    })
}catch(ex){}
}
async function initiate(roomid){
    try{
    myaudio=await navigator.mediaDevices.getUserMedia({audio:true})
    myaudio.getAudioTracks()[0].enabled=false;
    }catch(ex){}
    sock=io("ws://"+host.replace('4000','3100').replace('http://',""))
    sock.on('connect',()=>{
        sock.emit('wanttojoin',roomid,localStorage.getItem('cookie'));
    })
    sock.on('updateyourid',(id)=>{

        console.log('I am updating id...'+id)
        myid=id;
    })
    sock.on('joinresponse',(isok,sockid,otheruser)=>{
        try{
        if(isok!="OK"){
            alert(sockid);
            document.location.reload();
            return ;
        }
        myid=sockid;
        others={}
        for(let i=0;i<otheruser.length;i++){
            let idu=otheruser[i][2];
            others[idu]={name:otheruser[i][1],muted:otheruser[i][3],id:idu,peer:new Peer({initiator:true,trickle:false,streams:[myaudio]})};
            
            addsenderevent(sock,idu)
            console.log("new user "+idu)
        }
    }catch(ex){}
    })

    sock.on('newuser',(sockid,name)=>{
        try{
        let data={name,muted:true,id:sockid}
        others[data.id]=data;
        console.log("new user "+sockid)
        }catch(ex){}
    })
    sock.on('deleteuser',(id)=>{
        try{
        if(!others[id])return;
        delete others[id]
        try{
            document.getElementById(id)?.remove()
        }catch(e){

        }
    }catch(er){}
    })
    sock.on('updateuser',(oldid,newid)=>{
        try{
        if(!others[oldid])return;
        let data={...others[oldid]}
        data['id']=newid
        delete others[oldid]
        others[data.id]=data;
        }catch(ex){}
    })

    sock.on('muted',(id,ismuted)=>{
        try{
        if(id==myid)return;
        if(!others[id])return;
        others[id]['muted']=ismuted;
        }catch(ex){}
    })

    sock.on('wanttohandshake',(tergetid,data,fromid)=>{
        try{
        if(fromid==myid)return;
        let p=new Peer({initiator:false,trickle:false,streams:[myaudio]})
        p.on('signal',dat=>{
            sock.emit('handshakeresponse',dat,fromid)
        })
        p.signal(data);
        console.log(fromid)
        others[fromid]['peer']=p;
        p.on('stream',stream=>{
            adduseraudio(stream,fromid)
        });
    }catch(ex){}
    })
    sock.on('handshakeres',(tergetid,data,fromid)=>{
        try{
        if(fromid==myid)return;
        others[fromid].peer.signal(data);
        }catch(ex){}
    })


}