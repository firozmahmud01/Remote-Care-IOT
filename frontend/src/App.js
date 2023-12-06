import LoginForm from './Login.js'
import Homepage from './Homepage.js'
import Meeting from './Meeting.js'
import { useState } from 'react';
function App() {
  const [change,handlechange]=useState(undefined);
  let cook=localStorage.getItem('cookie');

  return cook?change==undefined?<Homepage handlechange={handlechange}/>:<Meeting handlechange={handlechange} roomid={change}/>:<LoginForm/>
    
}

export default App;
