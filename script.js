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
    // disable/enable premium elements
    const isPremium = this.tier==='premium';
    document.querySelectorAll('[data-premium]').forEach(el => {
      el.disabled = !isPremium;
      el.title = isPremium ? '' : 'Fonction Premium';
    });
    // Documents: enforce free limit (3)
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

// Intercept clicks on premium buttons (if disabled)
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
  // sync URL param
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

  // refresh assignee filter
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
  if (e.submitter?.value !== 'save') return; // Annuler
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
  const limitReached = (Plan.tier!=='premium' && DocStore.count() >= 3);
  btn.disabled = limitReached;
  btn.title = limitReached ? 'Limite atteinte (3 en Offert) — passez Premium' : '';
}
document.getElementById('btnAddDoc').addEventListener('click', () => {
  if (Plan.tier!=='premium' && DocStore.count() >= 3) { upsell(); return; }
  const name = prompt('Nom du document (ex: Assurance.pdf)');
  if (!name) return;
  DocStore.add({ id: uid('doc'), name, tags: '' });
  renderDocs();
});
document.getElementById('documents')?.addEventListener?.('click', (e) => {
  const idDel = e.target.getAttribute('data-doc-del');
  if (idDel) { DocStore.remove(idDel); renderDocs(); }
});
renderDocs();

// Dummy listeners to show upsell for premium toolbar actions in Organisation
document.getElementById('btnShareCalendar').addEventListener('click', upsell);
document.getElementById('btnNotify').addEventListener('click', upsell);
