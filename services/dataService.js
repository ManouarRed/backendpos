
const fs = require('node:fs/promises'); // Using fs.promises for async operations
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

// Helper function to ensure data directory and a specific file exist
const ensureDataDirAndFile = async (fileName, defaultData = []) => {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Data directory ${DATA_DIR} not found, creating it...`);
      await fs.mkdir(DATA_DIR, { recursive: true });
    } else {
      console.error(`Error accessing data directory ${DATA_DIR}:`, error);
      throw error; // Re-throw if it's not a "directory not found" error
    }
  }

  const filePath = path.join(DATA_DIR, fileName);
  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Data file ${fileName} not found, creating with default data...`);
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    } else {
      console.error(`Error accessing data file ${fileName}:`, error);
      throw error;
    }
  }
};

const readData = async (fileName) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    await ensureDataDirAndFile(fileName, []); // Ensure file exists before reading
    const rawData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading data file ${fileName}:`, error);
    // If parsing fails or other read error, throw a more generic error
    throw new Error(`Could not read or parse data from ${fileName}. Ensure it's valid JSON.`);
  }
};

const writeData = async (fileName, data) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    await ensureDataDirAndFile(fileName, Array.isArray(data) ? [] : {}); // Ensure file exists
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing data file ${fileName}:`, error);
    throw new Error(`Could not write data to ${fileName}.`);
  }
};

// Generate a unique ID with a prefix
const generateId = (prefix = 'id_') => {
  return `${prefix}${uuidv4()}`;
};

module.exports = {
  readData,
  writeData,
  generateId,
  ensureDataDirAndFile,
  DATA_DIR // Export DATA_DIR if other modules need it directly, though usually not.
};
