import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { requestLogin } from './AllApi';



const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
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
    <div >
      <h2>Login</h2>
      <form  onSubmit={handleSubmit}>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField

          
id="password"

          
label="Password"

          
type="password"

          
value={password}

          
onChange={(event) => setPassword(event.target.value)}
          
          required
        />
        <Button type="submit" variant="contained" >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;