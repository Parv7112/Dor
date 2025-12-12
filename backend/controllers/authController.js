const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      // Get image URL - either from uploaded file or from request body
      let imageUrl = null;
      if (req.file) {
        // Image uploaded via multer
        imageUrl = `/api/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        // Image URL provided in request body (uploaded separately)
        imageUrl = req.body.image;
      }

      const userData = {
        ...req.body,
        image: imageUrl,
      };

      const result = await authService.register(userData);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

