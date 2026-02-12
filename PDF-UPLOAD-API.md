# 🌐 API ENDPOINT POUR UPLOAD PDF

## 📋 ENDPOINT REQUIS SUR VOTRE SERVEUR

### **POST /api/pdfs/upload**

Votre serveur DigitalOcean doit avoir cet endpoint pour recevoir les PDFs.

---

## 🔧 CODE NODE.JS POUR VOTRE SERVEUR

```javascript
// Dans votre backend Node.js/Express
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'pdfs');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Utiliser le pdfId envoyé depuis le frontend
    const pdfId = req.body.pdfId || 'pdf_' + Date.now();
    cb(null, pdfId + '.pdf');
  }
});

const upload = multer({ storage: storage });

// Endpoint pour uploader les PDFs
app.post('/api/pdfs/upload', upload.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier PDF reçu'
      });
    }

    const pdfId = req.body.pdfId;
    const price = req.body.price;
    const cvData = JSON.parse(req.body.cvData);

    // URL où le PDF sera accessible
    const pdfUrl = `https://studyiacareer-backend-qpmpz.ondigitalocean.app/uploads/pdfs/${pdfId}.pdf`;

    console.log('📄 PDF reçu:', {
      pdfId: pdfId,
      filename: req.file.filename,
      size: req.file.size,
      price: price,
      userEmail: cvData.personalInfo.email
    });

    // Ici vous pouvez sauvegarder les infos en BDD si vous voulez
    // await db.collection('pdfs').insertOne({
    //   pdfId: pdfId,
    //   filename: req.file.filename,
    //   price: price,
    //   cvData: cvData,
    //   createdAt: new Date()
    // });

    res.json({
      success: true,
      pdfUrl: pdfUrl,
      pdfId: pdfId,
      message: 'PDF uploadé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur upload PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'upload du PDF'
    });
  }
});

// Servir les fichiers PDF statiques
app.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads', 'pdfs')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
```

---

## 📁 STRUCTURE DES DOSSIERS

```
votre-serveur/
├── uploads/
│   └── pdfs/
│       ├── pdf_abc123_xyz789.pdf
│       ├── pdf_def456_uvw123.pdf
│       └── ...
├── server.js
└── package.json
```

---

## 📦 DÉPENDANCES NÉCESSAIRES

```bash
npm install express multer
```

---

## 🔍 CE QUE ENVOIE LE FRONTEND

### **FormData envoyé :**
```
pdf: [Blob] - Le fichier PDF
pdfId: "pdf_abc123_xyz789" - ID unique
price: "1099" - Prix payé
cvData: {...} - Données du CV en JSON
```

### **Headers :**
```
Content-Type: multipart/form-data
```

---

## ✅ RÉPONSE ATTENDUE

```json
{
  "success": true,
  "pdfUrl": "https://studyiacareer-backend-qpmpz.ondigitalocean.app/uploads/pdfs/pdf_abc123_xyz789.pdf",
  "pdfId": "pdf_abc123_xyz789",
  "message": "PDF uploadé avec succès"
}
```

---

## 🌐 TEST DE L'ENDPOINT

Une fois le serveur configuré, testez avec :

```bash
curl -X POST \
  https://studyiacareer-backend-qpmpz.ondigitalocean.app/api/pdfs/upload \
  -F 'pdf=@/chemin/du/fichier.pdf' \
  -F 'pdfId=test_123' \
  -F 'price=1099' \
  -F 'cvData={"personalInfo":{"firstName":"Test"}}'
```

---

## ⚠️ NOTES IMPORTANTES

1. **Permissions** : Assurez-vous que le dossier `uploads/pdfs` a les bonnes permissions d'écriture
2. **CORS** : Configurez CORS si nécessaire pour permettre les requêtes depuis votre frontend
3. **Sécurité** : Validez les fichiers uploadés (taille, type, etc.)
4. **Nettoyage** : Pensez à nettoyer les anciens fichiers PDF périodiquement

---

## 🚀 DÉPLOIEMENT SUR DIGITALOCEAN

1. **Créez un Droplet** Node.js sur DigitalOcean
2. **Clonez votre code** avec l'endpoint ci-dessus
3. **Installez les dépendances** : `npm install`
4. **Démarrez le serveur** : `npm start`
5. **Configurez le firewall** pour autoriser le port 3000
6. **Utilisez un reverse proxy** (Nginx) si nécessaire

Une fois déployé, votre frontend pourra vraiment uploader les PDFs et les URLs fonctionneront ! 🎉
