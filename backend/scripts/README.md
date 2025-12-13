# Seed Test Data Script

This script adds test data for a specific user ID to the database.

## Usage

Run the seed script from the backend directory:

```bash
npm run seed
```

Or directly with node:

```bash
node scripts/seedTestData.js
```

## What it does

1. Connects to MongoDB using the connection string from `.env`
2. Checks if the user with ID `693c4715ad4f3e3a24605fd8` exists, creates one if not
3. Deletes any existing products for this user
4. Creates 10 test products across different categories:
   - Crafts (Traditional Puppets)
   - Clothing (Bandhani, Block Print)
   - Jewelry (Kundan, Meenakari)
   - Home Decor (Blue Pottery, Terracotta)
   - Art (Miniature Paintings)

## Test Products Created

- Traditional Kathputli Puppet Set
- Bandhani Silk Saree
- Silver Kundan Necklace
- Blue Pottery Vase
- Block Print Cotton Kurta
- Meenakari Silver Earrings
- Miniature Painting - Royal Court Scene
- Terracotta Decorative Plates
- Traditional Puppet Show Set
- Handwoven Rajasthani Shawl

## Requirements

- MongoDB must be running and accessible
- `.env` file must have `MONGODB_URI` configured
- User ID `693c4715ad4f3e3a24605fd8` will be used (created if doesn't exist)

