import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Home, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';

interface SuccessState {
  message?: string;
  requestNumber?: string;
}

export default function SuccessPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || '';
  const state = (location.state as SuccessState) || {};
  const { toast } = useToast();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const typeLabels: Record<string, string> = {
    permit: t('success.permit'),
    survey: t('success.survey'),
    final: t('success.final'),
  };

  const handleCopy = async () => {
    if (!state.requestNumber) return;
    try {
      await navigator.clipboard.writeText(state.requestNumber);
      setCopied(true);
      toast({ title: t('common.copied'), description: t('success.copySuccess') });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: 'destructive', title: t('success.copyFail') });
    }
  };

  const waMessage = state.requestNumber
    ? `Halo Admin BAPPERIDA, saya telah mengirim permohonan izin penelitian dengan nomor ${state.requestNumber}. Mohon bantuannya. Terima kasih.`
    : '';

  return (
    <AppShell title={typeLabels[type] || 'Sukses'}>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10">
          <CheckCircle2 className="w-12 h-12 text-accent" />
        </div>
        <div className="space-y-2">
          <h1 className="heading-clamp font-bold text-foreground">{t('success.title')}</h1>
          <p className="subheading-clamp text-muted-foreground max-w-xs mx-auto">
            {state.message || t('success.defaultMsg')}
          </p>
          {typeLabels[type] && (
            <span className="inline-block text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1">
              {typeLabels[type]}
            </span>
          )}
        </div>

        {state.requestNumber && (
          <div className="w-full max-w-xs space-y-2">
            <p className="text-xs text-muted-foreground font-medium">{t('success.requestNumber')}</p>
            <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-3">
              <code className="flex-1 text-sm font-mono font-bold text-foreground tracking-wide break-all">
                {state.requestNumber}
              </code>
              <Button type="button" variant="ghost" size="sm" onClick={handleCopy} className="tap-target shrink-0" aria-label={t('common.copy')}>
                <Copy className="w-4 h-4" />
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full max-w-xs">
          {state.requestNumber && (
            <a
              href={`https://wa.me/6208772315328?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full tap-target gap-2">
                <MessageCircle className="w-4 h-4" /> {t('success.sendWA')}
              </Button>
            </a>
          )}
          <Link to="/">
            <Button variant="outline" className="w-full tap-target gap-2">
              <Home className="w-4 h-4" /> {t('common.home')}
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
