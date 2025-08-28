import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * COMPLETE COLOR USAGE GUIDE
 * 
 * This component demonstrates all available colors in the Document Matching system
 * with comprehensive usage examples and best practices
 */

const ColorUsageGuide = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Color Usage Guide - Document Matching System
        </h1>
        <p className="text-muted-foreground mb-8">
          Complete guide to using colors consistently across the Document Matching system
        </p>

        {/* SEMANTIC COLOR TOKENS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Core Semantic Colors</CardTitle>
            <p className="text-sm text-muted-foreground">Base color tokens defined in index.css</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Background Colors */}
            <div className="space-y-3">
              <h3 className="font-medium">Background Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-12 bg-background border rounded flex items-center justify-center">
                    <span className="text-sm font-mono">background</span>
                  </div>
                  <code className="text-xs">bg-background</code>
                  <p className="text-xs text-muted-foreground">Main page background</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-card border rounded flex items-center justify-center">
                    <span className="text-sm font-mono">card</span>
                  </div>
                  <code className="text-xs">bg-card</code>
                  <p className="text-xs text-muted-foreground">Card backgrounds</p>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-3">
              <h3 className="font-medium">Text Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="p-3 bg-card border rounded">
                    <span className="text-foreground font-medium">Primary Text</span>
                  </div>
                  <code className="text-xs">text-foreground</code>
                  <p className="text-xs text-muted-foreground">Main text content</p>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-card border rounded">
                    <span className="text-muted-foreground">Secondary Text</span>
                  </div>
                  <code className="text-xs">text-muted-foreground</code>
                  <p className="text-xs text-muted-foreground">Labels, descriptions</p>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-card border rounded">
                    <span className="text-card-foreground font-medium">Card Text</span>
                  </div>
                  <code className="text-xs">text-card-foreground</code>
                  <p className="text-xs text-muted-foreground">Text on card backgrounds</p>
                </div>
              </div>
            </div>

            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="font-medium">Primary Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-12 bg-primary rounded flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">Primary</span>
                  </div>
                  <code className="text-xs">bg-primary / text-primary</code>
                  <p className="text-xs text-muted-foreground">Main brand color #0066A4</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-primary-hover rounded flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">Primary Hover</span>
                  </div>
                  <code className="text-xs">bg-primary-hover</code>
                  <p className="text-xs text-muted-foreground">Hover state for primary</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-secondary rounded flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm font-medium">Secondary</span>
                  </div>
                  <code className="text-xs">bg-secondary</code>
                  <p className="text-xs text-muted-foreground">Secondary backgrounds</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STATUS COLORS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Status Color System</CardTitle>
            <p className="text-sm text-muted-foreground">Semantic colors for different document states</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Document Status Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-amber-50 border-0" style={{ color: '#333333' }}>
                      In Review
                    </Badge>
                    <code className="text-xs">--status-in-review: 38 92% 50%</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-blue-100 border-0" style={{ color: '#333333' }}>
                      Ready For Review
                    </Badge>
                    <code className="text-xs">--status-ready: 221 83% 53%</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-green-100 border-0" style={{ color: '#333333' }}>
                      Approved
                    </Badge>
                    <code className="text-xs">--status-approved: 142 76% 36%</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-red-100 border-0" style={{ color: '#333333' }}>
                      Rejected
                    </Badge>
                    <code className="text-xs">--status-rejected: 348 83% 47%</code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Usage Examples</h4>
                <div className="space-y-2 text-xs">
                  <code className="bg-muted p-2 rounded block">
                    {`<Badge className="bg-amber-50 border-0" style={{ color: '#333333' }}>
  In Review
</Badge>`}
                  </code>
                  <code className="bg-muted p-2 rounded block">
                    {`<Badge className="bg-blue-100 border-0" style={{ color: '#333333' }}>
  Ready For Review  
</Badge>`}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GRAY SCALE SYSTEM */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Gray Scale System</CardTitle>
            <p className="text-sm text-muted-foreground">Complete gray palette for consistent styling</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[
                { name: 'gray-50', desc: 'Lightest backgrounds' },
                { name: 'gray-100', desc: 'Subtle backgrounds' },
                { name: 'gray-200', desc: 'Borders' },
                { name: 'gray-300', desc: 'Disabled states' },
                { name: 'gray-400', desc: 'Placeholder text' },
                { name: 'gray-500', desc: 'Secondary text' },
                { name: 'gray-600', desc: 'Body text' },
                { name: 'gray-700', desc: 'Headings' },
                { name: 'gray-800', desc: 'Strong text' },
                { name: 'gray-900', desc: 'Primary text' }
              ].map((color, index) => (
                <div key={color.name} className="space-y-2">
                  <div 
                    className={`w-full h-12 rounded border flex items-center justify-center`}
                    style={{ 
                      backgroundColor: `hsl(var(--${color.name}))`,
                      color: index > 4 ? 'white' : 'black'
                    }}
                  >
                    <span className="text-xs font-mono">{color.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{color.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* COMPONENT SPECIFIC COLORS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Component-Specific Colors</CardTitle>
            <p className="text-sm text-muted-foreground">Colors for specific UI components</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Button Colors */}
            <div className="space-y-3">
              <h4 className="font-medium">Button Colors</h4>
              <div className="flex items-center space-x-4">
                <Button className="button-primary">Primary Button</Button>
                <Button className="button-secondary">Secondary Button</Button>
                <Button className="button-outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
              <div className="text-xs space-y-1">
                <code className="bg-muted p-1 rounded block">button-primary: bg-primary text-primary-foreground</code>
                <code className="bg-muted p-1 rounded block">button-secondary: bg-white text-gray-700 border-gray-500</code>
                <code className="bg-muted p-1 rounded block">button-outline: bg-white border-gray-500 text-gray-700</code>
                <code className="bg-muted p-1 rounded block">button-ghost: bg-transparent text-gray-600</code>
              </div>
            </div>

            {/* Table Colors */}
            <div className="space-y-3">
              <h4 className="font-medium">Table Colors</h4>
              <div className="space-y-2">
                <div className="p-3 bg-muted/50 border rounded">
                  <span className="text-muted-foreground text-sm">Table Header Background</span>
                </div>
                <div className="p-3 hover:bg-muted/50 border rounded transition-colors cursor-pointer">
                  <span className="text-foreground text-sm">Table Row (hover effect)</span>
                </div>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
{`<TableHeader>
  <TableRow className="bg-muted/50 hover:bg-muted/50">
    <TableHead className="text-muted-foreground">Header</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  <TableRow className="hover:bg-muted/50 transition-colors">
    <TableCell className="text-foreground">Content</TableCell>
  </TableRow>
</TableBody>`}
              </code>
            </div>

            {/* Filter Tab Colors */}
            <div className="space-y-3">
              <h4 className="font-medium">Filter Tab Colors</h4>
              <div className="filter-tabs">
                <button className="tab-filter tab-filter-active">
                  Active Tab
                  <span className="filter-count-badge">5</span>
                </button>
                <button className="tab-filter tab-filter-inactive">
                  Inactive Tab
                  <span className="filter-count-badge">3</span>
                </button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
{`/* Active Tab */
background-color: #FFFFFF;
border-color: #4A5568;
color: #111827;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);

/* Inactive Tab */
background-color: #FFFFFF;
border-color: #D4E0ED;
color: #494949;`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* USAGE PATTERNS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Color Usage Patterns</CardTitle>
            <p className="text-sm text-muted-foreground">Common color combinations and patterns</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Page Layout */}
            <div className="space-y-3">
              <h4 className="font-medium">Page Layout Colors</h4>
              <code className="text-xs bg-muted p-2 rounded block">
{`// Page structure
<div className="bg-background">                    // Main page background
  <header className="bg-card border-b">           // Header with border
    <h1 className="text-foreground">Title</h1>    // Primary heading
  </header>
  <main className="bg-background">                // Main content area
    <Card className="bg-card">                    // Card container
      <CardContent className="text-card-foreground"> // Card text
        Content here
      </CardContent>
    </Card>
  </main>
</div>`}
              </code>
            </div>

            {/* Interactive States */}
            <div className="space-y-3">
              <h4 className="font-medium">Interactive State Colors</h4>
              <code className="text-xs bg-muted p-2 rounded block">
{`// Button states
<Button className="bg-primary hover:bg-primary-hover">    // Primary button
<Button className="bg-secondary hover:bg-accent">         // Secondary button
<Button className="text-primary hover:bg-accent">        // Ghost button

// Link states  
<a className="text-primary hover:text-primary-hover">     // Links
<a className="text-muted-foreground hover:text-foreground"> // Subtle links

// Table row states
<TableRow className="hover:bg-muted/50">                  // Hover effect`}
              </code>
            </div>

            {/* Form Colors */}
            <div className="space-y-3">
              <h4 className="font-medium">Form Element Colors</h4>
              <code className="text-xs bg-muted p-2 rounded block">
{`// Form inputs
<Input className="bg-background border-input text-foreground" />
<Label className="text-foreground font-medium" />
<p className="text-muted-foreground text-sm">Helper text</p>

// Form validation
<p className="text-destructive text-sm">Error message</p>
<p className="text-success text-sm">Success message</p>
<p className="text-warning text-sm">Warning message</p>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* DARK MODE */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Dark Mode Support</CardTitle>
            <p className="text-sm text-muted-foreground">All colors automatically adapt to dark mode</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Automatic Dark Mode</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All semantic color tokens automatically switch between light and dark variants.
              </p>
              <code className="text-xs bg-background p-2 rounded block">
{`// Colors automatically adapt
<div className="bg-background text-foreground">     // Light: white bg, dark text
                                                    // Dark: dark bg, light text

<Card className="bg-card text-card-foreground">    // Adapts to theme
<Button className="bg-primary text-primary-foreground"> // Consistent across themes`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* BEST PRACTICES */}
        <Card>
          <CardHeader>
            <CardTitle>7. Color Best Practices</CardTitle>
            <p className="text-sm text-muted-foreground">Guidelines for consistent color usage</p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">✅ Do</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use semantic color tokens (text-foreground, bg-card)</li>
                  <li>• Maintain consistent status colors</li>
                  <li>• Test colors in both light and dark modes</li>
                  <li>• Use hover states for interactive elements</li>
                  <li>• Follow accessibility contrast guidelines</li>
                  <li>• Use CSS variables for custom colors</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">❌ Don't</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use hardcoded hex colors directly</li>
                  <li>• Mix status color meanings</li>
                  <li>• Override semantic tokens carelessly</li>
                  <li>• Ignore dark mode compatibility</li>
                  <li>• Use too many different colors</li>
                  <li>• Forget hover and focus states</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Color Hierarchy</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Primary:</strong> Use sparingly for main actions and brand elements</p>
                <p>• <strong>Foreground:</strong> Main text content and important information</p>
                <p>• <strong>Muted:</strong> Secondary text, labels, and subtle information</p>
                <p>• <strong>Status:</strong> Consistent colors for document states and feedback</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">Quick Reference</h4>
              <div className="space-y-1 text-xs font-mono text-amber-800">
                <p>Headers: text-foreground</p>
                <p>Body text: text-foreground</p>
                <p>Secondary text: text-muted-foreground</p>
                <p>Backgrounds: bg-background, bg-card</p>
                <p>Buttons: button-primary, button-secondary</p>
                <p>Status: bg-amber-50, bg-blue-100, bg-green-100, bg-red-100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorUsageGuide;