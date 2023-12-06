

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid
} from '@mui/material';
import { createroom, loadallroom } from './AllApi';

const ConferenceRoomItem = ({ name, createdBy, totalDoctors, onJoinClick }) => (
  <ListItem>
    <ListItemText
      primary={`${name} (Created by: ${createdBy})`}
      secondary={`Total Doctors: ${totalDoctors}`}
    />
    <Button variant="contained" color="primary" onClick={onJoinClick}>
      Join Room
    </Button>
  </ListItem>
);


const loadroomlist=async ()=>{
  let data=await loadallroom();
  let list=data.map(d=>{
    return {name: `New Room ${d.uid}`,
    createdBy: d.creatorname,
    totalDoctors: d.totaldoc,
  uid:d.uid}
  })
  return list;
}
let roomlist=undefined;
const checkroomupdate=async ()=>{
  let data=await loadallroom();
  let idlist=data.map(d=>d.uid);
  if(!roomlist){
    roomlist=idlist
    return false;
  }else{
    let a=[]
    for(let room of idlist){
      if(!roomlist.includes(room)){
        roomlist=undefined;
        return true;
      }
    }
  }
  return false;
}

const Conference = ({handlechange,setIntervalid,intervalid}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conferenceRooms, setConferenceRooms] = useState(undefined);
  
  useEffect(()=>{
    if(!conferenceRooms)return;
    if(intervalid==undefined){
    setIntervalid(setInterval(async()=>{
      let res=await checkroomupdate();
      if(res){
        loadroomlist().then(d=>{
          setConferenceRooms(d)
        }).catch(e=>{
          localStorage.removeItem('cookie')
          document.location.reload();
    
        })
      }
    },1000))
  }
  })

  
  if(!conferenceRooms){
    loadroomlist().then(d=>{
      setConferenceRooms(d)
    }).catch(e=>{
      localStorage.removeItem('cookie')
      document.location.reload();

    })
    return <h1>Loading...</h1>
  }


  const handleJoinClick = (roomid) => {
    if(intervalid!=undefined)clearInterval(intervalid)
    setIntervalid(undefined)
    handlechange(roomid)
  };

  const handleAddRoomClick = () => {
    createroom().then(d=>{
      if(d){
        alert('Room is created')
        if(intervalid!=undefined)clearInterval(intervalid)
        setIntervalid(undefined)
        handlechange(d)
      }
    }).catch(e=>{
      alert("Failed to create room.Maybe you have already created a room!")
    })
    
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Conference Page
      </Typography>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Search Conference Rooms
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Conference Room List
        </Typography>
        <List>
          {conferenceRooms
            .filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((room, index) => (
              <ConferenceRoomItem
                key={room.uid}
                {...room}
                onJoinClick={() => handleJoinClick(room.uid)}
              />
            ))}
        </List>

        <Grid container justify="flex-end" style={{ marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={handleAddRoomClick}>
            Add New Conference Room
          </Button>
        </Grid>
      </Paper>
    </div>
  );
};

export default Conference;
