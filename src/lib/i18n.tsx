import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'id' | 'en';

const translations = {
  // ===== COMMON =====
  'app.title': { id: 'e-Layanan BAPPERIDA', en: 'e-Services BAPPERIDA' },
  'app.selectService': { id: 'Pilih layanan yang ingin Anda akses.', en: 'Select the service you want to access.' },
  'common.back': { id: 'Kembali', en: 'Back' },
  'common.next': { id: 'Selanjutnya', en: 'Next' },
  'common.prev': { id: 'Sebelumnya', en: 'Previous' },
  'common.submit': { id: 'Kirim Formulir', en: 'Submit Form' },
  'common.submitting': { id: 'Mengirim...', en: 'Submitting...' },
  'common.submitted': { id: 'Terkirim!', en: 'Submitted!' },
  'common.select': { id: 'Pilih...', en: 'Select...' },
  'common.tapUpload': { id: 'Ketuk untuk unggah', en: 'Tap to upload' },
  'common.maxSize': { id: 'Maks', en: 'Max' },
  'common.removeFile': { id: 'Hapus file', en: 'Remove file' },
  'common.home': { id: 'Kembali ke Beranda', en: 'Back to Home' },
  'common.copy': { id: 'Salin', en: 'Copy' },
  'common.copied': { id: 'Disalin', en: 'Copied' },
  'common.language': { id: 'EN', en: 'ID' },

  // ===== INDEX PAGE =====
  'index.permit.title': { id: 'Permohonan Surat Izin Penelitian', en: 'Research Permit Application' },
  'index.permit.desc': { id: 'Ajukan surat izin penelitian ke BAPPERIDA Prov. Kalteng.', en: 'Apply for a research permit from BAPPERIDA Central Kalimantan.' },
  'index.survey.title': { id: 'Survei Kepuasan Masyarakat (IKM)', en: 'Public Satisfaction Survey (IKM)' },
  'index.survey.desc': { id: 'Berikan penilaian terhadap kualitas pelayanan kami.', en: 'Rate the quality of our services.' },
  'index.final.title': { id: 'Laporan Akhir Penelitian + Kotak Saran', en: 'Final Research Report + Suggestion Box' },
  'index.final.desc': { id: 'Kirim laporan akhir penelitian dan sampaikan saran Anda.', en: 'Submit your final research report and provide feedback.' },

  // ===== PERMIT PAGE =====
  'permit.appShellTitle': { id: 'Izin Penelitian', en: 'Research Permit' },
  'permit.title': { id: 'PERMOHONAN SURAT IZIN PENELITIAN', en: 'RESEARCH PERMIT APPLICATION' },
  'permit.desc': { id: 'Pengajuan permohonan surat izin penelitian.', en: 'Application for research permit letter.' },
  'permit.note1': { id: 'Surat diproses hari kerja (Senin–Jumat) 08.00–15.00 WIB', en: 'Letters processed on working days (Mon–Fri) 08:00–15:00 WIB' },
  'permit.note2': { id: 'Proses 2–5 hari kerja', en: 'Processing takes 2–5 working days' },
  'permit.note3': { id: 'Surat dikirim via E-mail dan/atau WhatsApp', en: 'Letter sent via Email and/or WhatsApp' },
  'permit.note4': { id: 'Lampiran format PDF', en: 'Attachments in PDF format' },
  'permit.note5': { id: 'Identitas pemohon: KTM/KTP', en: 'Applicant ID: Student Card/ID Card' },
  'permit.note6': { id: 'Isi form pakai <strong>HURUF KAPITAL</strong> kecuali email', en: 'Fill form in <strong>CAPITAL LETTERS</strong> except email' },
  'permit.chatWA': { id: 'Chat WA Admin: 0877-2315-5328', en: 'Chat WA Admin: 0877-2315-5328' },
  'permit.stampInfo': { id: 'Harap ke kantor Bapperida Prov Kalteng untuk cap basah TTD Kabid RIDA.', en: 'Please visit the BAPPERIDA office for the official stamp & signature.' },

  // Permit section titles
  'permit.section.account': { id: 'Data Akun', en: 'Account Data' },
  'permit.section.applicant': { id: 'Data Pemohon', en: 'Applicant Data' },
  'permit.section.research': { id: 'Detail Penelitian', en: 'Research Details' },
  'permit.section.letter': { id: 'Surat Pengantar', en: 'Cover Letter' },
  'permit.section.upload': { id: 'Upload Berkas', en: 'Upload Documents' },
  'permit.section.statement': { id: 'Pernyataan', en: 'Declaration' },

  // Permit field labels
  'permit.field.email_google': { id: 'Email Google', en: 'Google Email' },
  'permit.field.full_name': { id: 'NAMA LENGKAP', en: 'FULL NAME' },
  'permit.field.email_active': { id: 'E-mail Aktif', en: 'Active Email' },
  'permit.field.nim_nik': { id: 'NIM / NIK', en: 'Student ID / National ID' },
  'permit.field.place_of_birth': { id: 'TEMPAT LAHIR', en: 'PLACE OF BIRTH' },
  'permit.field.work_unit': { id: 'UNIT KERJA TIM SURVEY / PENELITI', en: 'RESEARCH TEAM / WORK UNIT' },
  'permit.field.institution': { id: 'ASAL LEMBAGA / PERGURUAN TINGGI', en: 'INSTITUTION / UNIVERSITY' },
  'permit.field.phone_whatsapp': { id: 'NOMOR TELEPON / PONSEL (WhatsApp)', en: 'PHONE NUMBER (WhatsApp)' },
  'permit.field.nationality': { id: 'KEWARGANEGARAAN', en: 'NATIONALITY' },
  'permit.field.research_location': { id: 'LOKASI PENELITIAN SPESIFIK', en: 'SPECIFIC RESEARCH LOCATION' },
  'permit.field.research_duration': { id: 'DURASI PENELITIAN', en: 'RESEARCH DURATION' },
  'permit.field.research_title': { id: 'JUDUL PENELITIAN', en: 'RESEARCH TITLE' },
  'permit.field.signer_position': { id: 'Jabatan yang Menandatangani Surat Pengantar', en: 'Position of Cover Letter Signatory' },
  'permit.field.letter_number': { id: 'Nomor Surat', en: 'Letter Number' },
  'permit.field.letter_date': { id: 'Tanggal Surat', en: 'Letter Date' },
  'permit.field.identity_pdf': { id: 'Kartu Identitas (KTM/KTP) — PDF', en: 'Identity Card (Student/National ID) — PDF' },
  'permit.field.submission_letter_pdf': { id: 'Surat Pengajuan dari Kampus — PDF', en: 'Submission Letter from Campus — PDF' },
  'permit.field.proposal_pdf': { id: 'Proposal Penelitian — PDF', en: 'Research Proposal — PDF' },
  'permit.field.social_media_proof_pdf': { id: 'Bukti Follow & Like Sosial Media — PDF', en: 'Social Media Follow & Like Proof — PDF' },
  'permit.field.survey_proof_pdf': { id: 'Bukti Sudah Isi Survei Kepuasan — PDF', en: 'Satisfaction Survey Completion Proof — PDF' },
  'permit.field.agree_final_report': { id: 'Saya bersedia menyampaikan laporan akhir ke BAPPERIDA Prov. Kalteng Bidang Riset dan Inovasi.', en: 'I agree to submit the final report to BAPPERIDA Central Kalimantan, Research and Innovation Division.' },

  // ===== SURVEY PAGE =====
  'survey.appShellTitle': { id: 'Survei Kepuasan', en: 'Satisfaction Survey' },
  'survey.title': { id: 'SURVEI KEPUASAN MASYARAKAT (IKM)', en: 'PUBLIC SATISFACTION SURVEY (IKM)' },
  'survey.version': { id: 'Versi: V-25.6200.002', en: 'Version: V-25.6200.002' },
  'survey.intro': { id: 'Survei ini bertujuan untuk mengetahui tingkat kepuasan masyarakat terhadap pelayanan kami. Jawaban Anda sangat berarti untuk peningkatan kualitas layanan.', en: 'This survey aims to measure public satisfaction with our services. Your answers are valuable for service quality improvement.' },

  // Survey sections
  'survey.section.respondent': { id: 'Data Responden', en: 'Respondent Data' },
  'survey.section.rating': { id: 'Penilaian Pelayanan', en: 'Service Rating' },
  'survey.section.suggestion': { id: 'Saran (Opsional)', en: 'Suggestions (Optional)' },

  // Survey fields
  'survey.field.email': { id: 'Email', en: 'Email' },
  'survey.field.respondent_name': { id: 'Nama', en: 'Name' },
  'survey.field.age': { id: 'Usia', en: 'Age' },
  'survey.field.gender': { id: 'Jenis Kelamin', en: 'Gender' },
  'survey.field.gender.male': { id: 'Laki-laki', en: 'Male' },
  'survey.field.gender.female': { id: 'Perempuan', en: 'Female' },
  'survey.field.education': { id: 'Pendidikan Terakhir', en: 'Education Level' },
  'survey.field.occupation': { id: 'Pekerjaan', en: 'Occupation' },
  'survey.field.suggestion': { id: 'Saran perbaikan, masukan, harapan', en: 'Improvement suggestions, feedback, expectations' },
  'survey.field.suggestion.placeholder': { id: 'Tulis saran Anda di sini...', en: 'Write your suggestions here...' },

  // Survey questions
  'survey.q1': { id: '1. Kesesuaian persyaratan pelayanan?', en: '1. Compliance of service requirements?' },
  'survey.q1.a': { id: 'a. Tidak sesuai', en: 'a. Not compliant' },
  'survey.q1.b': { id: 'b. Kurang sesuai', en: 'b. Less compliant' },
  'survey.q1.c': { id: 'c. Sesuai', en: 'c. Compliant' },
  'survey.q1.d': { id: 'd. Sangat sesuai', en: 'd. Very compliant' },
  'survey.q2': { id: '2. Kemudahan prosedur?', en: '2. Ease of procedure?' },
  'survey.q2.a': { id: 'a. Tidak mudah', en: 'a. Not easy' },
  'survey.q2.b': { id: 'b. Kurang mudah', en: 'b. Less easy' },
  'survey.q2.c': { id: 'c. Mudah', en: 'c. Easy' },
  'survey.q2.d': { id: 'd. Sangat mudah', en: 'd. Very easy' },
  'survey.q3': { id: '3. Kecepatan waktu pelayanan?', en: '3. Speed of service?' },
  'survey.q3.a': { id: 'a. Tidak cepat', en: 'a. Not fast' },
  'survey.q3.b': { id: 'b. Kurang cepat', en: 'b. Less fast' },
  'survey.q3.c': { id: 'c. Cepat', en: 'c. Fast' },
  'survey.q3.d': { id: 'd. Sangat cepat', en: 'd. Very fast' },
  'survey.q4': { id: '4. Kewajaran biaya/tarif?', en: '4. Fairness of cost/tariff?' },
  'survey.q4.a': { id: 'a. Sangat mahal', en: 'a. Very expensive' },
  'survey.q4.b': { id: 'b. Cukup mahal', en: 'b. Quite expensive' },
  'survey.q4.c': { id: 'c. Murah', en: 'c. Affordable' },
  'survey.q4.d': { id: 'd. Gratis/tanpa biaya', en: 'd. Free/no cost' },
  'survey.q5': { id: '5. Kesesuaian produk pelayanan dengan standar?', en: '5. Service product compliance with standards?' },
  'survey.q5.a': { id: 'a. Tidak sesuai', en: 'a. Not compliant' },
  'survey.q5.b': { id: 'b. Kurang sesuai', en: 'b. Less compliant' },
  'survey.q5.c': { id: 'c. Sesuai', en: 'c. Compliant' },
  'survey.q5.d': { id: 'd. Sangat sesuai', en: 'd. Very compliant' },
  'survey.q6': { id: '6. Kompetensi petugas?', en: '6. Staff competence?' },
  'survey.q6.a': { id: 'a. Tidak kompeten', en: 'a. Not competent' },
  'survey.q6.b': { id: 'b. Kurang kompeten', en: 'b. Less competent' },
  'survey.q6.c': { id: 'c. Kompeten', en: 'c. Competent' },
  'survey.q6.d': { id: 'd. Sangat kompeten', en: 'd. Very competent' },
  'survey.q7': { id: '7. Kesopanan & keramahan?', en: '7. Courtesy & friendliness?' },
  'survey.q7.a': { id: 'a. Tidak sopan', en: 'a. Not polite' },
  'survey.q7.b': { id: 'b. Kurang sopan', en: 'b. Less polite' },
  'survey.q7.c': { id: 'c. Sopan', en: 'c. Polite' },
  'survey.q7.d': { id: 'd. Sangat sopan', en: 'd. Very polite' },
  'survey.q8': { id: '8. Kualitas sarana prasarana?', en: '8. Quality of facilities?' },
  'survey.q8.a': { id: 'a. Buruk', en: 'a. Poor' },
  'survey.q8.b': { id: 'b. Cukup', en: 'b. Adequate' },
  'survey.q8.c': { id: 'c. Baik', en: 'c. Good' },
  'survey.q8.d': { id: 'd. Sangat baik', en: 'd. Very good' },
  'survey.q9': { id: '9. Penanganan pengaduan/saran?', en: '9. Complaint/suggestion handling?' },
  'survey.q9.a': { id: 'a. Tidak ada', en: 'a. None' },
  'survey.q9.b': { id: 'b. Ada tapi tidak berfungsi', en: 'b. Exists but not functional' },
  'survey.q9.c': { id: 'c. Kurang maksimal', en: 'c. Not optimal' },
  'survey.q9.d': { id: 'd. Dikelola baik & cepat', en: 'd. Well managed & fast' },

  // ===== FINAL REPORT PAGE =====
  'final.appShellTitle': { id: 'Laporan Akhir', en: 'Final Report' },
  'final.title': { id: 'KOTAK SARAN (SUGGESTION BOX)', en: 'SUGGESTION BOX' },
  'final.desc': { id: 'Sampaikan laporan akhir penelitian Anda beserta saran dan masukan untuk peningkatan layanan BAPPERIDA Prov. Kalteng.', en: 'Submit your final research report along with suggestions for improving BAPPERIDA services.' },
  'final.descEn': { id: 'Submit your final research report along with suggestions for improving BAPPERIDA services.', en: '' },
  'final.section.reporter': { id: 'Data Pelapor', en: 'Reporter Data' },
  'final.section.upload': { id: 'Upload & Saran', en: 'Upload & Suggestions' },
  'final.field.email': { id: 'Email', en: 'Email' },
  'final.field.name': { id: 'Nama', en: 'Name' },
  'final.field.research_title': { id: 'Judul Penelitian', en: 'Research Title' },
  'final.field.final_report_pdf': { id: 'Laporan Akhir Penelitian (PDF)', en: 'Final Research Report (PDF)' },
  'final.field.suggestion': { id: 'Saran / Masukan', en: 'Suggestions / Feedback' },
  'final.field.fileHelper': { id: 'Format nama file: <strong>NAMA_LAPORAN AKHIR PENELITIAN_JUDUL</strong>', en: 'File name format: <strong>NAME_FINAL RESEARCH REPORT_TITLE</strong>' },

  // ===== SUCCESS PAGE =====
  'success.title': { id: 'Berhasil Terkirim!', en: 'Successfully Submitted!' },
  'success.defaultMsg': { id: 'Formulir Anda telah berhasil dikirim.', en: 'Your form has been successfully submitted.' },
  'success.requestNumber': { id: 'Nomor Permohonan', en: 'Request Number' },
  'success.copySuccess': { id: 'Nomor permohonan berhasil disalin.', en: 'Request number copied to clipboard.' },
  'success.copyFail': { id: 'Gagal menyalin', en: 'Failed to copy' },
  'success.sendWA': { id: 'Kirim WA ke Admin', en: 'Send WA to Admin' },
  'success.permit': { id: 'Izin Penelitian', en: 'Research Permit' },
  'success.survey': { id: 'Survei Kepuasan', en: 'Satisfaction Survey' },
  'success.final': { id: 'Laporan Akhir', en: 'Final Report' },

  // ===== CHECK STATUS PAGE =====
  'index.status.title': { id: 'Cek Status Permohonan', en: 'Check Application Status' },
  'index.status.desc': { id: 'Lacak status permohonan izin penelitian Anda.', en: 'Track your research permit application status.' },
  'status.appShellTitle': { id: 'Cek Status', en: 'Check Status' },
  'status.title': { id: 'Cek Status Permohonan', en: 'Check Application Status' },
  'status.desc': { id: 'Masukkan nomor permohonan untuk melihat status.', en: 'Enter your request number to check status.' },
  'status.inputLabel': { id: 'Nomor Permohonan', en: 'Request Number' },
  'status.formatHint': { id: 'Format: BAPPERIDA-RID-YYYY-XXXXXX', en: 'Format: BAPPERIDA-RID-YYYY-XXXXXX' },
  'status.search': { id: 'Cari', en: 'Search' },
  'status.searching': { id: 'Mencari...', en: 'Searching...' },
  'status.invalidFormat': { id: 'Format nomor permohonan tidak valid.', en: 'Invalid request number format.' },
  'status.notFound': { id: 'Permohonan tidak ditemukan.', en: 'Application not found.' },
  'status.sent': { id: 'Surat Telah Dikirim', en: 'Letter Has Been Sent' },
  'status.rejected': { id: 'Ditolak', en: 'Rejected' },
  'status.processing': { id: 'Sedang Diproses', en: 'Processing' },
  'status.requestNumberLabel': { id: 'Nomor Permohonan', en: 'Request Number' },
  'status.nameLabel': { id: 'Nama Pemohon', en: 'Applicant Name' },
  'status.titleLabel': { id: 'Judul Penelitian', en: 'Research Title' },
  'status.dateLabel': { id: 'Tanggal Pengajuan', en: 'Submission Date' },
  'status.rejectionReason': { id: 'Alasan Penolakan:', en: 'Rejection Reason:' },
  'status.downloadLetter': { id: 'Unduh Surat Izin', en: 'Download Permit Letter' },
  'status.downloadHint': { id: 'Klik untuk mengunduh file surat', en: 'Click to download the letter file' },
  'status.officeStamp': { id: 'Harap menuju Kantor Bapperida untuk mendapatkan cap basah.', en: 'Please visit the BAPPERIDA office to get the official stamp.' },

  // ===== CONFIRM DIALOG =====
  'confirm.title': { id: 'Konfirmasi Pengiriman', en: 'Confirm Submission' },
  'confirm.desc': { id: 'Pastikan data berikut sudah benar sebelum mengirim.', en: 'Please verify the following data before submitting.' },
  'confirm.cancel': { id: 'Batal', en: 'Cancel' },
  'confirm.submit': { id: 'Ya, Kirim', en: 'Yes, Submit' },

  // ===== VALIDATION / ERRORS =====
  'error.checkForm': { id: 'Periksa isian', en: 'Check your input' },
  'error.formIncomplete': { id: 'Ada kolom yang belum terisi dengan benar.', en: 'Some fields are not filled in correctly.' },
  'error.submitFailed': { id: 'Gagal mengirim', en: 'Failed to submit' },
  'error.generic': { id: 'Terjadi kesalahan', en: 'An error occurred' },
  'error.info': { id: 'Informasi:', en: 'Information:' },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const handleSetLang = useCallback((l: Lang) => {
    setLang(l);
    localStorage.setItem('app-lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    handleSetLang(lang === 'id' ? 'en' : 'id');
  }, [lang, handleSetLang]);

  const t = useCallback((key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['id'] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
