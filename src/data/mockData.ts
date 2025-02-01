import { Product, DemandForecast, CategoryInsight } from '../types';

// Helper function to generate expiry dates
const getExpiryDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Initial products list
const initialProducts: Product[] = [
  // Produce
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'Produce',
    currentStock: 150,
    minThreshold: 50,
    price: 2.99,
    expiryDate: getExpiryDate(7),
    salesVelocity: 25,
    predictedDemand: 180,
    reorderPoint: 75,
    wastageRisk: 'high'
  },
  {
    id: '2',
    name: 'Organic Baby Spinach',
    category: 'Produce',
    currentStock: 80,
    minThreshold: 30,
    price: 4.99,
    expiryDate: getExpiryDate(5),
    salesVelocity: 15,
    predictedDemand: 95,
    reorderPoint: 40,
    wastageRisk: 'high'
  },
  {
    id: '3',
    name: 'Roma Tomatoes',
    category: 'Produce',
    currentStock: 200,
    minThreshold: 60,
    price: 1.99,
    expiryDate: getExpiryDate(6),
    salesVelocity: 35,
    predictedDemand: 220,
    reorderPoint: 80,
    wastageRisk: 'medium'
  },
  {
    id: '4',
    name: 'Avocados',
    category: 'Produce',
    currentStock: 120,
    minThreshold: 40,
    price: 1.49,
    expiryDate: getExpiryDate(4),
    salesVelocity: 30,
    predictedDemand: 140,
    reorderPoint: 60,
    wastageRisk: 'high'
  },
  {
    id: '5',
    name: 'Sweet Potatoes',
    category: 'Produce',
    currentStock: 180,
    minThreshold: 50,
    price: 1.29,
    expiryDate: getExpiryDate(14),
    salesVelocity: 20,
    predictedDemand: 160,
    reorderPoint: 70,
    wastageRisk: 'low'
  },
  {
    id: '6',
    name: 'Whole Milk',
    category: 'Dairy',
    currentStock: 200,
    minThreshold: 75,
    price: 3.99,
    expiryDate: getExpiryDate(10),
    salesVelocity: 40,
    predictedDemand: 220,
    reorderPoint: 100,
    wastageRisk: 'medium'
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    category: 'Dairy',
    currentStock: 150,
    minThreshold: 50,
    price: 5.99,
    expiryDate: getExpiryDate(14),
    salesVelocity: 25,
    predictedDemand: 170,
    reorderPoint: 70,
    wastageRisk: 'medium'
  },
  {
    id: '8',
    name: 'Sharp Cheddar',
    category: 'Dairy',
    currentStock: 100,
    minThreshold: 30,
    price: 6.99,
    expiryDate: getExpiryDate(30),
    salesVelocity: 15,
    predictedDemand: 110,
    reorderPoint: 40,
    wastageRisk: 'low'
  },
  {
    id: '9',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    currentStock: 85,
    minThreshold: 30,
    price: 4.49,
    expiryDate: getExpiryDate(5),
    salesVelocity: 15,
    predictedDemand: 90,
    reorderPoint: 45,
    wastageRisk: 'high'
  },
  {
    id: '10',
    name: 'Croissants',
    category: 'Bakery',
    currentStock: 60,
    minThreshold: 20,
    price: 1.99,
    expiryDate: getExpiryDate(2),
    salesVelocity: 20,
    predictedDemand: 75,
    reorderPoint: 30,
    wastageRisk: 'high'
  },
  {
    id: '11',
    name: 'Ground Beef 80/20',
    category: 'Meat & Seafood',
    currentStock: 120,
    minThreshold: 40,
    price: 5.99,
    expiryDate: getExpiryDate(5),
    salesVelocity: 25,
    predictedDemand: 130,
    reorderPoint: 60,
    wastageRisk: 'high'
  },
  {
    id: '12',
    name: 'Atlantic Salmon',
    category: 'Meat & Seafood',
    currentStock: 80,
    minThreshold: 25,
    price: 12.99,
    expiryDate: getExpiryDate(3),
    salesVelocity: 15,
    predictedDemand: 90,
    reorderPoint: 35,
    wastageRisk: 'high'
  },
  {
    id: '13',
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    currentStock: 150,
    minThreshold: 40,
    price: 15.99,
    expiryDate: getExpiryDate(365),
    salesVelocity: 10,
    predictedDemand: 130,
    reorderPoint: 50,
    wastageRisk: 'low'
  },
  {
    id: '14',
    name: 'Jasmine Rice',
    category: 'Pantry',
    currentStock: 200,
    minThreshold: 50,
    price: 8.99,
    expiryDate: getExpiryDate(365),
    salesVelocity: 15,
    predictedDemand: 180,
    reorderPoint: 70,
    wastageRisk: 'low'
  },
  {
    id: '15',
    name: 'Sparkling Water',
    category: 'Beverages',
    currentStock: 300,
    minThreshold: 100,
    price: 0.99,
    expiryDate: getExpiryDate(365),
    salesVelocity: 50,
    predictedDemand: 320,
    reorderPoint: 150,
    wastageRisk: 'low'
  },
  {
    id: '16',
    name: 'Orange Juice',
    category: 'Beverages',
    currentStock: 180,
    minThreshold: 60,
    price: 4.99,
    expiryDate: getExpiryDate(14),
    salesVelocity: 30,
    predictedDemand: 200,
    reorderPoint: 80,
    wastageRisk: 'medium'
  },
  {
    id: '17',
    name: 'Frozen Pizza',
    category: 'Frozen Foods',
    currentStock: 150,
    minThreshold: 40,
    price: 6.99,
    expiryDate: getExpiryDate(180),
    salesVelocity: 20,
    predictedDemand: 160,
    reorderPoint: 60,
    wastageRisk: 'low'
  },
  {
    id: '18',
    name: 'Ice Cream',
    category: 'Frozen Foods',
    currentStock: 100,
    minThreshold: 30,
    price: 5.99,
    expiryDate: getExpiryDate(180),
    salesVelocity: 25,
    predictedDemand: 120,
    reorderPoint: 40,
    wastageRisk: 'low'
  },
  {
    id: '19',
    name: 'Potato Chips',
    category: 'Snacks',
    currentStock: 250,
    minThreshold: 80,
    price: 3.99,
    expiryDate: getExpiryDate(60),
    salesVelocity: 40,
    predictedDemand: 270,
    reorderPoint: 100,
    wastageRisk: 'low'
  },
  {
    id: '20',
    name: 'Mixed Nuts',
    category: 'Snacks',
    currentStock: 120,
    minThreshold: 35,
    price: 8.99,
    expiryDate: getExpiryDate(90),
    salesVelocity: 15,
    predictedDemand: 130,
    reorderPoint: 45,
    wastageRisk: 'low'
  },
  {
    id: '21',
    name: 'Red Bell Peppers',
    category: 'Produce',
    currentStock: 90,
    minThreshold: 30,
    price: 1.29,
    expiryDate: getExpiryDate(7),
    salesVelocity: 20,
    predictedDemand: 100,
    reorderPoint: 40,
    wastageRisk: 'medium'
  }
];

// Generate additional products programmatically
const additionalProducts: Product[] = [
  // Produce
  'Carrots', 'Broccoli', 'Cauliflower', 'Green Beans', 'Cucumbers', 'Lettuce', 'Mushrooms',
  'Onions', 'Potatoes', 'Celery', 'Limes', 'Lemons', 'Apples', 'Oranges', 'Pears', 'Grapes',
  'Strawberries', 'Blueberries', 'Raspberries', 'Blackberries',
  
  // Dairy
  'Skim Milk', 'Almond Milk', 'Soy Milk', 'Heavy Cream', 'Half & Half', 'Butter', 'Cream Cheese',
  'Mozzarella', 'Swiss Cheese', 'Provolone', 'Cottage Cheese', 'Sour Cream',
  
  // Meat & Seafood
  'Chicken Breast', 'Pork Chops', 'Ground Turkey', 'Bacon', 'Tilapia', 'Shrimp', 'Cod',
  'Tuna Steaks', 'Lamb Chops', 'Italian Sausage',
  
  // Bakery
  'Bagels', 'Muffins', 'Dinner Rolls', 'Tortillas', 'Pita Bread', 'Sourdough Bread',
  'Hamburger Buns', 'Hot Dog Buns', 'English Muffins',
  
  // Pantry
  'Black Beans', 'Chickpeas', 'Pasta Sauce', 'Spaghetti', 'Peanut Butter', 'Honey',
  'Cereal', 'Granola', 'Coffee', 'Tea', 'Sugar', 'Flour', 'Vegetable Oil',
  
  // Beverages
  'Cola', 'Lemon-Lime Soda', 'Energy Drinks', 'Sports Drinks', 'Coffee Beans',
  'Green Tea', 'Apple Juice', 'Cranberry Juice',
  
  // Frozen Foods
  'Frozen Vegetables', 'Frozen Fruit', 'TV Dinners', 'Fish Sticks', 'French Fries',
  'Ice Cream Bars', 'Frozen Waffles', 'Frozen Burritos',
  
  // Snacks
  'Pretzels', 'Popcorn', 'Trail Mix', 'Crackers', 'Cookies', 'Chocolate Bars',
  'Granola Bars', 'Rice Cakes', 'Dried Fruit'
].map((name, index) => {
  const category = name.includes('Milk') || name.includes('Cheese') || name.includes('Cream') ? 'Dairy' :
                  name.includes('Frozen') ? 'Frozen Foods' :
                  name.includes('Juice') || name.includes('Soda') || name.includes('Drinks') ? 'Beverages' :
                  ['Pretzels', 'Popcorn', 'Trail Mix', 'Crackers', 'Cookies', 'Chocolate', 'Granola Bars', 'Rice Cakes', 'Dried Fruit'].includes(name) ? 'Snacks' :
                  ['Beans', 'Pasta', 'Peanut Butter', 'Honey', 'Cereal', 'Granola', 'Coffee', 'Tea', 'Sugar', 'Flour', 'Oil'].includes(name) ? 'Pantry' :
                  ['Bagels', 'Muffins', 'Rolls', 'Tortillas', 'Bread', 'Buns'].includes(name) ? 'Bakery' :
                  ['Chicken', 'Pork', 'Turkey', 'Bacon', 'Tilapia', 'Shrimp', 'Cod', 'Tuna', 'Lamb', 'Sausage'].includes(name) ? 'Meat & Seafood' :
                  'Produce';

  const baseStock = Math.floor(Math.random() * 150) + 50;
  const minThresh = Math.floor(baseStock * 0.3);
  const reorderPoint = Math.floor(baseStock * 0.4);
  const salesVel = Math.floor(Math.random() * 30) + 10;
  const predictedDem = baseStock + Math.floor(Math.random() * 30) - 15;

  return {
    id: `${initialProducts.length + index + 1}`,
    name,
    category,
    currentStock: baseStock,
    minThreshold: minThresh,
    price: Number((Math.random() * 15 + 1).toFixed(2)),
    expiryDate: getExpiryDate(category === 'Produce' ? 7 : 
                             category === 'Dairy' ? 14 :
                             category === 'Bakery' ? 5 :
                             category === 'Meat & Seafood' ? 5 :
                             category === 'Frozen Foods' ? 180 :
                             category === 'Snacks' ? 90 : 365),
    salesVelocity: salesVel,
    predictedDemand: predictedDem,
    reorderPoint,
    wastageRisk: category === 'Produce' || category === 'Bakery' || category === 'Meat & Seafood' ? 'high' :
                 category === 'Dairy' ? 'medium' : 'low'
  };
});

// Export combined products
export const mockProducts = [...initialProducts, ...additionalProducts];

export const mockForecast: DemandForecast[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    date: date.toISOString().split('T')[0],
    predicted: Math.floor(Math.random() * 50) + 100,
    actual: i < 3 ? Math.floor(Math.random() * 50) + 100 : undefined
  };
});

export const mockCategoryInsights: CategoryInsight[] = [
  {
    category: 'Produce',
    totalStock: 3500,
    averageDemand: 3200,
    wastageRisk: 0.15
  },
  {
    category: 'Dairy',
    totalStock: 2800,
    averageDemand: 2600,
    wastageRisk: 0.08
  },
  {
    category: 'Bakery',
    totalStock: 1200,
    averageDemand: 1100,
    wastageRisk: 0.12
  },
  {
    category: 'Meat & Seafood',
    totalStock: 1800,
    averageDemand: 1650,
    wastageRisk: 0.18
  },
  {
    category: 'Pantry',
    totalStock: 4200,
    averageDemand: 3800,
    wastageRisk: 0.05
  },
  {
    category: 'Beverages',
    totalStock: 3200,
    averageDemand: 3000,
    wastageRisk: 0.03
  },
  {
    category: 'Frozen Foods',
    totalStock: 2400,
    averageDemand: 2200,
    wastageRisk: 0.04
  },
  {
    category: 'Snacks',
    totalStock: 2800,
    averageDemand: 2600,
    wastageRisk: 0.06
  }
];