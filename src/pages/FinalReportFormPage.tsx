import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '@/components/AppShell';
import { CardSection } from '@/components/CardSection';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { StickySubmitBar } from '@/components/StickySubmitBar';
import { InfoAlert } from '@/components/InfoAlert';
import { useDraft } from '@/hooks/use-draft';
import { buildZodSchema } from '@/lib/schema-builder';
import { submitFinalReport, checkPermitStatus } from '@/lib/api';
import { finalReportSections } from '@/lib/form-definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import type { FormSection } from '@/types/form';

interface FinalNavState {
  requestNumber?: string;
  email?: string;
  name?: string;
  researchTitle?: string;
}

export default function FinalReportFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as FinalNavState) || {};
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  // ── Request number gate (only shown when arriving from the homepage directly) ──
  const [requestNumberInput, setRequestNumberInput] = useState('');
  const [requestNumberError, setRequestNumberError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [confirmedRequestNumber, setConfirmedRequestNumber] = useState<string | null>(
    navState.requestNumber || null,
  );

  const handleConfirmRequestNumber = async () => {
    const trimmed = requestNumberInput.trim().toUpperCase();
    const pattern = /^[A-Z0-9]{8}$/;
    if (!pattern.test(trimmed)) {
      setRequestNumberError('Format tidak valid. Masukkan 8 karakter kombinasi huruf (A–Z) dan angka (0–9).');
      return;
    }
    setRequestNumberError('');
    setGateLoading(true);
    try {
      const permit = await checkPermitStatus(trimmed);
      const permitStatus = permit?.status?.toLowerCase();
      
      // 🔥 Perbaikan: Izinkan status 'approved' ATAU 'generated_letter' ATAU 'sent'
      const allowedStatuses = ['approved', 'generated_letter', 'sent'];
      const isAllowed = allowedStatuses.includes(permitStatus);
      
      if (!isAllowed) {
        const statusMessages: Record<string, string> = {
          submitted: 'Permohonan Anda masih dalam status Terkirim. Laporan akhir hanya dapat dikirim setelah surat izin diterbitkan dan dikirim.',
          in_review: 'Permohonan Anda sedang dalam proses review. Laporan akhir hanya dapat dikirim setelah surat izin diterbitkan dan dikirim.',
          revision_requested: 'Permohonan Anda memerlukan revisi. Laporan akhir hanya dapat dikirim setelah surat izin diterbitkan dan dikirim.',
          rejected: 'Permohonan Anda ditolak. Laporan akhir tidak dapat dikirim.',
        };
        const msg = statusMessages[permitStatus] || 'Status permohonan Anda belum memenuhi syarat untuk mengirim laporan akhir. Pastikan surat izin sudah diterbitkan dan dikirim.';
        setRequestNumberError(msg);
        return;
      }
      
      // Status approved/generated_letter/sent -> lanjut ke form
      setConfirmedRequestNumber(trimmed);
      
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? 'Nomor permohonan tidak ditemukan. Periksa kembali nomor yang Anda masukkan.'
        : err?.response?.data?.error || err?.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setRequestNumberError(msg);
    } finally {
      setGateLoading(false);
    }
  };

  // ── Translated sections ──────────────────────────────────────────────────────
  const sections: FormSection[] = useMemo(() => {
    const sectionKeys = ['final.section.reporter', 'final.section.upload'] as const;
    const fieldMap: Record<string, string> = {
      email: 'final.field.email',
      name: 'final.field.name',
      research_title: 'final.field.research_title',
      final_report_pdf: 'final.field.final_report_pdf',
      suggestion: 'final.field.suggestion',
    };
    return finalReportSections.map((sec, i) => ({
      ...sec,
      title: t(sectionKeys[i] as any),
      fields: sec.fields.map((f) => ({
        ...f,
        label: fieldMap[f.name] ? t(fieldMap[f.name] as any) : f.label,
      })),
    }));
  }, [lang, t]);

  const zodSchema = useMemo(() => buildZodSchema({ sections: finalReportSections }), []);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema),
    mode: 'onTouched',
    defaultValues: {
      email: navState.email || '',
      name: navState.name || '',
      research_title: navState.researchTitle || '',
    },
  });

  const { clearDraft } = useDraft('final', form);

  const onSubmit = async (values: Record<string, unknown>) => {
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await submitFinalReport(values, confirmedRequestNumber || undefined);
      if (res.success) {
        clearDraft();
        setSubmitStatus('success');
        navigate('/success?type=final', { state: { message: res.message } });
      } else {
        setSubmitError(res.message || t('error.generic'));
        setSubmitStatus('error');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || t('error.submitFailed');
      setSubmitError(msg);
      setSubmitStatus('error');
      toast({ variant: 'destructive', title: 'Error', description: msg });
    }
  };

  const handleSubmitClick = async () => {
    const valid = await form.trigger();
    if (valid) {
      form.handleSubmit(onSubmit)();
    } else {
      toast({ variant: 'destructive', title: t('error.checkForm'), description: t('error.formIncomplete') });
    }
  };

  // ── Gate: ask for request number first ──────────────────────────────────────
  if (!confirmedRequestNumber) {
    return (
      <AppShell title={t('final.appShellTitle')}>
        <div className="space-y-5 animate-fade-in">
          <div className="text-center space-y-1 pt-2">
            <h1 className="text-lg font-bold text-foreground">Laporan Akhir Penelitian</h1>
            <p className="text-sm text-muted-foreground">
              Masukkan nomor permohonan izin penelitian Anda untuk melanjutkan.
            </p>
          </div>

          <InfoAlert>
            <p className="font-semibold">Nomor Permohonan Diperlukan</p>
            <p className="text-muted-foreground text-sm mt-1">
              Laporan akhir hanya dapat dikirim jika surat izin penelitian Anda sudah <strong>diterbitkan dan dikirim</strong>.
              Nomor permohonan ada di email/WhatsApp yang Anda terima.
            </p>
          </InfoAlert>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Nomor Permohonan <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="AB12CD34"
                value={requestNumberInput}
                onChange={(e) => {
                  setRequestNumberInput(e.target.value.toUpperCase());
                  setRequestNumberError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmRequestNumber()}
                maxLength={8}
                className="tap-target font-mono text-sm tracking-widest"
              />
              <p className="text-xs text-muted-foreground">8 karakter kombinasi huruf dan angka (contoh: AB12CD34)</p>
              {requestNumberError && (
                <p className="flex items-center gap-1 text-destructive text-xs" role="alert">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {requestNumberError}
                </p>
              )}
            </div>

            <Button
              onClick={handleConfirmRequestNumber}
              disabled={!requestNumberInput.trim() || gateLoading}
              className="w-full tap-target gap-2 font-semibold"
              size="lg"
            >
              {gateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {gateLoading ? 'Memeriksa...' : 'Lanjutkan'}
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────────
  return (
    <AppShell title={t('final.appShellTitle')}>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pb-24">
          <InfoAlert>
            <p className="font-semibold">{t('final.title')}</p>
            <p className="text-muted-foreground mt-1">{t('final.desc')}</p>
            <p className="text-xs text-primary font-medium mt-1">
              Nomor Permohonan: {confirmedRequestNumber}
            </p>
          </InfoAlert>

          {sections.map((section, i) => (
            <CardSection key={i} title={section.title} stepLabel={String(i + 1)}>
              {section.fields.map((field) => (
                <div key={field.name}>
                  <FormFieldRenderer field={field} />
                  {field.name === 'final_report_pdf' && (
                    <p
                      className="text-xs text-muted-foreground mt-1"
                      dangerouslySetInnerHTML={{ __html: t('final.field.fileHelper') }}
                    />
                  )}
                </div>
              ))}
            </CardSection>
          ))}
        </form>

        <StickySubmitBar status={submitStatus} onSubmit={handleSubmitClick} errorMessage={submitError} />
      </FormProvider>
    </AppShell>
  );
}
