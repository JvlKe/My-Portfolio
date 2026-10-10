import {profile,projects} from './portfolio-data.js';
import {icon,escapeHTML,chips,external} from './ui.js';
import {views,projectCard} from './views.js';
import {getAssistantReply} from './assistant.js';
const nav=[['overview','Overview'],['about','About me'],['projects','Projects'],['skills','Skills'],['education','Education'],['learning','Learning'],['resume','Resume'],['contact','Contact']];
const readPref=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const savePref=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
document.documentElement.dataset.theme=readPref('theme','dark');
document.querySelector('#app').innerHTML=`
<aside class="sidebar" id="sidebar"><a class="brand" href="#overview"><span class="brand-mark">jv<span>↗</span></span><span class="nav-label">John’s portfolio<span class="version">DATA &amp; VISUALIZATION</span></span></a>
<button class="icon-button collapse-button" id="collapse" aria-label="Collapse sidebar" aria-expanded="true" title="Collapse sidebar">${icon('collapse')}</button>
<div class="sidebar-profile"><div class="avatar">JV</div><div class="nav-label"><strong>Joalnes John</strong><span>Computer Science · Data &amp; Visualization</span></div></div>
<span class="nav-caption nav-label">WORKSPACE</span><nav aria-label="Main navigation">${nav.map(([id,label])=>`<a href="#${id}" data-nav="${id}" title="${label}">${icon(id)}<span class="nav-label">${label}</span>${id==='projects'?`<span class="nav-count nav-label">${String(projects.length).padStart(2,'0')}</span>`:''}</a>`).join('')}</nav>
<div class="sidebar-bottom"><button class="assistant-launch" data-ai title="Open Portfolio AI">${icon('ai')}<span class="nav-label">Ask about me</span></button><button class="theme-button" id="theme" title="Toggle theme">${icon('theme')}<span class="nav-label">Switch theme</span></button><div class="sidebar-foot nav-label"><span class="status">Open to internships</span><small>Built with curiosity.</small></div></div></aside>
<div class="sidebar-backdrop" id="nav-backdrop" hidden></div>
<div class="app-main"><header class="topbar"><div class="breadcrumb"><button class="icon-button mobile-menu" id="menu" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar">${icon('menu')}</button><span>Portfolio</span><span class="muted">/</span><strong id="crumb">Overview</strong></div><div class="top-actions"><a href="#resume" class="text-button">${icon('resume')}<span>Resume</span></a><button class="icon-button" data-ai title="Open Portfolio AI" aria-label="Open Portfolio AI">${icon('ai')}</button><a href="#contact" class="top-avatar" aria-label="Contact Joalnes">JV</a></div></header><main id="workspace" tabindex="-1"></main><footer class="app-footer"><span>JOALNES JOHN D. VENDER</span><span>Data analysis & visualization · Portfolio</span></footer></div>
<dialog id="project-dialog" aria-labelledby="project-title"><button class="icon-button dialog-close" id="close-project" aria-label="Close project">${icon('close')}</button><div id="project-detail"></div></dialog>
<dialog id="ai-dialog" class="ai-dialog" aria-labelledby="ai-title"><header class="ai-header"><span class="ai-symbol">${icon('ai')}</span><div><h2 id="ai-title" tabindex="-1">Portfolio AI</h2><span class="small muted">Portfolio questions & answers</span></div><button class="icon-button" id="close-ai" aria-label="Close assistant">${icon('close')}</button></header><div class="chat-history" id="chat-history" role="log" aria-live="polite"><div class="chat-message assistant">Hi, welcome to my portfolio. I can help with recruiter questions about Joalnes’s background, OJT goals, skills, and project work.</div></div><div class="suggestions">${['Can you introduce Joalnes?','What OJT role and work setup is he seeking?','What data and visualization skills does he bring?','Which project best shows his analytical strengths?','What was his contribution to the Chami thesis?','What education and credentials does he have?','How can I contact him?'].map(q=>`<button data-question="${q}">${q}</button>`).join('')}</div><form id="chat-form"><label class="sr-only" for="chat-input">Ask about Joalnes</label><input id="chat-input" placeholder="Ask about Joalnes…" maxlength="1000" required autocomplete="off"><button class="icon-button" aria-label="Send message">${icon('arrow')}</button></form><p class="ai-disclaimer">Questions are processed by Gemini, with Groq as backup. Repeated answers may be reused for an hour. Avoid private information.</p></dialog>`;
const suggestionBox=document.querySelector('.suggestions');
const makeSuggestionTrack=(buttons,reverse=false)=>{
 const track=document.createElement('div');
 track.className=`suggestions-track${reverse?' suggestions-track-reverse':''}`;
 const group=document.createElement('div');
 group.className='suggestions-group';
 group.append(...buttons);
 const duplicate=group.cloneNode(true);
 duplicate.setAttribute('aria-hidden','true');
 duplicate.inert=true;
 duplicate.querySelectorAll('button').forEach(button=>button.tabIndex=-1);
 track.append(group,duplicate);
 return track;
};
const suggestionButtons=[...suggestionBox.querySelectorAll('button')];
suggestionBox.replaceChildren(makeSuggestionTrack(suggestionButtons.slice(0,4)),makeSuggestionTrack(suggestionButtons.slice(4),true));
suggestionBox.setAttribute('role','region');
suggestionBox.setAttribute('aria-label','Suggested questions');
const sidebar=document.querySelector('#sidebar'), menu=document.querySelector('#menu'), backdrop=document.querySelector('#nav-backdrop');
function closeNav(){document.body.classList.remove('nav-open');backdrop.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.title='Open navigation';sidebar.inert=matchMedia('(max-width: 760px)').matches;}
menu.onclick=()=>{document.body.classList.add('nav-open');backdrop.hidden=false;menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Close navigation');menu.title='Close navigation';sidebar.inert=false;sidebar.querySelector('[aria-current="page"]').focus();};
backdrop.onclick=()=>{closeNav();menu.focus();};
document.querySelector('#collapse').onclick=()=>{const value=document.body.classList.toggle('collapsed');const label=value?'Expand sidebar':'Collapse sidebar';const button=document.querySelector('#collapse');button.setAttribute('aria-expanded',String(!value));button.setAttribute('aria-label',label);button.title=label;savePref('sidebar',value?'collapsed':'expanded');};
if(readPref('sidebar','expanded')==='collapsed')document.querySelector('#collapse').click();
document.querySelector('#theme').onclick=()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;savePref('theme',theme);};
const workspace=document.querySelector('#workspace');
let revealObserver;
function revealCurrentView(){
 revealObserver?.disconnect();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const targets=workspace.querySelectorAll('.dashboard > *, .project-grid > *, .two-col > *, .credential-grid > *, .overview-footer, .section-heading, .skill-context, .timeline article, .stack > *');
 revealObserver=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -36px 0px'});
 targets.forEach((element,index)=>{element.classList.add('scroll-reveal');element.style.setProperty('--reveal-delay',`${(index%4)*65}ms`);element.addEventListener('animationend',()=>{element.classList.remove('scroll-reveal','is-revealed');element.style.removeProperty('--reveal-delay');},{once:true});revealObserver.observe(element);});
}
function route(focus=true){const raw=location.hash.slice(1).split('/')[0];const aliases={home:'overview',certifications:'learning'};const id=aliases[raw]||raw||'overview';const selected=views[id]?id:'overview';workspace.innerHTML=views[selected]();revealCurrentView();document.querySelector('#crumb').textContent=nav.find(n=>n[0]===selected)[1];document.title=nav.find(n=>n[0]===selected)[1]+' · Joalnes John Vender';document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});closeNav();window.scrollTo(0,0);if(focus)workspace.querySelector('h1').focus({preventScroll:true});}
window.addEventListener('hashchange',()=>route());route(false);
matchMedia('(max-width: 760px)').addEventListener('change',closeNav);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('nav-open')){closeNav();menu.focus();}if(event.key==='Tab'&&document.body.classList.contains('nav-open')){const items=[...sidebar.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
const projectDialog=document.querySelector('#project-dialog'), aiDialog=document.querySelector('#ai-dialog');
let aiCloseTimer;
function openAiDialog(focusInput=false){clearTimeout(aiCloseTimer);aiDialog.classList.remove('is-closing');if(!aiDialog.open)aiDialog.show();document.querySelector(focusInput?'#chat-input':'#ai-title').focus({preventScroll:true});}
function closeAiDialog(){if(!aiDialog.open||aiDialog.classList.contains('is-closing'))return;aiDialog.classList.add('is-closing');aiCloseTimer=setTimeout(()=>{aiDialog.close();aiDialog.classList.remove('is-closing');},220);}
document.querySelector('#close-project').onclick=()=>projectDialog.close();
document.querySelector('#close-ai').onclick=closeAiDialog;
for(const dialog of [projectDialog,aiDialog])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(dialog===aiDialog)closeAiDialog();else dialog.close();}}});
document.addEventListener('click',async e=>{
 const project=e.target.closest('[data-project]');
 if(project){const p=projects.find(p=>p.id===project.dataset.project);document.querySelector('#project-detail').innerHTML=`<span class="eyebrow">${p.type} / ${p.status}</span><h2 id="project-title">${p.name}</h2><p>${p.description}</p>${chips(p.tech)}${p.features.length?`<h3>Features</h3><ul class="feature-list">${p.features.map(f=>`<li>${icon('check')}${f}</li>`).join('')}</ul>`:''}${p.contribution?`<h3>My contribution</h3><p>${p.contribution}</p>`:''}<div class="detail-note">${p.note}</div><div class="actions">${p.website?external(p.website,'Live website','button primary'):''}${p.demo?external(p.demo,'Open demo','button primary'):''}${p.github?external(p.github,p.demo?'View source':'GitHub profile'):''}</div>`;projectDialog.showModal();}
 if(e.target.closest('[data-ai]')){closeNav();openAiDialog(true);}
 const filter=e.target.closest('[data-filter]');if(filter){document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',String(b===filter));});const value=filter.dataset.filter;document.querySelector('#project-results').innerHTML=projects.filter(p=>value==='All'||p.status===value).map(p=>projectCard(p)).join('');}
 if(e.target.closest('#copy-email')){const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(profile.email);status.textContent='Email copied.';}catch{status.textContent='Copy this address: '+profile.email;}}
 const question=e.target.closest('[data-question]');if(question)sendMessage(question.dataset.question);
});
let sending=false;
async function sendMessage(message){if(sending||!message.trim())return;sending=true;const history=document.querySelector('#chat-history');const append=(role,text)=>{const node=document.createElement('div');node.className='chat-message '+role;node.textContent=text;history.append(node);history.scrollTop=history.scrollHeight;};append('user',message);document.querySelector('#chat-input').value='';try{append('assistant',await getAssistantReply(message));}catch{append('assistant','Something went wrong. Please try again or use the Contact view.');}finally{sending=false;document.querySelector('#chat-input').focus();}}
document.querySelector('#chat-form').onsubmit=e=>{e.preventDefault();sendMessage(document.querySelector('#chat-input').value.trim());};
requestAnimationFrame(()=>openAiDialog());
