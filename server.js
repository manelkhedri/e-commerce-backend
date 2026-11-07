
const express = require('express');

const cors = require('cors');

const connectDB = require('./db');

const Product = require('./models/Product');

// Create an Express application
const app = express();

app.use(express.json());
app.use(cors());

// Define the server port
const PORT = 3000;

// Define the home route
app.get('/', (req, res) => {
  res.send('Welcome to GOLDEN HANDS Backend!');
});

// Get all products from MongoDB
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get a single product by ID from MongoDB
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the ID is valid
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Add a new product to MongoDB
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    res.status(400).json({
      message: 'Error adding product',
      error: error.message
    });
  }
});

// Update an existing product in MongoDB
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the ID is valid
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    res.status(400).json({
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete a product from MongoDB
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the ID is valid
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});