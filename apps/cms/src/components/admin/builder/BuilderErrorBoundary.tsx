'use client';

import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface BuilderErrorBoundaryProps {
  children: React.ReactNode;
  /** Mengatur ulang error ketika konteks berubah, misalnya seksi yang dipilih berganti. */
  resetKey?: string | number | null;
  title?: string;
  description?: string;
  onReset?: () => void;
  compact?: boolean;
}

interface BuilderErrorBoundaryState {
  error: Error | null;
}

/**
 * Menangkap error render di area builder agar satu field/seksi yang bermasalah
 * tidak menjatuhkan seluruh aplikasi admin.
 */
export class BuilderErrorBoundary extends React.Component<
  BuilderErrorBoundaryProps,
  BuilderErrorBoundaryState
> {
  state: BuilderErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BuilderErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Builder] Gagal merender komponen builder:', error, info);
  }

  componentDidUpdate(prevProps: BuilderErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  private handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;

    const { title, description, onReset, compact } = this.props;

    return (
      <div
        role="alert"
        className={
          compact
            ? 'p-3 rounded-lg border border-amber-300 bg-amber-50 text-slate-800'
            : 'flex h-full w-full items-center justify-center p-6 bg-slate-900 text-slate-100'
        }
      >
        <div
          className={
            compact
              ? 'space-y-2'
              : 'w-full max-w-md rounded-xl border border-amber-500/40 bg-slate-800 p-5 shadow-xl'
          }
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={compact ? 'mt-0.5 h-4 w-4 text-amber-600' : 'mt-0.5 h-5 w-5 text-amber-400'} />
            <div className="min-w-0">
              <h3 className={compact ? 'text-sm font-bold' : 'text-base font-bold text-white'}>
                {title || 'Bagian ini gagal dimuat'}
              </h3>
              <p className={compact ? 'mt-1 text-xs text-slate-700' : 'mt-1 text-xs leading-relaxed text-slate-300'}>
                {description ||
                  'Perubahan lain tetap aman. Coba muat ulang bagian ini. Jika tetap gagal, kembali ke daftar seksi atau hubungi admin teknis.'}
              </p>
            </div>
          </div>

          <div className={compact ? 'flex flex-wrap gap-2 pt-1' : 'mt-4 flex flex-wrap gap-2'}>
            <button
              type="button"
              onClick={this.handleReset}
              className={
                compact
                  ? 'inline-flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700'
                  : 'inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-500'
              }
            >
              <RotateCcw size={14} />
              Coba lagi
            </button>

            {onReset && (
              <button
                type="button"
                onClick={this.handleReset}
                className={
                  compact
                    ? 'inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50'
                    : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700'
                }
              >
                <ArrowLeft size={14} />
                Kembali
              </button>
            )}
          </div>

          <details className={compact ? 'pt-1 text-[11px] text-slate-500' : 'mt-3 text-[11px] text-slate-400'}>
            <summary className="cursor-pointer select-none">Detail teknis</summary>
            <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

export default BuilderErrorBoundary;
