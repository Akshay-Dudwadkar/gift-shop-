const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
const bcrypt = require('bcryptjs');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/giftshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'giftshop-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');

// Create default admin
(async () => {
  try {
    const admin = await User.findOne({ email: 'test@gmail.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('test@123', 10);
      const newAdmin = new User({ 
        username: 'test@gmail.com', 
        email: 'test@gmail.com',
        password: hashedPassword,
        role: 'admin',
        name: 'Administrator'
      });
      await newAdmin.save();
      console.log('Default admin created');
    }
  } catch (err) {
    console.log(err);
  }
})();

// Routes
app.get('/', async (req, res) => {
  const products = await Product.find().limit(6);
  res.render('index', { products, session: req.session });
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.render('products', { products, session: req.session });
});

app.get('/cart', (req, res) => {
  res.render('cart', { session: req.session });
});

// User authentication routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user._id;
    req.session.username = user.username;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('register', { error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, name });
    await newUser.save();
    req.session.user = newUser._id;
    req.session.username = newUser.username;
    res.redirect('/');
  } catch (err) {
    res.render('register', { error: 'Registration failed' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && user.role === 'admin' && await bcrypt.compare(password, user.password)) {
    req.session.admin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Invalid admin credentials' });
  }
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session.admin) return res.redirect('/admin/login');
  res.render('admin/dashboard');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Admin routes
app.post('/admin/products', upload.single('image'), async (req, res) => {
  if (!req.session.admin) return res.redirect('/admin/login');
  const { name, description, price, stock, allowText, allowPhoto, allowColor } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const product = new Product({
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    image,
    customization: {
      allowText: allowText === 'on',
      allowPhoto: allowPhoto === 'on',
      allowColor: allowColor === 'on'
    }
  });
  await product.save();
  res.redirect('/admin/dashboard#products');
});

app.post('/admin/coupons', async (req, res) => {
  if (!req.session.admin) return res.redirect('/admin/login');
  const { code, discount, expiry } = req.body;
  const coupon = new Coupon({
    code,
    discount: parseFloat(discount),
    expiry: new Date(expiry)
  });
  await coupon.save();
  res.redirect('/admin/dashboard#coupons');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});