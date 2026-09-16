'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => localStorage.getItem('bldr_admin_token');

export default function AdminCommissionPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalRate, setGlobalRate] = useState('');
  const [providerRates, setProviderRates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const fetchRules = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const res = await fetch(`${API}/admin/commission`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const rules = data || [];
    setRules(rules);
    const global = rules.find((r: any) => !r.providerId);
    if (global) setGlobalRate(String(Number(global.rate) * 100));
    setLoading(false);
  };

  useEffect(() => { fetchRules(); }, []);

  const saveGlobal = async () => {
    setSaving('global');
    const token = getToken();
    await fetch(`${API}/admin/commission/global`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rate: parseFloat(globalRate) / 100 }),
    });
    setSaving(null);
    setMsg('Global rate saved!');
    setTimeout(() => setMsg(''), 2000);
    fetchRules();
  };

  const saveProvider = async (providerId: string) => {
    setSaving(providerId);
    const token = getToken();
    const rate = parseFloat(providerRates[providerId]) / 100;
    await fetch(`${API}/admin/commission/provider/${providerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rate }),
    });
    setSaving(null);
    setMsg('Provider rate saved!');
    setTimeout(() => setMsg(''), 2000);
    fetchRules();
  };

  const removeProvider = async (providerId: string) => {
    const token = getToken();
    await fetch(`${API}/admin/commission/provider/${providerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRules();
  };

  const providerRulesList = rules.filter(r => r.providerId);

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Commission Rules</h1>
        </header>
        <div className="page-content fade-up" style={{ maxWidth: '720px' }}>
          {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--green)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--green)' }}>{msg}</div>}

          {/* Global rate */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Global Default Rate</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Applied to all providers that don't have a custom rate
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '0 0 180px' }}>
                <input id="global-rate" className="form-input" type="number" min="0" max="100" step="0.1"
                  placeholder="10" value={globalRate}
                  onChange={e => setGlobalRate(e.target.value)}
                  style={{ paddingRight: '32px' }} />
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}>%</span>
              </div>
              <button id="btn-save-global" className="btn btn-primary" onClick={saveGlobal} disabled={saving === 'global'}>
                {saving === 'global' ? 'Saving…' : 'Save Global Rate'}
              </button>
            </div>
          </div>

          {/* Provider overrides */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Per-Provider Overrides</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Custom rates for specific providers (takes precedence over the global rate)
            </p>
            {loading ? <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {providerRulesList.map(rule => (
                  <div key={rule.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)', flexWrap: 'wrap',
                  }}>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '14px' }}>
                      {rule.provider?.name || 'Unknown'}
                    </span>
                    <div style={{ position: 'relative', width: '120px' }}>
                      <input className="form-input" type="number" min="0" max="100" step="0.1"
                        value={providerRates[rule.providerId] ?? String(Number(rule.rate) * 100)}
                        onChange={e => setProviderRates(prev => ({ ...prev, [rule.providerId]: e.target.value }))}
                        style={{ paddingRight: '28px', fontSize: '13px' }} />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '13px' }}>%</span>
                    </div>
                    <button className="btn btn-primary btn-sm"
                      disabled={saving === rule.providerId}
                      onClick={() => saveProvider(rule.providerId)}>
                      Save
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeProvider(rule.providerId)}>
                      Remove
                    </button>
                  </div>
                ))}
                {providerRulesList.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No provider overrides yet. All providers use the global rate.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
