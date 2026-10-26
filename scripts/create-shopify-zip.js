const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const sourceDir = path.resolve(__dirname, '..', 'shopify-theme');
const outputZipPath = path.resolve(__dirname, '..', 'BHAYA-INDIA-SHOPIFY-THEME-FINAL.zip');

const foldersToInclude = [
  'assets',
  'config',
  'layout',
  'locales',
  'sections',
  'snippets',
  'templates'
];

async function createThemeZip() {
  console.log('Creating clean Shopify theme ZIP...');
  console.log('Source directory:', sourceDir);
  console.log('Output ZIP path:', outputZipPath);

  if (fs.existsSync(outputZipPath)) {
    fs.unlinkSync(outputZipPath);
    console.log('Removed existing ZIP file.');
  }

  const output = fs.createWriteStream(outputZipPath);
  const archive = new ZipArchive({
    zlib: { level: 9 }
  });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Successfully created ZIP archive: ${archive.pointer()} total bytes.`);
      resolve(archive.pointer());
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archiver warning:', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    foldersToInclude.forEach((folder) => {
      const fullFolderPath = path.join(sourceDir, folder);
      if (fs.existsSync(fullFolderPath)) {
        // Recursively read all files and add with forward slashes
        function addFilesRecursively(dir, zipPrefix) {
          const items = fs.readdirSync(dir);
          for (const item of items) {
            const itemPath = path.join(dir, item);
            const zipPath = `${zipPrefix}/${item}`.replace(/\\/g, '/');
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
              addFilesRecursively(itemPath, zipPath);
            } else {
              archive.file(itemPath, { name: zipPath });
              console.log(`  + ${zipPath}`);
            }
          }
        }
        addFilesRecursively(fullFolderPath, folder);
        console.log(`+ Added folder to root: ${folder}/`);
      } else {
        console.error(`- ERROR: Expected folder missing: ${folder}`);
      }
    });

    archive.finalize();
  });
}

createThemeZip()
  .then(() => {
    console.log('Theme ZIP creation completed successfully.');
  })
  .catch((err) => {
    console.error('Failed to create theme ZIP:', err);
    process.exit(1);
  });
