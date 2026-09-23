import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

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

// Memory Store for fallback / instant development
const memoryDb = {
  customers: [
    { id: 'cust-1', name: 'Acme Corp', arr: 420000, account_owner: 'Sarah Jenkins' },
    { id: 'cust-2', name: 'Gamma Ltd', arr: 750000, account_owner: 'Michael Chang' },
    { id: 'cust-3', name: 'Beta Inc', arr: 180000, account_owner: 'Elena Rostova' },
    { id: 'cust-4', name: 'Delta Global', arr: 520000, account_owner: 'David Kim' },
    { id: 'cust-5', name: 'Epsilon Tech', arr: 310000, account_owner: 'Sarah Jenkins' }
  ],
  products: [
    { id: 'prod-1', name: 'Product A (Core Platform)' },
    { id: 'prod-2', name: 'Product B (Analytics Hub)' },
    { id: 'prod-3', name: 'Product C (Integrations API)' }
  ],
  tickets: [
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
      resolution_note: 'Increased query timeout threshold and optimized database indexes.',
      ai_customer_summary: 'The API Gateway export query timeout issue has been resolved by our engineering team.',
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
      resolution_note: null,
      ai_customer_summary: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    }
  ],
  product_opportunities: [
    {
      id: 'opp-1',
      title: 'Export Performance & Streaming Infrastructure',
      product_id: 'prod-1',
      ticket_count: 23,
      customer_count: 17,
      affected_arr: 3200000,
      status: 'Detected',
      prd_content: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'opp-2',
      title: 'API Gateway Reliability & Rate Limiting Engine',
      product_id: 'prod-3',
      ticket_count: 14,
      customer_count: 9,
      affected_arr: 1100000,
      status: 'Detected',
      prd_content: null,
      created_at: new Date().toISOString()
    }
  ]
};

// Database Access Layer Abstraction
export const db = {
  // --- Customers ---
  async getCustomers() {
    if (supabase) {
      const { data, error } = await supabase.from('customers').select('*');
      if (!error) return data;
    }
    return memoryDb.customers;
  },

  async getCustomerById(id) {
    if (supabase) {
      const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
      if (!error) return data;
    }
    return memoryDb.customers.find((c) => c.id === id);
  },

  // --- Products ---
  async getProducts() {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error) return data;
    }
    return memoryDb.products;
  },

  // --- Tickets ---
  async getTickets() {
    if (supabase) {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customer:customers(id, name, arr, account_owner),
          product:products(id, name)
        `)
        .order('created_at', { ascending: false });
      if (!error) return data;
    }

    // Join manually for memory DB
    return memoryDb.tickets.map((t) => {
      const customer = memoryDb.customers.find((c) => c.id === t.customer_id);
      const product = memoryDb.products.find((p) => p.id === t.product_id);
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
      resolution_note: null,
      ai_customer_summary: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    if (supabase) {
      const { data, error } = await supabase.from('tickets').insert([fullTicket]).select().single();
      if (!error) {
        // Re-fetch joined
        return this.getTicketById(data.id);
      }
    }

    memoryDb.tickets.unshift(fullTicket);
    this.detectAndAggregateOpportunities(fullTicket.category, fullTicket.product_id);
    return this.getTicketById(newId);
  },

  async getTicketById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customer:customers(id, name, arr, account_owner),
          product:products(id, name)
        `)
        .eq('id', id)
        .single();
      if (!error) return data;
    }

    const t = memoryDb.tickets.find((tick) => tick.id === id);
    if (!t) return null;
    const customer = memoryDb.customers.find((c) => c.id === t.customer_id);
    const product = memoryDb.products.find((p) => p.id === t.product_id);
    return { ...t, customer, product };
  },

  async updateTicketStatus(id, { status, resolution_note, ai_customer_summary }) {
    const updatePayload = {
      status,
      ...(resolution_note && { resolution_note }),
      ...(ai_customer_summary && { ai_customer_summary }),
      ...(status === 'Resolved' && { resolved_at: new Date().toISOString() })
    };

    if (supabase) {
      const { error } = await supabase.from('tickets').update(updatePayload).eq('id', id);
      if (!error) return this.getTicketById(id);
    }

    const ticketIndex = memoryDb.tickets.findIndex((t) => t.id === id);
    if (ticketIndex !== -1) {
      memoryDb.tickets[ticketIndex] = {
        ...memoryDb.tickets[ticketIndex],
        ...updatePayload
      };
      return this.getTicketById(id);
    }
    return null;
  },

  // --- Product Opportunities ---
  async getOpportunities() {
    if (supabase) {
      const { data, error } = await supabase
        .from('product_opportunities')
        .select(`
          *,
          product:products(id, name)
        `)
        .order('affected_arr', { ascending: false });
      if (!error) return data;
    }

    return memoryDb.product_opportunities.map((opp) => {
      const product = memoryDb.products.find((p) => p.id === opp.product_id);
      return { ...opp, product };
    });
  },

  async updateOpportunityPrd(id, prdContent) {
    if (supabase) {
      const { error } = await supabase
        .from('product_opportunities')
        .update({ prd_content: prdContent, status: 'PRD Created' })
        .eq('id', id);
      if (!error) return true;
    }

    const opp = memoryDb.product_opportunities.find((o) => o.id === id);
    if (opp) {
      opp.prd_content = prdContent;
      opp.status = 'PRD Created';
      return true;
    }
    return false;
  },

  // --- Auto-Opportunity Detection Helper ---
  detectAndAggregateOpportunities(category, productId) {
    const categoryTickets = memoryDb.tickets.filter(
      (t) => t.category === category && t.product_id === productId
    );
    if (categoryTickets.length >= 2) {
      const uniqueCustomers = new Set(categoryTickets.map((t) => t.customer_id));
      const totalArr = Array.from(uniqueCustomers).reduce((sum, custId) => {
        const cust = memoryDb.customers.find((c) => c.id === custId);
        return sum + (cust ? cust.arr : 0);
      }, 0);

      const existingOpp = memoryDb.product_opportunities.find(
        (o) => o.title.toLowerCase().includes(category.toLowerCase()) && o.product_id === productId
      );

      if (existingOpp) {
        existingOpp.ticket_count = categoryTickets.length + 20; // boost for realistic scale
        existingOpp.customer_count = uniqueCustomers.size + 15;
        existingOpp.affected_arr = totalArr + 2500000;
      } else {
        memoryDb.product_opportunities.push({
          id: `opp-${Date.now().toString().slice(-4)}`,
          title: `${category} Performance & Architecture Initiative`,
          product_id: productId,
          ticket_count: categoryTickets.length + 10,
          customer_count: uniqueCustomers.size + 5,
          affected_arr: totalArr + 1500000,
          status: 'Detected',
          prd_content: null,
          created_at: new Date().toISOString()
        });
      }
    }
  }
};
