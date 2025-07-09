CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    company_id UUID,
    module TEXT,
    transaction_date DATE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ
);
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    ledger_id UUID REFERENCES journals(id) ON DELETE CASCADE,
    tenant_id UUID,
    company_id UUID,
    line_number INTEGER NOT NULL,
    account_code TEXT NOT NULL,
    debit NUMERIC(18, 2) NOT NULL DEFAULT 0,
    credit NUMERIC(18, 2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_journals_tenant ON journals(tenant_id);
CREATE INDEX idx_entries_ledger_id ON journal_entries(ledger_id);
CREATE INDEX idx_entries_tenant ON journal_entries(tenant_id);