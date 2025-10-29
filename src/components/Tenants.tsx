import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import EditTenantDialog from './EditTenantDialog';

interface Tenant {
  id: number;
  name: string;
  shortName: string;
  status: string;
  isActive: boolean;
  logo: string;
}

const Tenants: React.FC = () => {
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  const defaultTenants: Tenant[] = [
    {
      id: 1,
      name: "iAF Technologies",
      shortName: "iAF",
      status: "Configuration complete",
      isActive: true,
      logo: "/lovable-uploads/tenant_logo-2.png"
    },
    {
      id: 2,
      name: "Jaguar Corporation",
      shortName: "Jaco",
      status: "Configuration complete",
      isActive: true,
      logo: "/lovable-uploads/image_3.png"
    },
    {
      id: 3,
      name: "General Enterprise",
      shortName: "Gen",
      status: "Configuration complete",
      isActive: true,
      logo: "/lovable-uploads/image_7.png"
    },
    {
      id: 4,
      name: "Delta Corporation",
      shortName: "Delta",
      status: "In Draft",
      isActive: false,
      logo: "/lovable-uploads/benepass-inc-logo-vector_1.png"
    },
    {
      id: 5,
      name: "United Kingdom Co.",
      shortName: "UKco",
      status: "In Draft",
      isActive: false,
      logo: "/lovable-uploads/Group.png"
    }
  ];

  const [clients, setClients] = useState<Tenant[]>(defaultTenants);

  // Load custom tenants from localStorage on mount
  useEffect(() => {
    const loadCustomTenants = () => {
      try {
        const customTenantsStr = localStorage.getItem('customTenants');
        if (customTenantsStr) {
          const customTenants = JSON.parse(customTenantsStr);
          if (Array.isArray(customTenants) && customTenants.length > 0) {
            // Get the max ID from default tenants
            const maxId = Math.max(...defaultTenants.map(t => t.id));
            // Add IDs to custom tenants and merge with defaults
            const tenantsWithIds = customTenants.map((tenant: any, index: number) => ({
              ...tenant,
              id: maxId + index + 1
            }));
            setClients([...defaultTenants, ...tenantsWithIds]);
          }
        }
      } catch (error) {
        console.error('Error loading custom tenants:', error);
      }
    };

    loadCustomTenants();
  }, []);

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditDialogOpen(true);
  };

  const handleSaveTenant = (updatedTenant: Tenant) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === updatedTenant.id ? updatedTenant : client
      )
    );
  };

  const handleAddTenant = (newTenant: Omit<Tenant, 'id'>) => {
    const maxId = Math.max(...clients.map(c => c.id), 0);
    const tenant: Tenant = {
      ...newTenant,
      id: maxId + 1
    };
    setClients(prevClients => [...prevClients, tenant]);
  };

  return (
    <>
      <EditTenantDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tenant={selectedTenant}
        onSave={handleSaveTenant}
      />
      
      <div className="min-h-screen p-6 space-y-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Tenants
        </h1>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/super-admin/tenants/add')}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Tenant</span>
        </Button>
      </div>

        <div className="mt-2 shadow-lg shadow-black/5">
          <Card className="overflow-hidden">
            <div 
              className="overflow-y-auto"
              style={{ 
                maxHeight: `calc(100vh - 320px)`,
                height: clients.length > 15 ? `calc(100vh - 320px)` : 'auto'
              }}
            >
              <Table className="w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                    <TableHead className="w-[10%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Sr. No</TableHead>
                    <TableHead className="w-[15%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Tenant Logo</TableHead>
                    <TableHead className="w-[30%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Tenant Name</TableHead>
                    <TableHead className="w-[20%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                    <TableHead className="w-[10%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Is Active</TableHead>
                    <TableHead className="w-[15%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground">{client.id}</TableCell>
                      <TableCell className="py-2 border-r-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-border/20 flex items-center justify-center">
                          <img 
                            src={client.logo} 
                            alt={`${client.shortName} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-4 h-4 text-muted-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></div>';
                              }
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 border-r-0">
                        <div>
                          <div className="font-medium text-sm text-foreground">{client.shortName}</div>
                          <div className="text-xs text-muted-foreground truncate">{client.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 border-r-0">
                        <Badge 
                          variant={client.status === "Configuration complete" ? "default" : "secondary"}
                          className={client.status === "Configuration complete" ? "bg-green-50 text-green-600 hover:bg-green-50" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 border-r-0">
                        <Switch checked={client.isActive} />
                      </TableCell>
                      <TableCell className="py-2 border-r-0">
                        <div className="flex items-center gap-2 text-sm">
                          <button 
                            onClick={() => handleEditClick(client)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-muted-foreground">|</span>
                          <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">Users</button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Tenants;