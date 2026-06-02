// Config: set your GitHub username here to autoload repositories
const GITHUB_USERNAME = 'GokulS'; // replace with actual username

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initSmoothNav();
  loadGitHubRepos();
});

function initSmoothNav(){
  // Add active link highlighting on scroll (simple)
  const sections = [...document.querySelectorAll('main section')];
  const links = [...document.querySelectorAll('.nav-links a')];
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>l.classList.toggle('active', l.getAttribute('href')===('#'+e.target.id)));
      }
    });
  },{threshold:0.45});
  sections.forEach(s=>observer.observe(s));
}

async function loadGitHubRepos(){
  const container = document.getElementById('github-repos');
  if(!GITHUB_USERNAME){ container.innerHTML = '<p class="muted">Set a GitHub username in <code>script.js</code>.</p>'; return; }
  try{
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if(!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    if(!repos.length) { container.innerHTML = '<p class="muted">No repositories found.</p>'; return; }
    container.innerHTML = '';
    repos.forEach(r=>{
      const el = document.createElement('a');
      el.className = 'repo';
      el.href = r.html_url; el.target = '_blank'; el.rel='noopener';
      el.innerHTML = `<strong>${r.name}</strong><p class="muted-small">${r.description||''}</p><div class="muted">★ ${r.stargazers_count} • Forks ${r.forks_count}</div>`;
      container.appendChild(el);
    });
  }catch(err){
    container.innerHTML = '<p class="muted">Unable to load repositories (rate limit or offline). Please try later.</p>';
    console.warn(err);
  }
}
