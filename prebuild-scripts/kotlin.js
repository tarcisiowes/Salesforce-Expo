const fs = require("fs");
const path = require("path");

const scriptDir = __dirname;
const androidDir = path.join(scriptDir, "..", "android");
const buildGradlePath = path.join(androidDir, "build.gradle");
const dependencyToAdd =
  '    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"';

// Check if the android folder exists
if (fs.existsSync(androidDir)) {
  // Check if the build.gradle file exists
  if (fs.existsSync(buildGradlePath)) {
    // Read the existing content of build.gradle
    fs.readFile(buildGradlePath, "utf8", (err, fileContent) => {
      if (err) {
        console.error(err);
        return;
      }

      // Find the dependencies block
      const dependenciesBlockRegex = /dependencies\s*{([\s\S]*?)}/;
      const dependenciesBlockMatch = dependenciesBlockRegex.exec(fileContent);

      if (dependenciesBlockMatch) {
        const dependenciesBlock = dependenciesBlockMatch[1].trim();

        // Check if the dependency already exists
        if (dependenciesBlock.includes(dependencyToAdd)) {
          console.log("Dependency already exists in build.gradle.");
        } else {
          // Insert the dependency inside the dependencies block
          const updatedFileContent = fileContent.replace(
            dependenciesBlockMatch[0],
            dependenciesBlockMatch[0].replace(/}$/, `\n${dependencyToAdd}\n}`)
          );

          // Write the updated content back to the file
          fs.writeFile(buildGradlePath, updatedFileContent, "utf8", (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("build.gradle file updated successfully.");
          });
        }
      } else {
        console.log("Unable to find dependencies block in build.gradle.");
      }
    });
  } else {
    console.log("build.gradle file not found.");
  }
} else {
  console.log("android folder not found.");
}
