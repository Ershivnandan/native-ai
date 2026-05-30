const { withGradleProperties } = require("expo/config-plugins");

const PROPERTY_KEY = "rnllamaBuildFromSource";
const PROPERTY_VALUE = "true";

const withRnllamaSource = (config) =>
  withGradleProperties(config, (gradleConfig) => {
    const existing = gradleConfig.modResults.find(
      (item) => item.type === "property" && item.key === PROPERTY_KEY,
    );
    if (existing) {
      existing.value = PROPERTY_VALUE;
    } else {
      gradleConfig.modResults.push({
        type: "property",
        key: PROPERTY_KEY,
        value: PROPERTY_VALUE,
      });
    }
    return gradleConfig;
  });

module.exports = withRnllamaSource;
