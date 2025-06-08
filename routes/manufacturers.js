
const express = require('express');
const { readData, writeData, generateId } = require('../services/dataService');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Define necessary constants directly within the backend context
const UNKNOWN_MANUFACTURER_ID = 'man_unknown';

const router = express.Router();

// GET /api/manufacturers (Public)
router.get('/', async (req, res) => {
  try {
    const manufacturers = await readData('manufacturers.json');
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch manufacturers: " + error.message });
  }
});

// POST /api/manufacturers (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: "Manufacturer name is required and must be a non-empty string." });
  }
  try {
    const manufacturers = await readData('manufacturers.json');
    if (manufacturers.some(m => m.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(400).json({ message: `Manufacturer name "${name.trim()}" already exists.` });
    }
    const newManufacturer = { id: generateId('man_'), name: name.trim() };
    manufacturers.push(newManufacturer);
    await writeData('manufacturers.json', manufacturers);
    res.status(201).json(newManufacturer);
  } catch (error) {
    res.status(500).json({ message: "Failed to add manufacturer: " + error.message });
  }
});

// PUT /api/manufacturers/:id (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  const manufacturerId = req.params.id;
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: "Manufacturer name is required and must be a non-empty string." });
  }
  if (manufacturerId === UNKNOWN_MANUFACTURER_ID) {
    return res.status(400).json({ message: "The 'Unknown Manufacturer' cannot be modified."});
  }
  try {
    let manufacturers = await readData('manufacturers.json');
    const manufacturerIndex = manufacturers.findIndex(m => m.id === manufacturerId);
    if (manufacturerIndex === -1) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }
    if (manufacturers.some(m => m.id !== manufacturerId && m.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(400).json({ message: `Manufacturer name "${name.trim()}" already exists.` });
    }
    manufacturers[manufacturerIndex].name = name.trim();
    await writeData('manufacturers.json', manufacturers);
    res.json(manufacturers[manufacturerIndex]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update manufacturer: " + error.message });
  }
});

// DELETE /api/manufacturers/:id (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  const manufacturerId = req.params.id;

  if (manufacturerId === UNKNOWN_MANUFACTURER_ID) {
    return res.status(400).json({ success: false, message: "The 'Unknown Manufacturer' cannot be deleted." });
  }

  try {
    let manufacturers = await readData('manufacturers.json');
    const manufacturerExists = manufacturers.some(m => m.id === manufacturerId);
    if (!manufacturerExists) {
      return res.status(404).json({ success: false, message: 'Manufacturer not found.' });
    }

    manufacturers = manufacturers.filter(m => m.id !== manufacturerId);
    await writeData('manufacturers.json', manufacturers);

    // Reassign products associated with the deleted manufacturer
    let products = await readData('products.json');
    let productsModified = false;
    products.forEach(p => {
      if (p.manufacturerId === manufacturerId) {
        p.manufacturerId = UNKNOWN_MANUFACTURER_ID; // UNKNOWN_MANUFACTURER_ID should exist
        productsModified = true;
      }
    });
    if (productsModified) {
      await writeData('products.json', products);
    }

    res.status(200).json({ success: true, message: 'Manufacturer deleted successfully. Associated products have been reassigned.' });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete manufacturer: " + error.message });
  }
});

module.exports = router;