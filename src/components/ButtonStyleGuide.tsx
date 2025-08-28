import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RefreshCw, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  AlertTriangle, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Save
} from 'lucide-react';

/**
 * DOCUMENT MATCHING BUTTON STYLE GUIDE
 * 
 * This component shows all button types, colors, and states used in Document Matching
 * Copy these exact patterns for consistent styling across other flows
 */

const ButtonStyleGuide = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Document Matching Button Style Guide
        </h1>
        <p className="text-muted-foreground mb-8">
          Copy these exact button patterns for consistent styling in other flows
        </p>

        {/* PRIMARY HEADER BUTTONS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Header Action Buttons</CardTitle>
            <p className="text-sm text-muted-foreground">Used in page headers for primary actions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Header Button */}
            <div className="space-y-2">
              <h4 className="font-medium">Primary Action (default variant)</h4>
              <div className="flex items-center space-x-3">
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Rule
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button>
  <RefreshCw className="w-4 h-4 mr-2" />
  Refresh
</Button>`}
              </code>
            </div>

            {/* Secondary Header Buttons */}
            <div className="space-y-2">
              <h4 className="font-medium">Secondary Actions (outline variant)</h4>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button variant="outline">
  <BarChart3 className="w-4 h-4 mr-2" />
  Reports
</Button>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* CARD ACTION BUTTONS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Card Action Buttons</CardTitle>
            <p className="text-sm text-muted-foreground">Used inside cards for navigation and actions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Width Primary */}
            <div className="space-y-2">
              <h4 className="font-medium">Primary Card Action (default variant, full width)</h4>
              <div className="max-w-xs">
                <Button className="w-full">
                  View Queue
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button asChild className="w-full">
  <Link to="/matching/queue">
    View Queue
  </Link>
</Button>`}
              </code>
            </div>

            {/* Full Width Secondary */}
            <div className="space-y-2">
              <h4 className="font-medium">Secondary Card Action (outline variant, full width)</h4>
              <div className="max-w-xs space-y-2">
                <Button variant="outline" className="w-full">
                  Review Items
                </Button>
                <Button variant="outline" className="w-full">
                  Manage Rules
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button asChild variant="outline" className="w-full">
  <Link to="/matching/manual-review">
    Review Items
  </Link>
</Button>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* TABLE/LIST ACTION BUTTONS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Table/List Action Buttons</CardTitle>
            <p className="text-sm text-muted-foreground">Used in tables and lists for row actions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Icon Only Buttons */}
            <div className="space-y-2">
              <h4 className="font-medium">Icon-Only Actions (ghost variant)</h4>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button variant="ghost" size="sm">
  <Eye className="w-4 h-4" />
</Button>`}
              </code>
            </div>

            {/* Small Text Buttons */}
            <div className="space-y-2">
              <h4 className="font-medium">Small Text Actions (ghost variant, small size)</h4>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button variant="ghost" size="sm">
  View
</Button>
<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
  Delete
</Button>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* BUTTON VARIANTS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. All Button Variants</CardTitle>
            <p className="text-sm text-muted-foreground">Complete list of available button variants</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Variants</h4>
                <div className="space-y-2">
                  <Button variant="default">Default</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Sizes</h4>
                <div className="space-y-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BUTTON STATES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Button States</CardTitle>
            <p className="text-sm text-muted-foreground">Different states and their styling</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Normal State</h4>
                <Button>Normal Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Disabled State</h4>
                <Button disabled>Disabled Button</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Loading State</h4>
                <Button disabled>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BUTTONS WITH BADGES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Buttons with Badges</CardTitle>
            <p className="text-sm text-muted-foreground">Used in tabs and navigation with count indicators</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Tab Buttons with Counts</h4>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="bg-background">
                  Pending
                  <Badge variant="secondary" className="ml-2">23</Badge>
                </Button>
                <Button variant="ghost">
                  Auto-Matched
                  <Badge variant="secondary" className="ml-2">147</Badge>
                </Button>
                <Button variant="ghost">
                  Manual Review
                  <Badge variant="secondary" className="ml-2">8</Badge>
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block">
                {`<Button variant="ghost" className="bg-background">
  Pending
  <Badge variant="secondary" className="ml-2">23</Badge>
</Button>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* COLOR SYSTEM */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Color System</CardTitle>
            <p className="text-sm text-muted-foreground">Semantic colors used in Document Matching</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Status Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span className="text-sm">Success/Auto-matched: text-green-600</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                    <span className="text-sm">Warning/Pending: text-yellow-600</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span className="text-sm">Error/Manual Review: text-red-600</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm">Info/Processing: text-blue-600</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Theme Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Primary: bg-primary, text-primary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span className="text-sm">Muted: bg-muted, text-muted-foreground</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-background border rounded"></div>
                    <span className="text-sm">Background: bg-background, text-foreground</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* USAGE EXAMPLES */}
        <Card>
          <CardHeader>
            <CardTitle>8. Complete Usage Examples</CardTitle>
            <p className="text-sm text-muted-foreground">Real examples from Document Matching dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Example */}
            <div className="space-y-2">
              <h4 className="font-medium">Page Header Pattern</h4>
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Page Title</h2>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Reports
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Example */}
            <div className="space-y-2">
              <h4 className="font-medium">Action Card Pattern</h4>
              <div className="border rounded-lg p-4 bg-background max-w-xs">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Queue Management</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage document matching queue
                  </p>
                  <Button className="w-full">
                    View Queue
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ButtonStyleGuide;