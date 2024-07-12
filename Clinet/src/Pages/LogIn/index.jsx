import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import loginImage from '../../assets/dragon-scales.svg';
import '../../App.css';

const LogIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data: response } = await axios.post('/login', values);
      if (response.error) {
        toast.error(response.error);
      } else {
        login(response.token);
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="mainbody " style={{ width: '100%', height: '100vh' , fontFamily: 'Poppins'}}>
      <Row >
        <Col xs={12} md={6} className="loginBody p-3" style={{ background: "#F5F5F5", height: '100vh', padding: 0 }}>
          <div className="d-flex flex-column" style={{ height: '100%', color:"#8008A9" }}>
            <div className="logo p-2 d-flex align-items-center" >
              <div
                className="dot"
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#8008A9',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '10px'
                }}
              ></div>
              <h6 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', margin: 0, lineHeight: '1' }}>GymGuard</h6>
            </div>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <div className="loginForm w-100" style={{ maxWidth: "400px", textAlign: "left" }}>
                <h5 className="text-left mb-3">Welcome Back</h5>
                <h6 className="text-left mb-4 mt-2" style={{fontSize:"17px" , color:"#69645F"}}>Hi nice to see you again , Please enter your details</h6>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && !!errors.email}
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                      <Button style={{background:"#7707A0"}} type="submit" className="w-100" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="spinner"></div>
                        ) : (
                          'Log In'
                        )}
                      </Button>
                      <div className="text-center mt-3">
                        <a href="/forgot-password"  style={{color:"#7707A0",fontSize:"15px"}}>Forgot Password?</a>
                        <div>
                        <span style={{color:"#7707A0" , fontSize:"15px"}}>New here?</span><Link to="/register"  style={{color:"#7707A0" , fontSize:"15px"}}>Register here</Link>
                        </div>
                        
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6} className="imageBody" style={{ background: "#EAEAEE", height: '100vh', padding: 0 }}>
        <img src={loginImage} alt="loginImage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
