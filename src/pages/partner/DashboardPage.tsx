import { motion } from 'framer-motion';
import { FileText, Plus, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PartnerLayout from '@/components/partner/PartnerLayout';

const DashboardPage = () => {
  const { partner, savedCVs } = useAuth();

  const stats = [
    {
      label: 'CV créés',
      value: savedCVs.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Ce mois',
      value: savedCVs.filter(cv => {
        const cvDate = new Date(cv.createdAt);
        const now = new Date();
        return cvDate.getMonth() === now.getMonth() && cvDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Dernière activité',
      value: savedCVs.length > 0 ? 'Aujourd\'hui' : 'Aucune',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const recentCVs = savedCVs.slice(0, 5).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <PartnerLayout>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center shadow-lg shadow-primary/50">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Bienvenue, {partner?.firstName} !
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos CV et créez de nouveaux documents professionnels
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/partner/create">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Card className="p-8 bg-gradient-to-br from-primary to-blue-bright border-0 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-foreground mb-1">
                        Créer un nouveau CV
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        Commencez un nouveau document professionnel
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary-foreground group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Card>
              </motion.div>
            </Link>

            <Link to="/partner/cvs">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Card className="p-8 bg-card border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        Voir tous mes CV
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Accédez à votre historique complet
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-primary transition-all duration-300" />
                  </div>
                </Card>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent CVs */}
        {recentCVs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">CV récents</h2>
              <Link to="/partner/cvs">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recentCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link to={`/partner/builder/${cv.id}`}>
                    <Card className="p-6 bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                            {cv.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {cv.language.toUpperCase()}
                          </span>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {savedCVs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-12 text-center bg-card border-2 border-dashed border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Aucun CV pour le moment
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Commencez par créer votre premier CV professionnel. C'est simple et rapide !
              </p>
              <Link to="/partner/create">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  Créer mon premier CV
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </div>
    </PartnerLayout>
  );
};

export default DashboardPage;
