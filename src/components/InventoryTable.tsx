import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Product } from '../types';

interface InventoryTableProps {
  products: Product[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  return (
    <div className="relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demand</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">{product.currentStock}</span>
                  {product.currentStock < product.minThreshold && (
                    <AlertTriangle className="ml-2 w-4 h-4 text-red-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.predictedDemand > product.currentStock ? (
                    <TrendingUp className="mr-2 w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-2 w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-900">{product.predictedDemand}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${product.wastageRisk === 'high' ? 'bg-red-100 text-red-800' : 
                    product.wastageRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {product.wastageRisk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}