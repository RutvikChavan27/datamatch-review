
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface ReportMetricsCardsProps {
  selectedReport: string;
  dateRange: string;
  department: string;
}

const ReportMetricsCards: React.FC<ReportMetricsCardsProps> = ({ selectedReport, dateRange, department }) => {
  // Mock data - in real app this would come from API
  const getMetricsData = () => {
    switch (selectedReport) {
      case 'processing-summary':
        return [
          {
            title: 'Documents Processed',
            value: '1,247',
            trend: '+12%',
            trendDirection: 'up',
            subtitle: 'vs last period',
            color: 'text-gray-900'
          },
          {
            title: 'Auto-Approved Rate',
            value: '87%',
            trend: 'Target: 85%',
            trendDirection: 'target-met',
            subtitle: '↑ Above target',
            color: 'text-green-600'
          },
          {
            title: 'Requiring Manual Review',
            value: '8%',
            trend: '+2%',
            trendDirection: 'up',
            subtitle: 'vs last period',
            color: 'text-orange-600'
          }
        ];
      case 'document-status':
        return [
          {
            title: 'Complete Sets',
            value: '324',
            trend: '+18',
            trendDirection: 'up',
            subtitle: 'since yesterday',
            color: 'text-gray-900'
          },
          {
            title: 'Pending Review',
            value: '23',
            trend: '+5',
            trendDirection: 'up',
            subtitle: 'from yesterday',
            color: 'text-blue-600'
          },
          {
            title: 'Exception Rate',
            value: '5.2%',
            trend: '-1.1%',
            trendDirection: 'down',
            subtitle: 'vs last week',
            color: 'text-red-600'
          }
        ];
      case 'exception-analysis':
        return [
          {
            title: 'Total Exceptions',
            value: '67',
            trend: '+8',
            trendDirection: 'up',
            subtitle: 'this period',
            color: 'text-gray-900'
          },
          {
            title: 'Avg Resolution Time',
            value: '4.2h',
            trend: '-0.8h',
            trendDirection: 'down',
            subtitle: 'improvement',
            color: 'text-green-600'
          },
          {
            title: 'Unresolved',
            value: '12',
            trend: 'Alert',
            trendDirection: 'alert',
            subtitle: '> 24h old',
            color: 'text-red-600'
          }
        ];
      default:
        return [];
    }
  };

  const metrics = getMetricsData();

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'target-met':
        return <Target className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">{metric.title}</p>
                <p className={`text-2xl font-semibold ${metric.color}`}>{metric.value}</p>
                <div className="flex items-center mt-2 space-x-1">
                  {getTrendIcon(metric.trendDirection)}
                  <span className="text-xs text-gray-500">
                    {metric.trend} {metric.subtitle}
                  </span>
                </div>
              </div>
              <div className="w-16 h-8 bg-gray-100 rounded flex items-center justify-center">
                <div className="w-8 h-1 bg-blue-500 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportMetricsCards;
