import { Route, Switch } from 'wouter';
import { Toaster } from 'sonner';
import { FODMAPProvider } from '@/contexts/FODMAPContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppNav from '@/components/AppNav';
import Home from '@/pages/Home';
import Triage from '@/pages/Triage';
import Scanner from '@/pages/Scanner';
import Profile from '@/pages/Profile';
import FindPro from '@/pages/FindPro';
import Legal from '@/pages/Legal';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <FODMAPProvider>
        <Toaster position="top-center" richColors />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/triage" component={Triage} />
          <Route path="/scanner" component={Scanner} />
          <Route path="/profile" component={Profile} />
          <Route path="/find-pro" component={FindPro} />
          <Route path="/legal" component={Legal} />
          <Route component={NotFound} />
        </Switch>
        <AppNav />
      </FODMAPProvider>
    </ThemeProvider>
  );
}
