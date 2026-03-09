import type { SubmitResponse } from '@/types/form';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockSubmitPermit(_data: FormData): Promise<SubmitResponse> {
  await delay(1500);
  console.log('[MOCK] Permit FormData keys:', [..._data.keys()]);
  const num = `BAPPERIDA-RID-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  return { success: true, message: 'Permohonan izin penelitian berhasil dikirim.', requestNumber: num };
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

  // Simulate different statuses based on last digit
  const lastDigit = parseInt(requestNumber.slice(-1));
  if (lastDigit >= 7) {
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
  if (lastDigit >= 4) {
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
    status: 'pending',
    createdAt: '2026-03-01T08:00:00Z',
  };
}
