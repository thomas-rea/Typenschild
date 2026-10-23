'use strict';
/* Generiert ausschließlich lokal im Browser; die Datenquelle ist das archivierte
   Lerntrainer-Snapshot /v20/index.html auf derselben GitHub-Pages-Origin. */
const $=selector=>document.querySelector(selector);
const labels={standard:'Standardmotor · modern',historical:'Standardmotor · historisch','dahlander-delta':'Dahlander Δ/YY','dahlander-star':'Dahlander Y/YY',dual:'Zwei getrennte Wicklungen'};
const kinds=Object.keys(labels);
const state={mode:'balanced',enabled:new Set(kinds),counts:{standard:1,historical:1,'dahlander-delta':1,'dahlander-star':1,dual:1},sheets:[],ready:false,generatedKey:null};
const esc=text=>String(text??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function nMotors(){return Math.max(1,Math.min(30,Number($('#motorCount').value)||1));}
function sides(){return Number(document.querySelector('[name="pages"]:checked').value);}
function solutionMode(){return document.querySelector('[name="solution"]:checked').value;}
function selectedList(){return kinds.filter(k=>state.enabled.has(k));}
function totalManual(){return kinds.reduce((sum,k)=>sum+state.counts[k],0);}
function renderTypes(){
 const block=$('#typeSelection');block.replaceChildren();
 for(const kind of kinds){
  const row=document.createElement('div');row.className='type-row';
  if(state.mode==='balanced'){
   row.innerHTML=`<label class="checkbox"><input type="checkbox" data-kind="${kind}" ${state.enabled.has(kind)?'checked':''} ${state.enabled.size===1&&state.enabled.has(kind)?'disabled':''}> ${esc(labels[kind])}</label>`;
   row.querySelector('input').addEventListener('change',e=>{if(e.target.checked)state.enabled.add(kind);else if(state.enabled.size>1)state.enabled.delete(kind);renderTypes();});
  }else{
   row.innerHTML=`<span>${esc(labels[kind])}</span><div class="count-controls"><button type="button" data-minus aria-label="${esc(labels[kind])} reduzieren">−</button><input type="number" data-value="${kind}" min="0" max="30" value="${state.counts[kind]}" aria-label="Anzahl ${esc(labels[kind])}"><button type="button" data-plus aria-label="${esc(labels[kind])} erhöhen">+</button></div>`;
   const set=v=>{state.counts[kind]=Math.max(0,Math.min(30,Math.trunc(Number(v)||0)));renderTypes();};
   row.querySelector('[data-minus]').onclick=()=>set(state.counts[kind]-1);
   row.querySelector('[data-plus]').onclick=()=>set(state.counts[kind]+1);
   row.querySelector('input').onchange=e=>set(e.target.value);
  }
  block.appendChild(row);
 }
 updateStatus();
}
function configurationKey(){return JSON.stringify({count:nMotors(),pages:sides(),mode:state.mode,enabled:selectedList(),counts:kinds.map(k=>state.counts[k]),solutions:solutionMode(),qr:$('#practiceQR').checked});}
function updateStatus(){
 if(state.sheets.length&&state.generatedKey!==configurationKey()){
  state.sheets=[];state.generatedKey=null;
  $('#previewToolbar').hidden=true;
  $('#printSheetsRoot').replaceChildren();$('#printSolutionsRoot').replaceChildren();$('#printLinksRoot').replaceChildren();
  $('#status').textContent='Einstellungen geändert. Bitte die Arbeitsblätter neu erstellen.';
 }
 const count=nMotors();
 const valid=state.mode==='balanced'?state.enabled.size>=1:totalManual()===count;
 const error=$('#distributionError');
 error.textContent=state.mode==='manual'&&!valid?`Du hast ${totalManual()} Motoren zugewiesen, benötigt werden ${count}.`:'';
 $('#summary').textContent=`${count} Typenschilder · ${count*sides()} Arbeitsblattseiten · ${sides()===2?'ca. 8':'ca. 4'} Aufgaben je Motor`;
 $('#generate').disabled=!state.ready||!valid;
 return valid;
}
$('#increase').onclick=()=>{$('#motorCount').value=Math.min(30,nMotors()+1);updateStatus();};
$('#decrease').onclick=()=>{$('#motorCount').value=Math.max(1,nMotors()-1);updateStatus();};
$('#motorCount').oninput=updateStatus;
$('#motorCount').onchange=()=>{$('#motorCount').value=nMotors();updateStatus();};
document.querySelectorAll('[name="distribution"]').forEach(r=>r.onchange=()=>{state.mode=r.value;renderTypes();});
document.querySelectorAll('[name="pages"],[name="solution"]').forEach(r=>r.onchange=updateStatus);
$('#practiceQR').onchange=updateStatus;
renderTypes();
const iframe=$('#motorEngine');
iframe.addEventListener('load',()=>{
 try{
  if(!iframe.contentWindow.__motorlab)throw Error('Lerntrainer nicht verfügbar');
  state.ready=true;$('#status').textContent='Bereit. Die QR-Codes verlinken den versionierten Lerntrainer V20.';
  updateStatus();
 }catch(e){$('#status').textContent='Der Lerntrainer konnte nicht geladen werden. Bitte die vollständige Ordnerstruktur auf GitHub Pages veröffentlichen.';}
});
iframe.addEventListener('error',()=>{$('#status').textContent='Fehler beim Laden des Lerntrainers.';});
function seededRandom(){
 const arr=new Uint32Array(1);if(window.crypto?.getRandomValues){window.crypto.getRandomValues(arr);return arr[0];}
 return Math.floor(Math.random()*4294967296)>>>0;
}
function shuffle(array){const out=[...array];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function distribute(){
 if(state.mode==='manual')return shuffle(kinds.flatMap(k=>Array.from({length:state.counts[k]},()=>k)));
 const types=shuffle(selectedList()),out=[];for(let i=0;i<nMotors();i++)out.push(types[i%types.length]);return shuffle(out);
}
function selectQuestions(bank,count){
 const numeric=bank.map((q,i)=>({q,i})).filter(x=>x.q.type==='num');
 const choices=bank.map((q,i)=>({q,i})).filter(x=>x.q.type==='mc');
 const targetNumeric=Math.min(numeric.length,Math.floor(count/2));
 const targetChoice=count-targetNumeric;
 const chosen=[],usedTags=new Set();
 function addFrom(pool,wanted){
  for(let round=0;round<2&&wanted>0;round++){
   for(const p of shuffle(pool)){
    if(wanted===0)break;
    if(chosen.some(x=>x.i===p.i)||(round===0&&usedTags.has(p.q.tag)))continue;
    chosen.push(p);usedTags.add(p.q.tag);wanted--;
   }
  }
 }
 addFrom(numeric,targetNumeric);addFrom(choices,targetChoice);
 if(chosen.length<count)addFrom(bank.map((q,i)=>({q,i})),count-chosen.length);
 return shuffle(chosen).slice(0,count);
}
function exactUrl(sheet,solutions=false){
 // /v20/ ist ein unveränderliches Archiv; /index.html bleibt updatefähig.
 const url=new URL('../v20/',document.baseURI);
 url.searchParams.set('motor',sheet.kind);
 url.searchParams.set('types',sheet.kind);
 url.searchParams.set('seed',sheet.seed);
 url.searchParams.set('quiz',sheet.quizSeed);
 url.searchParams.set('sheet','1');
 url.searchParams.set('items',sheet.selected.map(s=>s.i).join(','));
 if(solutions)url.searchParams.set('solutions','1');
 return url.href;
}
function nameplateSnapshot(doc){
 const plate=doc.querySelector('#plate');if(!plate)throw Error('SVG-Typenschild fehlt');
 const clone=plate.cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-hidden','true');
 // Ursprungsschild verwendet CSS für Gravurschrift, Farben und die unterschiedlichen
 // Schildgenerationen. Das CSS bleibt IN DER SVG und beeinflusst keine Dokumentstile.
 const style=document.createElementNS('http://www.w3.org/2000/svg','style');
 style.textContent=doc.querySelector('style')?.textContent||'';
 clone.insertBefore(style,clone.firstChild);
 return new XMLSerializer().serializeToString(clone);
}
function solutionText(q){
 if(q.type==='mc')return q.choices[q.correct];
 const number=Number(q.answer);
 const digits=Math.abs(number)>=100?0:Math.abs(number)<1?3:2;
 return `${number.toLocaleString('de-DE',{maximumFractionDigits:digits,minimumFractionDigits:Math.min(2,digits)})} ${q.unit}`;
}
function questionHtml(selection,n){
 const q=selection.q;
 const answers=q.type==='mc'?`<div class="paper-choices">${q.choices.map(s=>`<div class="paper-choice">${esc(s)}</div>`).join('')}</div>`:`<div class="writing-space"><i></i><i></i><i></i></div>`;
 return `<article class="paper-question ${q.type}"><div class="paper-qtext"><span class="num">${n}.</span><span>${esc(q.text)}${q.type==='num'?` <span class="unit">[${esc(q.unit)}]</span>`:''}</span></div>${answers}</article>`;
}
function frontHeader(sheet,isBack=false){
 return `<header class="sheet-header"><div class="sheet-title"><h2>Motortypenschild auswerten</h2><div class="sheet-id">Motor ${sheet.no} · ${sides()===1?'Arbeitsblatt':isBack?'Rückseite':'Vorderseite'} · ${esc(labels[sheet.kind])}</div></div></header>${isBack?'':`<div class="identity"><span>Name: __________________________</span><span>Klasse: ______________</span><span>Datum: ____________</span></div>`}`;
}
function paperPage(sheet,sels,first,last){
 const isBack=!first;
 const qr=(!first||!$('#practiceQR').checked)?'':`<div class="plate-qr">${qrVector(exactUrl(sheet,false))}<span>Übung öffnen</span></div>`;
 const plate=first?`<div class="plate-row"><div class="paper-plate">${sheet.svg}</div>${qr}</div>`:'';
 const pageNo=first?1:2;
 return `<section class="sheet-page ${isBack?'back':''}" data-sheet="${sheet.no}" data-page="${pageNo}">${frontHeader(sheet,isBack)}${plate}<div class="questions-title">Aufgaben</div><div class="paper-questions">${sels.map((p,j)=>questionHtml(p,j+(first?1:5))).join('')}</div><footer class="paper-foot"><span>Motor ${sheet.no} · ${pageNo} / ${last?2:1}</span><span>Motortypenschild-Lerntrainer</span></footer></section>`;
}
function worksheetPages(sheet){
 if(sides()===1)return paperPage(sheet,sheet.selected,true,false);
 return paperPage(sheet,sheet.selected.slice(0,4),true,true)+paperPage(sheet,sheet.selected.slice(4),false,true);
}
function compactSolutions(sheet){
 const rows=sheet.selected.map((sel,i)=>{
   const q=sel.q,ans=solutionText(q);
   const calc=q.type==='num'&&q.calc?String(q.calc).split('\n').map(x=>x.trim()).find(x=>x.length>=8&&x.length<105):'';
   return `<li><span class="solution-answer">${esc(ans)}</span>${calc?`<span class="solution-calc"> · ${esc(calc)}</span>`:''}</li>`;
 }).join('');
 return `<section class="solution-block"><div class="solution-block-title"><div><h3>Motor ${sheet.no} · ${esc(labels[sheet.kind])}</h3><ol class="solution-list">${rows}</ol></div><div class="solution-code">${qrVector(exactUrl(sheet,true))}<span>Erklärungen</span></div></div></section>`;
}
function solutionDoc(sheets){
 return `<div class="solution-header"><h2>Lösungen · Motortypenschilder</h2><p>Kurzantworten in der Reihenfolge der Arbeitsblätter. Ausführliche Erklärungen und Rechenwege stehen über die QR-Codes bereit.</p></div>${sheets.map(compactSolutions).join('')}`;
}
function linkDoc(sheets){
 return `<div class="links-header"><h2>Digitale Lösungen</h2><p>Zu jedem Motor führt der QR-Code zu den passenden Antworten und Erklärungen.</p></div>${sheets.map(sheet=>`<section class="link-item">${qrVector(exactUrl(sheet,true))}<div><h3>Motor ${sheet.no}</h3><p>${esc(labels[sheet.kind])} · ${sheet.selected.length} Aufgaben</p></div></section>`).join('')}`;
}
function generate(){
 if(!state.ready||!updateStatus())return;
 $('#generate').disabled=true;$('#status').textContent='Arbeitsblätter werden erstellt …';
 try{
  const kindsToGenerate=distribute(),engine=iframe.contentWindow.__motorlab,doc=iframe.contentDocument;
  const count=sides()===1?4:8;
  const sheets=kindsToGenerate.map((kind,i)=>{
   const seed=seededRandom(),quizSeed=seededRandom();
   engine.newMotor({selection:kind,seed,quizSeed});
   const bank=engine.questions();
   if(bank.length<count)throw Error('Fragenpool zu klein für '+kind);
   const selected=selectQuestions(bank,count);
   return {no:i+1,kind,seed,quizSeed,selected,svg:nameplateSnapshot(doc)};
  });
  state.sheets=sheets;state.generatedKey=configurationKey();
  $('#printSheetsRoot').innerHTML=sheets.map(worksheetPages).join('');
  $('#printSolutionsRoot').innerHTML=solutionMode()==='appendix'||solutionMode()==='separate'?solutionDoc(sheets):'';
  $('#printLinksRoot').innerHTML=solutionMode()==='links'?linkDoc(sheets):'';
  $('#printSolutions').hidden=solutionMode()!=='separate';
  $('#printLinks').hidden=solutionMode()!=='links';
  $('#previewToolbar').hidden=false;
  $('#status').textContent=`${sheets.length} Motoren und ${sheets.length*count} Aufgaben zusammengestellt. Die Druckansicht verwendet A4.`;
  $('#previewToolbar').scrollIntoView({block:'start',behavior:'smooth'});
 }catch(error){console.error(error);$('#status').textContent='Erstellung fehlgeschlagen: '+error.message;}
 finally{updateStatus();}
}
function printMode(mode){
 if(!state.sheets.length)return;
 document.body.dataset.printMode=mode;
 // Im PDF-Dialog „Als PDF speichern“ wählen; in Chrome/Firefox ggf. Kopf-/Fußzeilen deaktivieren.
 window.print();
}
$('#generate').onclick=generate;
$('#regenerate').onclick=generate;
$('#printSheets').onclick=()=>printMode(solutionMode()==='appendix'?'combined':'worksheets');
$('#printSolutions').onclick=()=>printMode('solutions');
$('#printLinks').onclick=()=>printMode('links');
window.__worksheets={state,generate,exactUrl,distribute,selectQuestions};
