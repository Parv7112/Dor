// Example service file structure
// Services contain business logic and interact with the database/models

const exampleService = {
  // Example method
  async getExampleData() {
    try {
      // Business logic here
      return { message: 'Example service method' };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = exampleService;

