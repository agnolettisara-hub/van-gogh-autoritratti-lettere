// Legge un file XML/TEI e lo trasforma in HTML leggibile.
// Uso: <div class="tei-viewer" data-tei-src="../data/nomefile-tei.xml"></div>
// I tag <persName ref="..."> e <placeName ref="..."> diventano link cliccabili
// ai record di autorità (Wikidata/Geonames), mostrando visivamente l'arricchimento.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function teiRefLink(cls, inner, ref) {
  if (ref) {
    return '<a class="' + cls + '" href="' + ref + '" target="_blank" rel="noopener" title="Vedi record di autorità">' + inner + '</a>';
  }
  return '<span class="' + cls + '">' + inner + '</span>';
}

// Converte ricorsivamente i nodi XML in HTML
function teiWalk(node) {
  let html = '';
  node.childNodes.forEach(function (child) {
    if (child.nodeType === 3) {
      // nodo di testo
      html += escapeHtml(child.nodeValue);
    } else if (child.nodeType === 1) {
      // nodo elemento
      const tag = child.localName;
      const ref = child.getAttribute('ref');

      if (tag === 'p') {
        html += '<p>' + teiWalk(child) + '</p>';
      } else if (tag === 'head') {
        html += '<h3 class="tei-head">' + teiWalk(child) + '</h3>';
      } else if (tag === 'list') {
        html += '<ol class="tei-list">' + teiWalk(child) + '</ol>';
      } else if (tag === 'item') {
        html += '<li>' + teiWalk(child) + '</li>';
      } else if (tag === 'persName') {
        html += teiRefLink('tei-persname', teiWalk(child), ref);
      } else if (tag === 'placeName') {
        html += teiRefLink('tei-placename', teiWalk(child), ref);
      } else if (tag === 'signed') {
        html += '<p class="tei-signature">— ' + teiWalk(child) + '</p>';
      } else if (tag === 'div') {
        const type = child.getAttribute('type') || '';
        html += '<div class="tei-div tei-' + type + '">' + teiWalk(child) + '</div>';
      } else {
        // tag non riconosciuto (es. closer): scendo comunque nei figli
        html += teiWalk(child);
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

    container.innerHTML = '<div class="tei-rendered">' + teiWalk(bodyEl) + '</div>';
  } catch (err) {
    container.innerHTML =
      '<p class="meta">Impossibile caricare il testo integrale qui (funziona una volta pubblicato online / su un server locale — non aprendo il file .html direttamente da disco). ' +
      'Nel frattempo puoi consultare il <a href="' + src + '" target="_blank">file XML</a> direttamente.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tei-viewer').forEach(renderTeiViewer);
});
