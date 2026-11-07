/* Конструктор інфографіки — бренд-кіт SSS */
(function(){
const {C,LG,drawLogo,$,toast,copy,saveBlob}=window.SSS;
const SER=[C.les,C.son,C.par,C.kam,C.neb];
const CF={ig:[1080,1350,'4:5'],sq:[1080,1080,'1:1'],slide:[1920,1080,'16:9']};
const CBG={mol:[C.mol,C.gly,C.kam,C.pis,'Молоко'],wht:[C.wht,C.gly,C.kam,C.pis,'Білий'],les:[C.les,C.mol,'#C9D3C2','rgba(251,246,236,.18)','Ліс']};
const CT={bars:'Смуги',cols:'Стовпчики',donut:'Кільце',num:'Велике число'};
const X={fmt:'ig',type:'bars',bg:'mol',hl:-1};
const cv=$('chCv'),g=cv.getContext('2d');
const nf=v=>{const neg=v<0;v=Math.abs(v);let [i,d]=String(Math.round(v*10)/10).split('.');i=i.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return (neg?'−':'')+i+(d?','+d:'')};
function parse(){return $('chData').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const m=l.split(/[;\t]|\s[-–—]\s/);const raw=(m.length>1?m[m.length-1]:m[0]).replace(/\s/g,'').replace(',','.').replace(/[^\d.\-]/g,'');return {n:m.length>1?m.slice(0,-1).join(' ').trim():'',v:parseFloat(raw)}}).filter(r=>!isNaN(r.v))}
function wr(t,w){const o=[];String(t).split('\n').forEach(p=>{let l='';p.split(/\s+/).filter(Boolean).forEach(x=>{const s=l?l+' '+x:x;if(g.measureText(s).width>w&&l){o.push(l);l=x}else l=s});if(l)o.push(l)});return o}
function chips(id,items,key){const el=$(id);el.innerHTML=Object.entries(items).map(([v,t])=>`<button class="chip" data-v="${v}" aria-pressed="${X[key]===v}">${Array.isArray(t)?t[t.length-1]:t}</button>`).join('');el.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;X[key]=b.dataset.v;el.querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b));sync();draw()}}
function sync(){const d=parse();const s=$('chHl');const cur=X.hl;s.innerHTML='<option value="-1">Без виділення</option>'+d.map((r,i)=>`<option value="${i}">${i+1}. ${r.n||nf(r.v)}</option>`).join('');s.value=cur<d.length?cur:-1;X.hl=+s.value;$('chHlW').style.display=X.type==='bars'||X.type==='cols'?'':'none'}
function draw(){
  const [W,H]=CF[X.fmt],s=Math.min(W,H)/1080,wide=W>H,[bg,fg,mu,ln]=CBG[X.bg],dark=X.bg==='les';
  cv.width=W;cv.height=H;g.fillStyle=bg;g.fillRect(0,0,W,H);
  const M=80*s,unit='',d=parse(),warn=[];
  let y=M;
  if($('chLogo').checked){drawLogo(g,'ua',M,y,48*s,dark?C.mol:C.les);y+=48*s+64*s}
  g.fillStyle=fg;g.font=`800 ${(wide?60:64)*s}px Manrope`;g.textBaseline='top';
  const tl=wr($('chTitle').value,W-2*M).slice(0,3);tl.forEach((l,i)=>g.fillText(l,M,y+i*(wide?66:70)*s));y+=tl.length*(wide?66:70)*s+48*s;
  const src=$('chSrc').value.trim(),bot=H-M-(src?40*s:0);
  if(src){g.fillStyle=mu;g.font=`400 ${24*s}px Onest`;g.textBaseline='alphabetic';g.fillText(wr(src,W-2*M)[0],M,H-M)}
  const base=dark?C.son:C.les,hlc=dark?C.mol:C.ter,track=ln;
  if(!d.length){g.fillStyle=mu;g.font=`500 ${28*s}px Onest`;g.textBaseline='top';g.fillText('Додайте дані: «Назва; число» — кожен рядок окремо',M,y);return fin(warn)}
  const fmt=v=>nf(v)+(unit==='%'?'%':unit?' '+unit:'');
  if(X.type==='bars'){
    const n=d.length,max=Math.max(...d.map(r=>r.v),0)||1,area=bot-y,row=Math.min(area/n,150*s),bh=Math.min(row*.36,44*s);
    if(n>8)warn.push('Понад 8 рядків — графік стане дрібним. Розбийте на два.');
    d.forEach((r,i)=>{const ry=y+i*row;g.textBaseline='top';g.fillStyle=fg;g.font=`500 ${28*s}px Onest`;g.fillText(wr(r.n,W-2*M)[0]||'',M,ry);
      const by=ry+40*s,vw=200*s,bw=Math.max(4*s,(W-2*M-vw)*Math.max(r.v,0)/max);g.fillStyle=track;g.fillRect(M,by,W-2*M-vw,bh);g.fillStyle=i===X.hl?hlc:base;g.fillRect(M,by,bw,bh);
      g.fillStyle=fg;g.font=`800 ${36*s}px Manrope`;g.textBaseline='middle';g.fillText(fmt(r.v),M+bw+16*s,by+bh/2)});
  }else if(X.type==='cols'){
    const n=d.length,max=Math.max(...d.map(r=>r.v),0)||1,lab=96*s,top=y+56*s,h=bot-lab-top,cw=(W-2*M)/n,bw=Math.min(cw*.62,180*s);
    if(n>7)warn.push('Понад 7 стовпчиків — підписи не вміщаються. Краще «Смуги».');
    g.strokeStyle=ln;g.lineWidth=2*s;g.beginPath();g.moveTo(M,top+h);g.lineTo(W-M,top+h);g.stroke();
    d.forEach((r,i)=>{const cx=M+cw*i+cw/2,bh=Math.max(4*s,h*Math.max(r.v,0)/max);g.fillStyle=i===X.hl?hlc:base;g.fillRect(cx-bw/2,top+h-bh,bw,bh);
      g.fillStyle=fg;g.font=`800 ${(n>5?30:36)*s}px Manrope`;g.textAlign='center';g.textBaseline='bottom';g.fillText(fmt(r.v),cx,top+h-bh-10*s);
      g.font=`500 ${24*s}px Onest`;g.textBaseline='top';wr(r.n,cw-12*s).slice(0,2).forEach((l,k)=>g.fillText(l,cx,top+h+16*s+k*30*s));g.textAlign='left'});
  }else if(X.type==='donut'){
    const tot=d.reduce((a,r)=>a+Math.max(r.v,0),0)||1;if(d.length>5)warn.push('Понад 5 секторів — використайте «Смуги».');
    const area=bot-y,R=wide?Math.min(area/2,300*s):Math.min((W-2*M)/2*.8,(area-(d.length*56*s+40*s))/2),cx=wide?M+R:W/2,cy=y+R;
    let a=-Math.PI/2;d.slice(0,5).forEach((r,i)=>{const e=a+2*Math.PI*Math.max(r.v,0)/tot;g.beginPath();g.arc(cx,cy,R,a,e);g.arc(cx,cy,R*.6,e,a,true);g.closePath();g.fillStyle=dark&&i===0?C.son:dark&&i===1?C.mol:SER[i];g.fill();g.strokeStyle=bg;g.lineWidth=4*s;g.stroke();a=e});
    const p=Math.round(Math.max(d[0].v,0)/tot*100);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.font=`800 ${R*.42}px Manrope`;g.fillText(p+'%',cx,cy);g.textAlign='left';
    const lx=wide?cx+R+80*s:M;let ly=wide?y+20*s:cy+R+48*s;
    d.slice(0,5).forEach((r,i)=>{g.fillStyle=dark&&i===0?C.son:dark&&i===1?C.mol:SER[i];g.fillRect(lx,ly+4*s,28*s,28*s);if(!dark&&i===4){g.strokeStyle=C.kam;g.lineWidth=1.5*s;g.strokeRect(lx,ly+4*s,28*s,28*s)}
      g.fillStyle=fg;g.font=`800 ${30*s}px Manrope`;g.textBaseline='top';const pv=Math.round(Math.max(r.v,0)/tot*100)+'%';g.fillText(pv,lx+44*s,ly);const pw=g.measureText(pv).width;g.font=`500 ${28*s}px Onest`;g.fillText(wr(r.n,W-lx-M-pw-60*s)[0]||'',lx+60*s+pw,ly+2*s);ly+=56*s});
  }else{
    const r=d[0];let fs=(wide?300:260)*s;g.font=`800 ${fs}px Manrope`;const t=fmt(r.v);while(g.measureText(t).width>W-2*M&&fs>80*s){fs-=8*s;g.font=`800 ${fs}px Manrope`}
    if('letterSpacing' in g)g.letterSpacing=`${-fs*.04}px`;g.fillStyle=dark?C.son:C.les;g.textBaseline='alphabetic';const ny=Math.min(bot-180*s,y+fs*.9);g.fillText(t,M,ny);if('letterSpacing' in g)g.letterSpacing='0px';
    if(!dark){g.fillStyle=C.son;g.fillRect(M,ny+20*s,Math.min(g.measureText(t).width,W-2*M),14*s)}
    g.fillStyle=fg;g.font=`500 ${44*s}px Onest`;g.textBaseline="top";wr(r.n,Math.min(W-2*M,860*s)).slice(0,3).forEach((l,i)=>g.fillText(l,M,ny+64*s+i*56*s));
    if(d.length>1)warn.push('«Велике число» бере лише перший рядок.');
  }
  fin(warn);
}
function fin(w){$('chWarn').textContent=w.join(' ');$('chInfo').textContent=`${cv.width}×${cv.height} px · ${CF[X.fmt][2]}`}
chips('chType',CT,'type');chips('chFmt',Object.fromEntries(Object.entries(CF).map(([k,v])=>[k,v[2]])),'fmt');chips('chBg',CBG,'bg');
['chTitle','chData','chSrc','chLogo'].forEach(id=>$(id).addEventListener('input',()=>{if(id==='chData')sync();draw()}));
$('chHl').onchange=e=>{X.hl=+e.target.value;draw()};
$('chDl').onclick=()=>cv.toBlob(b=>{saveBlob(b,`SSS_infografika_${X.type}_${CF[X.fmt][2].replace(':','x')}.png`);toast('PNG завантажено')});
document.querySelectorAll('[data-hex]').forEach(b=>b.onclick=()=>copy(b.dataset.hex,'Скопійовано '+b.dataset.hex));
$('chCopyAll').onclick=()=>copy(SER.concat(C.ter).join(', '),'Скопійовано 6 кольорів');
sync();Promise.all(['800 60px Manrope','500 28px Onest','400 24px Onest'].map(f=>document.fonts.load(f))).then(draw,draw);
})();
(function(){const b=document.getElementById('webCopy');if(!b)return;b.onclick=()=>fetch('web/sss-web.css').then(r=>r.text()).then(t=>{const m=t.match(/:root\{[\s\S]*?\n\}/);SSS.copy(m?m[0]:t,'CSS-змінні скопійовано')}).catch(()=>SSS.copy(':root{--sss-lis:#314C2C;--sss-glybyna:#1B2A18;--sss-moloko:#FBF6EC;--sss-sonyashnyk:#F6B93B;--sss-terakota:#DC643D;--sss-parostok:#A9D48E;--sss-nebo:#D7E6FB;--sss-kamin:#66705F;--sss-pisok:#E6DFD0;--sss-white:#FFFFFF;--sss-font-head:Manrope,Arial,sans-serif;--sss-font-text:Onest,Arial,sans-serif}','CSS-змінні скопійовано'))})();
(function(){const b=document.getElementById('cvKit');if(!b)return;b.onclick=()=>SSS.copy('#314C2C #1B2A18 #FBF6EC #F6B93B #DC643D #A9D48E #D7E6FB #66705F #E6DFD0 #FFFFFF #214E34','Кольори скопійовано — вставте в Brand Kit')})();
(function(){const $=id=>document.getElementById(id);if(!$('anV'))return;
const AV=[['ua_rise','Підйом','Літери SSS піднімаються одна за одною, розділювач виростає, назва відкривається зліва направо. Основна заставка.'],
['ua_pop','Поява','Літери SSS «вистрибують» з легким пружинням, назва м’яко піднімається. Для анонсів і динамічних роликів.'],
['ua_sweep','Смуга','Смуга Соняшник проходить зліва направо і відкриває логотип. Для заставок YouTube і презентацій.'],
['ua_fade','Фокус','Логотип проявляється з розмиття і легкого наближення. Спокійний варіант для звернень і серйозних тем.'],
['en_rise','Підйом · EN','Англійська версія логотипа. Для міжнародних партнерів і донорів.'],
['en_sweep','Смуга · EN','Англійська версія зі смугою Соняшник.'],
['sym_drop','Символ','Лише символ SSS, літери падають із відскоком. Для кінцевих карток, аватарок, коротких Reels.']];
let cur=0,bg='les';
$('anV').innerHTML=AV.map((a,i)=>`<button class="chip" data-i="${i}" aria-pressed="${i===0}">${a[1]}</button>`).join('');
function upd(){const [k,t,d]=AV[cur],sym=k.startsWith('sym'),base=`video/SSS_logo_${k}`;$('anT').textContent=t;$('anD').textContent=d;
  const st=$('anStage');st.classList.toggle('alpha',bg==='alpha');st.style.aspectRatio=sym?'16/9':'16/9';
  const v=$('anVid');v.src=bg==='alpha'?`${base}_alpha_green.webm`:`${base}_${sym?'1x1':'16x9'}.mp4`;v.play&&v.play().catch(()=>{});
  const row=(t,d,btns)=>`<div class="anr"><div><b>${t}</b><span>${d}</span></div><div class="anb">${btns}</div></div>`,btn=(h,n,c='g')=>`<a class="btn ${c} s" href="${h}" download>${n}</a>`;
  $('anDl').innerHTML=row('Reels, Stories, TikTok','вертикальне відео 9:16 на тлі Ліс',btn(`${base}_9x16.mp4`,'MP4 9:16'))
   +(sym?row('Пост у стрічці','квадрат 1:1 на тлі Ліс',btn(`${base}_1x1.mp4`,'MP4 1:1')):row('YouTube, презентація, екран на заході','горизонтальне відео 16:9 на тлі Ліс; вставляється в PowerPoint',btn(`${base}_16x9.mp4`,'MP4 16:9')))
   +row('Поверх свого темного відео','світлий логотип на прозорому тлі',btn(`${base}_alpha_moloko.mov`,'Для монтажу (MOV)','o')+btn(`${base}_alpha_moloko.webm`,'Для сайту (WebM)','o'))
   +row('Поверх свого світлого відео','зелений логотип на прозорому тлі',btn(`${base}_alpha_green.mov`,'Для монтажу (MOV)','o')+btn(`${base}_alpha_green.webm`,'Для сайту (WebM)','o'))}
$('anV').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;cur=+b.dataset.i;$('anV').querySelectorAll('[data-i]').forEach(x=>x.setAttribute('aria-pressed',x===b));upd()};
$('anBg').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;bg=b.dataset.v;$('anBg').querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b));upd()};
upd()})();
