import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import PermitFormPage from "./pages/PermitFormPage";
import SurveyFormPage from "./pages/SurveyFormPage";
import FinalReportFormPage from "./pages/FinalReportFormPage";
import CheckStatusPage from "./pages/CheckStatusPage";
import SuccessPage from "./pages/SuccessPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/izin-penelitian" element={<PermitFormPage />} />
            <Route path="/survei-kepuasan" element={<SurveyFormPage />} />
            <Route path="/laporan-akhir" element={<FinalReportFormPage />} />
            <Route path="/cek-status" element={<CheckStatusPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
