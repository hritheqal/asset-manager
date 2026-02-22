'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Officer {
  id: string;
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
}

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('officers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        console.warn('Officers table not found, using fallback:', supabaseError.message);
        // Fallback to hardcoded data for development
        setOfficers([
          { 
            id: '550e8400-e29b-41d4-a716-446655440000', 
            name: 'Ahmad bin Ibrahim', 
            position: 'Building Maintenance Manager',
            is_active: true 
          },
          { 
            id: '550e8400-e29b-41d4-a716-446655440001', 
            name: 'Siti Nurul Huda', 
            position: 'Asset Registration Supervisor',
            is_active: true 
          },
        ]);
      } else {
        setOfficers(data || []);
      }
    } catch (err) {
      console.error('Error fetching officers:', err);
      setError('Failed to load officers');
      // Fallback
      setOfficers([
        { 
          id: '550e8400-e29b-41d4-a716-446655440000', 
          name: 'Ahmad bin Ibrahim', 
          position: 'Building Maintenance Manager',
          is_active: true 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          name: 'Siti Nurul Huda', 
          position: 'Asset Registration Supervisor',
          is_active: true 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getOfficerById = (id: string): Officer | undefined => {
    return officers.find(o => o.id === id);
  };

  return { officers, loading, error, refetch: fetchOfficers, getOfficerById };
}
