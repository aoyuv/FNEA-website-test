import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const TABLES = ['news','activities','members','branches'];
const ensure = () => { if (!isSupabaseConfigured) throw new Error('Supabase غير مربوط بعد. أضف VITE_SUPABASE_URL وVITE_SUPABASE_ANON_KEY.'); };
export async function getSessionProfile() {
 ensure();
 const {data:{user},error}=await supabase.auth.getUser(); if(error) throw error;
 if(!user) return {user:null,profile:null};
 const {data:profile,error:e}=await supabase.from('profiles').select('id,full_name,role').eq('id',user.id).single();
 if(e) throw e; return {user,profile};
}
export async function signIn(email,password){ensure();const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;return getSessionProfile();}
export async function signOut(){if(supabase) await supabase.auth.signOut();}
export async function fetchRows(table,{limit=100}={}){ensure();const {data,error}=await supabase.from(table).select('*').order('created_at',{ascending:false}).limit(limit);if(error)throw error;return data||[];}
export async function saveRow(table,row){
 ensure(); if(!TABLES.includes(table))throw new Error('جدول غير مسموح');
 const payload={...row};delete payload.created_at;delete payload.updated_at;
 const {data,error}=payload.id?await supabase.from(table).update(payload).eq('id',payload.id).select().single():await supabase.from(table).insert(payload).select().single();
 if(error)throw error;return data;
}
export async function deleteRow(table,id){ensure();if(!TABLES.includes(table))throw new Error('جدول غير مسموح');const {error}=await supabase.from(table).delete().eq('id',id);if(error)throw error;}
export async function fetchConcerns(){ensure();const {data,error}=await supabase.from('concerns').select('*').order('created_at',{ascending:false}).limit(300);if(error)throw error;return data||[];}
export async function updateConcern(id,patch){ensure();const {data,error}=await supabase.from('concerns').update(patch).eq('id',id).select().single();if(error)throw error;return data;}
export async function uploadMedia(file){
 ensure();const ext=file.name.split('.').pop()?.toLowerCase()||'bin';const path=`${Date.now()}-${crypto.randomUUID()}.${ext}`;
 const {error}=await supabase.storage.from('fnea-media').upload(path,file,{upsert:false,contentType:file.type});if(error)throw error;
 return supabase.storage.from('fnea-media').getPublicUrl(path).data.publicUrl;
}
