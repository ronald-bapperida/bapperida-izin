import axios from "axios";
import type { SubmitResponse } from "@/types/form";
import { mockSubmitPermit, mockSubmitSurvey, mockSubmitFinalReport, mockCheckPermitStatus } from "./mock-api";

const BASE = import.meta.env.VITE_API_BASE_URL || "";
const USE_MOCK = !BASE || BASE.includes("localhost") || BASE.includes("127.0.0.1");

const api = axios.create({ baseURL: BASE });

// ─── Field name mapping: form UI names → API names ───────────────────────────

const PERMIT_FIELD_MAP: Record<string, string> = {
  email_google: "emailGoogle",
  full_name: "fullName",
  email_active: "emailActive",
  nim_nik: "nimNik",
  place_of_birth: "birthPlace",
  work_unit: "workUnit",
  institution: "institution",
  phone_whatsapp: "phoneWa",
  nationality: "citizenship",
  research_location: "researchLocation",
  research_duration: "researchDuration",
  research_title: "researchTitle",
  signer_position: "signerPosition",
  letter_number: "introLetterNumber",
  letter_date: "introLetterDate",
  agree_final_report: "agreementFinalReport",
};

const PERMIT_FILE_MAP: Record<string, string> = {
  identity_pdf: "fileIdentity",
  submission_letter_pdf: "fileIntroLetter",
  proposal_pdf: "fileProposal",
  social_media_proof_pdf: "fileSocialMedia",
  survey_proof_pdf: "fileSurvey",
};

const FINAL_REPORT_FIELD_MAP: Record<string, string> = {
  email: "email",
  name: "name",
  research_title: "researchTitle",
  suggestion: "suggestion",
};

const FINAL_REPORT_FILE_MAP: Record<string, string> = {
  final_report_pdf: "file",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildMappedFormData(
  values: Record<string, unknown>,
  fieldMap: Record<string, string>,
  fileMap: Record<string, string>,
): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      const apiKey = fileMap[key] || key;
      fd.append(apiKey, value);
    } else {
      const apiKey = fieldMap[key] || key;
      fd.append(apiKey, String(value));
    }
  }
  return fd;
}

// ─── Submit: Research Permit ─────────────────────────────────────────────────

export async function submitPermit(values: Record<string, unknown>): Promise<SubmitResponse> {
  if (USE_MOCK) {
    const fd = buildMappedFormData(values, PERMIT_FIELD_MAP, PERMIT_FILE_MAP);
    return mockSubmitPermit(fd);
  }

  const fd = buildMappedFormData(values, PERMIT_FIELD_MAP, PERMIT_FILE_MAP);
  const { data } = await api.post("/api/permits", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Normalize API response to our SubmitResponse shape
  return {
    success: true,
    message: data.message || "Berhasil dikirim",
    requestNumber: data.requestNumber || data.id,
  };
}

// ─── Submit: Survey ──────────────────────────────────────────────────────────
const SURVEY_FIELD_MAP: Record<string, string> = {
  email: "email",
  respondent_name: "respondentName", // mapping ke camelCase database
  age: "age",
  gender: "gender",
  education: "education",
  occupation: "occupation",
  q1_requirement: "q1",
  q2_procedure: "q2",
  q3_speed: "q3",
  q4_cost: "q4",
  q5_product: "q5",
  q6_competence: "q6",
  q7_courtesy: "q7",
  q8_facility: "q8",
  q9_complaint: "q9",
  suggestion: "suggestion",
};

export async function submitSurvey(values: Record<string, unknown>): Promise<SubmitResponse> {
  if (USE_MOCK) return mockSubmitSurvey(values);

  const mappedValues: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const apiKey = SURVEY_FIELD_MAP[key] || key;
    mappedValues[apiKey] = value;
  }

  const { data } = await api.post("/api/surveys", mappedValues);
  return {
    success: true,
    message: data.message || "Terima kasih, survei terkirim",
  };
}

// ─── Submit: Final Report + Suggestion ───────────────────────────────────────

export async function submitFinalReport(values: Record<string, unknown>): Promise<SubmitResponse> {
  if (USE_MOCK) {
    const fd = buildMappedFormData(values, FINAL_REPORT_FIELD_MAP, FINAL_REPORT_FILE_MAP);
    return mockSubmitFinalReport(fd);
  }

  const fd = buildMappedFormData(values, FINAL_REPORT_FIELD_MAP, FINAL_REPORT_FILE_MAP);
  const { data } = await api.post("/api/final-reports", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Also submit to suggestion box if suggestion provided
  const suggestion = values.suggestion;
  if (suggestion && String(suggestion).trim()) {
    try {
      await api.post("/api/suggestions", {
        email: values.email,
        name: values.name,
        suggestion: String(suggestion),
      });
    } catch {
      // Suggestion is best-effort, don't fail the main submission
    }
  }

  return {
    success: true,
    message: data.message || "Laporan akhir terkirim",
  };
}

// ─── Check Permit Status ─────────────────────────────────────────────────────

export async function checkPermitStatus(requestNumber: string): Promise<any> {
  if (USE_MOCK) return mockCheckPermitStatus(requestNumber);

  const { data } = await api.get(`/api/permits/by-number/${encodeURIComponent(requestNumber)}`);
  return data;
}
