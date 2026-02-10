#!/usr/bin/env node

// Script de déploiement avec cache busting automatique
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du déploiement avec cache busting...');

// 1. Générer un timestamp unique pour le build
const buildTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
const buildVersion = `v${Date.now()}`;

console.log(`📦 Build version: ${buildVersion}`);
console.log(`🕐 Build timestamp: ${buildTimestamp}`);

// 2. Mettre à jour le fichier version.json
const versionInfo = {
  version: buildVersion,
  buildTime: new Date().toISOString(),
  gitCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  environment: process.env.NODE_ENV || 'production'
};

fs.writeFileSync(
  path.resolve(__dirname, '../public/version.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log('✅ Fichier version.json mis à jour');

// 3. Build de l'application
console.log('🔨 Build de l\'application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build terminé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

// 4. Ajouter des headers de cache dans le build
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Ajouter des meta tags pour le cache busting
  const cacheMetaTags = `
    <!-- Cache busting meta tags -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="build-version" content="${buildVersion}">
    <meta name="build-timestamp" content="${buildTimestamp}">
  `;
  
  // Insérer les meta tags après les meta tags existants
  indexContent = indexContent.replace(
    /(<meta name="apple-mobile-web-app-title" content="Studyia Associés"[^>]*>)/,
    `$1${cacheMetaTags}`
  );
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Meta tags de cache busting ajoutés');
}

// 5. Créer un fichier de version pour les assets
const assetsVersion = {
  version: buildVersion,
  timestamp: buildTimestamp,
  assets: fs.readdirSync(path.join(distPath, 'assets')).filter(file => 
    file.endsWith('.js') || file.endsWith('.css')
  )
};

fs.writeFileSync(
  path.join(distPath, 'assets-version.json'),
  JSON.stringify(assetsVersion, null, 2)
);

console.log('✅ Fichier assets-version.json créé');

// 6. Instructions pour le déploiement
console.log('\n📋 Instructions de déploiement:');
console.log('1. Le build est prêt dans le dossier dist/');
console.log('2. Déployez le contenu de dist/ sur votre serveur');
console.log('3. Les fichiers ont des hash pour forcer le rechargement');
console.log('4. Le service worker sera automatiquement mis à jour');
console.log('5. Les utilisateurs verront une notification de mise à jour');

console.log('\n🎯 Pour forcer la mise à jour côté client:');
console.log('- Incrémentez la version dans package.json');
console.log('- Ou utilisez le timestamp automatique');
console.log('- Les utilisateurs seront notifiés automatiquement');

console.log('\n✅ Déploiement avec cache busting terminé!');
