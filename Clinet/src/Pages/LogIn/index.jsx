import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LogIn = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const LoginUser = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.get('/');
      console.log(response.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Row noGutters>
              <Col md={6}>
                <Card.Img src="https://via.placeholder.com/300" alt="Image placeholder" />
              </Col>
              <Col md={6}>
                <Card.Body>
                  <Card.Title className="text-center">Log In</Card.Title>
                  <Form onSubmit={LoginUser}>
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
                      Log In
                    </Button>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
