import { FileText, ArrowLeft, Globe } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, toggleLang, t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-card border-b safe-top">
        <div className="mx-auto max-w-lg flex items-center gap-2 px-4 py-3">
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="tap-target flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          {isHome && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
          <span className="font-bold text-foreground text-sm tracking-tight truncate flex-1">
            {title || t('app.title')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="shrink-0 gap-1 text-xs h-8 px-2"
            aria-label="Switch language"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'id' ? 'EN' : 'ID'}
          </Button>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-4 pb-8">
        {children}
      </main>
    </div>
  );
}
