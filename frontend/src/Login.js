import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { requestLogin } from './AllApi';
import { Card, CardMedia, Grid } from '@mui/material';
import BGimage from './Images/doc.jpg'


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if(email.length==0||password.length==0){
      alert("Please fill up every field.")
      return ;
    }
    requestLogin(email,password).then(d=>{
      localStorage.setItem('cookie',d.cookie)
      alert('Welcome back doctor!')
      document.location.reload();
    }).catch(e=>{
      alert('Failed to login');
      
      
    })

  };

  return (
    <div style={{backgroundImage:'url('+BGimage+')',width:'100%',height:'100%',display:'block',position:'fixed',backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat', opacity:'0.7'}}>
      
    <div style={{position:'absolute',marginLeft:'50%',backgroundColor:'white',padding:'20px',transform:'translate(-50%,-50%)',width:'50%',top:'50%',display:'block'}}>
      <h2>Login</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <TextField fullWidth
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        </Grid>
        <Grid item xs={12}>
        <TextField
id="password" label="Password"
 type="password" value={password}
 fullWidth
  onChange={(event) => setPassword(event.target.value)} required/>
        </Grid>
        <Grid item xs={12}>
        <Button fullWidth type="submit" onClick={()=>{handleSubmit()}} variant="outlined" >
          Login
        </Button>
        </Grid>

      </Grid>
    </div>
    </div>
  );
};

export default LoginForm;