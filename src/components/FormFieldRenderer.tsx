import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUp, Camera, X, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormField } from '@/types/form';
import { useI18n } from '@/lib/i18n';

interface Props {
  field: FormField;
}

const ACCEPT_LABEL: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG/JPEG',
  'image/png': 'PNG',
};

function getAcceptLabel(accept: string[]): string {
  return accept.map((m) => ACCEPT_LABEL[m] || m).join(', ');
}

function acceptsImages(accept: string[]): boolean {
  return accept.some((m) => m.startsWith('image/'));
}

export function FormFieldRenderer({ field }: Props) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useI18n();
  const error = errors[field.name];
  const errorMsg = error?.message as string | undefined;

  const baseLabel = (
    <Label htmlFor={field.name} className="text-sm font-medium text-foreground flex items-center gap-1">
      {field.label}
      {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  const errorEl = errorMsg && (
    <p className="flex items-center gap-1 text-destructive text-xs mt-1" role="alert">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {errorMsg}
    </p>
  );

  if (field.type === 'file') {
    return <FileField field={field} label={baseLabel} error={errorEl} />;
  }

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-start gap-3">
        <Checkbox
          id={field.name}
          checked={watch(field.name) === true}
          onCheckedChange={(v) => setValue(field.name, v === true, { shouldValidate: true })}
          className="mt-0.5"
        />
        <div>
          {baseLabel}
          {errorEl}
        </div>
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="space-y-1.5">
        {baseLabel}
        <Select
          value={watch(field.name) || ''}
          onValueChange={(v) => setValue(field.name, v, { shouldValidate: true })}
        >
          <SelectTrigger id={field.name} className="tap-target">
            <SelectValue placeholder={field.placeholder || t('common.select')} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorEl}
      </div>
    );
  }

  if (field.type === 'radio' && field.options) {
    return (
      <div className="space-y-1.5">
        {baseLabel}
        <RadioGroup
          value={watch(field.name) || ''}
          onValueChange={(v) => setValue(field.name, v, { shouldValidate: true })}
          className="space-y-2"
        >
          {field.options.map((o) => (
            <div key={o.value} className="flex items-center gap-2">
              <RadioGroupItem value={o.value} id={`${field.name}_${o.value}`} />
              <Label htmlFor={`${field.name}_${o.value}`} className="text-sm">{o.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errorEl}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1.5">
        {baseLabel}
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          className="min-h-[100px]"
          {...register(field.name)}
        />
        {errorEl}
      </div>
    );
  }

  const inputType = field.type === 'phone' ? 'tel' : field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text';

  return (
    <div className="space-y-1.5">
      {baseLabel}
      <Input
        id={field.name}
        type={inputType}
        placeholder={field.placeholder}
        className="tap-target"
        {...register(field.name, {
          onChange: field.uppercase && field.type !== 'email'
            ? (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.toUpperCase();
              }
            : undefined,
        })}
      />
      {errorEl}
    </div>
  );
}

function FileField({ field, label, error }: { field: FormField; label: React.ReactNode; error: React.ReactNode }) {
  const { setValue, watch } = useFormContext();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const file = watch(field.name) as File | undefined;
  const [dragActive, setDragActive] = useState(false);

  const accept = field.accept || [];
  const acceptStr = accept.join(',');
  const imageAcceptStr = accept.filter((m) => m.startsWith('image/')).join(',') || 'image/*';
  const showCamera = field.allowCamera && acceptsImages(accept);
  const formatLabel = accept.length > 0 ? getAcceptLabel(accept) : 'Semua format';

  const handleFile = (f: File | null) => {
    if (f) {
      setValue(field.name, f, { shouldValidate: true });
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const previewUrl = file ? getFileIcon() : null;

  return (
    <div className="space-y-1.5">
      {label}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptStr}
        className="sr-only"
        aria-label={field.label}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />
      {showCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept={imageAcceptStr}
          capture="environment"
          className="sr-only"
          aria-label={`Ambil foto ${field.label}`}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
      )}

      {file ? (
        <div className="flex items-center gap-2 rounded-lg border bg-secondary/50 px-3 py-2.5 text-sm">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-8 h-8 rounded object-cover shrink-0" />
          ) : (
            <FileUp className="w-4 h-4 text-primary shrink-0" />
          )}
          <span className="truncate flex-1 text-foreground">{file.name}</span>
          <button
            type="button"
            onClick={() => setValue(field.name, undefined, { shouldValidate: true })}
            className="tap-target flex items-center justify-center p-1 rounded-full hover:bg-muted"
            aria-label={t('common.removeFile')}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Drop zone / browse button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files?.[0] || null); }}
            className={`w-full tap-target flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-5 text-sm transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <FileUp className="w-6 h-6 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{t('common.tapUpload')}</span>
            <span className="text-xs text-muted-foreground">Format: {formatLabel}</span>
            {field.maxSizeMB && (
              <span className="text-xs text-muted-foreground">{t('common.maxSize')} {field.maxSizeMB}MB</span>
            )}
          </button>

          {/* Camera button for fields that accept images */}
          {showCamera && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full tap-target flex items-center justify-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <Camera className="w-4 h-4 text-muted-foreground" />
              Ambil Foto Langsung
            </button>
          )}
        </div>
      )}
      {error}
    </div>
  );
}
