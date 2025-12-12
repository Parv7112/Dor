const artisanService = require('../services/artisanService');

const artisanController = {
  async getAllArtisans(req, res, next) {
    try {
      const artisans = await artisanService.getAllArtisans();
      res.status(200).json({
        success: true,
        data: artisans,
      });
    } catch (error) {
      next(error);
    }
  },

  async getArtisanById(req, res, next) {
    try {
      const artisan = await artisanService.getArtisanById(req.params.id);
      res.status(200).json({
        success: true,
        data: artisan,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = artisanController;

