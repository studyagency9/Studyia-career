import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { getWebPageSchema } from "@/utils/seo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FileText, 
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  Palette,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { DateSelector, YearSelector } from "@/components/DateSelector";
import { getJobTitles, getDegrees, getSummarySuggestions, getAllSkills } from "@/data/suggestions";
import { FileSignature, Rocket, UserCheck } from 'lucide-react';
import { templateComponents, templateInfoBase } from "@/components/CVTemplates";
import { CVAnalysis } from "@/components/CVAnalysis";
import { generatePDF } from '@/utils/pdfGenerator';
import PDFPreview from '@/components/PDFPreview';
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/i18nContext";
import { LanguageSwitcherDemo } from "@/components/LanguageSwitcherDemo";
import { PaymentDialog } from "@/components/PaymentDialog";

// Types
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  summary: string;
  photo: string; // Base64 URL of the photo
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  targetJob: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  template: string;
}

const initialCVData: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "Cameroun",
    summary: "",
    photo: ""
  },
  targetJob: "",
  experiences: [],
  education: [],
  skills: [],
  template: "professional"
};

// Steps configuration (will be enriched with translations in component)
const stepsBase = [
  { id: 1, titleKey: "builder.steps.personal", icon: User },
  { id: 2, titleKey: "builder.steps.job", icon: Briefcase },
  { id: 3, titleKey: "builder.steps.experience", icon: Briefcase },
  { id: 4, titleKey: "builder.steps.education", icon: GraduationCap },
  { id: 5, titleKey: "builder.steps.skills", icon: Wrench },
  { id: 6, titleKey: "builder.steps.template", icon: FileSignature },
  { id: 7, titleKey: "builder.steps.preview", icon: Rocket },
];

const icons: { [key: string]: React.ElementType } = {
  FileSignature,
  Zap,
  Rocket,
  UserCheck,
};

const SuggestionUI = ({ onSelect, isMobile }: { onSelect: (content: string) => void; isMobile: boolean }) => {
  const { t, language } = useTranslation();
  const summarySuggestionGroups = getSummarySuggestions(language);
  
  if (isMobile) {
    return (
      <div className="space-y-6 pb-8">
        {summarySuggestionGroups.map((group) => {
          const Icon = icons[group.icon];
          return (
            <div key={group.category}>
              <h5 className="flex items-center text-base font-semibold text-foreground px-1 mb-3">
                {Icon && <Icon className="w-5 h-5 mr-2 text-primary" />}
                {group.category}
              </h5>
              <div className="space-y-3">
                {group.suggestions.map((suggestion, sIndex) => (
                  <div key={sIndex} className="p-4 rounded-lg border bg-card shadow-sm">
                    <h5 className="font-semibold text-foreground mb-1">{suggestion.title}</h5>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{suggestion.content}</p>
                    <DrawerClose asChild>
                      <Button size="sm" onClick={() => onSelect(suggestion.content)} className="w-full">
                        <Check className="w-4 h-4 mr-2" />
                        {t('builder.common.chooseSuggestion')}
                      </Button>
                    </DrawerClose>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Tabs defaultValue={summarySuggestionGroups[0].category} orientation="vertical" className="flex w-full h-[450px]">
      <TabsList className="flex flex-col h-full justify-start items-stretch bg-muted/20 p-2 w-[220px] flex-shrink-0 rounded-l-lg border-r border-border">
        <div className="p-2 mb-2">
          <h4 className="font-semibold text-foreground px-2">{t('builder.common.categories')}</h4>
        </div>
        {summarySuggestionGroups.map((group) => {
          const Icon = icons[group.icon];
          return (
            <TabsTrigger
              key={group.category}
              value={group.category}
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="text-sm">{group.category}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="flex-1 bg-background rounded-r-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground">{t('builder.personal.suggestionsLibrary')}</h4>
          <p className="text-sm text-muted-foreground">{t('builder.personal.inspireYourself')}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {summarySuggestionGroups.map((group) => (
            <TabsContent key={group.category} value={group.category} className="m-0 space-y-4 outline-none">
              {group.suggestions.map((suggestion, sIndex) => (
                <div key={sIndex} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group">
                  <h5 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{suggestion.title}</h5>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{suggestion.content}</p>
                  <Button variant="outline" size="sm" onClick={() => onSelect(suggestion.content)} className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Check className="w-4 h-4 mr-2" />
                    {t('builder.common.useSuggestion')}
                  </Button>
                </div>
              ))}
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
};

// Step 1: Personal Info
const PersonalInfoStep = ({ data, onChange, errors, setErrors }: { data: PersonalInfo; onChange: (data: PersonalInfo) => void; errors: { [key: string]: string }; setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Vérifier que l'image est bien au format base64
        const result = reader.result as string;
        if (result && result.startsWith('data:image')) {
          // Optimiser l'image pour le PDF
          const img = new Image();
          img.onload = () => {
            // Créer un canvas pour redimensionner l'image si nécessaire
            const canvas = document.createElement('canvas');
            // Limiter la taille pour éviter les problèmes de mémoire
            const maxSize = 300;
            let width = img.width;
            let height = img.height;
            
            // Redimensionner si nécessaire
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = Math.round(height * (maxSize / width));
                width = maxSize;
              } else {
                width = Math.round(width * (maxSize / height));
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Convertir en JPEG pour réduire la taille
              const optimizedImage = canvas.toDataURL('image/jpeg', 0.8);
              onChange({ ...data, photo: optimizedImage });
            } else {
              // Fallback si le contexte n'est pas disponible
              onChange({ ...data, photo: result });
            }
          };
          img.src = result;
        } else {
          console.error('Format d\'image non supporté');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelect = (content: string) => {
    handleChange("summary", content);
    setIsOpen(false);
  };

  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.personal.title')}</h2>
        <p className="text-muted-foreground">{t('builder.personal.subtitle')}</p>
      </div>

      <div className="space-y-2 flex flex-col items-center">
        <Label htmlFor="photo">{t('builder.personal.photo')} ({t('builder.common.optional')})</Label>
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
          {data.photo ? (
            <img src={data.photo} alt="Photo de profil" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <label htmlFor="photo" className="cursor-pointer text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 py-1 px-3 rounded-full transition-colors">
            {t('builder.common.chooseFile')}
          </label>
          <span className="text-xs text-muted-foreground">
            {data.photo ? data.photo.split('/').pop()?.substring(0, 20) || t('builder.common.noFileChosen') : t('builder.common.noFileChosen')}
          </span>
          <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('builder.personal.firstName')} *</Label>
          <Input id="firstName" placeholder={t('builder.personal.firstNamePlaceholder')} value={data.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className={errors.firstName ? "border-destructive" : ""} />
{errors.firstName && <p className='text-xs text-destructive mt-1'>{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t('builder.personal.lastName')} *</Label>
          <Input id="lastName" placeholder={t('builder.personal.lastNamePlaceholder')} value={data.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className={errors.lastName ? "border-destructive" : ""} />
{errors.lastName && <p className='text-xs text-destructive mt-1'>{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('builder.personal.email')} *</Label>
          <Input id="email" type="email" placeholder={t('builder.personal.emailPlaceholder')} value={data.email} onChange={(e) => handleChange("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
{errors.email && <p className='text-xs text-destructive mt-1'>{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('builder.personal.phone')} *</Label>
          <Input id="phone" placeholder={t('builder.personal.phonePlaceholder')} value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} className={errors.phone ? "border-destructive" : ""} />
{errors.phone && <p className='text-xs text-destructive mt-1'>{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t('builder.personal.city')} *</Label>
          <Input id="city" placeholder={t('builder.personal.cityPlaceholder')} value={data.city} onChange={(e) => handleChange("city", e.target.value)} className={errors.city ? "border-destructive" : ""} />
{errors.city && <p className='text-xs text-destructive mt-1'>{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t('builder.personal.country')} *</Label>
          <Input id="country" placeholder={t('builder.personal.countryPlaceholder')} value={data.country} onChange={(e) => handleChange("country", e.target.value)} className={errors.country ? "border-destructive" : ""} />
{errors.country && <p className='text-xs text-destructive mt-1'>{errors.country}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">{t('builder.personal.summary')} ({t('builder.common.optional')})</Label>
          {isMobile ? (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t('builder.common.suggestions')}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 border-b">
                  <h4 className="font-medium text-foreground">{t('builder.common.library')}</h4>
                  <p className="text-sm text-muted-foreground">{t('builder.common.inspireYourself')}</p>
                </div>
                <div className="p-4 h-[70vh] overflow-y-auto">
                  <SuggestionUI onSelect={handleSelect} isMobile={true} />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t('builder.common.suggestions')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[700px] p-0" align="end">
                <SuggestionUI onSelect={handleSelect} isMobile={false} />
              </PopoverContent>
            </Popover>
          )}
        </div>
        <Textarea 
          id="summary" 
          placeholder={t('builder.personal.summaryPlaceholder')} 
          value={data.summary} 
          onChange={(e) => handleChange("summary", e.target.value)} 
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">{t('builder.personal.summaryTip')}</p>
      </div>
    </div>
  );
};

// Step 2: Target Job with Autocomplete
const TargetJobStep = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { t, language } = useTranslation();
  const jobTitles = getJobTitles(language);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.job.title')}</h2>
        <p className="text-muted-foreground">{t('builder.job.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <Label>{t('builder.job.label')} *</Label>
        <AutocompleteInput
          value={value}
          onChange={onChange}
          suggestions={jobTitles}
          placeholder={t('builder.job.placeholder')}
          maxSuggestions={10}
        />
      </div>

      <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        💡 {t('builder.job.tip')}
      </p>
    </div>
  );
};

// Experience Item (simplified without drag-and-drop)
const ExperienceItem = ({
  exp,
  index,
  updateExperience,
  removeExperience,
}: {
  exp: Experience;
  index: number;
  updateExperience: (id: string, field: keyof Experience, value: string | boolean) => void;
  removeExperience: (id: string) => void;
}) => {
  const { t, language } = useTranslation();
  const jobTitles = getJobTitles(language);

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{t('builder.experience.experienceNumber')} {index + 1}</h3>
        <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('builder.experience.jobTitle')} *</Label>
          <AutocompleteInput value={exp.title} onChange={(v) => updateExperience(exp.id, "title", v)} suggestions={jobTitles} placeholder={t('builder.experience.jobTitlePlaceholder')} maxSuggestions={6} />
        </div>
        <div className="space-y-2">
          <Label>{t('builder.experience.company')} *</Label>
          <Input placeholder={t('builder.experience.companyPlaceholder')} value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('builder.experience.location')}</Label>
          <Input placeholder={t('builder.experience.locationPlaceholder')} value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t('builder.experience.startDate')}</Label>
          <DateSelector value={exp.startDate} onChange={(v) => updateExperience(exp.id, "startDate", v)} />
        </div>
        <div className="space-y-2">
          <Label>{t('builder.experience.endDate')}</Label>
          <DateSelector value={exp.endDate} onChange={(v) => updateExperience(exp.id, "endDate", v)} disabled={exp.current} minDate={exp.startDate} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} className="rounded border-border" />
            {t('builder.common.current')}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('builder.experience.description')}</Label>
        <Textarea placeholder={t('builder.experience.descriptionPlaceholder')} value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={3} />
        <p className="text-xs text-muted-foreground mt-2">💡 {t('builder.experience.tip')}</p>
      </div>
    </div>
  );
};

// Step 3: Experiences (simplified without drag-and-drop)
const ExperiencesStep = ({ data, onChange }: { data: Experience[]; onChange: (data: Experience[]) => void }) => {
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" };
    onChange([...data, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.experience.title')}</h2>
        <p className="text-muted-foreground">{t('builder.experience.subtitle')}</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t('builder.common.noExperience')}</p>
          <Button onClick={addExperience}><Plus className="w-4 h-4 mr-2" />{t('builder.experience.add')}</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <ExperienceItem
              key={exp.id}
              exp={exp}
              index={index}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
            />
          ))}
          <Button variant="outline" onClick={addExperience} className="w-full"><Plus className="w-4 h-4 mr-2" />{t('builder.experience.addAnother')}</Button>
        </div>
      )}
      <p className="text-sm text-muted-foreground">💡 {t('builder.experience.noExperienceTip')}</p>
    </div>
  );

};

// Step 4: Education
const EducationStep = ({ data, onChange }: { data: Education[]; onChange: (data: Education[]) => void }) => {
  const { t, language } = useTranslation();
  const degrees = getDegrees(language);
  
  const addEducation = () => {
    onChange([...data, { id: Date.now().toString(), degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.education.title')}</h2>
        <p className="text-muted-foreground">{t('builder.education.subtitle')}</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t('builder.common.noEducation')}</p>
          <Button onClick={addEducation}><Plus className="w-4 h-4 mr-2" />{t('builder.education.add')}</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div key={edu.id} className="bg-card rounded-xl border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{t('builder.education.diplomaNumber')} {index + 1}</h3>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>{t('builder.education.degree')} *</Label>
                <AutocompleteInput value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} suggestions={degrees} placeholder={t('builder.education.degreePlaceholder')} maxSuggestions={8} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('builder.education.school')} *</Label>
                  <Input placeholder={t('builder.education.schoolPlaceholder')} value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('builder.education.location')}</Label>
                  <Input placeholder={t('builder.education.locationPlaceholder')} value={edu.location} onChange={(e) => updateEducation(edu.id, "location", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('builder.education.startYear')}</Label>
                  <YearSelector value={edu.startDate} onChange={(v) => updateEducation(edu.id, "startDate", v)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('builder.education.endYear')}</Label>
                  <YearSelector value={edu.endDate} onChange={(v) => updateEducation(edu.id, "endDate", v)} />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addEducation} className="w-full"><Plus className="w-4 h-4 mr-2" />{t('builder.education.addAnother')}</Button>
        </div>
      )}
    </div>
  );
};

// Step 5: Skills
const SkillsStep = ({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) => {
  const { t, language } = useTranslation();
  const allSkills = getAllSkills(language);
  const [inputValue, setInputValue] = useState("");
  const flatSkillList = allSkills.flatMap(cat => cat.skills);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !data.includes(trimmedSkill)) {
      onChange([...data, trimmedSkill]);
    }
    setInputValue("");
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.skills.title')}</h2>
        <p className="text-muted-foreground">{t('builder.skills.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <Label>{t('builder.common.typeToAdd')}</Label>
        <AutocompleteInput value={inputValue} onChange={setInputValue} onSelect={addSkill} suggestions={flatSkillList} placeholder={t('builder.skills.placeholder')} maxSuggestions={10} />
      </div>

      {data.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-sm font-medium text-foreground mb-3">{t('builder.common.selectedSkills')} ({data.length})</p>
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <button key={skill} onClick={() => removeSkill(skill)} className="px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-colors">
                {skill}<Trash2 className="w-3 h-3 text-primary-foreground/70" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground font-medium">{t('builder.skills.suggestionsCategory')}</p>
        <Accordion type="multiple" className="w-full">
          {allSkills.map((category) => (
            <AccordionItem key={category.category} value={category.category}>
              <AccordionTrigger className="text-sm font-semibold text-foreground">{category.category}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {category.skills.map((skill) => (
                    <button 
                      key={skill} 
                      onClick={() => addSkill(skill)} 
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
                        data.includes(skill) 
                          ? "bg-primary/10 text-primary cursor-default" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                      disabled={data.includes(skill)}
                    >
                      {data.includes(skill) ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {skill}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

// Step 6: Template Selection
const TemplateStep = ({ value, onChange, onNext }: { value: string; onChange: (value: string) => void; onNext?: () => void }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  // Filtrer pour n'afficher que les modèles avec des templates PDF fonctionnels
  const availableTemplates = templateInfoBase.filter(template => 
    ['professional', 'creative', 'minimal', 'modern', 'elegant', 'bold', 'gradient'].includes(template.id)
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.template.title')}</h2>
        <p className="text-muted-foreground">{t('builder.template.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              if (value === template.id && onNext) {
                // Si déjà sélectionné, avancer à l'étape suivante
                onNext();
              } else {
                // Sinon, sélectionner le template
                onChange(template.id);
              }
            }}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all text-left",
              value === template.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/50"
            )}
          >
            {value === template.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                {t('builder.template.selected')}
              </div>
            )}
            
            <div className={`h-32 rounded-lg bg-gradient-to-br ${template.color} mb-3`} />
            
            <h3 className="font-semibold text-foreground mb-1">{t(template.nameKey as any)}</h3>
            <p className="text-sm text-muted-foreground">{t(template.descKey as any)}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {template.recommended.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 7: Final Preview
const FinalPreviewStep = ({ data, onStartAnalysis, onDownload, previewRef, pdfTranslations }: { data: CVData; onStartAnalysis: () => void; onDownload: () => void; previewRef: React.RefObject<HTMLDivElement>; pdfTranslations: any }) => {
  const TemplateComponent = templateComponents[data.template as keyof typeof templateComponents] || templateComponents.professional;

  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('builder.preview.title')}</h2>
        <p className="text-muted-foreground">{t('builder.preview.subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg md:hidden flex items-center gap-3 text-sm">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="flex-1 text-blue-700 dark:text-blue-300">
            <span className="font-medium">Astuce :</span> Glissez vers le bas pour fermer l'aperçu
          </div>
        </div>
        <PDFPreview data={data} translations={pdfTranslations} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={onStartAnalysis} className="shadow-lg bg-gradient-to-r from-blue-bright to-primary text-white animate-pulse-slow">
          <Zap className="w-5 h-5 mr-2" />
          {t('builder.preview.analyze')}
        </Button>
        <Button size="lg" variant="outline" onClick={onDownload}>
          <Download className="w-5 h-5 mr-2" />
          {t('builder.preview.download')}
        </Button>
      </div>
    </div>
  );
};

// Main Builder Page
const BuilderPage = () => {
  const { t } = useTranslation();
  
  useSEO({
    title: 'Créer mon CV professionnel - Studyia Career | Générateur de CV gratuit',
    description: 'Créez votre CV professionnel en quelques minutes avec notre générateur guidé. Choisissez un template, remplissez vos informations et téléchargez votre CV en PDF. Gratuit et facile à utiliser.',
    keywords: 'créer CV, générateur CV, CV en ligne, faire un CV, CV gratuit, template CV, modèle CV professionnel',
    canonical: 'https://career.studyia.net/builder',
    structuredData: getWebPageSchema({
      name: 'Créateur de CV Professionnel',
      description: 'Outil de création de CV professionnel guidé étape par étape',
      url: 'https://career.studyia.net/builder'
    })
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  
  // Préparer les traductions pour les PDFs
  const pdfTranslations = {
    profile: t('cvLabels.profile'),
    experience: t('cvLabels.experience'),
    education: t('cvLabels.education'),
    skills: t('cvLabels.skills'),
    contact: t('cvLabels.contact'),
    present: t('cvLabels.present'),
    start: t('cvLabels.start'),
    end: t('cvLabels.end'),
    yourName: t('cvLabels.yourName'),
    jobTitle: t('cvLabels.jobTitle'),
    degree: t('cvLabels.degree'),
    company: t('cvLabels.company')
  };
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [suggestedCvData, setSuggestedCvData] = useState<CVData | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isAIPayment, setIsAIPayment] = useState(false);
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Utiliser le hook pour sauvegarder et restaurer la position de défilement
  const { clearSavedPosition } = useScrollPosition('builder-page', [currentStep, cvData]);

  const handleDownload = async () => {
    // Afficher le dialogue de paiement
    setIsAIPayment(false); // Paiement pour CV standard
    setPaymentModalOpen(true);
  };
  
  // Fonction pour gérer l'annulation du paiement (sans téléchargement)
  const handlePaymentCancel = () => {
    setPaymentModalOpen(false);
  };
  
  const navigate = useNavigate();

  // Fonction pour gérer la fermeture du dialogue de paiement avec téléchargement
  const handlePaymentClose = () => {
    setPaymentModalOpen(false);
    
    // Générer le PDF après la fermeture du dialogue
    toast({ 
      title: t('common.loading'), 
      description: t('builder.preview.generating')
    });

    try {
      generatePDF(cvData, pdfTranslations);
      toast({ 
        title: t('builder.preview.downloadSuccess'), 
        description: t('builder.preview.downloadSuccessDesc')
      });
      
      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: t('errors.pdfError'),
        description: t('builder.preview.downloadError'),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Essayer de charger depuis location.state d'abord
    let dataToLoad = location.state?.uploadedData;
    
    // Si pas de données dans location.state, essayer de charger depuis localStorage
    if (!dataToLoad) {
      const storedData = localStorage.getItem('cv_data');
      if (storedData) {
        try {
          dataToLoad = JSON.parse(storedData);
          // Nettoyer localStorage après chargement pour éviter de recharger à chaque fois
          localStorage.removeItem('cv_data');
        } catch (e) {
          console.error('Error parsing stored CV data:', e);
        }
      }
    }
    
    // Si des données ont été trouvées, les charger
    if (dataToLoad) {
      const data = dataToLoad;
      const newCVData = { ...initialCVData };

      if (data.personalInfo) newCVData.personalInfo = { ...newCVData.personalInfo, ...data.personalInfo };
      if (data.targetJob) newCVData.targetJob = data.targetJob;
      if (data.experiences) newCVData.experiences = data.experiences.map((exp: any, index: number) => ({ id: Date.now().toString() + index, ...exp, current: false, description: exp.description || '' }));
      if (data.education) newCVData.education = data.education.map((edu: any, index: number) => ({ id: Date.now().toString() + index + 100, ...edu, description: edu.description || '' }));
      if (data.skills) newCVData.skills = [...new Set(data.skills)] as string[];

      setCVData(newCVData);
      toast({
        title: t('builder.common.importSuccess'),
        description: t('builder.common.importSuccessDesc'),
      });
    }
  }, [location.state, toast]);
  
  const TemplateComponent = templateComponents[cvData.template as keyof typeof templateComponents] || templateComponents.professional;

  const handleApplySuggestion = (action: { type: 'REPLACE' | 'ADD'; payload: any }) => {
    const { type, payload } = action;
    let newCVData = { ...cvData };

    if (type === 'REPLACE') {
      if (payload.field in newCVData) {
        (newCVData as any)[payload.field] = payload.value;
      } else if (payload.field in newCVData.personalInfo) {
        (newCVData.personalInfo as any)[payload.field] = payload.value;
      }
    } else if (type === 'ADD') {
      if (payload.field === 'experiences' && newCVData.experiences.length > 0) {
        const newExperiences = [...newCVData.experiences];
        newExperiences[0].description = `${newExperiences[0].description}\n${payload.value}`.trim();
        newCVData = { ...newCVData, experiences: newExperiences };
      } else if (payload.field === 'skills') {
        const newSkills = [...newCVData.skills];
        payload.value.forEach((skill: string) => {
          if (!newSkills.includes(skill)) {
            newSkills.push(skill);
          }
        });
        newCVData = { ...newCVData, skills: newSkills };
      }
    }

    setCVData(newCVData);
    toast({
      title: t('builder.common.appliedSuccess'),
      description: t('builder.common.appliedSuccessDesc'),
    });
  };

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handlePreviewAllSuggestions = async () => {
    try {
      setIsOptimizing(true);

      const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!openRouterApiKey) {
        throw new Error("La clé d'API OpenRouter n'est pas configurée.");
      }

      const prompt = `
        Vous êtes un coach de carrière expert et un spécialiste de l'optimisation de CV. Votre tâche est d'analyser un CV fourni au format JSON et de renvoyer une version optimisée de celui-ci. Vous devez retourner UNIQUEMENT un objet JSON valide, sans aucun texte ou formatage supplémentaire.

        Voici les règles d'optimisation :
        1.  **Résumé (summary)** : S'il est court, développez-le pour être percutant. S'il est absent, créez-en un basé sur l'expérience la plus récente.
        2.  **Titre du poste (targetJob)** : Générez UN SEUL intitulé de poste concis et logique qui correspond parfaitement au profil (par exemple, 'Développeur Full Stack', 'Chef de Projet', 'Serveur'). NE PAS inclure plusieurs titres ou une liste de compétences ici.
        3.  **Expériences (experiences)** : Pour chaque expérience, la description doit être une chaîne de caractères unique contenant une liste de missions. Chaque mission doit commencer par '• ' et être séparée par un saut de ligne (\n). Ne retournez pas un paragraphe unique.
        4.  **Compétences (skills)** : Si la liste est courte, ajoutez des compétences pertinentes en fonction du poste cible.
        5.  **Structure JSON** : Le JSON retourné doit avoir EXACTEMENT la même structure que le JSON d'entrée, y compris le champ 'template'.
        6.  **Qualité du texte** : Générez un texte propre en français, sans aucun caractère étrange ou problème d'encodage. Utilisez l'encodage UTF-8 standard.

        Voici le CV à optimiser :
        ${JSON.stringify(cvData, null, 2)}
      `;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        
        // Handle 401 Unauthorized errors with user-friendly message
        if (response.status === 401) {
          throw new Error(t('analysis.apiKeyError'));
        }
        
        throw new Error(`Erreur de l'API OpenRouter: ${response.status} - ${errorBody}`);
      }

      const openRouterResponse = await response.json();
      const rawContent = openRouterResponse.choices[0].message.content;
      
      try {
        // Extraire le JSON du contenu brut, qui peut être entouré de ```json ... ```
        const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
        let optimizedCVString = jsonMatch ? jsonMatch[1] : rawContent;
        
        // Remove control characters that cause JSON parsing errors
        optimizedCVString = optimizedCVString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        
        const optimizedCV = JSON.parse(optimizedCVString);
        
        // Assurer que le template original est conservé
        optimizedCV.template = cvData.template;

        setSuggestedCvData(optimizedCV);
        setIsComparing(true);
        setAnalysisModalOpen(false);
        
        toast({
          title: t('builder.ai.previewReady'),
          description: t('builder.ai.compareVersions'),
        });
      } catch (e) {
        console.error("Erreur lors de l'analyse du JSON retourné par l'IA:", e);
        throw new Error("La réponse de l'IA n'est pas un JSON valide.");
      }

    } catch (error) {
      console.error('Erreur lors de l\'optimisation du CV:', error);
      toast({
        title: t('builder.ai.optimizationError'),
        description: (error as Error).message || t('builder.ai.optimizationErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAcceptSuggestion = () => {
    // Afficher le dialogue de paiement pour CV IA
    setIsAIPayment(true);
    setPaymentModalOpen(true);
  };
  
  // Fonction pour gérer la fermeture du dialogue de paiement pour CV IA
  const handleAIPaymentClose = () => {
    setPaymentModalOpen(false);
    
    if (suggestedCvData) {
      setCVData(suggestedCvData);
      toast({
        title: t('builder.ai.changesApplied'),
        description: t('builder.ai.changesAppliedDesc'),
        className: "bg-green-100 border-green-300 text-green-800",
      });
      
      // Générer le PDF après la fermeture du dialogue
      setTimeout(() => {
        try {
          generatePDF(suggestedCvData, pdfTranslations);
          toast({ 
            title: t('builder.preview.downloadSuccess'), 
            description: t('builder.preview.downloadSuccessDesc')
          });
        } catch (error) {
          console.error("Erreur lors de la génération du PDF:", error);
          toast({
            title: t('errors.pdfError'),
            description: t('builder.preview.downloadError'),
            variant: "destructive",
          });
        }
      }, 1000);
    }
    
    setIsComparing(false);
    setSuggestedCvData(null);
  };

  const handleRejectSuggestion = () => {
    setIsComparing(false);
    setSuggestedCvData(null);
    toast({
      title: t('builder.ai.changesCanceled'),
      description: t('builder.ai.changesCanceledDesc'),
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors: { [key: string]: string } = {};
      if (!cvData.personalInfo.firstName) newErrors.firstName = t('errors.firstNameRequired');
      if (!cvData.personalInfo.lastName) newErrors.lastName = t('errors.lastNameRequired');
      if (!cvData.personalInfo.email) newErrors.email = t('errors.emailRequired');
      if (!cvData.personalInfo.phone) newErrors.phone = t('errors.phoneRequired');
      if (!cvData.personalInfo.city) newErrors.city = t('errors.cityRequired');
      if (!cvData.personalInfo.country) newErrors.country = t('errors.countryRequired');

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    
    handleNextStep();
  };
  
  const handleNextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep + 1);
    // Effacer la position sauvegardée lors du changement d'étape
    clearSavedPosition();
  };
  
  const handlePreviousStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep - 1);
    // Effacer la position sauvegardée lors du changement d'étape
    clearSavedPosition();
  };
  
  // Fonction pour gérer le changement direct d'étape
  const handleStepChange = (stepId: number) => {
    window.scrollTo(0, 0);
    setCurrentStep(stepId);
    // Effacer la position sauvegardée lors du changement d'étape
    clearSavedPosition();
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep data={cvData.personalInfo} onChange={(data) => setCVData({ ...cvData, personalInfo: data })} errors={errors} setErrors={setErrors} />;
      case 2: return <TargetJobStep value={cvData.targetJob} onChange={(value) => setCVData({ ...cvData, targetJob: value })} />;
      case 3: return <ExperiencesStep data={cvData.experiences} onChange={(data) => setCVData({ ...cvData, experiences: data })} />;
      case 4: return <EducationStep data={cvData.education} onChange={(data) => setCVData({ ...cvData, education: data })} />;
      case 5: return <SkillsStep data={cvData.skills} onChange={(data) => setCVData({ ...cvData, skills: data })} />;
      case 6: return <TemplateStep value={cvData.template} onChange={(value) => setCVData({ ...cvData, template: value })} onNext={handleNext} />;
      case 7: return <FinalPreviewStep data={cvData} onStartAnalysis={() => setAnalysisModalOpen(true)} onDownload={handleDownload} previewRef={cvPreviewRef} pdfTranslations={pdfTranslations} />;
      default: return null;
    }
  };

  // Create steps with translations
  const steps = stepsBase.map(step => ({
    ...step,
    title: t(step.titleKey as any)
  }));
  
  const progress = (currentStep / steps.length) * 100;

  const renderAnalysisView = () => {
    if (isMobile) {
      return (
        <Drawer open={isAnalysisModalOpen} onOpenChange={setAnalysisModalOpen}>
          <DrawerContent className="h-[95vh] bg-gray-50 dark:bg-gray-900">
            <CVAnalysis cvData={cvData} onApplySuggestion={handleApplySuggestion} onPreviewAllSuggestions={handlePreviewAllSuggestions} isOptimizing={isOptimizing} />
          </DrawerContent>
        </Drawer>
      );
    }
    return (
      <Sheet open={isAnalysisModalOpen} onOpenChange={setAnalysisModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl p-0">
          <CVAnalysis cvData={cvData} onApplySuggestion={handleApplySuggestion} onPreviewAllSuggestions={handlePreviewAllSuggestions} isOptimizing={isOptimizing} />
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {renderAnalysisView()}
      
      <PaymentDialog 
        open={isPaymentModalOpen} 
        onOpenChange={setPaymentModalOpen} 
        onClose={isAIPayment ? handleAIPaymentClose : handlePaymentClose}
        onCancel={handlePaymentCancel}
        isAIGenerated={isAIPayment}
      />

      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <Eye className="w-5 h-5 mr-2" />
              Voir mon CV
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh]">
            <div className="p-4 overflow-y-auto">
              <div className="transform scale-[0.8] origin-top mx-auto">
                <TemplateComponent data={cvData} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" /><span className="hidden sm:inline">Retour</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Studyia Career</span>
            </div>
                      </div>
        </div>
      </header>

      <div className="bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{t('builder.common.step')} {currentStep} {t('builder.common.of')} {stepsBase.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% {t('builder.common.complete')}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-blue-bright" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>
      </div>

      <div className="bg-background border-b border-border overflow-x-auto">
        <div className="container py-4">
          <div className="flex items-center justify-between min-w-max gap-2">
            {steps.map((step) => (
              <button key={step.id} onClick={() => handleStepChange(step.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${currentStep === step.id ? "bg-primary text-primary-foreground" : currentStep > step.id ? "bg-success/10 text-success" : "text-muted-foreground hover:bg-muted"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === step.id ? "bg-primary-foreground/20" : currentStep > step.id ? "bg-success/20" : "bg-muted"}`}>
                  {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isOptimizing ? (
        <div className="container py-16 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
            </div>
            <h3 className="text-xl font-bold">{t('builder.ai.optimizing')}</h3>
            <p className="text-muted-foreground">{t('builder.ai.analyzingDesc')}</p>
          </div>
        </div>
      ) : isComparing && suggestedCvData ? (
        <div className="container py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t('builder.ai.optimizedTitle')}</h2>
            <p className="text-muted-foreground mt-2">{t('builder.ai.optimizedDesc')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="transition-all duration-300 hover:opacity-80">
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">{t('builder.ai.currentVersion')}</span>
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-md transition-transform">
                <PDFPreview data={cvData} translations={pdfTranslations} />
              </div>
            </div>
            <div className="transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-4 gap-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-blue-600 rounded-full text-sm font-medium text-white shadow-md">{t('builder.ai.aiOptimizedVersion')}</span>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-lg blur-sm opacity-75 animate-pulse"></div>
                <div className="relative border-2 border-primary rounded-lg p-2 bg-white dark:bg-gray-800 shadow-2xl">
                  <PDFPreview data={suggestedCvData} translations={pdfTranslations} />
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">{t('builder.ai.recommended')}</div>
                
                {/* Indicateurs d'améliorations - Version desktop */}
                <div className="absolute -right-3 top-1/4 transform translate-x-full hidden lg:block">
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3 shadow-lg mb-3 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-700 dark:text-green-300 text-sm">{t('builder.ai.improvedSummary')}</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">{t('builder.ai.improvedSummaryDesc')}</p>
                  </div>
                  
                  <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3 shadow-lg mb-3 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-700 dark:text-blue-300 text-sm">{t('builder.ai.enrichedExperiences')}</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{t('builder.ai.enrichedExperiencesDesc')}</p>
                  </div>
                  
                  <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg p-3 shadow-lg max-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">{t('builder.ai.optimizedSkills')}</span>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400">{t('builder.ai.optimizedSkillsDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Indicateurs d'améliorations - Version mobile */}
          <div className="mt-8 lg:hidden">
            <h3 className="text-lg font-bold text-center mb-4">{t('builder.ai.improvementsByAI')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-700 dark:text-green-300">{t('builder.ai.improvedSummary')}</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">{t('builder.ai.improvedSummaryDesc')}</p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">{t('builder.ai.enrichedExperiences')}</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">{t('builder.ai.enrichedExperiencesDesc')}</p>
              </div>
              
              <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">{t('builder.ai.optimizedSkills')}</span>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">{t('builder.ai.optimizedSkillsDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-6">{t('builder.ai.aiImprovedDesc')}</p>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-4 z-50">
            <div className="container flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button variant="outline" size="lg" onClick={handleRejectSuggestion} className="w-full sm:w-auto">
                <ArrowLeft className="w-5 h-5 mr-2" /> {t('builder.ai.keepMyVersion')}
              </Button>
              <Button size="lg" onClick={handleAcceptSuggestion} className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-lg">
                <Check className="w-5 h-5 mr-2" /> {t('builder.ai.adoptOptimized')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <motion.div key={currentStep} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-card rounded-2xl border border-border p-6 md:p-8 pb-24 lg:pb-8">
                {renderCurrentStep()}
                {currentStep < 7 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                      <ChevronLeft className="w-4 h-4 mr-2" />{t('common.previous')}
                    </Button>
                    <Button onClick={handleNext}>
                      {currentStep === 6 ? t('builder.preview.title') : t('common.next')}<ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{t('builder.preview.livePreview')}</h3>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">{t('builder.preview.updateAuto')}</span>
                </div>
                <div className="transform scale-[0.85] origin-top">
                  <TemplateComponent data={cvData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
