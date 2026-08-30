// Legge un file XML/TEI e lo trasforma in HTML leggibile.
// Uso: <div class="tei-viewer" data-tei-src="../data/nomefile-tei.xml"></div>
// I tag <persName ref="#id"> e <placeName ref="#id"> vengono risolti cercando
// l'elemento con quello xml:id nell'header (particDesc/settingDesc) e usando
// il suo attributo sameAs come URL del link.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function teiRefLink(cls, inner, href) {
  if (href) {
    return '<a class="' + cls + '" href="' + href + '" target="_blank" rel="noopener" title="Vedi record di autorità">' + inner + '</a>';
  }
  return '<span class="' + cls + '">' + inner + '</span>';
}

// Costruisce una mappa xml:id -> sameAs leggendo <person> e <place> nell'header
function buildIdMap(xmlDoc) {
  const map = {};
  ['person', 'place'].forEach(function (tagName) {
    const els = xmlDoc.getElementsByTagName(tagName);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const id = el.getAttribute('xml:id') ||
                 el.getAttributeNS('http://www.w3.org/XML/1998/namespace', 'id');
      const sameAs = el.getAttribute('sameAs');
      if (id && sameAs) map[id] = sameAs;
    }
  });
  return map;
}

// Converte ricorsivamente i nodi XML in HTML
function teiWalk(node, idMap) {
  let html = '';
  node.childNodes.forEach(function (child) {
    if (child.nodeType === 3) {
      html += escapeHtml(child.nodeValue);
    } else if (child.nodeType === 1) {
      const tag = child.localName;
      const ref = child.getAttribute('ref');

      if (tag === 'p') {
        html += '<p>' + teiWalk(child, idMap) + '</p>';
      } else if (tag === 'head') {
        html += '<h3 class="tei-head">' + teiWalk(child, idMap) + '</h3>';
      } else if (tag === 'list') {
        html += '<ol class="tei-list">' + teiWalk(child, idMap) + '</ol>';
      } else if (tag === 'item') {
        html += '<li>' + teiWalk(child, idMap) + '</li>';
      } else if (tag === 'persName' || tag === 'placeName') {
        let href = null;
        if (ref) {
          if (ref.charAt(0) === '#') {
            href = idMap[ref.slice(1)] || null;
          } else {
            href = ref;
          }
        }
        const cls = tag === 'persName' ? 'tei-persname' : 'tei-placename';
        html += teiRefLink(cls, teiWalk(child, idMap), href);
      } else if (tag === 'signed') {
        html += '<p class="tei-signature">— ' + teiWalk(child, idMap) + '</p>';
      } else if (tag === 'div') {
        const type = child.getAttribute('type') || '';
        html += '<div class="tei-div tei-' + type + '">' + teiWalk(child, idMap) + '</div>';
      } else {
        html += teiWalk(child, idMap);
      }
    }
  });
  return html;
}

async function renderTeiViewer(container) {
  const src = container.dataset.teiSrc;
  if (!src) return;

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, 'application/xml');

    if (xml.querySelector('parsererror')) {
      container.innerHTML = '<p class="meta">Il file XML contiene un errore di sintassi.</p>';
      return;
    }

    const bodyEl = xml.getElementsByTagName('body')[0];
    if (!bodyEl) {
      container.innerHTML = '<p class="meta">Struttura TEI non riconosciuta (manca &lt;body&gt;).</p>';
      return;
    }

    const idMap = buildIdMap(xml);
    container.innerHTML = '<div class="tei-rendered">' + teiWalk(bodyEl, idMap) + '</div>';
  } catch (err) {
    container.innerHTML =
      '<p class="meta">Impossibile caricare il testo integrale qui (funziona una volta pubblicato online / su un server locale — non aprendo il file .html direttamente da disco). ' +
      'Nel frattempo puoi consultare il <a href="' + src + '" target="_blank">file XML</a> direttamente.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tei-viewer').forEach(renderTeiViewer);
});