
const express = require('express');
const { readData, writeData, generateId } = require('../services/dataService');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to enrich product data
const enrichProduct = (product, categories, manufacturers) => {
  if (!product) return null;
  const category = categories.find(c => c.id === product.categoryId);
  const manufacturer = manufacturers.find(m => m.id === product.manufacturerId);
  const totalStock = Array.isArray(product.sizes) ? product.sizes.reduce((sum, sizeEntry) => sum + (sizeEntry.stock || 0), 0) : 0;
  return {
    ...product,
    categoryName: category ? category.name : 'N/A',
    manufacturerName: manufacturer ? manufacturer.name : 'N/A',
    totalStock,
  };
};

// GET /api/products (Public - for POS, filters by isVisible=true)
router.get('/', async (req, res) => {
  try {
    const allProducts = await readData('products.json');
    const categories = await readData('categories.json');
    const manufacturers = await readData('manufacturers.json');
    
    let productsToReturn = allProducts.filter(p => p.isVisible === true);
    const { q, categoryId } = req.query;

    if (q) {
      const lowerQuery = q.toLowerCase();
      productsToReturn = productsToReturn.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.code.toLowerCase().includes(lowerQuery)
      );
    }
    if (categoryId && categoryId !== "All Categories") {
      productsToReturn = productsToReturn.filter(p => p.categoryId === categoryId);
    }

    const enrichedProducts = productsToReturn.map(p => enrichProduct(p, categories, manufacturers));
    res.json(enrichedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products: " + error.message });
  }
});

// GET /api/products/admin (Admin only - all products)
router.get('/admin', protect, isAdmin, async (req, res) => {
  try {
    const products = await readData('products.json');
    const categories = await readData('categories.json');
    const manufacturers = await readData('manufacturers.json');
    const enrichedProducts = products.map(p => enrichProduct(p, categories, manufacturers));
    res.json(enrichedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin products: " + error.message });
  }
});

// GET /api/products/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const products = await readData('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const categories = await readData('categories.json');
    const manufacturers = await readData('manufacturers.json');
    res.json(enrichProduct(product, categories, manufacturers));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product by ID: " + error.message });
  }
});

// POST /api/products (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  const { title, code, price, categoryId, manufacturerId, sizes, image, isVisible } = req.body;
  if (!title || !code || price == null || !categoryId || !manufacturerId || !sizes || image === undefined) {
    return res.status(400).json({ message: "Missing required product fields (title, code, price, categoryId, manufacturerId, sizes, image)." });
  }
  try {
    const products = await readData('products.json');
    if (products.some(p => p.code.toLowerCase() === code.trim().toLowerCase())) {
      return res.status(400).json({ message: `Product code "${code.trim()}" already exists.` });
    }

    let parsedSizes;
    try {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      if (!Array.isArray(parsedSizes) || !parsedSizes.every(s => typeof s.size === 'string' && typeof s.stock === 'number' && s.stock >= 0)) {
        throw new Error();
      }
    } catch (e) {
      return res.status(400).json({ message: "Sizes must be a valid JSON array of {size: string, stock: number (>=0)}." });
    }

    const newProduct = {
      id: generateId('prod_'),
      title: title.trim(),
      code: code.trim(),
      price: parseFloat(price),
      categoryId,
      manufacturerId,
      sizes: parsedSizes,
      image: image.trim(),
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    };
    products.push(newProduct);
    await writeData('products.json', products);
    
    const categoriesData = await readData('categories.json');
    const manufacturersData = await readData('manufacturers.json');
    res.status(201).json(enrichProduct(newProduct, categoriesData, manufacturersData));
  } catch (error) {
    res.status(500).json({ message: "Failed to add product: " + error.message });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;
  try {
    let products = await readData('products.json');
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate required fields if they are being updated
    if (updatedData.code && products.some(p => p.id !== productId && p.code.toLowerCase() === updatedData.code.trim().toLowerCase())) {
        return res.status(400).json({ message: `Product code "${updatedData.code.trim()}" already exists.` });
    }
    
    let parsedSizes = products[productIndex].sizes;
    if (updatedData.sizes !== undefined) {
        try {
            const tempParsed = typeof updatedData.sizes === 'string' ? JSON.parse(updatedData.sizes) : updatedData.sizes;
            if (!Array.isArray(tempParsed) || !tempParsed.every(s => typeof s.size === 'string' && typeof s.stock === 'number' && s.stock >= 0)) {
                throw new Error("Invalid sizes format.");
            }
            parsedSizes = tempParsed;
        } catch (e) {
            return res.status(400).json({ message: "Invalid sizes format: " + e.message });
        }
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...updatedData,
      id: productId, // Ensure ID is not changed from body
      price: updatedData.price !== undefined ? parseFloat(updatedData.price) : products[productIndex].price,
      sizes: parsedSizes,
      isVisible: updatedData.isVisible !== undefined ? Boolean(updatedData.isVisible) : products[productIndex].isVisible,
    };
    if(updatedData.code) updatedProduct.code = updatedData.code.trim();
    if(updatedData.title) updatedProduct.title = updatedData.title.trim();


    products[productIndex] = updatedProduct;
    await writeData('products.json', products);

    const categoriesData = await readData('categories.json');
    const manufacturersData = await readData('manufacturers.json');
    res.json(enrichProduct(updatedProduct, categoriesData, manufacturersData));
  } catch (error) {
    res.status(500).json({ message: "Failed to update product: " + error.message });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    let products = await readData('products.json');
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    if (products.length < initialLength) {
      await writeData('products.json', products);
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product: " + error.message });
  }
});

// PATCH /api/products/:id/toggle-visibility (Admin only)
router.patch('/:id/toggle-visibility', protect, isAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    let products = await readData('products.json');
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    products[productIndex].isVisible = !products[productIndex].isVisible;
    await writeData('products.json', products);
    
    const categoriesData = await readData('categories.json');
    const manufacturersData = await readData('manufacturers.json');
    res.json(enrichProduct(products[productIndex], categoriesData, manufacturersData));
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle product visibility: " + error.message });
  }
});

// PUT /api/products/:productId/stock (Admin only or for POS after sale)
router.put('/:productId/stock', protect, async (req, res) => { // `isAdmin` removed to allow POS to update stock after sale if logic dictates
  const { productId } = req.params;
  const { sizeName, newStock, updatedSizesArray, action } = req.body;

  try {
    let products = await readData('products.json');
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    let productToUpdate = { ...products[productIndex] };
    let stockChanged = false;

    if (updatedSizesArray && Array.isArray(updatedSizesArray)) {
      // Scenario 1: Frontend sends the entire updated sizes array (e.g., from InventoryStockEditModal)
      productToUpdate.sizes = updatedSizesArray.map(s => ({
        size: String(s.size),
        stock: Math.max(0, Number(s.stock) || 0) // Ensure stock is non-negative number
      }));
      stockChanged = true;
    } else if (sizeName !== undefined && newStock !== undefined && action === 'sell') {
      // Scenario 2: Frontend sends a specific size update after a sale (decrement stock)
      const numNewStock = Number(newStock); // newStock here is actually quantitySold (negative)
      if(isNaN(numNewStock) || numNewStock > 0) {
        return res.status(400).json({ message: "For 'sell' action, newStock should be the negative quantity sold."});
      }
      const quantitySold = Math.abs(numNewStock);

      const sizeIndex = productToUpdate.sizes.findIndex(s => s.size === sizeName);
      if (sizeIndex === -1) {
        return res.status(400).json({ message: `Size "${sizeName}" not found for this product.` });
      }
      if (productToUpdate.sizes[sizeIndex].stock < quantitySold) {
        return res.status(400).json({ message: `Insufficient stock for size "${sizeName}". Available: ${productToUpdate.sizes[sizeIndex].stock}, Requested to sell: ${quantitySold}` });
      }
      productToUpdate.sizes[sizeIndex].stock -= quantitySold;
      stockChanged = true;
    } else if (sizeName !== undefined && newStock !== undefined) {
        // Scenario 3: Direct stock update for a single size (absolute value)
        const numNewStock = Number(newStock);
         if (isNaN(numNewStock) || numNewStock < 0) {
            return res.status(400).json({ message: "New stock value must be a non-negative number." });
        }
        const sizeIndex = productToUpdate.sizes.findIndex(s => s.size === sizeName);
        if (sizeIndex === -1) {
             productToUpdate.sizes.push({ size: sizeName, stock: numNewStock }); // Add new size if not found
        } else {
            productToUpdate.sizes[sizeIndex].stock = numNewStock;
        }
        stockChanged = true;
    } else {
      return res.status(400).json({ message: "Invalid stock update payload. Provide 'sizeName' & 'newStock', or 'updatedSizesArray', or 'action:sell' with size and negative quantity." });
    }
    
    if (stockChanged) {
        products[productIndex] = productToUpdate;
        await writeData('products.json', products);
    }

    const categoriesData = await readData('categories.json');
    const manufacturersData = await readData('manufacturers.json');
    res.json(enrichProduct(products[productIndex], categoriesData, manufacturersData));
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ message: "Failed to update product stock: " + error.message });
  }
});


// POST /api/products/:id/duplicate (Admin only)
router.post('/:id/duplicate', protect, isAdmin, async (req, res) => {
  const productIdToDuplicate = req.params.id;
  try {
    let products = await readData('products.json');
    const originalProduct = products.find(p => p.id === productIdToDuplicate);
    if (!originalProduct) {
      return res.status(404).json({ message: "Original product not found" });
    }

    const duplicatedProductData = JSON.parse(JSON.stringify(originalProduct)); // Deep copy
    duplicatedProductData.id = generateId('prod_');
    duplicatedProductData.code = `${originalProduct.code}_COPY_${Math.random().toString(36).substring(2, 6)}`;
    duplicatedProductData.title = `${originalProduct.title} (Copy)`;
    duplicatedProductData.isVisible = false; // Default to not visible

    products.push(duplicatedProductData);
    await writeData('products.json', products);

    const categoriesData = await readData('categories.json');
    const manufacturersData = await readData('manufacturers.json');
    res.status(201).json(enrichProduct(duplicatedProductData, categoriesData, manufacturersData));
  } catch (error) {
    res.status(500).json({ message: "Failed to duplicate product: " + error.message });
  }
});

module.exports = router;
