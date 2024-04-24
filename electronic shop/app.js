const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 9090;
// Serve static files
app.use(express.static(__dirname + '/public'));

// Connect to MongoDB
const client = new MongoClient('mongodb+srv://ankith:sMvfywQlpWurzQyI@cluster0.ozw9bga.mongodb.net/', { useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    // Set up database and collection
    const db = client.db('login');
    const usersCollection = db.collection('users');

    // Define user schema
    const userSchema = {
      username: String,
      password: String,
      name: String,
      email: String,
      phone: String
    };

    // Create user model
    const UserModel = {
      // Function to create a new user
      createUser: async function (userData) {
        try {
          await usersCollection.insertOne(userData);
          return { success: true };
        } catch (error) {
          console.error('Error creating user:', error);
          return { success: false, error: 'Error creating user' };
        }
      },
      // Function to find a user by username and password
      findUserByUsernameAndPassword: async function (username, password) {
        try {
          return await usersCollection.findOne({ username, password });
        } catch (error) {
          console.error('Error finding user:', error);
          return null;
        }
      }
    };

    // Registration route
    app.post('/register', async (req, res) => {
      try {
        const userData = {
          username: req.body.username,
          password: req.body.password,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone
        };
        const result = await UserModel.createUser(userData);
        if (result.success) {
          res.send('<script>alert("Registration Successful"); window.location.href="/";</script>');
        } else {
          res.status(500).send(`<script>alert("${result.error}"); window.location.href="/register.html";</script>`);
        }
      } catch (error) {
        res.status(500).send(`<script>alert("Error registering user"); window.location.href="/register.html";</script>`);
      }
    });

    // Login route
    app.post('/login', async (req, res) => {
      try {
        const user = await UserModel.findUserByUsernameAndPassword(req.body.username, req.body.password);
        if (!user) {
          return res.send('<script>alert("Username or password incorrect"); window.location.href="/";</script>');
        }
        res.send('<script>alert("Login Successful"); window.location.href="/index.html";</script>');
      } catch (error) {
        res.status(500).send('<script>alert("Error logging in"); window.location.href="/";</script>');
      }
    });

    // Routes to serve HTML files
    app.get(["/index.html","/index.html#product-cards"],(req,res)=>{
      res.sendFile(__dirname + '/index.html');
    });

    app.get("/about.html",(req,res)=>{
      res.sendFile(__dirname+'/about.html');
    });

    app.get('/contact.html',(req,res)=>{
      res.sendFile(__dirname+'/contact.html');
    });

    app.get('/',(req,res)=>{
      res.sendFile(__dirname+'/login.html');
    });

    app.get('/register.html',(req,res)=>{
      res.sendFile(__dirname+'/register.html');
    });

    app.get('/add-to-cart.html',(req,res)=>{
      res.sendFile(__dirname+'/add-to-cart.html');
    });

    app.get('/payment.html',(req,res)=>{
      res.sendFile(__dirname+'/payment.html');
    });

    app.get('/frount.html',(req,res)=>{
      res.sendFile(__dirname+'/frount.html');
    });

    app.get('/email.html',(req,res)=>{
      res.sendFile(__dirname+'/email.html');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log('Server is running on port 9010');
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
