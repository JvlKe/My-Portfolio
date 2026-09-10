import {projects,skills,profile,credentials} from './portfolio-data.js';
// Replace this adapter with a server endpoint later. Never put API secrets in client code.
export async function getAssistantReply(message) {
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
