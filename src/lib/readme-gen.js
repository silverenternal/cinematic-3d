// src/lib/readme-gen.js
// Generate GitHub profile README Markdown from a form-state object.

/**
 * @typedef {Object} FormState
 * @property {string} username
 * @property {string} greeting
 * @property {string} emoji
 * @property {string} tagline
 * @property {string} visitorLabel
 * @property {{working:string, learning:string, collab:string, ask:string, fun:string}} about
 * @property {string[]} tech
 * @property {{stats:boolean, streak:boolean, trophies:boolean, activity:boolean, visitor:boolean}} widgets
 * @property {string[]} pinned
 * @property {{email:string, blog:string, twitter:string, linkedin:string, zhihu:string, bilibili:string}} socials
 */

const nl = '\n';

export function generateREADME(s) {
  const out = [];
  const gh = s.username;

  // ----- Header / greeting -----
  out.push(`# ${s.greeting} ${s.emoji}`);
  out.push('');
  if (s.tagline) {
    out.push(`> ${s.tagline}`);
    out.push('');
  }

  // ----- Visitor badge (early, prominent) -----
  if (s.widgets.visitor) {
    const label = encodeURIComponent(s.visitorLabel);
    out.push(`![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=${gh}.${gh}&label=${label})`);
    out.push('');
  }

  // ----- About bullets -----
  const aboutLines = [];
  if (s.about.working)  aboutLines.push(`- 🔭 I'm currently working on **${escape(s.about.working)}**`);
  if (s.about.learning) aboutLines.push(`- 🌱 I'm currently learning **${escape(s.about.learning)}**`);
  if (s.about.collab)   aboutLines.push(`- 👯 I'm looking to collaborate on **${escape(s.about.collab)}**`);
  if (s.about.ask)      aboutLines.push(`- 💬 Ask me about **${escape(s.about.ask)}**`);
  if (s.about.fun)      aboutLines.push(`- ⚡ Fun fact: ${escape(s.about.fun)}`);
  if (aboutLines.length) {
    out.push(...aboutLines);
    out.push('');
  }

  // ----- Tech stack (skill-icons) -----
  if (s.tech.length) {
    out.push(`### 🛠 Tech Stack`);
    out.push('');
    out.push(`![Skills](https://skillicons.dev/icons?i=${s.tech.join(',')}&theme=dark)`);
    out.push('');
  }

  // ----- GitHub Stats -----
  const statsLines = [];
  if (s.widgets.stats) {
    statsLines.push(`![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${gh}&theme=tokyonight&show_icons=true&hide_border=true&count_private=true&include_all_commits=true)`);
  }
  if (s.widgets.streak) {
    statsLines.push(`![Streak Stats](https://streak-stats.demolab.com?user=${gh}&theme=tokyonight&hide_border=true&date_format=j%20M%5B%20Y%5D)`);
  }
  if (statsLines.length) {
    out.push(`### 📊 GitHub Stats`);
    out.push('');
    out.push(...statsLines);
    out.push('');
  }

  if (s.widgets.trophies) {
    out.push(`### 🏆 Trophies`);
    out.push('');
    out.push(`![Trophies](https://github-profile-trophy.vercel.app/?username=${gh}&theme=tokyonight&no-frame=true&no-bg=true&margin-w=4)`);
    out.push('');
  }

  if (s.widgets.activity) {
    out.push(`### 📈 Activity Graph`);
    out.push('');
    out.push(`![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${gh}&theme=tokyo-night&hide_border=true)`);
    out.push('');
  }

  // ----- Pinned repos -----
  if (s.pinned.length) {
    out.push(`### 📌 Pinned Repositories`);
    out.push('');
    out.push(`![Pinned](https://github-readme-stats.vercel.app/api/pin/?username=${gh}&repo=${s.pinned[0]}&theme=tokyonight&hide_border=true)`);
    for (let i = 1; i < s.pinned.length; i++) {
      out.push(`![Pinned](https://github-readme-stats.vercel.app/api/pin/?username=${gh}&repo=${s.pinned[i]}&theme=tokyonight&hide_border=true)`);
    }
    out.push('');
  }

  // ----- Socials -----
  const socialLines = [];
  if (s.socials.email)    socialLines.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${s.socials.email})`);
  if (s.socials.blog)     socialLines.push(`[![Blog](https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=blogger&logoColor=white)](${s.socials.blog})`);
  if (s.socials.twitter)  socialLines.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${s.socials.twitter})`);
  if (s.socials.linkedin) socialLines.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${s.socials.linkedin})`);
  if (s.socials.zhihu)    socialLines.push(`[![Zhihu](https://img.shields.io/badge/Zhihu-0084FF?style=for-the-badge&logo=zhihu&logoColor=white)](https://www.zhihu.com/people/${s.socials.zhihu})`);
  if (s.socials.bilibili) socialLines.push(`[![Bilibili](https://img.shields.io/badge/Bilibili-00A1D6?style=for-the-badge&logo=bilibili&logoColor=white)](https://space.bilibili.com/${s.socials.bilibili})`);

  if (socialLines.length) {
    out.push(`### 🤝 Connect with me`);
    out.push('');
    out.push(...socialLines);
    out.push('');
  }

  // ----- Footer -----
  out.push(`---`);
  out.push('');
  out.push(`<sub>✏️ Maintained via the [Year of Wonder Profile Editor](https://silverenternal.github.io/cinematic-3d/editor.html)</sub>`);
  out.push('');

  return out.join(nl);
}

function escape(s) {
  return String(s).replace(/[<>]/g, (c) => ({ '<': '&lt;', '>': '&gt;' })[c]);
}
