import api from "./api";

export interface LineItem {
  id?: string;
  itemCode: string;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice?: number;
}

export interface PurchaseOrder {
  id: number;
  title: string;
  reference: string;
  vendor_id: number;
  requester: string;
  department: number;
  due_date?: string;
  address: number;
  payment_terms: number;
  total: number;
  notes?: string;
  status: "draft" | "pending_review" | "approved" | "rejected" | "completed";
  created_at?: string;
  updated_at?: string;
  items?: LineItem[];
}

export interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface POItem {
  id: number;
  po_id: number;
  item_code: string;
  description: string;
  quantity: number;
  uom: number;
  unit_price: string;
  status: string;
}

export interface PurchaseOrderSummary {
  id: number;
  title: string;
  reference: string;
  vendor_id: number;
  vendor: Vendor;
  requester: string;
  department: string;
  address: string;
  payment_terms: string | null;
  due_date: string;
  notes: string;
  total: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: POItem[];
}

// Purchase Order API calls
export const poRequestApi = {
  // Get all purchase orders for the current user
  getAll: async (status?: string): Promise<PurchaseOrderSummary[]> => {
    const params = status ? { status } : {};
    const response = await api.get("/requester/purchase-orders", { params });
    return response.data.data;
  },

  // Get a specific purchase order by ID
  getById: async (id: number): Promise<PurchaseOrderSummary> => {
    const response = await api.get(`/requester/purchase-orders/${id}`);
    return response.data.data;
  },

  // Create a new purchase order
  create: async (
    poData:
      | FormData
      | {
          title: string;
          vendor_id: number;
          department: number;
          due_date?: string;
          address: number;
          payment_terms: number;
          notes?: string;
          items: Omit<LineItem, "id" | "po_id" | "created_at" | "updated_at">[];
        }
  ): Promise<PurchaseOrder> => {
    // If poData is FormData, send it with proper headers
    const config =
      poData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    const response = await api.post(
      "/requester/purchase-orders",
      poData,
      config
    );
    return response.data.data;
  },

  // Update a purchase order
  update: async (
    id: number,
    poData: Partial<{
      title: string;
      vendor_id: number;
      department: number;
      due_date: string;
      address: number;
      payment_terms: number;
      notes: string;
      items: Omit<LineItem, "id" | "po_id" | "created_at" | "updated_at">[];
    }>
  ): Promise<PurchaseOrder> => {
    const response = await api.put(`/requester/purchase-orders/${id}`, poData);
    return response.data.data;
  },

  // Update a purchase order status
  updateStatus: async (
    id: number,
    poData: { status: string }
  ): Promise<PurchaseOrder> => {
    const response = await api.patch(
      `/requester/purchase-orders/${id}/status`,
      poData
    );
    return response.data.data;
  },

  // Delete a purchase order
  delete: async (id: number): Promise<void> => {
    await api.delete(`/purchase-orders/${id}`);
  },

  // Submit a purchase order for review
  submitForReview: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.post(`/requester/purchase-orders/${id}/submit`);
    return response.data.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<{
    draft: number;
    pending_review: number;
    approved: number;
    rejected: number;
    completed: number;
  }> => {
    const response = await api.get("/requester/purchase-orders/dashboard");
    return response.data.data;
  },

  // Get documents for a specific purchase order by ID
  getDocuments: async (id: number): Promise<any[]> => {
    const response = await api.get(`/requester/purchase-orders/${id}/files`);
    return response.data.data;
  },

  // Approve a purchase order
  approve: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.post(`/reviewer/purchase-orders/${id}/approve`);
    return response.data.data;
  },

  // Reject a purchase order
  reject: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.post(`/reviewer/purchase-orders/${id}/reject`);
    return response.data.data;
  },
};

export const discussionsApi = {
  // Get a specific discussion by ID
  getById: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.get(`/requester/discussion/${id}`);
    return response.data.data;
  },

  // Create a new discussion
  create: async (discussionData: {
    po_id: number;
    message?: string;
    user_name?: string;
  }): Promise<PurchaseOrder> => {
    const response = await api.post("/requester/discussion", discussionData);
    return response.data.data;
  },
};

export interface CatalogItem {
  id: number;
  item_code: string;
  description: string;
  unit_price: number;
  uom_id?: number;
  uom?: string; // API might return uom name instead of uom_id
  created_at?: string;
  updated_at?: string;
}

export const catalogItemsApi = {
  // Get all catalog items
  getAll: async (): Promise<CatalogItem[]> => {
    const response = await api.get("/requester/catalog_items");
    return response.data.data;
  },

  // Create a new catalog item
  create: async (itemData: {
    item_code: string;
    description: string;
    unit_price: number;
    uom?: string;
  }): Promise<CatalogItem> => {
    const response = await api.post("/requester/catalog_items", itemData);
    return response.data.data;
  },

  // Delete a catalog item
  delete: async (id: number): Promise<void> => {
    await api.delete(`/requester/catalog_items/${id}`);
  },
};
