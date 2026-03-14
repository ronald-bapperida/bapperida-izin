import { PermitStatus } from "@/lib/form-definitions";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'phone' | 'email' | 'file' | 'number';
  required?: boolean;
  uppercase?: boolean;
  placeholder?: string;
  accept?: string[];
  maxSizeMB?: number;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormSchema {
  sections: FormSection[];
}

export interface FormDefinition {
  code: string;
  service_type: string;
  title: string;
  description: string;
  instructions_html: string;
  schema: FormSchema;
  submit_endpoint: string;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  requestNumber?: string;
  status?: PermitStatus;
}
