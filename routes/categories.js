
const express = require('express');
const { readData, writeData, generateId } = require('../services/dataService');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Define necessary constants directly within the backend context
const UNCATEGORIZED_ID = 'cat_uncategorized';

const router = express.Router();

// GET /api/categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await readData('categories.json');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories: " + error.message });
  }
});

// POST /api/categories (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: "Category name is required and must be a non-empty string." });
  }
  try {
    const categories = await readData('categories.json');
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(400).json({ message: `Category name "${name.trim()}" already exists.` });
    }
    const newCategory = { id: generateId('cat_'), name: name.trim() };
    categories.push(newCategory);
    await writeData('categories.json', categories);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to add category: " + error.message });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: "Category name is required and must be a non-empty string." });
  }
  if (categoryId === UNCATEGORIZED_ID) {
    return res.status(400).json({ message: "The 'Uncategorized' category cannot be modified."});
  }

  try {
    let categories = await readData('categories.json');
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (categories.some(c => c.id !== categoryId && c.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(400).json({ message: `Category name "${name.trim()}" already exists.` });
    }
    categories[categoryIndex].name = name.trim();
    await writeData('categories.json', categories);
    res.json(categories[categoryIndex]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category: " + error.message });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  const categoryId = req.params.id;

  if (categoryId === UNCATEGORIZED_ID) {
    return res.status(400).json({ success: false, message: "The 'Uncategorized' category cannot be deleted." });
  }

  try {
    let categories = await readData('categories.json');
    const categoryExists = categories.some(c => c.id === categoryId);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    categories = categories.filter(c => c.id !== categoryId);
    await writeData('categories.json', categories);

    // Reassign products associated with the deleted category to 'Uncategorized'
    let products = await readData('products.json');
    let productsModified = false;
    products.forEach(p => {
      if (p.categoryId === categoryId) {
        p.categoryId = UNCATEGORIZED_ID; // UNCATEGORIZED_ID should exist in categories.json
        productsModified = true;
      }
    });
    if (productsModified) {
      await writeData('products.json', products);
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully. Associated products have been moved to Uncategorized.' });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete category: " + error.message });
  }
});

module.exports = router;