import{j as e,f as O,T as A}from"./ui-vendor-DmnzVvUC.js";import{r as E,u as R}from"./react-vendor-CGj_E3sL.js";import{u as w,p as x}from"./pdf-BZ-G6Gu4.js";import{a as D,t as g}from"./index-BDuQWeaB.js";import{A as P}from"./AnalysisAnimation-k7GG13EW.js";import{P as U}from"./PartnerLayout-DOLGBMAk.js";import"./tslib.es6-CiBE_y40.js";import"./___vite-browser-external_commonjs-proxy-BrL237SC.js";import"./LanguageSwitcher-Ck6XEHXF.js";import"./index-BJgTB7-n.js";x.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${x.version}/pdf.worker.min.js`;const L=async u=>{const i=await u.arrayBuffer(),s=await x.getDocument(i).promise;let a="";for(let o=1;o<=s.numPages;o++){const p=await(await s.getPage(o)).getTextContent();a+=p.items.map(l=>"str"in l?l.str:"").join(" ")+`
`}return a},W=()=>{const[u,i]=E.useState(!1),[s,a]=E.useState(null),o=R(),{t:r}=D(),p=c=>{localStorage.setItem("cv_data",JSON.stringify(c)),o("/partner/builder/new",{state:{uploadedData:c}})},l=async c=>{var h;const d=c[0];if(!d)return;i(!0),a(null);const y=`Tu es une IA spécialisée dans l'analyse, l'extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

Ton rôle est de transformer le TEXTE BRUT d'un CV (issu d'un PDF, DOCX ou copier-coller) en un objet JSON structuré, propre et exploitable par une application web.

Tu agis comme un moteur de parsing intelligent, rigoureux et fiable, adapté au marché francophone.

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
À partir du texte brut d'un CV fourni en entrée :
- Identifier
- Extraire
- Classer
- Hiérarchiser
les informations du CV
ET
- Retourner UNIQUEMENT un objet JSON valide
- Respecter STRICTEMENT la structure définie ci-dessous

━━━━━━━━━━━━━━━━━━━━━━
📦 FORMAT DE SORTIE OBLIGATOIRE (JSON UNIQUEMENT)
━━━━━━━━━━━━━━━━━━━━━━

Tu dois retourner EXACTEMENT cette structure JSON :

{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "city": "",
    "country": "",
    "summary": ""
  },
  "targetJob": "",
  "experiences": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": []
}

━━━━━━━━━━━━━━━━━━━━━━
📌 RÈGLES STRICTES (TRÈS IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━

1. ⚠️ TA RÉPONSE DOIT ÊTRE UNIQUEMENT DU JSON
   - Aucun texte
   - Aucune explication
   - Aucun commentaire
   - Aucun markdown

2. 🔍 DONNÉES MANQUANTES
   - Si une information n'est PAS trouvée dans le CV :
     - utiliser une chaîne vide "" pour les champs texte
     - utiliser un tableau vide [] pour les listes

3. 🧠 INTERPRÉTATION INTELLIGENTE
   - Tu dois reconnaître :
     - différentes langues (principalement français)
     - différentes structures de CV
     - différentes appellations de sections :
       - "Expérience professionnelle", "Parcours", "Work Experience"
       - "Formation", "Éducation", "Studies"
       - "Compétences", "Skills", "Expertise"
   - Tu dois regrouper logiquement les informations même si le CV est mal structuré

4. 📅 DATES
   - Les formats de dates sont FLEXIBLES :
     - "2022"
     - "01/2021 - 06/2023"
     - "Janvier 2020 – Présent"
   - Ne reformate pas agressivement
   - Recopie la valeur telle qu'elle apparaît, de manière propre et lisible

5. 🧾 EXPÉRIENCES & FORMATION
   - Chaque expérience ou formation doit être un objet distinct
   - La description doit contenir les missions, responsabilités ou détails disponibles. Sépare chaque mission ou point par un retour à la ligne (
).
   - Ne fusionne pas plusieurs expériences en une seule

6. 🎯 POSTE CIBLÉ (targetJob)
   - Si un poste recherché est clairement mentionné (ex: "Développeur Web", "Data Analyst"), renseigne-le
   - Sinon, retourne une chaîne vide ""

7. 🧼 NETTOYAGE
   - Supprime les doublons évidents
   - Nettoie les caractères inutiles
   - Ne réécris pas le contenu, ne fais pas d'analyse sémantique avancée
   - Ton rôle est STRUCTURANT, pas CONSEILLER

━━━━━━━━━━━━━━━━━━━━━━
🛑 INTERDICTIONS ABSOLUES
━━━━━━━━━━━━━━━━━━━━━━
- Ne jamais inventer une information
- Ne jamais remplir un champ avec une supposition
- Ne jamais ajouter de champs supplémentaires
- Ne jamais modifier la structure JSON
- Ne jamais parler à l'utilisateur

━━━━━━━━━━━━━━━━━━━━━━
✅ RÉSULTAT ATTENDU
━━━━━━━━━━━━━━━━━━━━━━
Un JSON propre, cohérent, prêt à être injecté directement dans l'éditeur de CV Studyia Career pour :
- affichage
- modification
- reformatage
- analyse IA ultérieure`;try{let t="";if(d.type==="application/pdf")t=await L(d);else throw new Error(r("home.partner.upload.docxNotSupported"));const n="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",m=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json","HTTP-Referer":"http://localhost:8080/","X-Title":"Studyia Career CV Builder"},body:JSON.stringify({model:"meta-llama/llama-3.3-70b-instruct:free",messages:[{role:"system",content:y},{role:"user",content:`Here is the CV text to analyze:

${t}`}]})});if(!m.ok){const I=await m.json();throw new Error(((h=I.error)==null?void 0:h.message)||r("home.partner.upload.analysisError"))}const f=(await m.json()).choices[0].message.content,N=f.indexOf("{"),T=f.lastIndexOf("}")+1;if(N===-1||T===0)throw new Error(r("home.partner.upload.noJsonFound"));const v=f.substring(N,T),C=JSON.parse(v);g({title:r("home.partner.upload.analysisSuccess"),description:r("home.partner.upload.analysisSuccessDesc")}),p(C)}catch(t){console.error("Upload and analysis error:",t);const n=t instanceof Error?t.message:r("home.partner.upload.genericError");a(n),g({title:r("home.partner.upload.analysisErrorTitle"),description:n,variant:"destructive"})}finally{i(!1)}},{getRootProps:S,getInputProps:b,isDragActive:j}=w({onDrop:l,accept:{"application/pdf":[".pdf"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":[".docx"]},maxFiles:1});return e.jsx(U,{children:e.jsx("div",{className:"min-h-screen flex flex-col items-center justify-center p-8",children:e.jsx("div",{className:"w-full max-w-2xl",children:e.jsxs("div",{className:"bg-background p-8 rounded-xl shadow-lg border border-border",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-foreground mb-3",children:r("home.partner.upload.title")}),e.jsx("p",{className:"text-muted-foreground",children:r("home.partner.upload.subtitle")})]}),e.jsxs("div",{...S(),className:`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
                ${j?"border-primary bg-primary/10":"border-border hover:border-primary/50"}`,children:[e.jsx("input",{...b()}),u?e.jsxs("div",{className:"flex flex-col items-center justify-center text-primary",children:[e.jsx(P,{}),e.jsx("p",{className:"font-semibold -mt-8",children:r("home.partner.upload.analyzing")}),e.jsx("p",{className:"text-sm text-muted-foreground",children:r("home.partner.upload.pleaseWait")})]}):e.jsxs("div",{className:"flex flex-col items-center justify-center text-muted-foreground",children:[e.jsx(O,{className:"w-12 h-12 mb-4"}),e.jsx("p",{className:"font-semibold",children:r("home.partner.upload.dragDrop")}),e.jsx("p",{className:"text-sm",children:r("home.partner.upload.orClick")})]})]}),s&&e.jsxs("div",{className:"mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive-foreground rounded-lg flex items-center",children:[e.jsx(A,{className:"w-5 h-5 mr-3 flex-shrink-0"}),e.jsx("p",{className:"text-sm",children:s})]})]})})})})};export{W as default};
