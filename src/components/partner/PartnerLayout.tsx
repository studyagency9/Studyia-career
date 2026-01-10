import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
  Sparkles,
  User,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n/i18nContext';

interface PartnerLayoutProps {
  children: ReactNode;
}

const PartnerLayout = ({ children }: PartnerLayoutProps) => {
  const { partner, logout, savedCVs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/partner/login');
  };

  const navItems = [
    {
      label: t('home.partner.dashboard.badge'),
      icon: LayoutDashboard,
      path: '/partner/dashboard',
    },
    {
      label: t('home.partner.dashboard.recentCVs'),
      icon: FileText,
      path: '/partner/cvs',
      badge: savedCVs.length,
    },
    {
      label: t('home.partner.pricing.badge'),
      icon: Sparkles,
      path: '/partner/pricing',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-navy-deep to-[#0a1628] border-r border-primary/20 shadow-2xl z-50"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary/20">
            <Link to="/partner/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center shadow-lg shadow-primary/50 group-hover:shadow-primary/70 transition-all group-hover:scale-110">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-primary-foreground block">Studyia Career</span>
                <span className="text-xs text-primary-foreground/60">{t('home.partner.dashboard.badge')}</span>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                {partner?.firstName[0]}{partner?.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary-foreground truncate">
                  {partner?.firstName} {partner?.lastName}
                </p>
                <p className="text-xs text-primary-foreground/60 truncate">{partner?.company}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full px-2">
                <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                        : 'text-primary-foreground/70 hover:bg-primary/10 hover:text-primary-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-bold',
                        isActive ? 'bg-primary-foreground/20' : 'bg-primary/20'
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </motion.div>
                </Link>
              );
            })}

            {/* Create CV Button */}
            <Link to="/partner/create">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  {t('home.partner.dashboard.createNewCV')}
                </Button>
              </motion.div>
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-primary/20">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('home.partner.dashboard.logout')}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="ml-72">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="min-h-screen"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default PartnerLayout;
