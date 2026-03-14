import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import { checkPermitStatus } from '@/lib/api';
import { Search, Loader2, FileDown, AlertTriangle, CheckCircle2, Clock, XCircle, FileText, Edit, Send } from 'lucide-react';
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

    const pattern = /^BAPPERIDA-RID-\d{4}-\d{6}$/;
    if (!pattern.test(trimmed)) {
      setError(t('status.invalidFormat'));
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
        : err?.response?.data?.error || t('error.generic');
      setError(msg);
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (!result) return;

    switch (result.status) {
      case 'submitted':
        // Isi survei kepuasan
        navigate('/survei-kepuasan', { 
          state: { 
            requestNumber: result.requestNumber,
            email: result.email,
            name: result.fullName 
          } 
        });
        break;
      case 'approved':
        // Upload laporan akhir
        navigate('/laporan-akhir', { 
          state: { 
            requestNumber: result.requestNumber,
            email: result.email,
            name: result.fullName,
            researchTitle: result.researchTitle
          } 
        });
        break;
      case 'revision_requested':
        // Revisi permohonan
        navigate('/izin-penelitian/revisi', { 
          state: { 
            requestNumber: result.requestNumber,
            reviewNote: result.review_note || result.reviewNote
          } 
        });
        break;
      default:
        // Tidak ada action
        break;
    }
  };

  const status = result?.status?.toLowerCase() || '';
  const isSubmitted = status === 'submitted';
  const isApproved = status === 'approved';
  const isRevisionRequested = status === 'revision_requested';
  const isSentOrGenerated = status === 'sent' || status === 'generated_letter';
  const isRejected = status === 'rejected';
  const reviewNote = result?.review_note || result?.reviewNote || '';

  const getStatusConfig = () => {
    if (isSentOrGenerated) return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: t('status.sent') };
    if (isRejected) return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/5', label: t('status.rejected') };
    if (isApproved) return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Disetujui' };
    if (isRevisionRequested) return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Perlu Revisi' };
    if (isSubmitted) return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Submitted' };
    return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: t('status.processing') };
  };

  const statusConfig = result ? getStatusConfig() : null;

  const fileUrl = result?.generatedLetter?.fileUrl || result?.fileUrl;

  const getActionButton = () => {
    if (!result) return null;

    if (isSubmitted) {
      return (
        <Button 
          onClick={handleAction} 
          className="w-full tap-target gap-2"
          size="lg"
        >
          <Edit className="w-5 h-5" />
          Isi Survei Kepuasan
        </Button>
      );
    }

    if (isApproved) {
      return (
        <Button 
          onClick={handleAction} 
          className="w-full tap-target gap-2"
          size="lg"
        >
          <Send className="w-5 h-5" />
          Upload Laporan Akhir
        </Button>
      );
    }

    if (isRevisionRequested) {
      return (
        <Button 
          onClick={handleAction} 
          className="w-full tap-target gap-2"
          size="lg"
        >
          <Edit className="w-5 h-5" />
          Revisi Permohonan
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
              placeholder="BAPPERIDA-RID-2026-000123"
              value={requestNumber}
              onChange={(e) => setRequestNumber(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="tap-target text-sm font-mono"
            />
            <p className="text-xs text-muted-foreground">{t('status.formatHint')}</p>
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
                <div className="rounded-lg border border-yellow-600/20 bg-yellow-50 p-3 space-y-1">
                  <p className="text-xs font-semibold text-yellow-600">Catatan Revisi:</p>
                  <p className="text-sm text-foreground">{reviewNote}</p>
                </div>
              )}

              {/* Sent/Generated: show download + office notice */}
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