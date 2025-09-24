import api from "./api";

export interface Vendor {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: number;
  name: string;
  manager?: string;
  email?: string;
  budget_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryAddress {
  id: number;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentTerm {
  id: number;
  name: string;
  description?: string;
  days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UnitOfMeasure {
  id: number;
  name: string;
  abbreviation?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Vendor API calls
export const vendorApi = {
  getAll: async (): Promise<Vendor[]> => {
    const response = await api.get("/configuration/vendors");
    return response.data.data;
  },

  getById: async (id: number): Promise<Vendor> => {
    const response = await api.get(`/configuration/vendors/${id}`);
    return response.data.data;
  },

  create: async (
    vendor: Omit<Vendor, "id" | "created_at" | "updated_at">
  ): Promise<Vendor> => {
    const response = await api.post("/configuration/vendors", vendor);
    return response.data.data;
  },

  update: async (
    id: number,
    vendor: Partial<Omit<Vendor, "id" | "created_at" | "updated_at">>
  ): Promise<Vendor> => {
    const response = await api.put(`/configuration/vendors/${id}`, vendor);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuration/vendors/${id}`);
  },
};

// Department API calls
export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get("/configuration/departments");
    return response.data.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get(`/configuration/departments/${id}`);
    return response.data.data;
  },

  create: async (
    department: Omit<Department, "id" | "created_at" | "updated_at">
  ): Promise<Department> => {
    const response = await api.post("/configuration/departments", department);
    return response.data.data;
  },

  update: async (
    id: number,
    department: Partial<Omit<Department, "id" | "created_at" | "updated_at">>
  ): Promise<Department> => {
    const response = await api.put(
      `/configuration/departments/${id}`,
      department
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuration/departments/${id}`);
  },
};

// Delivery Address API calls
export const deliveryAddressApi = {
  getAll: async (): Promise<DeliveryAddress[]> => {
    const response = await api.get("/configuration/delivery-addresses");
    return response.data.data;
  },

  getById: async (id: number): Promise<DeliveryAddress> => {
    const response = await api.get(`/configuration/delivery-addresses/${id}`);
    return response.data.data;
  },

  create: async (
    address: Omit<DeliveryAddress, "id" | "created_at" | "updated_at">
  ): Promise<DeliveryAddress> => {
    const response = await api.post(
      "/configuration/delivery-addresses",
      address
    );
    return response.data.data;
  },

  update: async (
    id: number,
    address: Partial<Omit<DeliveryAddress, "id" | "created_at" | "updated_at">>
  ): Promise<DeliveryAddress> => {
    const response = await api.put(
      `/configuration/delivery-addresses/${id}`,
      address
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuration/delivery-addresses/${id}`);
  },
};

// Payment Terms API calls
export const paymentTermApi = {
  getAll: async (): Promise<PaymentTerm[]> => {
    const response = await api.get("/configuration/payment-terms");
    return response.data.data;
  },

  getById: async (id: number): Promise<PaymentTerm> => {
    const response = await api.get(`/configuration/payment-terms/${id}`);
    return response.data.data;
  },

  create: async (
    term: Omit<PaymentTerm, "id" | "created_at" | "updated_at">
  ): Promise<PaymentTerm> => {
    const response = await api.post("/configuration/payment-terms", term);
    return response.data.data;
  },

  update: async (
    id: number,
    term: Partial<Omit<PaymentTerm, "id" | "created_at" | "updated_at">>
  ): Promise<PaymentTerm> => {
    const response = await api.put(`/configuration/payment-terms/${id}`, term);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuration/payment-terms/${id}`);
  },
};

// Units of Measure API calls
export const unitOfMeasureApi = {
  getAll: async (): Promise<UnitOfMeasure[]> => {
    const response = await api.get("/configuration/units-of-measure");
    return response.data.data;
  },

  getById: async (id: number): Promise<UnitOfMeasure> => {
    const response = await api.get(`/configuration/units-of-measure/${id}`);
    return response.data.data;
  },

  create: async (
    unit: Omit<UnitOfMeasure, "id" | "created_at" | "updated_at">
  ): Promise<UnitOfMeasure> => {
    const response = await api.post("/configuration/units-of-measure", unit);
    return response.data.data;
  },

  update: async (
    id: number,
    unit: Partial<Omit<UnitOfMeasure, "id" | "created_at" | "updated_at">>
  ): Promise<UnitOfMeasure> => {
    const response = await api.put(
      `/configuration/units-of-measure/${id}`,
      unit
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuration/units-of-measure/${id}`);
  },
};

// Settings API types
export interface Setting {
  id?: number;
  name: string;
  value: any;
  description?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SettingResponse {
  message: string;
  data?: Setting;
}

// Settings API calls
export const settingsApi = {
  get: async (name: string): Promise<Setting | null> => {
    try {
      const response = await api.get(`/configuration/settings/name/${name}`);
      return response.data.data;
    } catch (error: any) {
      // If setting doesn't exist, return null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAll: async (): Promise<Setting[]> => {
    const response = await api.get("/configuration/settings");
    return response.data.data || [];
  },

  update: async (name: string, value: any): Promise<SettingResponse> => {
    const response = await api.post("/configuration/settings", {
      name,
      value,
    });
    return response.data;
  },

  updateBatch: async (
    settings: Array<{ name: string; value: any }>
  ): Promise<SettingResponse> => {
    const response = await api.post("/configuration/settings/batch", {
      settings,
    });
    return response.data;
  },
};
