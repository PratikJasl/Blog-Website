import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navigation(){

  const {setUserInfo, userInfo} = useContext(UserContext);
  
  useEffect(()=>{
    fetch('https://myblog-v1-api.vercel.app/profile',{
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
        response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  },[]);

  function logout(){
    fetch('https://myblog-v1-api.vercel.app/logout',{
      method: 'POST',
      credentials: 'include'
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return(
    <Navbar expand="lg" className="navbar-custom" data-bs-theme="light" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to='/' className="me-auto"><i className="bi bi-house-fill"/> My Blog</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {username && (
            <Nav className="ms-auto">
              <button className='user-btn'>Welcome {username}</button>
              <Nav.Link as={Link} to='/create'>Create new post</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          )}
          {!username && (
            <Nav className="ms-auto">
            <Nav.Link as={Link} to='/Login'>Login</Nav.Link>
            <Nav.Link as={Link} to='/Register'>Register</Nav.Link>
          </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;