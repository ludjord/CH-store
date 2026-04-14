import Product from '../models/productModel.js';
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

export const createProduct = async (req, res) => {
  const { name, price, salePrice, category, stock, image } = req.body;
  try {
    const product = new Product({ name, price, salePrice, category, stock, image });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

export const updateProduct = async (req, res) => {
  const { name, price, salePrice, category, stock, image } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.image = image || product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};
