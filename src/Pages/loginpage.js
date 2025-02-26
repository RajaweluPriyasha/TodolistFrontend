import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, FormCheck } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if credentials are stored in localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('rememberedUsername');
    const storedPassword = localStorage.getItem('rememberedPassword');

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true); // Automatically check "Remember Me" if credentials are found
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('token', response.data.token);

      // Save credentials to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
        localStorage.setItem('rememberedPassword', password);
      } else {
        // Clear stored credentials if "Remember Me" is unchecked
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
      }

      navigate('/tasks'); // Redirect to tasks page after successful login
    } catch (error) {
      setError('Invalid username or password.');
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
        <Card className="p-4 shadow" style={{ maxWidth: '400px', margin: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Card.Body>
            {/* Login Header with Image */}
            <div className="d-flex align-items-center justify-content-center mb-4">
              <img
                src="./images/login.jpg" // Replace with your image path
                alt="Login Icon"
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              <h2 style={{ color: '#6a11cb', margin: 0 }}>Login</h2>
            </div>

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Login Form */}
            <Form onSubmit={handleLogin}>
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

              {/* Remember Me Checkbox */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember Me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            {/* Register Link */}
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <Button
                variant="link"
                onClick={() => navigate('/register')}
                style={{ color: '#6a11cb' }}
              >
                Register here
              </Button>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;