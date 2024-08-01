const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');

const rootDir = path.join(__dirname, '..'); // Update the root directory path
const manifestFilePath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const attributeToAdd = 'android:manageSpaceActivity';

// Read the existing content of AndroidManifest.xml
fs.readFile(manifestFilePath, 'utf8', (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fileContent, 'text/xml');

  const applicationNode = xmlDoc.getElementsByTagName('application')[0];

  // Check if the attribute already exists
  if (applicationNode.hasAttribute(attributeToAdd)) {
    console.log(`Attribute ${attributeToAdd} already exists in AndroidManifest.xml.`);
  } else {
    // Add the attribute to the application node
    applicationNode.setAttribute(attributeToAdd, 'com.salesforce.androidsdk.ui.ManageSpaceActivity');
    console.log(`Attribute ${attributeToAdd} added to AndroidManifest.xml.`);
  }

  // Serialize the updated XML back to string
  const serializer = new XMLSerializer();
  const updatedContent = serializer.serializeToString(xmlDoc);

  // Write the updated content back to the file
  fs.writeFile(manifestFilePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('AndroidManifest.xml file updated successfully.');
  });
});
