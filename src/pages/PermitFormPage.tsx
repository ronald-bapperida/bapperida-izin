import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '@/components/AppShell';
import { CardSection } from '@/components/CardSection';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { FormStepper } from '@/components/FormStepper';
import { StickySubmitBar } from '@/components/StickySubmitBar';
import { InfoAlert } from '@/components/InfoAlert';
import { ConfirmSubmitDialog } from '@/components/ConfirmSubmitDialog';
import { useDraft } from '@/hooks/use-draft';
import { buildZodSchema } from '@/lib/schema-builder';
import { submitPermit } from '@/lib/api';
import { permitSections } from '@/lib/form-definitions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';
import type { FormSection } from '@/types/form';

export default function PermitFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Translate sections
  const sections: FormSection[] = useMemo(() => {
    const sectionKeys = ['permit.section.account', 'permit.section.applicant', 'permit.section.research', 'permit.section.letter', 'permit.section.upload', 'permit.section.statement'] as const;
    const fieldKeyMap: Record<string, string> = {
      email_google: 'permit.field.email_google',
      full_name: 'permit.field.full_name',
      email_active: 'permit.field.email_active',
      nim_nik: 'permit.field.nim_nik',
      place_of_birth: 'permit.field.place_of_birth',
      work_unit: 'permit.field.work_unit',
      institution: 'permit.field.institution',
      phone_whatsapp: 'permit.field.phone_whatsapp',
      nationality: 'permit.field.nationality',
      research_location: 'permit.field.research_location',
      research_duration: 'permit.field.research_duration',
      research_title: 'permit.field.research_title',
      signer_position: 'permit.field.signer_position',
      letter_number: 'permit.field.letter_number',
      letter_date: 'permit.field.letter_date',
      identity_pdf: 'permit.field.identity_pdf',
      submission_letter_pdf: 'permit.field.submission_letter_pdf',
      proposal_pdf: 'permit.field.proposal_pdf',
      social_media_proof_pdf: 'permit.field.social_media_proof_pdf',
      agree_final_report: 'permit.field.agree_final_report',
    };

    return permitSections.map((sec, i) => ({
      ...sec,
      title: t(sectionKeys[i] as any),
      fields: sec.fields.map((f) => ({
        ...f,
        label: fieldKeyMap[f.name] ? t(fieldKeyMap[f.name] as any) : f.label,
      })),
    }));
  }, [lang, t]);

  const zodSchema = useMemo(() => buildZodSchema({ sections: permitSections }), []);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema),
    mode: 'onTouched',
    defaultValues: {},
  });

  const { clearDraft } = useDraft('permit', form);

  const currentSection = sections[step];
  const isLast = step === sections.length - 1;

  const validateStep = async () => {
    const names = permitSections[step].fields.map((f) => f.name);
    return form.trigger(names as any);
  };

  const handleNext = async () => {
    if (await validateStep()) {
      setStep((s) => Math.min(s + 1, sections.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setShowConfirm(false);
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await submitPermit(values);
      if (res.success) {
        clearDraft();
        setSubmitStatus('success');
        navigate('/success?type=permit', {
          state: {
            message: res.message,
            requestNumber: res.requestNumber,
            email: values.email_active as string,
            name: values.full_name as string,
          },
        });
      } else {
        setSubmitError(res.message || t('error.generic'));
        setSubmitStatus('error');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('error.submitFailed');
      setSubmitError(msg);
      setSubmitStatus('error');
      toast({ variant: 'destructive', title: 'Error', description: msg });
    }
  };

  const buildSummaryItems = () => {
    const values = form.getValues();
    const items: { label: string; value: string }[] = [];
    const fileFields = ['identity_pdf', 'submission_letter_pdf', 'proposal_pdf', 'social_media_proof_pdf'];
    const skipFields = ['agree_final_report'];

    for (const sec of sections) {
      for (const f of sec.fields) {
        if (skipFields.includes(f.name)) continue;
        const val = values[f.name];
        if (!val) continue;
        if (fileFields.includes(f.name)) {
          items.push({ label: f.label, value: val instanceof File ? val.name : '✓' });
        } else {
          items.push({ label: f.label, value: String(val) });
        }
      }
    }
    return items;
  };

  const handleSubmitClick = async () => {
    if (!isLast) {
      handleNext();
      return;
    }
    const valid = await form.trigger();
    if (valid) {
      setShowConfirm(true);
    } else {
      toast({ variant: 'destructive', title: t('error.checkForm'), description: t('error.formIncomplete') });
      for (let i = 0; i < sections.length; i++) {
        if (permitSections[i].fields.some((f) => form.formState.errors[f.name])) {
          setStep(i);
          break;
        }
      }
    }
  };

  return (
    <AppShell title={t('permit.appShellTitle')}>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pb-24">
          <InfoAlert>
            <p className="font-semibold">{t('permit.title')}</p>
            <p className="text-muted-foreground">{t('permit.desc')}</p>
            <ul className="text-muted-foreground text-xs mt-2">
              <li>{t('permit.note1')}</li>
              <li>{t('permit.note2')}</li>
              <li>{t('permit.note3')}</li>
              <li>{t('permit.note4')}</li>
              <li>{t('permit.note5')}</li>
              <li dangerouslySetInnerHTML={{ __html: t('permit.note6') }} />
            </ul>
            <div className="mt-2">
              <a
                href="https://wa.me/6208772315328"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {t('permit.chatWA')}
              </a>
            </div>
          </InfoAlert>

          <FormStepper steps={sections.map((s) => s.title)} currentStep={step} />

          <CardSection title={currentSection.title} stepLabel={String(step + 1)}>
            {currentSection.fields.map((f) => (
              <FormFieldRenderer key={f.name} field={f} />
            ))}
            {step === sections.length - 1 && (
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-xs text-foreground">
                <strong>{t('error.info')}</strong> {t('permit.stampInfo')}
              </div>
            )}
          </CardSection>

          <div className="flex gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={handlePrev} className="tap-target flex-1 gap-1">
                <ChevronLeft className="w-4 h-4" /> {t('common.prev')}
              </Button>
            )}
            {!isLast && (
              <Button type="button" onClick={handleNext} className="tap-target flex-1 gap-1">
                {t('common.next')} <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>

        {isLast && (
          <StickySubmitBar status={submitStatus} onSubmit={handleSubmitClick} errorMessage={submitError} />
        )}

        <ConfirmSubmitDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          onConfirm={() => form.handleSubmit(onSubmit)()}
          summaryItems={buildSummaryItems()}
        />
      </FormProvider>
    </AppShell>
  );
}
