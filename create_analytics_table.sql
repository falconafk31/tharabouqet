-- SQL Script: Create Click Analytics Table
-- Paste this into your Supabase SQL Editor

CREATE TABLE click_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'whatsapp_order', 'whatsapp_share', 'whatsapp_general', 'facebook_share'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_click_analytics_type ON click_analytics(type);
CREATE INDEX idx_click_analytics_created_at ON click_analytics(created_at);
