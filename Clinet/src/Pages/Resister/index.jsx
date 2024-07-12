import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import registerImage from '../../assets/dragon-scales.svg';
import '../../App.css';

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    gymName: '', // Add gymName to initial values
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    gymName: Yup.string().required('Gym name is required'), // Add gymName validation
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/register', values);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        resetForm();
        toast.success('User registered successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('An error occurred while registering');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="mainbody" style={{ width: '100%', height: '100vh', fontFamily: 'Poppins' }}>
      <Row>
        <Col xs={12} md={6} className="imageBody" style={{ background: "#EAEAEE", height: '100vh', padding: 0 }}>
          <img src={registerImage} alt="registerImage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Col>
        <Col xs={12} md={6} className="registerBody p-3" style={{ background: "#F5F5F5", height: '100vh', padding: 0 }}>
          <div className="d-flex flex-column" style={{ height: '100%', color: "#8008A9" }}>
            <div className="logo p-2 d-flex align-items-center">
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
              <div className="registerForm w-100" style={{ maxWidth: "400px", textAlign: "left" }}>
                <h5 className="text-left mb-3">Join Us</h5>
                <h6 className="text-left mb-4 mt-2" style={{ fontSize: "17px", color: "#69645F" }}>Please fill in your details to create an account</h6>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.name && !!errors.name}
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
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
                      <Form.Group className="mb-3" controlId="formGymName">
                        <Form.Label>Gym Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your gym name"
                          name="gymName"
                          value={values.gymName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.gymName && !!errors.gymName}
                          className="custom-input"
                        />
                        <Form.Control.Feedback type="invalid">{errors.gymName}</Form.Control.Feedback>
                      </Form.Group>
                      <Button style={{ background: "#7707A0" }} type="submit" className="w-100" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="spinner"></div>
                        ) : (
                          'Register'
                        )}
                      </Button>
                      <div className="text-center mt-3">
                        <span style={{ color: "#7707A0", fontSize: "15px" }}>Already have an account?</span>
                        <Link to="/login" style={{ color: "#7707A0", fontSize: "15px" }}> Log In</Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
