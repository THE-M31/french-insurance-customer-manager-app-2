
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          postal_code: string;
          date_of_birth: string;
          customer_number: string;
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      policies: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_id: string;
          policy_number: string;
          policy_type: string;
          start_date: string;
          end_date: string;
          premium_amount: number;
          status: 'active' | 'expired' | 'cancelled';
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['policies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['policies']['Insert']>;
      };
    };
  };
}