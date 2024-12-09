const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Person = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const MONGO_URI = 'mongodb://0.0.0.0:27017/PersonInfo';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
  
// Create a new person
const getNextSerialNo = async () => {
  const lastPerson = await Person.findOne().sort({ serialNo: -1 }).exec();
  return lastPerson ? lastPerson.serialNo + 1 : 1;
};
// Create a new person
app.post('/api/users', async (req, res) => {
  try {
    const nextSerialNo = await getNextSerialNo(); // Get the next serial number
    const { fullName, mobileNumber, birthday, address } = req.body;

    // Validate data before saving
    if (!fullName || !mobileNumber || !birthday || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = new Person({
      serialNo: nextSerialNo, // Assign the new serial number
      fullName,
      mobileNumber,
      birthday,
      address,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: err.message });
  }
});



// Get all users
app.get('/api/users', (req, res) => {
  Person.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message }));
});

// Get a user by ID
app.get('api/users/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    })
    .catch(err => res.status(500).json({ message: err.message }));
});


app.put('/api/users/:id', (req, res) => {
  const { fullName, mobileNumber, birthday, address } = req.body;

  Person.findByIdAndUpdate(req.params.id, { fullName, mobileNumber, birthday, address }, { new: true })
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    })
    .catch(err => res.status(400).json({ message: err.message }));
});


// Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
