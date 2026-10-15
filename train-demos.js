(()=>{'use strict';
const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const patterns=[
[/tibialis|toe raise/i,'ankle','Feet planted, lift your toes toward your shins.','Keep heels grounded and use slow controlled repetitions.'],
[/calf|soleus|heel raise/i,'calf','Press through the ball of your foot to raise your heel.','Pause at the top and lower slowly; keep the knee bent for soleus exercises.'],
[/squat|wall sit/i,'squat','Keep feet stable and bend your hips and knees together.','Lower only as far as comfortably controlled; knees track with toes.'],
[/step.down|step.up|split squat|lunge|bulgarian/i,'lunge','Keep your pelvis level and lower through your working leg.','Use support if needed; keep knee aligned with foot.'],
[/deadlift|hinge|good morning|pull.through/i,'hinge','Push your hips back while keeping a controlled spine position.','Keep the load close and stop before your back rounds.'],
[/glute bridge|hip thrust/i,'bridge','Drive through your heels to lift your hips.','Avoid overextending your lower back.'],
[/bench|push.up|chest press|floor press/i,'press','Lower the resistance with control, then press away.','Keep shoulders stable and wrists aligned.'],
[/overhead|shoulder press|arnold press/i,'overhead','Press overhead without arching your lower back.','Keep your ribs down and use a comfortable range.'],
[/row|pulldown|pull.up|chin.up|face pull/i,'pull','Pull toward your body while controlling your shoulder blades.','Avoid shrugging or swinging the weight.'],
[/plank|dead bug|bird dog|pallof/i,'core','Brace your trunk while moving slowly and breathing normally.','Keep your spine controlled; shorten the lever if needed.'],
[/abduction|clamshell|side.lying|lateral band/i,'hip','Move from your hip without rotating your pelvis.','Prioritise a small controlled range over momentum.'],
[/adductor|copenhagen/i,'hip','Control the inner thigh as your body moves.','Start with a shorter lever and stop if you feel groin pain.'],
[/ankle mobil|knee.to.wall|mobility|stretch/i,'mobility','Move gently through a comfortable available range.','Do not force the joint into a painful stretch.'],
[/short.foot|toe yoga|balance reach|single.leg balance/i,'balance','Stay tall as you balance and control your foot arch.','Use fingertip support if stability is difficult.'],
[/curl|triceps|extension|raise|fly/i,'arm','Move the joint with a controlled range and steady torso.','Avoid swinging or using momentum.']
];
function classify(name){return patterns.find(p=>p[0].test(name))||[null,'general','Move smoothly through a pain free range.','Use a light load while learning and ask a qualified coach to check technique.']}
const P={
stand:[[150,66],[150,102],[150,148],[118,180],[182,180],[133,120],[167,120]],
squat:[[150,76],[150,116],[150,151],[114,160],[189,160],[129,137],[171,137]],
hinge:[[184,87],[167,117],[144,147],[117,179],[168,178],[165,144],[194,130]],
lunge:[[150,67],[150,106],[143,151],[106,171],[188,184],[130,128],[172,129]],
calf:[[150,62],[150,103],[150,145],[120,177],[180,177],[132,117],[168,117]],
press:[[150,68],[150,106],[150,147],[120,182],[180,182],[119,75],[181,75]],
overhead:[[150,68],[150,106],[150,147],[120,182],[180,182],[130,34],[170,34]],
pull:[[155,68],[151,107],[150,147],[120,182],[180,182],[105,106],[195,106]],
core:[[150,65],[150,107],[150,147],[120,181],[180,181],[115,122],[185,122]],
bridge:[[95,143],[132,145],[165,139],[192,170],[129,181],[110,166],[152,166]],
hip:[[150,66],[150,106],[150,147],[113,181],[202,159],[133,124],[167,124]],
mobility:[[150,69],[150,108],[150,147],[108,181],[180,176],[132,130],[168,130]],
balance:[[150,66],[150,105],[150,147],[147,184],[197,149],[132,123],[168,123]],
arm:[[150,66],[150,105],[150,147],[120,182],[180,182],[132,148],[170,146]]
};
function figure(points){const [head,neck,hip,foot1,foot2,hand1,hand2]=points;const line=(a,b)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;return `<g fill="none" stroke="#a9f8be" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="${head[0]}" cy="${head[1]}" r="13"/>${line([head[0],head[1]+13],neck)}${line(neck,hip)}${line(hip,foot1)}${line(hip,foot2)}${line(neck,hand1)}${line(neck,hand2)}</g>`}
function draw(kind){let a=P.stand,b=P[kind]||P.arm;if(kind==='press'){a=P.press;b=P.overhead}if(kind==='hinge'){a=P.stand;b=P.hinge}if(kind==='calf'){a=P.stand;b=P.calf.map((p,i)=>i===3||i===4?[p[0],p[1]-17]:[p[0],p[1]-7])}if(kind==='core'){a=P.core;b=P.hinge}if(kind==='general'){a=P.stand;b=P.squat}return `<svg role="img" aria-label="Looping schematic showing the start and finish positions; not a substitute for professional instruction" viewBox="0 0 300 210"><path d="M25 191H275" stroke="#4c677e" stroke-width="2"/><g class="poseA">${figure(a)}</g><g class="poseB">${figure(b)}</g><text x="150" y="207" text-anchor="middle" fill="#9ab3cb" font-size="11">START ⇄ FINISH · SCHEMATIC</text></svg>`}
function open(name){name=(name||'').trim();if(!name){alert('Enter an exercise name to view guidance.');return}close();const [_,kind,cue,tip]=classify(name);const overlay=document.createElement('div');overlay.className='demoOverlay';overlay.id='trainDemoOverlay';overlay.setAttribute('role','presentation');overlay.innerHTML=`<div class="demoPanel" role="dialog" aria-modal="true" aria-label="Exercise demonstration"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h2>${esc(name)}</h2><p style="margin:0 0 10px">Movement illustration and coaching cues</p></div><button type="button" class="demoBtn" data-close-demo="1" aria-label="Close demonstration">✕ Close</button></div><div class="demoStage">${draw(kind)}</div><h3>How to perform it</h3><ul><li>${esc(cue)}</li><li>${esc(tip)}</li></ul><p><strong>Safety:</strong> This is a simplified animation, not a filmed demonstration of this exact exercise. It does not show equipment setup or detailed joint technique. Stop if you experience pain; seek individual guidance if unsure.</p><div class="demoActions"><button type="button" class="demoBtn" data-close-demo="1">Back to workout</button></div></div>`;document.body.append(overlay);overlay.querySelector('button').focus()}
function close(){document.getElementById('trainDemoOverlay')?.remove()}
document.addEventListener('click',e=>{const btn=e.target.closest('[data-exdemo]');if(btn){e.preventDefault();open(btn.dataset.exdemo)}if(e.target.closest('[data-close-demo]')||e.target.classList?.contains('demoOverlay'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.TRAIN_DEMO={open,close};
})();
