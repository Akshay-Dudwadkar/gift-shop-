# Gift Shop Website

A professional gift shopping website with admin dashboard, user authentication, product customization, and order management.

## Features

- **User Authentication**: Secure login and registration with bcryptjs
- **Product Catalog**: Browse and filter gifts by categories
- **Customization**: Add personalized text and colors to gifts
- **Shopping Cart**: Add to cart with quantity management
- **Wishlist**: Save favorite items for later
- **Checkout**: Secure checkout process with order summary
- **Order History**: View past orders and order details
- **Admin Dashboard**: Manage products, coupons, and orders
- **Admin Login**: Separate admin authentication
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: EJS, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: bcryptjs, express-session
- **File Upload**: Multer
- **Body Parsing**: body-parser

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "gift website"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   Create a `.env` file in the root directory with the following variables: mongodb connection

   **Note**: Replace the credentials with your actual MongoDB Atlas credentials.

4. **Start the server**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main site: `http://localhost:3000`
   - Admin login: `http://localhost:3000/admin/login`

## Project Structure

```
.
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Coupon.js
├── routes/              # API and page routes
├── views/               # EJS templates
│   ├── index.ejs
│   ├── products.ejs
│   ├── cart.ejs
│   ├── checkout.ejs
│   ├── orders.ejs
│   ├── profile.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── wishlist.ejs
│   └── admin/
│       ├── dashboard.ejs
│       └── login.ejs
├── public/              # Static files
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   └── script.js
│   └── uploads/         # User-uploaded product images
├── .env                 # Environment variables (not in git)
├── .gitignore           # Git ignore file
├── server.js            # Main server file
├── package.json         # Project dependencies
└── README.md            # This file
```

## Available Routes

### User Routes
- `GET /` - Home page
- `GET /products` - Products page
- `GET /login` - User login page
- `POST /login` - User login
- `GET /register` - Registration page
- `POST /register` - Register new user
- `GET /cart` - Shopping cart
- `GET /checkout` - Checkout page
- `POST /checkout` - Place order
- `GET /orders` - View user orders
- `GET /profile` - User profile
- `GET /wishlist` - Wishlist page

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin authentication
- `GET /admin/dashboard` - Admin dashboard
- `POST /admin/products` - Add new product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `PORT` | Server port | `3000` |
| `SESSION_SECRET` | Secret key for sessions | `your-secret-key` |

## Security Notes

- ⚠️ **Never commit `.env` file** - It contains sensitive credentials
- The `.env` file is listed in `.gitignore` to prevent accidental commits
- Always use strong passwords for MongoDB
- Use environment variables for all sensitive data
- Implement rate limiting for production
- Enable HTTPS in production

## Running the Server

**Development (with nodemon)**
```bash
npm run dev
```

**Production**
```bash
npm start
```

## Troubleshooting

### Port 3000 already in use
Kill the process using port 3000:
```powershell
$processes = Get-Process node -ErrorAction SilentlyContinue
if ($processes) { $processes | Stop-Process -Force }
```

### MongoDB connection error
- Verify `MONGO_URI` in `.env`
- Ensure MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas
- Verify username and password are correctly URL-encoded

### Module not found errors
```bash
npm install
```

## Default Credentials

Create admin and user accounts through the application interface or database.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: February 19, 2026
