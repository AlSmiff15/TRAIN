(()=>{'use strict';
const el=id=>document.getElementById(id), cfg=window.TRAIN_CONFIG||{}, base=(cfg.supabaseUrl||'').replace(/\/$/,''), apiKey=cfg.supabaseAnonKey||'';
const SESSION='train_cloud_session_v1', PREFIX='train_cloud_user_', PENDING='train_cloud_pending_';
let session=null, user=null, syncTimer=null, syncing=false, started=false;
const status=s=>{const node=el('cloudState');if(node)node.textContent=s};
const error=s=>{el('authError').textContent=s||''};
const headers=(access)=>({'apikey':apiKey,'Content-Type':'application/json',...(access?{'Authorization':'Bearer '+access}:{})});
async function call(url,opts={}) {let r;try{r=await fetch(base+url,opts)}catch(e){throw Error('Network unavailable. Reconnect and retry.')} let body=await r.text();let parsed;try{parsed=body?JSON.parse(body):null}catch(e){parsed={message:body}}if(!r.ok)throw Error(parsed?.msg||parsed?.error_description||parsed?.message||parsed?.error||('Request failed: '+r.status));return parsed;}
function remember(s){session=s; user=s?.user||null;if(s)localStorage.setItem(SESSION,JSON.stringify(s));else localStorage.removeItem(SESSION)}
function getLocalKey(){return PREFIX+user.id}
function pendingKey(){return PENDING+user.id}
function isPending(){return localStorage.getItem(pendingKey())==='1'}
async function fresh(){if(!session)return false;const expires=Number(session.expires_at||0);if(expires>Date.now()/1000+90)return true;if(!navigator.onLine)return true;try{const s=await call('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:headers(),body:JSON.stringify({refresh_token:session.refresh_token})});remember(s);return true}catch(e){return false}}
async function remoteLoad(){if(!navigator.onLine||!(await fresh()))return null;const rows=await call('/rest/v1/train_data?select=payload,updated_at&limit=1',{headers:headers(session.access_token)});return rows?.[0]||null}
async function remoteSave(json){if(!navigator.onLine||!(await fresh()))throw Error('Offline or session expired');await call('/rest/v1/train_data?on_conflict=user_id',{method:'POST',headers:{...headers(session.access_token),'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify([{user_id:user.id,payload:JSON.parse(json),updated_at:new Date().toISOString()}])});}
async function syncNow(){if(syncing||!started||!user||!navigator.onLine)return;syncing=true;try{status('Syncing…');const k=getLocalKey(),json=localStorage.getItem(k);if(!json){status('Cloud ready');return}await remoteSave(json);localStorage.removeItem(pendingKey());status('✓ Synced')}catch(e){status('Saved offline');console.warn('TRAIN cloud sync:',e.message)}finally{syncing=false}}
function queue(json){if(!user)return;localStorage.setItem(pendingKey(),'1');status('Saved locally');clearTimeout(syncTimer);syncTimer=setTimeout(syncNow,850)}
window.TRAIN_SYNC_CHANGE=queue;
async function begin(s){remember(s);if(!user?.id)throw Error('Account response missing user ID');el('trainAccountButton').textContent=(user.email||'Account').split('@')[0];window.TRAIN_USER_KEY=getLocalKey();
  const k=getLocalKey();let local=localStorage.getItem(k), remote=null;
  if(navigator.onLine){try{status('Loading account…');remote=await remoteLoad()}catch(e){status('Offline copy');console.warn(e)}}
  // Never overwrite pending offline changes. Otherwise cloud data is authoritative.
  if(remote&&!isPending()){localStorage.setItem(k,JSON.stringify(remote.payload));local=localStorage.getItem(k)}
  if(!remote&&local&&!isPending()&&navigator.onLine)localStorage.setItem(pendingKey(),'1');
  el('trainAuthScreen').hidden=true;error('');
  if(!started){started=true;const scr=document.createElement('script');scr.src='./train-core.js';scr.onerror=()=>{status('Load error');alert('Could not load workout app. Refresh while online.')};document.body.appendChild(scr)}
  if(isPending())setTimeout(syncNow,1500);else status(navigator.onLine?'✓ Synced':'Saved offline');
}
async function signIn(email,password){return call('/auth/v1/token?grant_type=password',{method:'POST',headers:headers(),body:JSON.stringify({email,password})})}
function showAuth(){el('trainAuthScreen').hidden=false;}
async function logout(){if(isPending()&&!navigator.onLine){alert('You have unsynchronised workouts. Connect to the internet before signing out.');return}if(isPending())await syncNow();if(isPending()){alert('Cloud sync has not finished. Try again when online.');return}if(!confirm('Sign out of TRAIN on this device?'))return;try{if(navigator.onLine&&session)await call('/auth/v1/logout',{method:'POST',headers:headers(session.access_token)})}catch(e){}remember(null);location.reload()}
async function bootstrap(){if(!base.startsWith('https://')||!apiKey){showAuth();el('authNotice').textContent='Setup needed: add your Supabase Project URL and public key to train-config.js, then publish the files.';el('authForm').querySelector('button').disabled=true;el('signUpButton').disabled=true;return}
  try{const old=JSON.parse(localStorage.getItem(SESSION)||'null');if(old?.user?.id){session=old;user=old.user;if(await fresh()){await begin(session);return}remember(null)}}catch(e){console.warn('Sign in required',e)}showAuth()}
window.addEventListener('online',async()=>{if(user){if(!isPending()){try{const remote=await remoteLoad();if(remote){const k=getLocalKey(),loc=localStorage.getItem(k),str=JSON.stringify(remote.payload);if(str!==loc){status('Cloud changed; reopen app to load latest data');return}}}catch(e){}}syncNow()}});
el('authForm').addEventListener('submit',async e=>{e.preventDefault();error('');try{el('signInButton').disabled=true;const s=await signIn(el('trainEmail').value.trim(),el('trainPassword').value);await begin(s)}catch(e){error(e.message)}finally{el('signInButton').disabled=false}});
el('signUpButton').onclick=async()=>{error('');try{const email=el('trainEmail').value.trim(),password=el('trainPassword').value;if(!email||password.length<8){error('Enter an email and password of at least 8 characters.');return}await call('/auth/v1/signup',{method:'POST',headers:headers(),body:JSON.stringify({email,password})});error('Account request submitted. Check your email for the confirmation link, then return here to sign in.')}catch(e){error(e.message)}};
el('resetPasswordButton').onclick=async()=>{error('');try{const email=el('trainEmail').value.trim();if(!email){error('Enter your email first.');return}await call('/auth/v1/recover',{method:'POST',headers:headers(),body:JSON.stringify({email})});error('If that email has an account, a recovery email has been sent.')}catch(e){error(e.message)}};
el('trainAccountButton').onclick=logout;
bootstrap();
})();
