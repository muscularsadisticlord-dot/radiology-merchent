/*
 * Radiology MCQ Trainer — persistence layer
 * All progress lives in this browser's localStorage under one key.
 * Every access is wrapped so the app keeps working when storage is
 * unavailable (e.g. Safari private browsing or blocked site data).
 */
(function () {
  'use strict';

  var KEY = 'radmcq.progress.v1';
  var VERSION = 1;
  var MAX_SESSIONS = 100;
  var MAX_LOG = 300;
  var MODES = ['all', 'unanswered', 'wrong', 'favorites'];

  function testStorage() {
    try {
      var k = '__radmcq_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  var available = testStorage();

  function defaults() {
    return {
      version: VERSION,
      attempts: {},      // qid -> { n, correct, last, ts }
      favorites: [],     // [qid]
      sessions: [],      // [{ id, start, end, topics, mode, answered, correct }]
      log: [],           // [{ id, correct, ts }] newest last
      streak: { current: 0, best: 0 },
      settings: { topics: [], mode: 'all', shuffle: true }
    };
  }

  function num(v, fallback) {
    return typeof v === 'number' && isFinite(v) && v >= 0 ? v : fallback;
  }

  function strArray(v) {
    return Array.isArray(v) ? v.filter(function (x) { return typeof x === 'string'; }) : [];
  }

  /* Coerce anything (old versions, hand-edited or imported JSON) into a valid shape. */
  function sanitize(raw) {
    var d = defaults();
    if (!raw || typeof raw !== 'object') return d;

    if (raw.attempts && typeof raw.attempts === 'object') {
      Object.keys(raw.attempts).forEach(function (id) {
        var a = raw.attempts[id];
        if (!a || typeof a !== 'object') return;
        var n = Math.floor(num(a.n, 0));
        if (n < 1) return;
        d.attempts[id] = {
          n: n,
          correct: Math.min(n, Math.floor(num(a.correct, 0))),
          last: a.last === true,
          ts: num(a.ts, 0)
        };
      });
    }

    d.favorites = strArray(raw.favorites).filter(function (id, i, arr) { return arr.indexOf(id) === i; });

    if (Array.isArray(raw.sessions)) {
      d.sessions = raw.sessions.filter(function (s) { return s && typeof s === 'object'; }).map(function (s) {
        var answered = Math.floor(num(s.answered, 0));
        return {
          id: num(s.id, 0),
          start: num(s.start, 0),
          end: num(s.end, 0),
          topics: strArray(s.topics),
          mode: MODES.indexOf(s.mode) >= 0 ? s.mode : 'all',
          answered: answered,
          correct: Math.min(answered, Math.floor(num(s.correct, 0)))
        };
      }).slice(-MAX_SESSIONS);
    }

    if (Array.isArray(raw.log)) {
      d.log = raw.log.filter(function (e) {
        return e && typeof e.id === 'string';
      }).map(function (e) {
        return { id: e.id, correct: e.correct === true, ts: num(e.ts, 0) };
      }).slice(-MAX_LOG);
    }

    if (raw.streak && typeof raw.streak === 'object') {
      d.streak.current = Math.floor(num(raw.streak.current, 0));
      d.streak.best = Math.max(d.streak.current, Math.floor(num(raw.streak.best, 0)));
    }

    if (raw.settings && typeof raw.settings === 'object') {
      d.settings.topics = strArray(raw.settings.topics);
      d.settings.mode = MODES.indexOf(raw.settings.mode) >= 0 ? raw.settings.mode : 'all';
      d.settings.shuffle = raw.settings.shuffle !== false;
    }
    return d;
  }

  function load() {
    if (!available) return defaults();
    try {
      var text = window.localStorage.getItem(KEY);
      return text ? sanitize(JSON.parse(text)) : defaults();
    } catch (e) {
      return defaults();
    }
  }

  function save(data) {
    if (!available) return false;
    try {
      data.sessions = data.sessions.slice(-MAX_SESSIONS);
      data.log = data.log.slice(-MAX_LOG);
      window.localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clear() {
    if (!available) return;
    try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  window.RadStore = {
    KEY: KEY,
    load: load,
    save: save,
    clear: clear,
    defaults: defaults,
    sanitize: sanitize,
    isAvailable: function () { return available; }
  };
})();
