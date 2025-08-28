
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorConfiguration from './config/VendorConfiguration';
import MatchingRulesConfiguration from './config/MatchingRulesConfiguration';
import DocumentProcessingRules from './config/DocumentProcessingRules';
import UserPermissionsConfiguration from './config/UserPermissionsConfiguration';

const ModuleConfiguration = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16">
        <div>
          <nav className="text-sm text-gray-500 mb-1">Settings › Module Configuration</nav>
          <h1 className="text-xl font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600, color: '#333333' }}>
            Module Configuration
          </h1>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <Tabs defaultValue="vendors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendors">Vendor Configuration</TabsTrigger>
              <TabsTrigger value="matching">Matching Rules</TabsTrigger>
              <TabsTrigger value="processing">Document Processing</TabsTrigger>
              <TabsTrigger value="permissions">User Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="vendors" className="mt-6">
              <VendorConfiguration />
            </TabsContent>

            <TabsContent value="matching" className="mt-6">
              <MatchingRulesConfiguration />
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <DocumentProcessingRules />
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <UserPermissionsConfiguration />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleConfiguration;
