import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, ArrowLeft, Sparkles, Save, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { centralAfricaCountries, getCitiesByCountryCode } from '@/data/centralAfricaCountries';

const ProfilePage = () => {
  const { associate, getProfile, updateProfile, changePassword } = useAssociateAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
  });
  
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Charger les données du profil au chargement de la page
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getProfile();
        if (profile) {
          setProfileData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            country: profile.country || '',
            city: profile.city || '',
          });
          
          // Charger les villes disponibles pour le pays sélectionné
          if (profile.country) {
            const cities = getCitiesByCountryCode(profile.country);
            setAvailableCities(cities);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger votre profil',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [getProfile, toast, t]);
  
  const handleCountryChange = (countryCode: string) => {
    setProfileData({ ...profileData, country: countryCode, city: '' });
    const cities = getCitiesByCountryCode(countryCode);
    setAvailableCities(cities);
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await updateProfile(profileData);
      
      if (success) {
        toast({
          title: 'Succès',
          description: 'Votre profil a été mis à jour avec succès',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour votre profil',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre profil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }
    
    setIsPasswordLoading(true);
    
    try {
      const success = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (success) {
        toast({
          title: 'Succès',
          description: 'Votre mot de passe a été mis à jour avec succès',
        });
        
        // Réinitialiser le formulaire
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour votre mot de passe',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre mot de passe',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  if (!associate) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <Link to="/associate/dashboard">
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Profil Associé
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              Profil
            </span>
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos paramètres de sécurité
          </p>
        </motion.div>

        {/* Tabs for Profile and Security */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-green-600">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Informations personnelles</h2>
                    <p className="text-sm text-muted-foreground">Modifiez vos informations personnelles</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Email (non modifiable) */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={associate.email}
                        className="pl-12 h-12 text-base bg-muted/50"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">L'adresse email ne peut pas être modifiée</p>
                  </div>

                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-base font-semibold">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="pl-12 h-12 text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-base font-semibold">Nom</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-semibold">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="pl-12 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Pays et Ville */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-base font-semibold">Pays</Label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Select
                          value={profileData.country}
                          onValueChange={handleCountryChange}
                        >
                          <SelectTrigger className="h-12 pl-12">
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {centralAfricaCountries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-base font-semibold">Ville</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Select
                          value={profileData.city}
                          onValueChange={(city) => setProfileData({ ...profileData, city })}
                          disabled={!profileData.country || availableCities.length === 0}
                        >
                          <SelectTrigger className="h-12 pl-12">
                            <SelectValue placeholder="Sélectionnez une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base bg-gradient-to-r from-primary via-blue-600 to-green-600 hover:shadow-xl hover:scale-[1.02] transition-all mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-green-600">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Sécurité</h2>
                    <p className="text-sm text-muted-foreground">Modifiez votre mot de passe</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Mot de passe actuel */}
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-base font-semibold">Mot de passe actuel</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="pl-12 h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-base font-semibold">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pl-12 h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirmer le nouveau mot de passe */}
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-12 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base bg-gradient-to-r from-primary via-blue-600 to-green-600 hover:shadow-xl hover:scale-[1.02] transition-all mt-6"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Mettre à jour le mot de passe
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
