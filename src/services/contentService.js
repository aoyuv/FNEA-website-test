import { asset } from '../lib/utils';
import { supabase,isSupabaseConfigured } from '../lib/supabase';

export const COLLECTIONS={siteConfig:'site-config.json',services:'services.json',activities:'activities.json',news:'news.json',members:'members.json',branches:'branches.json',gallery:'gallery.json',videos:'videos.json',faq:'faq.json',guide:'guide.json'};
async function readJson(file){const res=await fetch(asset(`/data/${file}`),{cache:'no-cache'});if(!res.ok)throw new Error(`Failed to load ${file}: ${res.status}`);return res.json();}
async function readTable(table){const {data,error}=await supabase.from(table).select('*').order(table==='members'?'display_order':'created_at',{ascending:table==='members'});if(error)throw error;return data||[];}
export async function loadAllContent(){
 const entries=await Promise.all(Object.entries(COLLECTIONS).map(async([key,file])=>{
  if(isSupabaseConfigured&&['news','activities','members','branches'].includes(key)){try{return[key,await readTable(key)];}catch(e){console.warn(`Supabase ${key} unavailable; using local content`,e);return[key,await readJson(file)];}}
  return[key,await readJson(file)];
 }));
 const data=Object.fromEntries(entries);
 data.news=[...data.news].filter(x=>x.published!==false).sort((a,b)=>(b.published_at||b.date||'').localeCompare(a.published_at||a.date||''));
 const today=new Date().toISOString().slice(0,10);const upcoming=data.activities.filter(a=>(a.date||'')>=today).sort((a,b)=>(a.date||'').localeCompare(b.date||''));const past=data.activities.filter(a=>(a.date||'')<today).sort((a,b)=>(b.date||'').localeCompare(a.date||''));data.activities=[...upcoming,...past];
 data.members=[...data.members].filter(x=>x.active!==false).sort((a,b)=>(a.display_order??a.order??0)-(b.display_order??b.order??0));data.branches=[...data.branches].filter(x=>x.active!==false);return data;
}
export const create=async(table,item)=>{if(!isSupabaseConfigured)throw new Error('Supabase غير مربوط');const {data,error}=await supabase.from(table).insert(item).select().single();if(error)throw error;return data;};
export const update=async(table,id,item)=>{if(!isSupabaseConfigured)throw new Error('Supabase غير مربوط');const {data,error}=await supabase.from(table).update(item).eq('id',id).select().single();if(error)throw error;return data;};
export const remove=async(table,id)=>{if(!isSupabaseConfigured)throw new Error('Supabase غير مربوط');const {error}=await supabase.from(table).delete().eq('id',id);if(error)throw error;};
