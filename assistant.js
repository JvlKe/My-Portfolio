import {projects,skills,profile,learningCredentials} from './portfolio-data.js';
// Saved answers are used when AI is unavailable.
export function getLocalAssistantReply(message) {
 const text=message.toLowerCase();
 if(/capstone|thesis|chami/.test(text)){const p=projects.find(p=>p.id==='chami');return `${p.name}: ${p.description} ${p.contribution} ${p.note}`;}
 if(/smarttrip/.test(text)){const p=projects.find(p=>p.id==='smarttrip');return `${p.name}: ${p.description} ${p.contribution}`;}
 if(/introduc|background|who is|about joalnes/.test(text)) return `${profile.name} is a ${profile.year} ${profile.course} student at ${profile.school}, focused on data analysis, research, and visualization. He is seeking a Data Analyst OJT or internship.`;
 if(/contact|email|reach/.test(text)) return `You can contact Joalnes at ${profile.email}, or connect through the Contact view.`;
 if(/which project|project.*(analyt|data|visual)|analyt.*project/.test(text)) return 'Chami best demonstrates his research data visualization and technical presentation contributions. SmartTrip Planner PH is his individually completed APSI project.';
 if(/learn|course|certif|credential|education|academic/.test(text)) return `He is a ${profile.year} ${profile.course} student at ${profile.school}. His listed credentials include ${learningCredentials.map(c=>c.name).join(', ')}.`;
 if(/data|visual|analyt|tech|skill|language|tool/.test(text)) return `His data-related experience includes research data visualization and information design. His listed tools include Python, SQL (MySQL), Supabase, and Figma; see Skills for his full toolkit.`;
 if(/intern|relevant|ojt|availability|work setup/.test(text)) return 'He is seeking a Data Analyst OJT or internship and is open to on-site, hybrid, or remote arrangements.';
 if(/contribut|role|personally|solo|team/.test(text)) return projects.map(p=>`${p.name}: ${p.contribution}`).join('\n\n');
 if(/project|built/.test(text)) return projects.map(p=>`${p.name}: ${p.description}`).join('\n\n');
 return 'I’m a local demo assistant with preset answers, not a connected AI. Try asking about projects, technologies, learning, internship fit, or contact details.';
}
const replies=new Map();
export async function getAssistantReply(message){
 if(typeof window==='undefined'||/contact|email|phone|reach/i.test(message))return getLocalAssistantReply(message);
 const question=message.trim().replace(/\s+/g,' ');
 const version=JSON.stringify({projects,skills,profile:{name:profile.name,school:profile.school,course:profile.course,year:profile.year},credentials:learningCredentials.map(({issuer,name})=>({issuer,name}))});
 const key=version+question;
 let stored;
 try{stored=JSON.parse(sessionStorage.getItem('portfolio-ai-cache')||'{}');}catch{stored={};}
 const saved=replies.get(key)||stored[key];
 if(saved&&saved.expires>Date.now())return saved.reply;
 try{
  const result=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question}),signal:AbortSignal.timeout(24000)});
  if(result.ok){
   const data=await result.json();
   if(typeof data.reply==='string'&&data.reply.trim()){
    const item={reply:data.reply,expires:Date.now()+3600000};
    if(replies.size>=50)replies.delete(replies.keys().next().value);
    replies.set(key,item);
    try{sessionStorage.setItem('portfolio-ai-cache',JSON.stringify(Object.fromEntries(replies)));}catch{}
    return data.reply;
   }
  }
 }catch{}
 return 'AI is temporarily unavailable. Saved portfolio answer: '+getLocalAssistantReply(message);
}
