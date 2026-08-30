# Autoritratti — Vincent van Gogh (1886–1889)

## Struttura

```
index.html            home, struttura del sito
catalogo.html          8 autoritratti con filtro per luogo
mappa.html             mappa Leaflet (Parigi/Arles/Saint-Rémy)
timeline.html           cronologia Google Charts
item/self-portrait-orsay.html   esempio completo — usa come modello per gli altri 7
dati.html               tabella con riconciliazione Wikidata/VIAF/Getty ULAN
progetto.html            nota critica/metodologica
data/*.xml               esempi XML Dublin Core e TEI
css/style.css            identità visiva (tavolozza Van Gogh)
js/main.js                filtro catalogo
js/tei-render.js          legge i file TEI e li mostra come HTML (richiede server locale o GitHub Pages)
```

## Cose da completare

1. **Immagini**: scarica gli autoritratti da Wikimedia Commons (categoria "Self-portraits by Vincent van Gogh", tutti PD) o dai siti dei musei, salvale in `assets/img/` con i nomi già indicati nel codice.

2. **Le altre 7 pagine item**: copia `item/self-portrait-orsay.html` e adattala. Numeri di catalogo F/JH mancanti: verificali sul sito del Van Gogh Museum (vangoghmuseum.nl) prima della consegna.

3. **Lettere**: per ogni autoritratto, cerca su vangoghletters.org una lettera vicina per data. **Attenzione ai diritti**: le traduzioni inglesi sul sito (2009) possono essere protette; usa citazioni brevi o traduci tu stesso dal testo originale francese/olandese (disponibile sulla stessa pagina di ogni lettera).

4. **Mappa**: se vuoi aggiungere marker più specifici (es. l'indirizzo esatto dell'atelier a Parigi, il manicomio di Saint-Paul-de-Mausole a Saint-Rémy) invece dei soli centri città, cerca le coordinate su Google Maps e aggiorna l'array `luoghi` in `mappa.html`.

5. **Numeri di catalogo mancanti**: la tabella dati ha alcune celle "[da verificare]" — completale con i cataloghi F (de la Faille) e JH (Hulsker) dal sito del Van Gogh Museum.

## Pubblicazione su GitHub Pages

1. Crea un repository pubblico su github.com
2. Upload files → trascina tutto il contenuto di questa cartella
3. Settings → Pages → Source: branch `main`, cartella `/root` → Save
4. Il sito sarà live su `https://tuonome.github.io/nome-repository/`

Nota: la sezione "testo integrale" nelle pagine item legge i file XML via JavaScript — funziona su GitHub Pages ma non aprendo i file .html direttamente da disco (serve un server, vedi conversazione per istruzioni su come testarlo in locale).
