import { z } from 'zod';
import type { FormField, FormSchema } from '@/types/form';

function buildFieldSchema(field: FormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'email':
      schema = z.string().email('Format email tidak valid');
      break;
    case 'number':
      schema = z.coerce.number();
      if (field.min !== undefined) schema = (schema as z.ZodNumber).min(field.min);
      if (field.max !== undefined) schema = (schema as z.ZodNumber).max(field.max);
      break;
    case 'checkbox':
      schema = z.boolean();
      if (field.required) schema = (schema as z.ZodBoolean).refine(v => v === true, { message: `${field.label} wajib dicentang` });
      return schema;
    case 'file':
      if (field.required) {
        schema = z.instanceof(File, { message: `${field.label} wajib diunggah` });
        if (field.maxSizeMB) {
          const maxBytes = field.maxSizeMB * 1024 * 1024;
          schema = (schema as z.ZodType<File>).refine(
            (f) => f.size <= maxBytes,
            { message: `Ukuran file maksimal ${field.maxSizeMB}MB` }
          );
        }
        if (field.accept?.length) {
          schema = (schema as z.ZodType<File>).refine(
            (f) => field.accept!.includes(f.type),
            { message: `Format file harus: ${field.accept!.join(', ')}` }
          );
        }
      } else {
        schema = z.instanceof(File).optional();
      }
      return schema;
    case 'date':
      schema = z.string().min(1, `${field.label} wajib diisi`);
      break;
    default:
      schema = z.string();
      if (field.minLength) schema = (schema as z.ZodString).min(field.minLength, `Minimal ${field.minLength} karakter`);
      if (field.maxLength) schema = (schema as z.ZodString).max(field.maxLength, `Maksimal ${field.maxLength} karakter`);
      break;
  }

  const nonStringTypes: string[] = ['checkbox', 'file', 'number'];
  if (field.required && !nonStringTypes.includes(field.type)) {
    schema = (schema as z.ZodString).min(1, `${field.label} wajib diisi`);
  }
  if (!field.required && !nonStringTypes.includes(field.type)) {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
}

export function buildZodSchema(formSchema: FormSchema): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const section of formSchema.sections) {
    for (const field of section.fields) {
      shape[field.name] = buildFieldSchema(field);
    }
  }
  return z.object(shape);
}
