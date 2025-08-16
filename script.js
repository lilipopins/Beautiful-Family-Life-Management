// ------ Core: one section at a time ------
const links  = [...document.querySelectorAll('.nav a')];
const secs   = [...document.querySelectorAll('main .section')];
function setActiveLink(hash){ links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===hash)); }
function showSection(hash){
  if(!hash || !document.querySelector(hash)) hash = '#accueil';
  secs.forEach(s => s.classList.toggle('active', ('#'+s.id)===hash));
  setActiveLink(hash);
}
window.addEventListener('hashchange', () => showSection(location.hash));
showSection(location.hash);

// ------ Plan (Offert vs Premium) ------
const Plan = {
  key: 'bfl_plan_tier',
  get tier(){ return localStorage.getItem(this.key) || 'free'; },
  set tier(v){ localStorage.setItem(this.key, v); this.apply(); },
  apply(){
    const isPremium = this.tier==='premium';
    document.querySelectorAll('[data-premium]').forEach(el => {
      el.disabled = !isPremium;
      el.title = isPremium ? '' : 'Fonction Premium';
    });
    enforceDocLimit();
  }
};
const planSelect = document.getElementById('planSelect');
planSelect.value = Plan.tier;
planSelect.addEventListener('change', () => { Plan.tier = planSelect.value; });
Plan.apply();

// Upsell dialog helper
const dlgPremium = document.getElementById('premiumDialog');
function upsell(){ if (Plan.tier!=='premium') dlgPremium.showModal(); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-premium]');
  if (!t) return;
  if (Plan.tier!=='premium') { e.preventDefault(); e.stopPropagation(); upsell(); }
});

// ------ Sub-tabs inside #modules ------
const moduleTabs = [...document.querySelectorAll('#modules .tab')];
const modulePanels = [...document.querySelectorAll('#modules .tab-panel')];
function setModuleTab(tab){
  const current = tab || (new URL(location.href).searchParams.get('tab') || 'organisation');
  moduleTabs.forEach(b => b.classList.toggle('active', b.dataset.tab===current));
  moduleTabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab===current)));
  modulePanels.forEach(p => p.hidden = (p.dataset.panel!==current));
  const url = new URL(location.href);
  url.hash = '#modules';
  url.searchParams.set('tab', current);
  history.replaceState(null, '', url.toString());
}
moduleTabs.forEach(b => b.addEventListener('click', () => setModuleTab(b.dataset.tab)));
setModuleTab();

// ------ Organisation: tasks store ------
const TaskStore = {
  key: 'bfl_tasks_v1',
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)||'[]'); }catch(e){ return []; } },
  save(list){ localStorage.setItem(this.key, JSON.stringify(list)); },
  add(task){ const list=this.all(); list.push(task); this.save(list); return task; },
  update(task){ const list=this.all().map(t=>t.id===task.id?task:t); this.save(list); },
  remove(id){ const list=this.all().filter(t=>t.id!==id); this.save(list); },
};
function uid(prefix='t'){ return prefix+'_'+Math.random().toString(36).slice(2,9); }

function renderTasks(){
  const list = TaskStore.all();
  const who = document.getElementById('filterAssigned').value;
  const st  = document.getElementById('filterStatus').value;
  const view = list.filter(t => (!who || t.assignedTo===who) && (!st || t.status===st));

  const ul = document.getElementById('taskList');
  ul.innerHTML = '';
  view.forEach(t => {
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `
      <div>
        <h4>${t.title}</h4>
        <div class="meta">
          ${(t.assignedTo||'Non assignée')} · ${(t.priority||'med').toUpperCase()} ·
          ${(t.due?new Date(t.due).toLocaleString(): 'Sans échéance')}
          ${t.repeat && t.repeat!=='none' ? ' · ↻ ' + t.repeat : ''}
        </div>
      </div>
      <div class="actions">
        <button data-edit="${t.id}" class="btn">Éditer</button>
        <button data-del="${t.id}" class="btn">Suppr.</button>
      </div>`;
    ul.appendChild(li);
  });

  const select = document.getElementById('filterAssigned');
  const names = [...new Set(TaskStore.all().map(t=>t.assignedTo).filter(Boolean))].sort();
  select.innerHTML = '<option value="">Tous</option>' + names.map(n=>`<option>${n}</option>`).join('');
}

document.getElementById('btnAddTask').addEventListener('click', () => {
  const dlg = document.getElementById('taskDialog');
  const form = document.getElementById('taskForm');
  document.getElementById('taskDialogTitle').textContent='Nouvelle tâche';
  form.reset(); form.dataset.id='';
  dlg.showModal();
});

document.getElementById('taskList').addEventListener('click', (e) => {
  const idEdit = e.target.getAttribute('data-edit');
  const idDel  = e.target.getAttribute('data-del');
  if (idEdit) {
    const t = TaskStore.all().find(x=>x.id===idEdit);
    if (!t) return;
    const form = document.getElementById('taskForm');
    document.getElementById('taskDialogTitle').textContent='Modifier la tâche';
    form.dataset.id = t.id;
    form.title.value = t.title;
    form.assignedTo.value = t.assignedTo || '';
    form.due.value = t.due ? new Date(t.due).toISOString().slice(0,16) : '';
    form.repeat.value = t.repeat || 'none';
    form.priority.value = t.priority || 'med';
    form.notes.value = t.notes || '';
    document.getElementById('taskDialog').showModal();
  }
  if (idDel) {
    if (confirm('Supprimer cette tâche ?')) { TaskStore.remove(idDel); renderTasks(); }
  }
});

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.submitter?.value !== 'save') return;
  const form = e.target;
  const rep = form.repeat.value;
  if (Plan.tier!=='premium' && rep!=='none') { upsell(); return; }
  const payload = {
    id: form.dataset.id || uid(),
    title: form.title.value.trim(),
    assignedTo: form.assignedTo.value.trim(),
    due: form.due.value ? new Date(form.due.value).toISOString() : '',
    repeat: rep,
    priority: form.priority.value || 'med',
    status: 'todo',
    notes: form.notes.value.trim()
  };
  if (!payload.title) return alert('Le titre est requis.');
  if (form.dataset.id) TaskStore.update(payload); else TaskStore.add(payload);
  document.getElementById('taskDialog').close();
  renderTasks();
});
renderTasks();

// ------ Documents: free limit 3 ------
const DocStore = {
  key: 'bfl_docs_v1',
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)||'[]'); }catch(e){ return []; } },
  save(list){ localStorage.setItem(this.key, JSON.stringify(list)); },
  add(doc){ const list=this.all(); list.push(doc); this.save(list); return doc; },
  remove(id){ const list=this.all().filter(d=>d.id!==id); this.save(list); },
  count(){ return this.all().length; }
};
function renderDocs(){
  const ul = document.getElementById('docList');
  if (!ul) return;
  const docs = DocStore.all();
  ul.innerHTML = '';
  if (!docs.length) {
    const li = document.createElement('li');
    li.className='empty-state';
    li.textContent='Aucun document.';
    ul.appendChild(li);
  } else {
    docs.forEach(d => {
      const li = document.createElement('li');
      li.className = 'card';
      li.innerHTML = `<div><h4>${d.name}</h4><div class="meta">${d.tags||''}</div></div>
                      <div class="actions"><button data-doc-del="${d.id}" class="btn">Suppr.</button></div>`;
      ul.appendChild(li);
    });
  }
  enforceDocLimit();
}
function enforceDocLimit(){
  const btn = document.getElementById('btnAddDoc');
  if (!btn) return;
  const limitReached = (Plan.tier!=='premium' && DocStore.count() >= 3);
  btn.disabled = limitReached;
  btn.title = limitReached ? 'Limite atteinte (3 en Offert) — passez Premium' : '';
}
document.getElementById('btnAddDoc')?.addEventListener('click', () => {
  if (Plan.tier!=='premium' && DocStore.count() >= 3) { upsell(); return; }
  const name = prompt('Nom du document (ex: Assurance.pdf)');
  if (!name) return;
  DocStore.add({ id: uid('doc'), name, tags: '' });
  renderDocs();
});
document.addEventListener('click', (e) => {
  const idDel = e.target.getAttribute('data-doc-del');
  if (idDel) { DocStore.remove(idDel); renderDocs(); }
});
renderDocs();

// ============== REPA S: full module (menus + shopping list) ==============
const Meals = {
  key: 'bfl_meals_v1',
  _load(){ try{ return JSON.parse(localStorage.getItem(this.key)||'{}'); }catch(e){ return {}; } },
  _save(db){ localStorage.setItem(this.key, JSON.stringify(db)); },
  currentWeekKey(){
    const d=new Date();
    // ISO week
    const dayNum = (d.getDay()+6)%7; // 0=Mon
    d.setDate(d.getDate()-dayNum+3);
    const firstThursday = new Date(d.getFullYear(),0,4);
    const week = 1+Math.round(((d-firstThursday)/86400000-3+((firstThursday.getDay()+6)%7))/7);
    const year = d.getFullYear();
    return `${year}-W${String(week).padStart(2,'0')}`;
  },
  getWeeks(){ return Object.keys(this._load()); },
  ensureWeek(key){
    const db = this._load();
    if (!db[key]) db[key] = {
      days: {mon:{b:'',l:'',d:''},tue:{b:'',l:'',d:''},wed:{b:'',l:'',d:''},thu:{b:'',l:'',d:''},fri:{b:'',l:'',d:''},sat:{b:'',l:'',d:''},sun:{b:'',l:'',d:''}},
      list: []
    };
    this._save(db);
    return db[key];
  },
  getWeek(key){ return this.ensureWeek(key); },
  setMeal(key, day, slot, value){
    const db=this._load(); this.ensureWeek(key);
    db[key].days[day][slot]=value; this._save(db);
  },
  addItem(key, name, qty=''){
    const db=this._load(); this.ensureWeek(key);
    db[key].list.push({ id: 'i_'+Math.random().toString(36).slice(2,9), name, qty, done:false });
    this._save(db);
  },
  toggleItem(key, id, done){
    const db=this._load(); const wk=db[key]; if (!wk) return;
    const it = wk.list.find(x=>x.id===id); if (!it) return;
    it.done = done; this._save(db);
  },
  removeItem(key, id){
    const db=this._load(); const wk=db[key]; if (!wk) return;
    wk.list = wk.list.filter(x=>x.id!==id); this._save(db);
  },
  clearBought(key){
    const db=this._load(); const wk=db[key]; if (!wk) return;
    wk.list = wk.list.filter(x=>!x.done); this._save(db);
  },
  clearWeek(key){
    const db=this._load(); this.ensureWeek(key);
    db[key].days = {mon:{b:'',l:'',d:''},tue:{b:'',l:'',d:''},wed:{b:'',l:'',d:''},thu:{b:'',l:'',d:''},fri:{b:'',l:'',d:''},sat:{b:'',l:'',d:''},sun:{b:'',l:'',d:''}};
    db[key].list = [];
    this._save(db);
  },
  exportMealsText(key){
    const wk=this.getWeek(key);
    const mapDay = {mon:'Lun',tue:'Mar',wed:'Mer',thu:'Jeu',fri:'Ven',sat:'Sam',sun:'Dim'};
    const lines = [];
    for (const d of ['mon','tue','wed','thu','fri','sat','sun']){
      const v = wk.days[d];
      lines.push(`${mapDay[d]} — Petit-déj: ${v.b||'—'} | Déj: ${v.l||'—'} | Dîner: ${v.d||'—'}`);
    }
    return lines.join('\n');
  },
  exportListText(key){
    const wk=this.getWeek(key);
    return wk.list.map(it => `- ${it.name}${it.qty? ' x'+it.qty:''}${it.done?' (✓)':''}`).join('\n');
  },
};

const weekSelect = document.getElementById('weekSelect');
const weekPlan = document.getElementById('weekPlan');
const mealSuggestions = ['Pâtes bolo','Poulet rôti','Poisson au four','Omelette','Salade composée','Soupe maison','Tacos maison','Riz sauté','Gratin de légumes','Pizzas maison'];

function renderWeekOptions(selected){
  const weeks = new Set(Meals.getWeeks());
  weeks.add(Meals.currentWeekKey());
  const arr = [...weeks].sort().slice(-12); // 12 dernières semaines
  weekSelect.innerHTML = arr.map(k=>`<option value="${k}">${k}</option>`).join('');
  weekSelect.value = selected || Meals.currentWeekKey();
}
function mealRow(dayKey, dayLabel, wkKey){
  const wk = Meals.getWeek(wkKey);
  const v  = wk.days[dayKey];
  return `
    <div class="day">${dayLabel}</div>
    <input list="mealSuggestions" data-day="${dayKey}" data-slot="b" placeholder="Petit-déj" value="${v.b||''}">
    <input list="mealSuggestions" data-day="${dayKey}" data-slot="l" placeholder="Déjeuner" value="${v.l||''}">
    <input list="mealSuggestions" data-day="${dayKey}" data-slot="d" placeholder="Dîner" value="${v.d||''}">
  `;
}
function renderWeekPlan(){
  const wkKey = weekSelect.value || Meals.currentWeekKey();
  Meals.ensureWeek(wkKey);
  weekPlan.innerHTML = [
    mealRow('mon','Lun',wkKey),
    mealRow('tue','Mar',wkKey),
    mealRow('wed','Mer',wkKey),
    mealRow('thu','Jeu',wkKey),
    mealRow('fri','Ven',wkKey),
    mealRow('sat','Sam',wkKey),
    mealRow('sun','Dim',wkKey),
  ].join('');
}
function attachMealHandlers(){
  weekPlan.addEventListener('change', (e)=>{
    if (e.target.matches('input[data-day]')){
      const day=e.target.getAttribute('data-day');
      const slot=e.target.getAttribute('data-slot');
      Meals.setMeal(weekSelect.value, day, slot, e.target.value.trim());
    }
  });
}

document.getElementById('btnWeekNew').addEventListener('click', () => {
  const base = Meals.currentWeekKey();
  const custom = prompt('Nom de la semaine (ex: 2025-W34)', base);
  if (!custom) return;
  Meals.ensureWeek(custom);
  renderWeekOptions(custom);
  renderWeekPlan();
});
document.getElementById('btnWeekAuto').addEventListener('click', () => {
  if (Plan.tier!=='premium') { upsell(); return; }
  const wkKey = weekSelect.value;
  const picks = [...mealSuggestions].sort(()=>Math.random()-0.5).slice(7);
  const wk = Meals.getWeek(wkKey);
  const days = ['mon','tue','wed','thu','fri','sat','sun'];
  days.forEach((d,i)=>{ wk.days[d].d = picks[i] || wk.days[d].d; });
  // Save
  const db = JSON.parse(localStorage.getItem(Meals.key)||'{}'); db[wkKey]=wk; localStorage.setItem(Meals.key, JSON.stringify(db));
  renderWeekPlan();
});
document.getElementById('btnWeekClear').addEventListener('click', () => {
  if (!confirm('Vider menus + liste de courses de cette semaine ?')) return;
  Meals.clearWeek(weekSelect.value);
  renderWeekPlan(); renderList();
});
document.getElementById('btnExportMeals').addEventListener('click', () => {
  const txt = Meals.exportMealsText(weekSelect.value);
  navigator.clipboard.writeText(txt).then(()=>alert('Menus copiés dans le presse‑papiers.'));
});

// Shopping list
const listEl = document.getElementById('shoppingList');
function renderList(){
  const wk = Meals.getWeek(weekSelect.value);
  listEl.innerHTML = '';
  if (!wk.list.length){
    const li = document.createElement('li'); li.className='empty-state'; li.textContent='Liste vide.'; listEl.appendChild(li);
    return;
  }
  wk.list.forEach(it => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${it.done?'checked':''} data-id="${it.id}">
      <span class="name ${it.done?'done':''}">${it.name}${it.qty? ' x'+it.qty:''}</span>
      <button class="btn" data-remove="${it.id}">Suppr.</button>`;
    listEl.appendChild(li);
  });
}
document.getElementById('btnAddItem').addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const qty  = document.getElementById('itemQty').value.trim();
  if (!name) return;
  Meals.addItem(weekSelect.value, name, qty);
  document.getElementById('itemName').value=''; document.getElementById('itemQty').value='';
  renderList();
});
listEl.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')){
    Meals.toggleItem(weekSelect.value, e.target.getAttribute('data-id'), e.target.checked);
    renderList();
  }
});
listEl.addEventListener('click', (e) => {
  const id = e.target.getAttribute('data-remove');
  if (id){ Meals.removeItem(weekSelect.value, id); renderList(); }
});
document.getElementById('btnClearBought').addEventListener('click', () => {
  Meals.clearBought(weekSelect.value); renderList();
});
document.getElementById('btnExportList').addEventListener('click', () => {
  const txt = Meals.exportListText(weekSelect.value);
  navigator.clipboard.writeText(txt).then(()=>alert('Liste copiée dans le presse‑papiers.'));
});

// Init Repas
renderWeekOptions();
renderWeekPlan();
attachMealHandlers();
renderList();

// Dummy premium toolbar actions
document.getElementById('btnShareCalendar').addEventListener('click', upsell);
document.getElementById('btnNotify').addEventListener('click', upsell);
