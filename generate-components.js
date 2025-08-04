// generate-components.mjs
import fs from 'fs';
import path from 'path';

const components = [
  "Navigation.tsx",
  "AgentEnrollmentModal.tsx",
  "Hero.tsx",
  "CoreServices.tsx",
  "ImpactSection.tsx",
  "Testimonials.tsx",
  "VisualInsight.tsx",
  "AboutUs.tsx",
  "SocialHandles.tsx",
  "Footer.tsx",
];

const componentsDir = path.join(process.cwd(), "components");

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir);
  console.log("Created /components directory.");
}

components.forEach((fileName) => {
  const filePath = path.join(componentsDir, fileName);
  if (!fs.existsSync(filePath)) {
    const componentName = fileName.replace(/\.tsx$/, "");
    const content = `import React from "react";

const ${componentName}: React.FC = () => {
  return (
    <div>
      {/* ${componentName} component */}
    </div>
  );
};

export default ${componentName};
`;
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${fileName}`);
  } else {
    console.log(`⚠️  Skipped ${fileName} (already exists)`);
  }
});
