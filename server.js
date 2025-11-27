const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect('process.env.MONGO_URL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Schema and Model
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API route for saving feedback
app.post('/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json({ success: true, message: 'Feedback received successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving feedback.' });
  }
});

// API route to fetch feedback
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback.' });
  }
});

//for the registration portal
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//  to start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Server running on Render');
});







