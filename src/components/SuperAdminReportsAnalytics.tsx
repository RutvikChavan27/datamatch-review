import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, TrendingUp, TrendingDown, Folder, HardDrive, BarChart3, ChevronDown, Check, Settings, Users, Database, Workflow, Clock, Shield, FileText, X, Upload, Eye, CheckCircle, Trophy, XCircle, UserCheck, UsersRound, Activity, Hash, Tag, AlertCircle, Info, CalendarIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as ChartTooltip, BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GenerateDataMatchReportModal } from './GenerateDataMatchReportModal';
import { GenerateProductivityEngineReportModal } from './GenerateProductivityEngineReportModal';
import RecentActivity from './RecentActivity';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState('tenant-onboarded');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 7 days');
  const [isDataMatchModalOpen, setIsDataMatchModalOpen] = useState(false);
  const [isProductivityModalOpen, setIsProductivityModalOpen] = useState(false);
  const [isPOReportModalOpen, setIsPOReportModalOpen] = useState(false);
  const [poReportData, setPOReportData] = useState({
    vendors: [],
    departments: [],
    users: [],
    minValue: '',
    status: {
      approved: false,
      pending: false,
      rejected: false
    },
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    exportFormat: 'PDF'
  });

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">
            Reports & Analytics
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border flex items-center justify-between px-0">
        <div className="flex items-center flex-1 -mb-px pb-1">
          {[
            { key: 'tenant-onboarded', label: 'Tenant Onboarded' },
            { key: 'jobs-processed', label: 'Jobs Processed' },
            { key: 'document-processed', label: 'Document Processed' },
            { key: 'pages-processed', label: 'Pages Processed' },
            { key: 'user-onboarded', label: 'User Onboarded' }
          ].map((tab, index) => (
            <button
              key={tab.key}
              className={`
                px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative font-semibold
                ${index > 0 ? '-ml-px' : ''}
                ${activeTab === tab.key 
                  ? `bg-white text-gray-900 z-10 border-b-2 border-b-[#27313e] border-transparent rounded-t-md` 
                  : "text-muted-foreground hover:bg-gray-50 hover:text-gray-700 border-b-2 border-transparent"}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedTimeRange}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Year', 'Custom range'].map(option => (
                <DropdownMenuItem key={option} onClick={() => setSelectedTimeRange(option)} className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedTimeRange === option && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Generate PDF Report</DropdownMenuItem>
              <DropdownMenuItem>Generate Excel Report</DropdownMenuItem>
              <DropdownMenuItem>Generate CSV Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tenant Onboarded Tab */}
        <TabsContent value="tenant-onboarded" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Tenant Onboarded</h2>
              <p className="text-sm text-muted-foreground">Tenant onboarding analytics and performance metrics</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-4">
              {/* From Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1 opacity-0">Reset</label>
                <Button className="w-20">Reset</Button>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Tenant Onboarding Metrics</h3>
              </div>

              {/* Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const getChartData = () => {
                        switch (selectedTimeRange) {
                          case 'Last 7 days':
                            return [
                              { day: 'Mon 4/22', onboarded: 5, active: 18, inactive: 2 },
                              { day: 'Tue 4/23', onboarded: 3, active: 20, inactive: 1 },
                              { day: 'Wed 4/24', onboarded: 7, active: 24, inactive: 0 },
                              { day: 'Thu 4/25', onboarded: 4, active: 26, inactive: 2 },
                              { day: 'Fri 4/26', onboarded: 8, active: 31, inactive: 1 },
                              { day: 'Sat 4/27', onboarded: 2, active: 32, inactive: 1 },
                              { day: 'Sun 4/28', onboarded: 1, active: 32, inactive: 1 }
                            ];
                          case 'Last 30 days':
                            return [
                              { day: 'Week 1', onboarded: 22, active: 85, inactive: 8 },
                              { day: 'Week 2', onboarded: 18, active: 95, inactive: 12 },
                              { day: 'Week 3', onboarded: 25, active: 112, inactive: 6 },
                              { day: 'Week 4', onboarded: 15, active: 118, inactive: 9 }
                            ];
                          case 'Last 90 days':
                            return [
                              { day: 'Month 1', onboarded: 78, active: 285, inactive: 42 },
                              { day: 'Month 2', onboarded: 65, active: 310, inactive: 35 },
                              { day: 'Month 3', onboarded: 82, active: 355, inactive: 28 }
                            ];
                          case 'Year':
                            return [
                              { day: 'Q1', onboarded: 245, active: 950, inactive: 125 },
                              { day: 'Q2', onboarded: 220, active: 1085, inactive: 98 },
                              { day: 'Q3', onboarded: 285, active: 1265, inactive: 85 },
                              { day: 'Q4', onboarded: 195, active: 1385, inactive: 72 }
                            ];
                          case 'Custom range':
                            return [
                              { day: 'Day 1', onboarded: 3, active: 12, inactive: 1 },
                              { day: 'Day 2', onboarded: 6, active: 18, inactive: 0 },
                              { day: 'Day 3', onboarded: 4, active: 22, inactive: 2 }
                            ];
                          default:
                            return [
                              { day: 'Mon 4/22', onboarded: 5, active: 18, inactive: 2 },
                              { day: 'Tue 4/23', onboarded: 3, active: 20, inactive: 1 },
                              { day: 'Wed 4/24', onboarded: 7, active: 24, inactive: 0 },
                              { day: 'Thu 4/25', onboarded: 4, active: 26, inactive: 2 },
                              { day: 'Fri 4/26', onboarded: 8, active: 31, inactive: 1 },
                              { day: 'Sat 4/27', onboarded: 2, active: 32, inactive: 1 },
                              { day: 'Sun 4/28', onboarded: 1, active: 32, inactive: 1 }
                            ];
                        }
                      };
                      return getChartData();
                    })()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    maxBarSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeWidth="1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: selectedTimeRange, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 50']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Tenants', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0];
                          if (data && data.payload) {
                            const colorMap = {
                              onboarded: '#22c55e',
                              active: '#3b82f6',
                              inactive: '#ef4444'
                            };
                            const labelMap = {
                              onboarded: 'Onboarded',
                              active: 'Active',
                              inactive: 'Inactive'
                            };
                            return (
                              <div className="bg-white border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-foreground mb-2">{label}</p>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: colorMap[data.dataKey] }}
                                  ></div>
                                  <span className="text-sm text-foreground">
                                    <strong>{data.value}</strong> {labelMap[data.dataKey]}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                      cursor={false}
                    />
                    <Bar dataKey="onboarded" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="active" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="inactive" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Onboarded</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Inactive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Processed Tab */}
        <TabsContent value="jobs-processed" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Jobs Processed</h2>
              <p className="text-sm text-muted-foreground">Job processing analytics and performance metrics</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-4">
              {/* Select Tenant Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Tenant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Tenants
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Tenants</DropdownMenuItem>
                    <DropdownMenuItem>Tenant A</DropdownMenuItem>
                    <DropdownMenuItem>Tenant B</DropdownMenuItem>
                    <DropdownMenuItem>Tenant C</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Select Users Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Users</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Users
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Users</DropdownMenuItem>
                    <DropdownMenuItem>John Doe</DropdownMenuItem>
                    <DropdownMenuItem>Jane Smith</DropdownMenuItem>
                    <DropdownMenuItem>Mike Johnson</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* From Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1 opacity-0">Reset</label>
                <Button className="w-20">Reset</Button>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Job Processing Metrics</h3>
              </div>

              {/* Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const getChartData = () => {
                        switch (selectedTimeRange) {
                          case 'Last 7 days':
                            return [
                              { day: 'Mon 4/22', completed: 12, processed: 15, failed: 9 },
                              { day: 'Tue 4/23', completed: 10, processed: 12, failed: 5 },
                              { day: 'Wed 4/24', completed: 14, processed: 18, failed: 3 },
                              { day: 'Thu 4/25', completed: 8, processed: 10, failed: 7 },
                              { day: 'Fri 4/26', completed: 16, processed: 19, failed: 4 },
                              { day: 'Sat 4/27', completed: 6, processed: 8, failed: 2 },
                              { day: 'Sun 4/28', completed: 5, processed: 7, failed: 1 }
                            ];
                          case 'Last 30 days':
                            return [
                              { day: 'Week 1', completed: 85, processed: 92, failed: 28 },
                              { day: 'Week 2', completed: 78, processed: 88, failed: 35 },
                              { day: 'Week 3', completed: 92, processed: 105, failed: 22 },
                              { day: 'Week 4', completed: 68, processed: 75, failed: 18 }
                            ];
                          case 'Last 90 days':
                            return [
                              { day: 'Month 1', completed: 340, processed: 385, failed: 120 },
                              { day: 'Month 2', completed: 315, processed: 350, failed: 95 },
                              { day: 'Month 3', completed: 385, processed: 420, failed: 88 }
                            ];
                          case 'Year':
                            return [
                              { day: 'Q1', completed: 1240, processed: 1380, failed: 285 },
                              { day: 'Q2', completed: 1185, processed: 1295, failed: 245 },
                              { day: 'Q3', completed: 1320, processed: 1485, failed: 195 },
                              { day: 'Q4', completed: 1095, processed: 1205, failed: 165 }
                            ];
                          case 'Custom range':
                            return [
                              { day: 'Day 1', completed: 8, processed: 12, failed: 3 },
                              { day: 'Day 2', completed: 15, processed: 18, failed: 2 },
                              { day: 'Day 3', completed: 22, processed: 25, failed: 5 }
                            ];
                          default:
                            return [
                              { day: 'Mon 4/22', completed: 12, processed: 15, failed: 9 },
                              { day: 'Tue 4/23', completed: 10, processed: 12, failed: 5 },
                              { day: 'Wed 4/24', completed: 14, processed: 18, failed: 3 },
                              { day: 'Thu 4/25', completed: 8, processed: 10, failed: 7 },
                              { day: 'Fri 4/26', completed: 16, processed: 19, failed: 4 },
                              { day: 'Sat 4/27', completed: 6, processed: 8, failed: 2 },
                              { day: 'Sun 4/28', completed: 5, processed: 7, failed: 1 }
                            ];
                        }
                      };
                      return getChartData();
                    })()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    maxBarSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeWidth="1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: selectedTimeRange, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 50']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Jobs', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0];
                          if (data && data.payload) {
                            const colorMap = {
                              completed: '#22c55e',
                              processed: '#3b82f6',
                              failed: '#ef4444'
                            };
                            const labelMap = {
                              completed: 'Completed',
                              processed: 'Processed',
                              failed: 'Failed'
                            };
                            return (
                              <div className="bg-white border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-foreground mb-2">{label}</p>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: colorMap[data.dataKey] }}
                                  ></div>
                                  <span className="text-sm text-foreground">
                                    <strong>{data.value}</strong> {labelMap[data.dataKey]}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                      cursor={false}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="processed" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="failed" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Processed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Processed Tab */}
        <TabsContent value="document-processed" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Document Processed</h2>
              <p className="text-sm text-muted-foreground">Document processing analytics and performance metrics</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-4">
              {/* Select Tenant Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Tenant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Tenants
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Tenants</DropdownMenuItem>
                    <DropdownMenuItem>Tenant A</DropdownMenuItem>
                    <DropdownMenuItem>Tenant B</DropdownMenuItem>
                    <DropdownMenuItem>Tenant C</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Select Users Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Users</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Users
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Users</DropdownMenuItem>
                    <DropdownMenuItem>John Doe</DropdownMenuItem>
                    <DropdownMenuItem>Jane Smith</DropdownMenuItem>
                    <DropdownMenuItem>Mike Johnson</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* From Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1 opacity-0">Reset</label>
                <Button className="w-20">Reset</Button>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Document Processing Metrics</h3>
              </div>

              {/* Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const getChartData = () => {
                        switch (selectedTimeRange) {
                          case 'Last 7 days':
                            return [
                              { day: 'Mon 4/22', completed: 28, processed: 35, failed: 4 },
                              { day: 'Tue 4/23', completed: 24, processed: 32, failed: 2 },
                              { day: 'Wed 4/24', completed: 32, processed: 38, failed: 6 },
                              { day: 'Thu 4/25', completed: 18, processed: 25, failed: 3 },
                              { day: 'Fri 4/26', completed: 36, processed: 42, failed: 5 },
                              { day: 'Sat 4/27', completed: 14, processed: 18, failed: 1 },
                              { day: 'Sun 4/28', completed: 12, processed: 16, failed: 2 }
                            ];
                          case 'Last 30 days':
                            return [
                              { day: 'Week 1', completed: 185, processed: 210, failed: 25 },
                              { day: 'Week 2', completed: 168, processed: 195, failed: 18 },
                              { day: 'Week 3', completed: 205, processed: 235, failed: 15 },
                              { day: 'Week 4', completed: 142, processed: 165, failed: 22 }
                            ];
                          case 'Last 90 days':
                            return [
                              { day: 'Month 1', completed: 685, processed: 785, failed: 85 },
                              { day: 'Month 2', completed: 620, processed: 715, failed: 72 },
                              { day: 'Month 3', completed: 745, processed: 845, failed: 68 }
                            ];
                          case 'Year':
                            return [
                              { day: 'Q1', completed: 2540, processed: 2885, failed: 285 },
                              { day: 'Q2', completed: 2385, processed: 2715, failed: 245 },
                              { day: 'Q3', completed: 2720, processed: 3085, failed: 225 },
                              { day: 'Q4', completed: 2295, processed: 2605, failed: 265 }
                            ];
                          case 'Custom range':
                            return [
                              { day: 'Day 1', completed: 18, processed: 24, failed: 2 },
                              { day: 'Day 2', completed: 25, processed: 32, failed: 1 },
                              { day: 'Day 3', completed: 22, processed: 28, failed: 3 }
                            ];
                          default:
                            return [
                              { day: 'Mon 4/22', completed: 28, processed: 35, failed: 4 },
                              { day: 'Tue 4/23', completed: 24, processed: 32, failed: 2 },
                              { day: 'Wed 4/24', completed: 32, processed: 38, failed: 6 },
                              { day: 'Thu 4/25', completed: 18, processed: 25, failed: 3 },
                              { day: 'Fri 4/26', completed: 36, processed: 42, failed: 5 },
                              { day: 'Sat 4/27', completed: 14, processed: 18, failed: 1 },
                              { day: 'Sun 4/28', completed: 12, processed: 16, failed: 2 }
                            ];
                        }
                      };
                      return getChartData();
                    })()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    maxBarSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeWidth="1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: selectedTimeRange, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 50']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Documents', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0];
                          if (data && data.payload) {
                            const colorMap = {
                              completed: '#22c55e',
                              processed: '#3b82f6',
                              failed: '#ef4444'
                            };
                            const labelMap = {
                              completed: 'Completed',
                              processed: 'Processed',
                              failed: 'Failed'
                            };
                            return (
                              <div className="bg-white border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-foreground mb-2">{label}</p>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: colorMap[data.dataKey] }}
                                  ></div>
                                  <span className="text-sm text-foreground">
                                    <strong>{data.value}</strong> {labelMap[data.dataKey]}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                      cursor={false}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="processed" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="failed" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Processed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Processed Tab */}
        <TabsContent value="pages-processed" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Pages Processed</h2>
              <p className="text-sm text-muted-foreground">Page processing analytics and performance metrics</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-4">
              {/* Select Tenant Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Tenant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Tenants
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Tenants</DropdownMenuItem>
                    <DropdownMenuItem>Tenant A</DropdownMenuItem>
                    <DropdownMenuItem>Tenant B</DropdownMenuItem>
                    <DropdownMenuItem>Tenant C</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Select Users Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Users</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Users
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Users</DropdownMenuItem>
                    <DropdownMenuItem>John Doe</DropdownMenuItem>
                    <DropdownMenuItem>Jane Smith</DropdownMenuItem>
                    <DropdownMenuItem>Mike Johnson</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* From Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1 opacity-0">Reset</label>
                <Button className="w-20">Reset</Button>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Page Processing Metrics</h3>
              </div>

              {/* Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const getChartData = () => {
                        switch (selectedTimeRange) {
                          case 'Last 7 days':
                            return [
                              { day: 'Mon 4/22', completed: 485, processed: 520, failed: 35 },
                              { day: 'Tue 4/23', completed: 425, processed: 465, failed: 28 },
                              { day: 'Wed 4/24', completed: 565, processed: 605, failed: 42 },
                              { day: 'Thu 4/25', completed: 385, processed: 420, failed: 25 },
                              { day: 'Fri 4/26', completed: 625, processed: 675, failed: 38 },
                              { day: 'Sat 4/27', completed: 285, processed: 315, failed: 18 },
                              { day: 'Sun 4/28', completed: 245, processed: 275, failed: 22 }
                            ];
                          case 'Last 30 days':
                            return [
                              { day: 'Week 1', completed: 3250, processed: 3520, failed: 185 },
                              { day: 'Week 2', completed: 2985, processed: 3285, failed: 168 },
                              { day: 'Week 3', completed: 3585, processed: 3895, failed: 205 },
                              { day: 'Week 4', completed: 2745, processed: 3025, failed: 142 }
                            ];
                          case 'Last 90 days':
                            return [
                              { day: 'Month 1', completed: 12850, processed: 14285, failed: 685 },
                              { day: 'Month 2', completed: 11620, processed: 12915, failed: 620 },
                              { day: 'Month 3', completed: 14050, processed: 15645, failed: 745 }
                            ];
                          case 'Year':
                            return [
                              { day: 'Q1', completed: 48540, processed: 53885, failed: 2540 },
                              { day: 'Q2', completed: 45385, processed: 50715, failed: 2385 },
                              { day: 'Q3', completed: 51720, processed: 57585, failed: 2720 },
                              { day: 'Q4', completed: 43295, processed: 48205, failed: 2295 }
                            ];
                          case 'Custom range':
                            return [
                              { day: 'Day 1', completed: 285, processed: 324, failed: 18 },
                              { day: 'Day 2', completed: 365, processed: 398, failed: 25 },
                              { day: 'Day 3', completed: 325, processed: 365, failed: 22 }
                            ];
                          default:
                            return [
                              { day: 'Mon 4/22', completed: 485, processed: 520, failed: 35 },
                              { day: 'Tue 4/23', completed: 425, processed: 465, failed: 28 },
                              { day: 'Wed 4/24', completed: 565, processed: 605, failed: 42 },
                              { day: 'Thu 4/25', completed: 385, processed: 420, failed: 25 },
                              { day: 'Fri 4/26', completed: 625, processed: 675, failed: 38 },
                              { day: 'Sat 4/27', completed: 285, processed: 315, failed: 18 },
                              { day: 'Sun 4/28', completed: 245, processed: 275, failed: 22 }
                            ];
                        }
                      };
                      return getChartData();
                    })()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    maxBarSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeWidth="1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: selectedTimeRange, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 500']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Pages', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0];
                          if (data && data.payload) {
                            const colorMap = {
                              completed: '#22c55e',
                              processed: '#3b82f6',
                              failed: '#ef4444'
                            };
                            const labelMap = {
                              completed: 'Completed',
                              processed: 'Processed',
                              failed: 'Failed'
                            };
                            return (
                              <div className="bg-white border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-foreground mb-2">{label}</p>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: colorMap[data.dataKey] }}
                                  ></div>
                                  <span className="text-sm text-foreground">
                                    <strong>{data.value}</strong> {labelMap[data.dataKey]}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                      cursor={false}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="processed" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="failed" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Processed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Onboarded Tab */}
        <TabsContent value="user-onboarded" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">User Onboarded</h2>
              <p className="text-sm text-muted-foreground">User onboarding analytics and performance metrics</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-4">
              {/* Select Tenant Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">Select Tenant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      All Tenants
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-background border-border shadow-lg z-50">
                    <DropdownMenuItem>All Tenants</DropdownMenuItem>
                    <DropdownMenuItem>Tenant A</DropdownMenuItem>
                    <DropdownMenuItem>Tenant B</DropdownMenuItem>
                    <DropdownMenuItem>Tenant C</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* From Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-1 opacity-0">Reset</label>
                <Button className="w-20">Reset</Button>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">User Onboarding Metrics</h3>
              </div>

              {/* Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const getChartData = () => {
                        switch (selectedTimeRange) {
                          case 'Last 7 days':
                            return [
                              { day: 'Mon 4/22', onboarded: 8, active: 35, inactive: 5 },
                              { day: 'Tue 4/23', onboarded: 6, active: 38, inactive: 3 },
                              { day: 'Wed 4/24', onboarded: 12, active: 45, inactive: 2 },
                              { day: 'Thu 4/25', onboarded: 4, active: 48, inactive: 4 },
                              { day: 'Fri 4/26', onboarded: 15, active: 58, inactive: 1 },
                              { day: 'Sat 4/27', onboarded: 3, active: 60, inactive: 2 },
                              { day: 'Sun 4/28', onboarded: 2, active: 61, inactive: 1 }
                            ];
                          case 'Last 30 days':
                            return [
                              { day: 'Week 1', onboarded: 35, active: 185, inactive: 15 },
                              { day: 'Week 2', onboarded: 28, active: 205, inactive: 18 },
                              { day: 'Week 3', onboarded: 42, active: 235, inactive: 12 },
                              { day: 'Week 4', onboarded: 25, active: 255, inactive: 20 }
                            ];
                          case 'Last 90 days':
                            return [
                              { day: 'Month 1', onboarded: 128, active: 685, inactive: 85 },
                              { day: 'Month 2', onboarded: 105, active: 750, inactive: 72 },
                              { day: 'Month 3', onboarded: 145, active: 845, inactive: 68 }
                            ];
                          case 'Year':
                            return [
                              { day: 'Q1', onboarded: 485, active: 2540, inactive: 285 },
                              { day: 'Q2', onboarded: 425, active: 2785, inactive: 245 },
                              { day: 'Q3', onboarded: 565, active: 3185, inactive: 225 },
                              { day: 'Q4', onboarded: 385, active: 3485, inactive: 265 }
                            ];
                          case 'Custom range':
                            return [
                              { day: 'Day 1', onboarded: 5, active: 24, inactive: 2 },
                              { day: 'Day 2', onboarded: 8, active: 32, inactive: 1 },
                              { day: 'Day 3', onboarded: 6, active: 38, inactive: 3 }
                            ];
                          default:
                            return [
                              { day: 'Mon 4/22', onboarded: 8, active: 35, inactive: 5 },
                              { day: 'Tue 4/23', onboarded: 6, active: 38, inactive: 3 },
                              { day: 'Wed 4/24', onboarded: 12, active: 45, inactive: 2 },
                              { day: 'Thu 4/25', onboarded: 4, active: 48, inactive: 4 },
                              { day: 'Fri 4/26', onboarded: 15, active: 58, inactive: 1 },
                              { day: 'Sat 4/27', onboarded: 3, active: 60, inactive: 2 },
                              { day: 'Sun 4/28', onboarded: 2, active: 61, inactive: 1 }
                            ];
                        }
                      };
                      return getChartData();
                    })()}
                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    maxBarSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeWidth="1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: selectedTimeRange, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax + 50']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Users', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#374151', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                          const data = payload[0];
                          if (data && data.payload) {
                            const colorMap = {
                              onboarded: '#22c55e',
                              active: '#3b82f6',
                              inactive: '#ef4444'
                            };
                            const labelMap = {
                              onboarded: 'Onboarded',
                              active: 'Active',
                              inactive: 'Inactive'
                            };
                            return (
                              <div className="bg-white border border-border rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-foreground mb-2">{label}</p>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: colorMap[data.dataKey] }}
                                  ></div>
                                  <span className="text-sm text-foreground">
                                    <strong>{data.value}</strong> {labelMap[data.dataKey]}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                      cursor={false}
                    />
                    <Bar dataKey="onboarded" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="active" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="inactive" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Onboarded</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Inactive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <GenerateDataMatchReportModal
        isOpen={isDataMatchModalOpen}
        onClose={() => setIsDataMatchModalOpen(false)}
      />
      
      <GenerateProductivityEngineReportModal
        isOpen={isProductivityModalOpen}
        onClose={() => setIsProductivityModalOpen(false)}
      />

      {/* PO Report Modal */}
      <Dialog open={isPOReportModalOpen} onOpenChange={setIsPOReportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate PO Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vendors" className="text-right">
                Vendors
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="vendor1">Vendor 1</SelectItem>
                  <SelectItem value="vendor2">Vendor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Select defaultValue="pdf">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              // Handle report generation logic here
              console.log('Generating PO Report with data:', poReportData);
              setIsPOReportModalOpen(false);
            }}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsAnalytics;