import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { DemandForecast } from '../types';

interface DemandChartProps {
  forecast: DemandForecast[];
  refreshRate: number;
}

interface TooltipData {
  x: number;
  y: number;
  values: {
    category: string;
    value: number;
    color: string;
    date: string;
  }[];
}

const CATEGORIES = [
  { name: 'Produce', color: '#22c55e' },
  { name: 'Dairy', color: '#3b82f6' },
  { name: 'Bakery', color: '#f59e0b' },
  { name: 'Meat & Seafood', color: '#ef4444' },
  { name: 'Pantry', color: '#8b5cf6' },
  { name: 'Beverages', color: '#06b6d4' },
  { name: 'Frozen Foods', color: '#6366f1' },
  { name: 'Snacks', color: '#ec4899' }
];

// Generate deterministic random number based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export function DemandChart({ forecast, refreshRate }: DemandChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [seed, setSeed] = useState(Date.now());

  // Update seed based on refresh rate
  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(Date.now());
    }, refreshRate);
    return () => clearInterval(interval);
  }, [refreshRate]);

  // Memoize category forecasts generation
  const categoryForecasts = useMemo(() => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    return CATEGORIES.map(category => ({
      category: category.name,
      color: category.color,
      data: dates.map((date, index) => {
        const seedValue = seed + index + category.name.length;
        const baseValue = 100 + Math.sin(index * 0.5) * 20;
        const variation = seededRandom(seedValue) * 20 - 10;
        const categoryTrend = 
          category.name === 'Produce' ? Math.sin(index * 0.2) * 15 :
          category.name === 'Frozen Foods' ? -Math.cos(index * 0.2) * 10 :
          category.name === 'Beverages' ? (index % 7 === 0 ? 15 : 0) :
          0;

        return {
          date,
          value: Math.round(baseValue + variation + categoryTrend)
        };
      })
    }));
  }, [seed]); // Only regenerate when seed changes

  // Calculate max value with a fallback
  const maxValue = useMemo(() => Math.max(
    100,
    ...categoryForecasts.flatMap(cf => cf.data?.map(d => d.value) || [])
  ), [categoryForecasts]);

  const gridLines = useMemo(() => [0, 25, 50, 75, 100].map(percentage => ({
    y: percentage,
    value: Math.max(0, Math.round((maxValue - (maxValue * percentage) / 100) || 0))
  })), [maxValue]);

  // Debounced mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Find the closest data point for each category
    const dataIndex = Math.round((x / 100) * 29); // 30 days - 1
    
    if (dataIndex >= 0 && dataIndex < 30) {
      const values = categoryForecasts.map(forecast => ({
        category: forecast.category,
        value: forecast.data[dataIndex].value,
        color: forecast.color,
        date: forecast.data[dataIndex].date
      }));

      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        values
      });
      setSvgDimensions({ width: rect.width, height: rect.height });
    }
  }, [categoryForecasts]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Y-axis:</span> Predicted Units of Demand
        </div>
        <div className="text-xs text-gray-500">
          * Using placeholder ML predictions
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[400px]">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {gridLines.map(({ y, value }) => (
            <g key={y}>
              <line
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
              <text
                x="-5"
                y={y}
                fontSize="3"
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#6b7280"
              >
                {value.toString()}
              </text>
              <text
                x="-5"
                y={y + 3}
                fontSize="2"
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#9ca3af"
              >
                units
              </text>
            </g>
          ))}

          {/* Category lines */}
          {categoryForecasts.map(forecast => (
            <path
              key={forecast.category}
              d={forecast.data?.map((point: any, i: number) => {
                const x = (i / (forecast.data.length - 1)) * 100;
                const y = ((maxValue - point.value) / maxValue) * 100;
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke={forecast.color}
              strokeWidth="1"
              className="transition-all duration-500 ease-in-out"
            />
          ))}

          {/* Vertical hover line */}
          {tooltip && (
            <line
              x1={tooltip.x * (100 / svgDimensions.width)}
              y1="0"
              x2={tooltip.x * (100 / svgDimensions.width)}
              y2="100"
              stroke="#9ca3af"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-sm pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: tooltip.x > svgDimensions.width / 2 ? 'translateX(-100%)' : 'translateX(0)'
            }}
          >
            <div className="font-medium text-gray-700 mb-1">
              {new Date(tooltip.values[0].date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            {tooltip.values
              .sort((a, b) => b.value - a.value)
              .map(({ category, value, color }) => (
                <div key={category} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-gray-600">{category}:</span>
                  </div>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
          </div>
        )}

        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          <span>Today</span>
          <span>15 days</span>
          <span>30 days</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        {CATEGORIES.map(category => (
          <div key={category.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-gray-700 truncate">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}