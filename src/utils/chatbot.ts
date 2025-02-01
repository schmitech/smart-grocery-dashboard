import { Product, CategoryInsight } from '../types';

// Helper function to find products by category
const getProductsByCategory = (products: Product[], category: string): Product[] => {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

// Helper function to find category insights
const getCategoryInsight = (insights: CategoryInsight[], category: string): CategoryInsight | undefined => {
  return insights.find(i => i.category.toLowerCase() === category.toLowerCase());
};

// Helper function to get low stock items
const getLowStockItems = (products: Product[]): Product[] => {
  return products.filter(p => p.currentStock < p.minThreshold);
};

// Helper function to get high demand items
const getHighDemandItems = (products: Product[]): Product[] => {
  return products.filter(p => p.predictedDemand > p.currentStock);
};

export async function generateResponse(
  question: string,
  products: Product[],
  categoryInsights: CategoryInsight[]
): Promise<string> {
  const q = question.toLowerCase();

  // Check for low stock items
  if (q.includes('low stock') || q.includes('running low')) {
    const lowStock = getLowStockItems(products);
    if (lowStock.length === 0) return "All items are currently well-stocked!";
    return `There are ${lowStock.length} items running low on stock: ${lowStock.map(p => p.name).join(', ')}`;
  }

  // Check for high demand items
  if (q.includes('high demand') || q.includes('popular')) {
    const highDemand = getHighDemandItems(products);
    if (highDemand.length === 0) return "No items are currently in unusually high demand.";
    return `These items are in high demand: ${highDemand.map(p => p.name).join(', ')}`;
  }

  // Check for category-specific questions
  const categories = ['produce', 'dairy', 'bakery', 'meat', 'pantry', 'beverages', 'frozen', 'snacks'];
  for (const category of categories) {
    if (q.includes(category)) {
      const categoryProducts = getProductsByCategory(products, category);
      const insight = getCategoryInsight(categoryInsights, category);
      
      if (categoryProducts.length === 0) return `I don't have any information about ${category} products.`;
      
      return `
        ${category.charAt(0).toUpperCase() + category.slice(1)} department summary:
        - Total products: ${categoryProducts.length}
        - Total stock: ${insight?.totalStock || 'N/A'}
        - Average demand: ${insight?.averageDemand || 'N/A'}
        - Wastage risk: ${(insight?.wastageRisk || 0) * 100}%
        - Low stock items: ${getLowStockItems(categoryProducts).length}
      `;
    }
  }

  // Check for total inventory
  if (q.includes('total inventory') || q.includes('total stock')) {
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
    return `The total inventory across all categories is ${totalStock} units.`;
  }

  // Check for wastage risk
  if (q.includes('wastage') || q.includes('waste')) {
    const highRisk = products.filter(p => p.wastageRisk === 'high');
    return `There are ${highRisk.length} products with high wastage risk: ${highRisk.map(p => p.name).join(', ')}`;
  }

  // Default response
  return "I can help you with information about inventory levels, demand forecasts, and category performance. Try asking about specific categories, low stock items, or high demand products!";
}