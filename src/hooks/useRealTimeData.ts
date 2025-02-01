import { useState, useEffect } from 'react';
import { Product, DemandForecast, CategoryInsight } from '../types';
import { getPrediction } from '../utils/predictions';
import { mockProducts, mockCategoryInsights } from '../data/mockData';

// Simulated historical data (in a real app, this would come from your backend)
const historicalData: Record<string, number[]> = {
  '1': [120, 140, 135, 150, 145, 160, 155],
  '2': [180, 190, 185, 200, 195, 210, 205],
  '3': [75, 80, 85, 90, 85, 95, 90],
};

export function useRealTimeData(refreshRate: number = 5000) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[]>(mockCategoryInsights);
  const [forecast, setForecast] = useState<DemandForecast[]>([]);

  // Update data based on refresh rate
  useEffect(() => {
    const updateData = async () => {
      // Update products with new predictions
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          const historical = historicalData[product.id] || [];
          const predictedDemand = await getPrediction(product, historical);
          
          // Simulate some real-time stock changes
          const stockChange = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
          const newStock = Math.max(0, product.currentStock + stockChange);
          
          return {
            ...product,
            currentStock: newStock,
            predictedDemand,
          };
        })
      );
      
      setProducts(updatedProducts);

      // Update category insights
      const newInsights = mockCategoryInsights.map(insight => ({
        ...insight,
        totalStock: insight.totalStock + Math.floor(Math.random() * 50) - 25,
        averageDemand: insight.averageDemand + Math.floor(Math.random() * 20) - 10,
      }));
      setCategoryInsights(newInsights);

      // Update forecast
      const newForecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          predicted: Math.floor(Math.random() * 50) + 100,
          actual: i < 3 ? Math.floor(Math.random() * 50) + 100 : undefined,
        };
      });
      setForecast(newForecast);
    };

    // Initial update
    updateData();

    // Set up interval for real-time updates using the provided refresh rate
    const interval = setInterval(updateData, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]); // Add refreshRate to dependencies

  return {
    products,
    categoryInsights,
    forecast,
  };
}