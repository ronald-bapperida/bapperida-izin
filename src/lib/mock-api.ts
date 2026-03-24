import type { SubmitResponse } from '@/types/form';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Generate an 8-character alphanumeric token (uppercase) */
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export async function mockSubmitPermit(_data: FormData): Promise<SubmitResponse> {
  await delay(1500);
  console.log('[MOCK] Permit FormData keys:', [..._data.keys()]);
  const token = generateToken();
  return { success: true, message: 'Permohonan izin penelitian berhasil dikirim.', requestNumber: token };
}

export async function mockSubmitSurvey(_data: Record<string, unknown>): Promise<SubmitResponse> {
  await delay(1200);
  console.log('[MOCK] Survey data:', _data);
  return { success: true, message: 'Terima kasih, survei kepuasan berhasil terkirim.' };
}

export async function mockSubmitFinalReport(_data: FormData): Promise<SubmitResponse> {
  await delay(1500);
  console.log('[MOCK] Final Report FormData keys:', [..._data.keys()]);
  return { success: true, message: 'Laporan akhir penelitian berhasil terkirim.' };
}

export async function mockCheckPermitStatus(requestNumber: string): Promise<any> {
  await delay(1000);
  console.log('[MOCK] Check status:', requestNumber);

  // Simulate different statuses based on last character code
  const lastChar = requestNumber.slice(-1).charCodeAt(0);
  const mod = lastChar % 5;

  if (mod === 0) {
    return {
      id: 'mock-id',
      requestNumber,
      fullName: 'BUDI SANTOSO',
      researchTitle: 'ANALISIS DAMPAK EKONOMI DIGITAL',
      status: 'rejected',
      review_note: 'Dokumen surat pengantar tidak sesuai dengan format yang diminta. Silakan ajukan ulang.',
      createdAt: '2026-02-20T08:00:00Z',
    };
  }
  if (mod === 1) {
    return {
      id: 'mock-id',
      requestNumber,
      fullName: 'BUDI SANTOSO',
      researchTitle: 'ANALISIS DAMPAK EKONOMI DIGITAL',
      status: 'in_review',
      createdAt: '2026-03-01T08:00:00Z',
    };
  }
  if (mod === 2) {
    return {
      id: 'mock-id',
      requestNumber,
      fullName: 'BUDI SANTOSO',
      researchTitle: 'ANALISIS DAMPAK EKONOMI DIGITAL',
      status: 'approved',
      createdAt: '2026-03-05T08:00:00Z',
    };
  }
  if (mod === 3) {
    return {
      id: 'mock-id',
      requestNumber,
      fullName: 'BUDI SANTOSO',
      researchTitle: 'ANALISIS DAMPAK EKONOMI DIGITAL',
      status: 'sent',
      generatedLetter: { fileUrl: '#mock-download', letterNumber: 'SI-001/BAPPERIDA/2026' },
      createdAt: '2026-02-15T08:00:00Z',
    };
  }
  return {
    id: 'mock-id',
    requestNumber,
    fullName: 'BUDI SANTOSO',
    researchTitle: 'ANALISIS DAMPAK EKONOMI DIGITAL',
    status: 'submitted',
    createdAt: '2026-03-01T08:00:00Z',
  };
}
