import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { FileSearch, BarChart3, FileText, ChevronRight, ClipboardList } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const services = [
    {
      title: t('index.permit.title'),
      description: t('index.permit.desc'),
      icon: FileSearch,
      path: '/izin-penelitian',
      color: 'bg-primary/10 text-primary',
    },
    // {
    //   title: t('index.survey.title'),
    //   description: t('index.survey.desc'),
    //   icon: BarChart3,
    //   path: '/survei-kepuasan',
    //   color: 'bg-accent/10 text-accent',
    // },
    // {
    //   title: t('index.final.title'),
    //   description: t('index.final.desc'),
    //   icon: FileText,
    //   path: '/laporan-akhir',
    //   color: 'bg-warning/10 text-warning',
    // },
    {
      title: t('index.status.title'),
      description: t('index.status.desc'),
      icon: ClipboardList,
      path: '/cek-status',
      color: 'bg-secondary/80 text-secondary-foreground',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2 pt-4">
          <h1 className="heading-clamp font-bold text-foreground">{t('app.title')}</h1>
          <p className="subheading-clamp text-muted-foreground max-w-xs mx-auto">
            {t('app.selectService')}
          </p>
        </div>

        <div className="space-y-3">
          {services.map((s) => (
            <button
              key={s.path}
              onClick={() => navigate(s.path)}
              className="w-full tap-target flex items-center gap-4 bg-card border rounded-xl px-4 py-4 text-left hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.98]"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground text-sm leading-tight">{s.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
