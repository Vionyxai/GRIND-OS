import { useState, useRef } from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { exportAllData, importAllData } from '../utils/storage';

interface SettingsProps {
  onDataReset: () => void;
  onDataImport: () => void;
}

export function Settings({ onDataReset, onDataImport }: SettingsProps) {
  const [resetStep, setResetStep] = useState<'idle' | 'confirm' | 'type'>('idle');
  const [resetInput, setResetInput] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#4CC9F020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Download size={18} color="#4CC9F0" />
          </div>
          <div className="text-left">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#F8F9FA' }}>
              Export Data
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginTop: '1px' }}>
              Download backup JSON file
            </p>
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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#06D6A020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Upload size={18} color="#06D6A0" />
          </div>
          <div className="text-left">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#F8F9FA' }}>
              Import Data
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginTop: '1px' }}>
              Restore from backup JSON
            </p>
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
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#E6394620',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Trash2 size={18} color="#E63946" />
            </div>
            <div className="text-left">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, color: '#E63946' }}>
                Reset All Data
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D', marginTop: '1px' }}>
                Wipes everything — cannot undo
              </p>
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
                style={{
                  backgroundColor: '#1E1E2E',
                  color: '#F8F9FA',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  minHeight: '44px',
                  border: 'none',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-lg py-3"
                style={{
                  backgroundColor: '#E6394620',
                  color: '#E63946',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  minHeight: '44px',
                  border: '1px solid #E63946',
                }}
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
                width: '100%',
                backgroundColor: '#0A0A0F',
                border: '1px solid #E63946',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px',
                color: '#E63946',
                fontFamily: '"Bebas Neue", sans-serif',
                letterSpacing: '0.1em',
                outline: 'none',
                marginBottom: '12px',
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg py-3"
                style={{
                  backgroundColor: '#1E1E2E',
                  color: '#F8F9FA',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  minHeight: '44px',
                  border: 'none',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetInput !== 'RESET'}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: resetInput === 'RESET' ? '#E63946' : '#1E1E2E',
                  color: resetInput === 'RESET' ? '#0A0A0F' : '#6C757D',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  minHeight: '44px',
                  border: 'none',
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
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ABOUT
          </p>
        </div>
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '22px',
            color: '#E63946',
            letterSpacing: '0.1em',
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
