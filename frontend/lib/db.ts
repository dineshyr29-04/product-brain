import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your_supabase')
);

export let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Connected to Supabase PostgreSQL');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client, falling back to local store:', err.message);
  }
} else {
  console.log('💡 Supabase keys not set. Operating with high-speed in-memory store for development/demo.');
}

const defaultCustomers = [
  { id: 'cust-1', name: 'Acme Corp', arr: 420000, account_owner: 'Sarah Jenkins' },
  { id: 'cust-2', name: 'Gamma Ltd', arr: 750000, account_owner: 'Michael Chang' },
  { id: 'cust-3', name: 'Beta Inc', arr: 180000, account_owner: 'Elena Rostova' },
  { id: 'cust-4', name: 'Delta Global', arr: 520000, account_owner: 'David Kim' },
  { id: 'cust-5', name: 'Epsilon Tech', arr: 310000, account_owner: 'Sarah Jenkins' }
];

const defaultProducts = [
  { id: 'prod-1', name: 'Product A (Core Platform)' },
  { id: 'prod-2', name: 'Product B (Analytics Hub)' },
  { id: 'prod-3', name: 'Product C (Integrations API)' }
];

const initialTickets = [
  {
    id: 'tick-1024',
    ticket_number: 1024,
    customer_id: 'cust-1',
    product_id: 'prod-1',
    title: 'Export is failing for large datasets',
    description: 'Query timeout occurs whenever exporting CSV reports > 50MB.',
    priority: 'High',
    status: 'In Progress',
    category: 'Export Performance',
    technical_logs: 'QueryTimeoutException: 30000ms exceeded in db.driver.js:42',
    resolution_note: null,
    ai_customer_summary: null,
    created_at: new Date().toISOString(),
    resolved_at: null
  },
  {
    id: 'tick-1025',
    ticket_number: 1025,
    customer_id: 'cust-3',
    product_id: 'prod-1',
    title: 'Login timeout on SSO redirect',
    description: 'SAML SSO authentication hangs on step 2 for enterprise users.',
    priority: 'Medium',
    status: 'Open',
    category: 'Login Problems',
    technical_logs: 'SSO_HANDSHAKE_TIMEOUT [408] redirect to sso.beta.com',
    resolution_note: null,
    ai_customer_summary: null,
    created_at: new Date().toISOString(),
    resolved_at: null
  },
  {
    id: 'tick-1026',
    ticket_number: 1026,
    customer_id: 'cust-2',
    product_id: 'prod-3',
    title: 'API Gateway rate-limiting failure',
    description: '502 Bad Gateway during peak hour payload bursts.',
    priority: 'Critical',
    status: 'Resolved',
    category: 'API Reliability',
    technical_logs: '502 Bad Gateway: Upstream rate limiter overflow [1000req/sec]',
    resolution_note: 'Increased query timeout threshold and optimized database indexes.',
    ai_customer_summary: 'The API Gateway query timeout and rate-limiting issue has been successfully resolved by our engineering team. All API endpoints are operational.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    resolved_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'tick-1027',
    ticket_number: 1027,
    customer_id: 'cust-4',
    product_id: 'prod-1',
    title: 'Export memory leak during batch download',
    description: 'Server OOM crash when 3 users trigger export simultaneously.',
    priority: 'High',
    status: 'Open',
    category: 'Export Performance',
    technical_logs: 'FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory',
    resolution_note: null,
    ai_customer_summary: null,
    created_at: new Date().toISOString(),
    resolved_at: null
  },
  {
    id: 'tick-1028',
    ticket_number: 1028,
    customer_id: 'cust-5',
    product_id: 'prod-2',
    title: 'Analytics dashboard chart rendering lag',
    description: 'Canvas takes 12s to render time-series widget.',
    priority: 'Medium',
    status: 'Open',
    category: 'Dashboard Lag',
    technical_logs: 'LongTaskWarning: script execution took 11840ms on renderCanvas()',
    resolution_note: null,
    ai_customer_summary: null,
    created_at: new Date().toISOString(),
    resolved_at: null
  }
];

const initialOpportunities = [
  {
    id: 'opp-1',
    title: 'Export Performance & Streaming Infrastructure',
    product_id: 'prod-1',
    ticket_count: 2,
    customer_count: 2,
    affected_arr: 940000,
    status: 'Detected',
    prd_content: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'opp-2',
    title: 'API Gateway Reliability & Rate Limiting Engine',
    product_id: 'prod-3',
    ticket_count: 1,
    customer_count: 1,
    affected_arr: 750000,
    status: 'Detected',
    prd_content: null,
    created_at: new Date().toISOString()
  }
];

// Memory Store for fallback / instant development
const memoryDb = {
  customers: [...defaultCustomers],
  products: [...defaultProducts],
  tickets: [...initialTickets],
  product_opportunities: [...initialOpportunities]
};

// Database Access Layer Abstraction
export const db = {
  // --- Customers ---
  async getCustomers() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('customers').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getCustomers fallback:', e.message);
      }
    }
    return memoryDb.customers;
  },

  async getCustomerById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (e) {
        // Fallback
      }
    }
    return memoryDb.customers.find((c) => c.id === id) || defaultCustomers[0];
  },

  // --- Products ---
  async getProducts() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getProducts fallback:', e.message);
      }
    }
    return memoryDb.products;
  },

  // --- Tickets ---
  async getTickets() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            customer:customers(id, name, arr, account_owner),
            product:products(id, name)
          `)
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getTickets fallback:', e.message);
      }
    }

    // Join manually for memory DB
    return memoryDb.tickets.map((t) => {
      const customer = memoryDb.customers.find((c) => c.id === t.customer_id) || defaultCustomers.find((c) => c.id === t.customer_id) || { name: 'Enterprise Client', arr: 250000 };
      const product = memoryDb.products.find((p) => p.id === t.product_id) || defaultProducts.find((p) => p.id === t.product_id) || { name: 'Core Platform' };
      return {
        ...t,
        customer,
        product
      };
    });
  },

  async createTicket(ticketData) {
    const newId = `tick-${Date.now().toString().slice(-4)}`;
    const ticketNumber = 1000 + memoryDb.tickets.length + 1;

    const fullTicket = {
      id: newId,
      ticket_number: ticketNumber,
      customer_id: ticketData.customer_id,
      product_id: ticketData.product_id,
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority || 'Medium',
      status: 'Open',
      category: ticketData.category || 'General',
      technical_logs: ticketData.technical_logs || null,
      resolution_note: null,
      ai_customer_summary: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('tickets').insert([fullTicket]).select().single();
        if (!error && data) {
          const joined = await this.getTicketById(data.id);
          if (joined) {
            memoryDb.tickets.unshift(joined);
            return joined;
          }
        }
      } catch (e) {
        console.warn('Supabase createTicket fallback:', e.message);
      }
    }

    memoryDb.tickets.unshift(fullTicket);
    this.detectAndAggregateOpportunities(fullTicket.category, fullTicket.product_id);
    return this.getTicketById(newId);
  },

  async getTicketById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            customer:customers(id, name, arr, account_owner),
            product:products(id, name)
          `)
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e) {
        // Fallback
      }
    }

    const t = memoryDb.tickets.find((tick) => tick.id === id);
    if (!t) return null;
    const customer = memoryDb.customers.find((c) => c.id === t.customer_id) || defaultCustomers[0];
    const product = memoryDb.products.find((p) => p.id === t.product_id) || defaultProducts[0];
    return { ...t, customer, product };
  },

  async updateTicketStatus(id, { status, resolution_note, ai_customer_summary }) {
    const updatePayload = {
      status,
      ...(resolution_note && { resolution_note }),
      ...(ai_customer_summary && { ai_customer_summary }),
      ...(status === 'Resolved' && { resolved_at: new Date().toISOString() })
    };

    // Always update memoryDb
    const ticketIndex = memoryDb.tickets.findIndex((t) => t.id === id);
    if (ticketIndex !== -1) {
      memoryDb.tickets[ticketIndex] = {
        ...memoryDb.tickets[ticketIndex],
        ...updatePayload
      };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('tickets').update(updatePayload).eq('id', id).select();
        if (!error && data && data.length > 0) return this.getTicketById(id);
      } catch (e) {
        console.warn('Supabase updateTicketStatus fallback:', e.message);
      }
    }

    return this.getTicketById(id);
  },

  // --- Product Opportunities ---
  async getOpportunities() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('product_opportunities')
          .select(`
            *,
            product:products(id, name)
          `)
          .order('affected_arr', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getOpportunities fallback:', e.message);
      }
    }

    return memoryDb.product_opportunities.map((opp) => {
      const product = memoryDb.products.find((p) => p.id === opp.product_id) || defaultProducts[0];
      return { ...opp, product };
    });
  },

  async getOpportunityById(id: string) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('product_opportunities')
          .select(`
            *,
            product:products(id, name)
          `)
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e: any) {
        console.warn('Supabase getOpportunityById fallback:', e.message);
      }
    }

    const opp = memoryDb.product_opportunities.find((o) => o.id === id);
    if (!opp) return null;
    const product = memoryDb.products.find((p) => p.id === opp.product_id) || defaultProducts[0];
    return { ...opp, product };
  },

  async updateOpportunityPRD(id: string, prdContent: string) {
    return this.updateOpportunityPrd(id, prdContent);
  },

  async updateOpportunityPrd(id, prdContent) {
    const opp = memoryDb.product_opportunities.find((o) => o.id === id);
    if (opp) {
      opp.prd_content = prdContent;
      opp.status = 'PRD Created';
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('product_opportunities')
          .update({ prd_content: prdContent, status: 'PRD Created' })
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        // Fallback
      }
    }

    return Boolean(opp);
  },

  // --- Auto-Opportunity Detection Helper ---
  detectAndAggregateOpportunities(category, productId) {
    const categoryTickets = memoryDb.tickets.filter(
      (t) => t.category === category && t.product_id === productId
    );
    if (categoryTickets.length >= 2) {
      const uniqueCustomers = new Set(categoryTickets.map((t) => t.customer_id));
      const totalArr = Array.from(uniqueCustomers).reduce((sum, custId) => {
        const c = memoryDb.customers.find((cust) => cust.id === custId) || defaultCustomers.find((cust) => cust.id === custId);
        return sum + (c ? Number(c.arr) : 250000);
      }, 0);

      const existingOpp = memoryDb.product_opportunities.find(
        (o) => o.title.includes(category) || o.product_id === productId
      );

      if (existingOpp) {
        existingOpp.ticket_count = categoryTickets.length;
        existingOpp.customer_count = uniqueCustomers.size;
        existingOpp.affected_arr = totalArr;
      } else {
        const newOpp = {
          id: `opp-${Date.now().toString().slice(-4)}`,
          title: `${category} Remediation & Scalability Cluster`,
          product_id: productId,
          ticket_count: categoryTickets.length,
          customer_count: uniqueCustomers.size,
          affected_arr: totalArr,
          status: 'Detected',
          prd_content: null,
          created_at: new Date().toISOString()
        };
        memoryDb.product_opportunities.unshift(newOpp);
      }
    }
  },

  // --- Reset to 0 & Demo Seeder ---
  async resetToZero() {
    if (supabase) {
      try {
        await supabase.from('tickets').delete().neq('id', '___none___');
        await supabase.from('product_opportunities').delete().neq('id', '___none___');
      } catch (e) {
        // Fallback
      }
    }
    memoryDb.tickets = [];
    memoryDb.product_opportunities = [];
    return { success: true, message: 'All tickets and opportunities reset to 0' };
  },

  async seedDemo() {
    if (supabase) {
      try {
        await supabase.from('tickets').delete().neq('id', '___none___');
        await supabase.from('product_opportunities').delete().neq('id', '___none___');
        await supabase.from('tickets').insert(initialTickets);
        await supabase.from('product_opportunities').insert(initialOpportunities);
      } catch (e) {
        // Fallback
      }
    }
    memoryDb.tickets = [...initialTickets];
    memoryDb.product_opportunities = [...initialOpportunities];
    return { success: true, count: initialTickets.length, message: 'Demo tickets and opportunities loaded' };
  }
};
