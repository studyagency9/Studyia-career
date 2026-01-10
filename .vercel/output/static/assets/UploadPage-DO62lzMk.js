import{r as E,b as I,a as O,j as e,L as w,B as R,T as D,t as g}from"./index-Bj1s_XcD.js";import{u as P,C as L,p as x}from"./pdf-D778lf5l.js";import{A as U}from"./AnalysisAnimation-DDNIiVMl.js";import{A as k}from"./arrow-left-dJdu5K7P.js";import"./tslib.es6-CiBE_y40.js";import"./___vite-browser-external_commonjs-proxy-cjpsf4tL.js";import"./file-text-o8_AlPxW.js";import"./proxy-iKs4YyP_.js";x.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${x.version}/pdf.worker.min.js`;const J=async c=>{const i=await c.arrayBuffer(),s=await x.getDocument(i).promise;let a="";for(let o=1;o<=s.numPages;o++){const u=await(await s.getPage(o)).getTextContent();a+=u.items.map(l=>"str"in l?l.str:"").join(" ")+`
`}return a},Q=()=>{const[c,i]=E.useState(!1),[s,a]=E.useState(null),o=I(),{t}=O(),u=d=>{o("/builder",{state:{uploadedData:d}})},l=async d=>{var N;const p=d[0];if(!p)return;i(!0),a(null);const y=`Tu es une IA spécialisée dans l’analyse, l’extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

Ton rôle est de transformer le TEXTE BRUT d’un CV (issu d’un PDF, DOCX ou copier-coller) en un objet JSON structuré, propre et exploitable par une application web.

Tu agis comme un moteur de parsing intelligent, rigoureux et fiable, adapté au marché francophone.

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
À partir du texte brut d’un CV fourni en entrée :
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
   - Si une information n’est PAS trouvée dans le CV :
     - utiliser une chaîne vide "" pour les champs texte
     - utiliser un tableau vide [] pour les listes

3. 🧠 INTERPRÉTATION INTELLIGENTE
   - Tu dois reconnaître :
     - différentes langues (principalement français)
     - différentes structures de CV
     - différentes appellations de sections :
       - “Expérience professionnelle”, “Parcours”, “Work Experience”
       - “Formation”, “Éducation”, “Studies”
       - “Compétences”, “Skills”, “Expertise”
   - Tu dois regrouper logiquement les informations même si le CV est mal structuré

4. 📅 DATES
   - Les formats de dates sont FLEXIBLES :
     - "2022"
     - "01/2021 - 06/2023"
     - "Janvier 2020 – Présent"
   - Ne reformate pas agressivement
   - Recopie la valeur telle qu’elle apparaît, de manière propre et lisible

5. 🧾 EXPÉRIENCES & FORMATION
   - Chaque expérience ou formation doit être un objet distinct
   - La description doit contenir les missions, responsabilités ou détails disponibles. Sépare chaque mission ou point par un retour à la ligne (
).
   - Ne fusionne pas plusieurs expériences en une seule

6. 🎯 POSTE CIBLÉ (targetJob)
   - Si un poste recherché est clairement mentionné (ex: “Développeur Web”, “Data Analyst”), renseigne-le
   - Sinon, retourne une chaîne vide ""

7. 🧼 NETTOYAGE
   - Supprime les doublons évidents
   - Nettoie les caractères inutiles
   - Ne réécris pas le contenu, ne fais pas d’analyse sémantique avancée
   - Ton rôle est STRUCTURANT, pas CONSEILLER

━━━━━━━━━━━━━━━━━━━━━━
🛑 INTERDICTIONS ABSOLUES
━━━━━━━━━━━━━━━━━━━━━━
- Ne jamais inventer une information
- Ne jamais remplir un champ avec une supposition
- Ne jamais ajouter de champs supplémentaires
- Ne jamais modifier la structure JSON
- Ne jamais parler à l’utilisateur

━━━━━━━━━━━━━━━━━━━━━━
✅ RÉSULTAT ATTENDU
━━━━━━━━━━━━━━━━━━━━━━
Un JSON propre, cohérent, prêt à être injecté directement dans l’éditeur de CV Studyia Career pour :
- affichage
- modification
- reformatage
- analyse IA ultérieure`;try{let r="";if(p.type==="application/pdf")r=await J(p);else throw new Error(t("upload.docxNotSupported"));const n="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",m=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json","HTTP-Referer":"http://localhost:8080/","X-Title":"Studyia Career CV Builder"},body:JSON.stringify({model:"meta-llama/llama-3.3-70b-instruct:free",messages:[{role:"system",content:y},{role:"user",content:`Here is the CV text to analyze:

${r}`}]})});if(!m.ok){const A=await m.json();throw new Error(((N=A.error)==null?void 0:N.message)||t("upload.analysisError"))}const f=(await m.json()).choices[0].message.content,T=f.indexOf("{"),h=f.lastIndexOf("}")+1;if(T===-1||h===0)throw new Error(t("upload.noJsonFound"));const v=f.substring(T,h),C=JSON.parse(v);g({title:t("upload.analysisSuccess"),description:t("upload.analysisSuccessDesc")}),u(C)}catch(r){console.error("Upload and analysis error:",r);const n=r instanceof Error?r.message:t("upload.genericError");a(n),g({title:t("upload.analysisErrorTitle"),description:n,variant:"destructive"})}finally{i(!1)}},{getRootProps:b,getInputProps:j,isDragActive:S}=P({onDrop:l,accept:{"application/pdf":[".pdf"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":[".docx"]},maxFiles:1});return e.jsxs("div",{className:"min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 relative",children:[e.jsx("div",{className:"absolute top-4 left-4",children:e.jsx(w,{to:"/",children:e.jsxs(R,{variant:"ghost",children:[e.jsx(k,{className:"mr-2 h-4 w-4"})," ",t("upload.backHome")]})})}),e.jsx("div",{className:"w-full max-w-lg",children:e.jsxs("div",{className:"bg-background p-8 rounded-xl shadow-lg border border-border",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-foreground",children:t("upload.title")}),e.jsx("p",{className:"text-muted-foreground mt-2",children:t("upload.subtitle")})]}),e.jsxs("div",{...b(),className:`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
              ${S?"border-primary bg-primary/10":"border-border hover:border-primary/50"}`,children:[e.jsx("input",{...j()}),c?e.jsxs("div",{className:"flex flex-col items-center justify-center text-primary",children:[e.jsx(U,{}),e.jsx("p",{className:"font-semibold -mt-8",children:t("upload.analyzing")}),e.jsx("p",{className:"text-sm text-muted-foreground",children:t("upload.pleaseWait")})]}):e.jsxs("div",{className:"flex flex-col items-center justify-center text-muted-foreground",children:[e.jsx(L,{className:"w-12 h-12 mb-4"}),e.jsx("p",{className:"font-semibold",children:t("upload.dragDrop")}),e.jsx("p",{className:"text-sm",children:t("upload.orClick")})]})]}),s&&e.jsxs("div",{className:"mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive-foreground rounded-lg flex items-center",children:[e.jsx(D,{className:"w-5 h-5 mr-3 flex-shrink-0"}),e.jsx("p",{className:"text-sm",children:s})]})]})})]})};export{Q as default};
