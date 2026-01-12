import{j as e,e as I,f as O,T as w}from"./ui-vendor-DmnzVvUC.js";import{r as E,u as D,L as R}from"./react-vendor-CGj_E3sL.js";import{u as P,d as V}from"./useSEO-CSB_9WCC.js";import{u as U,p as x}from"./pdf-BZ-G6Gu4.js";import{a as L,B as k,t as S}from"./index-BDuQWeaB.js";import{A as J}from"./AnalysisAnimation-k7GG13EW.js";import"./tslib.es6-CiBE_y40.js";import"./___vite-browser-external_commonjs-proxy-BrL237SC.js";x.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${x.version}/pdf.worker.min.js`;const B=async u=>{const l=await u.arrayBuffer(),a=await x.getDocument(l).promise;let o="";for(let n=1;n<=a.numPages;n++){const d=await(await a.getPage(n)).getTextContent();o+=d.items.map(c=>"str"in c?c.str:"").join(" ")+`
`}return o},Q=()=>{const[u,l]=E.useState(!1),[a,o]=E.useState(null),n=D(),{t}=L();P({title:"Améliorer mon CV existant - Studyia Career | Upload et optimisation de CV",description:"Téléchargez votre CV existant (PDF, DOCX) et améliorez-le avec Studyia Career. Notre IA analyse votre CV et vous aide à le restructurer avec un design professionnel.",keywords:"améliorer CV, optimiser CV, upload CV, télécharger CV, refaire CV, moderniser CV, CV PDF",canonical:"https://career.studyia.net/upload",structuredData:V({name:"Améliorer votre CV existant",description:"Téléchargez et améliorez votre CV avec notre outil d'optimisation",url:"https://career.studyia.net/upload"})});const d=p=>{n("/builder",{state:{uploadedData:p}})},c=async p=>{var N;const m=p[0];if(!m)return;l(!0),o(null);const y=`Tu es une IA spécialisée dans l’analyse, l’extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

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
- analyse IA ultérieure`;try{let r="";if(m.type==="application/pdf")r=await B(m);else throw new Error(t("upload.docxNotSupported"));const s="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",i=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json","HTTP-Referer":"https://career.studyia.net","X-Title":"Studyia Career CV Builder"},body:JSON.stringify({model:"meta-llama/llama-3.3-70b-instruct:free",messages:[{role:"system",content:y},{role:"user",content:`Here is the CV text to analyze:

${r}`}]})});if(!i.ok){const g=await i.json();throw console.error("OpenRouter API Error:",g),new Error(((N=g.error)==null?void 0:N.message)||`API Error: ${i.status} - ${i.statusText}`)}const f=(await i.json()).choices[0].message.content,h=f.indexOf("{"),T=f.lastIndexOf("}")+1;if(h===-1||T===0)throw new Error(t("upload.noJsonFound"));const v=f.substring(h,T),A=JSON.parse(v);S({title:t("upload.analysisSuccess"),description:t("upload.analysisSuccessDesc")}),d(A)}catch(r){console.error("Upload and analysis error:",r);const s=r instanceof Error?r.message:t("upload.genericError");o(s),S({title:t("upload.analysisErrorTitle"),description:s,variant:"destructive"})}finally{l(!1)}},{getRootProps:b,getInputProps:j,isDragActive:C}=U({onDrop:c,accept:{"application/pdf":[".pdf"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":[".docx"]},maxFiles:1});return e.jsxs("div",{className:"min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 relative",children:[e.jsx("div",{className:"absolute top-4 left-4",children:e.jsx(R,{to:"/",children:e.jsxs(k,{variant:"ghost",children:[e.jsx(I,{className:"mr-2 h-4 w-4"})," ",t("upload.backHome")]})})}),e.jsx("div",{className:"w-full max-w-lg",children:e.jsxs("div",{className:"bg-background p-8 rounded-xl shadow-lg border border-border",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-foreground",children:t("upload.title")}),e.jsx("p",{className:"text-muted-foreground mt-2",children:t("upload.subtitle")})]}),e.jsxs("div",{...b(),className:`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
              ${C?"border-primary bg-primary/10":"border-border hover:border-primary/50"}`,children:[e.jsx("input",{...j()}),u?e.jsxs("div",{className:"flex flex-col items-center justify-center text-primary",children:[e.jsx(J,{}),e.jsx("p",{className:"font-semibold -mt-8",children:t("upload.analyzing")}),e.jsx("p",{className:"text-sm text-muted-foreground",children:t("upload.pleaseWait")})]}):e.jsxs("div",{className:"flex flex-col items-center justify-center text-muted-foreground",children:[e.jsx(O,{className:"w-12 h-12 mb-4"}),e.jsx("p",{className:"font-semibold",children:t("upload.dragDrop")}),e.jsx("p",{className:"text-sm",children:t("upload.orClick")})]})]}),a&&e.jsxs("div",{className:"mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive-foreground rounded-lg flex items-center",children:[e.jsx(w,{className:"w-5 h-5 mr-3 flex-shrink-0"}),e.jsx("p",{className:"text-sm",children:a})]})]})})]})};export{Q as default};
