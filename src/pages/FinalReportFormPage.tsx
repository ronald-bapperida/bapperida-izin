import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '@/components/AppShell';
import { CardSection } from '@/components/CardSection';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { StickySubmitBar } from '@/components/StickySubmitBar';
import { InfoAlert } from '@/components/InfoAlert';
import { useDraft } from '@/hooks/use-draft';
import { buildZodSchema } from '@/lib/schema-builder';
import { submitFinalReport } from '@/lib/api';
import { finalReportSections } from '@/lib/form-definitions';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';
import type { FormSection } from '@/types/form';

export default function FinalReportFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

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
    defaultValues: {},
  });

  const { clearDraft } = useDraft('final', form);

  const onSubmit = async (values: Record<string, unknown>) => {
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await submitFinalReport(values);
      if (res.success) {
        clearDraft();
        setSubmitStatus('success');
        navigate('/success?type=final', { state: { message: res.message } });
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

  const handleSubmitClick = async () => {
    const valid = await form.trigger();
    if (valid) {
      form.handleSubmit(onSubmit)();
    } else {
      toast({ variant: 'destructive', title: t('error.checkForm'), description: t('error.formIncomplete') });
    }
  };

  return (
    <AppShell title={t('final.appShellTitle')}>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pb-24">
          <InfoAlert>
            <p className="font-semibold">{t('final.title')}</p>
            <p className="text-muted-foreground mt-1">{t('final.desc')}</p>
            {lang === 'id' && (
              <p className="text-xs text-muted-foreground italic mt-1">{t('final.descEn')}</p>
            )}
          </InfoAlert>

          {sections.map((section, i) => (
            <CardSection key={i} title={section.title} stepLabel={String(i + 1)}>
              {section.fields.map((field) => (
                <div key={field.name}>
                  <FormFieldRenderer field={field} />
                  {field.name === 'final_report_pdf' && (
                    <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: t('final.field.fileHelper') }} />
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
