
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  date_of_birth: string;
  gender?: string;
  cin?: string;
  policy_number?: string;
  policy_type?: string;
  policy_status?: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Claim {
  id: string;
  claim_number: string;
  customer_id: string;
  policy_number?: string;
  claim_type: string;
  incident_date: string;
  reported_date: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'closed';
  description: string;
  estimated_amount?: number;
  approved_amount?: number;
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  customer?: Customer;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent';
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
}