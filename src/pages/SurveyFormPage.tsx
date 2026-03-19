import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '@/components/AppShell';
import { CardSection } from '@/components/CardSection';
import { FormFieldRenderer } from '@/components/FormFieldRenderer';
import { FormStepper } from '@/components/FormStepper';
import { StickySubmitBar } from '@/components/StickySubmitBar';
import { InfoAlert } from '@/components/InfoAlert';
import { useDraft } from '@/hooks/use-draft';
import { buildZodSchema } from '@/lib/schema-builder';
import { submitSurvey } from '@/lib/api';
import { surveySections } from '@/lib/form-definitions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';
import type { FormSection } from '@/types/form';

interface SurveyNavState {
  requestNumber?: string;
  email?: string;
  name?: string;
}

export default function SurveyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as SurveyNavState) || {};
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  // Build translated sections
  const sections: FormSection[] = useMemo(() => {
    const sectionKeys = ['survey.section.respondent', 'survey.section.rating', 'survey.section.suggestion'] as const;

    const fieldLabelMap: Record<string, string> = {
      email: 'survey.field.email',
      respondent_name: 'survey.field.respondent_name',
      age: 'survey.field.age',
      gender: 'survey.field.gender',
      education: 'survey.field.education',
      occupation: 'survey.field.occupation',
      suggestion: 'survey.field.suggestion',
    };

    const questionMap: Record<string, string> = {
      q1_requirement: 'survey.q1', q2_procedure: 'survey.q2', q3_speed: 'survey.q3',
      q4_cost: 'survey.q4', q5_product: 'survey.q5', q6_competence: 'survey.q6',
      q7_courtesy: 'survey.q7', q8_facility: 'survey.q8', q9_complaint: 'survey.q9',
    };

    const genderOptions = [
      { label: t('survey.field.gender.male'), value: 'Laki-laki' },
      { label: t('survey.field.gender.female'), value: 'Perempuan' },
    ];

    return surveySections.map((sec, i) => ({
      ...sec,
      title: t(sectionKeys[i] as any),
      fields: sec.fields.map((f) => {
        const translatedField = { ...f };

        if (fieldLabelMap[f.name]) {
          translatedField.label = t(fieldLabelMap[f.name] as any);
        }

        if (questionMap[f.name]) {
          const qKey = questionMap[f.name];
          translatedField.label = t(qKey as any);
          if (f.options) {
            translatedField.options = f.options.map((o) => ({
              ...o,
              label: t(`${qKey}.${o.value}` as any),
            }));
          }
        }

        if (f.name === 'gender') {
          translatedField.options = genderOptions;
        }

        if (f.name === 'suggestion') {
          translatedField.placeholder = t('survey.field.suggestion.placeholder');
        }

        return translatedField;
      }),
    }));
  }, [lang, t]);

  const zodSchema = useMemo(() => buildZodSchema({ sections: surveySections }), []);

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema),
    mode: 'onTouched',
    defaultValues: {
      email: navState.email || '',
      respondent_name: navState.name || '',
    },
  });

  const { clearDraft } = useDraft('survey', form);

  const currentSection = sections[step];
  const isLast = step === sections.length - 1;

  const validateStep = async () => {
    const names = surveySections[step].fields.map((f) => f.name);
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
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await submitSurvey(values, navState.requestNumber);
      if (res.success) {
        clearDraft();
        setSubmitStatus('success');
        navigate('/success?type=survey', { state: { message: res.message } });
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
    if (!isLast) {
      handleNext();
      return;
    }
    const valid = await form.trigger();
    if (valid) {
      form.handleSubmit(onSubmit)();
    } else {
      toast({ variant: 'destructive', title: t('error.checkForm'), description: t('error.formIncomplete') });
      for (let i = 0; i < sections.length; i++) {
        if (surveySections[i].fields.some((f) => form.formState.errors[f.name])) {
          setStep(i);
          break;
        }
      }
    }
  };

  return (
    <AppShell title={t('survey.appShellTitle')}>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pb-24">
          <InfoAlert>
            <p className="font-semibold">{t('survey.title')}</p>
            <p className="text-xs text-muted-foreground">{t('survey.version')}</p>
            <p className="text-muted-foreground mt-1">{t('survey.intro')}</p>
            {navState.requestNumber && (
              <p className="text-xs text-primary font-medium mt-1">
                Nomor Permohonan: {navState.requestNumber}
              </p>
            )}
          </InfoAlert>

          <FormStepper steps={sections.map((s) => s.title)} currentStep={step} />

          <CardSection title={currentSection.title} stepLabel={String(step + 1)}>
            {currentSection.fields.map((f) => (
              <FormFieldRenderer key={f.name} field={f} />
            ))}
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
      </FormProvider>
    </AppShell>
  );
}
