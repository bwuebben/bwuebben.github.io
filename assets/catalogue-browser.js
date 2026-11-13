(() => {
  'use strict';
  const root = document.querySelector('.paper-browser');
  if (!root) return;
  const data = JSON.parse(document.getElementById('catalogue-data').textContent);
  const results = document.getElementById('catalogue-results');
  const search = document.getElementById('paper-search');
  const sort = document.getElementById('catalogue-sort');
  const subjectSelect = document.getElementById('catalogue-subject');
  const summaries = document.getElementById('show-summaries');
  const clear = document.getElementById('clear-search');
  const links = Array.from(root.querySelectorAll('[data-field]'));
  const sections = Array.from(results.querySelectorAll('.catalogue-field'));
  const fieldNames = Object.fromEntries(data.fields.map(f => [f.id, f.label]));
  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[–—−-]/g, ' ');
  let field = 'all';
  const records = data.papers.map((paper, index) => {
    const row = document.getElementById(paper.anchor);
    const note = row.querySelector('.entry-note');
    const container = row.parentElement;
    const text = normalize([paper.title, paper.series, fieldNames[paper.field], note.textContent].join(' '));
    const meta = document.createElement('div');
    meta.className = 'record-meta';
    const date = document.createElement('time');
    date.dateTime = paper.date;
    const prettyDate = paper.date.length === 4 ? paper.date : new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(paper.date.length === 7 ? paper.date + '-01' : paper.date));
    date.textContent = (paper.revised ? 'Revised ' : '') + prettyDate;
    meta.append(date);
    if (paper.status !== 'Preprint') {
      const status = document.createElement('span');
      status.className = 'revision-status';
      status.textContent = paper.status;
      meta.append(status);
    }
    const subject = document.createElement('span');
    subject.textContent = '· ' + fieldNames[paper.field];
    subject.hidden = true;
    meta.append(subject);
    const actions = document.createElement('div');
    actions.className = 'record-actions';
    const read = document.createElement('a');
    read.href = paper.read_url;
    read.textContent = paper.read_label + ' ↗';
    read.setAttribute('aria-label', paper.read_label + ': ' + paper.title);
    actions.append(read);
    const detail = document.createElement('details');
    detail.className = 'paper-summary';
    const summary = document.createElement('summary');
    summary.textContent = 'Summary & links';
    detail.append(summary, note);
    row.append(meta, actions, detail);
    return {...paper, row, container, text, index, detail, subject};
  });
  const flat = document.createElement('ul');
  flat.className = 'entries';
  flat.hidden = true;
  results.append(flat);

  function stateFromUrl() {
    const params = new URLSearchParams(location.search);
    field = fieldNames[params.get('subject')] ? params.get('subject') : 'all';
    search.value = params.get('q') || '';
    sort.value = ['newest','title'].includes(params.get('sort')) ? params.get('sort') : 'programme';
  }
  function updateUrl(push) {
    const url = new URL(location.href);
    url.search = '';
    if (field !== 'all') url.searchParams.set('subject', field);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    if (sort.value !== 'programme') url.searchParams.set('sort', sort.value);
    url.hash = '';
    history[push ? 'pushState' : 'replaceState']({}, '', url);
  }
  function render(changeUrl = false, push = false) {
    const tokens = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = records.filter(p => (field === 'all' || p.field === field) && tokens.every(t => p.text.includes(t)));
    const shown = new Set(visible);
    for (const paper of records) {
      paper.row.hidden = !shown.has(paper);
      paper.subject.hidden = sort.value === 'programme';
    }
    if (sort.value === 'programme') {
      for (const paper of records) paper.container.append(paper.row);
      flat.hidden = true;
      for (const section of sections) {
        section.hidden = !visible.some(p => p.field === section.dataset.fieldSection);
        for (const list of section.querySelectorAll('.entries')) {
          const hasRows = Array.from(list.children).some(row => !row.hidden);
          list.hidden = !hasRows;
          if (list.previousElementSibling?.classList.contains('series-heading')) list.previousElementSibling.hidden = !hasRows;
        }
      }
    } else {
      visible.sort(sort.value === 'newest' ? (a,b) => b.date.localeCompare(a.date) || a.index-b.index : (a,b) => a.title.localeCompare(b.title));
      for (const paper of records) paper.container.append(paper.row);
      flat.replaceChildren(...visible.map(p => p.row));
      flat.hidden = !visible.length;
      for (const section of sections) section.hidden = true;
    }
    for (const link of links) {
      if (link.dataset.field === field) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    const scope = field === 'all' ? 'All subjects' : fieldNames[field];
    subjectSelect.value = field;
    document.getElementById('catalogue-count').textContent = `${scope} · ${visible.length} ${visible.length === 1 ? 'paper' : 'papers'}${tokens.length ? ' matching your search' : ''}`;
    document.getElementById('catalogue-empty').hidden = !!visible.length;
    clear.hidden = !search.value;
    if (changeUrl) updateUrl(push);
  }
  function revealHash() {
    const anchor = decodeURIComponent(location.hash.slice(1));
    if (!anchor) return;
    const paper = records.find(p => p.anchor === anchor);
    const group = Object.keys(data.aliases).find(key => data.aliases[key].includes(anchor) || anchor === 'field-' + key);
    if (paper || group) {
      field = paper ? paper.field : group;
      search.value = '';
      sort.value = 'programme';
      render();
      requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({block:'start'}));
    }
  }
  function showSubject(value) {
    field = value;
    render(true, true);
    const controls = root.querySelector('.catalogue-tools');
    if (controls.getBoundingClientRect().top < 0) controls.scrollIntoView({block:'start'});
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showSubject(link.dataset.field);
  }));
  search.addEventListener('input', () => render(true));
  subjectSelect.addEventListener('change', () => showSubject(subjectSelect.value));
  sort.addEventListener('change', () => render(true));
  summaries.addEventListener('change', () => records.forEach(p => { p.detail.open = summaries.checked; }));
  clear.addEventListener('click', () => { search.value=''; render(true); search.focus(); });
  document.getElementById('reset-catalogue').addEventListener('click', () => {
    field='all'; search.value=''; sort.value='programme'; render(true, true); search.focus();
  });
  window.addEventListener('popstate', () => {stateFromUrl(); render(); revealHash();});
  window.addEventListener('hashchange', revealHash);
  root.classList.add('is-enhanced');
  root.querySelector('.catalogue-tools').hidden = false;
  stateFromUrl();
  render();
  revealHash();
})();
