import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {profile,projects,credentials} from './portfolio-data.js';
import {views} from './views.js';
import {getAssistantReply} from './assistant.js';
import {escapeHTML} from './ui.js';

// Check generated views and preserved local destinations without a build dependency.
assert.equal(Object.keys(views).length,8);
assert.equal(credentials.length,8);
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
assert.match(await getAssistantReply('projects'),/OnlyFunds/);
assert.equal(escapeHTML('<script>'), '&lt;script&gt;');
assert.ok(!readFileSync('index.html','utf8').includes('href="style.css"'),'V2 should use its own stylesheet');
console.log('Passed: 8 views, all local destinations, 3 projects, 8 credentials, and assistant fact checks.');
