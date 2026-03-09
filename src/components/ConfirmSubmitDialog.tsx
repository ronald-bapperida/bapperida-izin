import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useI18n } from '@/lib/i18n';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryItem {
  label: string;
  value: string;
}

interface ConfirmSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  summaryItems: SummaryItem[];
  title?: string;
}

export function ConfirmSubmitDialog({ open, onOpenChange, onConfirm, summaryItems, title }: ConfirmSubmitDialogProps) {
  const { t } = useI18n();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm mx-auto rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">{title || t('confirm.title')}</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">{t('confirm.desc')}</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-2 pr-3">
            {summaryItems.map((item, i) => (
              <div key={i} className="text-sm">
                <span className="text-muted-foreground text-xs">{item.label}</span>
                <p className="font-medium text-foreground break-words">{item.value}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="tap-target">{t('confirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="tap-target">{t('confirm.submit')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
