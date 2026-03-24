import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Home, MessageCircle, FileText, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SuccessState {
  message?: string;
  requestNumber?: string;
  email?: string;
  name?: string;
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for non-secure contexts (e.g. iframe)
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch {
      reject(new Error('Copy failed'));
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || '';
  const state = (location.state as SuccessState) || {};
  const { toast } = useToast();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(type === 'permit' && !!state.requestNumber);

  const typeLabels: Record<string, string> = {
    permit: t('success.permit'),
    survey: t('success.survey'),
    final: t('success.final'),
  };

  const handleCopy = async () => {
    if (!state.requestNumber) return;
    try {
      await copyToClipboard(state.requestNumber);
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

  const handleGoToSurvey = () => {
    setShowModal(false);
    navigate('/survei-kepuasan', {
      state: { requestNumber: state.requestNumber, email: state.email, name: state.name },
    });
  };

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

        {type !== 'permit' && (
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Link to="/">
              <Button variant="outline" className="w-full tap-target gap-2">
                <Home className="w-4 h-4" /> {t('common.home')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Modal: save request number + go to survey */}
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="max-w-sm mx-auto rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Nomor Permohonan Anda
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Simpan nomor ini untuk melacak status permohonan Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Nomor Permohonan:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono font-bold text-foreground tracking-wide break-all bg-white dark:bg-gray-800 p-2 rounded border">
                  {state.requestNumber}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="tap-target shrink-0"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-medium">
                Setelah menyimpan nomor permohonan, Anda <strong>wajib mengisi Survei Kepuasan</strong> sebagai langkah selanjutnya.
              </p>
            </div>

            {state.requestNumber && (
              <a
                href={`https://wa.me/6208772315328?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full tap-target gap-2">
                  <MessageCircle className="w-4 h-4" /> {t('success.sendWA')}
                </Button>
              </a>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Link to="/" className="flex-1" onClick={() => setShowModal(false)}>
              <Button variant="outline" className="w-full tap-target">
                {t('common.home')}
              </Button>
            </Link>
            <Button className="flex-1 tap-target gap-1" onClick={handleGoToSurvey}>
              <ClipboardList className="w-4 h-4" />
              Isi Survei
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
