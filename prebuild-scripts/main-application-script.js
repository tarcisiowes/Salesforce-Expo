const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..'); // Update the root directory path
const importStatement = 'import com.salesforce.androidsdk.reactnative.app.SalesforceReactSDKManager;';
const lineToAdd = 'packages.add(SalesforceReactSDKManager.getInstance().getReactPackage());';
const statementToAdd = 'SalesforceReactSDKManager.initReactNative(getApplicationContext(), MainActivity.class);';

const projectDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'java', 'com',  'tarcisiowes','salesforceexpo');

// Recursive function to search for MainApplication.kt
function findMainApplication(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const found = findMainApplication(filePath);
      if (found) {
        return found;
      }
    } else if (file === 'MainApplication.kt') {
      return filePath;
    }
  }
  return null;
}

// Find the MainApplication.kt file
const mainApplicationFilePath = findMainApplication(projectDir);

if (!mainApplicationFilePath) {
  console.error('MainApplication.kt file not found.');
  return;
}

// Read the existing content of MainApplication.kt
fs.readFile(mainApplicationFilePath, 'utf8', (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  // Check if the import statement already exists
  if (fileContent.includes(importStatement)) {
    console.log('Import statement already exists in MainApplication.kt.');
  } else {
    // Find the index after the package declaration
    const packageIndex = fileContent.indexOf('package');
    const insertIndex = fileContent.indexOf('\n', packageIndex) + 1;

    // Insert the import statement after the package declaration
    const updatedContent =
      fileContent.slice(0, insertIndex) +
      importStatement + '\n' +
      fileContent.slice(insertIndex);

    fileContent = updatedContent;
  }

  // Check if the line already exists
  if (fileContent.includes(lineToAdd)) {
    console.log('Line already exists in MainApplication.kt.');
  } else {
    // Find the index of the return statement in getPackages() function
    const getPackagesIndex = fileContent.indexOf('protected List<ReactPackage> getPackages() {');
    const returnIndex = fileContent.indexOf('return packages;', getPackagesIndex);
    const insertIndex = fileContent.lastIndexOf('\n', returnIndex) + 1;

    // Insert the line before the return statement
    const updatedContent =
      fileContent.slice(0, insertIndex) +
      lineToAdd + '\n' +
      fileContent.slice(insertIndex);

    fileContent = updatedContent;
  }

  // Check if the statement already exists
  if (fileContent.includes(statementToAdd)) {
    console.log('Statement already exists in MainApplication.kt.');
  } else {
    // Find the index of the line containing SoLoader.init
    const soLoaderIndex = fileContent.indexOf('SoLoader.init');
    const insertIndex = fileContent.indexOf('\n', soLoaderIndex) + 1;

    // Insert the statement after the line containing SoLoader.init
    const updatedContent =
      fileContent.slice(0, insertIndex) +
      statementToAdd + '\n' +
      fileContent.slice(insertIndex);

    fileContent = updatedContent;
  }

  // Write the updated content back to the file
  fs.writeFile(mainApplicationFilePath, fileContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Modifications applied to MainApplication.kt file.');
  });
});
