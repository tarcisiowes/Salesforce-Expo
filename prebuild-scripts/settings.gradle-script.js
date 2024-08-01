const fs = require('fs');
const path = require('path');

const codeSnippet = `
def libsRootDir = new File(settingsDir, '../mobile_sdk/SalesforceMobileSDK-Android-Merx/libs')

include ':libs:SalesforceAnalytics'
project(':libs:SalesforceAnalytics').projectDir = new File(libsRootDir, 'SalesforceAnalytics')

include ':libs:SalesforceSDK'
project(':libs:SalesforceSDK').projectDir = new File(libsRootDir, 'SalesforceSDK')

include ':libs:SmartStore'
project(':libs:SmartStore').projectDir = new File(libsRootDir, 'SmartStore')

include ':libs:MobileSync'
project(':libs:MobileSync').projectDir = new File(libsRootDir, 'MobileSync')

include ':libs:SalesforceReact'
project(':libs:SalesforceReact').projectDir = new File(libsRootDir, 'SalesforceReact')
`;

const scriptDir = __dirname;
const rootDir = path.join(scriptDir, '..'); // Assuming scripts folder is in the root project directory
const filePath = path.join(rootDir, 'android', 'settings.gradle');

// Read the existing content of settings.gradle
fs.readFile(filePath, 'utf8', (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  // Append the code snippet to the file content
  const updatedContent = fileContent + codeSnippet;

  // Write the updated content back to the file
  fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Code snippet added to settings.gradle file.');
  });
});
