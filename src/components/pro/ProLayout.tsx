import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, Sparkles, Bell, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n/i18nContext';

const ProLayout = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { name: t('pro.common.dashboard'), href: '/pro/dashboard', icon: LayoutDashboard },
    { name: 'Offres', href: '/pro/jobs', icon: Briefcase },
    { name: t('pro.common.pipeline'), href: '/pro/pipeline', icon: Users },
    { name: t('pro.common.analytics'), href: '/pro/analytics', icon: BarChart3 },
    { name: t('pro.common.settings'), href: '/pro/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gray-50 text-gray-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#334155] text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-20 flex items-center justify-center border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        >
          <Sparkles size={28} className="text-blue-400" />
          <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Career Pro
          </h1>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-base rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/50'
                      : 'hover:bg-white/10 text-gray-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-white/10"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@studyia.net</p>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            &copy; 2026 Studyia Career
          </p>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Studyia Career Pro
            </h2>
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
              {t('pro.common.premium')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" size="sm">
              {t('pro.common.upgradeplan')}
            </Button>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProLayout;
