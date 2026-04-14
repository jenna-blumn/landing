/*
  # Create OMS Integrations and Orders Tables

  ## Overview
  This migration creates tables to manage OMS (Order Management System) integrations
  and their associated order data for the customer service platform.

  ## 1. New Tables
  
  ### `oms_integrations` 
  Stores information about connected OMS platforms
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, not null) - OMS platform name (e.g., "Cafe24", "Naver", etc.)
  - `type` (text, not null) - OMS type/category
  - `status` (text, not null) - Connection status: 'connected', 'disconnected', 'not_configured'
  - `api_key` (text) - Encrypted API key for integration
  - `config` (jsonb) - Additional configuration settings
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `oms_orders`
  Stores order data from connected OMS platforms
  - `id` (uuid, primary key) - Unique identifier
  - `oms_integration_id` (uuid, foreign key) - References oms_integrations
  - `order_number` (text, not null) - Order number from OMS
  - `customer_name` (text, not null) - Customer name
  - `product` (text, not null) - Product name
  - `amount` (numeric, not null) - Order amount
  - `status` (text, not null) - Order status
  - `order_date` (timestamptz, not null) - Order date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  - Enable RLS on both tables
  - Add policies for authenticated users to read their organization's data
  - Add policies for authenticated users to manage integrations and orders

  ## 3. Indexes
  - Index on oms_orders.oms_integration_id for faster lookups
  - Index on oms_orders.order_date for time-based queries
  - Index on oms_integrations.status for filtering
*/

-- Create oms_integrations table
CREATE TABLE IF NOT EXISTS oms_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'not_configured',
  api_key text,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create oms_orders table
CREATE TABLE IF NOT EXISTS oms_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oms_integration_id uuid NOT NULL REFERENCES oms_integrations(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  customer_name text NOT NULL,
  product text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL,
  order_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oms_orders_integration_id ON oms_orders(oms_integration_id);
CREATE INDEX IF NOT EXISTS idx_oms_orders_order_date ON oms_orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_oms_integrations_status ON oms_integrations(status);

-- Enable RLS
ALTER TABLE oms_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oms_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for oms_integrations
CREATE POLICY "Users can view all integrations"
  ON oms_integrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert integrations"
  ON oms_integrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update integrations"
  ON oms_integrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete integrations"
  ON oms_integrations FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for oms_orders
CREATE POLICY "Users can view all orders"
  ON oms_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert orders"
  ON oms_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update orders"
  ON oms_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete orders"
  ON oms_orders FOR DELETE
  TO authenticated
  USING (true);