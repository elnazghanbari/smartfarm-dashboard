// server.js - AgTech SmartFarm API for US Job Market
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to handle Cross-Origin requests and JSON parsing
app.use(cors());
app.use(express.json());

// Path to our database file
const DATA_PATH = path.join(__dirname, 'data', 'crops.json');

// Helper function to read data from JSON safely
const readCropData = () => {
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading database file:", error);
        return [];
    }
};

// Helper function to write data back to JSON safely
const writeCropData = (data) => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to database file:", error);
    }
};

/**
 * @route   GET /api/crops
 * @desc    Get all crops with their current soil moisture and water status
 * @access  Public
 */
app.get('/api/crops', (req, res) => {
    const crops = readCropData();
    res.status(200).json({
        success: true,
        count: crops.length,
        data: crops
    });
});

/**
 * @route   POST /api/sensor-data
 * @desc    Simulate receiving real-time soil sensor data and update status
 * @access  Public
 */
app.post('/api/sensor-data', (req, res) => {
    const { cropId, currentMoisture } = req.body;

    if (!cropId || currentMoisture === undefined) {
        return res.status(400).json({ success: false, message: "Please provide cropId and currentMoisture" });
    }

    let crops = readCropData();
    const cropIndex = crops.findIndex(c => c.id === parseInt(cropId));

    if (cropIndex === -1) {
        return res.status(404).json({ success: false, message: "Crop not found in system" });
    }

    // Business Logic: Check if moisture is below optimal threshold
    const optimal = parseInt(crops[cropIndex].optimalMoisture);
    const current = parseInt(currentMoisture);
    
    crops[cropIndex].currentMoisture = `${current}%`;
    crops[cropIndex].status = current < optimal ? "Needs Watering" : "Healthy";

    writeCropData(crops);

    res.status(200).json({
        success: true,
        message: `Sensor updated for ${crops[cropIndex].cropName}`,
        updatedCrop: crops[cropIndex]
    });
});

// Start the smart server
app.listen(PORT, () => {
    console.log(`🚀 SmartFarm AgTech Server running on http://localhost:${PORT}`);
});
