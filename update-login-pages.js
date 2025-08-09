// Quick script to add email fields to all login pages
const fs = require('fs');

const pages = [
  'app/auth/alumni/page.tsx',
  'app/auth/admin/page.tsx', 
  'app/auth/recruiter/page.tsx'
];

pages.forEach(pagePath => {
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Update the signIn call to include email
  content = content.replace(
    /const result = await signIn\("credentials", {\s*username: formData\.username,\s*password: formData\.password,\s*redirect: false,\s*}\);/,
    `const result = await signIn("credentials", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        redirect: false,
      });`
  );
  
  // Add email field before username field in the form
  content = content.replace(
    /<div>\s*<label className="block text-sm font-medium text-gray-700 mb-2">\s*Username\s*<\/label>/,
    `<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${getColor(pagePath)}-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>`
  );
  
  fs.writeFileSync(pagePath, content);
  console.log(`Updated ${pagePath}`);
});

function getColor(path) {
  if (path.includes('alumni')) return 'purple';
  if (path.includes('admin')) return 'red';
  if (path.includes('recruiter')) return 'blue';
  return 'gray';
}

console.log('All login pages updated!');
