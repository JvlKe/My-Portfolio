import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {profile,projects,credentials,learningCredentials} from './portfolio-data.js';
import {views} from './views.js';
import {getAssistantReply} from './assistant.js';
import {escapeHTML} from './ui.js';

// Check generated views and preserved local destinations without a build dependency.
assert.equal(Object.keys(views).length,8);
assert.equal(credentials.length,8);
assert.ok(views.overview().includes(`${String(learningCredentials.length).padStart(2,'0')} <small>credentials</small>`));
for(const [name,render] of Object.entries(views)){
  const html=render();
  assert.match(html,/<h1[ >]/,name+' needs a page heading');
  assert.ok(!html.includes('undefined'),name+' contains an undefined value');
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const url=match[1];
    if(url.startsWith('#')) assert.ok(views[url.slice(1)],'Unknown view '+url);
    else if(!/^(https?:|mailto:|tel:)/.test(url)) assert.ok(existsSync(url),'Missing file '+url);
  }
}
for(const project of projects){
  assert.ok(project.name&&project.description);
  if(project.demo) assert.ok(existsSync(project.demo));
}
assert.ok(existsSync(profile.resume));
assert.match(await getAssistantReply('Tell me about his capstone'),/Chami/);
assert.match(await getAssistantReply('contact'),/johnvender25@gmail.com/);
assert.match(await getAssistantReply('projects'),/Chami/);
const recruiterQuestions=['Can you introduce Joalnes?','What OJT role and work setup is he seeking?','What data and visualization skills does he bring?','Which project best shows his analytical strengths?','What was his contribution to the Chami thesis?','What education and credentials does he have?','How can I contact him?'];
const recruiterAnswers=await Promise.all(recruiterQuestions.map(question=>getAssistantReply(question)));
for(const answer of recruiterAnswers) assert.ok(answer&&!answer.includes('local demo assistant'),'Recruiter prompt needs a useful saved answer');
assert.match(recruiterAnswers[3],/Chami best demonstrates/);
assert.match(recruiterAnswers[5],/Holy Angel University.*Cloud Foundations/);
assert.deepEqual(projects.map(project=>project.id),['chami','smarttrip']);
assert.equal(projects.find(project=>project.id==='smarttrip')?.github,'https://github.com/JvlKe/smarttrip-planner-ph.git');
assert.equal(escapeHTML('<script>'), '&lt;script&gt;');
assert.ok(!readFileSync('index.html','utf8').includes('href="style.css"'),'V2 should use its own stylesheet');
console.log(`Passed: 8 views, all local destinations, ${projects.length} projects, 8 credentials, and assistant fact checks.`);
