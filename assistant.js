import {projects,skills,profile,credentials} from './portfolio-data.js';
// Saved answers are used when AI is unavailable.
export function getLocalAssistantReply(message) {
 const text=message.toLowerCase();
 if(/contribut|role|personally|solo|team/.test(text)) return projects.map(p=>`${p.name}: ${p.contribution}`).join('\n\n');
 if(/contact|email|reach/.test(text)) return `You can contact Joalnes at ${profile.email}, or connect through the Contact view.`;
 if(/capstone|thesis|chami/.test(text)) return (()=>{const p=projects.find(p=>p.id==='chami');return `${p.name}: ${p.description} ${p.contribution} ${p.note}`;})();
 if(/smarttrip|smart trip|travel/.test(text)) return projects.find(p=>p.id==='smarttripph').description + ' He used Supabase, Vercel, and Render for this project.';
 if(/firebase/.test(text)) return 'OnlyFunds uses Firebase, but a teammate implemented it. Firebase is not listed as Joalnes’s personal skill.';
 if(/learn|course|certif/.test(text)) return `His listed credentials include ${credentials.map(c=>c.name).join(', ')}. Chami is his ongoing thesis project.`;
 if(/tech|skill|language/.test(text)) return `His toolkit includes ${Object.values(skills).flat().join(', ')}. Explore Skills for the full breakdown.`;
 if(/intern|relevant/.test(text)) return 'He is seeking a Data Analyst internship. OnlyFunds includes student budget tracking, while SmartTrip Planner PH includes travel budgets and itinerary management. Firebase integration in OnlyFunds was handled by a teammate.';
 if(/project|built/.test(text)) return projects.map(p=>`${p.name}: ${p.description}`).join('\n\n');
 return 'I’m a local demo assistant with preset answers, not a connected AI. Try asking about projects, technologies, learning, internship fit, or contact details.';
}
const replies=new Map();
export async function getAssistantReply(message){
 if(typeof window==='undefined'||/contact|email|phone|reach/i.test(message))return getLocalAssistantReply(message);
 const question=message.trim().replace(/\s+/g,' ');
 const version=JSON.stringify({projects,skills});
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
