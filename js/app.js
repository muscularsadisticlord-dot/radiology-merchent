/*
 * Radiology MCQ Trainer — application logic (vanilla JS, no dependencies)
 */
(function () {
  'use strict';

  var QUESTIONS = window.RAD_QUESTIONS || [];
  var TOPICS = window.RAD_TOPICS || [];
  var Store = window.RadStore;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var MODES = [
    { id: 'all', label: 'All' },
    { id: 'unanswered', label: 'Unanswered' },
    { id: 'wrong', label: 'Previously wrong' },
    { id: 'favorites', label: 'Favorites' }
  ];
  var VIEWS = ['quiz', 'dashboard', 'favorites', 'history'];

  var byId = {};
  QUESTIONS.forEach(function (q) { byId[q.id] = q; });
  var topicIds = TOPICS.map(function (t) { return t.id; });

  var store = Store.load();
  store.settings.topics = store.settings.topics.filter(function (t) { return topicIds.indexOf(t) >= 0; });

  var ui = {
    view: 'quiz',
    deck: [],         // [{ id, order: [original option indices in display order] }]
    idx: 0,
    responses: {},    // qid -> { selected: originalIndex|null, submitted: bool, correct: bool }
    session: null     // reference into store.sessions once the first answer is given
  };

  /* ------------------------------------------------------------ helpers */

  function $(sel, root) { return (root || document).querySelector(sel); }

  /* Small DOM builder: h('div', {class: 'x', onclick: fn}, child, 'text', ...) */
  function h(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
        else if (k === 'style') node.setAttribute('style', v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.appendChild(typeof child === 'string' || typeof child === 'number'
      ? document.createTextNode(String(child)) : child);
  }

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function topicLabel(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i].label;
    return id;
  }
  function modeLabel(id) {
    for (var i = 0; i < MODES.length; i++) if (MODES[i].id === id) return MODES[i].label;
    return id;
  }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function fmtDate(ts) {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return new Date(ts).toISOString(); }
  }
  function isFav(id) { return store.favorites.indexOf(id) >= 0; }

  function persist() {
    if (!Store.save(store) && Store.isAvailable()) {
      toast('Could not save progress (storage full or blocked).');
    }
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ------------------------------------------------------------- deck */

  function matchesFilters(q) {
    var st = store.settings;
    if (st.topics.length && st.topics.indexOf(q.topic) < 0) return false;
    var a = store.attempts[q.id];
    switch (st.mode) {
      case 'unanswered': return !a;
      case 'wrong': return !!a && a.last === false;
      case 'favorites': return isFav(q.id);
      default: return true;
    }
  }

  function buildDeck() {
    var ids = QUESTIONS.filter(matchesFilters).map(function (q) { return q.id; });
    if (store.settings.shuffle) ids = shuffled(ids);
    ui.deck = ids.map(function (id) {
      return { id: id, order: store.settings.shuffle ? shuffled([0, 1, 2, 3]) : [0, 1, 2, 3] };
    });
    ui.idx = 0;
    ui.responses = {};
    ui.session = null;
  }

  function current() {
    var item = ui.deck[ui.idx];
    return item ? { item: item, q: byId[item.id] } : null;
  }

  function responseFor(id) {
    if (!ui.responses[id]) ui.responses[id] = { selected: null, submitted: false, correct: false };
    return ui.responses[id];
  }

  /* ---------------------------------------------------------- actions */

  function selectOption(originalIndex) {
    var c = current();
    if (!c) return;
    var r = responseFor(c.q.id);
    if (r.submitted) return;
    r.selected = originalIndex;
    renderQuiz();
  }

  function submitAnswer() {
    var c = current();
    if (!c) return;
    var r = responseFor(c.q.id);
    if (r.submitted || r.selected === null) return;
    var now = Date.now();
    r.submitted = true;
    r.correct = r.selected === c.q.answer;

    var a = store.attempts[c.q.id] || { n: 0, correct: 0, last: false, ts: 0 };
    a.n += 1;
    if (r.correct) a.correct += 1;
    a.last = r.correct;
    a.ts = now;
    store.attempts[c.q.id] = a;

    store.streak.current = r.correct ? store.streak.current + 1 : 0;
    store.streak.best = Math.max(store.streak.best, store.streak.current);

    store.log.push({ id: c.q.id, correct: r.correct, ts: now });

    if (!ui.session) {
      ui.session = {
        id: now, start: now, end: now,
        topics: store.settings.topics.slice(),
        mode: store.settings.mode,
        answered: 0, correct: 0
      };
      store.sessions.push(ui.session);
    }
    ui.session.answered += 1;
    if (r.correct) ui.session.correct += 1;
    ui.session.end = now;

    persist();
    renderQuiz();
    var fb = $('#feedback');
    if (fb) fb.focus({ preventScroll: true });
    if (fb && fb.scrollIntoView) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function go(delta) {
    var next = ui.idx + delta;
    if (next < 0 || next > ui.deck.length) return;
    ui.idx = next;
    renderQuiz();
    var card = $('#question-card');
    if (card && card.scrollIntoView && window.scrollY > card.offsetTop) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function toggleFav(id) {
    var i = store.favorites.indexOf(id);
    if (i >= 0) store.favorites.splice(i, 1); else store.favorites.push(id);
    persist();
    toast(i >= 0 ? 'Removed from favorites' : 'Added to favorites');
  }

  function setFilters(patch) {
    Object.keys(patch).forEach(function (k) { store.settings[k] = patch[k]; });
    persist();
    buildDeck();
    renderFilters();
    renderQuiz();
  }

  /* Open quiz on a specific set of questions, starting at `startId`. */
  function practise(mode, startId) {
    store.settings.mode = mode;
    store.settings.topics = [];
    persist();
    buildDeck();
    if (startId) {
      var i = ui.deck.findIndex(function (d) { return d.id === startId; });
      if (i >= 0) ui.idx = i;
    }
    renderFilters();
    showView('quiz');
  }

  /* ------------------------------------------------------------ views */

  function showView(view) {
    if (VIEWS.indexOf(view) < 0) view = 'quiz';
    ui.view = view;
    VIEWS.forEach(function (v) {
      var sec = $('#view-' + v);
      sec.hidden = v !== view;
      var tab = $('.tab[data-view="' + v + '"]');
      tab.setAttribute('aria-current', v === view ? 'page' : 'false');
    });
    if (view === 'quiz') renderQuiz();
    if (view === 'dashboard') renderDashboard();
    if (view === 'favorites') renderFavorites();
    if (view === 'history') renderHistory();
    try { window.history.replaceState(null, '', '#' + view); } catch (e) { /* file:// etc. */ }
    window.scrollTo(0, 0);
  }

  function renderFilters() {
    var chips = $('#topic-chips');
    chips.textContent = '';
    var st = store.settings;
    chips.appendChild(h('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(st.topics.length === 0),
      onclick: function () { setFilters({ topics: [] }); }
    }, 'All topics'));
    TOPICS.forEach(function (t) {
      var on = st.topics.indexOf(t.id) >= 0;
      chips.appendChild(h('button', {
        type: 'button', class: 'chip topic-' + t.id, 'aria-pressed': String(on),
        onclick: function () {
          var next = st.topics.slice();
          var i = next.indexOf(t.id);
          if (i >= 0) next.splice(i, 1); else next.push(t.id);
          if (next.length === TOPICS.length) next = [];
          setFilters({ topics: next });
        }
      }, h('span', { class: 'dot', 'aria-hidden': 'true' }), t.label));
    });

    var seg = $('#mode-seg');
    seg.textContent = '';
    MODES.forEach(function (m) {
      seg.appendChild(h('button', {
        type: 'button', class: 'seg-btn', 'aria-pressed': String(st.mode === m.id),
        onclick: function () { setFilters({ mode: m.id }); }
      }, m.label));
    });

    $('#shuffle-toggle').checked = st.shuffle;
  }

  function renderQuiz() {
    var card = $('#question-card');
    card.textContent = '';
    renderSessionPanel();

    if (!ui.deck.length) {
      card.appendChild(h('div', { class: 'empty' },
        h('div', { class: 'empty-icon', 'aria-hidden': 'true' }, '∅'),
        h('h2', { text: 'No questions match these filters' }),
        h('p', { class: 'muted', text: store.settings.mode === 'favorites'
          ? 'Star questions with ☆ to build your favorites set.'
          : store.settings.mode === 'wrong'
            ? 'Nothing answered incorrectly in this selection — nice work.'
            : store.settings.mode === 'unanswered'
              ? 'You have answered every question in this selection.'
              : 'Try selecting different topics.' }),
        h('button', { type: 'button', class: 'btn primary', onclick: function () {
          setFilters({ topics: [], mode: 'all' });
        } }, 'Show all questions')
      ));
      return;
    }

    if (ui.idx >= ui.deck.length) { renderSummary(card); return; }

    var c = current();
    var q = c.q;
    var r = responseFor(q.id);
    var answeredCount = ui.deck.filter(function (d) {
      return ui.responses[d.id] && ui.responses[d.id].submitted;
    }).length;

    var fav = isFav(q.id);
    card.appendChild(h('header', { class: 'q-head' },
      h('div', { class: 'q-meta' },
        h('span', { class: 'badge topic-' + q.topic }, h('span', { class: 'dot', 'aria-hidden': 'true' }), topicLabel(q.topic)),
        h('span', { class: 'badge subtle diff-' + q.difficulty, text: q.difficulty }),
        h('span', { class: 'q-count', text: 'Question ' + (ui.idx + 1) + ' of ' + ui.deck.length })
      ),
      h('button', {
        type: 'button', class: 'icon-btn fav' + (fav ? ' on' : ''), id: 'fav-btn',
        'aria-pressed': String(fav), 'aria-label': fav ? 'Remove from favorites' : 'Add to favorites',
        title: 'Favorite (F)',
        onclick: function () { toggleFav(q.id); renderQuiz(); }
      }, fav ? '★' : '☆')
    ));

    card.appendChild(h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Deck progress',
      'aria-valuemin': '0', 'aria-valuemax': String(ui.deck.length), 'aria-valuenow': String(answeredCount) },
      h('span', { style: 'width:' + pct(answeredCount, ui.deck.length) + '%' })));

    card.appendChild(h('p', { class: 'stem', id: 'stem', text: q.stem }));

    var list = h('div', { class: 'options', role: 'group', 'aria-labelledby': 'stem' });
    c.item.order.forEach(function (orig, pos) {
      var cls = 'option';
      var state = '';
      if (r.submitted) {
        if (orig === q.answer) { cls += ' correct'; state = 'Correct answer'; }
        else if (orig === r.selected) { cls += ' incorrect'; state = 'Your answer'; }
        else cls += ' dim';
      } else if (orig === r.selected) cls += ' selected';
      list.appendChild(h('button', {
        type: 'button', class: cls, 'data-pos': String(pos),
        'aria-pressed': String(orig === r.selected),
        disabled: r.submitted,
        onclick: function () { selectOption(orig); }
      },
        h('span', { class: 'letter', text: LETTERS[pos] }),
        h('span', { class: 'opt-text', text: q.options[orig] }),
        state ? h('span', { class: 'opt-state', text: state }) : null
      ));
    });
    card.appendChild(list);

    if (r.submitted) {
      var correctPos = c.item.order.indexOf(q.answer);
      card.appendChild(h('section', { id: 'feedback', class: 'feedback ' + (r.correct ? 'ok' : 'bad'), tabindex: '-1', 'aria-live': 'polite' },
        h('div', { class: 'verdict' },
          h('span', { class: 'verdict-icon', 'aria-hidden': 'true', text: r.correct ? '✓' : '✗' }),
          h('span', { text: r.correct ? 'Correct' : 'Incorrect' }),
          h('span', { class: 'verdict-ans', text: 'Answer: ' + LETTERS[correctPos] + ' — ' + q.options[q.answer] })
        ),
        h('h3', { text: 'Explanation' }),
        h('p', { text: q.explanation }),
        h('div', { class: 'learning' },
          h('h3', { text: 'Learning point' }),
          h('p', { text: q.learningPoint })
        )
      ));
    }

    var last = ui.idx === ui.deck.length - 1;
    card.appendChild(h('div', { class: 'actions' },
      h('button', { type: 'button', class: 'btn ghost', id: 'prev-btn', disabled: ui.idx === 0,
        onclick: function () { go(-1); } }, '← Previous'),
      r.submitted
        ? h('button', { type: 'button', class: 'btn primary', id: 'next-btn', onclick: function () { go(1); } },
            last ? 'Finish' : 'Next →')
        : h('button', { type: 'button', class: 'btn primary', id: 'submit-btn', disabled: r.selected === null,
            onclick: submitAnswer }, 'Submit answer')
    ));
  }

  function renderSummary(card) {
    var answered = 0, correct = 0, wrongIds = [];
    ui.deck.forEach(function (d) {
      var r = ui.responses[d.id];
      if (r && r.submitted) {
        answered++;
        if (r.correct) correct++; else wrongIds.push(d.id);
      }
    });
    card.appendChild(h('div', { class: 'summary' },
      h('h2', { text: 'Set complete' }),
      h('div', { class: 'ring', style: '--p:' + pct(correct, answered) },
        h('span', { text: pct(correct, answered) + '%' })),
      h('p', { class: 'muted', text: correct + ' correct out of ' + answered + ' answered' +
        (answered < ui.deck.length ? ' (' + (ui.deck.length - answered) + ' skipped)' : '') }),
      h('div', { class: 'actions center' },
        h('button', { type: 'button', class: 'btn ghost', onclick: function () { go(-1); } }, '← Review'),
        wrongIds.length ? h('button', { type: 'button', class: 'btn', onclick: function () {
          setFilters({ mode: 'wrong' });
        } }, 'Retry incorrect') : null,
        h('button', { type: 'button', class: 'btn primary', onclick: function () {
          buildDeck(); renderQuiz();
        } }, 'New set')
      )
    ));
  }

  function renderSessionPanel() {
    var panel = $('#session-panel');
    if (!panel) return;
    panel.textContent = '';
    var s = ui.session;
    var answered = s ? s.answered : 0;
    var correct = s ? s.correct : 0;
    var overall = totals();
    panel.appendChild(h('h2', { class: 'panel-title', text: 'This session' }));
    panel.appendChild(h('div', { class: 'mini-stats' },
      stat('Score', correct + '/' + answered, 'session-score'),
      stat('Accuracy', answered ? pct(correct, answered) + '%' : '—'),
      stat('Streak', String(store.streak.current), 'streak-now'),
      stat('Best', String(store.streak.best))
    ));
    panel.appendChild(h('h2', { class: 'panel-title', text: 'Overall' }));
    panel.appendChild(h('div', { class: 'mini-stats' },
      stat('Seen', overall.seen + '/' + QUESTIONS.length),
      stat('Accuracy', overall.attempts ? pct(overall.correct, overall.attempts) + '%' : '—')
    ));
    panel.appendChild(h('p', { class: 'kbd-hint muted' },
      'Keys: ', h('kbd', null, '1–4'), ' select · ', h('kbd', null, 'Enter'), ' submit/next · ',
      h('kbd', null, '←'), h('kbd', null, '→'), ' move · ', h('kbd', null, 'F'), ' favorite'));
  }

  function stat(label, value, id) {
    return h('div', { class: 'stat' },
      h('span', { class: 'stat-value', id: id || null, text: value }),
      h('span', { class: 'stat-label', text: label }));
  }

  function totals() {
    var t = { seen: 0, attempts: 0, correct: 0, lastCorrect: 0 };
    QUESTIONS.forEach(function (q) {
      var a = store.attempts[q.id];
      if (!a) return;
      t.seen++; t.attempts += a.n; t.correct += a.correct;
      if (a.last) t.lastCorrect++;
    });
    return t;
  }

  function topicStats() {
    return TOPICS.map(function (t) {
      var qs = QUESTIONS.filter(function (q) { return q.topic === t.id; });
      var s = { id: t.id, label: t.label, total: qs.length, seen: 0, attempts: 0, correct: 0 };
      qs.forEach(function (q) {
        var a = store.attempts[q.id];
        if (!a) return;
        s.seen++; s.attempts += a.n; s.correct += a.correct;
      });
      return s;
    });
  }

  function renderDashboard() {
    var root = $('#dashboard-body');
    root.textContent = '';
    var t = totals();

    root.appendChild(h('div', { class: 'tiles' },
      tile('Questions seen', t.seen + ' / ' + QUESTIONS.length, pct(t.seen, QUESTIONS.length) + '% coverage'),
      tile('Overall accuracy', t.attempts ? pct(t.correct, t.attempts) + '%' : '—', t.correct + ' of ' + t.attempts + ' attempts'),
      tile('Current streak', String(store.streak.current), 'Best: ' + store.streak.best),
      tile('Sessions', String(store.sessions.length), store.favorites.length + ' favorite' + (store.favorites.length === 1 ? '' : 's'))
    ));

    var ts = topicStats();
    var bars = h('div', { class: 'bars' });
    ts.forEach(function (s) {
      var acc = pct(s.correct, s.attempts);
      bars.appendChild(h('div', { class: 'bar-row' },
        h('span', { class: 'bar-label' }, h('span', { class: 'dot topic-' + s.id, 'aria-hidden': 'true' }), s.label),
        h('span', { class: 'bar-track', role: 'img',
          'aria-label': s.label + ': ' + (s.attempts ? acc + '% accuracy' : 'not attempted') },
          h('span', { class: 'bar-fill topic-' + s.id, style: 'width:' + (s.attempts ? Math.max(acc, 2) : 0) + '%' })),
        h('span', { class: 'bar-value', text: s.attempts ? acc + '%' : '—' }),
        h('span', { class: 'bar-sub muted', text: s.seen + '/' + s.total + ' seen' })
      ));
    });

    var attempted = ts.filter(function (s) { return s.attempts > 0; });
    var weakest = attempted.slice().sort(function (a, b) {
      return (a.correct / a.attempts) - (b.correct / b.attempts);
    })[0];
    var untouched = ts.filter(function (s) { return s.seen === 0; });

    var insight;
    if (!attempted.length) insight = 'Answer a few questions to see topic-level performance.';
    else if (untouched.length) insight = 'Not yet attempted: ' + untouched.map(function (s) { return s.label; }).join(', ') + '.';
    else insight = 'Focus area: ' + weakest.label + ' (' + pct(weakest.correct, weakest.attempts) + '% accuracy).';

    root.appendChild(h('section', { class: 'card' },
      h('div', { class: 'card-head' },
        h('h2', { text: 'Accuracy by topic' }),
        weakest && pct(weakest.correct, weakest.attempts) < 100
          ? h('button', { type: 'button', class: 'btn small', onclick: function () {
              store.settings.topics = [weakest.id]; store.settings.mode = 'all';
              persist(); buildDeck(); renderFilters(); showView('quiz');
            } }, 'Practise ' + weakest.label)
          : null),
      bars,
      h('p', { class: 'insight', text: insight })
    ));

    root.appendChild(h('section', { class: 'card' },
      h('h2', { text: 'Your data' }),
      h('p', { class: 'muted', text: Store.isAvailable()
        ? 'Progress is stored only in this browser on this device. Export a backup to move it to another device.'
        : 'Browser storage is unavailable, so progress will be lost when you close this page.' }),
      h('div', { class: 'actions wrap' },
        h('button', { type: 'button', class: 'btn', id: 'export-btn', onclick: exportData }, 'Export progress'),
        h('label', { class: 'btn', for: 'import-file' }, 'Import progress'),
        h('button', { type: 'button', class: 'btn danger', id: 'reset-btn', onclick: resetData }, 'Reset all progress')
      )
    ));
  }

  function tile(label, value, sub) {
    return h('div', { class: 'tile' },
      h('span', { class: 'tile-label', text: label }),
      h('span', { class: 'tile-value', text: value }),
      h('span', { class: 'tile-sub muted', text: sub }));
  }

  function renderFavorites() {
    var root = $('#favorites-body');
    root.textContent = '';
    var favs = store.favorites.filter(function (id) { return byId[id]; });
    if (!favs.length) {
      root.appendChild(h('div', { class: 'card empty' },
        h('div', { class: 'empty-icon', 'aria-hidden': 'true' }, '☆'),
        h('h2', { text: 'No favorites yet' }),
        h('p', { class: 'muted', text: 'Tap the star on any question to save it here for revision.' })));
      return;
    }
    root.appendChild(h('div', { class: 'card-head' },
      h('p', { class: 'muted', text: favs.length + ' saved question' + (favs.length === 1 ? '' : 's') }),
      h('button', { type: 'button', class: 'btn primary small', onclick: function () { practise('favorites'); } },
        'Practise favorites')));
    var list = h('ul', { class: 'q-list' });
    favs.forEach(function (id) {
      var q = byId[id];
      var a = store.attempts[id];
      list.appendChild(h('li', { class: 'q-item' },
        h('div', { class: 'q-item-main' },
          h('div', { class: 'q-meta' },
            h('span', { class: 'badge topic-' + q.topic }, h('span', { class: 'dot', 'aria-hidden': 'true' }), topicLabel(q.topic)),
            a ? h('span', { class: 'badge subtle ' + (a.last ? 'ok' : 'bad'), text: a.last ? 'Last: correct' : 'Last: incorrect' })
              : h('span', { class: 'badge subtle', text: 'Not attempted' })),
          h('p', { class: 'q-item-stem', text: q.stem })),
        h('div', { class: 'q-item-actions' },
          h('button', { type: 'button', class: 'btn small', onclick: function () { practise('favorites', id); } }, 'Open'),
          h('button', { type: 'button', class: 'btn small ghost', 'aria-label': 'Remove from favorites',
            onclick: function () { toggleFav(id); renderFavorites(); } }, 'Remove'))
      ));
    });
    root.appendChild(list);
  }

  function renderHistory() {
    var root = $('#history-body');
    root.textContent = '';
    var sessions = store.sessions.filter(function (s) { return s.answered > 0; }).slice().reverse();

    if (!sessions.length && !store.log.length) {
      root.appendChild(h('div', { class: 'card empty' },
        h('div', { class: 'empty-icon', 'aria-hidden': 'true' }, '⏱'),
        h('h2', { text: 'No history yet' }),
        h('p', { class: 'muted', text: 'Your sessions and answers will appear here.' })));
      return;
    }

    var table = h('table', { class: 'table' },
      h('thead', null, h('tr', null,
        h('th', { scope: 'col', text: 'Date' }),
        h('th', { scope: 'col', text: 'Topics' }),
        h('th', { scope: 'col', text: 'Mode' }),
        h('th', { scope: 'col', class: 'num', text: 'Score' }))));
    var tbody = h('tbody');
    sessions.forEach(function (s) {
      var p = pct(s.correct, s.answered);
      tbody.appendChild(h('tr', null,
        h('td', { 'data-label': 'Date', text: fmtDate(s.start) }),
        h('td', { 'data-label': 'Topics', text: s.topics.length ? s.topics.map(topicLabel).join(', ') : 'All' }),
        h('td', { 'data-label': 'Mode', text: modeLabel(s.mode) }),
        h('td', { 'data-label': 'Score', class: 'num' },
          h('span', { class: 'score-pill ' + (p >= 70 ? 'ok' : p >= 50 ? 'warn' : 'bad'),
            text: s.correct + '/' + s.answered + ' · ' + p + '%' }))));
    });
    table.appendChild(tbody);
    root.appendChild(h('section', { class: 'card' }, h('h2', { text: 'Sessions' }),
      h('div', { class: 'table-wrap' }, table)));

    var recent = store.log.slice(-30).reverse();
    var list = h('ul', { class: 'log' });
    recent.forEach(function (e) {
      var q = byId[e.id];
      if (!q) return;
      list.appendChild(h('li', { class: 'log-item' },
        h('span', { class: 'log-mark ' + (e.correct ? 'ok' : 'bad'), 'aria-label': e.correct ? 'Correct' : 'Incorrect',
          text: e.correct ? '✓' : '✗' }),
        h('span', { class: 'log-text' },
          h('span', { class: 'log-stem', text: q.stem }),
          h('span', { class: 'log-meta muted', text: topicLabel(q.topic) + ' · ' + fmtDate(e.ts) }))));
    });
    root.appendChild(h('section', { class: 'card' }, h('h2', { text: 'Recent answers' }), list));
  }

  /* ----------------------------------------------------- data controls */

  function exportData() {
    var blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: 'radiology-mcq-progress-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Progress exported');
  }

  function importData(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== 'object' || !parsed.attempts) throw new Error('bad');
        if (!window.confirm('Replace your current progress with the imported file?')) return;
        store = Store.sanitize(parsed);
        store.settings.topics = store.settings.topics.filter(function (t) { return topicIds.indexOf(t) >= 0; });
        persist();
        buildDeck();
        renderFilters();
        showView(ui.view);
        toast('Progress imported');
      } catch (e) {
        toast('That file is not a valid progress export.');
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!window.confirm('Reset all progress, favorites and history? This cannot be undone.')) return;
    Store.clear();
    store = Store.defaults();
    persist();
    buildDeck();
    renderFilters();
    showView(ui.view);
    toast('Progress reset');
  }

  /* --------------------------------------------------------- keyboard */

  function onKey(e) {
    if (ui.view !== 'quiz' || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    var c = current();
    var key = e.key.toLowerCase();
    var pos = ['1', '2', '3', '4'].indexOf(key);
    if (pos < 0) pos = ['a', 'b', 'c', 'd'].indexOf(key);
    if (c && pos >= 0) { selectOption(c.item.order[pos]); e.preventDefault(); return; }
    if (key === 'enter') {
      // Let Enter activate a focused button natively (avoids double actions).
      if (tag === 'BUTTON' || tag === 'A' || tag === 'LABEL') return;
      if (!c) return;
      var r = responseFor(c.q.id);
      if (r.submitted) go(1); else submitAnswer();
      e.preventDefault();
    } else if (key === 'arrowright') { go(1); }
    else if (key === 'arrowleft') { go(-1); }
    else if (key === 'f' && c) { toggleFav(c.q.id); renderQuiz(); }
  }

  /* ------------------------------------------------------------- init */

  function init() {
    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () { showView(tab.getAttribute('data-view')); });
    });
    $('#shuffle-toggle').addEventListener('change', function (e) { setFilters({ shuffle: e.target.checked }); });
    $('#import-file').addEventListener('change', function (e) {
      importData(e.target.files && e.target.files[0]);
      e.target.value = '';
    });
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', function () {
      var v = (window.location.hash || '').replace('#', '');
      if (VIEWS.indexOf(v) >= 0 && v !== ui.view) showView(v);
    });

    if (!Store.isAvailable()) $('#storage-warning').hidden = false;
    $('#q-total').textContent = String(QUESTIONS.length);

    buildDeck();
    renderFilters();
    var start = (window.location.hash || '').replace('#', '');
    showView(VIEWS.indexOf(start) >= 0 ? start : 'quiz');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
