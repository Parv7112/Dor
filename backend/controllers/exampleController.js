// Example controller file structure
// Controllers handle HTTP requests and responses

const exampleService = require('../services/exampleService');

const exampleController = {
  // Example GET handler
  async getExample(req, res, next) {
    try {
      const data = await exampleService.getExampleData();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  // Example POST handler
  async createExample(req, res, next) {
    try {
      // Controller logic here
      res.status(201).json({
        success: true,
        message: 'Example created successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = exampleController;

