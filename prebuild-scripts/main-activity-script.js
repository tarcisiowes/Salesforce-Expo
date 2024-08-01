const fs = require('fs');
const path = require('path');

const importStatement = 'import com.salesforce.androidsdk.reactnative.ui.SalesforceReactActivity;';
const extendsStatement = ' extends SalesforceReactActivity';
const methodSnippet = `
    @Override
    public boolean shouldAuthenticate() {
        return false;
    }
`;

const rootDir = path.join(__dirname, '..'); // Update the root directory path
const projectDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'java', 'com',  'tarcisiowes','salesforceexpo');

// Recursive function to search for MainActivity.kt
function findMainActivity(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const found = findMainActivity(filePath);
      if (found) {
        return found;
      }
    } else if (file === 'MainActivity.kt') {
      return filePath;
    }
  }
  return null;
}

// Find the MainActivity.kt file
const mainActivityFilePath = findMainActivity(projectDir);

if (!mainActivityFilePath) {
  console.error('MainActivity.kt file not found.');
  return;
}

// Read the existing content of MainActivity.kt
fs.readFile(mainActivityFilePath, 'utf8', (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  // Check if the import statement already exists
  if (fileContent.includes(importStatement)) {
    console.log('Import statement already exists in MainActivity.kt.');
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

  // Check if the class already extends SalesforceReactActivity
  if (fileContent.includes(extendsStatement)) {
    console.log('MainActivity already extends SalesforceReactActivity.');
  } else {
    // Replace the extends statement to extend SalesforceReactActivity
    fileContent = fileContent.replace(/extends ReactActivity(\s|\{)/g, extendsStatement + '$1');
  }

  // Check if the shouldAuthenticate() method already exists
  if (fileContent.includes('shouldAuthenticate()')) {
    console.log('shouldAuthenticate() method already exists in MainActivity.kt.');
  } else {
    // Add the shouldAuthenticate() method inside the class
    const index = fileContent.indexOf('{') + 1;
    const updatedContent =
      fileContent.slice(0, index) +
      methodSnippet.trim() +
      fileContent.slice(index);

    fileContent = updatedContent;
  }

  // Write the updated content back to the file
  fs.writeFile(mainActivityFilePath, fileContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Modifications applied to MainActivity.kt file.');
  });
});
