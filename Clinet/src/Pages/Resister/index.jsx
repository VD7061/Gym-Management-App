import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const response = await axios.post('/register', { name, email, password });
      if(response.data.error){
        toast.error(response.data.error);
      } else {
        setData({
          name: '',
          email: '',
          password: ''
        });
        toast.success('User registered successfully');
        navigate('/Login');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('An error occurred while registering');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Row noGutters>
              <Col md={6}>
                <Card.Body>
                  <Card.Title className="text-center">Register</Card.Title>
                  <Form onSubmit={registerUser}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your name" 
                        value={data.name} 
                        onChange={(e) => setData({ ...data, name: e.target.value })} 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email" 
                        value={data.email} 
                        onChange={(e) => setData({ ...data, email: e.target.value })} 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Enter your password" 
                        value={data.password} 
                        onChange={(e) => setData({ ...data, password: e.target.value })} 
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Register
                    </Button>
                  </Form>
                </Card.Body>
              </Col>
              <Col md={6}>
                <Card.Img src="https://via.placeholder.com/300" alt="Image placeholder" />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
