import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import { checkPermitStatus } from '@/lib/api';
import {
  Search, Loader2, FileDown, AlertTriangle, CheckCircle2,
  Clock, XCircle, FileText, Edit, Send, Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PermitResult {
  id: string;
  requestNumber: string;
  email: string;
  fullName?: string;
  researchTitle?: string;
  status: string;
  review_note?: string;
  reviewNote?: string;
  generatedLetter?: { fileUrl?: string; letterNumber?: string } | null;
  fileUrl?: string;
  createdAt?: string;
}

type StatusKey = 'submitted' | 'in_review' | 'revision_requested' | 'approved' | 'generated_letter' | 'sent' | 'rejected';

const STATUS_CONFIG: Record<StatusKey, { icon: any; color: string; bg: string; label: string; message?: string }> = {
  submitted: {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Terkirim',
    message: 'Permohonan Anda telah terkirim dan menunggu diproses.',
  },
  in_review: {
    icon: Eye,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Sedang Direview',
    message: 'Mohon ditunggu, permohonan Anda sedang dalam proses review oleh tim BAPPERIDA.',
  },
  revision_requested: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Perlu Revisi',
    message: 'Permohonan Anda memerlukan revisi. Silakan periksa catatan revisi di bawah.',
  },
  approved: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Disetujui',
    message: 'Permohonan Anda telah disetujui. Silakan upload laporan akhir penelitian.',
  },
  generated_letter: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Surat Dibuat',
    message: 'Surat izin penelitian Anda telah dibuat dan siap diunduh.',
  },
  sent: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Surat Telah Dikirim',
    message: 'Surat izin penelitian Anda telah dikirim. Silakan unduh surat di bawah.',
  },
  rejected: {
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/5',
    label: 'Ditolak',
    message: 'Permohonan Anda ditolak. Silakan periksa alasan penolakan di bawah.',
  },
};

export default function CheckStatusPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const [requestNumber, setRequestNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PermitResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const trimmed = requestNumber.trim().toUpperCase();
    if (!trimmed) return;

    const pattern = /^[A-Z0-9]{8}$/;
    if (!pattern.test(trimmed)) {
      setError('Format token tidak valid. Masukkan 8 karakter kombinasi huruf (A–Z) dan angka (0–9).');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await checkPermitStatus(trimmed);
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? t('status.notFound')
        : err?.response?.data?.error || err?.response?.data?.message || t('error.generic');
      setError(msg);
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setLoading(false);
    }
  };

  const status = (result?.status?.toLowerCase() || '') as StatusKey;
  const statusConfig = status && STATUS_CONFIG[status] ? STATUS_CONFIG[status] : null;

  const isSubmitted = status === 'submitted';
  const isApproved = status === 'approved';
  const isRevisionRequested = status === 'revision_requested';
  const isSentOrGenerated = status === 'sent' || status === 'generated_letter';
  const isRejected = status === 'rejected';
  const reviewNote = result?.review_note || result?.reviewNote || '';
  const fileUrl = result?.generatedLetter?.fileUrl || result?.fileUrl;

  const handleAction = () => {
    if (!result) return;
    if (isSubmitted) {
      navigate('/survei-kepuasan', {
        state: { requestNumber: result.requestNumber, email: result.email, name: result.fullName },
      });
    } else if (isApproved) {
      navigate('/laporan-akhir', {
        state: {
          requestNumber: result.requestNumber,
          email: result.email,
          name: result.fullName,
          researchTitle: result.researchTitle,
        },
      });
    } else if (isRevisionRequested) {
      navigate('/izin-penelitian/revisi', {
        state: { requestNumber: result.requestNumber, reviewNote: result.review_note || result.reviewNote },
      });
    }
  };

  const getActionButton = () => {
    if (!result) return null;
    if (isSubmitted) {
      return (
        <Button onClick={handleAction} className="w-full tap-target gap-2" size="lg">
          <Edit className="w-5 h-5" /> Isi Survei IKM
        </Button>
      );
    }
    if (isApproved) {
      return (
        <div className="space-y-2">
          <Button
            onClick={() => navigate('/survei-kepuasan', {
              state: { requestNumber: result.requestNumber, email: result.email, name: result.fullName },
            })}
            variant="outline"
            className="w-full tap-target gap-2"
            size="lg"
          >
            <Edit className="w-5 h-5" /> Isi Survei IKM
          </Button>
          <Button onClick={handleAction} className="w-full tap-target gap-2" size="lg">
            <Send className="w-5 h-5" /> Upload Laporan Akhir
          </Button>
        </div>
      );
    }
    if (isRevisionRequested) {
      return (
        <Button onClick={handleAction} className="w-full tap-target gap-2" size="lg">
          <Edit className="w-5 h-5" /> Revisi Permohonan
        </Button>
      );
    }
    return null;
  };

  return (
    <AppShell title={t('status.appShellTitle')}>
      <div className="space-y-5 animate-fade-in pb-8">
        <div className="text-center space-y-1 pt-2">
          <h1 className="text-lg font-bold text-foreground">{t('status.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('status.desc')}</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('status.inputLabel')}</label>
            <Input
              placeholder="AB12CD34"
              value={requestNumber}
              onChange={(e) => setRequestNumber(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              maxLength={8}
              className="tap-target text-sm font-mono tracking-widest"
            />
            <p className="text-xs text-muted-foreground">8 karakter kombinasi huruf dan angka (contoh: AB12CD34)</p>
          </div>

          <Button
            onClick={handleSearch}
            disabled={loading || !requestNumber.trim()}
            className="w-full tap-target font-semibold gap-2"
            size="lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? t('status.searching') : t('status.search')}
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && statusConfig && (
          <div className="rounded-xl border bg-card overflow-hidden animate-slide-up">
            {/* Status badge */}
            <div className={`px-4 py-3 flex items-center gap-2 ${statusConfig.bg}`}>
              <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
              <span className={`font-semibold text-sm ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>

            {/* Status message */}
            {statusConfig.message && (
              <div className="px-4 pt-3">
                <p className="text-sm text-muted-foreground">{statusConfig.message}</p>
              </div>
            )}

            {/* Details */}
            <div className="p-4 space-y-3">
              <InfoRow label={t('status.requestNumberLabel')} value={result.requestNumber} mono />
              {result.fullName && <InfoRow label={t('status.nameLabel')} value={result.fullName} />}
              {result.researchTitle && <InfoRow label={t('status.titleLabel')} value={result.researchTitle} />}
              {result.createdAt && (
                <InfoRow
                  label={t('status.dateLabel')}
                  value={new Date(result.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                />
              )}

              {/* Rejected: show review note */}
              {isRejected && reviewNote && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-1">
                  <p className="text-xs font-semibold text-destructive">{t('status.rejectionReason')}</p>
                  <p className="text-sm text-foreground">{reviewNote}</p>
                </div>
              )}

              {/* Revision requested: show review note */}
              {isRevisionRequested && reviewNote && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 space-y-1">
                  <p className="text-xs font-semibold text-orange-600">Catatan Revisi:</p>
                  <p className="text-sm text-foreground">{reviewNote}</p>
                </div>
              )}

              {/* Sent/Generated: PDF download + stamp notice */}
              {isSentOrGenerated && (
                <div className="space-y-3 pt-1">
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 hover:bg-primary/10 transition-colors"
                    >
                      <FileDown className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary">{t('status.downloadLetter')}</p>
                        <p className="text-xs text-muted-foreground truncate">{t('status.downloadHint')}</p>
                      </div>
                    </a>
                  )}
                  <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground font-medium">{t('status.officeStamp')}</p>
                  </div>
                </div>
              )}

              {/* Action button */}
              {getActionButton()}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium text-foreground ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
