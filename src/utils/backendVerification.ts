
import { supabase } from '@/services/supabaseClient';

export interface VerificationResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class BackendVerification {
  private results: VerificationResult[] = [];

  async runAllTests(): Promise<VerificationResult[]> {
    this.results = [];
    
    console.log('🔍 Starting comprehensive backend verification...');
    
    // Test database connection
    await this.testDatabaseConnection();
    
    // Test authentication
    await this.testAuthentication();
    
    // Test RLS policies
    await this.testRLSPolicies();
    
    // Test foreign key constraints
    await this.testForeignKeys();
    
    // Test indexes and performance
    await this.testPerformance();
    
    // Test seed data integrity
    await this.testSeedData();
    
    // Test real-time subscriptions
    await this.testRealtime();
    
    return this.results;
  }

  private async testDatabaseConnection() {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('count(*)')
        .limit(1)
        .single();
        
      if (error) {
        this.addResult('Database', 'Connection Test', 'fail', `Database connection failed: ${error.message}`);
      } else {
        this.addResult('Database', 'Connection Test', 'pass', 'Database connection successful');
      }
    } catch (error) {
      this.addResult('Database', 'Connection Test', 'fail', `Connection error: ${error}`);
    }
  }

  private async testAuthentication() {
    try {
      // Test if auth is configured
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        this.addResult('Authentication', 'Session Check', 'pass', 'User is authenticated');
        
        // Test profile access
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          this.addResult('Authentication', 'Profile Access', 'warning', `Profile access issue: ${profileError.message}`);
        } else {
          this.addResult('Authentication', 'Profile Access', 'pass', 'Profile access working');
        }
      } else {
        this.addResult('Authentication', 'Session Check', 'warning', 'No active session (expected for logged out users)');
      }
    } catch (error) {
      this.addResult('Authentication', 'Auth Test', 'fail', `Auth error: ${error}`);
    }
  }

  private async testRLSPolicies() {
    try {
      // Test venues (should be publicly readable)
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('id, name')
        .limit(5);
        
      if (venuesError) {
        this.addResult('RLS', 'Public Venues Access', 'fail', `Venues RLS error: ${venuesError.message}`);
      } else {
        this.addResult('RLS', 'Public Venues Access', 'pass', `Can read ${venues?.length || 0} venues`);
      }

      // Test protected tables (should require auth)
      const { error: plansError } = await supabase
        .from('plans')
        .select('id')
        .limit(1);
        
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && plansError) {
        this.addResult('RLS', 'Protected Plans Access', 'pass', 'Plans properly protected (access denied for unauthenticated users)');
      } else if (session && !plansError) {
        this.addResult('RLS', 'Protected Plans Access', 'pass', 'Plans accessible for authenticated users');
      } else {
        this.addResult('RLS', 'Protected Plans Access', 'warning', 'RLS behavior unexpected');
      }
    } catch (error) {
      this.addResult('RLS', 'Policy Test', 'fail', `RLS test error: ${error}`);
    }
  }

  private async testForeignKeys() {
    try {
      // Test foreign key relationships by checking if they exist
      const { data: plansWithStops, error } = await supabase
        .from('plans')
        .select(`
          id,
          name,
          plan_stops (
            id,
            venue_id,
            venues (
              id,
              name
            )
          )
        `)
        .limit(3);
        
      if (error) {
        this.addResult('Foreign Keys', 'Relationship Test', 'fail', `FK relationship error: ${error.message}`);
      } else {
        const hasStops = plansWithStops?.some(plan => plan.plan_stops?.length > 0);
        if (hasStops) {
          this.addResult('Foreign Keys', 'Relationship Test', 'pass', 'Foreign key relationships working correctly');
        } else {
          this.addResult('Foreign Keys', 'Relationship Test', 'warning', 'No plan stops found to test relationships');
        }
      }
    } catch (error) {
      this.addResult('Foreign Keys', 'FK Test', 'fail', `FK error: ${error}`);
    }
  }

  private async testPerformance() {
    try {
      const startTime = performance.now();
      
      // Test a complex query that should use indexes
      const { data, error } = await supabase
        .from('plans')
        .select(`
          *,
          plan_participants!inner (
            user_id,
            profiles (
              full_name
            )
          ),
          plan_stops (
            *,
            venues (
              name,
              venue_type
            )
          )
        `)
        .eq('status', 'planned')
        .limit(10);
        
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (error) {
        this.addResult('Performance', 'Complex Query', 'fail', `Query error: ${error.message}`);
      } else if (duration > 2000) {
        this.addResult('Performance', 'Complex Query', 'warning', `Query took ${duration.toFixed(0)}ms (may need optimization)`);
      } else {
        this.addResult('Performance', 'Complex Query', 'pass', `Query completed in ${duration.toFixed(0)}ms`);
      }
    } catch (error) {
      this.addResult('Performance', 'Performance Test', 'fail', `Performance test error: ${error}`);
    }
  }

  private async testSeedData() {
    try {
      // Check if seed data exists
      const tables = [
        { name: 'venues', expected: 5 },
        { name: 'profiles', expected: 5 },
        { name: 'plans', expected: 3 },
        { name: 'friends', expected: 7 }
      ];
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          this.addResult('Seed Data', `${table.name} count`, 'fail', `Error counting ${table.name}: ${error.message}`);
        } else if (count === 0) {
          this.addResult('Seed Data', `${table.name} count`, 'warning', `No ${table.name} found - seed data may not be loaded`);
        } else if (count === table.expected) {
          this.addResult('Seed Data', `${table.name} count`, 'pass', `Found ${count} ${table.name} records (expected)`);
        } else {
          this.addResult('Seed Data', `${table.name} count`, 'warning', `Found ${count} ${table.name} records (expected ${table.expected})`);
        }
      }
    } catch (error) {
      this.addResult('Seed Data', 'Data Check', 'fail', `Seed data test error: ${error}`);
    }
  }

  private async testRealtime() {
    try {
      // Test if realtime is enabled by creating a simple subscription
      const channel = supabase.channel('test-channel');
      
      const subscription = channel
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'venues' }, 
          () => {
            // Test callback
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.addResult('Realtime', 'Subscription Test', 'pass', 'Realtime subscriptions working');
          } else if (status === 'CHANNEL_ERROR') {
            this.addResult('Realtime', 'Subscription Test', 'fail', 'Realtime subscription failed');
          }
        });
      
      // Clean up
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 1000);
      
    } catch (error) {
      this.addResult('Realtime', 'Realtime Test', 'fail', `Realtime error: ${error}`);
    }
  }

  private addResult(category: string, test: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) {
    this.results.push({
      category,
      test,
      status,
      message,
      details
    });
    
    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${emoji} [${category}] ${test}: ${message}`);
  }

  generateReport(): string {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    
    let report = `\n🔍 Backend Verification Report\n`;
    report += `================================\n`;
    report += `✅ Passed: ${passed}\n`;
    report += `❌ Failed: ${failed}\n`;
    report += `⚠️  Warnings: ${warnings}\n`;
    report += `📊 Total: ${this.results.length}\n\n`;
    
    const categories = [...new Set(this.results.map(r => r.category))];
    
    for (const category of categories) {
      report += `\n${category}:\n`;
      report += `${'-'.repeat(category.length + 1)}\n`;
      
      const categoryResults = this.results.filter(r => r.category === category);
      for (const result of categoryResults) {
        const emoji = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
        report += `${emoji} ${result.test}: ${result.message}\n`;
      }
    }
    
    return report;
  }
}

// Utility function to run verification and log results
export const runBackendVerification = async (): Promise<VerificationResult[]> => {
  const verification = new BackendVerification();
  const results = await verification.runAllTests();
  
  console.log(verification.generateReport());
  
  return results;
};
