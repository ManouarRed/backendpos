
const express = require('express');
const { readData, writeData, generateId } = require('../services/dataService');
const { protect } = require('../middleware/authMiddleware'); // All sales routes should be protected

const router = express.Router();

// GET /api/sales (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const sales = await readData('sales.json');
    // Sort by submissionDate descending (newest first)
    sales.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales: " + error.message });
  }
});

// POST /api/sales (Protected)
router.post('/', protect, async (req, res) => {
  const { items, totalAmount, paymentMethod, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || totalAmount == null || !paymentMethod) {
    return res.status(400).json({ message: "Missing required fields for sale (items, totalAmount, paymentMethod)." });
  }

  // Validate each item (basic validation)
  for (const item of items) {
      if (!item.productId || !item.title || !item.code || item.quantity == null || item.quantity <= 0 || item.unitPrice == null || item.finalPrice == null) {
          return res.status(400).json({ message: "Invalid sale item structure. Each item must have productId, title, code, quantity (>0), unitPrice, finalPrice." });
      }
  }
  
  try {
    const sales = await readData('sales.json');
    const newSale = {
      id: generateId('sale_'),
      items, // Assuming frontend sends correctly structured SaleItemRecord[]
      totalAmount: parseFloat(totalAmount),
      paymentMethod,
      submissionDate: new Date().toISOString(), // Server sets submission date
      notes: notes || '',
      submittedBy: req.user.id // Attach user who submitted the sale
    };
    sales.push(newSale);
    await writeData('sales.json', sales);
    
    // IMPORTANT: Stock update logic is currently handled by the frontend calling a separate product stock update endpoint.
    // For more robust/atomic operations, this could be integrated here, but it adds complexity.
    // The current frontend `productService.submitSaleToHistory` calls `updateStock` for each item.
    // If that fails, the sale is submitted but stock might not be updated, or vice-versa if `updateStock` is called first.
    // True atomicity would require a transaction if using a DB, or careful handling here.

    res.status(201).json(newSale);
  } catch (error) {
    console.error("Error submitting sale:", error);
    res.status(500).json({ message: "Failed to submit sale: " + error.message });
  }
});

// PUT /api/sales/:id (Protected)
router.put('/:id', protect, async (req, res) => {
  const saleId = req.params.id;
  const updatedSaleData = req.body;

  // Basic validation of incoming data
  if (!updatedSaleData.items || !Array.isArray(updatedSaleData.items) || updatedSaleData.totalAmount == null || !updatedSaleData.paymentMethod) {
    return res.status(400).json({ message: "Invalid sale data for update. Items, totalAmount, and paymentMethod are required." });
  }
   for (const item of updatedSaleData.items) {
      if (!item.productId || !item.title || !item.code || item.quantity == null || item.quantity <= 0 || item.unitPrice == null || item.finalPrice == null) {
          return res.status(400).json({ message: "Invalid sale item structure in update. Each item must have productId, title, code, quantity (>0), unitPrice, finalPrice." });
      }
  }

  try {
    let sales = await readData('sales.json');
    const saleIndex = sales.findIndex(s => s.id === saleId);

    if (saleIndex === -1) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Preserve original submissionDate and submittedBy if not explicitly provided in update (usually they shouldn't be changed)
    const originalSale = sales[saleIndex];
    sales[saleIndex] = {
      ...originalSale, // Keep original fields like ID, submissionDate, submittedBy
      ...updatedSaleData, // Apply updates from body
      id: saleId, // Ensure ID is not changed by body
      submissionDate: originalSale.submissionDate, // Keep original submission date
      submittedBy: originalSale.submittedBy, // Keep original submitter
      totalAmount: parseFloat(updatedSaleData.totalAmount) // Ensure totalAmount is a number
    };
    
    await writeData('sales.json', sales);
    
    // Note on stock adjustments for edited sales:
    // This backend route only updates the sale record.
    // If item quantities in an *existing* sale are changed, the difference in stock
    // (original sale item qty vs. new sale item qty) needs to be manually adjusted
    // by an admin or through a more sophisticated stock reconciliation process.
    // The frontend SaleEditModal currently sends absolute quantities.
    // The backend does not automatically calculate stock deltas for sale edits.

    res.json(sales[saleIndex]);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale: " + error.message });
  }
});


module.exports = router;
