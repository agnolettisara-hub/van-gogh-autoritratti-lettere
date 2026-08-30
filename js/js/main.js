// Filtro catalogo combinato: luogo (Parigi/Arles/Saint-Rémy) + anno (1886-1889)
// Un item viene mostrato solo se soddisfa ENTRAMBI i filtri attivi.
// Cliccando un pulsante già attivo, quel filtro si spegne (torna a "tutti").
// Il pulsante "Tutti" azzera entrambi i filtri insieme.
document.addEventListener('DOMContentLoaded', function () {
  const bottoneReset = document.getElementById('filtro-reset');
  const bottoniLuogo = document.querySelectorAll('.filtro-btn');
  const bottoniAnno = document.querySelectorAll('.filtro-anno-btn');
  const items = document.querySelectorAll('.item-card');

  let filtroLuogoAttivo = 'tutti';
  let filtroAnnoAttivo = 'tutti';

  function applicaFiltri() {
    items.forEach(function (item) {
      const luogoOk = (filtroLuogoAttivo === 'tutti' || item.dataset.luogo === filtroLuogoAttivo);
      const anni = (item.dataset.anno || '').split(' ');
      const annoOk = (filtroAnnoAttivo === 'tutti' || anni.includes(filtroAnnoAttivo));
      item.style.display = (luogoOk && annoOk) ? '' : 'none';
    });
  }

  function aggiornaStatoReset() {
    const tuttoAzzerato = (filtroLuogoAttivo === 'tutti' && filtroAnnoAttivo === 'tutti');
    bottoneReset.classList.toggle('active', tuttoAzzerato);
  }

  bottoneReset.addEventListener('click', function () {
    filtroLuogoAttivo = 'tutti';
    filtroAnnoAttivo = 'tutti';
    bottoniLuogo.forEach(b => b.classList.remove('active'));
    bottoniAnno.forEach(b => b.classList.remove('active'));
    bottoneReset.classList.add('active');
    applicaFiltri();
  });

  bottoniLuogo.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const giaAttivo = btn.classList.contains('active');
      bottoniLuogo.forEach(b => b.classList.remove('active'));

      if (giaAttivo) {
        filtroLuogoAttivo = 'tutti';
      } else {
        btn.classList.add('active');
        filtroLuogoAttivo = btn.dataset.filtro;
      }

      aggiornaStatoReset();
      applicaFiltri();
    });
  });

  bottoniAnno.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const giaAttivo = btn.classList.contains('active');
      bottoniAnno.forEach(b => b.classList.remove('active'));

      if (giaAttivo) {
        filtroAnnoAttivo = 'tutti';
      } else {
        btn.classList.add('active');
        filtroAnnoAttivo = btn.dataset.anno;
      }

      aggiornaStatoReset();
      applicaFiltri();
    });
  });
});