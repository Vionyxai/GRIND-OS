import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Trash2, Info, Cloud, LogIn, LogOut, Plug, Plus, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { exportAllData, importAllData } from '../utils/storage';
import type { SyncStatus, CloudConflict } from '../hooks/useCloudSync';
import { Routine } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthState {
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface CloudSyncState {
  status: SyncStatus;
  error: string | null;
  conflict: CloudConflict | null;
  lastSyncedAt: string | null;
  syncNow: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
  resolveConflict: (choice: 'local' | 'cloud') => void;
}

interface SettingsProps {
  onDataReset: () => void;
  onDataImport: () => void;
  auth: AuthState;
  cloudSync: CloudSyncState;
  routines: Routine[];
}

interface ConnectorRow {
  app_id: string;
  display_name: string;
  pillar_id: string;
  linked_routine_ids: string[];
  enabled: boolean;
}

const PILLAR_OPTIONS = [
  { id: 'health', label: 'Health & Body' },
  { id: 'money', label: 'Money & Business' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'mental', label: 'Mental / Spiritual' },
  { id: 'skills', label: 'Skills & Learning' },
  { id: 'leisure', label: 'Leisure & Play' },
];

const cardStyle: React.CSSProperties = { backgroundColor: '#13131A', border: '1px solid #1E1E2E' };
const rowLabelStyle: React.CSSProperties = { fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#F8F9FA' };
const rowSubStyle: React.CSSProperties = { fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginTop: '1px' };
const sectionLabelStyle: React.CSSProperties = { fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' };
const inputStyle: React.CSSProperties = { width: '100%', backgroundColor: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '10px', fontSize: '14px', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', outline: 'none' };

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '44px', height: '26px', borderRadius: '13px',
        backgroundColor: on ? '#06D6A0' : '#1E1E2E',
        border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0,
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%',
        backgroundColor: '#F8F9FA', position: 'absolute', top: '3px',
        left: on ? '21px' : '3px', transition: 'left 0.2s',
      }} />
    </button>
  );
}

function ConnectedAppsPanel({ session, routines }: { session: Session; routines: Routine[] }) {
  const [connectors, setConnectors] = useState<ConnectorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState({ app_id: '', display_name: '', pillar_id: 'skills' });
  const [addError, setAddError] = useState('');

  const fetchConnectors = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('connector_registry')
      .select('app_id, display_name, pillar_id, linked_routine_ids, enabled')
      .eq('user_id', session.user.id)
      .order('registered_at', { ascending: true });
    setConnectors((data as ConnectorRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchConnectors(); }, [session.user.id]);

  const toggleEnabled = async (appId: string, enabled: boolean) => {
    if (!supabase) return;
    setConnectors((prev) => prev.map((c) => c.app_id === appId ? { ...c, enabled } : c));
    await supabase.from('connector_registry').update({ enabled }).eq('app_id', appId).eq('user_id', session.user.id);
  };

  const updateLinkedRoutine = async (appId: string, routineId: string) => {
    if (!supabase) return;
    const ids = routineId ? [routineId] : [];
    setConnectors((prev) => prev.map((c) => c.app_id === appId ? { ...c, linked_routine_ids: ids } : c));
    await supabase.from('connector_registry').update({ linked_routine_ids: ids }).eq('app_id', appId).eq('user_id', session.user.id);
  };

  const removeConnector = async (appId: string) => {
    if (!supabase) return;
    setConnectors((prev) => prev.filter((c) => c.app_id !== appId));
    await supabase.from('connector_registry').delete().eq('app_id', appId).eq('user_id', session.user.id);
  };

  const addConnector = async () => {
    if (!supabase) return;
    if (!newApp.app_id.trim() || !newApp.display_name.trim()) {
      setAddError('App ID and display name are required.');
      return;
    }
    const { error } = await supabase.from('connector_registry').upsert({
      app_id: newApp.app_id.trim().toLowerCase(),
      user_id: session.user.id,
      display_name: newApp.display_name.trim(),
      pillar_id: newApp.pillar_id,
      linked_routine_ids: [],
      enabled: true,
    }, { onConflict: 'app_id,user_id' });
    if (error) { setAddError(error.message); return; }
    setNewApp({ app_id: '', display_name: '', pillar_id: 'skills' });
    setAddError('');
    setShowAddForm(false);
    fetchConnectors();
  };

  if (loading) {
    return <p style={rowSubStyle}>Loading connected apps…</p>;
  }

  const pillarLabel = (id: string) => PILLAR_OPTIONS.find((p) => p.id === id)?.label ?? id;
  const pillarRoutines = (pillarId: string) => routines.filter((r) => r.pillarId === pillarId && r.isActive);

  return (
    <div className="space-y-3">
      {connectors.length === 0 && !showAddForm && (
        <p style={rowSubStyle}>
          No apps connected yet. When another app calls <code style={{ color: '#4CC9F0', fontSize: '11px' }}>registerApp()</code> with your account, it will appear here.
        </p>
      )}

      {connectors.map((connector) => {
        const options = pillarRoutines(connector.pillar_id);
        const linkedId = connector.linked_routine_ids[0] ?? '';
        return (
          <div
            key={connector.app_id}
            className="rounded-lg p-3"
            style={{ backgroundColor: '#0A0A0F', border: '1px solid #1E1E2E' }}
          >
            <div className="flex items-center justify-between gap-2">
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F8F9FA' }}>
                  {connector.display_name}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D' }}>
                  {connector.app_id} · {pillarLabel(connector.pillar_id)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle on={connector.enabled} onChange={(v) => toggleEnabled(connector.app_id, v)} />
                <button
                  onClick={() => removeConnector(connector.app_id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6C757D' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {connector.enabled && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6C757D', marginBottom: '6px' }}>
                  Auto-complete which routine?
                </p>
                {options.length === 0 ? (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#E63946' }}>
                    No active routines in {pillarLabel(connector.pillar_id)}. Add one first.
                  </p>
                ) : (
                  <select
                    value={linkedId}
                    onChange={(e) => updateLinkedRoutine(connector.app_id, e.target.value)}
                    style={{ ...inputStyle, fontSize: '13px', padding: '8px' }}
                  >
                    <option value="">— none —</option>
                    {options.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showAddForm ? (
        <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: '#0A0A0F', border: '1px solid #4CC9F0' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F8F9FA' }}>
            Register app manually
          </p>
          <p style={{ ...rowSubStyle, marginTop: 0 }}>
            Apps that use the Connector SDK register automatically. Use this only if you need to pre-register.
          </p>
          <input
            placeholder="App ID (e.g. learningai)"
            value={newApp.app_id}
            onChange={(e) => setNewApp((p) => ({ ...p, app_id: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="Display name (e.g. LearningAI)"
            value={newApp.display_name}
            onChange={(e) => setNewApp((p) => ({ ...p, display_name: e.target.value }))}
            style={inputStyle}
          />
          <select
            value={newApp.pillar_id}
            onChange={(e) => setNewApp((p) => ({ ...p, pillar_id: e.target.value }))}
            style={inputStyle}
          >
            {PILLAR_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          {addError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#E63946' }}>{addError}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAddForm(false); setAddError(''); }}
              style={{ flex: 1, borderRadius: '8px', padding: '10px', backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '13px', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={addConnector}
              style={{ flex: 1, borderRadius: '8px', padding: '10px', backgroundColor: '#4CC9F0', color: '#0A0A0F', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Register
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ backgroundColor: '#1E1E2E', border: 'none', color: '#6C757D', fontFamily: 'Inter, sans-serif', fontSize: '13px', cursor: 'pointer' }}
        >
          <Plus size={14} /> Add app manually
        </button>
      )}
    </div>
  );
}

export function Settings({
  onDataReset,
  onDataImport,
  auth,
  cloudSync,
  routines,
}: SettingsProps) {
  const [resetStep, setResetStep] = useState<'idle' | 'confirm' | 'type'>('idle');
  const [resetInput, setResetInput] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignIn = async () => {
    if (!email) return;
    try {
      await auth.signInWithEmail(email);
      setEmailSent(true);
      setAuthError('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to send link');
    }
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grindos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = evt.target?.result as string;
        importAllData(json);
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => {
          setImportSuccess(false);
          onDataImport();
        }, 1500);
      } catch {
        setImportError('Invalid file. Make sure it is a GRIND OS backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (resetStep === 'idle') {
      setResetStep('confirm');
    } else if (resetStep === 'confirm') {
      setResetStep('type');
      setResetInput('');
    } else if (resetStep === 'type' && resetInput === 'RESET') {
      onDataReset();
    }
  };

  const cancelReset = () => {
    setResetStep('idle');
    setResetInput('');
  };

  return (
    <div className="px-4 py-4 space-y-5 overflow-x-hidden">
      {/* Header */}
      <p
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '28px',
          color: '#F8F9FA',
          letterSpacing: '0.06em',
        }}
      >
        SETTINGS
      </p>

      {/* Account */}
      {auth.configured && (
        <div className="rounded-xl overflow-hidden p-4" style={cardStyle}>
          <div className="flex items-center gap-3 mb-3">
            <LogIn size={16} color="#6C757D" />
            <p style={sectionLabelStyle}>ACCOUNT</p>
          </div>
          {auth.session ? (
            <div className="flex items-center justify-between gap-3">
              <p style={rowLabelStyle}>{auth.session.user.email}</p>
              <button
                onClick={() => auth.signOut()}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ backgroundColor: '#1E1E2E', border: 'none', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '13px', minHeight: '36px', cursor: 'pointer' }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : emailSent ? (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#06D6A0' }}>
              Check {email} for a magic link.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p style={rowSubStyle}>Sign in to sync across devices and connect other apps.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{ flex: 1, backgroundColor: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '10px', fontSize: '14px', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                />
                <button
                  onClick={handleSignIn}
                  disabled={!email}
                  style={{ borderRadius: '8px', padding: '10px 14px', backgroundColor: '#4CC9F0', color: '#0A0A0F', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: email ? 'pointer' : 'default', opacity: email ? 1 : 0.6 }}
                >
                  Send link
                </button>
              </div>
              {authError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#E63946' }}>{authError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Cloud Sync */}
      {auth.configured && auth.session && (
        <div className="rounded-xl overflow-hidden p-4" style={cardStyle}>
          <div className="flex items-center gap-3 mb-3">
            <Cloud size={16} color="#6C757D" />
            <p style={sectionLabelStyle}>CLOUD SYNC</p>
          </div>

          {cloudSync.conflict ? (
            <div>
              <p style={rowSubStyle}>
                Found data on this device and in the cloud. Which one should win?
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => cloudSync.resolveConflict('local')}
                  className="flex-1 rounded-lg py-2"
                  style={{ backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '13px', border: 'none', minHeight: '40px', cursor: 'pointer' }}
                >
                  Keep this device
                </button>
                <button
                  onClick={() => cloudSync.resolveConflict('cloud')}
                  className="flex-1 rounded-lg py-2"
                  style={{ backgroundColor: '#4CC9F020', color: '#4CC9F0', border: '1px solid #4CC9F0', fontFamily: 'Inter, sans-serif', fontSize: '13px', minHeight: '40px', cursor: 'pointer' }}
                >
                  Use cloud data
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p style={rowLabelStyle}>
                  {cloudSync.status === 'syncing' ? 'Syncing…' : cloudSync.status === 'error' ? 'Sync error' : 'Synced'}
                </p>
                <p style={rowSubStyle}>
                  {cloudSync.status === 'error' ? cloudSync.error : cloudSync.lastSyncedAt ? `Last synced ${new Date(cloudSync.lastSyncedAt).toLocaleTimeString()}` : 'Waiting for first sync'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => cloudSync.syncNow()}
                  style={{ borderRadius: '8px', padding: '8px 12px', backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '12px', border: 'none', minHeight: '36px', cursor: 'pointer' }}
                >
                  Push
                </button>
                <button
                  onClick={() => cloudSync.pullFromCloud()}
                  style={{ borderRadius: '8px', padding: '8px 12px', backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '12px', border: 'none', minHeight: '36px', cursor: 'pointer' }}
                >
                  Pull
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connected Apps */}
      {auth.configured && auth.session && (
        <div className="rounded-xl overflow-hidden p-4" style={cardStyle}>
          <div className="flex items-center gap-3 mb-3">
            <Plug size={16} color="#6C757D" />
            <p style={sectionLabelStyle}>CONNECTED APPS</p>
          </div>
          <ConnectedAppsPanel session={auth.session} routines={routines} />
        </div>
      )}

      {/* Export */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-4 px-4 py-4"
          style={{
            WebkitTapHighlightColor: 'transparent',
            minHeight: '60px',
          }}
        >
          <div
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#4CC9F020', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Download size={18} color="#4CC9F0" />
          </div>
          <div className="text-left">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#F8F9FA' }}>
              Export Data
            </p>
            <p style={rowSubStyle}>Download backup JSON file</p>
          </div>
        </button>
      </div>

      {/* Import */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-4 px-4 py-4"
          style={{
            WebkitTapHighlightColor: 'transparent',
            minHeight: '60px',
          }}
        >
          <div
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#06D6A020', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Upload size={18} color="#06D6A0" />
          </div>
          <div className="text-left">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#F8F9FA' }}>
              Import Data
            </p>
            <p style={rowSubStyle}>Restore from backup JSON</p>
          </div>
        </button>
        {importError && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#E63946', padding: '0 16px 12px' }}>
            {importError}
          </p>
        )}
        {importSuccess && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#06D6A0', padding: '0 16px 12px' }}>
            Data imported successfully. Reloading...
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      {/* Reset */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#13131A', border: `1px solid ${resetStep !== 'idle' ? '#E63946' : '#1E1E2E'}` }}
      >
        {resetStep === 'idle' && (
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-4 px-4 py-4"
            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '60px' }}
          >
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                backgroundColor: '#E6394620', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Trash2 size={18} color="#E63946" />
            </div>
            <div className="text-left">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#E63946' }}>
                Reset All Data
              </p>
              <p style={rowSubStyle}>Wipes everything — cannot undo</p>
            </div>
          </button>
        )}

        {resetStep === 'confirm' && (
          <div className="p-4">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#F8F9FA', fontWeight: 600, marginBottom: '4px' }}>
              Are you sure?
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', marginBottom: '12px' }}>
              This will delete all routines, logs, XP, and badges. Export first if you want a backup.
            </p>
            <div className="flex gap-2">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, minHeight: '44px', border: 'none' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: '#E6394620', color: '#E63946', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, minHeight: '44px', border: '1px solid #E63946' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {resetStep === 'type' && (
          <div className="p-4">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', marginBottom: '8px' }}>
              Type <strong style={{ color: '#E63946' }}>RESET</strong> to confirm
            </p>
            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="RESET"
              autoFocus
              style={{
                width: '100%', backgroundColor: '#0A0A0F', border: '1px solid #E63946',
                borderRadius: '8px', padding: '12px', fontSize: '16px', color: '#E63946',
                fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.1em', outline: 'none', marginBottom: '12px',
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: '#1E1E2E', color: '#F8F9FA', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, minHeight: '44px', border: 'none' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetInput !== 'RESET'}
                style={{
                  flex: 1, borderRadius: '8px', padding: '12px',
                  backgroundColor: resetInput === 'RESET' ? '#E63946' : '#1E1E2E',
                  color: resetInput === 'RESET' ? '#0A0A0F' : '#6C757D',
                  fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, minHeight: '44px', border: 'none',
                  cursor: resetInput === 'RESET' ? 'pointer' : 'default',
                } as React.CSSProperties}
              >
                WIPE IT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Info size={16} color="#6C757D" />
          <p style={sectionLabelStyle}>ABOUT</p>
        </div>
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '22px', color: '#E63946', letterSpacing: '0.1em',
          }}
        >
          GRIND OS
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', marginTop: '4px' }}>
          Built for one person. No excuses.
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#1E1E2E', marginTop: '8px' }}>
          v0.1.0
        </p>
      </div>
    </div>
  );
}
