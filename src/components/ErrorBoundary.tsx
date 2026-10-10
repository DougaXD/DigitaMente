import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro não tratado:', error, errorInfo);
  }

  private handleRestoreDefaultSettings = () => {
    try {
      // Apaga SOMENTE as chaves de configurações do localStorage
      // Preserva histórico, estatísticas, recordes, favoritos e textos salvos
      localStorage.removeItem('digitamente_settings_v1');
      localStorage.removeItem('digitamente_settings');
    } catch (err) {
      console.error('Erro ao limpar configurações:', err);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Algo deu errado
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ocorreu uma falha inesperada na interface. Você pode restaurar as configurações padrão para recuperar o aplicativo sem perder seus textos e histórico de digitação.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-mono text-rose-600 dark:text-rose-400 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleRestoreDefaultSettings}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurar configurações padrão
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
