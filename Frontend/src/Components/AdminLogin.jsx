import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";


const notify = (message) => toast(message);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/admin/login', {
        email,
        password,
      });
      if (response.data.status) {
        localStorage.setItem('token', response.data.token); // Store the token
        navigate('/admin/dashboard'); // Redirect to the admin dashboard
      } else {
        notify(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      notify('Login failed. Please check your credentials.');
    }
  };

  return (
    <BoxContainer>
      <h2>Admin Login</h2>
      <FormContainer onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit">Login</SubmitButton>
      </FormContainer>
     
      <MutedLink href="#">Forget your password?</MutedLink>
    
      <LineText>
        Don't have an account?{" "}
        <BoldLink  href="#">
          Signup
        </BoldLink>
      </LineText>
      <ToastContainer />
    </BoxContainer>
  );
};

export default AdminLogin;
