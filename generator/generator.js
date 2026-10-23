'use strict';
/* Generiert ausschließlich lokal im Browser; die Datenquelle ist das archivierte
   Lerntrainer-Snapshot /v1.0.0/index.html auf derselben GitHub-Pages-Origin. */
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
   const set=v=>{state.counts[kind]=Math.max(0,Math.min(30,Math.trunc(Number(v)||0)));row.querySelector('input').value=state.counts[kind];updateStatus();};
   row.querySelector('[data-minus]').onclick=()=>set(state.counts[kind]-1);
   row.querySelector('[data-plus]').onclick=()=>set(state.counts[kind]+1);
   row.querySelector('input').onchange=e=>set(e.target.value);
  }
  block.appendChild(row);
 }
 updateStatus();
}
function configurationKey(){return JSON.stringify({count:nMotors(),printStyle:$('#plateStyle').value,pages:sides(),mode:state.mode,enabled:selectedList(),counts:kinds.map(k=>state.counts[k]),solutions:solutionMode(),qr:$('#practiceQR').checked});}
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
 $('#summary').textContent=`${count} Typenschilder · ${count*sides()} Arbeitsblattseiten · ${sides()===2?'10':'4'} Aufgaben je Motor`;
 $('#generate').disabled=!state.ready||!valid;
 return valid;
}
$('#increase').onclick=()=>{$('#motorCount').value=Math.min(30,nMotors()+1);updateStatus();};
$('#decrease').onclick=()=>{$('#motorCount').value=Math.max(1,nMotors()-1);updateStatus();};
$('#motorCount').oninput=updateStatus;
$('#motorCount').onchange=()=>{$('#motorCount').value=nMotors();updateStatus();};
document.querySelectorAll('[name="distribution"]').forEach(r=>r.onchange=()=>{state.mode=r.value;renderTypes();});
document.querySelectorAll('[name="pages"],[name="solution"]').forEach(r=>r.onchange=updateStatus);
$('#practiceQR').onchange=updateStatus;$('#plateStyle').onchange=updateStatus;
renderTypes();
const iframe=$('#motorEngine');
// Der versteckte Frame steht im HTML vor den Skripten. Bei schnellem Laden
// kann sein load-Ereignis schon vor der Registrierung dieses Listeners liegen.
// Daher die bereits geladene Schnittstelle sofort prüfen UND das Ereignis
// sowie die nächsten Sekunden beobachten.
function activateMotorEngine(){
 if(state.ready)return true;
 try{
  const api=iframe.contentWindow?.__motorlab;
  if(!api||typeof api.newMotor!=='function'||typeof api.questions!=='function')return false;
  state.ready=true;
  $('#status').textContent='Bereit. Die QR-Codes verlinken den versionierten Lerntrainer V1.0.0.';
  updateStatus();
  return true;
 }catch(error){return false;}
}
iframe.addEventListener('load',()=>{
 if(!activateMotorEngine()){
  $('#status').textContent='Lerntrainer geladen, aber die Motordaten-Schnittstelle fehlt. Bitte /v1.0.0/ prüfen.';
 }
});
iframe.addEventListener('error',()=>{
 if(!state.ready)$('#status').textContent='Fehler beim Laden des Lerntrainers. Bitte /v1.0.0/ prüfen.';
});
if(!activateMotorEngine()){
 const probe=setInterval(()=>{if(activateMotorEngine())clearInterval(probe);},250);
 setTimeout(()=>{
  clearInterval(probe);
  if(!state.ready)$('#status').textContent='Lerntrainer nicht bereit. Bitte Seite neu laden (Strg+F5) und /v1.0.0/ prüfen.';
 },12000);
}
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
 const url=new URL('../v1.0.0/',document.baseURI);
 url.searchParams.set('code',solutions?sheet.solutionCode:sheet.practiceCode);
 return url.href;
}
function nameplateSnapshot(doc,clean=false){
 const plate=doc.querySelector('#plate');if(!plate)throw Error('SVG-Typenschild fehlt');
 const clone=plate.cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-hidden','true');
 // Ursprungsschild verwendet CSS für Gravurschrift, Farben und die unterschiedlichen
 // Schildgenerationen. Das CSS bleibt IN DER SVG und beeinflusst keine Dokumentstile.
 const style=document.createElementNS('http://www.w3.org/2000/svg','style');
 // SVG-interne Regeln sind beim Inline-Einfügen NICHT auf das SVG begrenzt.
 // Deswegen ausschließlich .plate-Regeln übernehmen, niemals body, button usw.
 const ruleset=doc.querySelector('style')?.sheet;
 const plateRules=[];
 if(ruleset){for(const rule of ruleset.cssRules){
  if(rule.type!==1)continue;
  const selectors=rule.selectorText.split(',').map(s=>s.trim()).filter(s=>/^\.plate(?=[\s.#:\[]|$)/.test(s));
  if(selectors.length)plateRules.push(`${selectors.join(',')}{${rule.style.cssText}}`);
 }}
 style.textContent=plateRules.join('\n');
 clone.insertBefore(style,clone.firstChild);
 if(clean){
  // Gealterte Druckschilder ohne 135 Patina-Ringe und Kratzspuren.
  clone.querySelectorAll('g[aria-hidden="true"][pointer-events="none"]').forEach(g=>{
   if(g.querySelectorAll('circle').length>=80)g.remove();
  });
  clone.classList.add('print-clean');
  const rules=document.createElementNS('http://www.w3.org/2000/svg','style');
  rules.textContent=`.plate.print-clean rect:not(.hit){fill:#ffffff!important} .plate.print-clean rect.hit{fill:transparent!important;stroke:transparent!important} .plate.print-clean text{fill:#161616!important;opacity:1!important;stroke:none!important} .plate.print-clean path,.plate.print-clean line,.plate.print-clean polyline{stroke:#444!important} .plate.print-clean path[fill]:not([fill="none"]),.plate.print-clean polygon{fill:#fff!important} .plate.print-clean stop{stop-color:#ffffff!important} .plate.print-clean pattern *{opacity:0!important} .plate.print-clean circle,.plate.print-clean ellipse{fill:#fff!important;stroke:#666!important}`;
  clone.appendChild(rules);
 }

 return new XMLSerializer().serializeToString(clone);
}
// Die Datenbank kennt beide Aufgabenformen als Zahleneingabe. Für den Druck
// brauchen reine Ableseaufgaben jedoch keine grossen Rechenkaestchen.
const readingQuestionIds=new Set([
 'current','motorprotectLine','historicCurrent','nomCurrentLow','nomCurrentHigh','starvoltage','deltavoltage'
]);
function isReadingQuestion(q){
 if(q.type!=='num')return false;
 if(readingQuestionIds.has(q.id))return true;
 return /(?:gib den passenden schildwert|steht (?:f[uü]r|auf|im) (?:die|der|das|dem)|welchen (?:bemessungs[- ]?)?(?:außenleiter)?strom (?:nennt|zeigt|steht)|welcher (?:außenleiter)?strom (?:ist|steht) .*schild)/i.test(q.text);
}
function solutionText(q){
 if(q.type==='mc')return q.choices[q.correct];
 const number=Number(q.answer);
 const digits=Math.abs(number)>=100?0:Math.abs(number)<1?3:2;
 return `${number.toLocaleString('de-DE',{maximumFractionDigits:digits,minimumFractionDigits:Math.min(2,digits)})}${q.unit==='Faktor'?' (dimensionslos)':` ${q.unit}`}`;
}
function questionHtml(selection,n){
 const q=selection.q,reading=isReadingQuestion(q);
 const answers=q.type==='mc'?`<div class="paper-choices">${q.choices.map(s=>`<div class="paper-choice">${esc(s)}</div>`).join('')}</div>`:
  reading?`<div class="reading-answer" aria-label="Platz fuer den abgelesenen Wert"></div>`:
  `<div class="writing-space" aria-label="Kariertes Rechenfeld"><svg width="100%" height="100%" aria-hidden="true"><defs><pattern id="grid-${n}" patternUnits="userSpaceOnUse" width="18.897638" height="18.897638"><path d="M 18.897638 0 H 0 V 18.897638" fill="none" stroke="#c6cdd0" stroke-width=".7" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid-${n})" /></svg></div>`;
 return `<article class="paper-question ${q.type==='num'?(reading?'read':'calc'):'mc'}"><div class="paper-qtext"><span class="num">${n}.</span><span>${esc(q.text)}${q.type==='num'?` <span class="unit">[${esc(q.unit)}]</span>`:''}</span></div>${answers}</article>`;
}
function frontHeader(sheet,isBack=false){
 const qr=$('#practiceQR').checked&&!isBack
 ? `<div class="plate-qr"><a class="qr-link" href="${esc(exactUrl(sheet))}" title="Digitale Aufgaben öffnen" aria-label="Online bearbeiten: Motor ${sheet.no}"><svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg><span class="qr-link-words"><span>Online</span><span>bearbeiten</span></span></a><a class="qr-image" href="${esc(exactUrl(sheet))}" title="Digitale Aufgaben öffnen" aria-label="QR-Code: Motor ${sheet.no}">${qrVector(exactUrl(sheet))}</a></div>` : '';
 return `<header class="sheet-header"><div class="sheet-header-main"><h2>Motortypenschild</h2>${isBack?'':`<div class="identity"><span>Name: __________________</span><span>Klasse: __________</span><span>Datum: __________</span></div>`}</div>${qr}</header>`;
}
function paperPage(sheet,sels,first,last){
 const isBack=!first,pageNo=first?1:2;
 const plate=first?`<div class="plate-row"><div class="paper-plate">${sheet.svg}</div></div>`:'';
 return `<section class="sheet-page ${isBack?'back':''} ${sheet.printStyle==='clean'?'print-clean':'print-original'}" data-sheet="${sheet.no}" data-page="${pageNo}">${frontHeader(sheet,isBack)}${plate}<div class="paper-questions">${sels.map((p,j)=>questionHtml(p,j+(first?1:5))).join('')}</div><footer class="paper-foot"><span>Motor ${sheet.no} · Seite ${pageNo} von ${last?2:1}</span><span class="footer-code">Blattcode: ${sheet.practiceCode}</span></footer></section>`;
}
function worksheetPages(sheet){
 if(sides()===1)return paperPage(sheet,sheet.selected,true,false);
 return paperPage(sheet,sheet.selected.slice(0,4),true,true)+paperPage(sheet,sheet.selected.slice(4),false,true);
}
function compactSolutions(sheet){
 const rows=sheet.selected.map((sel,i)=>{
   const q=sel.q,ans=solutionText(q);
   const calc=q.type==='num'&&q.calc?(()=>{
    const lines=String(q.calc).split('\n').map(x=>x.trim()).filter(x=>x.length>=8&&x.length<100);
    // Bevorzugt den tatsächlich eingesetzten Rechenschritt statt einer allgemeinen
    // Einheiten-Erläuterung oder einer überschriftartigen Zahlenwertgleichung.
    return lines.find(x=>/[=≈]/.test(x)&&/\d/.test(x)&&!/^Zahlenwertgleichung/i.test(x))
      ||lines.find(x=>/[=≈]/.test(x))||'';
   })():'';
   return `<li><span class="solution-answer">${esc(ans)}</span>${calc?`<span class="solution-calc"> · ${esc(calc)}</span>`:''}</li>`;
 }).join('');
 return `<section class="solution-block"><div class="solution-block-title"><div class="solutions-text"><h3>Motor ${sheet.no}</h3><ol class="solution-list">${rows}</ol></div><div class="solution-code"><a href="${esc(exactUrl(sheet,true))}" aria-label="Lösungen online: Motor ${sheet.no}">${qrVector(exactUrl(sheet,true))}</a><a class="qr-link" href="${esc(exactUrl(sheet,true))}">Lösungen online</a><span class="solution-id sheet-short-code">${sheet.solutionCode}</span><a class="retry-label" href="${esc(exactUrl(sheet))}">Erneut üben</a><span class="practice-id sheet-short-code">${sheet.practiceCode}</span></div></div></section>`;
}
function solutionDoc(sheets){
 // Maximal drei Motoreinheiten auf einer festen A4-Seite. Das vermeidet,
 // dass der Umbruch je nach Antwortlaenge bereits nach Motor 2 erfolgt.
 const pages=[];
 for(let i=0;i<sheets.length;i+=3){
  const batch=sheets.slice(i,i+3);
  const intro=i===0
   ? `<div class="solution-header"><h2>Lösungen · Motortypenschilder</h2><p>Kurzantworten in der Reihenfolge der Arbeitsblätter. Ausführliche Erklärungen und Rechenwege stehen über die QR-Codes bereit.</p></div>`
   : `<p class="solution-continued">Lösungen · Fortsetzung</p>`;
  pages.push(`<section class="solution-page" data-solution-page="${Math.floor(i/3)+1}" data-motors="${batch.map(s=>s.no).join(',')}">${intro}<div class="solution-batch">${batch.map(compactSolutions).join('')}</div></section>`);
 }
 return pages.join('');
}
function linkDoc(sheets){
 return `<div class="links-header"><h2>Digitale Lösungen</h2><p>Zu jedem Motor führt der QR-Code zu den passenden Antworten und Erklärungen.</p></div>${sheets.map(sheet=>`<section class="link-item"><a href="${esc(exactUrl(sheet,true))}">${qrVector(exactUrl(sheet,true))}</a><div><h3>Motor ${sheet.no}</h3><p><a href="${esc(exactUrl(sheet,true))}">Lösungen online · ${sheet.solutionCode}</a></p><p><a href="${esc(exactUrl(sheet))}">Erneut üben · ${sheet.practiceCode}</a></p></div></section>`).join('')}`;
}
function generate(){
 if(!state.ready||!updateStatus())return;
 $('#generate').disabled=true;$('#status').textContent='Arbeitsblätter werden erstellt …';
 try{
  const kindsToGenerate=distribute(),engine=iframe.contentWindow.__motorlab,doc=iframe.contentDocument;
  const count=sides()===1?4:10;
  const sheets=kindsToGenerate.map((kind,i)=>{
   const seed=seededRandom(),quizSeed=(seed^0x9E3779B9)>>>0;
   engine.newMotor({selection:kind,seed,quizSeed});
   const selected=engine.worksheetSelection(count,seed);
   const practiceCode=engine.makeWorksheetCode(kind,seed,count,false);
   const solutionCode=engine.makeWorksheetCode(kind,seed,count,true);
   return {no:i+1,kind,seed,quizSeed,selected,practiceCode,solutionCode,printStyle:$('#plateStyle').value,svg:nameplateSnapshot(doc,$('#plateStyle').value==='clean')};
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
