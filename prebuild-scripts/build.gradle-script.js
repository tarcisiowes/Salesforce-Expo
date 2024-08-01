const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, ".."); // Update the root directory path
const buildGradlePath = path.join(rootDir, "android", "app", "build.gradle");
const packagingOptionsConfig = "        jniLibs.useLegacyPackaging = true";
const minSdkVersionConfig = "    minSdkVersion 24";
const dependencyToAdd =
  "    implementation project(':libs:SalesforceReact') // From node_modules";

// Read the existing content of build.gradle
fs.readFile(buildGradlePath, "utf8", (err, fileContent) => {
  if (err) {
    console.error(err);
    return;
  }

  // Update the packagingOptions block
  const packagingOptionsIndex = fileContent.indexOf("packagingOptions {");
  if (packagingOptionsIndex === -1) {
    const androidBlockIndex = fileContent.indexOf("android {");
    const insertIndex = fileContent.indexOf("\n", androidBlockIndex) + 1;
    const packagingOptionsBlock = `    packagingOptions {\n${packagingOptionsConfig}\n    }\n`;
    fileContent =
      fileContent.slice(0, insertIndex) +
      packagingOptionsBlock +
      fileContent.slice(insertIndex);
  }

  // Remove the old minSdkVersion line and add the new one inside defaultConfig block
  const defaultConfigStartIndex = fileContent.indexOf("defaultConfig {");
  const defaultConfigEndIndex =
    fileContent.indexOf("\n}", defaultConfigStartIndex) + 1;
  const oldMinSdkVersionLineIndex = fileContent.indexOf("minSdkVersion");
  const oldMinSdkVersionLineEndIndex = fileContent.indexOf(
    "\n",
    oldMinSdkVersionLineIndex
  );
  if (oldMinSdkVersionLineIndex !== -1) {
    fileContent =
      fileContent.slice(0, oldMinSdkVersionLineIndex) +
      fileContent.slice(oldMinSdkVersionLineEndIndex + 1);
  }
  const minSdkVersionIndex =
    fileContent.indexOf("\n", defaultConfigStartIndex) + 1;
  fileContent =
    fileContent.slice(0, minSdkVersionIndex) +
    `${minSdkVersionConfig}\n` +
    fileContent.slice(minSdkVersionIndex);

  // Check if the dependency already exists
  if (fileContent.includes(dependencyToAdd)) {
    console.log("Dependency already exists in build.gradle.");
  } else {
    // Find the index of the dependencies block and locate the insertion point
    const dependenciesStartIndex = fileContent.indexOf("dependencies {");
    const dependenciesEndIndex = fileContent.indexOf(
      "\n}",
      dependenciesStartIndex
    );
    const insertIndex =
      dependenciesEndIndex !== -1 ? dependenciesEndIndex : fileContent.length;

    // Insert the dependency
    const dependencyBlock = `\n${dependencyToAdd}\n`;
    fileContent =
      fileContent.slice(0, insertIndex) +
      dependencyBlock +
      fileContent.slice(insertIndex);
  }

  // Write the updated content back to the file
  fs.writeFile(buildGradlePath, fileContent, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("build.gradle file updated successfully.");
  });
});
