const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const port = 7890;

// Middleware to parse JSON body - must be before routes!
app.use(express.json());

const users = {}; // In-memory user storage don't use external database
 
// Create user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  // Validate name
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Enter the name' }); 
  }

  // Validate email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Enter valid email' }); 
  }

  // Validate age
  if (!Number.isInteger(age) || age <= 0) {
    return res.status(400).json({ error: 'Age must be a positive integer' });
  } 

  // Create user with unique id
  const id = uuidv4();
  const user = { id, name, email, age };
  users[id] = user; 

  return res.status(201).json(user);
});

// Read user by ID
app.get('/show/:id', (req, res) => {
  const user = users[req.params.id];  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
});

// Update user by ID
app.put('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) {  
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, age } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string.' });
    }
    user.name = name;
  }

  if (email !== undefined) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email must be valid.' });
    }
    user.email = email;
  }

  if (age !== undefined) {
    if (!Number.isInteger(age) || age <= 0) {
      return res.status(400).json({ error: 'Age must be a positive integer.' });
    }
      
  }

  return res.json(user);
});

// Delete user by ID
app.delete('/rm/:id', (req, res) => {
  if (!users[req.params.id]) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete users[req.params.id];
  return res.status(200).json({ message: 'User deleted successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});


 
