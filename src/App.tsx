import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Package, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { InventoryTable } from './components/InventoryTable';
import { DemandChart } from './components/DemandChart';
import { StoreChat } from './components/StoreChat';
import { useRealTimeData } from './hooks/useRealTimeData';

function App() {
  const [refreshRate, setRefreshRate] = useState(5000); // Default to 5 seconds
  const [currentTime, setCurrentTime] = useState(new Date());
  const { products, categoryInsights, forecast } = useRealTimeData(refreshRate);

  // Update time based on refresh rate
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime(); // Initial update

    const timer = setInterval(updateTime, refreshRate);
    return () => clearInterval(timer);
  }, [refreshRate]);

  // Handle refresh rate change
  const handleRefreshRateChange = useCallback((newRate: number) => {
    setRefreshRate(newRate);
  }, []);

  // Calculate total predicted revenue
  const predictedRevenue = products.reduce(
    (total, product) => total + (product.predictedDemand * product.price),
    0
  );

  // Format the revenue in North American format ($#,###.##)
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(predictedRevenue);

  // Format the current date and time
  const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(currentTime);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Smart Grocery Inventory</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5000"
                    max="60000"
                    step="1000"
                    value={refreshRate}
                    onChange={(e) => handleRefreshRateChange(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">
                    {(refreshRate / 1000).toFixed(0)}s
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">{formattedDateTime}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Products">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-2xl font-bold">{products.length}</span>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Low Stock Alerts">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <span className="ml-2 text-2xl font-bold">
                {products.filter(p => p.currentStock < p.minThreshold).length}
              </span>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Predicted Revenue">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <span className="ml-2 text-2xl font-bold">
                {formattedRevenue}
              </span>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-6">
          <div className="lg:col-span-1">
            <DashboardCard title="Inventory Overview">
              <div className="h-[500px] overflow-auto">
                <InventoryTable products={products} />
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-1">
            <DashboardCard title="Demand Forecast">
              <DemandChart forecast={forecast} refreshRate={refreshRate} />
            </DashboardCard>
          </div>
        </div>

        <div className="mb-6">
          <DashboardCard title="Category Insights">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryInsights.map(insight => (
                <div key={insight.category} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{insight.category}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-600">
                      Total Stock: {insight.totalStock}
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg Demand: {insight.averageDemand}
                    </div>
                    <div className="text-sm text-gray-600">
                      Wastage Risk: {(insight.wastageRisk * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="fixed bottom-0 right-0 w-96 mb-4 mr-4 z-10">
          <StoreChat products={products} categoryInsights={categoryInsights} />
        </div>
      </main>
    </div>
  );
}

export default App;