import { AppBar, Container, Switch, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import Profile from './Profile'
import Conference from './ConferenceList';

const YourProgress = () => (
  <Typography variant="h4" align="center" style={{ marginTop: '200px' }}>
    Your Progress Tab Content
  </Typography>
);



const App = ({handlechange}) => {
    const [current,setCurrent]=useState("con")
    const [intervalid,setIntervalid]=useState(undefined)
  return (
    <div>
      <AppBar position="static">
        <Tabs>
          <Tab label="Conference" onClick={()=>{
            setCurrent('con')
          }} selected={current=='con'}/>
          
          {/* <Tab label="Your Progress" onClick={()=>{
            setCurrent('ypro')
          }} selected={current=='ypro'}/> */}

          <Tab label="Profile" onClick={()=>{
            if(intervalid!=undefined){
              clearInterval(intervalid);
              setIntervalid(undefined)
            }
            setCurrent('pro')
          }} selected={current=='pro'}/>
          
        </Tabs>
      </AppBar>
      {current=='con'?<Conference intervalid={intervalid} setIntervalid={setIntervalid} handlechange={handlechange}/>:current=='ypro'?<YourProgress/>:<Profile></Profile>}
      </div>
  );
};

export default App;
