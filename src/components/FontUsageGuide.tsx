import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * COMPLETE FONT USAGE GUIDE
 * 
 * This component demonstrates all available fonts in the project
 * and provides code examples for implementation
 */

const FontUsageGuide = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Font Usage Guide
        </h1>
        <p className="text-muted-foreground mb-8">
          Complete guide to using fonts in the Document Matching system
        </p>

        {/* CURRENT AVAILABLE FONTS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Available Fonts</CardTitle>
            <p className="text-sm text-muted-foreground">Fonts currently configured in tailwind.config.ts</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Inter Font */}
            <div className="space-y-2">
              <h3 className="font-medium">Inter (Sans-serif) - Logo Font</h3>
              <div className="font-logo">
                <p className="text-2xl font-semibold">Document Matching System</p>
                <p className="text-lg">Clean, modern interface font for headings and UI</p>
                <p className="text-sm text-muted-foreground">Available weights: 600, 700</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h1 className="font-logo font-semibold">Document Matching</h1>`}
              </code>
            </div>

            {/* DM Serif Text */}
            <div className="space-y-2">
              <h3 className="font-medium">DM Serif Text</h3>
              <div className="font-dm-serif">
                <p className="text-2xl">Elegant Document Headers</p>
                <p className="text-lg">Perfect for document titles and formal content</p>
                <p className="text-sm text-muted-foreground">Available weights: 400</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h2 className="font-dm-serif text-2xl">Invoice #INV-2024-001</h2>`}
              </code>
            </div>

            {/* Volkhov */}
            <div className="space-y-2">
              <h3 className="font-medium">Volkhov (Serif)</h3>
              <div className="font-volkhov">
                <p className="text-2xl font-bold">Traditional Document Style</p>
                <p className="text-lg">Classical serif for formal documents and reports</p>
                <p className="text-sm text-muted-foreground">Available weights: 700</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h1 className="font-volkhov font-bold">Annual Report 2024</h1>`}
              </code>
            </div>

            {/* Noto Serif */}
            <div className="space-y-2">
              <h3 className="font-medium">Noto Serif</h3>
              <div className="font-noto-serif">
                <p className="text-2xl font-bold">Professional Documentation</p>
                <p className="text-lg font-normal">Readable serif for body text and content</p>
                <p className="text-sm text-muted-foreground">Available weights: 400, 700</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<p className="font-noto-serif text-lg">Document content here...</p>`}
              </code>
            </div>

            {/* Saira */}
            <div className="space-y-2">
              <h3 className="font-medium">Saira (Sans-serif)</h3>
              <div className="font-saira">
                <p className="text-2xl font-bold">Modern Interface Text</p>
                <p className="text-lg font-semibold">Contemporary sans-serif for UI elements</p>
                <p className="text-base font-normal">Clean and readable for all interface text</p>
                <p className="text-sm text-muted-foreground">Available weights: 400, 600, 700</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button className="font-saira font-semibold">Process Documents</Button>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* FONT WEIGHT CLASSES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Font Weight Classes</CardTitle>
            <p className="text-sm text-muted-foreground">Available font weights with Tailwind classes</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Font Weight Classes</h4>
                <div className="space-y-2 font-saira">
                  <p className="font-normal">font-normal (400)</p>
                  <p className="font-medium">font-medium (500)</p>
                  <p className="font-semibold">font-semibold (600)</p>
                  <p className="font-bold">font-bold (700)</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Usage Examples</h4>
                <div className="space-y-1 text-xs">
                  <code className="bg-muted p-1 rounded block">font-normal - Body text</code>
                  <code className="bg-muted p-1 rounded block">font-medium - Labels</code>
                  <code className="bg-muted p-1 rounded block">font-semibold - Subheadings</code>
                  <code className="bg-muted p-1 rounded block">font-bold - Main headings</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TYPOGRAPHY HIERARCHY */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Typography Hierarchy</CardTitle>
            <p className="text-sm text-muted-foreground">Recommended font combinations for different content types</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Page Headers */}
            <div className="space-y-2">
              <h4 className="font-medium">Page Headers</h4>
              <div className="space-y-2">
                <h1 className="font-logo text-2xl font-semibold text-foreground">Main Page Title</h1>
                <h2 className="font-saira text-xl font-semibold text-foreground">Section Header</h2>
                <h3 className="font-saira text-lg font-medium text-foreground">Subsection</h3>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h1 className="font-logo text-2xl font-semibold">Document Matching</h1>
<h2 className="font-saira text-xl font-semibold">Processing Queue</h2>
<h3 className="font-saira text-lg font-medium">Recent Activity</h3>`}
              </code>
            </div>

            {/* Document Headers */}
            <div className="space-y-2">
              <h4 className="font-medium">Document Headers</h4>
              <div className="space-y-2">
                <h1 className="font-dm-serif text-2xl text-foreground">Invoice #INV-2024-001</h1>
                <h2 className="font-noto-serif text-xl font-bold text-foreground">Purchase Order Details</h2>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h1 className="font-dm-serif text-2xl">Invoice #INV-2024-001</h1>
<h2 className="font-noto-serif text-xl font-bold">Purchase Order Details</h2>`}
              </code>
            </div>

            {/* Body Text */}
            <div className="space-y-2">
              <h4 className="font-medium">Body Text</h4>
              <div className="space-y-2">
                <p className="font-saira text-base text-foreground">Interface body text using Saira for modern feel</p>
                <p className="font-noto-serif text-base text-foreground">Document content using Noto Serif for readability</p>
                <p className="text-sm text-muted-foreground">Secondary text using default system font</p>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<p className="font-saira text-base">Interface content</p>
<p className="font-noto-serif text-base">Document content</p>
<p className="text-sm text-muted-foreground">Secondary info</p>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* COMPONENT EXAMPLES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Component Font Usage</CardTitle>
            <p className="text-sm text-muted-foreground">How to apply fonts to common UI components</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Buttons */}
            <div className="space-y-3">
              <h4 className="font-medium">Buttons</h4>
              <div className="flex items-center space-x-3">
                <Button className="font-saira font-semibold">
                  Process Documents
                </Button>
                <Button variant="outline" className="font-saira font-medium">
                  View Reports
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button className="font-saira font-semibold">Process Documents</Button>
<Button variant="outline" className="font-saira font-medium">View Reports</Button>`}
              </code>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h4 className="font-medium">Cards</h4>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="font-saira text-lg font-semibold">Document Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-saira text-sm text-muted-foreground mb-2">Processing queue status</p>
                  <p className="font-noto-serif text-base">All documents have been successfully processed and matched.</p>
                </CardContent>
              </Card>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<CardTitle className="font-saira text-lg font-semibold">Document Status</CardTitle>
<p className="font-saira text-sm text-muted-foreground">Processing queue status</p>
<p className="font-noto-serif text-base">Content description</p>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* ADDING NEW FONTS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Adding New Fonts</CardTitle>
            <p className="text-sm text-muted-foreground">How to add additional fonts to the project</p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <h4 className="font-medium">Step 1: Add Google Font Link</h4>
              <p className="text-sm text-muted-foreground">Add to index.html head section:</p>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap">`}
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 2: Configure in Tailwind</h4>
              <p className="text-sm text-muted-foreground">Add to tailwind.config.ts fontFamily extend:</p>
              <code className="text-xs bg-muted p-2 rounded block">
                {`extend: {
  fontFamily: {
    'playfair': ['Playfair Display', 'serif'],
  },
}`}
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 3: Use in Components</h4>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<h1 className="font-playfair text-2xl font-bold">Elegant Header</h1>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* BEST PRACTICES */}
        <Card>
          <CardHeader>
            <CardTitle>6. Font Best Practices</CardTitle>
            <p className="text-sm text-muted-foreground">Guidelines for consistent font usage</p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">✅ Do</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use Inter/Saira for UI elements</li>
                  <li>• Use serif fonts for document content</li>
                  <li>• Maintain consistent font weights</li>
                  <li>• Provide fallback fonts</li>
                  <li>• Test across different devices</li>
                  <li>• Use font-display: swap for loading</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">❌ Don't</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mix too many font families</li>
                  <li>• Use very light weights for small text</li>
                  <li>• Load unnecessary font weights</li>
                  <li>• Forget mobile optimization</li>
                  <li>• Use decorative fonts for body text</li>
                  <li>• Override default line heights carelessly</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Recommended Font Combinations</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Modern UI:</strong> Inter (headings) + Saira (body)</p>
                <p>• <strong>Document Heavy:</strong> DM Serif (titles) + Noto Serif (content)</p>
                <p>• <strong>Mixed Content:</strong> Inter (UI) + Noto Serif (documents)</p>
                <p>• <strong>Traditional:</strong> Volkhov (headings) + Noto Serif (body)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FontUsageGuide;