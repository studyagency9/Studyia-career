import { Mail, Phone, MapPin, Briefcase, GraduationCap, Wrench, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/i18nContext";

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    summary: string;
    photo: string;
  };
  targetJob: string;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  template: string;
}

interface CVTemplateProps {
  data: CVData;
  className?: string;
}

// Template 1: Professional Modern
export const ProfessionalTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-bright p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            {targetJob && <p className="text-primary-foreground/80 font-medium">{targetJob}</p>}
            {(personalInfo.city || personalInfo.country) && (
              <p className="text-sm text-primary-foreground/60 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 text-sm">
        {/* Contact */}
        {(personalInfo.email || personalInfo.phone) && (
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {personalInfo.phone}
              </span>
            )}
          </div>
        )}

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h3 className="font-semibold text-foreground border-b-2 border-primary pb-1 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> {t('cvLabels.profile')}
            </h3>
            <p className="text-muted-foreground">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground border-b-2 border-primary pb-1 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> {t('cvLabels.experience')}
            </h3>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-muted">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{exp.title || t('cvLabels.jobTitle')}</p>
                      <p className="text-primary text-xs">{exp.company || t('cvLabels.company')}</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="text-muted-foreground mt-2 text-xs list-disc list-inside space-y-1">
                      {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground border-b-2 border-primary pb-1 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" /> {t('cvLabels.education')}
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-muted">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{edu.degree || t('cvLabels.degree')}</p>
                      <p className="text-primary text-xs">{edu.school || t('cvLabels.institution')}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground border-b-2 border-primary pb-1 mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" /> {t('cvLabels.skills')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Template 2: Creative
export const CreativeTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-purple-600 to-pink-500 p-6 text-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-3 overflow-hidden">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <h2 className="text-lg font-bold">{fullName}</h2>
            {targetJob && <p className="text-white/80 text-sm">{targetJob}</p>}
          </div>

          {/* Contact */}
          <div className="space-y-2 text-sm mb-6">
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-white/90">
                <Mail className="w-4 h-4" />
                <span className="text-xs break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-white/90">
                <Phone className="w-4 h-4" />
                <span className="text-xs">{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">{t('cvLabels.skills')}</h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-white/20 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 space-y-5 text-sm">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h3 className="font-bold text-foreground mb-2 text-purple-600 uppercase tracking-wider text-xs">{t('cvLabels.profile')}</h3>
              <p className="text-muted-foreground">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h3 className="font-bold text-foreground mb-3 text-purple-600 uppercase tracking-wider text-xs">{t('cvLabels.experience')}</h3>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-3 border-purple-500 pl-4">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div>
                        <p className="font-semibold text-foreground">{exp.title || t('cvLabels.title')}</p>
                        <p className="text-purple-600 text-xs font-medium">{exp.company || t('cvLabels.company')}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                      </span>
                    </div>
                    {exp.description && <ul className="text-muted-foreground text-xs mt-2 list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 className="font-bold text-foreground mb-3 text-purple-600 uppercase tracking-wider text-xs">{t('cvLabels.education')}</h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-3 border-pink-500 pl-4">
                    <p className="font-semibold text-foreground">{edu.degree || t('cvLabels.degree')}</p>
                    <p className="text-pink-600 text-xs font-medium">{edu.school || t('cvLabels.institution')}</p>
                    <span className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 3: Minimal Classic
export const MinimalTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden p-6", className)}>
      {/* Header */}
      <div className="text-center border-b-2 border-foreground pb-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-wide uppercase">{fullName}</h2>
        {targetJob && <p className="text-muted-foreground mt-1">{targetJob}</p>}
        
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-muted-foreground">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && <span>•</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
          )}
        </div>
      </div>

      <div className="space-y-5 text-sm">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-2">{t('cvLabels.profile')}</h3>
            <p className="text-muted-foreground">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-3">{t('cvLabels.experience')}</h3>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-foreground">{exp.title || t('cvLabels.jobTitle')}</span>
                    <span className="text-xs text-muted-foreground italic">
                      {exp.startDate || t('cvLabels.start')} – {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  {exp.description && <ul className="text-muted-foreground text-xs mt-2 list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-3">{t('cvLabels.education')}</h3>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-foreground">{edu.degree || t('cvLabels.degree')}</span>
                    <span className="text-xs text-muted-foreground italic">{edu.startDate || t('cvLabels.start')} – {edu.endDate || t('cvLabels.end')}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{edu.school}{edu.location && `, ${edu.location}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-2">{t('cvLabels.skills')}</h3>
            <p className="text-muted-foreground text-xs">{skills.join(" • ")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Template 4: Executive
export const ExecutiveTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-slate-800 p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-lg bg-amber-500 flex items-center justify-center text-2xl font-bold text-slate-800 overflow-hidden">
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            {targetJob && <p className="text-amber-400 font-medium mt-1">{targetJob}</p>}
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/70">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5 text-sm">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="text-muted-foreground italic">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            {/* Experience */}
            {experiences.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-amber-500" />
                  {t('cvLabels.experience').toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <div>
                          <p className="font-semibold text-foreground">{exp.title || t('cvLabels.jobTitle')}</p>
                          <p className="text-amber-600 dark:text-amber-400 text-xs font-medium">{exp.company}</p>
                        </div>
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                          {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                        </span>
                      </div>
                      {exp.description && <ul className="text-muted-foreground text-xs mt-2 list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-amber-500" />
                  {t('cvLabels.education').toUpperCase()}
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{edu.degree}</p>
                        <p className="text-muted-foreground text-xs">{edu.school}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{edu.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills sidebar */}
          {skills.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg">
              <h3 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">{t('cvLabels.skillsKey')}</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground text-xs">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 5: Fresh Graduate
export const FreshTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <h2 className="text-2xl font-bold">{fullName}</h2>
          {targetJob && <p className="text-white/90 mt-1">{targetJob}</p>}
          
          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {personalInfo.email && (
              <span className="bg-white/20 px-3 py-1 rounded-full">{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="bg-white/20 px-3 py-1 rounded-full">{personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5 text-sm">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="text-center">
            <p className="text-muted-foreground italic max-w-lg mx-auto">"{personalInfo.summary}"</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="text-center">
            <h3 className="inline-block font-semibold text-foreground mb-3 px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs uppercase">
              {t('cvLabels.mySkills')}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-muted text-foreground text-xs rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education - priorité pour jeune diplômé */}
        {education.length > 0 && (
          <div>
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 text-center">🎓 {t('cvLabels.education')}</h3>
            <div className="space-y-3 max-w-md mx-auto">
              {education.map((edu) => (
                <div key={edu.id} className="bg-muted/50 p-3 rounded-lg text-center">
                  <p className="font-medium text-foreground">{edu.degree}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs">{edu.school}</p>
                  <span className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 text-center">💼 {t('cvLabels.experience')}</h3>
            <div className="space-y-3 max-w-md mx-auto">
              {experiences.map((exp) => (
                <div key={exp.id} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{exp.title}</p>
                      <p className="text-muted-foreground text-xs">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                    </span>
                  </div>
                  {exp.description && <ul className="text-muted-foreground text-xs mt-2 list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Template 6: Modern
export const ModernTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-slate-100 dark:bg-slate-800 p-6">
          {personalInfo.photo && (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white dark:border-slate-700 shadow-lg">
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            {targetJob && <p className="text-primary text-sm font-medium">{targetJob}</p>}
          </div>

          <div className="space-y-4 mt-6 text-xs">
            <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.contact')}</h3>
            {personalInfo.email && <p className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3 h-3" /> {personalInfo.email}</p>}
            {personalInfo.phone && <p className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3 h-3" /> {personalInfo.phone}</p>}
            {(personalInfo.city || personalInfo.country) && <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3 h-3" /> {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</p>}
          </div>

          {skills.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.skills')}</h3>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground text-xs">
                {skills.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 p-6 space-y-5">
          {personalInfo.summary && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">{t('cvLabels.profile')}</h3>
              <p className="text-sm text-muted-foreground">{personalInfo.summary}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-3">{t('cvLabels.experience')}</h3>
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>{exp.company}</span>
                      <span>{exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}</span>
                    </div>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-3">{t('cvLabels.education')}</h3>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id}>
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{edu.school}</span>
                      <span>{edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 7: Academic
export const AcademicTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden p-8 font-serif", className)}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
        {targetJob && <p className="text-lg text-muted-foreground mt-1">{targetJob}</p>}
        <p className="text-sm text-muted-foreground mt-2">
          {[personalInfo.email, personalInfo.phone, [personalInfo.city, personalInfo.country].filter(Boolean).join(", ")].filter(Boolean).join(' | ')}
        </p>
      </div>

      <div className="space-y-6 text-sm">
        {personalInfo.summary && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.profile')}</h3>
            <p className="text-muted-foreground text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.education')}</h3>
            {education.map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between font-bold">
                  <span>{edu.degree}</span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="italic text-muted-foreground">{edu.school}, {edu.location}</div>
              </div>
            ))}
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.experience')}</h3>
            {experiences.map(exp => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between font-bold">
                  <span>{exp.title}</span>
                  <span>{exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}</span>
                </div>
                <div className="italic text-muted-foreground">{exp.company}, {exp.location}</div>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mt-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-1 mb-2">{t('cvLabels.skills')}</h3>
            <p className="text-muted-foreground">{skills.join('; ')}.</p>
          </section>
        )}
      </div>
    </div>
  );
};

// Template 8: Zurich (Two-Column Minimalist)
export const ZurichTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden font-sans", className)}>
      <div className="grid grid-cols-12">
        {/* Sidebar */}
        <div className="col-span-4 bg-slate-50 dark:bg-slate-800 p-6">
          {personalInfo.photo && (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white dark:border-slate-700 shadow-md">
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] mb-2">{t('cvLabels.contact')}</h3>
              {personalInfo.email && <p className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3 h-3 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></p>}
              {personalInfo.phone && <p className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3 h-3 flex-shrink-0" /> {personalInfo.phone}</p>}
              {(personalInfo.city || personalInfo.country) && <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3 h-3 flex-shrink-0" /> {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</p>}
            </div>

            {skills.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] mb-2">{t('cvLabels.skills')}</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-8 p-6 space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
            {targetJob && <p className="text-lg text-primary font-medium">{targetJob}</p>}
          </div>

          {personalInfo.summary && (
            <section>
              <p className="text-sm text-muted-foreground italic">{personalInfo.summary}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-1 mb-3">{t('cvLabels.experience')}</h3>
              <div className="space-y-4 text-sm">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-primary">{exp.company}</span>
                      <span>{exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}</span>
                    </div>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-1 mb-3">{t('cvLabels.education')}</h3>
              <div className="space-y-3 text-sm">
                {education.map(edu => (
                  <div key={edu.id}>
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{edu.school}</span>
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 9: Tokyo (Asymmetric Dark)
export const TokyoTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 overflow-hidden font-sans", className)}>
      <div className="p-8">
        <div className="flex items-center gap-6 mb-6">
          {personalInfo.photo && (
            <div className="w-24 h-24 rounded-md overflow-hidden border-2 border-cyan-400">
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 tracking-wider">{fullName}</h2>
            {targetJob && <p className="text-lg text-white/80">{targetJob}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {personalInfo.summary && (
              <section>
                <p className="text-sm text-white/70">{personalInfo.summary}</p>
              </section>
            )}
            {experiences.length > 0 && (
              <section>
                <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs mb-3">{t('cvLabels.experience')}</h3>
                <div className="space-y-4 text-sm relative border-l-2 border-gray-600 pl-6">
                  {experiences.map(exp => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-[33px] top-1 w-4 h-4 bg-gray-800 border-2 border-cyan-400 rounded-full" />
                      <p className="font-semibold text-white">{exp.title}</p>
                      <p className="text-xs text-white/50 mb-1">{exp.company} | {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}</p>
                      <ul className="text-xs text-white/70 list-disc list-inside space-y-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs mb-3">{t('cvLabels.contact')}</h3>
              <div className="space-y-1 text-sm text-white/70">
                {personalInfo.email && <p>{personalInfo.email}</p>}
                {personalInfo.phone && <p>{personalInfo.phone}</p>}
                {(personalInfo.city || personalInfo.country) && <p>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</p>}
              </div>
            </section>
            {education.length > 0 && (
              <section>
                <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs mb-3">{t('cvLabels.education')}</h3>
                <div className="space-y-2 text-sm">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <p className="font-semibold text-white">{edu.degree}</p>
                      <p className="text-xs text-white/50">{edu.school} ({edu.endDate})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {skills.length > 0 && (
              <section>
                <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs mb-3">{t('cvLabels.skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => <span key={skill} className="text-xs bg-gray-700 text-cyan-300 px-2 py-1 rounded">{skill}</span>)}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 10: Milan (Elegant Serif)
export const MilanTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden p-8 font-serif text-gray-800", className)}>
      <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-4xl font-bold tracking-tight">{fullName}</h1>
        {targetJob && <h2 className="text-lg text-gray-600 font-medium mt-1">{targetJob}</h2>}
      </header>

      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          {personalInfo.summary && (
            <section>
              <p className="text-sm text-gray-700 text-center italic">{personalInfo.summary}</p>
            </section>
          )}
          {experiences.length > 0 && (
            <section>
              <h3 className="text-base font-bold uppercase tracking-widest text-gray-500 mb-3">{t('cvLabels.experience')}</h3>
              <div className="space-y-4 text-sm">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-gray-900">{exp.title}</h4>
                      <p className="text-xs text-gray-500">{exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}</p>
                    </div>
                    <p className="text-sm text-gray-700 italic">{exp.company}</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 mt-1">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="col-span-4 space-y-6 border-l border-gray-200 pl-8">
          {personalInfo.photo && (
            <div className="w-full overflow-hidden mb-4">
              <img src={personalInfo.photo} alt={fullName} className="w-full h-auto object-cover" />
            </div>
          )}
          <section>
            <h3 className="text-base font-bold uppercase tracking-widest text-gray-500 mb-2">{t('cvLabels.contact')}</h3>
            <div className="text-sm space-y-1 text-gray-700">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {(personalInfo.city || personalInfo.country) && <p>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</p>}
            </div>
          </section>
          {education.length > 0 && (
            <section>
              <h3 className="text-base font-bold uppercase tracking-widest text-gray-500 mb-2">{t('cvLabels.education')}</h3>
              <div className="text-sm space-y-2">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-700">{edu.school}, {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h3 className="text-base font-bold uppercase tracking-widest text-gray-500 mb-2">{t('cvLabels.skills')}</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                {skills.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
};

// Template 11: Stockholm (Modern Blue)
export const StockholmTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');

  return (
    <div className={cn("bg-white min-h-[1000px] w-full font-sans text-slate-800", className)}>
      {/* Header */}
      <div className="bg-blue-50/80 py-10 px-8 text-center border-b-4 border-slate-800/10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wide uppercase mb-2">{fullName}</h1>
        {targetJob && <p className="text-xl text-blue-600 font-semibold tracking-widest uppercase">{targetJob}</p>}
      </div>

      <div className="flex">
        {/* Colonne Gauche (35%) */}
        <div className="w-[35%] p-8 pr-4 border-r-2 border-slate-100">
          
          {/* Contact */}
          {(personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.country) && (
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
                <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
                {t('cvLabels.contact') || 'CONTACT'}
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-600">
                {personalInfo.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <MapPin className="w-3 h-3" />
                    </div>
                    <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
                <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
                {t('cvLabels.education') || 'FORMATION'}
              </h3>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-slate-800 text-sm">{edu.degree}</p>
                    <p className="text-xs text-blue-500 italic mb-1">{edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">{edu.school}</p>
                    <p className="text-xs text-slate-500">{edu.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
                <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
                {t('cvLabels.skills') || 'COMPETENCE'}
              </h3>
              <ul className="space-y-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-start text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Langues (Placeholder si non dispo dans les données mais demandé par l'image) */}
          <div className="mb-10">
            <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
              <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
              {t('cvLabels.languages') === 'cvLabels.languages' ? (t('language') === 'en' ? 'LANGUAGES' : 'LANGUES') : t('cvLabels.languages')}
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span className="font-semibold">Français :</span> Très Bien
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span className="font-semibold">Anglais :</span> Bien
              </li>
            </ul>
          </div>
        </div>

        {/* Colonne Droite (65%) */}
        <div className="w-[65%] p-8 pl-6">
          
          {/* Profil */}
          {personalInfo.summary && (
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
                <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
                {t('cvLabels.profile') || 'PROFIL'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Expérience Professionnelle */}
          {experiences.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-6 border-b-2 border-blue-200 pb-1 flex items-center">
                <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
                {t('cvLabels.experience') || 'STAGE PROFESSIONNEL'}
              </h3>
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{exp.title}</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-sm uppercase tracking-tighter">
                        {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase">{exp.company} {exp.location && `- ${exp.location}`}</p>
                    
                    {exp.description && (
                      <div className="text-xs text-slate-600 pl-2 border-l-2 border-blue-50">
                        {exp.description.split('\n').map((line, i) => (
                          line.trim() && (
                            <div key={i} className="mb-1 flex items-start">
                              <span className="mr-1.5 mt-1 text-blue-400">•</span>
                              <span>{line.replace(/^[•-]\s*/, '')}</span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centres d'intérêt (Placeholder pour coller au design) */}
          <div className="mb-10">
            <h3 className="text-sm font-black text-slate-700 tracking-widest uppercase mb-4 border-b-2 border-blue-200 pb-1 flex items-center">
              <span className="w-2 h-8 bg-blue-100 mr-2 rounded-full block -ml-2"></span>
              {t('cvLabels.interests') === 'cvLabels.interests' ? (t('language') === 'en' ? 'INTERESTS' : 'CENTRE D\'INTÉRÊT') : t('cvLabels.interests')}
            </h3>
            <ul className="space-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Lecture</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Musique</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Voyage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Elegant pour l'aperçu en direct
export const ElegantTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header avec nom et titre */}
      <div className="p-10 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold overflow-hidden border border-gray-200">
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{fullName}</h2>
            {targetJob && <p className="text-gray-600 mt-1">{targetJob}</p>}
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-8">
        {/* Colonne principale */}
        <div className="flex-[2] space-y-6">
          {/* Résumé */}
          {personalInfo.summary && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">{t('cvLabels.profile')}</h3>
              <p className="text-gray-600">{personalInfo.summary}</p>
            </div>
          )}

          {/* Expérience */}
          {experiences.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">{t('cvLabels.experience')}</h3>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{exp.title}</p>
                      <span className="text-xs text-gray-500">
                        {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{exp.company}</p>
                    {exp.description && <ul className="text-gray-500 text-xs mt-2 list-disc list-inside">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">{t('cvLabels.education')}</h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{edu.degree}</p>
                      <span className="text-xs text-gray-500">{edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{edu.school}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="flex-1">
          {/* Compétences */}
          {skills.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">{t('cvLabels.skills')}</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill} className="bg-white p-2 rounded text-sm text-gray-600">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template Bold pour l'aperçu en direct
export const BoldTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header avec couleur vive */}
      <div className="bg-orange-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-white">
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            {targetJob && <p className="text-white/90 font-medium">{targetJob}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Résumé */}
        {personalInfo.summary && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-bold text-gray-800 mb-2">{t('cvLabels.profile').toUpperCase()}</h3>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        {/* Expérience */}
        {experiences.length > 0 && (
          <div>
            <h3 className="font-bold text-orange-600 border-b-2 border-orange-500 pb-1 mb-3">{t('cvLabels.experience').toUpperCase()}</h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-orange-500 pl-4">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{exp.title}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                    </span>
                  </div>
                  <p className="text-orange-600 font-medium text-sm">{exp.company}</p>
                  {exp.description && <ul className="text-gray-600 text-xs mt-2 list-disc list-inside">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formation */}
        {education.length > 0 && (
          <div>
            <h3 className="font-bold text-orange-600 border-b-2 border-orange-500 pb-1 mb-3">{t('cvLabels.education').toUpperCase()}</h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-orange-500 pl-4">
                  <p className="font-medium text-gray-800">{edu.degree}</p>
                  <p className="text-orange-600 font-medium text-sm">{edu.school}</p>
                  <span className="text-xs text-gray-500">{edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <div>
            <h3 className="font-bold text-orange-600 border-b-2 border-orange-500 pb-1 mb-3">{t('cvLabels.skills').toUpperCase()}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Template Gradient pour l'aperçu en direct
export const GradientTemplate = ({ data, className }: CVTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t('cvLabels.yourName');
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <div className={cn("bg-background rounded-lg shadow-xl border border-border overflow-hidden", className)}>
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-white">
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            {targetJob && <p className="text-white/90 font-medium">{targetJob}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-20">
        {/* Résumé */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h3 className="font-bold text-indigo-600 mb-2">{t('cvLabels.profile').toUpperCase()}</h3>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Expérience */}
            {experiences.length > 0 && (
              <div>
                <h3 className="font-bold text-indigo-600 mb-3">{t('cvLabels.experience').toUpperCase()}</h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{exp.title}</p>
                        <span className="text-xs bg-indigo-50 px-2 py-1 rounded text-indigo-600">
                          {exp.startDate || t('cvLabels.start')} - {exp.current ? t('cvLabels.present') : exp.endDate || t('cvLabels.end')}
                        </span>
                      </div>
                      <p className="text-indigo-600 text-sm">{exp.company}</p>
                      {exp.description && <ul className="text-gray-600 text-xs mt-2 list-disc list-inside">{exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {education.length > 0 && (
              <div>
                <h3 className="font-bold text-indigo-600 mb-3">{t('cvLabels.education').toUpperCase()}</h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                      <p className="font-medium text-gray-800">{edu.degree}</p>
                      <p className="text-indigo-600 text-sm">{edu.school}</p>
                      <span className="text-xs text-gray-500">{edu.startDate || t('cvLabels.start')} - {edu.endDate || t('cvLabels.end')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compétences */}
          <div className="col-span-1">
            {skills.length > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-600 mb-3">{t('cvLabels.skills').toUpperCase()}</h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill} className="bg-white p-2 rounded border-l-2 border-indigo-500 text-sm text-gray-600">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template map for easy access
export const templateComponents = {
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  fresh: FreshTemplate,
  modern: ModernTemplate,
  academic: AcademicTemplate,
  zurich: ZurichTemplate,
  tokyo: TokyoTemplate,
  milan: MilanTemplate,
  stockholm: StockholmTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  gradient: GradientTemplate,
};

// Base template info without translations (will be enriched with translations in components)
export const templateInfoBase = [
  {
    id: "professional",
    nameKey: "templates.professional",
    descKey: "templates.professionalDesc",
    color: "from-blue-500 to-blue-600",
    recommended: ["Tous métiers", "Entreprise"],
  },
  {
    id: "creative",
    nameKey: "templates.creative",
    descKey: "templates.creativeDesc",
    color: "from-purple-600 to-pink-500",
    recommended: ["Design", "Marketing", "Communication"],
  },
  {
    id: "minimal",
    nameKey: "templates.minimal",
    descKey: "templates.minimalDesc",
    color: "from-gray-200 to-gray-400",
    recommended: ["Finance", "Juridique", "Administration"],
  },
  {
    id: "elegant",
    nameKey: "templates.elegant",
    descKey: "templates.elegantDesc",
    color: "from-gray-100 to-gray-300",
    recommended: ["Cadre", "Finance", "Conseil"],
  },
  {
    id: "bold",
    nameKey: "templates.bold",
    descKey: "templates.boldDesc",
    color: "from-orange-500 to-red-500",
    recommended: ["Marketing", "Vente", "Communication"],
  },
  {
    id: "gradient",
    nameKey: "templates.gradient",
    descKey: "templates.gradientDesc",
    color: "from-indigo-500 to-purple-500",
    recommended: ["Tech", "Startup", "Design"],
  },
  {
    id: "executive",
    nameKey: "templates.executive",
    descKey: "templates.executiveDesc",
    color: "from-slate-700 to-amber-600",
    recommended: ["Direction", "Management", "Consulting"],
  },
  {
    id: "fresh",
    nameKey: "templates.fresh",
    descKey: "templates.freshDesc",
    color: "from-emerald-500 to-teal-500",
    recommended: ["Étudiant", "Premier emploi", "Stage"],
  },
  {
    id: "modern",
    nameKey: "templates.modern",
    descKey: "templates.modernDesc",
    color: "from-slate-500 to-slate-700",
    recommended: ["Tech", "Startup", "Tous métiers"],
  },
  {
    id: "academic",
    nameKey: "templates.academic",
    descKey: "templates.academicDesc",
    color: "from-gray-300 to-gray-500",
    recommended: ["Recherche", "Enseignement"],
  },
  {
    id: "zurich",
    nameKey: "templates.zurich",
    descKey: "templates.zurichDesc",
    color: "from-slate-100 to-slate-300",
    recommended: ["Finance", "Conseil"],
  },
  {
    id: "tokyo",
    nameKey: "templates.tokyo",
    descKey: "templates.tokyoDesc",
    color: "from-gray-800 to-cyan-500",
    recommended: ["Tech", "Design"],
  },
  {
    id: "milan",
    nameKey: "templates.milan",
    descKey: "templates.milanDesc",
    color: "from-white to-gray-200",
    recommended: ["Marketing", "Luxe"],
  },
  {
    id: "stockholm",
    nameKey: "templates.stockholm",
    descKey: "templates.stockholmDesc",
    color: "from-white to-blue-100",
    recommended: ["Startup", "Tous métiers"],
  },
];

// Keep old export for backward compatibility (deprecated)
export const templateInfo = templateInfoBase;
