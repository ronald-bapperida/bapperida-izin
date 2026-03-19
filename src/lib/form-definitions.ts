import type { FormField, FormSection } from '@/types/form';

const IMAGE_OR_PDF = ['application/pdf', 'image/jpeg', 'image/png'];
const PDF_ONLY = ['application/pdf'];

// ========== FORM 1: IZIN PENELITIAN ==========
export const permitSections: FormSection[] = [
  {
    title: 'Data Akun',
    fields: [
      { name: 'email_google', label: 'Email Google', type: 'email', required: true, uppercase: false, placeholder: 'email@gmail.com' },
    ],
  },
  {
    title: 'Data Pemohon',
    fields: [
      { name: 'full_name', label: 'NAMA LENGKAP', type: 'text', required: true, uppercase: true, placeholder: 'BUDI' },
      { name: 'email_active', label: 'E-mail Aktif', type: 'email', required: true, uppercase: false, placeholder: 'email@example.com' },
      { name: 'nim_nik', label: 'NIM / NIK', type: 'text', required: true, uppercase: true, placeholder: 'NIM atau NIK' },
      { name: 'place_of_birth', label: 'TEMPAT LAHIR', type: 'text', required: true, uppercase: true, placeholder: 'PALANGKA RAYA' },
      { name: 'work_unit', label: 'UNIT KERJA TIM SURVEY / PENELITI', type: 'text', required: true, uppercase: true, placeholder: 'Contoh: TIM SURVEY MAHASISWA PRODI ILMU PEMERINTAHAN' },
      { name: 'institution', label: 'ASAL LEMBAGA / PERGURUAN TINGGI', type: 'text', required: true, uppercase: true, placeholder: 'UNIVERSITAS PALANGKA RAYA' },
      { name: 'phone_whatsapp', label: 'NOMOR TELEPON / PONSEL (WhatsApp)', type: 'phone', required: true, uppercase: false, placeholder: '08123456789', minLength: 10 },
      {
        name: 'nationality', label: 'KEWARGANEGARAAN', type: 'select', required: true, uppercase: true,
        options: [
          { label: 'WNI', value: 'WNI' },
          { label: 'WNA', value: 'WNA' },
        ],
      },
    ],
  },
  {
    title: 'Detail Penelitian',
    fields: [
      { name: 'research_location', label: 'LOKASI PENELITIAN SPESIFIK', type: 'textarea', required: true, uppercase: true, placeholder: 'DINAS PENDIDIKAN KOTA PALANGKA RAYA' },
      { name: 'research_duration', label: 'DURASI PENELITIAN', type: 'textarea', required: true, uppercase: true, placeholder: '3 BULAN (MAX) MULAI JANUARI - MARET 2026' },
      { name: 'research_title', label: 'JUDUL PENELITIAN', type: 'textarea', required: true, uppercase: true, placeholder: 'ANALISIS PENGARUH ...' },
    ],
  },
  {
    title: 'Surat Pengantar',
    fields: [
      { name: 'signer_position', label: 'Jabatan yang Menandatangani Surat Pengantar', type: 'text', required: true, uppercase: true, placeholder: 'DEKAN FAKULTAS ...' },
      { name: 'letter_number', label: 'Nomor Surat', type: 'text', required: true, uppercase: true, placeholder: '001/UN24/FK/2026' },
      { name: 'letter_date', label: 'Tanggal Surat', type: 'date', required: true },
    ],
  },
  {
    title: 'Upload Berkas',
    fields: [
      { name: 'identity_pdf', label: 'Kartu Identitas (KTM/KTP) — Foto/PDF', type: 'file', required: true, accept: IMAGE_OR_PDF, maxSizeMB: 10, allowCamera: true },
      { name: 'submission_letter_pdf', label: 'Surat Pengajuan dari Kampus — PDF', type: 'file', required: true, accept: PDF_ONLY, maxSizeMB: 10 },
      { name: 'proposal_pdf', label: 'Proposal Penelitian — PDF', type: 'file', required: true, accept: PDF_ONLY, maxSizeMB: 10 },
      { name: 'social_media_proof_pdf', label: 'Bukti Follow & Like Sosial Media — Foto/PDF', type: 'file', required: true, accept: IMAGE_OR_PDF, maxSizeMB: 10, allowCamera: true },
    ],
  },
  {
    title: 'Pernyataan',
    fields: [
      { name: 'agree_final_report', label: 'Saya bersedia menyampaikan laporan akhir ke BAPPERIDA Prov. Kalteng Bidang Riset dan Inovasi.', type: 'checkbox', required: true },
    ],
  },
];

// ========== FORM 2: SURVEI KEPUASAN ==========
const surveyQuestions: { name: string; label: string; options: { label: string; value: string }[] }[] = [
  {
    name: 'q1_requirement', label: '1. Kesesuaian persyaratan pelayanan?',
    options: [
      { label: 'a. Tidak sesuai', value: 'a' },
      { label: 'b. Kurang sesuai', value: 'b' },
      { label: 'c. Sesuai', value: 'c' },
      { label: 'd. Sangat sesuai', value: 'd' },
    ],
  },
  {
    name: 'q2_procedure', label: '2. Kemudahan prosedur?',
    options: [
      { label: 'a. Tidak mudah', value: 'a' },
      { label: 'b. Kurang mudah', value: 'b' },
      { label: 'c. Mudah', value: 'c' },
      { label: 'd. Sangat mudah', value: 'd' },
    ],
  },
  {
    name: 'q3_speed', label: '3. Kecepatan waktu pelayanan?',
    options: [
      { label: 'a. Tidak cepat', value: 'a' },
      { label: 'b. Kurang cepat', value: 'b' },
      { label: 'c. Cepat', value: 'c' },
      { label: 'd. Sangat cepat', value: 'd' },
    ],
  },
  {
    name: 'q4_cost', label: '4. Kewajaran biaya/tarif?',
    options: [
      { label: 'a. Sangat mahal', value: 'a' },
      { label: 'b. Cukup mahal', value: 'b' },
      { label: 'c. Murah', value: 'c' },
      { label: 'd. Gratis/tanpa biaya', value: 'd' },
    ],
  },
  {
    name: 'q5_product', label: '5. Kesesuaian produk pelayanan dengan standar?',
    options: [
      { label: 'a. Tidak sesuai', value: 'a' },
      { label: 'b. Kurang sesuai', value: 'b' },
      { label: 'c. Sesuai', value: 'c' },
      { label: 'd. Sangat sesuai', value: 'd' },
    ],
  },
  {
    name: 'q6_competence', label: '6. Kompetensi petugas?',
    options: [
      { label: 'a. Tidak kompeten', value: 'a' },
      { label: 'b. Kurang kompeten', value: 'b' },
      { label: 'c. Kompeten', value: 'c' },
      { label: 'd. Sangat kompeten', value: 'd' },
    ],
  },
  {
    name: 'q7_courtesy', label: '7. Kesopanan & keramahan?',
    options: [
      { label: 'a. Tidak sopan', value: 'a' },
      { label: 'b. Kurang sopan', value: 'b' },
      { label: 'c. Sopan', value: 'c' },
      { label: 'd. Sangat sopan', value: 'd' },
    ],
  },
  {
    name: 'q8_facility', label: '8. Kualitas sarana prasarana?',
    options: [
      { label: 'a. Buruk', value: 'a' },
      { label: 'b. Cukup', value: 'b' },
      { label: 'c. Baik', value: 'c' },
      { label: 'd. Sangat baik', value: 'd' },
    ],
  },
  {
    name: 'q9_complaint', label: '9. Penanganan pengaduan/saran?',
    options: [
      { label: 'a. Tidak ada', value: 'a' },
      { label: 'b. Ada tapi tidak berfungsi', value: 'b' },
      { label: 'c. Kurang maksimal', value: 'c' },
      { label: 'd. Dikelola baik & cepat', value: 'd' },
    ],
  },
];

export const surveySections: FormSection[] = [
  {
    title: 'Data Responden',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'respondent_name', label: 'Nama', type: 'text', required: true },
      { name: 'age', label: 'Usia', type: 'number', required: true, min: 10, max: 100, placeholder: '25' },
      {
        name: 'gender', label: 'Jenis Kelamin', type: 'radio', required: true,
        options: [
          { label: 'Laki-laki', value: 'Laki-laki' },
          { label: 'Perempuan', value: 'Perempuan' },
        ],
      },
      {
        name: 'education', label: 'Pendidikan Terakhir', type: 'select', required: true,
        options: [
          { label: 'SD/MI kebawah', value: 'SD/MI kebawah' },
          { label: 'SMP/MTs/sederajat', value: 'SMP/MTs/sederajat' },
          { label: 'SMA/SMK/MA/sederajat', value: 'SMA/SMK/MA/sederajat' },
          { label: 'D-1/D-2/D-3', value: 'D-1/D-2/D-3' },
          { label: 'D-4/S1', value: 'D-4/S1' },
          { label: 'S-2/Pend. Profesi', value: 'S-2/Pend. Profesi' },
          { label: 'S-3', value: 'S-3' },
        ],
      },
      {
        name: 'occupation', label: 'Pekerjaan', type: 'select', required: true,
        options: [
          { label: 'PNS', value: 'PNS' },
          { label: 'Pegawai Instansi Pemerintahan', value: 'Pegawai Instansi Pemerintahan' },
          { label: 'TNI/POLRI', value: 'TNI/POLRI' },
          { label: 'Pegawai BUMN/BUMD', value: 'Pegawai BUMN/BUMD' },
          { label: 'Pegawai Swasta', value: 'Pegawai Swasta' },
          { label: 'Wiraswasta/Wirausaha', value: 'Wiraswasta/Wirausaha' },
          { label: 'Petani/Rumah Tangga', value: 'Petani/Rumah Tangga' },
          { label: 'Pelajar/Mahasiswa', value: 'Pelajar/Mahasiswa' },
          { label: 'Lainnya', value: 'Lainnya' },
        ],
      },
    ],
  },
  {
    title: 'Penilaian Pelayanan',
    fields: surveyQuestions.map((q) => ({
      name: q.name,
      label: q.label,
      type: 'radio' as const,
      required: true,
      options: q.options,
    })),
  },
  {
    title: 'Saran (Opsional)',
    fields: [
      { name: 'suggestion', label: 'Saran perbaikan, masukan, harapan', type: 'textarea', required: false, placeholder: 'Tulis saran Anda di sini...' },
    ],
  },
];

// ========== FORM 3: LAPORAN AKHIR ==========
export const finalReportSections: FormSection[] = [
  {
    title: 'Data Pelapor',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'name', label: 'Nama', type: 'text', required: true },
      { name: 'research_title', label: 'Judul Penelitian', type: 'textarea', required: true, placeholder: 'Masukkan judul penelitian Anda' },
    ],
  },
  {
    title: 'Upload & Saran',
    fields: [
      { name: 'final_report_pdf', label: 'Laporan Akhir Penelitian (PDF)', type: 'file', required: true, accept: ['application/pdf'], maxSizeMB: 10 },
      { name: 'suggestion', label: 'Saran / Masukan', type: 'textarea', required: true, placeholder: 'Tulis saran, masukan, atau harapan Anda...' },
    ],
  },
];

export const permitStatusValues = [
  "submitted",
  "in_review",
  "revision_requested",
  "approved",
  "generated_letter",
  "sent",
  "rejected",
] as const;

export type PermitStatus = typeof permitStatusValues[number];
