import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', { username, password });
      alert(response.data.message); // Show success message
      navigate('/'); // Redirect to login page
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(./images/bg.gif)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Card className="p-4 shadow" style={{ maxWidth: '400px', margin: 'auto' }}>
          <Card.Body>
            {/* Register Header with Image */}
            <div className="d-flex align-items-center justify-content-center mb-4">
              <img
                src="./images/login.jpg" 
                alt="Login Icon"
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              <h2 style={{ color: '#6a11cb', margin: 0 }}>Register</h2>
            </div>

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Registration Form */}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                Register
              </Button>
            </Form>

            {/* Login Link */}
            <p className="text-center mt-3">
              Already have an account?{' '}
              <Button
                variant="link"
                onClick={() => navigate('/')}
                style={{ color: '#6a11cb' }}
              >
                Login here
              </Button>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;