#!/bin/bash

# Execute the expo prebuild command
npx expo prebuild --clean

# Execute the scripts

node ./prebuild-scripts/build.gradle-script.js

node ./prebuild-scripts/main-activity-script.js

node ./prebuild-scripts/main-application-script.js

node ./prebuild-scripts/settings.gradle-script.js

node ./prebuild-scripts/manifest-script.js

node ./prebuild-scripts/kotlin.js



