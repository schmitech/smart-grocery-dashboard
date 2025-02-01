import { Product } from '../types';

// Simple statistical model for fallback predictions
export function calculateSimpleForecast(historicalData: number[]): number {
  if (historicalData.length === 0) return 0;
  
  // Calculate moving average and basic trend
  const recentValues = historicalData.slice(-7); // Last 7 days
  const average = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  
  // Simple trend calculation
  const trend = recentValues.length > 1 
    ? (recentValues[recentValues.length - 1] - recentValues[0]) / recentValues.length 
    : 0;
  
  return Math.max(0, Math.round(average + trend));
}

export async function getPrediction(
  product: Product, 
  historicalData: number[]
): Promise<number> {
  try {
    // Use Vite's import.meta.env instead of process.env
    const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;
    
    if (apiKey) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large",
        {
          headers: { 
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            inputs: {
              historical_data: historicalData,
              product_category: product.category,
              current_stock: product.currentStock,
              sales_velocity: product.salesVelocity
            }
          }),
        }
      );

      if (!response.ok) throw new Error('Hugging Face API error');
      
      const result = await response.json();
      return Math.round(result.prediction);
    } else {
      // If no API key is available, use the fallback
      throw new Error('No API key available');
    }
  } catch (error) {
    // Use fallback prediction model
    return calculateSimpleForecast(historicalData);
  }
}