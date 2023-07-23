import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic here
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
