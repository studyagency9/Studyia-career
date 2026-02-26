import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, CreditCard, Users as TeamIcon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n/i18nContext';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const settingsSections = [
    {
      icon: User,
      title: t('pro.settings.profile'),
      description: t('pro.settings.profileDesc'),
      color: 'blue',
    },
    {
      icon: Bell,
      title: t('pro.settings.notifications'),
      description: t('pro.settings.notificationsDesc'),
      color: 'purple',
    },
    {
      icon: Shield,
      title: t('pro.settings.security'),
      description: t('pro.settings.securityDesc'),
      color: 'green',
    },
    {
      icon: CreditCard,
      title: t('pro.settings.billing'),
      description: t('pro.settings.billingDesc'),
      color: 'orange',
    },
    {
      icon: TeamIcon,
      title: t('pro.settings.team'),
      description: t('pro.settings.teamDesc'),
      color: 'pink',
    },
    {
      icon: Palette,
      title: t('pro.settings.appearance'),
      description: t('pro.settings.appearanceDesc'),
      color: 'indigo',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('pro.settings.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('pro.settings.subtitle')}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-lg bg-${section.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <section.icon className={`w-6 h-6 text-${section.color}-600`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-gray-600">{section.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('pro.settings.quickSettings')}</h2>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('pro.settings.profileInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('pro.settings.firstName')}</Label>
                <Input id="firstName" defaultValue="Admin" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">{t('pro.settings.lastName')}</Label>
                <Input id="lastName" defaultValue="User" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">{t('pro.settings.email')}</Label>
                <Input id="email" type="email" defaultValue="admin@studyia.net" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="company">{t('pro.settings.company')}</Label>
                <Input id="company" defaultValue="Studyia Career" className="mt-1" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('pro.settings.notifications')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{t('pro.settings.emailNotifications')}</p>
                  <p className="text-sm text-gray-600">{t('pro.settings.emailNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{t('pro.settings.pushNotifications')}</p>
                  <p className="text-sm text-gray-600">{t('pro.settings.pushNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{t('pro.settings.weeklyReports')}</p>
                  <p className="text-sm text-gray-600">{t('pro.settings.weeklyReportsDesc')}</p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Plan Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('pro.settings.currentPlan')}</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{t('pro.settings.premiumPlan')}</p>
                  <p className="text-sm text-gray-600">{t('pro.settings.premiumPlanDesc')}</p>
                </div>
                <Button variant="outline">{t('pro.settings.upgrade')}</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline">{t('pro.settings.cancel')}</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            {t('pro.settings.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
