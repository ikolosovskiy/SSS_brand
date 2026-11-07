/* build 2.7 */
(() => {
const $ = id => document.getElementById(id);
const LG='#214E34';const C = {les:'#314C2C',gly:'#1B2A18',mol:'#FBF6EC',wht:'#FFFFFF',son:'#F6B93B',ter:'#DC643D',par:'#A9D48E',neb:'#D7E6FB',kam:'#66705F',pis:'#E6DFD0'};
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- utils ---------- */
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),1800)}
function copy(text,msg){
  const ok=()=>toast(msg||'Скопійовано');
  const fb=()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok()}catch(e){toast('Не вдалося скопіювати')}ta.remove()};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(ok,fb)}else fb();
}
function saveBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function press(group,btn){group.querySelectorAll('[aria-pressed]').forEach(b=>b.setAttribute('aria-pressed',b===btn?'true':'false'))}
function chips(el,items,cur,on){el.innerHTML=items.map(([v,t])=>`<button class="chip" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join('');el.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;press(el,b);on(b.dataset.v)}}

/* ---------- logo ---------- */
const LP={};
function logoPaths(kind){if(!LP[kind])LP[kind]=LOGO[kind].p.map(([d,tx,ty])=>({p:new Path2D(d),tx,ty}));return LP[kind]}
function logoSvgInner(kind){const L=LOGO[kind];return L.p.map(([d,tx,ty])=>`<path transform="translate(${tx} ${ty})" d="${d}"/>`).join('')}
function renderLogo(el,kind){const L=LOGO[kind];el.setAttribute('viewBox',`0 0 ${L.w} ${L.h}`);el.innerHTML=logoSvgInner(kind);if(!el.style.width&&!el.classList.contains('lgs'))el.style.aspectRatio=`${L.w}/${L.h}`}
document.querySelectorAll('svg.lgsvg').forEach(el=>renderLogo(el,el.dataset.kind));
function drawLogo(ctx,kind,x,y,h,color){if(color===C.les)color=LG;const L=LOGO[kind],k=h/L.h;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle=color;logoPaths(kind).forEach(o=>{ctx.save();ctx.translate(o.tx,o.ty);ctx.fill(o.p);ctx.restore()});ctx.restore();return L.w*k}

const LBG=[['Молоко',C.mol,LG,'Основний варіант для більшості матеріалів.'],['Білий',C.wht,LG,'Документи, плашки на фото, матеріали партнерів.'],['Ліс',C.les,C.mol,'Обкладинки, презентації, мерч.'],['Глибина',C.gly,C.mol,'Темні фони, відео.'],['Соняшник',C.son,LG,'Рубрика «Допомога».'],['Паросток',C.par,LG,'Громади, подяки.'],['Небо',C.neb,LG,'Аналітика, правова тема.'],['Теракота',C.ter,C.mol,'Тільки термінові повідомлення.']];
let lgKind='ua',lgI=0;
const lgSvg=$('lgSvg'),lgStage=$('lgStage');
$('lgBg').innerHTML=LBG.map(([n,b,f],i)=>`<button data-i="${i}" aria-pressed="${i===0}" title="${n}" style="background:${b};color:${f}">Aa</button>`).join('');
function lgUpdate(){const [n,b,f,note]=LBG[lgI];lgStage.style.background=b;lgSvg.style.fill=f;renderLogo(lgSvg,lgKind);lgStage.classList.toggle('sym',lgKind==='sym');$('lgNote').textContent=`${n}: логотип ${f===LG?'зелений логотипа #214E34':'Молоко'}. ${note}`}
$('lgBg').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;press($('lgBg'),b);lgI=+b.dataset.i;lgUpdate()};
$('lgKind').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;press($('lgKind'),b);lgKind=b.dataset.v;lgUpdate()};
const cName=hx=>({[LG]:'original',[C.mol]:'moloko'}[hx]||'color');
$('lgSvgDl').onclick=()=>{const L=LOGO[lgKind],f=LBG[lgI][2];saveBlob(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}"><g fill="${f}">${logoSvgInner(lgKind)}</g></svg>`],{type:'image/svg+xml'}),`sss-${lgKind==='sym'?'symbol':'logo-'+lgKind}-${cName(f)}.svg`)};
$('lgPngDl').onclick=()=>{const L=LOGO[lgKind],W=lgKind==='sym'?1200:2000,H=Math.round(W*L.h/L.w),cv=document.createElement('canvas');cv.width=W;cv.height=H;drawLogo(cv.getContext('2d'),lgKind,0,0,H,LBG[lgI][2]);cv.toBlob(b=>saveBlob(b,`sss-${lgKind==='sym'?'symbol':'logo-'+lgKind}-${cName(LBG[lgI][2])}.png`))};
lgUpdate();

/* ---------- colors ---------- */
const PAL=[['Ліс','#314C2C','Ключовий',C.mol],['Молоко','#FBF6EC','Фон',C.gly],['Глибина','#1B2A18','Текст',C.mol],['Соняшник','#F6B93B','Допомога',C.gly],['Теракота','#DC643D','Терміново',C.wht],['Паросток','#A9D48E','Громади',C.gly],['Небо','#D7E6FB','Права',C.gly],['Камінь','#66705F','Другорядний',C.wht],['Пісок','#E6DFD0','Лінії',C.gly],['Білий','#FFFFFF','Плашки',C.gly]];
$('pal').innerHTML=PAL.map(([n,h,r,f])=>`<button class="cs" data-h="${h}"><div class="c" style="background:${h};color:${f};${h==='#FFFFFF'||h==='#FBF6EC'?'box-shadow:inset 0 0 0 1px var(--pis)':''}">${n}</div><div class="d"><b>${h}</b><span>${r}</span></div></button>`).join('');
$('pal').onclick=e=>{const b=e.target.closest('[data-h]');if(b)copy(b.dataset.h,`${b.dataset.h} скопійовано`)};
function lum(h){const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.03928?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]}
const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const opts=PAL.map(([n,h])=>`<option value="${h}">${n} ${h}</option>`).join('');
$('ccBg').innerHTML=opts;$('ccFg').innerHTML=opts;$('ccBg').value='#314C2C';$('ccFg').value='#FBF6EC';
function cc(){const b=$('ccBg').value,f=$('ccFg').value,r=cr(b,f);$('ccP').style.background=b;$('ccP').style.color=f;$('ccP').style.boxShadow=b==='#FBF6EC'||b==='#FFFFFF'?'inset 0 0 0 1px var(--pis)':'none';
 $('ccR').textContent=r.toFixed(1).replace('.',',')+' : 1';
 $('ccV').innerHTML=`<span class="${r>=4.5?'ok':'no'}">${r>=4.5?'✓':'✗'} Будь-який текст</span><span class="${r>=3?'ok':'no'}">${r>=3?'✓':'✗'} Великі заголовки</span>`}
$('ccBg').onchange=cc;$('ccFg').onchange=cc;cc();


/* ---------- gradients ---------- */
const GR=[
 {n:'Ранок',use:'Збори, заклики до дії, подяки.',fg:C.gly,css:'linear-gradient(135deg, #F6B93B 0%, #DC643D 100%)',draw:(x,W,H)=>{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#F6B93B');g.addColorStop(1,'#DC643D');x.fillStyle=g;x.fillRect(0,0,W,H)}},
 {n:'Поле',use:'Результати, позитивні новини, звіти.',fg:C.gly,css:'linear-gradient(135deg, #A9D48E 0%, #F6B93B 100%)',draw:(x,W,H)=>{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#A9D48E');g.addColorStop(1,'#F6B93B');x.fillStyle=g;x.fillRect(0,0,W,H)}},
 {n:'Ліс',use:'Обкладинки, презентації, офіційні заяви.',fg:C.mol,css:'linear-gradient(180deg, #314C2C 0%, #1B2A18 100%)',draw:(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#314C2C');g.addColorStop(1,'#1B2A18');x.fillStyle=g;x.fillRect(0,0,W,H)}},
 {n:'Простір',use:'Фон аналітики та інфографіки.',fg:C.gly,css:'linear-gradient(180deg, #D7E6FB 0%, #FBF6EC 100%)',draw:(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#D7E6FB');g.addColorStop(1,'#FBF6EC');x.fillStyle=g;x.fillRect(0,0,W,H)}},
 {n:'Аура',use:'Анонси, події, сторіс. Не частіше 1 з 6 дописів.',fg:C.mol,css:'radial-gradient(60% 55% at 90% 6%, rgba(246,185,59,.9) 0%, rgba(246,185,59,0) 100%),\n  radial-gradient(75% 60% at 0% 100%, rgba(169,212,142,.75) 0%, rgba(169,212,142,0) 100%),\n  #314C2C',draw:(x,W,H)=>{x.fillStyle=C.les;x.fillRect(0,0,W,H);const r=(cx,cy,rx,ry,c,a)=>{x.save();x.translate(cx,cy);x.scale(rx/Math.max(rx,ry),ry/Math.max(rx,ry));const R=Math.max(rx,ry),g=x.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);x.fillStyle=g;x.fillRect(-R*2,-R*2,R*4,R*4);x.restore()};r(W*.9,H*.06,W*.6*1.2,H*.55*1.2,'246,185,59',.9);r(0,H,W*.75*1.2,H*.6*1.2,'169,212,142',.75)}},
 {n:'Фото-накладка',use:'Текст поверх фото знизу. PNG з прозорістю — кладіть поверх фото.',fg:C.mol,photo:1,css:'linear-gradient(180deg, rgba(27,42,24,0) 40%, rgba(27,42,24,.85) 100%)',draw:(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(.4,'rgba(27,42,24,0)');g.addColorStop(1,'rgba(27,42,24,.85)');x.fillStyle=g;x.fillRect(0,0,W,H)}},
];
const GF={ig:[1080,1350,'4:5'],story:[1080,1920,'9:16'],sq:[1080,1080,'1:1'],link:[1200,630,'1200×630'],slide:[1920,1080,'16:9']};let gF='ig';
chips($('gFmt'),Object.entries(GF).map(([k,v])=>[k,v[2]]),'ig',v=>gF=v);
$('gGrid').innerHTML=GR.map((g,i)=>`<div class="gc"><div class="sw" style="background:${g.css.replace(/\n\s*/g,' ')}${g.photo?', radial-gradient(100% 90% at 60% 35%,#f1d6b2 0,#d28e64 35%,#7b5a45 70%,#3b3027 100%)':''};color:${g.fg}"><span style="position:relative;z-index:1">${g.n}</span></div><div class="bd"><p>${g.use}</p><span class="meta">${g.css.startsWith('radial')?'Радіальний · 2 світла на Ліс':g.css.match(/\d+deg/)[0].replace('deg','°')+' · '+(g.css.match(/#[0-9A-F]{6}/g)||['#1B2A18']).join(' → ')}</span><div class="acts"><button class="btn g s" data-gc="${i}">Копіювати CSS</button><button class="btn p s" data-gp="${i}">PNG-фон</button></div></div></div>`).join('');
function grain(x,W,H){const id=x.getImageData(0,0,W,H),d=id.data;for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*26;d[i]+=n;d[i+1]+=n;d[i+2]+=n}x.putImageData(id,0,0)}
$('gGrid').onclick=e=>{const c=e.target.closest('[data-gc]');if(c){copy('background: '+GR[+c.dataset.gc].css+';','CSS градієнта скопійовано');return}
  const p=e.target.closest('[data-gp]');if(!p)return;const g=GR[+p.dataset.gp],[W,H,lab]=GF[gF],cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');g.draw(x,W,H);if($('gGrain').checked&&!g.photo)grain(x,W,H);
  cv.toBlob(b=>saveBlob(b,`sss-gradient-${translit(g.n)}-${W}x${H}.png`))};


/* ---------- graphics helpers ---------- */
if($('sgIcon'))$('sgIcon').innerHTML=iconSvg('legal',C.les,C.wht);
document.querySelectorAll('.tone').forEach(b=>b.onclick=()=>copy(b.dataset.h,b.dataset.h+' скопійовано'));
/* ---------- fonts tester ---------- */
const tester=$('tester');
$('tFont').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;press($('tFont'),b);const [w,f]=b.dataset.v.split('|');tester.style.fontWeight=w;tester.style.fontFamily=f;tester.style.letterSpacing=f.includes('fd')?'-.03em':'0'};
$('tSize').oninput=e=>{tester.style.fontSize=e.target.value+'px';$('tSizeV').textContent=e.target.value+' px'};
tester.style.fontWeight=800;tester.style.fontFamily='var(--fd)';tester.style.letterSpacing='-.03em';

/* ---------- icons ---------- */
const IP={};
function iconPaths(id){
  if(IP[id])return IP[id];
  const ic=ICONS.find(i=>i[1]===id);const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg"><g id="a">${ic[3]}</g><g id="l">${ic[4]}</g></svg>`,'image/svg+xml');
  const conv=el=>{const t=el.tagName,g=a=>parseFloat(el.getAttribute(a)||0);
    if(t==='path')return el.getAttribute('d');
    if(t==='circle'){const cx=g('cx'),cy=g('cy'),r=g('r');return `M${cx-r} ${cy}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0z`}
    if(t==='ellipse'){const cx=g('cx'),cy=g('cy'),rx=g('rx'),ry=g('ry');return `M${cx-rx} ${cy}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0z`}
    if(t==='rect'){const x=g('x'),y=g('y'),w=g('width'),h=g('height'),r=Math.min(g('rx'),w/2,h/2);if(!r)return `M${x} ${y}h${w}v${h}h${-w}z`;return `M${x+r} ${y}h${w-2*r}a${r} ${r} 0 0 1 ${r} ${r}v${h-2*r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w-2*r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h-2*r)}a${r} ${r} 0 0 1 ${r} ${-r}z`}
    return ''};
  const pick=gid=>[...doc.getElementById(gid).children].map(conv).filter(Boolean).map(d=>new Path2D(d));
  return IP[id]={a:pick('a'),l:pick('l')};
}
function drawIcon(ctx,id,x,y,size,line,acc,sw=1.6){const P=iconPaths(id),k=size/24;ctx.save();ctx.translate(x,y);ctx.scale(k,k);if(acc&&acc!=='none'){ctx.fillStyle=acc;P.a.forEach(p=>ctx.fill(p))}ctx.strokeStyle=line;ctx.lineWidth=sw;ctx.lineCap='round';ctx.lineJoin='round';P.l.forEach(p=>ctx.stroke(p));ctx.restore()}
function iconSvg(id,line,acc,size){const i=ICONS.find(x=>x[1]===id);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${size?` width="${size}" height="${size}"`:''}><g fill="${acc}">${i[3]}</g><g fill="none" stroke="${line}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${i[4]}</g></svg>`}
const IST=[['Основний',C.les,C.son,C.wht],['На Ліс',C.mol,C.son,C.les],['На Соняшник',C.gly,C.mol,C.son],['На Небо',C.les,C.wht,C.neb],['На Теракота',C.mol,C.son,C.ter],['Моно',C.gly,'none',C.wht]];
const SYN={water:'вода питна',wash:'вода кран водопостачання санітарія',laundry:'прання гігієна',home:'дім житло будинок',repair:'ремонт молоток відновлення',legal:'юрист право закон суд терези',consult:'консультація розмова чат',hotline:'телефон дзвінок лінія',idp:'переселенці впо валіза',kids:'діти дитина',elderly:'літні пенсіонери',access:'інвалідність доступність візок',veteran:'ветерани медаль військові',cash:'гроші виплати кошти',food:'їжа продукти набір',med:'медицина аптечка ліки',heat:'тепло опалення вогонь',winter:'зима холод сніг',energy:'енергія світло генератор',truck:'доставка логістика авто',sprout:'розвиток росток громади',edu:'освіта навчання тренінг',donate:'донат підтримати пожертва',jobs:'вакансія робота тендер',alert:'увага терміново важливо',psy:'психолог підтримка ментальне',partner:'партнерство співпраця',gov:'держава установа міністерство',media:'медіа телефон новини'};
let iStyle=0,iGroup='all';
const groups=[...new Set(ICONS.map(i=>i[0]))];
chips($('ig'),[['all','Усі'],...groups.map(g=>[g,g])],'all',v=>{iGroup=v;renderIcons()});
chips($('ist'),IST.map((s,i)=>[String(i),s[0]]),'0',v=>{iStyle=+v;renderIcons()});
$('isz').oninput=e=>document.documentElement.style.setProperty('--isz',e.target.value+'px');
$('iq').oninput=()=>renderIcons();
function renderIcons(){const q=$('iq').value.trim().toLowerCase(),[,l,a,bg]=IST[iStyle];
  const list=ICONS.filter(i=>(iGroup==='all'||i[0]===iGroup)&&(!q||(i[2]+' '+i[1]+' '+i[0]+' '+(SYN[i[1]]||'')).toLowerCase().includes(q)));
  $('igrid').innerHTML=list.map((i,k)=>`<button class="ic" data-id="${i[1]}" style="background:${bg};color:${bg===C.wht||bg===C.son||bg===C.neb?C.gly:C.mol};animation-delay:${RM?0:Math.min(k*12,400)}ms">${iconSvg(i[1],l,a)}<span>${i[2]}</span></button>`).join('')||'<p class="hint">Нічого не знайдено. Спробуйте інше слово.</p>';
  $('icount').textContent=`Показано ${list.length} з ${ICONS.length}. Натисніть на іконку для копіювання і завантаження.`}
let cur=null;
$('igrid').onclick=e=>{const b=e.target.closest('[data-id]');if(!b)return;cur=b.dataset.id;const i=ICONS.find(x=>x[1]===cur),[,l,a,bg]=IST[iStyle];$('dpv').style.background=bg;$('dpv').innerHTML=iconSvg(cur,l,a);$('dn').textContent=i[2];$('dg').textContent=`${i[0]} · ${cur}.svg`;$('drawer').classList.add('op')};
$('dx').onclick=()=>$('drawer').classList.remove('op');
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('drawer').classList.remove('op')});
$('dcopy').onclick=()=>{const [,l,a]=IST[iStyle];copy(iconSvg(cur,l,a,24),'SVG скопійовано. Вставте в Figma: Ctrl+V')};
$('dsvg').onclick=()=>{const [,l,a]=IST[iStyle];saveBlob(new Blob([iconSvg(cur,l,a,24)],{type:'image/svg+xml'}),`sss-icon-${cur}.svg`)};
$('dpng').onclick=()=>{const [,l,a]=IST[iStyle],cv=document.createElement('canvas');cv.width=cv.height=512;drawIcon(cv.getContext('2d'),cur,0,0,512,l,a);cv.toBlob(b=>saveBlob(b,`sss-icon-${cur}.png`))};
renderIcons();

/* marquee */
const mqIds=['aid','water','home','legal','council','heat','cash','sprout','hotline','edu','repair','food','shield','community','truck','psy','idea','winter'];
const mqHtml=mqIds.map((id,i)=>iconSvg(id,i%2?C.gly:C.les,i%2?C.mol:C.wht)).join('');$('mq').innerHTML=mqHtml+mqHtml;

/* ---------- builder ---------- */
const FMT={ig:[1080,1350,'4:5 · Instagram, Facebook'],story:[1080,1920,'9:16 · Сторіс'],sq:[1080,1080,'1:1 · Квадрат'],link:[1200,630,'1200×630 · Посилання'],tg:[1280,720,'16:9 · Telegram']};
const TPL={photo:'Фото + текст',num:'Цифра-герой',icon:'Іконка-герой',plate:'Фото + плашка',event:'Анонс',word:'Слово тон-в-тон'};
const TH={
 lis:{n:'Ліс',bg:C.les,tx:C.mol,sub:'#C9D2C2',cb:C.son,cf:C.gly,hero:C.son,tone:'#3D5C37',logo:C.mol,il:C.mol,ia:C.son},
 mol:{n:'Молоко',bg:C.mol,tx:C.les,sub:C.kam,cb:C.les,cf:C.mol,hero:C.les,tone:'#F0E8D8',logo:C.les,il:C.les,ia:C.son},
 son:{n:'Соняшник',bg:C.son,tx:C.gly,sub:'#3A3221',cb:C.mol,cf:C.gly,hero:C.gly,tone:'#EBA92A',logo:C.gly,il:C.gly,ia:C.mol},
 neb:{n:'Небо',bg:C.neb,tx:C.les,sub:'#3A4637',cb:C.wht,cf:C.les,hero:C.les,tone:'#C6D9F4',logo:C.les,il:C.les,ia:C.wht},
 par:{n:'Паросток',bg:C.par,tx:C.les,sub:'#2E4128',cb:C.les,cf:C.mol,hero:C.les,tone:'#98C77C',logo:C.les,il:C.les,ia:C.mol},
 ter:{n:'Теракота',bg:C.ter,tx:C.mol,sub:C.mol,cb:C.mol,cf:C.gly,hero:C.mol,tone:'#CE5631',logo:C.mol,il:C.mol,ia:C.son,plate:true}};
const DEF={photo:['Подія','Тренінг для фахівців соцзахисту: як підтримати переселенців','Полтава · листопад 2026'],num:['Допомога','людей отримали гуманітарну допомогу','з початку повномасштабного вторгнення'],icon:['Важливо','Як отримати безоплатну правову консультацію','Заповніть форму на sss-ua.org'],plate:['9 листопада','З Днем української писемності та мови',''],event:['Анонс','Вебінар: як переселенцям отримати житлову допомогу',''],word:['Допомога','Соціальні пральні для громад Сумщини','Чисто, тепло і поруч з домом']};
const ST=store.get('sss-builder',{});
const B={fmt:ST.fmt||'ig',tpl:ST.tpl||'photo',th:ST.th||'lis',logo:'ua',photo:null,logos:[{t:'sss'}]};
const cv=$('cv'),ctx=cv.getContext('2d');
chips($('bFmt'),Object.entries(FMT).map(([k,v])=>[k,v[2].split(' · ')[0]]),B.fmt,v=>{B.fmt=v;draw()});
chips($('bTpl'),Object.entries(TPL),B.tpl,v=>{const prev=B.tpl;B.tpl=v;const [c,h,s]=DEF[v];const [pc,ph,ps]=DEF[prev];if($('bChip').value===pc)$('bChip').value=c;if($('bHead').value===ph)$('bHead').value=h;if($('bSub').value===ps)$('bSub').value=s;if(v==='word'&&/^\d/.test($('bBig').value))$('bBig').value='ВОДА';if(v==='num'&&!/^\d/.test($('bBig').value))$('bBig').value='543 370';if(v==='icon'&&B.th==='lis')setTheme('ter');draw()});
$('bThm').innerHTML=Object.entries(TH).map(([k,t])=>`<button data-v="${k}" aria-pressed="${k===B.th}" title="${t.n}" aria-label="${t.n}" style="background:${t.bg}"></button>`).join('');
function setTheme(k){B.th=k;press($('bThm'),$('bThm').querySelector(`[data-v="${k}"]`))}
$('bThm').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;setTheme(b.dataset.v);if(B.grad!=null){B.grad=null;press($('bGrad'),$('bGrad').querySelector('[data-g="-1"]'))}draw()};
const GTH=['son','par','lis','neb','lis'];
function gtex(W,H){const id=ctx.getImageData(0,0,W,H),d=id.data;for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*20;d[i]+=n;d[i+1]+=n;d[i+2]+=n}ctx.putImageData(id,0,0)}
B.grad=null;
$('bGrad').innerHTML=['<button class="chip" data-g="-1" aria-pressed="true">Без градієнта</button>',...GR.slice(0,5).map((g,i)=>`<button class="chip gchip" data-g="${i}" aria-pressed="false" style="--g:${g.css.replace(/\n\s*/g,' ')}"><i></i>${g.n}</button>`)].join('');
$('bGrad').onclick=e=>{const b=e.target.closest('[data-g]');if(!b)return;press($('bGrad'),b);const g=+b.dataset.g;B.grad=g<0?null:g;if(g>=0)setTheme(GTH[g]);draw()};

$('bLogo').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;press($('bLogo'),b);B.logo=b.dataset.v;renderLogos();draw()};
$('bIcon').innerHTML=ICONS.filter(i=>i[1]!=='arrow').map(i=>`<option value="${i[1]}">${i[2]}</option>`).join('');$('bIcon').value='legal';
['bChip','bHead','bSub','bBig','bIcon','bDate','bTime','bPlace'].forEach(id=>$(id).addEventListener('input',()=>draw()));
function loadImg(file,cb){if(!file)return cb(null);const url=URL.createObjectURL(file);const im=new Image();im.onload=()=>cb(im);im.onerror=()=>{toast('Не вдалося відкрити файл');cb(null)};im.src=url}
function upl(id,key){const inp=$(id),nm=$(id+'N'),x=$(id+'X');
  inp.onchange=e=>{const f=e.target.files[0];loadImg(f,im=>{B[key]=im;nm.textContent=im?f.name:'Файл не обрано';x.hidden=!im;draw()})};
  x.onclick=()=>{B[key]=null;inp.value='';nm.textContent='Файл не обрано';x.hidden=true;draw()}}
upl('bPhoto','photo');
function renderLogos(){const L=B.logos,n=L.length;
  $('bLogos').innerHTML=L.map((it,i)=>`<div class="lgi"><span class="nr">${i+1}</span><span class="th">${it.t==='sss'?`<svg viewBox="0 0 ${LOGO[B.logo].w} ${LOGO[B.logo].h}" fill="${C.les}">${logoSvgInner(B.logo)}</svg>`:`<img src="${it.src}" alt="">`}</span><span class="nm">${it.t==='sss'?'SSS (наш логотип)':it.name}</span><button type="button" data-mv="${i}" data-d="-1" ${i===0?'disabled':''} aria-label="Перемістити вліво">←</button><button type="button" data-mv="${i}" data-d="1" ${i===n-1?'disabled':''} aria-label="Перемістити вправо">→</button><button type="button" class="del" data-del="${i}" aria-label="Прибрати">✕</button></div>`).join('');
  if(!n)$('bLogos').innerHTML='<p class="hint">Логотипів немає. Додайте файли або поверніть логотип SSS.</p>';
  $('bSssBack').hidden=L.some(x=>x.t==='sss');
  $('bPlateN').textContent=B.plate?B.plate.name:'Файл не обрано';$('bPlateX').hidden=!B.plate;$('bLogosBox').style.opacity=B.plate?.45:1;
  $('bLogoHint').textContent=B.plate?'Використовується ваша готова плашка. Список логотипів нижче не враховується.':n>=3&&B.logo!=='sym'?'Порада: коли логотипів 3 і більше, SSS краще ставити символом — повна назва фонду вже є в тексті допису.':''}
$('bLogos').onclick=e=>{const m=e.target.closest('[data-mv]'),d=e.target.closest('[data-del]');
  if(m){const i=+m.dataset.mv,j=i+ +m.dataset.d,L=B.logos;if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]];renderLogos();draw()}
  if(d){B.logos.splice(+d.dataset.del,1);renderLogos();draw()}};
$('bAdd').onchange=e=>{const fs=[...e.target.files];let left=fs.length;fs.forEach(f=>{const url=URL.createObjectURL(f),im=new Image();im.onload=()=>{const sssI=B.logos.findIndex(x=>x.t==='sss');B.logos.splice(sssI<0?B.logos.length:sssI,0,{t:'img',img:im,src:url,name:f.name});if(--left===0){renderLogos();draw()}};im.onerror=()=>{toast('Не вдалося відкрити '+f.name);if(--left===0){renderLogos();draw()}};im.src=url});e.target.value=''};
$('bSssBack').onclick=()=>{B.logos.push({t:'sss'});renderLogos();draw()};
$('bPlate').onchange=e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f),im=new Image();im.onload=()=>{B.plate={img:im,name:f.name};renderLogos();draw()};im.onerror=()=>toast('Не вдалося відкрити файл');im.src=url;e.target.value=''};
$('bPlateX').onclick=()=>{B.plate=null;renderLogos();draw()};
renderLogos();

const FD='Manrope',FT='Onest';
function setLS(v){if('letterSpacing' in ctx)ctx.letterSpacing=v}
function wrap(text,maxW){const out=[];String(text).split('\n').forEach(par=>{const w=par.split(/\s+/).filter(Boolean);let line='';w.forEach(word=>{const t=line?line+' '+word:word;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=word}else line=t});if(line)out.push(line)});
  // keep short prepositions with next word
  for(let i=0;i<out.length-1;i++){const m=out[i].match(/\s(в|у|і|й|з|із|на|до|за|та|а|о|від|для|що|як)$/i);if(m){const nl=m[1]+' '+out[i+1];ctx.measureText(nl).width<=maxW&&(out[i]=out[i].slice(0,-m[0].length),out[i+1]=nl)}}
  return out}
function fit(text,{w=800,fam=FD,max,min,maxW,lines=3,ls='-0.02em'}){let sz=max,L;for(;sz>=min;sz-=2){ctx.font=`${w} ${sz}px ${fam}`;setLS(ls);L=wrap(text,maxW);if(L.length<=lines)return{sz,L,ok:true}}ctx.font=`${w} ${min}px ${fam}`;L=wrap(text,maxW);return{sz:min,L:L.slice(0,lines),ok:false}}
function text(L,x,y,sz,lh,color,{w=800,fam=FD,ls='-0.02em',hl=null}={}){ctx.font=`${w} ${sz}px ${fam}`;setLS(ls);ctx.fillStyle=color;ctx.textBaseline='alphabetic';L.forEach((t,i)=>ctx.fillText(t,x,y+sz*.86+i*sz*lh));return y+L.length*sz*lh}
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h)}
function chip(t,x,y,s,bg,fg){if(!t)return y;ctx.font=`700 ${24*s}px ${FD}`;setLS('0.07em');const T=t.toUpperCase(),w=ctx.measureText(T).width+40*s,h=54*s;ctx.fillStyle=bg;rr(x,y,w,h,h/2);ctx.fill();ctx.fillStyle=fg;ctx.textBaseline='middle';ctx.fillText(T,x+20*s,y+h/2+1*s);ctx.textBaseline='alphabetic';return y+h}
function photo(x,y,w,h,r=0){ctx.save();rr(x,y,w,h,r);ctx.clip();if(B.photo){const im=B.photo,k=Math.max(w/im.width,h/im.height),iw=im.width*k,ih=im.height*k;ctx.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih)}else{const g=ctx.createRadialGradient(x+w*.35,y+h*.3,0,x+w*.5,y+h*.5,Math.max(w,h)*.75);g.addColorStop(0,'#d9d2c0');g.addColorStop(.4,'#9aa58a');g.addColorStop(.75,'#55684a');g.addColorStop(1,'#2f3d2a');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.font=`700 ${Math.max(14,h*.035)}px ${FD}`;setLS('0.08em');ctx.fillStyle='rgba(255,255,255,.85)';ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillText('ДОДАЙТЕ ФОТО',x+w/2,y+h/2);ctx.textAlign='left';ctx.textBaseline='alphabetic'}ctx.restore()}
function logo(x,y,s,color,plate){const kind=B.logo,L=B.logos,n=L.length;
  if(B.plate){const im=B.plate.img,maxW=cv.width-2*x;let h=Math.min((cv.width/cv.height>1.3?80:110)*s,im.height),w=h*im.width/im.height;if(w>maxW){w=maxW;h=w*im.height/im.width}ctx.drawImage(im,x,y,w,h);return y+h}
  if(!n)return y;
  if(n===1&&L[0].t==='img'&&!plate){const im=L[0].img,h=52*s,w=Math.min(h*im.width/im.height,cv.width-2*x);ctx.drawImage(im,x,y,w,w*im.height/im.width);return y+w*im.height/im.width}
  if(n<=1&&!plate){const h=(kind==='sym'?48:kind==='en'?44:40)*s;drawLogo(ctx,kind,x,y,h,color);return y+h}
  const maxW=cv.width-2*x;let h=(n>=4?34:n===3?38:kind==='sym'?44:40)*s,pad=18*s,gap=28*s;
  const iw=it=>it.t==='sss'?LOGO[kind].w*h/LOGO[kind].h:(h*1.15)*it.img.width/it.img.height;
  let tot=L.reduce((a,it)=>a+iw(it),0)+gap*(n-1)+pad*2;
  if(tot>maxW){const k=(maxW-pad*2-gap*(n-1))/(tot-pad*2-gap*(n-1));h*=k;tot=maxW}
  const full=n>=4,PW=full?maxW:tot,PH=pad*2+h*1.15;
  ctx.fillStyle=C.wht;rr(x,y,PW,PH,14*s);ctx.fill();
  const sum=L.reduce((a,it)=>a+iw(it),0),g=n>1?(full?(PW-pad*2-sum)/(n-1):gap):0;let cx=x+pad;
  L.forEach((it,i)=>{const w=iw(it);if(it.t==='sss')drawLogo(ctx,kind,cx,y+(PH-h)/2,h,C.les);else{const ih=h*1.15;ctx.drawImage(it.img,cx,y+(PH-ih)/2,w,ih)}
    cx+=w;if(i<n-1){ctx.fillStyle=C.pis;ctx.fillRect(cx+g/2-1*s,y+PH*.22,2*s,PH*.56);cx+=g}});
  return y+PH}
function bigFit(t,maxW,maxH,lines){let sz=100;ctx.font=`800 ${sz}px ${FD}`;setLS('-0.06em');const wmax=Math.max(...lines.map(l=>ctx.measureText(l).width));sz=Math.min(100*maxW/wmax,maxH/(lines.length*.8+.1));return sz}
let warn='';
function draw(){
  const [W,H]=FMT[B.fmt];cv.width=W;cv.height=H;const T=TH[B.th],tp=B.tpl;const paint=()=>{if(B.grad!=null){GR[B.grad].draw(ctx,W,H);gtex(W,H)}else{ctx.fillStyle=T.bg;ctx.fillRect(0,0,W,H)}};
  const mode=B.fmt==='story'?'tall':(W/H>1.3?'land':'port');
  const s=mode==='land'?Math.min(W/1080,H*1.3/1080):W/1080, m=64*s;
  const top=mode==='tall'?270*s:m, bot=mode==='tall'?H-340*s:H-m;
  const head=$('bHead').value.trim(),sub=$('bSub').value.trim(),chipT=$('bChip').value.trim(),big=$('bBig').value.trim();
  warn='';ctx.clearRect(0,0,W,H);
  ['wBig','wIcon','wEv','wPhoto'].forEach(id=>$(id).hidden=true);
  if(tp==='num'||tp==='word')$('wBig').hidden=false; if(tp==='icon')$('wIcon').hidden=false; if(tp==='event')$('wEv').hidden=false; if(tp==='photo'||tp==='plate')$('wPhoto').hidden=false;
  const H1=(maxW,lines=3,max=60,min=40,color=T.tx,x=m,y)=>{const f=fit(head,{max:max*s,min:min*s,maxW,lines});if(!f.ok)warn='Заголовок задовгий для цього формату: скоротіть його.';return text(f.L,x,y,f.sz,1.05,color)};
  const SUB=(maxW,y,x=m,color=T.sub,lines=2)=>{if(!sub)return y;const f=fit(sub,{w:500,fam:FT,max:30*s,min:24*s,maxW,lines,ls:'0'});
    if(T.plate&&(tp!=='plate')){ctx.font=`500 ${f.sz}px ${FT}`;const tw=Math.max(...f.L.map(l=>ctx.measureText(l).width));ctx.fillStyle=C.mol;rr(x-16*s,y-4*s,tw+32*s,f.L.length*f.sz*1.35+20*s,12*s);ctx.fill();return text(f.L,x,y+4*s,f.sz,1.35,C.gly,{w:500,fam:FT,ls:'0'})+16*s}
    return text(f.L,x,y,f.sz,1.35,color,{w:500,fam:FT,ls:'0'})};

  if(tp==='photo'){
    if(mode==='land'){paint();photo(W*.55,0,W*.45,H);const cw=W*.55-2*m;const lb=logo(m,m,s,T.logo);let y=chip(chipT,m,Math.max(m+100*s,lb+28*s),s,T.cb,T.cf)+24*s;y=H1(cw,3,56,36,T.tx,m,y);SUB(cw,y+14*s)}
    else{const ph=H*(mode==='tall'?.46:mode==='port'&&W===H?.48:.55);paint();photo(0,0,W,ph);logo(m,mode==='tall'?top:m,s,C.les,true);const cw=W-2*m,f0=fit(head,{max:60*s,min:40*s,maxW:cw,lines:3}),s0=sub?fit(sub,{w:500,fam:FT,max:30*s,min:24*s,maxW:cw,lines:2,ls:'0'}):null;
      const bh=(chipT?82*s:0)+f0.L.length*f0.sz*1.05+(s0?16*s+s0.L.length*s0.sz*1.35:0);let y=Math.max(ph+48*s,bot-bh);y=chip(chipT,m,y,s,T.cb,T.cf)+(chipT?28*s:0);y=H1(cw,3,60,40,T.tx,m,y);y=SUB(cw,y+16*s);
      if(y>bot)warn='Тексту забагато: скоротіть заголовок.'}
  }
  if(tp==='num'){
    paint();
    const parts=big.split(/\s+/).filter(Boolean);
    if(mode==='land'){const lb=logo(m,m,s,T.logo);let y=chip(chipT,m,Math.max(m+90*s,lb+28*s),s,T.cb,T.cf)+24*s;const cw=W*.42-m;y=H1(cw,4,46,30,T.tx,m,y);SUB(cw,y+12*s);
      const L=[parts.join(' ')],sz=bigFit(big,W*.62,H*1.05,L);text(L,W-W*.6,H-sz*.9,sz,.8,T.hero,{ls:'-0.06em'})}
    else{const lb=logo(m,mode==='tall'?top:m,s,T.logo);let y=chip(chipT,m,Math.max((mode==='tall'?top:m)+100*s,lb+28*s),s,T.cb,T.cf)+26*s;y=H1(W-2*m,3,48,34,T.tx,m,y);y=SUB(W-2*m,y+12*s);
      const L=parts.length>1&&big.length>4?parts.length>2?[parts.slice(0,-1).join(' '),parts.slice(-1)[0]]:parts:[big];
      let sz=bigFit(big,W*1.04,H,L);const avail=(mode==='tall'?bot+120*s:H+sz*.12)-(y+32*s);sz=Math.min(sz,avail/(L.length*.8+.05));
      const yb=(mode==='tall'?bot+120*s:H+sz*.14)-L.length*sz*.8;text(L,-sz*.04,yb-sz*.06,sz,.8,T.hero,{ls:'-0.06em'})}
  }
  if(tp==='icon'){
    paint();const id=$('bIcon').value;
    if(mode==='land'){const lb=logo(m,m,s,T.logo);let y=chip(chipT,m,Math.max(m+90*s,lb+28*s),s,T.cb,T.cf)+24*s;const cw=W*.5-m;y=H1(cw,4,52,32,T.tx,m,y);SUB(cw,y+12*s);const sz=H*1.05;drawIcon(ctx,id,W-sz*.78,(H-sz)/2+sz*.12,sz,T.il,T.ia,1.4)}
    else{const lb=logo(m,mode==='tall'?top:m,s,T.logo);let y=chip(chipT,m,Math.max((mode==='tall'?top:m)+100*s,lb+28*s),s,T.cb,T.cf)+28*s;y=H1(W-2*m,3,60,40,T.tx,m,y);y=SUB(W-2*m,y+14*s);
      const lim=(mode==='tall'?bot+200*s:H)-(y+40*s);const sz=Math.min(W*.9,lim/.82);if(sz<W*.35)warn='Мало місця для іконки: скоротіть текст.';drawIcon(ctx,id,W-sz*.82,(mode==='tall'?bot+200*s:H)-sz*.82,sz,T.il,T.ia,1.4)}
  }
  if(tp==='plate'){
    photo(0,0,W,H);logo(m,mode==='tall'?top:m,s,C.les,true);
    const pw=mode==='land'?W*.55:W-2*m,pad=48*s;ctx.font=`800 ${60*s}px ${FD}`;
    const f=fit(head,{max:(mode==='land'?50:60)*s,min:36*s,maxW:pw-2*pad,lines:3});if(!f.ok)warn='Заголовок задовгий: скоротіть його.';
    const sf=sub?fit(sub,{w:500,fam:FT,max:28*s,min:24*s,maxW:pw-2*pad,lines:2,ls:'0'}):null;
    const ph=pad*2+(chipT?40*s:0)+f.L.length*f.sz*1.05+(sf?16*s+sf.L.length*sf.sz*1.35:0);const py=(mode==='tall'?bot:H-m)-ph;
    ctx.fillStyle=C.mol;rr(m,py,pw,ph,24*s);ctx.fill();let y=py+pad;
    if(chipT){ctx.font=`700 ${24*s}px ${FD}`;setLS('0.07em');ctx.fillStyle=C.les;ctx.fillText(chipT.toUpperCase(),m+pad,y+18*s);y+=40*s}
    y=text(f.L,m+pad,y,f.sz,1.05,C.gly);if(sf)text(sf.L,m+pad,y+16*s,sf.sz,1.35,C.kam,{w:500,fam:FT,ls:'0'})
  }
  if(tp==='event'){
    if(B.grad==null&&B.th==='lis'){GR[4].draw(ctx,W,H);gtex(W,H)}else paint();
    const tx=B.th==='lis'?C.mol:T.tx,cb=B.th==='lis'?C.son:T.cb,cf=B.th==='lis'?C.gly:T.cf,il=B.th==='lis'?C.mol:T.il,ia=B.th==='lis'?C.son:T.ia;
    const lbE=logo(m,mode==='tall'?top:m,s,B.th==='lis'?C.mol:T.logo);
    const cw=mode==='land'?W*.58-m:W-2*m;let y=chip(chipT,m,Math.max((mode==='tall'?top:m)+(mode==='land'?84:110)*s,lbE+28*s),s,cb,cf)+28*s;y=H1(cw,3,mode==='land'?52:60,34,tx,m,y);
    const rows=[['cal',$('bDate').value],['clock',$('bTime').value],['pin',$('bPlace').value]].filter(r=>r[1].trim());
    let rx=mode==='land'?W*.62:m,ry=mode==='land'?m+130*s:y+40*s;const rs=mode==='land'?32*s:36*s;
    rows.forEach(([id,t])=>{drawIcon(ctx,id,rx,ry,rs*1.25,il,ia,1.7);const f=fit(t,{w:500,fam:FT,max:rs,min:24*s,maxW:(mode==='land'?W-rx-m:cw)-rs*1.7,lines:1,ls:'0'});text(f.L,rx+rs*1.7,ry+rs*.12,f.sz,1.3,tx,{w:500,fam:FT,ls:'0'});ry+=rs*1.75});
    if(!rows.length&&sub)SUB(cw,y+20*s);
  }
  if(tp==='word'){
    paint();const wd=(big||'ВОДА').toUpperCase();
    const sz=bigFit(wd,W*1.12,H*.55,[wd]);text([wd],-sz*.05,(mode==='land'?H*.12:H*.28),sz,.8,T.tone,{ls:'-0.06em'});
    const lb=logo(m,mode==='tall'?top:m,s,T.logo);chip(chipT,m,Math.max((mode==='tall'?top:m)+100*s,lb+28*s),s,T.cb,T.cf);
    const cw=mode==='land'?W*.6:W-2*m;const f=fit(head,{max:(mode==='land'?52:60)*s,min:36*s,maxW:cw,lines:3});if(!f.ok)warn='Заголовок задовгий: скоротіть його.';
    const sf=sub?fit(sub,{w:500,fam:FT,max:30*s,min:24*s,maxW:cw,lines:2,ls:'0'}):null;
    const blockH=f.L.length*f.sz*1.05+(sf?16*s+sf.L.length*sf.sz*1.35:0);let y=bot-blockH;y=text(f.L,m,y,f.sz,1.05,T.tx);if(sf)SUB(cw,y+16*s)
  }
  $('bInfo').textContent=`${W}×${H} px · ${TPL[tp]} · ${B.grad!=null?'градієнт «'+GR[B.grad].n+'»':T.n}`;$('bWarn').textContent=warn;
  store.set('sss-builder',{fmt:B.fmt,tpl:B.tpl,th:B.th});
}
$('bDl').onclick=()=>{const d=new Date().toISOString().slice(0,10),net={ig:'IG-post',story:'IG-story',sq:'post-1x1',link:'FB-link',tg:'TG-post'}[B.fmt];cv.toBlob(b=>saveBlob(b,`${d}_${net}_${B.tpl}_${translit($('bHead').value).slice(0,40)||'post'}_v1.png`),'image/png')};
setTheme(B.th);

/* ---------- canva templates ---------- */
const TT=[['ig','Instagram',[['ig-post_podiya','Подія'],['ig-post_istoriya','Історія людини'],['ig-post_dopomoga','Допомога надана'],['ig-karusel_analityka-oblozhka','Аналітика · обкладинка'],['ig-karusel_analityka-slajd','Аналітика · слайд'],['ig-post_anons','Анонс'],['ig-post_pamyatna-data','Пам’ятна дата'],['ig-post_zvit','Звіт проєкту'],['ig-post_vazhlyvo','Важливо'],['ig-post_podyaka','Подяка партнерам'],['ig-post_vakansiya','Вакансія']]],
 ['st','Сторіс',[['story_anons','Сторіс · анонс'],['story_cyfra','Сторіс · цифра'],['story_instrukciya','Сторіс · інструкція'],['reels_oblozhka','Обкладинка Reels']]],
 ['fb','Facebook',[['fb_link-1200x630','Прев’ю посилання'],['fb_oblozhka-1640x924','Обкладинка сторінки']]],
 ['li','LinkedIn',[['linkedin_post-1200x1200','Допис 1:1'],['linkedin_dokument-en','Документ (EN)'],['linkedin_oblozhka-1128x191','Обкладинка сторінки']]],
 ['tg','Telegram',[['telegram_post-1280x720','Допис 16:9']]],
 ['np','Без фото',[['bez-foto_rozyasnennya','Роз’яснення'],['bez-foto_pytannya-vidpovid','Питання-відповідь'],['bez-foto_onlajn-podiya','Онлайн-подія']]],
 ['car','Каруселі',[['karusel_1-oblozhka','1 · Обкладинка'],['karusel_2-kontekst','2 · Контекст'],['karusel_3-zmist','3 · Зміст'],['karusel_6-pidsumok','Підсумок'],['karusel_7-zaklyk','Заклик']]],
 ['vid','Відео',[['video_oblozhka-spiker-9x16','Обкладинка · спікер'],['video_oblozhka-kolir-9x16','Обкладинка · колір'],['video_miniatyura-youtube','Мініатюра YouTube'],['video_tytr-i-subtytry-9x16','Титр і субтитри 9:16'],['video_tytr-i-subtytry-16x9','Титр і субтитри 16:9'],['video_kintseva-kartka-9x16','Кінцева картка 9:16'],['video_kintseva-kartka-youtube','Кінцева картка YouTube']]],
 ['pr','Проєкти',[['proekt_oblozhka','Проєкт · обкладинка'],['proekt_cyfra','Проєкт · цифра'],['proekt_ostanniy-slajd','Проєкт · останній слайд']]],
 ['sl','Презентації',[['slide_tytul','Титул'],['slide_rozdil','Розділ'],['slide_cyfry','Цифри'],['slide_tekst-foto','Текст + фото'],['slide_final','Фінальний']]]];
chips($('tf'),[['all','Усі'],...TT.map(t=>[t[0],t[1]])],'all',v=>renderT(v));
function renderT(f){$('tgrid').innerHTML=TT.filter(t=>f==='all'||t[0]===f).flatMap(t=>t[2].map(([id,n])=>`<div class="tp"><img src="templates/preview/${id}.png" alt="Шаблон: ${n}" loading="lazy"><b>${n}</b><span class="hint">${t[1]}</span><div class="row"><a class="btn p s" href="templates/canva/${id}.pdf" download>PDF · Canva</a><a class="btn o s" href="templates/preview/${id}.png" download>PNG</a></div></div>`)).join('')}
renderT('all');

/* ---------- fund name ---------- */
const FULL_UA='БЛАГОДІЙНА ОРГАНІЗАЦІЯ “БЛАГОДІЙНИЙ ФОНД “СТАБІЛІЗЕЙШЕН СУППОРТ СЕРВІСЕЗ”',FULL_EN='CHARITABLE ORGANIZATION “CHARITY FOUNDATION “STABILIZATION SUPPORT SERVICES”';
const NM={
 doc:['Договір, офіційний лист, документ',[[FULL_UA,'Повна юридична назва. Літери можуть бути й не прописні.'],['БО “ССС”','Скорочена юридична назва.']]],
 stmt:['Підпис під публічною заявою чи зверненням',[[FULL_UA,'Юридично правильна назва — обов’язково для заяв і звернень.']]],
 formal:['Офіційний жанр: звіт, презентація для партнерів',[['Благодійна організація «Благодійний фонд “Стабілізейшен Суппорт Сервісез”»','«Благодійна» з великої — в офіційних і формальних жанрах.'],['Благодійний фонд «Стабілізейшен Суппорт Сервісез»','Коротша форма для повторних згадок.']]],
 post1:['Допис, новина: перша згадка',[['Благодійний фонд «Стабілізейшен Суппорт Сервісез»','Основна форма для публікацій.'],['благодійна організація «Благодійний фонд “Стабілізейшен Суппорт Сервісез”»','«благодійна» з малої — у менш формальних текстах.']]],
 post2:['Допис, новина: повторна згадка',[['БФ «ССС»','Найкоротша офіційна форма.'],['Благодійний фонд «ССС»',''],['фонд','або «наш фонд» — з малої літери.']]],
 disc:['Дисклеймер',[['Матеріал підготовлено БФ «ССС» за підтримки [донор]. Зміст є відповідальністю БФ «ССС» і не обов’язково відображає позицію [донор].','Приклад. Якщо донор дав власне формулювання — використовуйте його.']]],
 en:['Англійською: документи',[[FULL_EN,'Повна юридична назва англійською.'],['CO “SSS”','Скорочена юридична назва.']]]};
$('nmCtx').innerHTML='<span class="lbl" style="margin-bottom:6px">Що ви пишете?</span>'+Object.entries(NM).map(([k,v],i)=>`<button class="chip" style="text-align:left;padding:12px 16px" data-v="${k}" aria-pressed="${i===3}">${v[0]}</button>`).join('');
function nm(k){$('nmOut').innerHTML=NM[k][1].map(([t,n],i)=>`<div class="nmo" style="animation-delay:${i*70}ms"><p>${t}${n?`<small>${n}</small>`:''}</p><button class="cp" data-t="${t.replace(/"/g,'&quot;')}">Копіювати</button></div>`).join('')}
$('nmCtx').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;press($('nmCtx'),b);nm(b.dataset.v)};
$('nmOut').onclick=e=>{const b=e.target.closest('[data-t]');if(b)copy(b.dataset.t)};
nm('post1');

/* ---------- file name + checklist ---------- */
const TR={а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ie',ж:'zh',з:'z',и:'y',і:'i',ї:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'iu',я:'ia','’':'',"'":'',ʼ:''};const TRS={є:'ye',ї:'yi',й:'y',ю:'yu',я:'ya'};
function translit(s){return String(s).toLowerCase().split(/(\s+)/).map(w=>[...w].map((ch,i)=>i===0&&TRS[ch]?TRS[ch]:(TR[ch]!==undefined?TR[ch]:ch)).join('')).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
$('fnD').value=new Date().toISOString().slice(0,10);
function fn(){const t=translit($('fnT').value).slice(0,40);$('fnOut').textContent=`${$('fnD').value}_${$('fnN').value}_${$('fnR').value}_${t||'tema'}_${$('fnV').value}.png`}
['fnD','fnN','fnR','fnV','fnT'].forEach(id=>$(id).addEventListener('input',fn));fn();
$('fnCopy').onclick=()=>copy($('fnOut').textContent,'Назву скопійовано');
const CK=['Аудиторія і рубрика визначені, колір відповідає напряму','Формат і розмір відповідають мережі','Поля 64 px, елементи стоять по сітці','Логотип: правильна версія, колір, захисне поле','Вимоги донора до візуалізації виконані','Не більше трьох кольорів і одного акценту','Тільки Manrope і Onest, кегль від 24 px','Заголовок до 3 рядків, одне виділення','Контраст тексту від 4,5:1','Фото з дозволом, без персональних даних','Цифри перевірені, є джерело і дата','Назва фонду написана правильно','Лапки, апостроф, тире, пробіли в числах','Альт-текст до зображень','Файл названо за правилом'];
let ckS=store.get('sss-check',[]);
$('ckList').innerHTML=CK.map((t,i)=>`<label class="ck"><input type="checkbox" id="ck${i}" ${ckS.includes(i)?'checked':''}><span>${t}</span></label>`).join('')+'<button class="btn o s" id="ckReset" style="margin-top:14px">Очистити</button>';
function ckUpd(){ckS=CK.map((_,i)=>$('ck'+i).checked?i:-1).filter(i=>i>=0);store.set('sss-check',ckS);$('ckBar').style.width=(ckS.length/CK.length*100)+'%';if(ckS.length===CK.length)toast('Готово до публікації')}
$('ckList').addEventListener('change',ckUpd);$('ckReset').onclick=()=>{CK.forEach((_,i)=>$('ck'+i).checked=false);ckUpd()};
$('ckBar').style.width=(ckS.length/CK.length*100)+'%';

/* ---------- motion ---------- */
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
function countUp(el,to,dur,html){if(RM){el.innerHTML=html?html(to):fmt(to);return}const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),v=to*e;el.innerHTML=html?html(v):fmt(v);if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
countUp($('heroNum'),543370,2200,v=>{const s=String(Math.round(v)).padStart(6,'0');return s.slice(0,3)+'<br>'+s.slice(3)});
document.querySelectorAll('[data-count]').forEach(el=>countUp(el,+el.dataset.count,1600));
const WORDS=['Гуманітарна допомога постраждалим від війни','Відновлення та розвиток громад','Адвокація','Правопросвітництво','Підтримка рад ВПО','Підтримка системи соціального захисту населення'];let wi=0;
if(!RM)setInterval(()=>{wi=(wi+1)%WORDS.length;const sp=$('heroWord');const n=document.createElement('span');n.id='heroWord';n.textContent=WORDS[wi];sp.replaceWith(n)},3200);
const rv=[...document.querySelectorAll('.rv')];
if(!RM&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('hid');io.unobserve(en.target)}}),{rootMargin:'0px 0px -8% 0px'});
  rv.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('hid');io.observe(el)}})}
const hdr=$('top');addEventListener('scroll',()=>hdr.classList.toggle('sc',scrollY>10),{passive:true});
const navA=[...document.querySelectorAll('nav.mn a')];
const so=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)navA.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('section.s').forEach(s=>so.observe(s));

/* draw after fonts */
Promise.all(['800 60px Manrope','700 22px Manrope','500 30px Onest'].map(f=>document.fonts.load(f))).then(draw,draw);
draw();
window.SSS={C,LG,drawLogo,$,toast,copy,saveBlob};
})();
