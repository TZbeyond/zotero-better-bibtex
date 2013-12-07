{
	"translatorID": "0a3d926d-467c-4162-acb6-45bded77edbb",
	"label": "Citation Keys",
	"creator": "Emiliano heyns",
	"target": "bib",
	"minVersion": "2.1.9",
	"maxVersion": "",
	"priority": 100,
  "displayOptions": {},
  "configOptions": {
    "getCollections": true,
    "citeCommand": "cite",
    "citeKeyFormat": "[auth][year]"
  },
	"inRepository": false,
	"translatorType": 2,
	"browserSupport": "gcsv",
	"lastUpdated": "2013-12-07 23:01:58"
}


function safeGetOption(option)
{
  try {
    return Zotero.getOption(option);
  } catch (err) {
    Zotero.debug('Error fetching option ' + option + ': ' + err);
    return;
  }
}

var config = {
  citeCommand:      safeGetOption('citeCommand'),
  citeKeyFormat:    safeGetOption('citeKeyFormat'),
  exportCharset:    safeGetOption('exportCharset'),
  translator: {
    id: '0a3d926d-467c-4162-acb6-45bded77edbb',
    label:  'Citation Keys'
  }
};

function trLog(msg) { Zotero.debug('[better bibtex] ' + msg); }

trLog('config = ' + JSON.stringify(config));

function detectImport() {
  var maxChars = 1048576; // 1MB
  
  var inComment = false;
  var block = "";
  var buffer = "";
  var chr = "";
  var charsRead = 0;
  
  var re = /^\s*@[a-zA-Z]+[\(\{]/;
  while((buffer = Zotero.read(4096)) && charsRead < maxChars) {
    trLog("Scanning " + buffer.length + " characters for BibTeX");
    charsRead += buffer.length;
    for (var i=0; i<buffer.length; i++) {
      chr = buffer[i];
      
      if (inComment && chr != "\r" && chr != "\n") {
        continue;
      }
      inComment = false;
      
      if(chr == "%") {
        // read until next newline
        block = "";
        inComment = true;
      } else if((chr == "\n" || chr == "\r"
        // allow one-line entries
            || i == (buffer.length - 1))
            && block) {
        // check if this is a BibTeX entry
        if(re.test(block)) {
          return true;
        }
        
        block = "";
      } else if(" \n\r\t".indexOf(chr) == -1) {
        block += chr;
      }
    }
  }
}

var inputFieldMap = {
  booktitle :"publicationTitle",
  school:"publisher",
  institution:"publisher",
  publisher:"publisher",
  issue:"issue",
  location:"place"
};

if (!zotero2tex) { var zotero2tex = {}; }
var tex2zotero = {};
for (zotero in zotero2tex) {
  if (!(zotero2tex[zotero] instanceof Array)) { zotero2tex[zotero] = [zotero2tex[zotero]]; }

  zotero2tex[zotero] = zotero2tex[zotero].map(function(tex){
    if (!tex2zotero[tex] || tex.match(/^:/)) {
      tex2zotero[tex.replace(/^:/, '')] = zotero;
    }
    return tex.replace(/^:/, '');
  });

  zotero2tex[zotero] = zotero2tex[zotero][0];
}

/*
 * three-letter month abbreviations. i assume these are the same ones that the
 * docs say are defined in some appendix of the LaTeX book. (i don't have the
 * LaTeX book.)
 */
var months = ["jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"];

var jabref = {
  format: null,
  root: {}
};


    var convert = {
      unicode2latex: {
  "#": {
    "latex": "\\#",
    "force": true
  },
  "$": {
    "latex": "\\$",
    "force": true
  },
  "%": {
    "latex": "\\%",
    "force": true
  },
  "&": {
    "latex": "\\&",
    "force": true
  },
  "*": {
    "latex": "\\ast",
    "math": true,
    "force": true
  },
  "\\": {
    "latex": "\\textbackslash",
    "force": true
  },
  "^": {
    "latex": "\\^{}",
    "force": true
  },
  "_": {
    "latex": "\\_",
    "math": true,
    "force": true
  },
  "{": {
    "latex": "\\lbrace",
    "math": true,
    "force": true
  },
  "|": {
    "latex": "\\vert",
    "math": true,
    "force": true
  },
  "}": {
    "latex": "\\rbrace",
    "math": true,
    "force": true
  },
  "~": {
    "latex": "\\textasciitilde",
    "force": true
  },
  " ": {
    "latex": " "
  },
  "¡": {
    "latex": "\\textexclamdown"
  },
  "¢": {
    "latex": "\\textcent"
  },
  "£": {
    "latex": "\\textsterling"
  },
  "¤": {
    "latex": "\\textcurrency"
  },
  "¥": {
    "latex": "\\textyen"
  },
  "¦": {
    "latex": "\\textbrokenbar"
  },
  "§": {
    "latex": "\\textsection"
  },
  "¨": {
    "latex": "\\textasciidieresis"
  },
  "©": {
    "latex": "\\textcopyright"
  },
  "ª": {
    "latex": "\\textordfeminine"
  },
  "«": {
    "latex": "\\guillemotleft"
  },
  "¬": {
    "latex": "\\lnot",
    "math": true
  },
  "­": {
    "latex": "\\-",
    "math": true
  },
  "®": {
    "latex": "\\textregistered"
  },
  "¯": {
    "latex": "\\textasciimacron"
  },
  "°": {
    "latex": "\\textdegree"
  },
  "±": {
    "latex": "\\pm",
    "math": true
  },
  "²": {
    "latex": "{^2}",
    "math": true
  },
  "³": {
    "latex": "{^3}",
    "math": true
  },
  "´": {
    "latex": "\\textasciiacute"
  },
  "µ": {
    "latex": "\\mathrm{\\mu}",
    "math": true
  },
  "¶": {
    "latex": "\\textparagraph"
  },
  "·": {
    "latex": "\\cdot",
    "math": true
  },
  "¸": {
    "latex": "\\c{}"
  },
  "¹": {
    "latex": "{^1}",
    "math": true
  },
  "º": {
    "latex": "\\textordmasculine"
  },
  "»": {
    "latex": "\\guillemotright"
  },
  "¼": {
    "latex": "\\textonequarter"
  },
  "½": {
    "latex": "\\textonehalf"
  },
  "¾": {
    "latex": "\\textthreequarters"
  },
  "¿": {
    "latex": "\\textquestiondown"
  },
  "À": {
    "latex": "\\`{A}"
  },
  "Á": {
    "latex": "\\'{A}"
  },
  "Â": {
    "latex": "\\^{A}"
  },
  "Ã": {
    "latex": "\\~{A}"
  },
  "Ä": {
    "latex": "\\\"{A}"
  },
  "Å": {
    "latex": "\\AA"
  },
  "Æ": {
    "latex": "\\AE"
  },
  "Ç": {
    "latex": "\\c{C}"
  },
  "È": {
    "latex": "\\`{E}"
  },
  "É": {
    "latex": "\\'{E}"
  },
  "Ê": {
    "latex": "\\^{E}"
  },
  "Ë": {
    "latex": "\\\"{E}"
  },
  "Ì": {
    "latex": "\\`{I}"
  },
  "Í": {
    "latex": "\\'{I}"
  },
  "Î": {
    "latex": "\\^{I}"
  },
  "Ï": {
    "latex": "\\\"{I}"
  },
  "Ð": {
    "latex": "\\DH"
  },
  "Ñ": {
    "latex": "\\~{N}"
  },
  "Ò": {
    "latex": "\\`{O}"
  },
  "Ó": {
    "latex": "\\'{O}"
  },
  "Ô": {
    "latex": "\\^{O}"
  },
  "Õ": {
    "latex": "\\~{O}"
  },
  "Ö": {
    "latex": "\\\"{O}"
  },
  "×": {
    "latex": "\\texttimes"
  },
  "Ø": {
    "latex": "\\O"
  },
  "Ù": {
    "latex": "\\`{U}"
  },
  "Ú": {
    "latex": "\\'{U}"
  },
  "Û": {
    "latex": "\\^{U}"
  },
  "Ü": {
    "latex": "\\\"{U}"
  },
  "Ý": {
    "latex": "\\'{Y}"
  },
  "Þ": {
    "latex": "\\TH"
  },
  "ß": {
    "latex": "\\ss"
  },
  "à": {
    "latex": "\\`{a}"
  },
  "á": {
    "latex": "\\'{a}"
  },
  "â": {
    "latex": "\\^{a}"
  },
  "ã": {
    "latex": "\\~{a}"
  },
  "ä": {
    "latex": "\\\"{a}"
  },
  "å": {
    "latex": "\\aa"
  },
  "æ": {
    "latex": "\\ae"
  },
  "ç": {
    "latex": "\\c{c}"
  },
  "è": {
    "latex": "\\`{e}"
  },
  "é": {
    "latex": "\\'{e}"
  },
  "ê": {
    "latex": "\\^{e}"
  },
  "ë": {
    "latex": "\\\"{e}"
  },
  "ì": {
    "latex": "\\`{\\i}"
  },
  "í": {
    "latex": "\\'{\\i}"
  },
  "î": {
    "latex": "\\^{\\i}"
  },
  "ï": {
    "latex": "\\\"{\\i}"
  },
  "ð": {
    "latex": "\\dh"
  },
  "ñ": {
    "latex": "\\~{n}"
  },
  "ò": {
    "latex": "\\`{o}"
  },
  "ó": {
    "latex": "\\'{o}"
  },
  "ô": {
    "latex": "\\^{o}"
  },
  "õ": {
    "latex": "\\~{o}"
  },
  "ö": {
    "latex": "\\\"{o}"
  },
  "÷": {
    "latex": "\\div",
    "math": true
  },
  "ø": {
    "latex": "\\o"
  },
  "ù": {
    "latex": "\\`{u}"
  },
  "ú": {
    "latex": "\\'{u}"
  },
  "û": {
    "latex": "\\^{u}"
  },
  "ü": {
    "latex": "\\\"{u}"
  },
  "ý": {
    "latex": "\\'{y}"
  },
  "þ": {
    "latex": "\\th"
  },
  "ÿ": {
    "latex": "\\\"{y}"
  },
  "Ā": {
    "latex": "\\={A}"
  },
  "ā": {
    "latex": "\\={a}"
  },
  "Ă": {
    "latex": "\\u{A}"
  },
  "ă": {
    "latex": "\\u{a}"
  },
  "Ą": {
    "latex": "\\k{A}"
  },
  "ą": {
    "latex": "\\k{a}"
  },
  "Ć": {
    "latex": "\\'{C}"
  },
  "ć": {
    "latex": "\\'{c}"
  },
  "Ĉ": {
    "latex": "\\^{C}"
  },
  "ĉ": {
    "latex": "\\^{c}"
  },
  "Ċ": {
    "latex": "\\.{C}"
  },
  "ċ": {
    "latex": "\\.{c}"
  },
  "Č": {
    "latex": "\\v{C}"
  },
  "č": {
    "latex": "\\v{c}"
  },
  "Ď": {
    "latex": "\\v{D}"
  },
  "ď": {
    "latex": "\\v{d}"
  },
  "Đ": {
    "latex": "\\DJ"
  },
  "đ": {
    "latex": "\\dj"
  },
  "Ē": {
    "latex": "\\={E}"
  },
  "ē": {
    "latex": "\\={e}"
  },
  "Ĕ": {
    "latex": "\\u{E}"
  },
  "ĕ": {
    "latex": "\\u{e}"
  },
  "Ė": {
    "latex": "\\.{E}"
  },
  "ė": {
    "latex": "\\.{e}"
  },
  "Ę": {
    "latex": "\\k{E}"
  },
  "ę": {
    "latex": "\\k{e}"
  },
  "Ě": {
    "latex": "\\v{E}"
  },
  "ě": {
    "latex": "\\v{e}"
  },
  "Ĝ": {
    "latex": "\\^{G}"
  },
  "ĝ": {
    "latex": "\\^{g}"
  },
  "Ğ": {
    "latex": "\\u{G}"
  },
  "ğ": {
    "latex": "\\u{g}"
  },
  "Ġ": {
    "latex": "\\.{G}"
  },
  "ġ": {
    "latex": "\\.{g}"
  },
  "Ģ": {
    "latex": "\\c{G}"
  },
  "ģ": {
    "latex": "\\c{g}"
  },
  "Ĥ": {
    "latex": "\\^{H}"
  },
  "ĥ": {
    "latex": "\\^{h}"
  },
  "Ħ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char40}"
  },
  "ħ": {
    "latex": "\\Elzxh",
    "math": true
  },
  "Ĩ": {
    "latex": "\\~{I}"
  },
  "ĩ": {
    "latex": "\\~{\\i}"
  },
  "Ī": {
    "latex": "\\={I}"
  },
  "ī": {
    "latex": "\\={\\i}"
  },
  "Ĭ": {
    "latex": "\\u{I}"
  },
  "ĭ": {
    "latex": "\\u{\\i}"
  },
  "Į": {
    "latex": "\\k{I}"
  },
  "į": {
    "latex": "\\k{i}"
  },
  "İ": {
    "latex": "\\.{I}"
  },
  "ı": {
    "latex": "\\i"
  },
  "Ĳ": {
    "latex": "IJ"
  },
  "ĳ": {
    "latex": "ij"
  },
  "Ĵ": {
    "latex": "\\^{J}"
  },
  "ĵ": {
    "latex": "\\^{\\j}"
  },
  "Ķ": {
    "latex": "\\c{K}"
  },
  "ķ": {
    "latex": "\\c{k}"
  },
  "ĸ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char91}"
  },
  "Ĺ": {
    "latex": "\\'{L}"
  },
  "ĺ": {
    "latex": "\\'{l}"
  },
  "Ļ": {
    "latex": "\\c{L}"
  },
  "ļ": {
    "latex": "\\c{l}"
  },
  "Ľ": {
    "latex": "\\v{L}"
  },
  "ľ": {
    "latex": "\\v{l}"
  },
  "Ŀ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char201}"
  },
  "ŀ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char202}"
  },
  "Ł": {
    "latex": "\\L"
  },
  "ł": {
    "latex": "\\l"
  },
  "Ń": {
    "latex": "\\'{N}"
  },
  "ń": {
    "latex": "\\'{n}"
  },
  "Ņ": {
    "latex": "\\c{N}"
  },
  "ņ": {
    "latex": "\\c{n}"
  },
  "Ň": {
    "latex": "\\v{N}"
  },
  "ň": {
    "latex": "\\v{n}"
  },
  "ŉ": {
    "latex": "'n"
  },
  "Ŋ": {
    "latex": "\\NG"
  },
  "ŋ": {
    "latex": "\\ng"
  },
  "Ō": {
    "latex": "\\={O}"
  },
  "ō": {
    "latex": "\\={o}"
  },
  "Ŏ": {
    "latex": "\\u{O}"
  },
  "ŏ": {
    "latex": "\\u{o}"
  },
  "Ő": {
    "latex": "\\H{O}"
  },
  "ő": {
    "latex": "\\H{o}"
  },
  "Œ": {
    "latex": "\\OE"
  },
  "œ": {
    "latex": "\\oe"
  },
  "Ŕ": {
    "latex": "\\'{R}"
  },
  "ŕ": {
    "latex": "\\'{r}"
  },
  "Ŗ": {
    "latex": "\\c{R}"
  },
  "ŗ": {
    "latex": "\\c{r}"
  },
  "Ř": {
    "latex": "\\v{R}"
  },
  "ř": {
    "latex": "\\v{r}"
  },
  "Ś": {
    "latex": "\\'{S}"
  },
  "ś": {
    "latex": "\\'{s}"
  },
  "Ŝ": {
    "latex": "\\^{S}"
  },
  "ŝ": {
    "latex": "\\^{s}"
  },
  "Ş": {
    "latex": "\\c{S}"
  },
  "ş": {
    "latex": "\\c{s}"
  },
  "Š": {
    "latex": "\\v{S}"
  },
  "š": {
    "latex": "\\v{s}"
  },
  "Ţ": {
    "latex": "\\c{T}"
  },
  "ţ": {
    "latex": "\\c{t}"
  },
  "Ť": {
    "latex": "\\v{T}"
  },
  "ť": {
    "latex": "\\v{t}"
  },
  "Ŧ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char47}"
  },
  "ŧ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char63}"
  },
  "Ũ": {
    "latex": "\\~{U}"
  },
  "ũ": {
    "latex": "\\~{u}"
  },
  "Ū": {
    "latex": "\\={U}"
  },
  "ū": {
    "latex": "\\={u}"
  },
  "Ŭ": {
    "latex": "\\u{U}"
  },
  "ŭ": {
    "latex": "\\u{u}"
  },
  "Ů": {
    "latex": "\\r{U}"
  },
  "ů": {
    "latex": "\\r{u}"
  },
  "Ű": {
    "latex": "\\H{U}"
  },
  "ű": {
    "latex": "\\H{u}"
  },
  "Ų": {
    "latex": "\\k{U}"
  },
  "ų": {
    "latex": "\\k{u}"
  },
  "Ŵ": {
    "latex": "\\^{W}"
  },
  "ŵ": {
    "latex": "\\^{w}"
  },
  "Ŷ": {
    "latex": "\\^{Y}"
  },
  "ŷ": {
    "latex": "\\^{y}"
  },
  "Ÿ": {
    "latex": "\\\"{Y}"
  },
  "Ź": {
    "latex": "\\'{Z}"
  },
  "ź": {
    "latex": "\\'{z}"
  },
  "Ż": {
    "latex": "\\.{Z}"
  },
  "ż": {
    "latex": "\\.{z}"
  },
  "Ž": {
    "latex": "\\v{Z}"
  },
  "ž": {
    "latex": "\\v{z}"
  },
  "ƒ": {
    "latex": "f",
    "math": true
  },
  "ƕ": {
    "latex": "\\texthvlig"
  },
  "ƞ": {
    "latex": "\\textnrleg"
  },
  "ƪ": {
    "latex": "\\eth",
    "math": true
  },
  "ƺ": {
    "latex": "{\\fontencoding{LELA}\\selectfont\\char195}"
  },
  "ǂ": {
    "latex": "\\textdoublepipe"
  },
  "ǵ": {
    "latex": "\\'{g}"
  },
  "ɐ": {
    "latex": "\\Elztrna",
    "math": true
  },
  "ɒ": {
    "latex": "\\Elztrnsa",
    "math": true
  },
  "ɔ": {
    "latex": "\\Elzopeno",
    "math": true
  },
  "ɖ": {
    "latex": "\\Elzrtld",
    "math": true
  },
  "ɘ": {
    "latex": "{\\fontencoding{LEIP}\\selectfont\\char61}"
  },
  "ə": {
    "latex": "\\Elzschwa",
    "math": true
  },
  "ɛ": {
    "latex": "\\varepsilon",
    "math": true
  },
  "ɡ": {
    "latex": "g"
  },
  "ɣ": {
    "latex": "\\Elzpgamma",
    "math": true
  },
  "ɤ": {
    "latex": "\\Elzpbgam",
    "math": true
  },
  "ɥ": {
    "latex": "\\Elztrnh",
    "math": true
  },
  "ɬ": {
    "latex": "\\Elzbtdl",
    "math": true
  },
  "ɭ": {
    "latex": "\\Elzrtll",
    "math": true
  },
  "ɯ": {
    "latex": "\\Elztrnm",
    "math": true
  },
  "ɰ": {
    "latex": "\\Elztrnmlr",
    "math": true
  },
  "ɱ": {
    "latex": "\\Elzltlmr",
    "math": true
  },
  "ɲ": {
    "latex": "\\Elzltln"
  },
  "ɳ": {
    "latex": "\\Elzrtln",
    "math": true
  },
  "ɷ": {
    "latex": "\\Elzclomeg",
    "math": true
  },
  "ɸ": {
    "latex": "\\textphi"
  },
  "ɹ": {
    "latex": "\\Elztrnr",
    "math": true
  },
  "ɺ": {
    "latex": "\\Elztrnrl",
    "math": true
  },
  "ɻ": {
    "latex": "\\Elzrttrnr",
    "math": true
  },
  "ɼ": {
    "latex": "\\Elzrl",
    "math": true
  },
  "ɽ": {
    "latex": "\\Elzrtlr",
    "math": true
  },
  "ɾ": {
    "latex": "\\Elzfhr",
    "math": true
  },
  "ɿ": {
    "latex": "{\\fontencoding{LEIP}\\selectfont\\char202}"
  },
  "ʂ": {
    "latex": "\\Elzrtls",
    "math": true
  },
  "ʃ": {
    "latex": "\\Elzesh",
    "math": true
  },
  "ʇ": {
    "latex": "\\Elztrnt",
    "math": true
  },
  "ʈ": {
    "latex": "\\Elzrtlt",
    "math": true
  },
  "ʊ": {
    "latex": "\\Elzpupsil",
    "math": true
  },
  "ʋ": {
    "latex": "\\Elzpscrv",
    "math": true
  },
  "ʌ": {
    "latex": "\\Elzinvv",
    "math": true
  },
  "ʍ": {
    "latex": "\\Elzinvw",
    "math": true
  },
  "ʎ": {
    "latex": "\\Elztrny",
    "math": true
  },
  "ʐ": {
    "latex": "\\Elzrtlz",
    "math": true
  },
  "ʒ": {
    "latex": "\\Elzyogh",
    "math": true
  },
  "ʔ": {
    "latex": "\\Elzglst",
    "math": true
  },
  "ʕ": {
    "latex": "\\Elzreglst",
    "math": true
  },
  "ʖ": {
    "latex": "\\Elzinglst",
    "math": true
  },
  "ʞ": {
    "latex": "\\textturnk"
  },
  "ʤ": {
    "latex": "\\Elzdyogh",
    "math": true
  },
  "ʧ": {
    "latex": "\\Elztesh",
    "math": true
  },
  "ʼ": {
    "latex": "'"
  },
  "ˇ": {
    "latex": "\\textasciicaron"
  },
  "ˈ": {
    "latex": "\\Elzverts",
    "math": true
  },
  "ˌ": {
    "latex": "\\Elzverti",
    "math": true
  },
  "ː": {
    "latex": "\\Elzlmrk",
    "math": true
  },
  "ˑ": {
    "latex": "\\Elzhlmrk",
    "math": true
  },
  "˒": {
    "latex": "\\Elzsbrhr",
    "math": true
  },
  "˓": {
    "latex": "\\Elzsblhr",
    "math": true
  },
  "˔": {
    "latex": "\\Elzrais",
    "math": true
  },
  "˕": {
    "latex": "\\Elzlow",
    "math": true
  },
  "˘": {
    "latex": "\\textasciibreve"
  },
  "˙": {
    "latex": "\\textperiodcentered"
  },
  "˚": {
    "latex": "\\r{}"
  },
  "˛": {
    "latex": "\\k{}"
  },
  "˜": {
    "latex": "\\texttildelow"
  },
  "˝": {
    "latex": "\\H{}"
  },
  "˥": {
    "latex": "\\tone{55}"
  },
  "˦": {
    "latex": "\\tone{44}"
  },
  "˧": {
    "latex": "\\tone{33}"
  },
  "˨": {
    "latex": "\\tone{22}"
  },
  "˩": {
    "latex": "\\tone{11}"
  },
  "̀": {
    "latex": "\\`"
  },
  "́": {
    "latex": "\\'"
  },
  "̂": {
    "latex": "\\^"
  },
  "̃": {
    "latex": "\\~"
  },
  "̄": {
    "latex": "\\="
  },
  "̆": {
    "latex": "\\u"
  },
  "̇": {
    "latex": "\\."
  },
  "̈": {
    "latex": "\\\""
  },
  "̊": {
    "latex": "\\r"
  },
  "̋": {
    "latex": "\\H"
  },
  "̌": {
    "latex": "\\v"
  },
  "̏": {
    "latex": "\\cyrchar\\C"
  },
  "̑": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char177}"
  },
  "̘": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char184}"
  },
  "̙": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char185}"
  },
  "̡": {
    "latex": "\\Elzpalh",
    "math": true
  },
  "̢": {
    "latex": "\\Elzrh"
  },
  "̧": {
    "latex": "\\c"
  },
  "̨": {
    "latex": "\\k"
  },
  "̪": {
    "latex": "\\Elzsbbrg",
    "math": true
  },
  "̫": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char203}"
  },
  "̯": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char207}"
  },
  "̵": {
    "latex": "\\Elzxl"
  },
  "̶": {
    "latex": "\\Elzbar"
  },
  "̷": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char215}"
  },
  "̸": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char216}"
  },
  "̺": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char218}"
  },
  "̻": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char219}"
  },
  "̼": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char220}"
  },
  "̽": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char221}"
  },
  "͡": {
    "latex": "{\\fontencoding{LECO}\\selectfont\\char225}"
  },
  "Ά": {
    "latex": "\\'{A}"
  },
  "Έ": {
    "latex": "\\'{E}"
  },
  "Ή": {
    "latex": "\\'{H}"
  },
  "Ί": {
    "latex": "\\'{}{I}"
  },
  "Ό": {
    "latex": "\\'{}O"
  },
  "Ύ": {
    "latex": "\\mathrm{'Y}",
    "math": true
  },
  "Ώ": {
    "latex": "\\mathrm{'\\Omega}",
    "math": true
  },
  "ΐ": {
    "latex": "\\acute{\\ddot{\\iota}}",
    "math": true
  },
  "Α": {
    "latex": "\\Alpha",
    "math": true
  },
  "Β": {
    "latex": "\\Beta",
    "math": true
  },
  "Γ": {
    "latex": "\\Gamma",
    "math": true
  },
  "Δ": {
    "latex": "\\Delta",
    "math": true
  },
  "Ε": {
    "latex": "\\Epsilon",
    "math": true
  },
  "Ζ": {
    "latex": "\\Zeta",
    "math": true
  },
  "Η": {
    "latex": "\\Eta",
    "math": true
  },
  "Θ": {
    "latex": "\\Theta",
    "math": true
  },
  "Ι": {
    "latex": "\\Iota",
    "math": true
  },
  "Κ": {
    "latex": "\\Kappa",
    "math": true
  },
  "Λ": {
    "latex": "\\Lambda",
    "math": true
  },
  "Μ": {
    "latex": "M",
    "math": true
  },
  "Ν": {
    "latex": "N",
    "math": true
  },
  "Ξ": {
    "latex": "\\Xi",
    "math": true
  },
  "Ο": {
    "latex": "O",
    "math": true
  },
  "Π": {
    "latex": "\\Pi",
    "math": true
  },
  "Ρ": {
    "latex": "\\Rho",
    "math": true
  },
  "Σ": {
    "latex": "\\Sigma",
    "math": true
  },
  "Τ": {
    "latex": "\\Tau",
    "math": true
  },
  "Υ": {
    "latex": "\\Upsilon",
    "math": true
  },
  "Φ": {
    "latex": "\\Phi",
    "math": true
  },
  "Χ": {
    "latex": "\\Chi",
    "math": true
  },
  "Ψ": {
    "latex": "\\Psi",
    "math": true
  },
  "Ω": {
    "latex": "\\Omega",
    "math": true
  },
  "Ϊ": {
    "latex": "\\mathrm{\\ddot{I}}",
    "math": true
  },
  "Ϋ": {
    "latex": "\\mathrm{\\ddot{Y}}",
    "math": true
  },
  "ά": {
    "latex": "\\'{$\\alpha$}"
  },
  "έ": {
    "latex": "\\acute{\\epsilon}",
    "math": true
  },
  "ή": {
    "latex": "\\acute{\\eta}",
    "math": true
  },
  "ί": {
    "latex": "\\acute{\\iota}",
    "math": true
  },
  "ΰ": {
    "latex": "\\acute{\\ddot{\\upsilon}}",
    "math": true
  },
  "α": {
    "latex": "\\alpha",
    "math": true
  },
  "β": {
    "latex": "\\beta",
    "math": true
  },
  "γ": {
    "latex": "\\gamma",
    "math": true
  },
  "δ": {
    "latex": "\\delta",
    "math": true
  },
  "ε": {
    "latex": "\\epsilon",
    "math": true
  },
  "ζ": {
    "latex": "\\zeta",
    "math": true
  },
  "η": {
    "latex": "\\eta",
    "math": true
  },
  "θ": {
    "latex": "\\texttheta"
  },
  "ι": {
    "latex": "\\iota",
    "math": true
  },
  "κ": {
    "latex": "\\kappa",
    "math": true
  },
  "λ": {
    "latex": "\\lambda",
    "math": true
  },
  "μ": {
    "latex": "\\mu",
    "math": true
  },
  "ν": {
    "latex": "\\nu",
    "math": true
  },
  "ξ": {
    "latex": "\\xi",
    "math": true
  },
  "ο": {
    "latex": "o",
    "math": true
  },
  "π": {
    "latex": "\\pi",
    "math": true
  },
  "ρ": {
    "latex": "\\rho",
    "math": true
  },
  "ς": {
    "latex": "\\varsigma",
    "math": true
  },
  "σ": {
    "latex": "\\sigma",
    "math": true
  },
  "τ": {
    "latex": "\\tau",
    "math": true
  },
  "υ": {
    "latex": "\\upsilon",
    "math": true
  },
  "φ": {
    "latex": "\\varphi",
    "math": true
  },
  "χ": {
    "latex": "\\chi",
    "math": true
  },
  "ψ": {
    "latex": "\\psi",
    "math": true
  },
  "ω": {
    "latex": "\\omega",
    "math": true
  },
  "ϊ": {
    "latex": "\\ddot{\\iota}",
    "math": true
  },
  "ϋ": {
    "latex": "\\ddot{\\upsilon}",
    "math": true
  },
  "ό": {
    "latex": "\\'{o}"
  },
  "ύ": {
    "latex": "\\acute{\\upsilon}",
    "math": true
  },
  "ώ": {
    "latex": "\\acute{\\omega}",
    "math": true
  },
  "ϐ": {
    "latex": "\\Pisymbol{ppi022}{87}"
  },
  "ϑ": {
    "latex": "\\textvartheta"
  },
  "ϒ": {
    "latex": "\\Upsilon",
    "math": true
  },
  "ϕ": {
    "latex": "\\phi",
    "math": true
  },
  "ϖ": {
    "latex": "\\varpi",
    "math": true
  },
  "Ϛ": {
    "latex": "\\Stigma",
    "math": true
  },
  "Ϝ": {
    "latex": "\\Digamma",
    "math": true
  },
  "ϝ": {
    "latex": "\\digamma",
    "math": true
  },
  "Ϟ": {
    "latex": "\\Koppa",
    "math": true
  },
  "Ϡ": {
    "latex": "\\Sampi",
    "math": true
  },
  "ϰ": {
    "latex": "\\varkappa",
    "math": true
  },
  "ϱ": {
    "latex": "\\varrho",
    "math": true
  },
  "ϴ": {
    "latex": "\\textTheta"
  },
  "϶": {
    "latex": "\\backepsilon",
    "math": true
  },
  "Ё": {
    "latex": "\\cyrchar\\CYRYO"
  },
  "Ђ": {
    "latex": "\\cyrchar\\CYRDJE"
  },
  "Ѓ": {
    "latex": "\\cyrchar{\\'\\CYRG}"
  },
  "Є": {
    "latex": "\\cyrchar\\CYRIE"
  },
  "Ѕ": {
    "latex": "\\cyrchar\\CYRDZE"
  },
  "І": {
    "latex": "\\cyrchar\\CYRII"
  },
  "Ї": {
    "latex": "\\cyrchar\\CYRYI"
  },
  "Ј": {
    "latex": "\\cyrchar\\CYRJE"
  },
  "Љ": {
    "latex": "\\cyrchar\\CYRLJE"
  },
  "Њ": {
    "latex": "\\cyrchar\\CYRNJE"
  },
  "Ћ": {
    "latex": "\\cyrchar\\CYRTSHE"
  },
  "Ќ": {
    "latex": "\\cyrchar{\\'\\CYRK}"
  },
  "Ў": {
    "latex": "\\cyrchar\\CYRUSHRT"
  },
  "Џ": {
    "latex": "\\cyrchar\\CYRDZHE"
  },
  "А": {
    "latex": "\\cyrchar\\CYRA"
  },
  "Б": {
    "latex": "\\cyrchar\\CYRB"
  },
  "В": {
    "latex": "\\cyrchar\\CYRV"
  },
  "Г": {
    "latex": "\\cyrchar\\CYRG"
  },
  "Д": {
    "latex": "\\cyrchar\\CYRD"
  },
  "Е": {
    "latex": "\\cyrchar\\CYRE"
  },
  "Ж": {
    "latex": "\\cyrchar\\CYRZH"
  },
  "З": {
    "latex": "\\cyrchar\\CYRZ"
  },
  "И": {
    "latex": "\\cyrchar\\CYRI"
  },
  "Й": {
    "latex": "\\cyrchar\\CYRISHRT"
  },
  "К": {
    "latex": "\\cyrchar\\CYRK"
  },
  "Л": {
    "latex": "\\cyrchar\\CYRL"
  },
  "М": {
    "latex": "\\cyrchar\\CYRM"
  },
  "Н": {
    "latex": "\\cyrchar\\CYRN"
  },
  "О": {
    "latex": "\\cyrchar\\CYRO"
  },
  "П": {
    "latex": "\\cyrchar\\CYRP"
  },
  "Р": {
    "latex": "\\cyrchar\\CYRR"
  },
  "С": {
    "latex": "\\cyrchar\\CYRS"
  },
  "Т": {
    "latex": "\\cyrchar\\CYRT"
  },
  "У": {
    "latex": "\\cyrchar\\CYRU"
  },
  "Ф": {
    "latex": "\\cyrchar\\CYRF"
  },
  "Х": {
    "latex": "\\cyrchar\\CYRH"
  },
  "Ц": {
    "latex": "\\cyrchar\\CYRC"
  },
  "Ч": {
    "latex": "\\cyrchar\\CYRCH"
  },
  "Ш": {
    "latex": "\\cyrchar\\CYRSH"
  },
  "Щ": {
    "latex": "\\cyrchar\\CYRSHCH"
  },
  "Ъ": {
    "latex": "\\cyrchar\\CYRHRDSN"
  },
  "Ы": {
    "latex": "\\cyrchar\\CYRERY"
  },
  "Ь": {
    "latex": "\\cyrchar\\CYRSFTSN"
  },
  "Э": {
    "latex": "\\cyrchar\\CYREREV"
  },
  "Ю": {
    "latex": "\\cyrchar\\CYRYU"
  },
  "Я": {
    "latex": "\\cyrchar\\CYRYA"
  },
  "а": {
    "latex": "\\cyrchar\\cyra"
  },
  "б": {
    "latex": "\\cyrchar\\cyrb"
  },
  "в": {
    "latex": "\\cyrchar\\cyrv"
  },
  "г": {
    "latex": "\\cyrchar\\cyrg"
  },
  "д": {
    "latex": "\\cyrchar\\cyrd"
  },
  "е": {
    "latex": "\\cyrchar\\cyre"
  },
  "ж": {
    "latex": "\\cyrchar\\cyrzh"
  },
  "з": {
    "latex": "\\cyrchar\\cyrz"
  },
  "и": {
    "latex": "\\cyrchar\\cyri"
  },
  "й": {
    "latex": "\\cyrchar\\cyrishrt"
  },
  "к": {
    "latex": "\\cyrchar\\cyrk"
  },
  "л": {
    "latex": "\\cyrchar\\cyrl"
  },
  "м": {
    "latex": "\\cyrchar\\cyrm"
  },
  "н": {
    "latex": "\\cyrchar\\cyrn"
  },
  "о": {
    "latex": "\\cyrchar\\cyro"
  },
  "п": {
    "latex": "\\cyrchar\\cyrp"
  },
  "р": {
    "latex": "\\cyrchar\\cyrr"
  },
  "с": {
    "latex": "\\cyrchar\\cyrs"
  },
  "т": {
    "latex": "\\cyrchar\\cyrt"
  },
  "у": {
    "latex": "\\cyrchar\\cyru"
  },
  "ф": {
    "latex": "\\cyrchar\\cyrf"
  },
  "х": {
    "latex": "\\cyrchar\\cyrh"
  },
  "ц": {
    "latex": "\\cyrchar\\cyrc"
  },
  "ч": {
    "latex": "\\cyrchar\\cyrch"
  },
  "ш": {
    "latex": "\\cyrchar\\cyrsh"
  },
  "щ": {
    "latex": "\\cyrchar\\cyrshch"
  },
  "ъ": {
    "latex": "\\cyrchar\\cyrhrdsn"
  },
  "ы": {
    "latex": "\\cyrchar\\cyrery"
  },
  "ь": {
    "latex": "\\cyrchar\\cyrsftsn"
  },
  "э": {
    "latex": "\\cyrchar\\cyrerev"
  },
  "ю": {
    "latex": "\\cyrchar\\cyryu"
  },
  "я": {
    "latex": "\\cyrchar\\cyrya"
  },
  "ё": {
    "latex": "\\cyrchar\\cyryo"
  },
  "ђ": {
    "latex": "\\cyrchar\\cyrdje"
  },
  "ѓ": {
    "latex": "\\cyrchar{\\'\\cyrg}"
  },
  "є": {
    "latex": "\\cyrchar\\cyrie"
  },
  "ѕ": {
    "latex": "\\cyrchar\\cyrdze"
  },
  "і": {
    "latex": "\\cyrchar\\cyrii"
  },
  "ї": {
    "latex": "\\cyrchar\\cyryi"
  },
  "ј": {
    "latex": "\\cyrchar\\cyrje"
  },
  "љ": {
    "latex": "\\cyrchar\\cyrlje"
  },
  "њ": {
    "latex": "\\cyrchar\\cyrnje"
  },
  "ћ": {
    "latex": "\\cyrchar\\cyrtshe"
  },
  "ќ": {
    "latex": "\\cyrchar{\\'\\cyrk}"
  },
  "ў": {
    "latex": "\\cyrchar\\cyrushrt"
  },
  "џ": {
    "latex": "\\cyrchar\\cyrdzhe"
  },
  "Ѡ": {
    "latex": "\\cyrchar\\CYROMEGA"
  },
  "ѡ": {
    "latex": "\\cyrchar\\cyromega"
  },
  "Ѣ": {
    "latex": "\\cyrchar\\CYRYAT"
  },
  "Ѥ": {
    "latex": "\\cyrchar\\CYRIOTE"
  },
  "ѥ": {
    "latex": "\\cyrchar\\cyriote"
  },
  "Ѧ": {
    "latex": "\\cyrchar\\CYRLYUS"
  },
  "ѧ": {
    "latex": "\\cyrchar\\cyrlyus"
  },
  "Ѩ": {
    "latex": "\\cyrchar\\CYRIOTLYUS"
  },
  "ѩ": {
    "latex": "\\cyrchar\\cyriotlyus"
  },
  "Ѫ": {
    "latex": "\\cyrchar\\CYRBYUS"
  },
  "Ѭ": {
    "latex": "\\cyrchar\\CYRIOTBYUS"
  },
  "ѭ": {
    "latex": "\\cyrchar\\cyriotbyus"
  },
  "Ѯ": {
    "latex": "\\cyrchar\\CYRKSI"
  },
  "ѯ": {
    "latex": "\\cyrchar\\cyrksi"
  },
  "Ѱ": {
    "latex": "\\cyrchar\\CYRPSI"
  },
  "ѱ": {
    "latex": "\\cyrchar\\cyrpsi"
  },
  "Ѳ": {
    "latex": "\\cyrchar\\CYRFITA"
  },
  "Ѵ": {
    "latex": "\\cyrchar\\CYRIZH"
  },
  "Ѹ": {
    "latex": "\\cyrchar\\CYRUK"
  },
  "ѹ": {
    "latex": "\\cyrchar\\cyruk"
  },
  "Ѻ": {
    "latex": "\\cyrchar\\CYROMEGARND"
  },
  "ѻ": {
    "latex": "\\cyrchar\\cyromegarnd"
  },
  "Ѽ": {
    "latex": "\\cyrchar\\CYROMEGATITLO"
  },
  "ѽ": {
    "latex": "\\cyrchar\\cyromegatitlo"
  },
  "Ѿ": {
    "latex": "\\cyrchar\\CYROT"
  },
  "ѿ": {
    "latex": "\\cyrchar\\cyrot"
  },
  "Ҁ": {
    "latex": "\\cyrchar\\CYRKOPPA"
  },
  "ҁ": {
    "latex": "\\cyrchar\\cyrkoppa"
  },
  "҂": {
    "latex": "\\cyrchar\\cyrthousands"
  },
  "҈": {
    "latex": "\\cyrchar\\cyrhundredthousands"
  },
  "҉": {
    "latex": "\\cyrchar\\cyrmillions"
  },
  "Ҍ": {
    "latex": "\\cyrchar\\CYRSEMISFTSN"
  },
  "ҍ": {
    "latex": "\\cyrchar\\cyrsemisftsn"
  },
  "Ҏ": {
    "latex": "\\cyrchar\\CYRRTICK"
  },
  "ҏ": {
    "latex": "\\cyrchar\\cyrrtick"
  },
  "Ґ": {
    "latex": "\\cyrchar\\CYRGUP"
  },
  "ґ": {
    "latex": "\\cyrchar\\cyrgup"
  },
  "Ғ": {
    "latex": "\\cyrchar\\CYRGHCRS"
  },
  "ғ": {
    "latex": "\\cyrchar\\cyrghcrs"
  },
  "Ҕ": {
    "latex": "\\cyrchar\\CYRGHK"
  },
  "ҕ": {
    "latex": "\\cyrchar\\cyrghk"
  },
  "Җ": {
    "latex": "\\cyrchar\\CYRZHDSC"
  },
  "җ": {
    "latex": "\\cyrchar\\cyrzhdsc"
  },
  "Ҙ": {
    "latex": "\\cyrchar\\CYRZDSC"
  },
  "ҙ": {
    "latex": "\\cyrchar\\cyrzdsc"
  },
  "Қ": {
    "latex": "\\cyrchar\\CYRKDSC"
  },
  "қ": {
    "latex": "\\cyrchar\\cyrkdsc"
  },
  "Ҝ": {
    "latex": "\\cyrchar\\CYRKVCRS"
  },
  "ҝ": {
    "latex": "\\cyrchar\\cyrkvcrs"
  },
  "Ҟ": {
    "latex": "\\cyrchar\\CYRKHCRS"
  },
  "ҟ": {
    "latex": "\\cyrchar\\cyrkhcrs"
  },
  "Ҡ": {
    "latex": "\\cyrchar\\CYRKBEAK"
  },
  "ҡ": {
    "latex": "\\cyrchar\\cyrkbeak"
  },
  "Ң": {
    "latex": "\\cyrchar\\CYRNDSC"
  },
  "ң": {
    "latex": "\\cyrchar\\cyrndsc"
  },
  "Ҥ": {
    "latex": "\\cyrchar\\CYRNG"
  },
  "ҥ": {
    "latex": "\\cyrchar\\cyrng"
  },
  "Ҧ": {
    "latex": "\\cyrchar\\CYRPHK"
  },
  "ҧ": {
    "latex": "\\cyrchar\\cyrphk"
  },
  "Ҩ": {
    "latex": "\\cyrchar\\CYRABHHA"
  },
  "ҩ": {
    "latex": "\\cyrchar\\cyrabhha"
  },
  "Ҫ": {
    "latex": "\\cyrchar\\CYRSDSC"
  },
  "ҫ": {
    "latex": "\\cyrchar\\cyrsdsc"
  },
  "Ҭ": {
    "latex": "\\cyrchar\\CYRTDSC"
  },
  "ҭ": {
    "latex": "\\cyrchar\\cyrtdsc"
  },
  "Ү": {
    "latex": "\\cyrchar\\CYRY"
  },
  "ү": {
    "latex": "\\cyrchar\\cyry"
  },
  "Ұ": {
    "latex": "\\cyrchar\\CYRYHCRS"
  },
  "ұ": {
    "latex": "\\cyrchar\\cyryhcrs"
  },
  "Ҳ": {
    "latex": "\\cyrchar\\CYRHDSC"
  },
  "ҳ": {
    "latex": "\\cyrchar\\cyrhdsc"
  },
  "Ҵ": {
    "latex": "\\cyrchar\\CYRTETSE"
  },
  "ҵ": {
    "latex": "\\cyrchar\\cyrtetse"
  },
  "Ҷ": {
    "latex": "\\cyrchar\\CYRCHRDSC"
  },
  "ҷ": {
    "latex": "\\cyrchar\\cyrchrdsc"
  },
  "Ҹ": {
    "latex": "\\cyrchar\\CYRCHVCRS"
  },
  "ҹ": {
    "latex": "\\cyrchar\\cyrchvcrs"
  },
  "Һ": {
    "latex": "\\cyrchar\\CYRSHHA"
  },
  "һ": {
    "latex": "\\cyrchar\\cyrshha"
  },
  "Ҽ": {
    "latex": "\\cyrchar\\CYRABHCH"
  },
  "ҽ": {
    "latex": "\\cyrchar\\cyrabhch"
  },
  "Ҿ": {
    "latex": "\\cyrchar\\CYRABHCHDSC"
  },
  "ҿ": {
    "latex": "\\cyrchar\\cyrabhchdsc"
  },
  "Ӏ": {
    "latex": "\\cyrchar\\CYRpalochka"
  },
  "Ӄ": {
    "latex": "\\cyrchar\\CYRKHK"
  },
  "ӄ": {
    "latex": "\\cyrchar\\cyrkhk"
  },
  "Ӈ": {
    "latex": "\\cyrchar\\CYRNHK"
  },
  "ӈ": {
    "latex": "\\cyrchar\\cyrnhk"
  },
  "Ӌ": {
    "latex": "\\cyrchar\\CYRCHLDSC"
  },
  "ӌ": {
    "latex": "\\cyrchar\\cyrchldsc"
  },
  "Ӕ": {
    "latex": "\\cyrchar\\CYRAE"
  },
  "ӕ": {
    "latex": "\\cyrchar\\cyrae"
  },
  "Ә": {
    "latex": "\\cyrchar\\CYRSCHWA"
  },
  "ә": {
    "latex": "\\cyrchar\\cyrschwa"
  },
  "Ӡ": {
    "latex": "\\cyrchar\\CYRABHDZE"
  },
  "ӡ": {
    "latex": "\\cyrchar\\cyrabhdze"
  },
  "Ө": {
    "latex": "\\cyrchar\\CYROTLD"
  },
  "ө": {
    "latex": "\\cyrchar\\cyrotld"
  },
  " ": {
    "latex": "\\hspace{0.6em}"
  },
  " ": {
    "latex": "\\hspace{1em}"
  },
  " ": {
    "latex": "\\hspace{0.33em}"
  },
  " ": {
    "latex": "\\hspace{0.25em}"
  },
  " ": {
    "latex": "\\hspace{0.166em}"
  },
  " ": {
    "latex": "\\hphantom{0}"
  },
  " ": {
    "latex": "\\hphantom{,}"
  },
  " ": {
    "latex": "\\hspace{0.167em}"
  },
  "   ": {
    "latex": "\\;",
    "math": true
  },
  " ": {
    "latex": "\\mkern1mu",
    "math": true
  },
  "‐": {
    "latex": "-"
  },
  "–": {
    "latex": "\\textendash"
  },
  "—": {
    "latex": "\\textemdash"
  },
  "―": {
    "latex": "\\rule{1em}{1pt}"
  },
  "‖": {
    "latex": "\\Vert",
    "math": true
  },
  "‘": {
    "latex": "`"
  },
  "’": {
    "latex": "'"
  },
  "‚": {
    "latex": ","
  },
  "‛": {
    "latex": "\\Elzreapos",
    "math": true
  },
  "“": {
    "latex": "``"
  },
  "”": {
    "latex": "''"
  },
  "„": {
    "latex": ",,"
  },
  "†": {
    "latex": "\\textdagger"
  },
  "‡": {
    "latex": "\\textdaggerdbl"
  },
  "•": {
    "latex": "\\textbullet"
  },
  "․": {
    "latex": "."
  },
  "‥": {
    "latex": ".."
  },
  "…": {
    "latex": "\\ldots"
  },
  "‰": {
    "latex": "\\textperthousand"
  },
  "‱": {
    "latex": "\\textpertenthousand"
  },
  "′": {
    "latex": "{'}",
    "math": true
  },
  "″": {
    "latex": "{''}",
    "math": true
  },
  "‴": {
    "latex": "{'''}",
    "math": true
  },
  "‵": {
    "latex": "\\backprime",
    "math": true
  },
  "‹": {
    "latex": "\\guilsinglleft"
  },
  "›": {
    "latex": "\\guilsinglright"
  },
  "⁗": {
    "latex": "''''",
    "math": true
  },
  " ": {
    "latex": "\\mkern4mu"
  },
  "⁠": {
    "latex": "\\nolinebreak"
  },
  "₧": {
    "latex": "\\ensuremath{\\Elzpes}"
  },
  "€": {
    "latex": "\\mbox{\\texteuro}"
  },
  "⃛": {
    "latex": "\\dddot",
    "math": true
  },
  "⃜": {
    "latex": "\\ddddot",
    "math": true
  },
  "ℂ": {
    "latex": "\\mathbb{C}",
    "math": true
  },
  "ℊ": {
    "latex": "\\mathscr{g}"
  },
  "ℋ": {
    "latex": "\\mathscr{H}",
    "math": true
  },
  "ℌ": {
    "latex": "\\mathfrak{H}",
    "math": true
  },
  "ℍ": {
    "latex": "\\mathbb{H}",
    "math": true
  },
  "ℏ": {
    "latex": "\\hslash",
    "math": true
  },
  "ℐ": {
    "latex": "\\mathscr{I}",
    "math": true
  },
  "ℑ": {
    "latex": "\\mathfrak{I}",
    "math": true
  },
  "ℒ": {
    "latex": "\\mathscr{L}",
    "math": true
  },
  "ℓ": {
    "latex": "\\mathscr{l}",
    "math": true
  },
  "ℕ": {
    "latex": "\\mathbb{N}",
    "math": true
  },
  "№": {
    "latex": "\\cyrchar\\textnumero"
  },
  "℘": {
    "latex": "\\wp",
    "math": true
  },
  "ℙ": {
    "latex": "\\mathbb{P}",
    "math": true
  },
  "ℚ": {
    "latex": "\\mathbb{Q}",
    "math": true
  },
  "ℛ": {
    "latex": "\\mathscr{R}",
    "math": true
  },
  "ℜ": {
    "latex": "\\mathfrak{R}",
    "math": true
  },
  "ℝ": {
    "latex": "\\mathbb{R}",
    "math": true
  },
  "℞": {
    "latex": "\\Elzxrat",
    "math": true
  },
  "™": {
    "latex": "\\texttrademark"
  },
  "ℤ": {
    "latex": "\\mathbb{Z}",
    "math": true
  },
  "Ω": {
    "latex": "\\Omega",
    "math": true
  },
  "℧": {
    "latex": "\\mho",
    "math": true
  },
  "ℨ": {
    "latex": "\\mathfrak{Z}",
    "math": true
  },
  "℩": {
    "latex": "\\ElsevierGlyph{2129}",
    "math": true
  },
  "Å": {
    "latex": "\\AA"
  },
  "ℬ": {
    "latex": "\\mathscr{B}",
    "math": true
  },
  "ℭ": {
    "latex": "\\mathfrak{C}",
    "math": true
  },
  "ℯ": {
    "latex": "\\mathscr{e}",
    "math": true
  },
  "ℰ": {
    "latex": "\\mathscr{E}",
    "math": true
  },
  "ℱ": {
    "latex": "\\mathscr{F}",
    "math": true
  },
  "ℳ": {
    "latex": "\\mathscr{M}",
    "math": true
  },
  "ℴ": {
    "latex": "\\mathscr{o}",
    "math": true
  },
  "ℵ": {
    "latex": "\\aleph",
    "math": true
  },
  "ℶ": {
    "latex": "\\beth",
    "math": true
  },
  "ℷ": {
    "latex": "\\gimel",
    "math": true
  },
  "ℸ": {
    "latex": "\\daleth",
    "math": true
  },
  "⅓": {
    "latex": "\\textfrac{1}{3}",
    "math": true
  },
  "⅔": {
    "latex": "\\textfrac{2}{3}",
    "math": true
  },
  "⅕": {
    "latex": "\\textfrac{1}{5}",
    "math": true
  },
  "⅖": {
    "latex": "\\textfrac{2}{5}",
    "math": true
  },
  "⅗": {
    "latex": "\\textfrac{3}{5}",
    "math": true
  },
  "⅘": {
    "latex": "\\textfrac{4}{5}",
    "math": true
  },
  "⅙": {
    "latex": "\\textfrac{1}{6}",
    "math": true
  },
  "⅚": {
    "latex": "\\textfrac{5}{6}",
    "math": true
  },
  "⅛": {
    "latex": "\\textfrac{1}{8}",
    "math": true
  },
  "⅜": {
    "latex": "\\textfrac{3}{8}",
    "math": true
  },
  "⅝": {
    "latex": "\\textfrac{5}{8}",
    "math": true
  },
  "⅞": {
    "latex": "\\textfrac{7}{8}",
    "math": true
  },
  "←": {
    "latex": "\\leftarrow",
    "math": true
  },
  "↑": {
    "latex": "\\uparrow",
    "math": true
  },
  "→": {
    "latex": "\\rightarrow",
    "math": true
  },
  "↓": {
    "latex": "\\downarrow",
    "math": true
  },
  "↔": {
    "latex": "\\leftrightarrow",
    "math": true
  },
  "↕": {
    "latex": "\\updownarrow",
    "math": true
  },
  "↖": {
    "latex": "\\nwarrow",
    "math": true
  },
  "↗": {
    "latex": "\\nearrow",
    "math": true
  },
  "↘": {
    "latex": "\\searrow",
    "math": true
  },
  "↙": {
    "latex": "\\swarrow",
    "math": true
  },
  "↚": {
    "latex": "\\nleftarrow",
    "math": true
  },
  "↛": {
    "latex": "\\nrightarrow",
    "math": true
  },
  "↜": {
    "latex": "\\arrowwaveright",
    "math": true
  },
  "↝": {
    "latex": "\\arrowwaveright",
    "math": true
  },
  "↞": {
    "latex": "\\twoheadleftarrow",
    "math": true
  },
  "↠": {
    "latex": "\\twoheadrightarrow",
    "math": true
  },
  "↢": {
    "latex": "\\leftarrowtail",
    "math": true
  },
  "↣": {
    "latex": "\\rightarrowtail",
    "math": true
  },
  "↦": {
    "latex": "\\mapsto",
    "math": true
  },
  "↩": {
    "latex": "\\hookleftarrow",
    "math": true
  },
  "↪": {
    "latex": "\\hookrightarrow",
    "math": true
  },
  "↫": {
    "latex": "\\looparrowleft",
    "math": true
  },
  "↬": {
    "latex": "\\looparrowright",
    "math": true
  },
  "↭": {
    "latex": "\\leftrightsquigarrow",
    "math": true
  },
  "↮": {
    "latex": "\\nleftrightarrow",
    "math": true
  },
  "↰": {
    "latex": "\\Lsh",
    "math": true
  },
  "↱": {
    "latex": "\\Rsh",
    "math": true
  },
  "↳": {
    "latex": "\\ElsevierGlyph{21B3}",
    "math": true
  },
  "↶": {
    "latex": "\\curvearrowleft",
    "math": true
  },
  "↷": {
    "latex": "\\curvearrowright",
    "math": true
  },
  "↺": {
    "latex": "\\circlearrowleft",
    "math": true
  },
  "↻": {
    "latex": "\\circlearrowright",
    "math": true
  },
  "↼": {
    "latex": "\\leftharpoonup",
    "math": true
  },
  "↽": {
    "latex": "\\leftharpoondown",
    "math": true
  },
  "↾": {
    "latex": "\\upharpoonright",
    "math": true
  },
  "↿": {
    "latex": "\\upharpoonleft",
    "math": true
  },
  "⇀": {
    "latex": "\\rightharpoonup",
    "math": true
  },
  "⇁": {
    "latex": "\\rightharpoondown",
    "math": true
  },
  "⇂": {
    "latex": "\\downharpoonright",
    "math": true
  },
  "⇃": {
    "latex": "\\downharpoonleft",
    "math": true
  },
  "⇄": {
    "latex": "\\rightleftarrows",
    "math": true
  },
  "⇅": {
    "latex": "\\dblarrowupdown",
    "math": true
  },
  "⇆": {
    "latex": "\\leftrightarrows",
    "math": true
  },
  "⇇": {
    "latex": "\\leftleftarrows",
    "math": true
  },
  "⇈": {
    "latex": "\\upuparrows",
    "math": true
  },
  "⇉": {
    "latex": "\\rightrightarrows",
    "math": true
  },
  "⇊": {
    "latex": "\\downdownarrows",
    "math": true
  },
  "⇋": {
    "latex": "\\leftrightharpoons",
    "math": true
  },
  "⇌": {
    "latex": "\\rightleftharpoons",
    "math": true
  },
  "⇍": {
    "latex": "\\nLeftarrow",
    "math": true
  },
  "⇎": {
    "latex": "\\nLeftrightarrow",
    "math": true
  },
  "⇏": {
    "latex": "\\nRightarrow",
    "math": true
  },
  "⇐": {
    "latex": "\\Leftarrow",
    "math": true
  },
  "⇑": {
    "latex": "\\Uparrow",
    "math": true
  },
  "⇒": {
    "latex": "\\Rightarrow",
    "math": true
  },
  "⇓": {
    "latex": "\\Downarrow",
    "math": true
  },
  "⇔": {
    "latex": "\\Leftrightarrow",
    "math": true
  },
  "⇕": {
    "latex": "\\Updownarrow",
    "math": true
  },
  "⇚": {
    "latex": "\\Lleftarrow",
    "math": true
  },
  "⇛": {
    "latex": "\\Rrightarrow",
    "math": true
  },
  "⇝": {
    "latex": "\\rightsquigarrow",
    "math": true
  },
  "⇵": {
    "latex": "\\DownArrowUpArrow",
    "math": true
  },
  "∀": {
    "latex": "\\forall",
    "math": true
  },
  "∁": {
    "latex": "\\complement",
    "math": true
  },
  "∂": {
    "latex": "\\partial",
    "math": true
  },
  "∃": {
    "latex": "\\exists",
    "math": true
  },
  "∄": {
    "latex": "\\nexists",
    "math": true
  },
  "∅": {
    "latex": "\\varnothing",
    "math": true
  },
  "∇": {
    "latex": "\\nabla",
    "math": true
  },
  "∈": {
    "latex": "\\in",
    "math": true
  },
  "∉": {
    "latex": "\\not\\in",
    "math": true
  },
  "∋": {
    "latex": "\\ni",
    "math": true
  },
  "∌": {
    "latex": "\\not\\ni",
    "math": true
  },
  "∏": {
    "latex": "\\prod",
    "math": true
  },
  "∐": {
    "latex": "\\coprod",
    "math": true
  },
  "∑": {
    "latex": "\\sum",
    "math": true
  },
  "−": {
    "latex": "-"
  },
  "∓": {
    "latex": "\\mp",
    "math": true
  },
  "∔": {
    "latex": "\\dotplus",
    "math": true
  },
  "∖": {
    "latex": "\\setminus",
    "math": true
  },
  "∗": {
    "latex": "{_\\ast}",
    "math": true
  },
  "∘": {
    "latex": "\\circ",
    "math": true
  },
  "∙": {
    "latex": "\\bullet",
    "math": true
  },
  "√": {
    "latex": "\\surd",
    "math": true
  },
  "∝": {
    "latex": "\\propto",
    "math": true
  },
  "∞": {
    "latex": "\\infty",
    "math": true
  },
  "∟": {
    "latex": "\\rightangle",
    "math": true
  },
  "∠": {
    "latex": "\\angle",
    "math": true
  },
  "∡": {
    "latex": "\\measuredangle",
    "math": true
  },
  "∢": {
    "latex": "\\sphericalangle",
    "math": true
  },
  "∣": {
    "latex": "\\mid",
    "math": true
  },
  "∤": {
    "latex": "\\nmid",
    "math": true
  },
  "∥": {
    "latex": "\\parallel",
    "math": true
  },
  "∦": {
    "latex": "\\nparallel",
    "math": true
  },
  "∧": {
    "latex": "\\wedge",
    "math": true
  },
  "∨": {
    "latex": "\\vee",
    "math": true
  },
  "∩": {
    "latex": "\\cap",
    "math": true
  },
  "∪": {
    "latex": "\\cup",
    "math": true
  },
  "∫": {
    "latex": "\\int",
    "math": true
  },
  "∬": {
    "latex": "\\int\\!\\int",
    "math": true
  },
  "∭": {
    "latex": "\\int\\!\\int\\!\\int",
    "math": true
  },
  "∮": {
    "latex": "\\oint",
    "math": true
  },
  "∯": {
    "latex": "\\surfintegral",
    "math": true
  },
  "∰": {
    "latex": "\\volintegral",
    "math": true
  },
  "∱": {
    "latex": "\\clwintegral",
    "math": true
  },
  "∲": {
    "latex": "\\ElsevierGlyph{2232}",
    "math": true
  },
  "∳": {
    "latex": "\\ElsevierGlyph{2233}",
    "math": true
  },
  "∴": {
    "latex": "\\therefore",
    "math": true
  },
  "∵": {
    "latex": "\\because",
    "math": true
  },
  "∷": {
    "latex": "\\Colon",
    "math": true
  },
  "∸": {
    "latex": "\\ElsevierGlyph{2238}",
    "math": true
  },
  "∺": {
    "latex": "\\mathbin{{:}\\!\\!{-}\\!\\!{:}}",
    "math": true
  },
  "∻": {
    "latex": "\\homothetic",
    "math": true
  },
  "∼": {
    "latex": "\\sim",
    "math": true
  },
  "∽": {
    "latex": "\\backsim",
    "math": true
  },
  "∾": {
    "latex": "\\lazysinv",
    "math": true
  },
  "≀": {
    "latex": "\\wr",
    "math": true
  },
  "≁": {
    "latex": "\\not\\sim",
    "math": true
  },
  "≂": {
    "latex": "\\ElsevierGlyph{2242}",
    "math": true
  },
  "≂̸": {
    "latex": "\\NotEqualTilde",
    "math": true
  },
  "≃": {
    "latex": "\\simeq",
    "math": true
  },
  "≄": {
    "latex": "\\not\\simeq",
    "math": true
  },
  "≅": {
    "latex": "\\cong",
    "math": true
  },
  "≆": {
    "latex": "\\approxnotequal",
    "math": true
  },
  "≇": {
    "latex": "\\not\\cong",
    "math": true
  },
  "≈": {
    "latex": "\\approx",
    "math": true
  },
  "≉": {
    "latex": "\\not\\approx",
    "math": true
  },
  "≊": {
    "latex": "\\approxeq",
    "math": true
  },
  "≋": {
    "latex": "\\tildetrpl",
    "math": true
  },
  "≋̸": {
    "latex": "\\not\\apid",
    "math": true
  },
  "≌": {
    "latex": "\\allequal",
    "math": true
  },
  "≍": {
    "latex": "\\asymp",
    "math": true
  },
  "≎": {
    "latex": "\\Bumpeq",
    "math": true
  },
  "≎̸": {
    "latex": "\\NotHumpDownHump",
    "math": true
  },
  "≏": {
    "latex": "\\bumpeq",
    "math": true
  },
  "≏̸": {
    "latex": "\\NotHumpEqual",
    "math": true
  },
  "≐": {
    "latex": "\\doteq",
    "math": true
  },
  "≐̸": {
    "latex": "\\not\\doteq",
    "math": true
  },
  "≑": {
    "latex": "\\doteqdot",
    "math": true
  },
  "≒": {
    "latex": "\\fallingdotseq",
    "math": true
  },
  "≓": {
    "latex": "\\risingdotseq",
    "math": true
  },
  "≔": {
    "latex": ":="
  },
  "≕": {
    "latex": "=:",
    "math": true
  },
  "≖": {
    "latex": "\\eqcirc",
    "math": true
  },
  "≗": {
    "latex": "\\circeq",
    "math": true
  },
  "≙": {
    "latex": "\\estimates",
    "math": true
  },
  "≚": {
    "latex": "\\ElsevierGlyph{225A}",
    "math": true
  },
  "≛": {
    "latex": "\\starequal",
    "math": true
  },
  "≜": {
    "latex": "\\triangleq",
    "math": true
  },
  "≟": {
    "latex": "\\ElsevierGlyph{225F}",
    "math": true
  },
  "≠": {
    "latex": "\\not =",
    "math": true
  },
  "≡": {
    "latex": "\\equiv",
    "math": true
  },
  "≢": {
    "latex": "\\not\\equiv",
    "math": true
  },
  "≤": {
    "latex": "\\leq",
    "math": true
  },
  "≥": {
    "latex": "\\geq",
    "math": true
  },
  "≦": {
    "latex": "\\leqq",
    "math": true
  },
  "≧": {
    "latex": "\\geqq",
    "math": true
  },
  "≨": {
    "latex": "\\lneqq",
    "math": true
  },
  "≨︀": {
    "latex": "\\lvertneqq",
    "math": true
  },
  "≩": {
    "latex": "\\gneqq",
    "math": true
  },
  "≩︀": {
    "latex": "\\gvertneqq",
    "math": true
  },
  "≪": {
    "latex": "\\ll",
    "math": true
  },
  "≪̸": {
    "latex": "\\NotLessLess",
    "math": true
  },
  "≫": {
    "latex": "\\gg",
    "math": true
  },
  "≫̸": {
    "latex": "\\NotGreaterGreater",
    "math": true
  },
  "≬": {
    "latex": "\\between",
    "math": true
  },
  "≭": {
    "latex": "\\not\\kern-0.3em\\times",
    "math": true
  },
  "≮": {
    "latex": "\\not<",
    "math": true
  },
  "≯": {
    "latex": "\\not>",
    "math": true
  },
  "≰": {
    "latex": "\\not\\leq",
    "math": true
  },
  "≱": {
    "latex": "\\not\\geq",
    "math": true
  },
  "≲": {
    "latex": "\\lessequivlnt",
    "math": true
  },
  "≳": {
    "latex": "\\greaterequivlnt",
    "math": true
  },
  "≴": {
    "latex": "\\ElsevierGlyph{2274}",
    "math": true
  },
  "≵": {
    "latex": "\\ElsevierGlyph{2275}",
    "math": true
  },
  "≶": {
    "latex": "\\lessgtr",
    "math": true
  },
  "≷": {
    "latex": "\\gtrless",
    "math": true
  },
  "≸": {
    "latex": "\\notlessgreater",
    "math": true
  },
  "≹": {
    "latex": "\\notgreaterless",
    "math": true
  },
  "≺": {
    "latex": "\\prec",
    "math": true
  },
  "≻": {
    "latex": "\\succ",
    "math": true
  },
  "≼": {
    "latex": "\\preccurlyeq",
    "math": true
  },
  "≽": {
    "latex": "\\succcurlyeq",
    "math": true
  },
  "≾": {
    "latex": "\\precapprox",
    "math": true
  },
  "≾̸": {
    "latex": "\\NotPrecedesTilde",
    "math": true
  },
  "≿": {
    "latex": "\\succapprox",
    "math": true
  },
  "≿̸": {
    "latex": "\\NotSucceedsTilde",
    "math": true
  },
  "⊀": {
    "latex": "\\not\\prec",
    "math": true
  },
  "⊁": {
    "latex": "\\not\\succ",
    "math": true
  },
  "⊂": {
    "latex": "\\subset",
    "math": true
  },
  "⊃": {
    "latex": "\\supset",
    "math": true
  },
  "⊄": {
    "latex": "\\not\\subset",
    "math": true
  },
  "⊅": {
    "latex": "\\not\\supset",
    "math": true
  },
  "⊆": {
    "latex": "\\subseteq",
    "math": true
  },
  "⊇": {
    "latex": "\\supseteq",
    "math": true
  },
  "⊈": {
    "latex": "\\not\\subseteq",
    "math": true
  },
  "⊉": {
    "latex": "\\not\\supseteq",
    "math": true
  },
  "⊊": {
    "latex": "\\subsetneq",
    "math": true
  },
  "⊊︀": {
    "latex": "\\varsubsetneqq",
    "math": true
  },
  "⊋": {
    "latex": "\\supsetneq",
    "math": true
  },
  "⊋︀": {
    "latex": "\\varsupsetneq",
    "math": true
  },
  "⊎": {
    "latex": "\\uplus",
    "math": true
  },
  "⊏": {
    "latex": "\\sqsubset",
    "math": true
  },
  "⊏̸": {
    "latex": "\\NotSquareSubset",
    "math": true
  },
  "⊐": {
    "latex": "\\sqsupset",
    "math": true
  },
  "⊐̸": {
    "latex": "\\NotSquareSuperset",
    "math": true
  },
  "⊑": {
    "latex": "\\sqsubseteq",
    "math": true
  },
  "⊒": {
    "latex": "\\sqsupseteq",
    "math": true
  },
  "⊓": {
    "latex": "\\sqcap",
    "math": true
  },
  "⊔": {
    "latex": "\\sqcup",
    "math": true
  },
  "⊕": {
    "latex": "\\oplus",
    "math": true
  },
  "⊖": {
    "latex": "\\ominus",
    "math": true
  },
  "⊗": {
    "latex": "\\otimes",
    "math": true
  },
  "⊘": {
    "latex": "\\oslash",
    "math": true
  },
  "⊙": {
    "latex": "\\odot",
    "math": true
  },
  "⊚": {
    "latex": "\\circledcirc",
    "math": true
  },
  "⊛": {
    "latex": "\\circledast",
    "math": true
  },
  "⊝": {
    "latex": "\\circleddash",
    "math": true
  },
  "⊞": {
    "latex": "\\boxplus",
    "math": true
  },
  "⊟": {
    "latex": "\\boxminus",
    "math": true
  },
  "⊠": {
    "latex": "\\boxtimes",
    "math": true
  },
  "⊡": {
    "latex": "\\boxdot",
    "math": true
  },
  "⊢": {
    "latex": "\\vdash",
    "math": true
  },
  "⊣": {
    "latex": "\\dashv",
    "math": true
  },
  "⊤": {
    "latex": "\\top",
    "math": true
  },
  "⊥": {
    "latex": "\\perp",
    "math": true
  },
  "⊧": {
    "latex": "\\truestate",
    "math": true
  },
  "⊨": {
    "latex": "\\forcesextra",
    "math": true
  },
  "⊩": {
    "latex": "\\Vdash",
    "math": true
  },
  "⊪": {
    "latex": "\\Vvdash",
    "math": true
  },
  "⊫": {
    "latex": "\\VDash",
    "math": true
  },
  "⊬": {
    "latex": "\\nvdash",
    "math": true
  },
  "⊭": {
    "latex": "\\nvDash",
    "math": true
  },
  "⊮": {
    "latex": "\\nVdash",
    "math": true
  },
  "⊯": {
    "latex": "\\nVDash",
    "math": true
  },
  "⊲": {
    "latex": "\\vartriangleleft",
    "math": true
  },
  "⊳": {
    "latex": "\\vartriangleright",
    "math": true
  },
  "⊴": {
    "latex": "\\trianglelefteq",
    "math": true
  },
  "⊵": {
    "latex": "\\trianglerighteq",
    "math": true
  },
  "⊶": {
    "latex": "\\original",
    "math": true
  },
  "⊷": {
    "latex": "\\image",
    "math": true
  },
  "⊸": {
    "latex": "\\multimap",
    "math": true
  },
  "⊹": {
    "latex": "\\hermitconjmatrix",
    "math": true
  },
  "⊺": {
    "latex": "\\intercal",
    "math": true
  },
  "⊻": {
    "latex": "\\veebar",
    "math": true
  },
  "⊾": {
    "latex": "\\rightanglearc",
    "math": true
  },
  "⋀": {
    "latex": "\\ElsevierGlyph{22C0}",
    "math": true
  },
  "⋁": {
    "latex": "\\ElsevierGlyph{22C1}",
    "math": true
  },
  "⋂": {
    "latex": "\\bigcap",
    "math": true
  },
  "⋃": {
    "latex": "\\bigcup",
    "math": true
  },
  "⋄": {
    "latex": "\\diamond",
    "math": true
  },
  "⋅": {
    "latex": "\\cdot",
    "math": true
  },
  "⋆": {
    "latex": "\\star",
    "math": true
  },
  "⋇": {
    "latex": "\\divideontimes",
    "math": true
  },
  "⋈": {
    "latex": "\\bowtie",
    "math": true
  },
  "⋉": {
    "latex": "\\ltimes",
    "math": true
  },
  "⋊": {
    "latex": "\\rtimes",
    "math": true
  },
  "⋋": {
    "latex": "\\leftthreetimes",
    "math": true
  },
  "⋌": {
    "latex": "\\rightthreetimes",
    "math": true
  },
  "⋍": {
    "latex": "\\backsimeq",
    "math": true
  },
  "⋎": {
    "latex": "\\curlyvee",
    "math": true
  },
  "⋏": {
    "latex": "\\curlywedge",
    "math": true
  },
  "⋐": {
    "latex": "\\Subset",
    "math": true
  },
  "⋑": {
    "latex": "\\Supset",
    "math": true
  },
  "⋒": {
    "latex": "\\Cap",
    "math": true
  },
  "⋓": {
    "latex": "\\Cup",
    "math": true
  },
  "⋔": {
    "latex": "\\pitchfork",
    "math": true
  },
  "⋖": {
    "latex": "\\lessdot",
    "math": true
  },
  "⋗": {
    "latex": "\\gtrdot",
    "math": true
  },
  "⋘": {
    "latex": "\\verymuchless",
    "math": true
  },
  "⋙": {
    "latex": "\\verymuchgreater",
    "math": true
  },
  "⋚": {
    "latex": "\\lesseqgtr",
    "math": true
  },
  "⋛": {
    "latex": "\\gtreqless",
    "math": true
  },
  "⋞": {
    "latex": "\\curlyeqprec",
    "math": true
  },
  "⋟": {
    "latex": "\\curlyeqsucc",
    "math": true
  },
  "⋢": {
    "latex": "\\not\\sqsubseteq",
    "math": true
  },
  "⋣": {
    "latex": "\\not\\sqsupseteq",
    "math": true
  },
  "⋥": {
    "latex": "\\Elzsqspne",
    "math": true
  },
  "⋦": {
    "latex": "\\lnsim",
    "math": true
  },
  "⋧": {
    "latex": "\\gnsim",
    "math": true
  },
  "⋨": {
    "latex": "\\precedesnotsimilar",
    "math": true
  },
  "⋩": {
    "latex": "\\succnsim",
    "math": true
  },
  "⋪": {
    "latex": "\\ntriangleleft",
    "math": true
  },
  "⋫": {
    "latex": "\\ntriangleright",
    "math": true
  },
  "⋬": {
    "latex": "\\ntrianglelefteq",
    "math": true
  },
  "⋭": {
    "latex": "\\ntrianglerighteq",
    "math": true
  },
  "⋮": {
    "latex": "\\vdots",
    "math": true
  },
  "⋯": {
    "latex": "\\cdots",
    "math": true
  },
  "⋰": {
    "latex": "\\upslopeellipsis",
    "math": true
  },
  "⋱": {
    "latex": "\\downslopeellipsis",
    "math": true
  },
  "⌅": {
    "latex": "\\barwedge"
  },
  "⌆": {
    "latex": "\\perspcorrespond",
    "math": true
  },
  "⌈": {
    "latex": "\\lceil",
    "math": true
  },
  "⌉": {
    "latex": "\\rceil",
    "math": true
  },
  "⌊": {
    "latex": "\\lfloor",
    "math": true
  },
  "⌋": {
    "latex": "\\rfloor",
    "math": true
  },
  "⌕": {
    "latex": "\\recorder",
    "math": true
  },
  "⌖": {
    "latex": "\\mathchar\"2208",
    "math": true
  },
  "⌜": {
    "latex": "\\ulcorner",
    "math": true
  },
  "⌝": {
    "latex": "\\urcorner",
    "math": true
  },
  "⌞": {
    "latex": "\\llcorner",
    "math": true
  },
  "⌟": {
    "latex": "\\lrcorner",
    "math": true
  },
  "⌢": {
    "latex": "\\frown",
    "math": true
  },
  "⌣": {
    "latex": "\\smile",
    "math": true
  },
  "〈": {
    "latex": "\\langle",
    "math": true
  },
  "〉": {
    "latex": "\\rangle",
    "math": true
  },
  "⌽": {
    "latex": "\\ElsevierGlyph{E838}",
    "math": true
  },
  "⎣": {
    "latex": "\\Elzdlcorn",
    "math": true
  },
  "⎰": {
    "latex": "\\lmoustache",
    "math": true
  },
  "⎱": {
    "latex": "\\rmoustache",
    "math": true
  },
  "␣": {
    "latex": "\\textvisiblespace"
  },
  "①": {
    "latex": "\\ding{172}"
  },
  "②": {
    "latex": "\\ding{173}"
  },
  "③": {
    "latex": "\\ding{174}"
  },
  "④": {
    "latex": "\\ding{175}"
  },
  "⑤": {
    "latex": "\\ding{176}"
  },
  "⑥": {
    "latex": "\\ding{177}"
  },
  "⑦": {
    "latex": "\\ding{178}"
  },
  "⑧": {
    "latex": "\\ding{179}"
  },
  "⑨": {
    "latex": "\\ding{180}"
  },
  "⑩": {
    "latex": "\\ding{181}"
  },
  "Ⓢ": {
    "latex": "\\circledS",
    "math": true
  },
  "┆": {
    "latex": "\\Elzdshfnc",
    "math": true
  },
  "┙": {
    "latex": "\\Elzsqfnw",
    "math": true
  },
  "╱": {
    "latex": "\\diagup",
    "math": true
  },
  "■": {
    "latex": "\\ding{110}"
  },
  "□": {
    "latex": "\\square",
    "math": true
  },
  "▪": {
    "latex": "\\blacksquare",
    "math": true
  },
  "▭": {
    "latex": "\\fbox{~~}",
    "math": true
  },
  "▯": {
    "latex": "\\Elzvrecto",
    "math": true
  },
  "▱": {
    "latex": "\\ElsevierGlyph{E381}",
    "math": true
  },
  "▲": {
    "latex": "\\ding{115}"
  },
  "△": {
    "latex": "\\bigtriangleup",
    "math": true
  },
  "▴": {
    "latex": "\\blacktriangle",
    "math": true
  },
  "▵": {
    "latex": "\\vartriangle",
    "math": true
  },
  "▸": {
    "latex": "\\blacktriangleright",
    "math": true
  },
  "▹": {
    "latex": "\\triangleright",
    "math": true
  },
  "▼": {
    "latex": "\\ding{116}"
  },
  "▽": {
    "latex": "\\bigtriangledown",
    "math": true
  },
  "▾": {
    "latex": "\\blacktriangledown",
    "math": true
  },
  "▿": {
    "latex": "\\triangledown",
    "math": true
  },
  "◂": {
    "latex": "\\blacktriangleleft",
    "math": true
  },
  "◃": {
    "latex": "\\triangleleft",
    "math": true
  },
  "◆": {
    "latex": "\\ding{117}"
  },
  "◊": {
    "latex": "\\lozenge",
    "math": true
  },
  "○": {
    "latex": "\\bigcirc",
    "math": true
  },
  "●": {
    "latex": "\\ding{108}"
  },
  "◐": {
    "latex": "\\Elzcirfl",
    "math": true
  },
  "◑": {
    "latex": "\\Elzcirfr",
    "math": true
  },
  "◒": {
    "latex": "\\Elzcirfb",
    "math": true
  },
  "◗": {
    "latex": "\\ding{119}"
  },
  "◘": {
    "latex": "\\Elzrvbull",
    "math": true
  },
  "◧": {
    "latex": "\\Elzsqfl",
    "math": true
  },
  "◨": {
    "latex": "\\Elzsqfr",
    "math": true
  },
  "◪": {
    "latex": "\\Elzsqfse",
    "math": true
  },
  "◯": {
    "latex": "\\bigcirc",
    "math": true
  },
  "★": {
    "latex": "\\ding{72}"
  },
  "☆": {
    "latex": "\\ding{73}"
  },
  "☎": {
    "latex": "\\ding{37}"
  },
  "☛": {
    "latex": "\\ding{42}"
  },
  "☞": {
    "latex": "\\ding{43}"
  },
  "☾": {
    "latex": "\\rightmoon"
  },
  "☿": {
    "latex": "\\mercury"
  },
  "♀": {
    "latex": "\\venus"
  },
  "♂": {
    "latex": "\\male"
  },
  "♃": {
    "latex": "\\jupiter"
  },
  "♄": {
    "latex": "\\saturn"
  },
  "♅": {
    "latex": "\\uranus"
  },
  "♆": {
    "latex": "\\neptune"
  },
  "♇": {
    "latex": "\\pluto"
  },
  "♈": {
    "latex": "\\aries"
  },
  "♉": {
    "latex": "\\taurus"
  },
  "♊": {
    "latex": "\\gemini"
  },
  "♋": {
    "latex": "\\cancer"
  },
  "♌": {
    "latex": "\\leo"
  },
  "♍": {
    "latex": "\\virgo"
  },
  "♎": {
    "latex": "\\libra"
  },
  "♏": {
    "latex": "\\scorpio"
  },
  "♐": {
    "latex": "\\sagittarius"
  },
  "♑": {
    "latex": "\\capricornus"
  },
  "♒": {
    "latex": "\\aquarius"
  },
  "♓": {
    "latex": "\\pisces"
  },
  "♠": {
    "latex": "\\ding{171}"
  },
  "♢": {
    "latex": "\\diamond",
    "math": true
  },
  "♣": {
    "latex": "\\ding{168}"
  },
  "♥": {
    "latex": "\\ding{170}"
  },
  "♦": {
    "latex": "\\ding{169}"
  },
  "♩": {
    "latex": "\\quarternote"
  },
  "♪": {
    "latex": "\\eighthnote"
  },
  "♭": {
    "latex": "\\flat",
    "math": true
  },
  "♮": {
    "latex": "\\natural",
    "math": true
  },
  "♯": {
    "latex": "\\sharp",
    "math": true
  },
  "✁": {
    "latex": "\\ding{33}"
  },
  "✂": {
    "latex": "\\ding{34}"
  },
  "✃": {
    "latex": "\\ding{35}"
  },
  "✄": {
    "latex": "\\ding{36}"
  },
  "✆": {
    "latex": "\\ding{38}"
  },
  "✇": {
    "latex": "\\ding{39}"
  },
  "✈": {
    "latex": "\\ding{40}"
  },
  "✉": {
    "latex": "\\ding{41}"
  },
  "✌": {
    "latex": "\\ding{44}"
  },
  "✍": {
    "latex": "\\ding{45}"
  },
  "✎": {
    "latex": "\\ding{46}"
  },
  "✏": {
    "latex": "\\ding{47}"
  },
  "✐": {
    "latex": "\\ding{48}"
  },
  "✑": {
    "latex": "\\ding{49}"
  },
  "✒": {
    "latex": "\\ding{50}"
  },
  "✓": {
    "latex": "\\ding{51}"
  },
  "✔": {
    "latex": "\\ding{52}"
  },
  "✕": {
    "latex": "\\ding{53}"
  },
  "✖": {
    "latex": "\\ding{54}"
  },
  "✗": {
    "latex": "\\ding{55}"
  },
  "✘": {
    "latex": "\\ding{56}"
  },
  "✙": {
    "latex": "\\ding{57}"
  },
  "✚": {
    "latex": "\\ding{58}"
  },
  "✛": {
    "latex": "\\ding{59}"
  },
  "✜": {
    "latex": "\\ding{60}"
  },
  "✝": {
    "latex": "\\ding{61}"
  },
  "✞": {
    "latex": "\\ding{62}"
  },
  "✟": {
    "latex": "\\ding{63}"
  },
  "✠": {
    "latex": "\\ding{64}"
  },
  "✡": {
    "latex": "\\ding{65}"
  },
  "✢": {
    "latex": "\\ding{66}"
  },
  "✣": {
    "latex": "\\ding{67}"
  },
  "✤": {
    "latex": "\\ding{68}"
  },
  "✥": {
    "latex": "\\ding{69}"
  },
  "✦": {
    "latex": "\\ding{70}"
  },
  "✧": {
    "latex": "\\ding{71}"
  },
  "✩": {
    "latex": "\\ding{73}"
  },
  "✪": {
    "latex": "\\ding{74}"
  },
  "✫": {
    "latex": "\\ding{75}"
  },
  "✬": {
    "latex": "\\ding{76}"
  },
  "✭": {
    "latex": "\\ding{77}"
  },
  "✮": {
    "latex": "\\ding{78}"
  },
  "✯": {
    "latex": "\\ding{79}"
  },
  "✰": {
    "latex": "\\ding{80}"
  },
  "✱": {
    "latex": "\\ding{81}"
  },
  "✲": {
    "latex": "\\ding{82}"
  },
  "✳": {
    "latex": "\\ding{83}"
  },
  "✴": {
    "latex": "\\ding{84}"
  },
  "✵": {
    "latex": "\\ding{85}"
  },
  "✶": {
    "latex": "\\ding{86}"
  },
  "✷": {
    "latex": "\\ding{87}"
  },
  "✸": {
    "latex": "\\ding{88}"
  },
  "✹": {
    "latex": "\\ding{89}"
  },
  "✺": {
    "latex": "\\ding{90}"
  },
  "✻": {
    "latex": "\\ding{91}"
  },
  "✼": {
    "latex": "\\ding{92}"
  },
  "✽": {
    "latex": "\\ding{93}"
  },
  "✾": {
    "latex": "\\ding{94}"
  },
  "✿": {
    "latex": "\\ding{95}"
  },
  "❀": {
    "latex": "\\ding{96}"
  },
  "❁": {
    "latex": "\\ding{97}"
  },
  "❂": {
    "latex": "\\ding{98}"
  },
  "❃": {
    "latex": "\\ding{99}"
  },
  "❄": {
    "latex": "\\ding{100}"
  },
  "❅": {
    "latex": "\\ding{101}"
  },
  "❆": {
    "latex": "\\ding{102}"
  },
  "❇": {
    "latex": "\\ding{103}"
  },
  "❈": {
    "latex": "\\ding{104}"
  },
  "❉": {
    "latex": "\\ding{105}"
  },
  "❊": {
    "latex": "\\ding{106}"
  },
  "❋": {
    "latex": "\\ding{107}"
  },
  "❍": {
    "latex": "\\ding{109}"
  },
  "❏": {
    "latex": "\\ding{111}"
  },
  "❐": {
    "latex": "\\ding{112}"
  },
  "❑": {
    "latex": "\\ding{113}"
  },
  "❒": {
    "latex": "\\ding{114}"
  },
  "❖": {
    "latex": "\\ding{118}"
  },
  "❘": {
    "latex": "\\ding{120}"
  },
  "❙": {
    "latex": "\\ding{121}"
  },
  "❚": {
    "latex": "\\ding{122}"
  },
  "❛": {
    "latex": "\\ding{123}"
  },
  "❜": {
    "latex": "\\ding{124}"
  },
  "❝": {
    "latex": "\\ding{125}"
  },
  "❞": {
    "latex": "\\ding{126}"
  },
  "❡": {
    "latex": "\\ding{161}"
  },
  "❢": {
    "latex": "\\ding{162}"
  },
  "❣": {
    "latex": "\\ding{163}"
  },
  "❤": {
    "latex": "\\ding{164}"
  },
  "❥": {
    "latex": "\\ding{165}"
  },
  "❦": {
    "latex": "\\ding{166}"
  },
  "❧": {
    "latex": "\\ding{167}"
  },
  "❶": {
    "latex": "\\ding{182}"
  },
  "❷": {
    "latex": "\\ding{183}"
  },
  "❸": {
    "latex": "\\ding{184}"
  },
  "❹": {
    "latex": "\\ding{185}"
  },
  "❺": {
    "latex": "\\ding{186}"
  },
  "❻": {
    "latex": "\\ding{187}"
  },
  "❼": {
    "latex": "\\ding{188}"
  },
  "❽": {
    "latex": "\\ding{189}"
  },
  "❾": {
    "latex": "\\ding{190}"
  },
  "❿": {
    "latex": "\\ding{191}"
  },
  "➀": {
    "latex": "\\ding{192}"
  },
  "➁": {
    "latex": "\\ding{193}"
  },
  "➂": {
    "latex": "\\ding{194}"
  },
  "➃": {
    "latex": "\\ding{195}"
  },
  "➄": {
    "latex": "\\ding{196}"
  },
  "➅": {
    "latex": "\\ding{197}"
  },
  "➆": {
    "latex": "\\ding{198}"
  },
  "➇": {
    "latex": "\\ding{199}"
  },
  "➈": {
    "latex": "\\ding{200}"
  },
  "➉": {
    "latex": "\\ding{201}"
  },
  "➊": {
    "latex": "\\ding{202}"
  },
  "➋": {
    "latex": "\\ding{203}"
  },
  "➌": {
    "latex": "\\ding{204}"
  },
  "➍": {
    "latex": "\\ding{205}"
  },
  "➎": {
    "latex": "\\ding{206}"
  },
  "➏": {
    "latex": "\\ding{207}"
  },
  "➐": {
    "latex": "\\ding{208}"
  },
  "➑": {
    "latex": "\\ding{209}"
  },
  "➒": {
    "latex": "\\ding{210}"
  },
  "➓": {
    "latex": "\\ding{211}"
  },
  "➔": {
    "latex": "\\ding{212}"
  },
  "➘": {
    "latex": "\\ding{216}"
  },
  "➙": {
    "latex": "\\ding{217}"
  },
  "➚": {
    "latex": "\\ding{218}"
  },
  "➛": {
    "latex": "\\ding{219}"
  },
  "➜": {
    "latex": "\\ding{220}"
  },
  "➝": {
    "latex": "\\ding{221}"
  },
  "➞": {
    "latex": "\\ding{222}"
  },
  "➟": {
    "latex": "\\ding{223}"
  },
  "➠": {
    "latex": "\\ding{224}"
  },
  "➡": {
    "latex": "\\ding{225}"
  },
  "➢": {
    "latex": "\\ding{226}"
  },
  "➣": {
    "latex": "\\ding{227}"
  },
  "➤": {
    "latex": "\\ding{228}"
  },
  "➥": {
    "latex": "\\ding{229}"
  },
  "➦": {
    "latex": "\\ding{230}"
  },
  "➧": {
    "latex": "\\ding{231}"
  },
  "➨": {
    "latex": "\\ding{232}"
  },
  "➩": {
    "latex": "\\ding{233}"
  },
  "➪": {
    "latex": "\\ding{234}"
  },
  "➫": {
    "latex": "\\ding{235}"
  },
  "➬": {
    "latex": "\\ding{236}"
  },
  "➭": {
    "latex": "\\ding{237}"
  },
  "➮": {
    "latex": "\\ding{238}"
  },
  "➯": {
    "latex": "\\ding{239}"
  },
  "➱": {
    "latex": "\\ding{241}"
  },
  "➲": {
    "latex": "\\ding{242}"
  },
  "➳": {
    "latex": "\\ding{243}"
  },
  "➴": {
    "latex": "\\ding{244}"
  },
  "➵": {
    "latex": "\\ding{245}"
  },
  "➶": {
    "latex": "\\ding{246}"
  },
  "➷": {
    "latex": "\\ding{247}"
  },
  "➸": {
    "latex": "\\ding{248}"
  },
  "➹": {
    "latex": "\\ding{249}"
  },
  "➺": {
    "latex": "\\ding{250}"
  },
  "➻": {
    "latex": "\\ding{251}"
  },
  "➼": {
    "latex": "\\ding{252}"
  },
  "➽": {
    "latex": "\\ding{253}"
  },
  "➾": {
    "latex": "\\ding{254}"
  },
  "⟵": {
    "latex": "\\longleftarrow",
    "math": true
  },
  "⟶": {
    "latex": "\\longrightarrow",
    "math": true
  },
  "⟷": {
    "latex": "\\longleftrightarrow",
    "math": true
  },
  "⟸": {
    "latex": "\\Longleftarrow",
    "math": true
  },
  "⟹": {
    "latex": "\\Longrightarrow",
    "math": true
  },
  "⟺": {
    "latex": "\\Longleftrightarrow",
    "math": true
  },
  "⟼": {
    "latex": "\\longmapsto",
    "math": true
  },
  "⟿": {
    "latex": "\\sim\\joinrel\\leadsto",
    "math": true
  },
  "⤅": {
    "latex": "\\ElsevierGlyph{E212}",
    "math": true
  },
  "⤒": {
    "latex": "\\UpArrowBar",
    "math": true
  },
  "⤓": {
    "latex": "\\DownArrowBar",
    "math": true
  },
  "⤣": {
    "latex": "\\ElsevierGlyph{E20C}",
    "math": true
  },
  "⤤": {
    "latex": "\\ElsevierGlyph{E20D}",
    "math": true
  },
  "⤥": {
    "latex": "\\ElsevierGlyph{E20B}",
    "math": true
  },
  "⤦": {
    "latex": "\\ElsevierGlyph{E20A}",
    "math": true
  },
  "⤧": {
    "latex": "\\ElsevierGlyph{E211}",
    "math": true
  },
  "⤨": {
    "latex": "\\ElsevierGlyph{E20E}",
    "math": true
  },
  "⤩": {
    "latex": "\\ElsevierGlyph{E20F}",
    "math": true
  },
  "⤪": {
    "latex": "\\ElsevierGlyph{E210}",
    "math": true
  },
  "⤳": {
    "latex": "\\ElsevierGlyph{E21C}",
    "math": true
  },
  "⤳̸": {
    "latex": "\\ElsevierGlyph{E21D}",
    "math": true
  },
  "⤶": {
    "latex": "\\ElsevierGlyph{E21A}",
    "math": true
  },
  "⤷": {
    "latex": "\\ElsevierGlyph{E219}",
    "math": true
  },
  "⥀": {
    "latex": "\\Elolarr",
    "math": true
  },
  "⥁": {
    "latex": "\\Elorarr",
    "math": true
  },
  "⥂": {
    "latex": "\\ElzRlarr",
    "math": true
  },
  "⥄": {
    "latex": "\\ElzrLarr",
    "math": true
  },
  "⥇": {
    "latex": "\\Elzrarrx",
    "math": true
  },
  "⥎": {
    "latex": "\\LeftRightVector",
    "math": true
  },
  "⥏": {
    "latex": "\\RightUpDownVector",
    "math": true
  },
  "⥐": {
    "latex": "\\DownLeftRightVector",
    "math": true
  },
  "⥑": {
    "latex": "\\LeftUpDownVector",
    "math": true
  },
  "⥒": {
    "latex": "\\LeftVectorBar",
    "math": true
  },
  "⥓": {
    "latex": "\\RightVectorBar",
    "math": true
  },
  "⥔": {
    "latex": "\\RightUpVectorBar",
    "math": true
  },
  "⥕": {
    "latex": "\\RightDownVectorBar",
    "math": true
  },
  "⥖": {
    "latex": "\\DownLeftVectorBar",
    "math": true
  },
  "⥗": {
    "latex": "\\DownRightVectorBar",
    "math": true
  },
  "⥘": {
    "latex": "\\LeftUpVectorBar",
    "math": true
  },
  "⥙": {
    "latex": "\\LeftDownVectorBar",
    "math": true
  },
  "⥚": {
    "latex": "\\LeftTeeVector",
    "math": true
  },
  "⥛": {
    "latex": "\\RightTeeVector",
    "math": true
  },
  "⥜": {
    "latex": "\\RightUpTeeVector",
    "math": true
  },
  "⥝": {
    "latex": "\\RightDownTeeVector",
    "math": true
  },
  "⥞": {
    "latex": "\\DownLeftTeeVector",
    "math": true
  },
  "⥟": {
    "latex": "\\DownRightTeeVector",
    "math": true
  },
  "⥠": {
    "latex": "\\LeftUpTeeVector",
    "math": true
  },
  "⥡": {
    "latex": "\\LeftDownTeeVector",
    "math": true
  },
  "⥮": {
    "latex": "\\UpEquilibrium",
    "math": true
  },
  "⥯": {
    "latex": "\\ReverseUpEquilibrium",
    "math": true
  },
  "⥰": {
    "latex": "\\RoundImplies",
    "math": true
  },
  "⥼": {
    "latex": "\\ElsevierGlyph{E214}",
    "math": true
  },
  "⥽": {
    "latex": "\\ElsevierGlyph{E215}",
    "math": true
  },
  "⦀": {
    "latex": "\\Elztfnc",
    "math": true
  },
  "⦅": {
    "latex": "\\ElsevierGlyph{3018}",
    "math": true
  },
  "⦆": {
    "latex": "\\Elroang",
    "math": true
  },
  "⦓": {
    "latex": "<\\kern-0.58em(",
    "math": true
  },
  "⦔": {
    "latex": "\\ElsevierGlyph{E291}",
    "math": true
  },
  "⦙": {
    "latex": "\\Elzddfnc",
    "math": true
  },
  "⦜": {
    "latex": "\\Angle",
    "math": true
  },
  "⦠": {
    "latex": "\\Elzlpargt",
    "math": true
  },
  "⦵": {
    "latex": "\\ElsevierGlyph{E260}",
    "math": true
  },
  "⦶": {
    "latex": "\\ElsevierGlyph{E61B}",
    "math": true
  },
  "⧊": {
    "latex": "\\ElzLap",
    "math": true
  },
  "⧋": {
    "latex": "\\Elzdefas",
    "math": true
  },
  "⧏": {
    "latex": "\\LeftTriangleBar",
    "math": true
  },
  "⧏̸": {
    "latex": "\\NotLeftTriangleBar",
    "math": true
  },
  "⧐": {
    "latex": "\\RightTriangleBar",
    "math": true
  },
  "⧐̸": {
    "latex": "\\NotRightTriangleBar",
    "math": true
  },
  "⧜": {
    "latex": "\\ElsevierGlyph{E372}",
    "math": true
  },
  "⧫": {
    "latex": "\\blacklozenge",
    "math": true
  },
  "⧴": {
    "latex": "\\RuleDelayed",
    "math": true
  },
  "⨄": {
    "latex": "\\Elxuplus",
    "math": true
  },
  "⨅": {
    "latex": "\\ElzThr",
    "math": true
  },
  "⨆": {
    "latex": "\\Elxsqcup",
    "math": true
  },
  "⨇": {
    "latex": "\\ElzInf",
    "math": true
  },
  "⨈": {
    "latex": "\\ElzSup",
    "math": true
  },
  "⨍": {
    "latex": "\\ElzCint",
    "math": true
  },
  "⨏": {
    "latex": "\\clockoint",
    "math": true
  },
  "⨐": {
    "latex": "\\ElsevierGlyph{E395}",
    "math": true
  },
  "⨖": {
    "latex": "\\sqrint",
    "math": true
  },
  "⨥": {
    "latex": "\\ElsevierGlyph{E25A}",
    "math": true
  },
  "⨪": {
    "latex": "\\ElsevierGlyph{E25B}",
    "math": true
  },
  "⨭": {
    "latex": "\\ElsevierGlyph{E25C}",
    "math": true
  },
  "⨮": {
    "latex": "\\ElsevierGlyph{E25D}",
    "math": true
  },
  "⨯": {
    "latex": "\\ElzTimes",
    "math": true
  },
  "⨴": {
    "latex": "\\ElsevierGlyph{E25E}",
    "math": true
  },
  "⨵": {
    "latex": "\\ElsevierGlyph{E25E}",
    "math": true
  },
  "⨼": {
    "latex": "\\ElsevierGlyph{E259}",
    "math": true
  },
  "⨿": {
    "latex": "\\amalg",
    "math": true
  },
  "⩓": {
    "latex": "\\ElzAnd",
    "math": true
  },
  "⩔": {
    "latex": "\\ElzOr",
    "math": true
  },
  "⩕": {
    "latex": "\\ElsevierGlyph{E36E}",
    "math": true
  },
  "⩖": {
    "latex": "\\ElOr",
    "math": true
  },
  "⩞": {
    "latex": "\\perspcorrespond",
    "math": true
  },
  "⩟": {
    "latex": "\\Elzminhat",
    "math": true
  },
  "⩣": {
    "latex": "\\ElsevierGlyph{225A}",
    "math": true
  },
  "⩮": {
    "latex": "\\stackrel{*}{=}",
    "math": true
  },
  "⩵": {
    "latex": "\\Equal",
    "math": true
  },
  "⩽": {
    "latex": "\\leqslant",
    "math": true
  },
  "⩽̸": {
    "latex": "\\nleqslant",
    "math": true
  },
  "⩾": {
    "latex": "\\geqslant",
    "math": true
  },
  "⩾̸": {
    "latex": "\\ngeqslant",
    "math": true
  },
  "⪅": {
    "latex": "\\lessapprox",
    "math": true
  },
  "⪆": {
    "latex": "\\gtrapprox",
    "math": true
  },
  "⪇": {
    "latex": "\\lneq",
    "math": true
  },
  "⪈": {
    "latex": "\\gneq",
    "math": true
  },
  "⪉": {
    "latex": "\\lnapprox",
    "math": true
  },
  "⪊": {
    "latex": "\\gnapprox",
    "math": true
  },
  "⪋": {
    "latex": "\\lesseqqgtr",
    "math": true
  },
  "⪌": {
    "latex": "\\gtreqqless",
    "math": true
  },
  "⪕": {
    "latex": "\\eqslantless",
    "math": true
  },
  "⪖": {
    "latex": "\\eqslantgtr",
    "math": true
  },
  "⪝": {
    "latex": "\\Pisymbol{ppi020}{117}",
    "math": true
  },
  "⪞": {
    "latex": "\\Pisymbol{ppi020}{105}",
    "math": true
  },
  "⪡": {
    "latex": "\\NestedLessLess",
    "math": true
  },
  "⪡̸": {
    "latex": "\\NotNestedLessLess",
    "math": true
  },
  "⪢": {
    "latex": "\\NestedGreaterGreater",
    "math": true
  },
  "⪢̸": {
    "latex": "\\NotNestedGreaterGreater",
    "math": true
  },
  "⪯": {
    "latex": "\\preceq",
    "math": true
  },
  "⪯̸": {
    "latex": "\\not\\preceq",
    "math": true
  },
  "⪰": {
    "latex": "\\succeq",
    "math": true
  },
  "⪰̸": {
    "latex": "\\not\\succeq",
    "math": true
  },
  "⪵": {
    "latex": "\\precneqq",
    "math": true
  },
  "⪶": {
    "latex": "\\succneqq",
    "math": true
  },
  "⪷": {
    "latex": "\\precapprox",
    "math": true
  },
  "⪸": {
    "latex": "\\succapprox",
    "math": true
  },
  "⪹": {
    "latex": "\\precnapprox",
    "math": true
  },
  "⪺": {
    "latex": "\\succnapprox",
    "math": true
  },
  "⫅": {
    "latex": "\\subseteqq",
    "math": true
  },
  "⫅̸": {
    "latex": "\\nsubseteqq",
    "math": true
  },
  "⫆": {
    "latex": "\\supseteqq",
    "math": true
  },
  "⫆̸": {
    "latex": "\\nsupseteqq",
    "math": true
  },
  "⫋": {
    "latex": "\\subsetneqq",
    "math": true
  },
  "⫌": {
    "latex": "\\supsetneqq",
    "math": true
  },
  "⫫": {
    "latex": "\\ElsevierGlyph{E30D}",
    "math": true
  },
  "⫶": {
    "latex": "\\Elztdcol",
    "math": true
  },
  "⫽": {
    "latex": "{{/}\\!\\!{/}}",
    "math": true
  },
  "⫽⃥": {
    "latex": "{\\rlap{\\textbackslash}{{/}\\!\\!{/}}}",
    "math": true
  },
  "《": {
    "latex": "\\ElsevierGlyph{300A}",
    "math": true
  },
  "》": {
    "latex": "\\ElsevierGlyph{300B}",
    "math": true
  },
  "〘": {
    "latex": "\\ElsevierGlyph{3018}",
    "math": true
  },
  "〙": {
    "latex": "\\ElsevierGlyph{3019}",
    "math": true
  },
  "〚": {
    "latex": "\\openbracketleft",
    "math": true
  },
  "〛": {
    "latex": "\\openbracketright",
    "math": true
  },
  "ﬀ": {
    "latex": "ff"
  },
  "ﬁ": {
    "latex": "fi"
  },
  "ﬂ": {
    "latex": "fl"
  },
  "ﬃ": {
    "latex": "ffi"
  },
  "ﬄ": {
    "latex": "ffl"
  },
  "𝐀": {
    "latex": "\\mathbf{A}",
    "math": true
  },
  "𝐁": {
    "latex": "\\mathbf{B}",
    "math": true
  },
  "𝐂": {
    "latex": "\\mathbf{C}",
    "math": true
  },
  "𝐃": {
    "latex": "\\mathbf{D}",
    "math": true
  },
  "𝐄": {
    "latex": "\\mathbf{E}",
    "math": true
  },
  "𝐅": {
    "latex": "\\mathbf{F}",
    "math": true
  },
  "𝐆": {
    "latex": "\\mathbf{G}",
    "math": true
  },
  "𝐇": {
    "latex": "\\mathbf{H}",
    "math": true
  },
  "𝐈": {
    "latex": "\\mathbf{I}",
    "math": true
  },
  "𝐉": {
    "latex": "\\mathbf{J}",
    "math": true
  },
  "𝐊": {
    "latex": "\\mathbf{K}",
    "math": true
  },
  "𝐋": {
    "latex": "\\mathbf{L}",
    "math": true
  },
  "𝐌": {
    "latex": "\\mathbf{M}",
    "math": true
  },
  "𝐍": {
    "latex": "\\mathbf{N}",
    "math": true
  },
  "𝐎": {
    "latex": "\\mathbf{O}",
    "math": true
  },
  "𝐏": {
    "latex": "\\mathbf{P}",
    "math": true
  },
  "𝐐": {
    "latex": "\\mathbf{Q}",
    "math": true
  },
  "𝐑": {
    "latex": "\\mathbf{R}",
    "math": true
  },
  "𝐒": {
    "latex": "\\mathbf{S}",
    "math": true
  },
  "𝐓": {
    "latex": "\\mathbf{T}",
    "math": true
  },
  "𝐔": {
    "latex": "\\mathbf{U}",
    "math": true
  },
  "𝐕": {
    "latex": "\\mathbf{V}",
    "math": true
  },
  "𝐖": {
    "latex": "\\mathbf{W}",
    "math": true
  },
  "𝐗": {
    "latex": "\\mathbf{X}",
    "math": true
  },
  "𝐘": {
    "latex": "\\mathbf{Y}",
    "math": true
  },
  "𝐙": {
    "latex": "\\mathbf{Z}",
    "math": true
  },
  "𝐚": {
    "latex": "\\mathbf{a}",
    "math": true
  },
  "𝐛": {
    "latex": "\\mathbf{b}",
    "math": true
  },
  "𝐜": {
    "latex": "\\mathbf{c}",
    "math": true
  },
  "𝐝": {
    "latex": "\\mathbf{d}",
    "math": true
  },
  "𝐞": {
    "latex": "\\mathbf{e}",
    "math": true
  },
  "𝐟": {
    "latex": "\\mathbf{f}",
    "math": true
  },
  "𝐠": {
    "latex": "\\mathbf{g}",
    "math": true
  },
  "𝐡": {
    "latex": "\\mathbf{h}",
    "math": true
  },
  "𝐢": {
    "latex": "\\mathbf{i}",
    "math": true
  },
  "𝐣": {
    "latex": "\\mathbf{j}",
    "math": true
  },
  "𝐤": {
    "latex": "\\mathbf{k}",
    "math": true
  },
  "𝐥": {
    "latex": "\\mathbf{l}",
    "math": true
  },
  "𝐦": {
    "latex": "\\mathbf{m}",
    "math": true
  },
  "𝐧": {
    "latex": "\\mathbf{n}",
    "math": true
  },
  "𝐨": {
    "latex": "\\mathbf{o}",
    "math": true
  },
  "𝐩": {
    "latex": "\\mathbf{p}",
    "math": true
  },
  "𝐪": {
    "latex": "\\mathbf{q}",
    "math": true
  },
  "𝐫": {
    "latex": "\\mathbf{r}",
    "math": true
  },
  "𝐬": {
    "latex": "\\mathbf{s}",
    "math": true
  },
  "𝐭": {
    "latex": "\\mathbf{t}",
    "math": true
  },
  "𝐮": {
    "latex": "\\mathbf{u}",
    "math": true
  },
  "𝐯": {
    "latex": "\\mathbf{v}",
    "math": true
  },
  "𝐰": {
    "latex": "\\mathbf{w}",
    "math": true
  },
  "𝐱": {
    "latex": "\\mathbf{x}",
    "math": true
  },
  "𝐲": {
    "latex": "\\mathbf{y}",
    "math": true
  },
  "𝐳": {
    "latex": "\\mathbf{z}",
    "math": true
  },
  "𝐴": {
    "latex": "\\mathsl{A}",
    "math": true
  },
  "𝐵": {
    "latex": "\\mathsl{B}",
    "math": true
  },
  "𝐶": {
    "latex": "\\mathsl{C}",
    "math": true
  },
  "𝐷": {
    "latex": "\\mathsl{D}",
    "math": true
  },
  "𝐸": {
    "latex": "\\mathsl{E}",
    "math": true
  },
  "𝐹": {
    "latex": "\\mathsl{F}",
    "math": true
  },
  "𝐺": {
    "latex": "\\mathsl{G}",
    "math": true
  },
  "𝐻": {
    "latex": "\\mathsl{H}",
    "math": true
  },
  "𝐼": {
    "latex": "\\mathsl{I}",
    "math": true
  },
  "𝐽": {
    "latex": "\\mathsl{J}",
    "math": true
  },
  "𝐾": {
    "latex": "\\mathsl{K}",
    "math": true
  },
  "𝐿": {
    "latex": "\\mathsl{L}",
    "math": true
  },
  "𝑀": {
    "latex": "\\mathsl{M}",
    "math": true
  },
  "𝑁": {
    "latex": "\\mathsl{N}",
    "math": true
  },
  "𝑂": {
    "latex": "\\mathsl{O}",
    "math": true
  },
  "𝑃": {
    "latex": "\\mathsl{P}",
    "math": true
  },
  "𝑄": {
    "latex": "\\mathsl{Q}",
    "math": true
  },
  "𝑅": {
    "latex": "\\mathsl{R}",
    "math": true
  },
  "𝑆": {
    "latex": "\\mathsl{S}",
    "math": true
  },
  "𝑇": {
    "latex": "\\mathsl{T}",
    "math": true
  },
  "𝑈": {
    "latex": "\\mathsl{U}",
    "math": true
  },
  "𝑉": {
    "latex": "\\mathsl{V}",
    "math": true
  },
  "𝑊": {
    "latex": "\\mathsl{W}",
    "math": true
  },
  "𝑋": {
    "latex": "\\mathsl{X}",
    "math": true
  },
  "𝑌": {
    "latex": "\\mathsl{Y}",
    "math": true
  },
  "𝑍": {
    "latex": "\\mathsl{Z}",
    "math": true
  },
  "𝑎": {
    "latex": "\\mathsl{a}",
    "math": true
  },
  "𝑏": {
    "latex": "\\mathsl{b}",
    "math": true
  },
  "𝑐": {
    "latex": "\\mathsl{c}",
    "math": true
  },
  "𝑑": {
    "latex": "\\mathsl{d}",
    "math": true
  },
  "𝑒": {
    "latex": "\\mathsl{e}",
    "math": true
  },
  "𝑓": {
    "latex": "\\mathsl{f}",
    "math": true
  },
  "𝑔": {
    "latex": "\\mathsl{g}",
    "math": true
  },
  "𝑖": {
    "latex": "\\mathsl{i}",
    "math": true
  },
  "𝑗": {
    "latex": "\\mathsl{j}",
    "math": true
  },
  "𝑘": {
    "latex": "\\mathsl{k}",
    "math": true
  },
  "𝑙": {
    "latex": "\\mathsl{l}",
    "math": true
  },
  "𝑚": {
    "latex": "\\mathsl{m}",
    "math": true
  },
  "𝑛": {
    "latex": "\\mathsl{n}",
    "math": true
  },
  "𝑜": {
    "latex": "\\mathsl{o}",
    "math": true
  },
  "𝑝": {
    "latex": "\\mathsl{p}",
    "math": true
  },
  "𝑞": {
    "latex": "\\mathsl{q}",
    "math": true
  },
  "𝑟": {
    "latex": "\\mathsl{r}",
    "math": true
  },
  "𝑠": {
    "latex": "\\mathsl{s}",
    "math": true
  },
  "𝑡": {
    "latex": "\\mathsl{t}",
    "math": true
  },
  "𝑢": {
    "latex": "\\mathsl{u}",
    "math": true
  },
  "𝑣": {
    "latex": "\\mathsl{v}",
    "math": true
  },
  "𝑤": {
    "latex": "\\mathsl{w}",
    "math": true
  },
  "𝑥": {
    "latex": "\\mathsl{x}",
    "math": true
  },
  "𝑦": {
    "latex": "\\mathsl{y}",
    "math": true
  },
  "𝑧": {
    "latex": "\\mathsl{z}",
    "math": true
  },
  "𝑨": {
    "latex": "\\mathbit{A}",
    "math": true
  },
  "𝑩": {
    "latex": "\\mathbit{B}",
    "math": true
  },
  "𝑪": {
    "latex": "\\mathbit{C}",
    "math": true
  },
  "𝑫": {
    "latex": "\\mathbit{D}",
    "math": true
  },
  "𝑬": {
    "latex": "\\mathbit{E}",
    "math": true
  },
  "𝑭": {
    "latex": "\\mathbit{F}",
    "math": true
  },
  "𝑮": {
    "latex": "\\mathbit{G}",
    "math": true
  },
  "𝑯": {
    "latex": "\\mathbit{H}",
    "math": true
  },
  "𝑰": {
    "latex": "\\mathbit{I}",
    "math": true
  },
  "𝑱": {
    "latex": "\\mathbit{J}",
    "math": true
  },
  "𝑲": {
    "latex": "\\mathbit{K}",
    "math": true
  },
  "𝑳": {
    "latex": "\\mathbit{L}",
    "math": true
  },
  "𝑴": {
    "latex": "\\mathbit{M}",
    "math": true
  },
  "𝑵": {
    "latex": "\\mathbit{N}",
    "math": true
  },
  "𝑶": {
    "latex": "\\mathbit{O}",
    "math": true
  },
  "𝑷": {
    "latex": "\\mathbit{P}",
    "math": true
  },
  "𝑸": {
    "latex": "\\mathbit{Q}",
    "math": true
  },
  "𝑹": {
    "latex": "\\mathbit{R}",
    "math": true
  },
  "𝑺": {
    "latex": "\\mathbit{S}",
    "math": true
  },
  "𝑻": {
    "latex": "\\mathbit{T}",
    "math": true
  },
  "𝑼": {
    "latex": "\\mathbit{U}",
    "math": true
  },
  "𝑽": {
    "latex": "\\mathbit{V}",
    "math": true
  },
  "𝑾": {
    "latex": "\\mathbit{W}",
    "math": true
  },
  "𝑿": {
    "latex": "\\mathbit{X}",
    "math": true
  },
  "𝒀": {
    "latex": "\\mathbit{Y}",
    "math": true
  },
  "𝒁": {
    "latex": "\\mathbit{Z}",
    "math": true
  },
  "𝒂": {
    "latex": "\\mathbit{a}",
    "math": true
  },
  "𝒃": {
    "latex": "\\mathbit{b}",
    "math": true
  },
  "𝒄": {
    "latex": "\\mathbit{c}",
    "math": true
  },
  "𝒅": {
    "latex": "\\mathbit{d}",
    "math": true
  },
  "𝒆": {
    "latex": "\\mathbit{e}",
    "math": true
  },
  "𝒇": {
    "latex": "\\mathbit{f}",
    "math": true
  },
  "𝒈": {
    "latex": "\\mathbit{g}",
    "math": true
  },
  "𝒉": {
    "latex": "\\mathbit{h}",
    "math": true
  },
  "𝒊": {
    "latex": "\\mathbit{i}",
    "math": true
  },
  "𝒋": {
    "latex": "\\mathbit{j}",
    "math": true
  },
  "𝒌": {
    "latex": "\\mathbit{k}",
    "math": true
  },
  "𝒍": {
    "latex": "\\mathbit{l}",
    "math": true
  },
  "𝒎": {
    "latex": "\\mathbit{m}",
    "math": true
  },
  "𝒏": {
    "latex": "\\mathbit{n}",
    "math": true
  },
  "𝒐": {
    "latex": "\\mathbit{o}",
    "math": true
  },
  "𝒑": {
    "latex": "\\mathbit{p}",
    "math": true
  },
  "𝒒": {
    "latex": "\\mathbit{q}",
    "math": true
  },
  "𝒓": {
    "latex": "\\mathbit{r}",
    "math": true
  },
  "𝒔": {
    "latex": "\\mathbit{s}",
    "math": true
  },
  "𝒕": {
    "latex": "\\mathbit{t}",
    "math": true
  },
  "𝒖": {
    "latex": "\\mathbit{u}",
    "math": true
  },
  "𝒗": {
    "latex": "\\mathbit{v}",
    "math": true
  },
  "𝒘": {
    "latex": "\\mathbit{w}",
    "math": true
  },
  "𝒙": {
    "latex": "\\mathbit{x}",
    "math": true
  },
  "𝒚": {
    "latex": "\\mathbit{y}",
    "math": true
  },
  "𝒛": {
    "latex": "\\mathbit{z}",
    "math": true
  },
  "𝒜": {
    "latex": "\\mathscr{A}",
    "math": true
  },
  "𝒞": {
    "latex": "\\mathscr{C}",
    "math": true
  },
  "𝒟": {
    "latex": "\\mathscr{D}",
    "math": true
  },
  "𝒢": {
    "latex": "\\mathscr{G}",
    "math": true
  },
  "𝒥": {
    "latex": "\\mathscr{J}",
    "math": true
  },
  "𝒦": {
    "latex": "\\mathscr{K}",
    "math": true
  },
  "𝒩": {
    "latex": "\\mathscr{N}",
    "math": true
  },
  "𝒪": {
    "latex": "\\mathscr{O}",
    "math": true
  },
  "𝒫": {
    "latex": "\\mathscr{P}",
    "math": true
  },
  "𝒬": {
    "latex": "\\mathscr{Q}",
    "math": true
  },
  "𝒮": {
    "latex": "\\mathscr{S}",
    "math": true
  },
  "𝒯": {
    "latex": "\\mathscr{T}",
    "math": true
  },
  "𝒰": {
    "latex": "\\mathscr{U}",
    "math": true
  },
  "𝒱": {
    "latex": "\\mathscr{V}",
    "math": true
  },
  "𝒲": {
    "latex": "\\mathscr{W}",
    "math": true
  },
  "𝒳": {
    "latex": "\\mathscr{X}",
    "math": true
  },
  "𝒴": {
    "latex": "\\mathscr{Y}",
    "math": true
  },
  "𝒵": {
    "latex": "\\mathscr{Z}",
    "math": true
  },
  "𝒶": {
    "latex": "\\mathscr{a}",
    "math": true
  },
  "𝒷": {
    "latex": "\\mathscr{b}",
    "math": true
  },
  "𝒸": {
    "latex": "\\mathscr{c}",
    "math": true
  },
  "𝒹": {
    "latex": "\\mathscr{d}",
    "math": true
  },
  "𝒻": {
    "latex": "\\mathscr{f}",
    "math": true
  },
  "𝒽": {
    "latex": "\\mathscr{h}",
    "math": true
  },
  "𝒾": {
    "latex": "\\mathscr{i}",
    "math": true
  },
  "𝒿": {
    "latex": "\\mathscr{j}",
    "math": true
  },
  "𝓀": {
    "latex": "\\mathscr{k}",
    "math": true
  },
  "𝓁": {
    "latex": "\\mathscr{l}",
    "math": true
  },
  "𝓂": {
    "latex": "\\mathscr{m}",
    "math": true
  },
  "𝓃": {
    "latex": "\\mathscr{n}",
    "math": true
  },
  "𝓅": {
    "latex": "\\mathscr{p}",
    "math": true
  },
  "𝓆": {
    "latex": "\\mathscr{q}",
    "math": true
  },
  "𝓇": {
    "latex": "\\mathscr{r}",
    "math": true
  },
  "𝓈": {
    "latex": "\\mathscr{s}",
    "math": true
  },
  "𝓉": {
    "latex": "\\mathscr{t}",
    "math": true
  },
  "𝓊": {
    "latex": "\\mathscr{u}",
    "math": true
  },
  "𝓋": {
    "latex": "\\mathscr{v}",
    "math": true
  },
  "𝓌": {
    "latex": "\\mathscr{w}",
    "math": true
  },
  "𝓍": {
    "latex": "\\mathscr{x}",
    "math": true
  },
  "𝓎": {
    "latex": "\\mathscr{y}",
    "math": true
  },
  "𝓏": {
    "latex": "\\mathscr{z}",
    "math": true
  },
  "𝓐": {
    "latex": "\\mathmit{A}",
    "math": true
  },
  "𝓑": {
    "latex": "\\mathmit{B}",
    "math": true
  },
  "𝓒": {
    "latex": "\\mathmit{C}",
    "math": true
  },
  "𝓓": {
    "latex": "\\mathmit{D}",
    "math": true
  },
  "𝓔": {
    "latex": "\\mathmit{E}",
    "math": true
  },
  "𝓕": {
    "latex": "\\mathmit{F}",
    "math": true
  },
  "𝓖": {
    "latex": "\\mathmit{G}",
    "math": true
  },
  "𝓗": {
    "latex": "\\mathmit{H}",
    "math": true
  },
  "𝓘": {
    "latex": "\\mathmit{I}",
    "math": true
  },
  "𝓙": {
    "latex": "\\mathmit{J}",
    "math": true
  },
  "𝓚": {
    "latex": "\\mathmit{K}",
    "math": true
  },
  "𝓛": {
    "latex": "\\mathmit{L}",
    "math": true
  },
  "𝓜": {
    "latex": "\\mathmit{M}",
    "math": true
  },
  "𝓝": {
    "latex": "\\mathmit{N}",
    "math": true
  },
  "𝓞": {
    "latex": "\\mathmit{O}",
    "math": true
  },
  "𝓟": {
    "latex": "\\mathmit{P}",
    "math": true
  },
  "𝓠": {
    "latex": "\\mathmit{Q}",
    "math": true
  },
  "𝓡": {
    "latex": "\\mathmit{R}",
    "math": true
  },
  "𝓢": {
    "latex": "\\mathmit{S}",
    "math": true
  },
  "𝓣": {
    "latex": "\\mathmit{T}",
    "math": true
  },
  "𝓤": {
    "latex": "\\mathmit{U}",
    "math": true
  },
  "𝓥": {
    "latex": "\\mathmit{V}",
    "math": true
  },
  "𝓦": {
    "latex": "\\mathmit{W}",
    "math": true
  },
  "𝓧": {
    "latex": "\\mathmit{X}",
    "math": true
  },
  "𝓨": {
    "latex": "\\mathmit{Y}",
    "math": true
  },
  "𝓩": {
    "latex": "\\mathmit{Z}",
    "math": true
  },
  "𝓪": {
    "latex": "\\mathmit{a}",
    "math": true
  },
  "𝓫": {
    "latex": "\\mathmit{b}",
    "math": true
  },
  "𝓬": {
    "latex": "\\mathmit{c}",
    "math": true
  },
  "𝓭": {
    "latex": "\\mathmit{d}",
    "math": true
  },
  "𝓮": {
    "latex": "\\mathmit{e}",
    "math": true
  },
  "𝓯": {
    "latex": "\\mathmit{f}",
    "math": true
  },
  "𝓰": {
    "latex": "\\mathmit{g}",
    "math": true
  },
  "𝓱": {
    "latex": "\\mathmit{h}",
    "math": true
  },
  "𝓲": {
    "latex": "\\mathmit{i}",
    "math": true
  },
  "𝓳": {
    "latex": "\\mathmit{j}",
    "math": true
  },
  "𝓴": {
    "latex": "\\mathmit{k}",
    "math": true
  },
  "𝓵": {
    "latex": "\\mathmit{l}",
    "math": true
  },
  "𝓶": {
    "latex": "\\mathmit{m}",
    "math": true
  },
  "𝓷": {
    "latex": "\\mathmit{n}",
    "math": true
  },
  "𝓸": {
    "latex": "\\mathmit{o}",
    "math": true
  },
  "𝓹": {
    "latex": "\\mathmit{p}",
    "math": true
  },
  "𝓺": {
    "latex": "\\mathmit{q}",
    "math": true
  },
  "𝓻": {
    "latex": "\\mathmit{r}",
    "math": true
  },
  "𝓼": {
    "latex": "\\mathmit{s}",
    "math": true
  },
  "𝓽": {
    "latex": "\\mathmit{t}",
    "math": true
  },
  "𝓾": {
    "latex": "\\mathmit{u}",
    "math": true
  },
  "𝓿": {
    "latex": "\\mathmit{v}",
    "math": true
  },
  "𝔀": {
    "latex": "\\mathmit{w}",
    "math": true
  },
  "𝔁": {
    "latex": "\\mathmit{x}",
    "math": true
  },
  "𝔂": {
    "latex": "\\mathmit{y}",
    "math": true
  },
  "𝔃": {
    "latex": "\\mathmit{z}",
    "math": true
  },
  "𝔄": {
    "latex": "\\mathfrak{A}",
    "math": true
  },
  "𝔅": {
    "latex": "\\mathfrak{B}",
    "math": true
  },
  "𝔇": {
    "latex": "\\mathfrak{D}",
    "math": true
  },
  "𝔈": {
    "latex": "\\mathfrak{E}",
    "math": true
  },
  "𝔉": {
    "latex": "\\mathfrak{F}",
    "math": true
  },
  "𝔊": {
    "latex": "\\mathfrak{G}",
    "math": true
  },
  "𝔍": {
    "latex": "\\mathfrak{J}",
    "math": true
  },
  "𝔎": {
    "latex": "\\mathfrak{K}",
    "math": true
  },
  "𝔏": {
    "latex": "\\mathfrak{L}",
    "math": true
  },
  "𝔐": {
    "latex": "\\mathfrak{M}",
    "math": true
  },
  "𝔑": {
    "latex": "\\mathfrak{N}",
    "math": true
  },
  "𝔒": {
    "latex": "\\mathfrak{O}",
    "math": true
  },
  "𝔓": {
    "latex": "\\mathfrak{P}",
    "math": true
  },
  "𝔔": {
    "latex": "\\mathfrak{Q}",
    "math": true
  },
  "𝔖": {
    "latex": "\\mathfrak{S}",
    "math": true
  },
  "𝔗": {
    "latex": "\\mathfrak{T}",
    "math": true
  },
  "𝔘": {
    "latex": "\\mathfrak{U}",
    "math": true
  },
  "𝔙": {
    "latex": "\\mathfrak{V}",
    "math": true
  },
  "𝔚": {
    "latex": "\\mathfrak{W}",
    "math": true
  },
  "𝔛": {
    "latex": "\\mathfrak{X}",
    "math": true
  },
  "𝔜": {
    "latex": "\\mathfrak{Y}",
    "math": true
  },
  "𝔞": {
    "latex": "\\mathfrak{a}",
    "math": true
  },
  "𝔟": {
    "latex": "\\mathfrak{b}",
    "math": true
  },
  "𝔠": {
    "latex": "\\mathfrak{c}",
    "math": true
  },
  "𝔡": {
    "latex": "\\mathfrak{d}",
    "math": true
  },
  "𝔢": {
    "latex": "\\mathfrak{e}",
    "math": true
  },
  "𝔣": {
    "latex": "\\mathfrak{f}",
    "math": true
  },
  "𝔤": {
    "latex": "\\mathfrak{g}",
    "math": true
  },
  "𝔥": {
    "latex": "\\mathfrak{h}",
    "math": true
  },
  "𝔦": {
    "latex": "\\mathfrak{i}",
    "math": true
  },
  "𝔧": {
    "latex": "\\mathfrak{j}",
    "math": true
  },
  "𝔨": {
    "latex": "\\mathfrak{k}",
    "math": true
  },
  "𝔩": {
    "latex": "\\mathfrak{l}",
    "math": true
  },
  "𝔪": {
    "latex": "\\mathfrak{m}",
    "math": true
  },
  "𝔫": {
    "latex": "\\mathfrak{n}",
    "math": true
  },
  "𝔬": {
    "latex": "\\mathfrak{o}",
    "math": true
  },
  "𝔭": {
    "latex": "\\mathfrak{p}",
    "math": true
  },
  "𝔮": {
    "latex": "\\mathfrak{q}",
    "math": true
  },
  "𝔯": {
    "latex": "\\mathfrak{r}",
    "math": true
  },
  "𝔰": {
    "latex": "\\mathfrak{s}",
    "math": true
  },
  "𝔱": {
    "latex": "\\mathfrak{t}",
    "math": true
  },
  "𝔲": {
    "latex": "\\mathfrak{u}",
    "math": true
  },
  "𝔳": {
    "latex": "\\mathfrak{v}",
    "math": true
  },
  "𝔴": {
    "latex": "\\mathfrak{w}",
    "math": true
  },
  "𝔵": {
    "latex": "\\mathfrak{x}",
    "math": true
  },
  "𝔶": {
    "latex": "\\mathfrak{y}",
    "math": true
  },
  "𝔷": {
    "latex": "\\mathfrak{z}",
    "math": true
  },
  "𝔸": {
    "latex": "\\mathbb{A}",
    "math": true
  },
  "𝔹": {
    "latex": "\\mathbb{B}",
    "math": true
  },
  "𝔻": {
    "latex": "\\mathbb{D}",
    "math": true
  },
  "𝔼": {
    "latex": "\\mathbb{E}",
    "math": true
  },
  "𝔽": {
    "latex": "\\mathbb{F}",
    "math": true
  },
  "𝔾": {
    "latex": "\\mathbb{G}",
    "math": true
  },
  "𝕀": {
    "latex": "\\mathbb{I}",
    "math": true
  },
  "𝕁": {
    "latex": "\\mathbb{J}",
    "math": true
  },
  "𝕂": {
    "latex": "\\mathbb{K}",
    "math": true
  },
  "𝕃": {
    "latex": "\\mathbb{L}",
    "math": true
  },
  "𝕄": {
    "latex": "\\mathbb{M}",
    "math": true
  },
  "𝕆": {
    "latex": "\\mathbb{O}",
    "math": true
  },
  "𝕊": {
    "latex": "\\mathbb{S}",
    "math": true
  },
  "𝕋": {
    "latex": "\\mathbb{T}",
    "math": true
  },
  "𝕌": {
    "latex": "\\mathbb{U}",
    "math": true
  },
  "𝕍": {
    "latex": "\\mathbb{V}",
    "math": true
  },
  "𝕎": {
    "latex": "\\mathbb{W}",
    "math": true
  },
  "𝕏": {
    "latex": "\\mathbb{X}",
    "math": true
  },
  "𝕐": {
    "latex": "\\mathbb{Y}",
    "math": true
  },
  "𝕒": {
    "latex": "\\mathbb{a}",
    "math": true
  },
  "𝕓": {
    "latex": "\\mathbb{b}",
    "math": true
  },
  "𝕔": {
    "latex": "\\mathbb{c}",
    "math": true
  },
  "𝕕": {
    "latex": "\\mathbb{d}",
    "math": true
  },
  "𝕖": {
    "latex": "\\mathbb{e}",
    "math": true
  },
  "𝕗": {
    "latex": "\\mathbb{f}",
    "math": true
  },
  "𝕘": {
    "latex": "\\mathbb{g}",
    "math": true
  },
  "𝕙": {
    "latex": "\\mathbb{h}",
    "math": true
  },
  "𝕚": {
    "latex": "\\mathbb{i}",
    "math": true
  },
  "𝕛": {
    "latex": "\\mathbb{j}",
    "math": true
  },
  "𝕜": {
    "latex": "\\mathbb{k}",
    "math": true
  },
  "𝕝": {
    "latex": "\\mathbb{l}",
    "math": true
  },
  "𝕞": {
    "latex": "\\mathbb{m}",
    "math": true
  },
  "𝕟": {
    "latex": "\\mathbb{n}",
    "math": true
  },
  "𝕠": {
    "latex": "\\mathbb{o}",
    "math": true
  },
  "𝕡": {
    "latex": "\\mathbb{p}",
    "math": true
  },
  "𝕢": {
    "latex": "\\mathbb{q}",
    "math": true
  },
  "𝕣": {
    "latex": "\\mathbb{r}",
    "math": true
  },
  "𝕤": {
    "latex": "\\mathbb{s}",
    "math": true
  },
  "𝕥": {
    "latex": "\\mathbb{t}",
    "math": true
  },
  "𝕦": {
    "latex": "\\mathbb{u}",
    "math": true
  },
  "𝕧": {
    "latex": "\\mathbb{v}",
    "math": true
  },
  "𝕨": {
    "latex": "\\mathbb{w}",
    "math": true
  },
  "𝕩": {
    "latex": "\\mathbb{x}",
    "math": true
  },
  "𝕪": {
    "latex": "\\mathbb{y}",
    "math": true
  },
  "𝕫": {
    "latex": "\\mathbb{z}",
    "math": true
  },
  "𝕬": {
    "latex": "\\mathslbb{A}",
    "math": true
  },
  "𝕭": {
    "latex": "\\mathslbb{B}",
    "math": true
  },
  "𝕮": {
    "latex": "\\mathslbb{C}",
    "math": true
  },
  "𝕯": {
    "latex": "\\mathslbb{D}",
    "math": true
  },
  "𝕰": {
    "latex": "\\mathslbb{E}",
    "math": true
  },
  "𝕱": {
    "latex": "\\mathslbb{F}",
    "math": true
  },
  "𝕲": {
    "latex": "\\mathslbb{G}",
    "math": true
  },
  "𝕳": {
    "latex": "\\mathslbb{H}",
    "math": true
  },
  "𝕴": {
    "latex": "\\mathslbb{I}",
    "math": true
  },
  "𝕵": {
    "latex": "\\mathslbb{J}",
    "math": true
  },
  "𝕶": {
    "latex": "\\mathslbb{K}",
    "math": true
  },
  "𝕷": {
    "latex": "\\mathslbb{L}",
    "math": true
  },
  "𝕸": {
    "latex": "\\mathslbb{M}",
    "math": true
  },
  "𝕹": {
    "latex": "\\mathslbb{N}",
    "math": true
  },
  "𝕺": {
    "latex": "\\mathslbb{O}",
    "math": true
  },
  "𝕻": {
    "latex": "\\mathslbb{P}",
    "math": true
  },
  "𝕼": {
    "latex": "\\mathslbb{Q}",
    "math": true
  },
  "𝕽": {
    "latex": "\\mathslbb{R}",
    "math": true
  },
  "𝕾": {
    "latex": "\\mathslbb{S}",
    "math": true
  },
  "𝕿": {
    "latex": "\\mathslbb{T}",
    "math": true
  },
  "𝖀": {
    "latex": "\\mathslbb{U}",
    "math": true
  },
  "𝖁": {
    "latex": "\\mathslbb{V}",
    "math": true
  },
  "𝖂": {
    "latex": "\\mathslbb{W}",
    "math": true
  },
  "𝖃": {
    "latex": "\\mathslbb{X}",
    "math": true
  },
  "𝖄": {
    "latex": "\\mathslbb{Y}",
    "math": true
  },
  "𝖅": {
    "latex": "\\mathslbb{Z}",
    "math": true
  },
  "𝖆": {
    "latex": "\\mathslbb{a}",
    "math": true
  },
  "𝖇": {
    "latex": "\\mathslbb{b}",
    "math": true
  },
  "𝖈": {
    "latex": "\\mathslbb{c}",
    "math": true
  },
  "𝖉": {
    "latex": "\\mathslbb{d}",
    "math": true
  },
  "𝖊": {
    "latex": "\\mathslbb{e}",
    "math": true
  },
  "𝖋": {
    "latex": "\\mathslbb{f}",
    "math": true
  },
  "𝖌": {
    "latex": "\\mathslbb{g}",
    "math": true
  },
  "𝖍": {
    "latex": "\\mathslbb{h}",
    "math": true
  },
  "𝖎": {
    "latex": "\\mathslbb{i}",
    "math": true
  },
  "𝖏": {
    "latex": "\\mathslbb{j}",
    "math": true
  },
  "𝖐": {
    "latex": "\\mathslbb{k}",
    "math": true
  },
  "𝖑": {
    "latex": "\\mathslbb{l}",
    "math": true
  },
  "𝖒": {
    "latex": "\\mathslbb{m}",
    "math": true
  },
  "𝖓": {
    "latex": "\\mathslbb{n}",
    "math": true
  },
  "𝖔": {
    "latex": "\\mathslbb{o}",
    "math": true
  },
  "𝖕": {
    "latex": "\\mathslbb{p}",
    "math": true
  },
  "𝖖": {
    "latex": "\\mathslbb{q}",
    "math": true
  },
  "𝖗": {
    "latex": "\\mathslbb{r}",
    "math": true
  },
  "𝖘": {
    "latex": "\\mathslbb{s}",
    "math": true
  },
  "𝖙": {
    "latex": "\\mathslbb{t}",
    "math": true
  },
  "𝖚": {
    "latex": "\\mathslbb{u}",
    "math": true
  },
  "𝖛": {
    "latex": "\\mathslbb{v}",
    "math": true
  },
  "𝖜": {
    "latex": "\\mathslbb{w}",
    "math": true
  },
  "𝖝": {
    "latex": "\\mathslbb{x}",
    "math": true
  },
  "𝖞": {
    "latex": "\\mathslbb{y}",
    "math": true
  },
  "𝖟": {
    "latex": "\\mathslbb{z}",
    "math": true
  },
  "𝖠": {
    "latex": "\\mathsf{A}",
    "math": true
  },
  "𝖡": {
    "latex": "\\mathsf{B}",
    "math": true
  },
  "𝖢": {
    "latex": "\\mathsf{C}",
    "math": true
  },
  "𝖣": {
    "latex": "\\mathsf{D}",
    "math": true
  },
  "𝖤": {
    "latex": "\\mathsf{E}",
    "math": true
  },
  "𝖥": {
    "latex": "\\mathsf{F}",
    "math": true
  },
  "𝖦": {
    "latex": "\\mathsf{G}",
    "math": true
  },
  "𝖧": {
    "latex": "\\mathsf{H}",
    "math": true
  },
  "𝖨": {
    "latex": "\\mathsf{I}",
    "math": true
  },
  "𝖩": {
    "latex": "\\mathsf{J}",
    "math": true
  },
  "𝖪": {
    "latex": "\\mathsf{K}",
    "math": true
  },
  "𝖫": {
    "latex": "\\mathsf{L}",
    "math": true
  },
  "𝖬": {
    "latex": "\\mathsf{M}",
    "math": true
  },
  "𝖭": {
    "latex": "\\mathsf{N}",
    "math": true
  },
  "𝖮": {
    "latex": "\\mathsf{O}",
    "math": true
  },
  "𝖯": {
    "latex": "\\mathsf{P}",
    "math": true
  },
  "𝖰": {
    "latex": "\\mathsf{Q}",
    "math": true
  },
  "𝖱": {
    "latex": "\\mathsf{R}",
    "math": true
  },
  "𝖲": {
    "latex": "\\mathsf{S}",
    "math": true
  },
  "𝖳": {
    "latex": "\\mathsf{T}",
    "math": true
  },
  "𝖴": {
    "latex": "\\mathsf{U}",
    "math": true
  },
  "𝖵": {
    "latex": "\\mathsf{V}",
    "math": true
  },
  "𝖶": {
    "latex": "\\mathsf{W}",
    "math": true
  },
  "𝖷": {
    "latex": "\\mathsf{X}",
    "math": true
  },
  "𝖸": {
    "latex": "\\mathsf{Y}",
    "math": true
  },
  "𝖹": {
    "latex": "\\mathsf{Z}",
    "math": true
  },
  "𝖺": {
    "latex": "\\mathsf{a}",
    "math": true
  },
  "𝖻": {
    "latex": "\\mathsf{b}",
    "math": true
  },
  "𝖼": {
    "latex": "\\mathsf{c}",
    "math": true
  },
  "𝖽": {
    "latex": "\\mathsf{d}",
    "math": true
  },
  "𝖾": {
    "latex": "\\mathsf{e}",
    "math": true
  },
  "𝖿": {
    "latex": "\\mathsf{f}",
    "math": true
  },
  "𝗀": {
    "latex": "\\mathsf{g}",
    "math": true
  },
  "𝗁": {
    "latex": "\\mathsf{h}",
    "math": true
  },
  "𝗂": {
    "latex": "\\mathsf{i}",
    "math": true
  },
  "𝗃": {
    "latex": "\\mathsf{j}",
    "math": true
  },
  "𝗄": {
    "latex": "\\mathsf{k}",
    "math": true
  },
  "𝗅": {
    "latex": "\\mathsf{l}",
    "math": true
  },
  "𝗆": {
    "latex": "\\mathsf{m}",
    "math": true
  },
  "𝗇": {
    "latex": "\\mathsf{n}",
    "math": true
  },
  "𝗈": {
    "latex": "\\mathsf{o}",
    "math": true
  },
  "𝗉": {
    "latex": "\\mathsf{p}",
    "math": true
  },
  "𝗊": {
    "latex": "\\mathsf{q}",
    "math": true
  },
  "𝗋": {
    "latex": "\\mathsf{r}",
    "math": true
  },
  "𝗌": {
    "latex": "\\mathsf{s}",
    "math": true
  },
  "𝗍": {
    "latex": "\\mathsf{t}",
    "math": true
  },
  "𝗎": {
    "latex": "\\mathsf{u}",
    "math": true
  },
  "𝗏": {
    "latex": "\\mathsf{v}",
    "math": true
  },
  "𝗐": {
    "latex": "\\mathsf{w}",
    "math": true
  },
  "𝗑": {
    "latex": "\\mathsf{x}",
    "math": true
  },
  "𝗒": {
    "latex": "\\mathsf{y}",
    "math": true
  },
  "𝗓": {
    "latex": "\\mathsf{z}",
    "math": true
  },
  "𝗔": {
    "latex": "\\mathsfbf{A}",
    "math": true
  },
  "𝗕": {
    "latex": "\\mathsfbf{B}",
    "math": true
  },
  "𝗖": {
    "latex": "\\mathsfbf{C}",
    "math": true
  },
  "𝗗": {
    "latex": "\\mathsfbf{D}",
    "math": true
  },
  "𝗘": {
    "latex": "\\mathsfbf{E}",
    "math": true
  },
  "𝗙": {
    "latex": "\\mathsfbf{F}",
    "math": true
  },
  "𝗚": {
    "latex": "\\mathsfbf{G}",
    "math": true
  },
  "𝗛": {
    "latex": "\\mathsfbf{H}",
    "math": true
  },
  "𝗜": {
    "latex": "\\mathsfbf{I}",
    "math": true
  },
  "𝗝": {
    "latex": "\\mathsfbf{J}",
    "math": true
  },
  "𝗞": {
    "latex": "\\mathsfbf{K}",
    "math": true
  },
  "𝗟": {
    "latex": "\\mathsfbf{L}",
    "math": true
  },
  "𝗠": {
    "latex": "\\mathsfbf{M}",
    "math": true
  },
  "𝗡": {
    "latex": "\\mathsfbf{N}",
    "math": true
  },
  "𝗢": {
    "latex": "\\mathsfbf{O}",
    "math": true
  },
  "𝗣": {
    "latex": "\\mathsfbf{P}",
    "math": true
  },
  "𝗤": {
    "latex": "\\mathsfbf{Q}",
    "math": true
  },
  "𝗥": {
    "latex": "\\mathsfbf{R}",
    "math": true
  },
  "𝗦": {
    "latex": "\\mathsfbf{S}",
    "math": true
  },
  "𝗧": {
    "latex": "\\mathsfbf{T}",
    "math": true
  },
  "𝗨": {
    "latex": "\\mathsfbf{U}",
    "math": true
  },
  "𝗩": {
    "latex": "\\mathsfbf{V}",
    "math": true
  },
  "𝗪": {
    "latex": "\\mathsfbf{W}",
    "math": true
  },
  "𝗫": {
    "latex": "\\mathsfbf{X}",
    "math": true
  },
  "𝗬": {
    "latex": "\\mathsfbf{Y}",
    "math": true
  },
  "𝗭": {
    "latex": "\\mathsfbf{Z}",
    "math": true
  },
  "𝗮": {
    "latex": "\\mathsfbf{a}",
    "math": true
  },
  "𝗯": {
    "latex": "\\mathsfbf{b}",
    "math": true
  },
  "𝗰": {
    "latex": "\\mathsfbf{c}",
    "math": true
  },
  "𝗱": {
    "latex": "\\mathsfbf{d}",
    "math": true
  },
  "𝗲": {
    "latex": "\\mathsfbf{e}",
    "math": true
  },
  "𝗳": {
    "latex": "\\mathsfbf{f}",
    "math": true
  },
  "𝗴": {
    "latex": "\\mathsfbf{g}",
    "math": true
  },
  "𝗵": {
    "latex": "\\mathsfbf{h}",
    "math": true
  },
  "𝗶": {
    "latex": "\\mathsfbf{i}",
    "math": true
  },
  "𝗷": {
    "latex": "\\mathsfbf{j}",
    "math": true
  },
  "𝗸": {
    "latex": "\\mathsfbf{k}",
    "math": true
  },
  "𝗹": {
    "latex": "\\mathsfbf{l}",
    "math": true
  },
  "𝗺": {
    "latex": "\\mathsfbf{m}",
    "math": true
  },
  "𝗻": {
    "latex": "\\mathsfbf{n}",
    "math": true
  },
  "𝗼": {
    "latex": "\\mathsfbf{o}",
    "math": true
  },
  "𝗽": {
    "latex": "\\mathsfbf{p}",
    "math": true
  },
  "𝗾": {
    "latex": "\\mathsfbf{q}",
    "math": true
  },
  "𝗿": {
    "latex": "\\mathsfbf{r}",
    "math": true
  },
  "𝘀": {
    "latex": "\\mathsfbf{s}",
    "math": true
  },
  "𝘁": {
    "latex": "\\mathsfbf{t}",
    "math": true
  },
  "𝘂": {
    "latex": "\\mathsfbf{u}",
    "math": true
  },
  "𝘃": {
    "latex": "\\mathsfbf{v}",
    "math": true
  },
  "𝘄": {
    "latex": "\\mathsfbf{w}",
    "math": true
  },
  "𝘅": {
    "latex": "\\mathsfbf{x}",
    "math": true
  },
  "𝘆": {
    "latex": "\\mathsfbf{y}",
    "math": true
  },
  "𝘇": {
    "latex": "\\mathsfbf{z}",
    "math": true
  },
  "𝘈": {
    "latex": "\\mathsfsl{A}",
    "math": true
  },
  "𝘉": {
    "latex": "\\mathsfsl{B}",
    "math": true
  },
  "𝘊": {
    "latex": "\\mathsfsl{C}",
    "math": true
  },
  "𝘋": {
    "latex": "\\mathsfsl{D}",
    "math": true
  },
  "𝘌": {
    "latex": "\\mathsfsl{E}",
    "math": true
  },
  "𝘍": {
    "latex": "\\mathsfsl{F}",
    "math": true
  },
  "𝘎": {
    "latex": "\\mathsfsl{G}",
    "math": true
  },
  "𝘏": {
    "latex": "\\mathsfsl{H}",
    "math": true
  },
  "𝘐": {
    "latex": "\\mathsfsl{I}",
    "math": true
  },
  "𝘑": {
    "latex": "\\mathsfsl{J}",
    "math": true
  },
  "𝘒": {
    "latex": "\\mathsfsl{K}",
    "math": true
  },
  "𝘓": {
    "latex": "\\mathsfsl{L}",
    "math": true
  },
  "𝘔": {
    "latex": "\\mathsfsl{M}",
    "math": true
  },
  "𝘕": {
    "latex": "\\mathsfsl{N}",
    "math": true
  },
  "𝘖": {
    "latex": "\\mathsfsl{O}",
    "math": true
  },
  "𝘗": {
    "latex": "\\mathsfsl{P}",
    "math": true
  },
  "𝘘": {
    "latex": "\\mathsfsl{Q}",
    "math": true
  },
  "𝘙": {
    "latex": "\\mathsfsl{R}",
    "math": true
  },
  "𝘚": {
    "latex": "\\mathsfsl{S}",
    "math": true
  },
  "𝘛": {
    "latex": "\\mathsfsl{T}",
    "math": true
  },
  "𝘜": {
    "latex": "\\mathsfsl{U}",
    "math": true
  },
  "𝘝": {
    "latex": "\\mathsfsl{V}",
    "math": true
  },
  "𝘞": {
    "latex": "\\mathsfsl{W}",
    "math": true
  },
  "𝘟": {
    "latex": "\\mathsfsl{X}",
    "math": true
  },
  "𝘠": {
    "latex": "\\mathsfsl{Y}",
    "math": true
  },
  "𝘡": {
    "latex": "\\mathsfsl{Z}",
    "math": true
  },
  "𝘢": {
    "latex": "\\mathsfsl{a}",
    "math": true
  },
  "𝘣": {
    "latex": "\\mathsfsl{b}",
    "math": true
  },
  "𝘤": {
    "latex": "\\mathsfsl{c}",
    "math": true
  },
  "𝘥": {
    "latex": "\\mathsfsl{d}",
    "math": true
  },
  "𝘦": {
    "latex": "\\mathsfsl{e}",
    "math": true
  },
  "𝘧": {
    "latex": "\\mathsfsl{f}",
    "math": true
  },
  "𝘨": {
    "latex": "\\mathsfsl{g}",
    "math": true
  },
  "𝘩": {
    "latex": "\\mathsfsl{h}",
    "math": true
  },
  "𝘪": {
    "latex": "\\mathsfsl{i}",
    "math": true
  },
  "𝘫": {
    "latex": "\\mathsfsl{j}",
    "math": true
  },
  "𝘬": {
    "latex": "\\mathsfsl{k}",
    "math": true
  },
  "𝘭": {
    "latex": "\\mathsfsl{l}",
    "math": true
  },
  "𝘮": {
    "latex": "\\mathsfsl{m}",
    "math": true
  },
  "𝘯": {
    "latex": "\\mathsfsl{n}",
    "math": true
  },
  "𝘰": {
    "latex": "\\mathsfsl{o}",
    "math": true
  },
  "𝘱": {
    "latex": "\\mathsfsl{p}",
    "math": true
  },
  "𝘲": {
    "latex": "\\mathsfsl{q}",
    "math": true
  },
  "𝘳": {
    "latex": "\\mathsfsl{r}",
    "math": true
  },
  "𝘴": {
    "latex": "\\mathsfsl{s}",
    "math": true
  },
  "𝘵": {
    "latex": "\\mathsfsl{t}",
    "math": true
  },
  "𝘶": {
    "latex": "\\mathsfsl{u}",
    "math": true
  },
  "𝘷": {
    "latex": "\\mathsfsl{v}",
    "math": true
  },
  "𝘸": {
    "latex": "\\mathsfsl{w}",
    "math": true
  },
  "𝘹": {
    "latex": "\\mathsfsl{x}",
    "math": true
  },
  "𝘺": {
    "latex": "\\mathsfsl{y}",
    "math": true
  },
  "𝘻": {
    "latex": "\\mathsfsl{z}",
    "math": true
  },
  "𝘼": {
    "latex": "\\mathsfbfsl{A}",
    "math": true
  },
  "𝘽": {
    "latex": "\\mathsfbfsl{B}",
    "math": true
  },
  "𝘾": {
    "latex": "\\mathsfbfsl{C}",
    "math": true
  },
  "𝘿": {
    "latex": "\\mathsfbfsl{D}",
    "math": true
  },
  "𝙀": {
    "latex": "\\mathsfbfsl{E}",
    "math": true
  },
  "𝙁": {
    "latex": "\\mathsfbfsl{F}",
    "math": true
  },
  "𝙂": {
    "latex": "\\mathsfbfsl{G}",
    "math": true
  },
  "𝙃": {
    "latex": "\\mathsfbfsl{H}",
    "math": true
  },
  "𝙄": {
    "latex": "\\mathsfbfsl{I}",
    "math": true
  },
  "𝙅": {
    "latex": "\\mathsfbfsl{J}",
    "math": true
  },
  "𝙆": {
    "latex": "\\mathsfbfsl{K}",
    "math": true
  },
  "𝙇": {
    "latex": "\\mathsfbfsl{L}",
    "math": true
  },
  "𝙈": {
    "latex": "\\mathsfbfsl{M}",
    "math": true
  },
  "𝙉": {
    "latex": "\\mathsfbfsl{N}",
    "math": true
  },
  "𝙊": {
    "latex": "\\mathsfbfsl{O}",
    "math": true
  },
  "𝙋": {
    "latex": "\\mathsfbfsl{P}",
    "math": true
  },
  "𝙌": {
    "latex": "\\mathsfbfsl{Q}",
    "math": true
  },
  "𝙍": {
    "latex": "\\mathsfbfsl{R}",
    "math": true
  },
  "𝙎": {
    "latex": "\\mathsfbfsl{S}",
    "math": true
  },
  "𝙏": {
    "latex": "\\mathsfbfsl{T}",
    "math": true
  },
  "𝙐": {
    "latex": "\\mathsfbfsl{U}",
    "math": true
  },
  "𝙑": {
    "latex": "\\mathsfbfsl{V}",
    "math": true
  },
  "𝙒": {
    "latex": "\\mathsfbfsl{W}",
    "math": true
  },
  "𝙓": {
    "latex": "\\mathsfbfsl{X}",
    "math": true
  },
  "𝙔": {
    "latex": "\\mathsfbfsl{Y}",
    "math": true
  },
  "𝙕": {
    "latex": "\\mathsfbfsl{Z}",
    "math": true
  },
  "𝙖": {
    "latex": "\\mathsfbfsl{a}",
    "math": true
  },
  "𝙗": {
    "latex": "\\mathsfbfsl{b}",
    "math": true
  },
  "𝙘": {
    "latex": "\\mathsfbfsl{c}",
    "math": true
  },
  "𝙙": {
    "latex": "\\mathsfbfsl{d}",
    "math": true
  },
  "𝙚": {
    "latex": "\\mathsfbfsl{e}",
    "math": true
  },
  "𝙛": {
    "latex": "\\mathsfbfsl{f}",
    "math": true
  },
  "𝙜": {
    "latex": "\\mathsfbfsl{g}",
    "math": true
  },
  "𝙝": {
    "latex": "\\mathsfbfsl{h}",
    "math": true
  },
  "𝙞": {
    "latex": "\\mathsfbfsl{i}",
    "math": true
  },
  "𝙟": {
    "latex": "\\mathsfbfsl{j}",
    "math": true
  },
  "𝙠": {
    "latex": "\\mathsfbfsl{k}",
    "math": true
  },
  "𝙡": {
    "latex": "\\mathsfbfsl{l}",
    "math": true
  },
  "𝙢": {
    "latex": "\\mathsfbfsl{m}",
    "math": true
  },
  "𝙣": {
    "latex": "\\mathsfbfsl{n}",
    "math": true
  },
  "𝙤": {
    "latex": "\\mathsfbfsl{o}",
    "math": true
  },
  "𝙥": {
    "latex": "\\mathsfbfsl{p}",
    "math": true
  },
  "𝙦": {
    "latex": "\\mathsfbfsl{q}",
    "math": true
  },
  "𝙧": {
    "latex": "\\mathsfbfsl{r}",
    "math": true
  },
  "𝙨": {
    "latex": "\\mathsfbfsl{s}",
    "math": true
  },
  "𝙩": {
    "latex": "\\mathsfbfsl{t}",
    "math": true
  },
  "𝙪": {
    "latex": "\\mathsfbfsl{u}",
    "math": true
  },
  "𝙫": {
    "latex": "\\mathsfbfsl{v}",
    "math": true
  },
  "𝙬": {
    "latex": "\\mathsfbfsl{w}",
    "math": true
  },
  "𝙭": {
    "latex": "\\mathsfbfsl{x}",
    "math": true
  },
  "𝙮": {
    "latex": "\\mathsfbfsl{y}",
    "math": true
  },
  "𝙯": {
    "latex": "\\mathsfbfsl{z}",
    "math": true
  },
  "𝙰": {
    "latex": "\\mathtt{A}",
    "math": true
  },
  "𝙱": {
    "latex": "\\mathtt{B}",
    "math": true
  },
  "𝙲": {
    "latex": "\\mathtt{C}",
    "math": true
  },
  "𝙳": {
    "latex": "\\mathtt{D}",
    "math": true
  },
  "𝙴": {
    "latex": "\\mathtt{E}",
    "math": true
  },
  "𝙵": {
    "latex": "\\mathtt{F}",
    "math": true
  },
  "𝙶": {
    "latex": "\\mathtt{G}",
    "math": true
  },
  "𝙷": {
    "latex": "\\mathtt{H}",
    "math": true
  },
  "𝙸": {
    "latex": "\\mathtt{I}",
    "math": true
  },
  "𝙹": {
    "latex": "\\mathtt{J}",
    "math": true
  },
  "𝙺": {
    "latex": "\\mathtt{K}",
    "math": true
  },
  "𝙻": {
    "latex": "\\mathtt{L}",
    "math": true
  },
  "𝙼": {
    "latex": "\\mathtt{M}",
    "math": true
  },
  "𝙽": {
    "latex": "\\mathtt{N}",
    "math": true
  },
  "𝙾": {
    "latex": "\\mathtt{O}",
    "math": true
  },
  "𝙿": {
    "latex": "\\mathtt{P}",
    "math": true
  },
  "𝚀": {
    "latex": "\\mathtt{Q}",
    "math": true
  },
  "𝚁": {
    "latex": "\\mathtt{R}",
    "math": true
  },
  "𝚂": {
    "latex": "\\mathtt{S}",
    "math": true
  },
  "𝚃": {
    "latex": "\\mathtt{T}",
    "math": true
  },
  "𝚄": {
    "latex": "\\mathtt{U}",
    "math": true
  },
  "𝚅": {
    "latex": "\\mathtt{V}",
    "math": true
  },
  "𝚆": {
    "latex": "\\mathtt{W}",
    "math": true
  },
  "𝚇": {
    "latex": "\\mathtt{X}",
    "math": true
  },
  "𝚈": {
    "latex": "\\mathtt{Y}",
    "math": true
  },
  "𝚉": {
    "latex": "\\mathtt{Z}",
    "math": true
  },
  "𝚊": {
    "latex": "\\mathtt{a}",
    "math": true
  },
  "𝚋": {
    "latex": "\\mathtt{b}",
    "math": true
  },
  "𝚌": {
    "latex": "\\mathtt{c}",
    "math": true
  },
  "𝚍": {
    "latex": "\\mathtt{d}",
    "math": true
  },
  "𝚎": {
    "latex": "\\mathtt{e}",
    "math": true
  },
  "𝚏": {
    "latex": "\\mathtt{f}",
    "math": true
  },
  "𝚐": {
    "latex": "\\mathtt{g}",
    "math": true
  },
  "𝚑": {
    "latex": "\\mathtt{h}",
    "math": true
  },
  "𝚒": {
    "latex": "\\mathtt{i}",
    "math": true
  },
  "𝚓": {
    "latex": "\\mathtt{j}",
    "math": true
  },
  "𝚔": {
    "latex": "\\mathtt{k}",
    "math": true
  },
  "𝚕": {
    "latex": "\\mathtt{l}",
    "math": true
  },
  "𝚖": {
    "latex": "\\mathtt{m}",
    "math": true
  },
  "𝚗": {
    "latex": "\\mathtt{n}",
    "math": true
  },
  "𝚘": {
    "latex": "\\mathtt{o}",
    "math": true
  },
  "𝚙": {
    "latex": "\\mathtt{p}",
    "math": true
  },
  "𝚚": {
    "latex": "\\mathtt{q}",
    "math": true
  },
  "𝚛": {
    "latex": "\\mathtt{r}",
    "math": true
  },
  "𝚜": {
    "latex": "\\mathtt{s}",
    "math": true
  },
  "𝚝": {
    "latex": "\\mathtt{t}",
    "math": true
  },
  "𝚞": {
    "latex": "\\mathtt{u}",
    "math": true
  },
  "𝚟": {
    "latex": "\\mathtt{v}",
    "math": true
  },
  "𝚠": {
    "latex": "\\mathtt{w}",
    "math": true
  },
  "𝚡": {
    "latex": "\\mathtt{x}",
    "math": true
  },
  "𝚢": {
    "latex": "\\mathtt{y}",
    "math": true
  },
  "𝚣": {
    "latex": "\\mathtt{z}",
    "math": true
  },
  "𝚨": {
    "latex": "\\mathbf{\\Alpha}",
    "math": true
  },
  "𝚩": {
    "latex": "\\mathbf{\\Beta}",
    "math": true
  },
  "𝚪": {
    "latex": "\\mathbf{\\Gamma}",
    "math": true
  },
  "𝚫": {
    "latex": "\\mathbf{\\Delta}",
    "math": true
  },
  "𝚬": {
    "latex": "\\mathbf{\\Epsilon}",
    "math": true
  },
  "𝚭": {
    "latex": "\\mathbf{\\Zeta}",
    "math": true
  },
  "𝚮": {
    "latex": "\\mathbf{\\Eta}",
    "math": true
  },
  "𝚯": {
    "latex": "\\mathbf{\\Theta}",
    "math": true
  },
  "𝚰": {
    "latex": "\\mathbf{\\Iota}",
    "math": true
  },
  "𝚱": {
    "latex": "\\mathbf{\\Kappa}",
    "math": true
  },
  "𝚲": {
    "latex": "\\mathbf{\\Lambda}",
    "math": true
  },
  "𝚳": {
    "latex": "M",
    "math": true
  },
  "𝚴": {
    "latex": "N",
    "math": true
  },
  "𝚵": {
    "latex": "\\mathbf{\\Xi}",
    "math": true
  },
  "𝚶": {
    "latex": "O",
    "math": true
  },
  "𝚷": {
    "latex": "\\mathbf{\\Pi}",
    "math": true
  },
  "𝚸": {
    "latex": "\\mathbf{\\Rho}",
    "math": true
  },
  "𝚹": {
    "latex": "\\mathbf{\\vartheta}"
  },
  "𝚺": {
    "latex": "\\mathbf{\\Sigma}",
    "math": true
  },
  "𝚻": {
    "latex": "\\mathbf{\\Tau}",
    "math": true
  },
  "𝚼": {
    "latex": "\\mathbf{\\Upsilon}",
    "math": true
  },
  "𝚽": {
    "latex": "\\mathbf{\\Phi}",
    "math": true
  },
  "𝚾": {
    "latex": "\\mathbf{\\Chi}",
    "math": true
  },
  "𝚿": {
    "latex": "\\mathbf{\\Psi}",
    "math": true
  },
  "𝛀": {
    "latex": "\\mathbf{\\Omega}",
    "math": true
  },
  "𝛁": {
    "latex": "\\mathbf{\\nabla}",
    "math": true
  },
  "𝛂": {
    "latex": "\\mathbf{\\Alpha}",
    "math": true
  },
  "𝛃": {
    "latex": "\\mathbf{\\Beta}",
    "math": true
  },
  "𝛄": {
    "latex": "\\mathbf{\\Gamma}",
    "math": true
  },
  "𝛅": {
    "latex": "\\mathbf{\\Delta}",
    "math": true
  },
  "𝛆": {
    "latex": "\\mathbf{\\Epsilon}",
    "math": true
  },
  "𝛇": {
    "latex": "\\mathbf{\\Zeta}",
    "math": true
  },
  "𝛈": {
    "latex": "\\mathbf{\\Eta}",
    "math": true
  },
  "𝛉": {
    "latex": "\\mathbf{\\theta}",
    "math": true
  },
  "𝛊": {
    "latex": "\\mathbf{\\Iota}",
    "math": true
  },
  "𝛋": {
    "latex": "\\mathbf{\\Kappa}",
    "math": true
  },
  "𝛌": {
    "latex": "\\mathbf{\\Lambda}",
    "math": true
  },
  "𝛍": {
    "latex": "M",
    "math": true
  },
  "𝛎": {
    "latex": "N",
    "math": true
  },
  "𝛏": {
    "latex": "\\mathbf{\\Xi}",
    "math": true
  },
  "𝛐": {
    "latex": "O",
    "math": true
  },
  "𝛑": {
    "latex": "\\mathbf{\\Pi}",
    "math": true
  },
  "𝛒": {
    "latex": "\\mathbf{\\Rho}",
    "math": true
  },
  "𝛓": {
    "latex": "\\mathbf{\\varsigma}",
    "math": true
  },
  "𝛔": {
    "latex": "\\mathbf{\\Sigma}",
    "math": true
  },
  "𝛕": {
    "latex": "\\mathbf{\\Tau}",
    "math": true
  },
  "𝛖": {
    "latex": "\\mathbf{\\Upsilon}",
    "math": true
  },
  "𝛗": {
    "latex": "\\mathbf{\\Phi}",
    "math": true
  },
  "𝛘": {
    "latex": "\\mathbf{\\Chi}",
    "math": true
  },
  "𝛙": {
    "latex": "\\mathbf{\\Psi}",
    "math": true
  },
  "𝛚": {
    "latex": "\\mathbf{\\Omega}",
    "math": true
  },
  "𝛛": {
    "latex": "\\partial",
    "math": true
  },
  "𝛜": {
    "latex": "\\in",
    "math": true
  },
  "𝛝": {
    "latex": "\\mathbf{\\vartheta}"
  },
  "𝛞": {
    "latex": "\\mathbf{\\varkappa}"
  },
  "𝛟": {
    "latex": "\\mathbf{\\phi}"
  },
  "𝛠": {
    "latex": "\\mathbf{\\varrho}"
  },
  "𝛡": {
    "latex": "\\mathbf{\\varpi}"
  },
  "𝛢": {
    "latex": "\\mathsl{\\Alpha}",
    "math": true
  },
  "𝛣": {
    "latex": "\\mathsl{\\Beta}",
    "math": true
  },
  "𝛤": {
    "latex": "\\mathsl{\\Gamma}",
    "math": true
  },
  "𝛥": {
    "latex": "\\mathsl{\\Delta}",
    "math": true
  },
  "𝛦": {
    "latex": "\\mathsl{\\Epsilon}",
    "math": true
  },
  "𝛧": {
    "latex": "\\mathsl{\\Zeta}",
    "math": true
  },
  "𝛨": {
    "latex": "\\mathsl{\\Eta}",
    "math": true
  },
  "𝛩": {
    "latex": "\\mathsl{\\Theta}",
    "math": true
  },
  "𝛪": {
    "latex": "\\mathsl{\\Iota}",
    "math": true
  },
  "𝛫": {
    "latex": "\\mathsl{\\Kappa}",
    "math": true
  },
  "𝛬": {
    "latex": "\\mathsl{\\Lambda}",
    "math": true
  },
  "𝛭": {
    "latex": "M",
    "math": true
  },
  "𝛮": {
    "latex": "N",
    "math": true
  },
  "𝛯": {
    "latex": "\\mathsl{\\Xi}",
    "math": true
  },
  "𝛰": {
    "latex": "O",
    "math": true
  },
  "𝛱": {
    "latex": "\\mathsl{\\Pi}",
    "math": true
  },
  "𝛲": {
    "latex": "\\mathsl{\\Rho}",
    "math": true
  },
  "𝛳": {
    "latex": "\\mathsl{\\vartheta}"
  },
  "𝛴": {
    "latex": "\\mathsl{\\Sigma}",
    "math": true
  },
  "𝛵": {
    "latex": "\\mathsl{\\Tau}",
    "math": true
  },
  "𝛶": {
    "latex": "\\mathsl{\\Upsilon}",
    "math": true
  },
  "𝛷": {
    "latex": "\\mathsl{\\Phi}",
    "math": true
  },
  "𝛸": {
    "latex": "\\mathsl{\\Chi}",
    "math": true
  },
  "𝛹": {
    "latex": "\\mathsl{\\Psi}",
    "math": true
  },
  "𝛺": {
    "latex": "\\mathsl{\\Omega}",
    "math": true
  },
  "𝛻": {
    "latex": "\\mathsl{\\nabla}",
    "math": true
  },
  "𝛼": {
    "latex": "\\mathsl{\\Alpha}",
    "math": true
  },
  "𝛽": {
    "latex": "\\mathsl{\\Beta}",
    "math": true
  },
  "𝛾": {
    "latex": "\\mathsl{\\Gamma}",
    "math": true
  },
  "𝛿": {
    "latex": "\\mathsl{\\Delta}",
    "math": true
  },
  "𝜀": {
    "latex": "\\mathsl{\\Epsilon}",
    "math": true
  },
  "𝜁": {
    "latex": "\\mathsl{\\Zeta}",
    "math": true
  },
  "𝜂": {
    "latex": "\\mathsl{\\Eta}",
    "math": true
  },
  "𝜃": {
    "latex": "\\mathsl{\\Theta}",
    "math": true
  },
  "𝜄": {
    "latex": "\\mathsl{\\Iota}",
    "math": true
  },
  "𝜅": {
    "latex": "\\mathsl{\\Kappa}",
    "math": true
  },
  "𝜆": {
    "latex": "\\mathsl{\\Lambda}",
    "math": true
  },
  "𝜇": {
    "latex": "M",
    "math": true
  },
  "𝜈": {
    "latex": "N",
    "math": true
  },
  "𝜉": {
    "latex": "\\mathsl{\\Xi}",
    "math": true
  },
  "𝜊": {
    "latex": "O",
    "math": true
  },
  "𝜋": {
    "latex": "\\mathsl{\\Pi}",
    "math": true
  },
  "𝜌": {
    "latex": "\\mathsl{\\Rho}",
    "math": true
  },
  "𝜍": {
    "latex": "\\mathsl{\\varsigma}",
    "math": true
  },
  "𝜎": {
    "latex": "\\mathsl{\\Sigma}",
    "math": true
  },
  "𝜏": {
    "latex": "\\mathsl{\\Tau}",
    "math": true
  },
  "𝜐": {
    "latex": "\\mathsl{\\Upsilon}",
    "math": true
  },
  "𝜑": {
    "latex": "\\mathsl{\\Phi}",
    "math": true
  },
  "𝜒": {
    "latex": "\\mathsl{\\Chi}",
    "math": true
  },
  "𝜓": {
    "latex": "\\mathsl{\\Psi}",
    "math": true
  },
  "𝜔": {
    "latex": "\\mathsl{\\Omega}",
    "math": true
  },
  "𝜕": {
    "latex": "\\partial",
    "math": true
  },
  "𝜖": {
    "latex": "\\in",
    "math": true
  },
  "𝜗": {
    "latex": "\\mathsl{\\vartheta}"
  },
  "𝜘": {
    "latex": "\\mathsl{\\varkappa}"
  },
  "𝜙": {
    "latex": "\\mathsl{\\phi}"
  },
  "𝜚": {
    "latex": "\\mathsl{\\varrho}"
  },
  "𝜛": {
    "latex": "\\mathsl{\\varpi}"
  },
  "𝜜": {
    "latex": "\\mathbit{\\Alpha}",
    "math": true
  },
  "𝜝": {
    "latex": "\\mathbit{\\Beta}",
    "math": true
  },
  "𝜞": {
    "latex": "\\mathbit{\\Gamma}",
    "math": true
  },
  "𝜟": {
    "latex": "\\mathbit{\\Delta}",
    "math": true
  },
  "𝜠": {
    "latex": "\\mathbit{\\Epsilon}",
    "math": true
  },
  "𝜡": {
    "latex": "\\mathbit{\\Zeta}",
    "math": true
  },
  "𝜢": {
    "latex": "\\mathbit{\\Eta}",
    "math": true
  },
  "𝜣": {
    "latex": "\\mathbit{\\Theta}",
    "math": true
  },
  "𝜤": {
    "latex": "\\mathbit{\\Iota}",
    "math": true
  },
  "𝜥": {
    "latex": "\\mathbit{\\Kappa}",
    "math": true
  },
  "𝜦": {
    "latex": "\\mathbit{\\Lambda}",
    "math": true
  },
  "𝜧": {
    "latex": "M",
    "math": true
  },
  "𝜨": {
    "latex": "N",
    "math": true
  },
  "𝜩": {
    "latex": "\\mathbit{\\Xi}",
    "math": true
  },
  "𝜪": {
    "latex": "O",
    "math": true
  },
  "𝜫": {
    "latex": "\\mathbit{\\Pi}",
    "math": true
  },
  "𝜬": {
    "latex": "\\mathbit{\\Rho}",
    "math": true
  },
  "𝜭": {
    "latex": "\\mathbit{O}"
  },
  "𝜮": {
    "latex": "\\mathbit{\\Sigma}",
    "math": true
  },
  "𝜯": {
    "latex": "\\mathbit{\\Tau}",
    "math": true
  },
  "𝜰": {
    "latex": "\\mathbit{\\Upsilon}",
    "math": true
  },
  "𝜱": {
    "latex": "\\mathbit{\\Phi}",
    "math": true
  },
  "𝜲": {
    "latex": "\\mathbit{\\Chi}",
    "math": true
  },
  "𝜳": {
    "latex": "\\mathbit{\\Psi}",
    "math": true
  },
  "𝜴": {
    "latex": "\\mathbit{\\Omega}",
    "math": true
  },
  "𝜵": {
    "latex": "\\mathbit{\\nabla}",
    "math": true
  },
  "𝜶": {
    "latex": "\\mathbit{\\Alpha}",
    "math": true
  },
  "𝜷": {
    "latex": "\\mathbit{\\Beta}",
    "math": true
  },
  "𝜸": {
    "latex": "\\mathbit{\\Gamma}",
    "math": true
  },
  "𝜹": {
    "latex": "\\mathbit{\\Delta}",
    "math": true
  },
  "𝜺": {
    "latex": "\\mathbit{\\Epsilon}",
    "math": true
  },
  "𝜻": {
    "latex": "\\mathbit{\\Zeta}",
    "math": true
  },
  "𝜼": {
    "latex": "\\mathbit{\\Eta}",
    "math": true
  },
  "𝜽": {
    "latex": "\\mathbit{\\Theta}",
    "math": true
  },
  "𝜾": {
    "latex": "\\mathbit{\\Iota}",
    "math": true
  },
  "𝜿": {
    "latex": "\\mathbit{\\Kappa}",
    "math": true
  },
  "𝝀": {
    "latex": "\\mathbit{\\Lambda}",
    "math": true
  },
  "𝝁": {
    "latex": "M",
    "math": true
  },
  "𝝂": {
    "latex": "N",
    "math": true
  },
  "𝝃": {
    "latex": "\\mathbit{\\Xi}",
    "math": true
  },
  "𝝄": {
    "latex": "O",
    "math": true
  },
  "𝝅": {
    "latex": "\\mathbit{\\Pi}",
    "math": true
  },
  "𝝆": {
    "latex": "\\mathbit{\\Rho}",
    "math": true
  },
  "𝝇": {
    "latex": "\\mathbit{\\varsigma}",
    "math": true
  },
  "𝝈": {
    "latex": "\\mathbit{\\Sigma}",
    "math": true
  },
  "𝝉": {
    "latex": "\\mathbit{\\Tau}",
    "math": true
  },
  "𝝊": {
    "latex": "\\mathbit{\\Upsilon}",
    "math": true
  },
  "𝝋": {
    "latex": "\\mathbit{\\Phi}",
    "math": true
  },
  "𝝌": {
    "latex": "\\mathbit{\\Chi}",
    "math": true
  },
  "𝝍": {
    "latex": "\\mathbit{\\Psi}",
    "math": true
  },
  "𝝎": {
    "latex": "\\mathbit{\\Omega}",
    "math": true
  },
  "𝝏": {
    "latex": "\\partial",
    "math": true
  },
  "𝝐": {
    "latex": "\\in",
    "math": true
  },
  "𝝑": {
    "latex": "\\mathbit{\\vartheta}"
  },
  "𝝒": {
    "latex": "\\mathbit{\\varkappa}"
  },
  "𝝓": {
    "latex": "\\mathbit{\\phi}"
  },
  "𝝔": {
    "latex": "\\mathbit{\\varrho}"
  },
  "𝝕": {
    "latex": "\\mathbit{\\varpi}"
  },
  "𝝖": {
    "latex": "\\mathsfbf{\\Alpha}",
    "math": true
  },
  "𝝗": {
    "latex": "\\mathsfbf{\\Beta}",
    "math": true
  },
  "𝝘": {
    "latex": "\\mathsfbf{\\Gamma}",
    "math": true
  },
  "𝝙": {
    "latex": "\\mathsfbf{\\Delta}",
    "math": true
  },
  "𝝚": {
    "latex": "\\mathsfbf{\\Epsilon}",
    "math": true
  },
  "𝝛": {
    "latex": "\\mathsfbf{\\Zeta}",
    "math": true
  },
  "𝝜": {
    "latex": "\\mathsfbf{\\Eta}",
    "math": true
  },
  "𝝝": {
    "latex": "\\mathsfbf{\\Theta}",
    "math": true
  },
  "𝝞": {
    "latex": "\\mathsfbf{\\Iota}",
    "math": true
  },
  "𝝟": {
    "latex": "\\mathsfbf{\\Kappa}",
    "math": true
  },
  "𝝠": {
    "latex": "\\mathsfbf{\\Lambda}",
    "math": true
  },
  "𝝡": {
    "latex": "M",
    "math": true
  },
  "𝝢": {
    "latex": "N",
    "math": true
  },
  "𝝣": {
    "latex": "\\mathsfbf{\\Xi}",
    "math": true
  },
  "𝝤": {
    "latex": "O",
    "math": true
  },
  "𝝥": {
    "latex": "\\mathsfbf{\\Pi}",
    "math": true
  },
  "𝝦": {
    "latex": "\\mathsfbf{\\Rho}",
    "math": true
  },
  "𝝧": {
    "latex": "\\mathsfbf{\\vartheta}"
  },
  "𝝨": {
    "latex": "\\mathsfbf{\\Sigma}",
    "math": true
  },
  "𝝩": {
    "latex": "\\mathsfbf{\\Tau}",
    "math": true
  },
  "𝝪": {
    "latex": "\\mathsfbf{\\Upsilon}",
    "math": true
  },
  "𝝫": {
    "latex": "\\mathsfbf{\\Phi}",
    "math": true
  },
  "𝝬": {
    "latex": "\\mathsfbf{\\Chi}",
    "math": true
  },
  "𝝭": {
    "latex": "\\mathsfbf{\\Psi}",
    "math": true
  },
  "𝝮": {
    "latex": "\\mathsfbf{\\Omega}",
    "math": true
  },
  "𝝯": {
    "latex": "\\mathsfbf{\\nabla}",
    "math": true
  },
  "𝝰": {
    "latex": "\\mathsfbf{\\Alpha}",
    "math": true
  },
  "𝝱": {
    "latex": "\\mathsfbf{\\Beta}",
    "math": true
  },
  "𝝲": {
    "latex": "\\mathsfbf{\\Gamma}",
    "math": true
  },
  "𝝳": {
    "latex": "\\mathsfbf{\\Delta}",
    "math": true
  },
  "𝝴": {
    "latex": "\\mathsfbf{\\Epsilon}",
    "math": true
  },
  "𝝵": {
    "latex": "\\mathsfbf{\\Zeta}",
    "math": true
  },
  "𝝶": {
    "latex": "\\mathsfbf{\\Eta}",
    "math": true
  },
  "𝝷": {
    "latex": "\\mathsfbf{\\Theta}",
    "math": true
  },
  "𝝸": {
    "latex": "\\mathsfbf{\\Iota}",
    "math": true
  },
  "𝝹": {
    "latex": "\\mathsfbf{\\Kappa}",
    "math": true
  },
  "𝝺": {
    "latex": "\\mathsfbf{\\Lambda}",
    "math": true
  },
  "𝝻": {
    "latex": "M",
    "math": true
  },
  "𝝼": {
    "latex": "N",
    "math": true
  },
  "𝝽": {
    "latex": "\\mathsfbf{\\Xi}",
    "math": true
  },
  "𝝾": {
    "latex": "O",
    "math": true
  },
  "𝝿": {
    "latex": "\\mathsfbf{\\Pi}",
    "math": true
  },
  "𝞀": {
    "latex": "\\mathsfbf{\\Rho}",
    "math": true
  },
  "𝞁": {
    "latex": "\\mathsfbf{\\varsigma}",
    "math": true
  },
  "𝞂": {
    "latex": "\\mathsfbf{\\Sigma}",
    "math": true
  },
  "𝞃": {
    "latex": "\\mathsfbf{\\Tau}",
    "math": true
  },
  "𝞄": {
    "latex": "\\mathsfbf{\\Upsilon}",
    "math": true
  },
  "𝞅": {
    "latex": "\\mathsfbf{\\Phi}",
    "math": true
  },
  "𝞆": {
    "latex": "\\mathsfbf{\\Chi}",
    "math": true
  },
  "𝞇": {
    "latex": "\\mathsfbf{\\Psi}",
    "math": true
  },
  "𝞈": {
    "latex": "\\mathsfbf{\\Omega}",
    "math": true
  },
  "𝞉": {
    "latex": "\\partial",
    "math": true
  },
  "𝞊": {
    "latex": "\\in",
    "math": true
  },
  "𝞋": {
    "latex": "\\mathsfbf{\\vartheta}"
  },
  "𝞌": {
    "latex": "\\mathsfbf{\\varkappa}"
  },
  "𝞍": {
    "latex": "\\mathsfbf{\\phi}"
  },
  "𝞎": {
    "latex": "\\mathsfbf{\\varrho}"
  },
  "𝞏": {
    "latex": "\\mathsfbf{\\varpi}"
  },
  "𝞐": {
    "latex": "\\mathsfbfsl{\\Alpha}",
    "math": true
  },
  "𝞑": {
    "latex": "\\mathsfbfsl{\\Beta}",
    "math": true
  },
  "𝞒": {
    "latex": "\\mathsfbfsl{\\Gamma}",
    "math": true
  },
  "𝞓": {
    "latex": "\\mathsfbfsl{\\Delta}",
    "math": true
  },
  "𝞔": {
    "latex": "\\mathsfbfsl{\\Epsilon}",
    "math": true
  },
  "𝞕": {
    "latex": "\\mathsfbfsl{\\Zeta}",
    "math": true
  },
  "𝞖": {
    "latex": "\\mathsfbfsl{\\Eta}",
    "math": true
  },
  "𝞗": {
    "latex": "\\mathsfbfsl{\\vartheta}",
    "math": true
  },
  "𝞘": {
    "latex": "\\mathsfbfsl{\\Iota}",
    "math": true
  },
  "𝞙": {
    "latex": "\\mathsfbfsl{\\Kappa}",
    "math": true
  },
  "𝞚": {
    "latex": "\\mathsfbfsl{\\Lambda}",
    "math": true
  },
  "𝞛": {
    "latex": "M",
    "math": true
  },
  "𝞜": {
    "latex": "N",
    "math": true
  },
  "𝞝": {
    "latex": "\\mathsfbfsl{\\Xi}",
    "math": true
  },
  "𝞞": {
    "latex": "O",
    "math": true
  },
  "𝞟": {
    "latex": "\\mathsfbfsl{\\Pi}",
    "math": true
  },
  "𝞠": {
    "latex": "\\mathsfbfsl{\\Rho}",
    "math": true
  },
  "𝞡": {
    "latex": "\\mathsfbfsl{\\vartheta}"
  },
  "𝞢": {
    "latex": "\\mathsfbfsl{\\Sigma}",
    "math": true
  },
  "𝞣": {
    "latex": "\\mathsfbfsl{\\Tau}",
    "math": true
  },
  "𝞤": {
    "latex": "\\mathsfbfsl{\\Upsilon}",
    "math": true
  },
  "𝞥": {
    "latex": "\\mathsfbfsl{\\Phi}",
    "math": true
  },
  "𝞦": {
    "latex": "\\mathsfbfsl{\\Chi}",
    "math": true
  },
  "𝞧": {
    "latex": "\\mathsfbfsl{\\Psi}",
    "math": true
  },
  "𝞨": {
    "latex": "\\mathsfbfsl{\\Omega}",
    "math": true
  },
  "𝞩": {
    "latex": "\\mathsfbfsl{\\nabla}",
    "math": true
  },
  "𝞪": {
    "latex": "\\mathsfbfsl{\\Alpha}",
    "math": true
  },
  "𝞫": {
    "latex": "\\mathsfbfsl{\\Beta}",
    "math": true
  },
  "𝞬": {
    "latex": "\\mathsfbfsl{\\Gamma}",
    "math": true
  },
  "𝞭": {
    "latex": "\\mathsfbfsl{\\Delta}",
    "math": true
  },
  "𝞮": {
    "latex": "\\mathsfbfsl{\\Epsilon}",
    "math": true
  },
  "𝞯": {
    "latex": "\\mathsfbfsl{\\Zeta}",
    "math": true
  },
  "𝞰": {
    "latex": "\\mathsfbfsl{\\Eta}",
    "math": true
  },
  "𝞱": {
    "latex": "\\mathsfbfsl{\\vartheta}",
    "math": true
  },
  "𝞲": {
    "latex": "\\mathsfbfsl{\\Iota}",
    "math": true
  },
  "𝞳": {
    "latex": "\\mathsfbfsl{\\Kappa}",
    "math": true
  },
  "𝞴": {
    "latex": "\\mathsfbfsl{\\Lambda}",
    "math": true
  },
  "𝞵": {
    "latex": "M",
    "math": true
  },
  "𝞶": {
    "latex": "N",
    "math": true
  },
  "𝞷": {
    "latex": "\\mathsfbfsl{\\Xi}",
    "math": true
  },
  "𝞸": {
    "latex": "O",
    "math": true
  },
  "𝞹": {
    "latex": "\\mathsfbfsl{\\Pi}",
    "math": true
  },
  "𝞺": {
    "latex": "\\mathsfbfsl{\\Rho}",
    "math": true
  },
  "𝞻": {
    "latex": "\\mathsfbfsl{\\varsigma}",
    "math": true
  },
  "𝞼": {
    "latex": "\\mathsfbfsl{\\Sigma}",
    "math": true
  },
  "𝞽": {
    "latex": "\\mathsfbfsl{\\Tau}",
    "math": true
  },
  "𝞾": {
    "latex": "\\mathsfbfsl{\\Upsilon}",
    "math": true
  },
  "𝞿": {
    "latex": "\\mathsfbfsl{\\Phi}",
    "math": true
  },
  "𝟀": {
    "latex": "\\mathsfbfsl{\\Chi}",
    "math": true
  },
  "𝟁": {
    "latex": "\\mathsfbfsl{\\Psi}",
    "math": true
  },
  "𝟂": {
    "latex": "\\mathsfbfsl{\\Omega}",
    "math": true
  },
  "𝟃": {
    "latex": "\\partial",
    "math": true
  },
  "𝟄": {
    "latex": "\\in",
    "math": true
  },
  "𝟅": {
    "latex": "\\mathsfbfsl{\\vartheta}"
  },
  "𝟆": {
    "latex": "\\mathsfbfsl{\\varkappa}"
  },
  "𝟇": {
    "latex": "\\mathsfbfsl{\\phi}"
  },
  "𝟈": {
    "latex": "\\mathsfbfsl{\\varrho}"
  },
  "𝟉": {
    "latex": "\\mathsfbfsl{\\varpi}"
  },
  "𝟎": {
    "latex": "\\mathbf{0}",
    "math": true
  },
  "𝟏": {
    "latex": "\\mathbf{1}",
    "math": true
  },
  "𝟐": {
    "latex": "\\mathbf{2}",
    "math": true
  },
  "𝟑": {
    "latex": "\\mathbf{3}",
    "math": true
  },
  "𝟒": {
    "latex": "\\mathbf{4}",
    "math": true
  },
  "𝟓": {
    "latex": "\\mathbf{5}",
    "math": true
  },
  "𝟔": {
    "latex": "\\mathbf{6}",
    "math": true
  },
  "𝟕": {
    "latex": "\\mathbf{7}",
    "math": true
  },
  "𝟖": {
    "latex": "\\mathbf{8}",
    "math": true
  },
  "𝟗": {
    "latex": "\\mathbf{9}",
    "math": true
  },
  "𝟘": {
    "latex": "\\mathbb{0}",
    "math": true
  },
  "𝟙": {
    "latex": "\\mathbb{1}",
    "math": true
  },
  "𝟚": {
    "latex": "\\mathbb{2}",
    "math": true
  },
  "𝟛": {
    "latex": "\\mathbb{3}",
    "math": true
  },
  "𝟜": {
    "latex": "\\mathbb{4}",
    "math": true
  },
  "𝟝": {
    "latex": "\\mathbb{5}",
    "math": true
  },
  "𝟞": {
    "latex": "\\mathbb{6}",
    "math": true
  },
  "𝟟": {
    "latex": "\\mathbb{7}",
    "math": true
  },
  "𝟠": {
    "latex": "\\mathbb{8}",
    "math": true
  },
  "𝟡": {
    "latex": "\\mathbb{9}",
    "math": true
  },
  "𝟢": {
    "latex": "\\mathsf{0}",
    "math": true
  },
  "𝟣": {
    "latex": "\\mathsf{1}",
    "math": true
  },
  "𝟤": {
    "latex": "\\mathsf{2}",
    "math": true
  },
  "𝟥": {
    "latex": "\\mathsf{3}",
    "math": true
  },
  "𝟦": {
    "latex": "\\mathsf{4}",
    "math": true
  },
  "𝟧": {
    "latex": "\\mathsf{5}",
    "math": true
  },
  "𝟨": {
    "latex": "\\mathsf{6}",
    "math": true
  },
  "𝟩": {
    "latex": "\\mathsf{7}",
    "math": true
  },
  "𝟪": {
    "latex": "\\mathsf{8}",
    "math": true
  },
  "𝟫": {
    "latex": "\\mathsf{9}",
    "math": true
  },
  "𝟬": {
    "latex": "\\mathsfbf{0}",
    "math": true
  },
  "𝟭": {
    "latex": "\\mathsfbf{1}",
    "math": true
  },
  "𝟮": {
    "latex": "\\mathsfbf{2}",
    "math": true
  },
  "𝟯": {
    "latex": "\\mathsfbf{3}",
    "math": true
  },
  "𝟰": {
    "latex": "\\mathsfbf{4}",
    "math": true
  },
  "𝟱": {
    "latex": "\\mathsfbf{5}",
    "math": true
  },
  "𝟲": {
    "latex": "\\mathsfbf{6}",
    "math": true
  },
  "𝟳": {
    "latex": "\\mathsfbf{7}",
    "math": true
  },
  "𝟴": {
    "latex": "\\mathsfbf{8}",
    "math": true
  },
  "𝟵": {
    "latex": "\\mathsfbf{9}",
    "math": true
  },
  "𝟶": {
    "latex": "\\mathtt{0}",
    "math": true
  },
  "𝟷": {
    "latex": "\\mathtt{1}",
    "math": true
  },
  "𝟸": {
    "latex": "\\mathtt{2}",
    "math": true
  },
  "𝟹": {
    "latex": "\\mathtt{3}",
    "math": true
  },
  "𝟺": {
    "latex": "\\mathtt{4}",
    "math": true
  },
  "𝟻": {
    "latex": "\\mathtt{5}",
    "math": true
  },
  "𝟼": {
    "latex": "\\mathtt{6}",
    "math": true
  },
  "𝟽": {
    "latex": "\\mathtt{7}",
    "math": true
  },
  "𝟾": {
    "latex": "\\mathtt{8}",
    "math": true
  },
  "𝟿": {
    "latex": "\\mathtt{9}",
    "math": true
  },
  "[": {
    "latex": "[",
    "math": true
  },
  "]": {
    "latex": "]",
    "math": true
  }
},
      unicode2latex_maxpattern: 3,

      latex2unicode: {
  "\\#": "#",
  "\\$": "$",
  "\\%": "%",
  "\\&": "&",
  "\\ast": "*",
  "\\textbackslash": "\\",
  "\\^{}": "^",
  "\\_": "_",
  "\\lbrace": "{",
  "\\vert": "|",
  "\\rbrace": "}",
  "\\textasciitilde": "~",
  " ": " ",
  "\\textexclamdown": "¡",
  "\\textcent": "¢",
  "\\textsterling": "£",
  "\\textcurrency": "¤",
  "\\textyen": "¥",
  "\\textbrokenbar": "¦",
  "\\textsection": "§",
  "\\textasciidieresis": "¨",
  "\\textcopyright": "©",
  "\\textordfeminine": "ª",
  "\\guillemotleft": "«",
  "\\lnot": "¬",
  "\\-": "­",
  "\\textregistered": "®",
  "\\textasciimacron": "¯",
  "\\textdegree": "°",
  "\\pm": "±",
  "{^2}": "²",
  "{^3}": "³",
  "\\textasciiacute": "´",
  "\\mathrm{\\mu}": "µ",
  "\\textparagraph": "¶",
  "\\cdot": "⋅",
  "\\c{}": "¸",
  "{^1}": "¹",
  "\\textordmasculine": "º",
  "\\guillemotright": "»",
  "\\textonequarter": "¼",
  "\\textonehalf": "½",
  "\\textthreequarters": "¾",
  "\\textquestiondown": "¿",
  "\\`{A}": "À",
  "\\'{A}": "Ά",
  "\\^{A}": "Â",
  "\\~{A}": "Ã",
  "\\\"{A}": "Ä",
  "\\AA": "Å",
  "\\AE": "Æ",
  "\\c{C}": "Ç",
  "\\`{E}": "È",
  "\\'{E}": "Έ",
  "\\^{E}": "Ê",
  "\\\"{E}": "Ë",
  "\\`{I}": "Ì",
  "\\'{I}": "Í",
  "\\^{I}": "Î",
  "\\\"{I}": "Ï",
  "\\DH": "Ð",
  "\\~{N}": "Ñ",
  "\\`{O}": "Ò",
  "\\'{O}": "Ó",
  "\\^{O}": "Ô",
  "\\~{O}": "Õ",
  "\\\"{O}": "Ö",
  "\\texttimes": "×",
  "\\O": "Ø",
  "\\`{U}": "Ù",
  "\\'{U}": "Ú",
  "\\^{U}": "Û",
  "\\\"{U}": "Ü",
  "\\'{Y}": "Ý",
  "\\TH": "Þ",
  "\\ss": "ß",
  "\\`{a}": "à",
  "\\'{a}": "á",
  "\\^{a}": "â",
  "\\~{a}": "ã",
  "\\\"{a}": "ä",
  "\\aa": "å",
  "\\ae": "æ",
  "\\c{c}": "ç",
  "\\`{e}": "è",
  "\\'{e}": "é",
  "\\^{e}": "ê",
  "\\\"{e}": "ë",
  "\\`{\\i}": "ì",
  "\\'{\\i}": "í",
  "\\^{\\i}": "î",
  "\\\"{\\i}": "ï",
  "\\dh": "ð",
  "\\~{n}": "ñ",
  "\\`{o}": "ò",
  "\\'{o}": "ό",
  "\\^{o}": "ô",
  "\\~{o}": "õ",
  "\\\"{o}": "ö",
  "\\div": "÷",
  "\\o": "ø",
  "\\`{u}": "ù",
  "\\'{u}": "ú",
  "\\^{u}": "û",
  "\\\"{u}": "ü",
  "\\'{y}": "ý",
  "\\th": "þ",
  "\\\"{y}": "ÿ",
  "\\={A}": "Ā",
  "\\={a}": "ā",
  "\\u{A}": "Ă",
  "\\u{a}": "ă",
  "\\k{A}": "Ą",
  "\\k{a}": "ą",
  "\\'{C}": "Ć",
  "\\'{c}": "ć",
  "\\^{C}": "Ĉ",
  "\\^{c}": "ĉ",
  "\\.{C}": "Ċ",
  "\\.{c}": "ċ",
  "\\v{C}": "Č",
  "\\v{c}": "č",
  "\\v{D}": "Ď",
  "\\v{d}": "ď",
  "\\DJ": "Đ",
  "\\dj": "đ",
  "\\={E}": "Ē",
  "\\={e}": "ē",
  "\\u{E}": "Ĕ",
  "\\u{e}": "ĕ",
  "\\.{E}": "Ė",
  "\\.{e}": "ė",
  "\\k{E}": "Ę",
  "\\k{e}": "ę",
  "\\v{E}": "Ě",
  "\\v{e}": "ě",
  "\\^{G}": "Ĝ",
  "\\^{g}": "ĝ",
  "\\u{G}": "Ğ",
  "\\u{g}": "ğ",
  "\\.{G}": "Ġ",
  "\\.{g}": "ġ",
  "\\c{G}": "Ģ",
  "\\c{g}": "ģ",
  "\\^{H}": "Ĥ",
  "\\^{h}": "ĥ",
  "{\\fontencoding{LELA}\\selectfont\\char40}": "Ħ",
  "\\Elzxh": "ħ",
  "\\~{I}": "Ĩ",
  "\\~{\\i}": "ĩ",
  "\\={I}": "Ī",
  "\\={\\i}": "ī",
  "\\u{I}": "Ĭ",
  "\\u{\\i}": "ĭ",
  "\\k{I}": "Į",
  "\\k{i}": "į",
  "\\.{I}": "İ",
  "\\i": "ı",
  "IJ": "Ĳ",
  "ij": "ĳ",
  "\\^{J}": "Ĵ",
  "\\^{\\j}": "ĵ",
  "\\c{K}": "Ķ",
  "\\c{k}": "ķ",
  "{\\fontencoding{LELA}\\selectfont\\char91}": "ĸ",
  "\\'{L}": "Ĺ",
  "\\'{l}": "ĺ",
  "\\c{L}": "Ļ",
  "\\c{l}": "ļ",
  "\\v{L}": "Ľ",
  "\\v{l}": "ľ",
  "{\\fontencoding{LELA}\\selectfont\\char201}": "Ŀ",
  "{\\fontencoding{LELA}\\selectfont\\char202}": "ŀ",
  "\\L": "Ł",
  "\\l": "ł",
  "\\'{N}": "Ń",
  "\\'{n}": "ń",
  "\\c{N}": "Ņ",
  "\\c{n}": "ņ",
  "\\v{N}": "Ň",
  "\\v{n}": "ň",
  "'n": "ŉ",
  "\\NG": "Ŋ",
  "\\ng": "ŋ",
  "\\={O}": "Ō",
  "\\={o}": "ō",
  "\\u{O}": "Ŏ",
  "\\u{o}": "ŏ",
  "\\H{O}": "Ő",
  "\\H{o}": "ő",
  "\\OE": "Œ",
  "\\oe": "œ",
  "\\'{R}": "Ŕ",
  "\\'{r}": "ŕ",
  "\\c{R}": "Ŗ",
  "\\c{r}": "ŗ",
  "\\v{R}": "Ř",
  "\\v{r}": "ř",
  "\\'{S}": "Ś",
  "\\'{s}": "ś",
  "\\^{S}": "Ŝ",
  "\\^{s}": "ŝ",
  "\\c{S}": "Ş",
  "\\c{s}": "ş",
  "\\v{S}": "Š",
  "\\v{s}": "š",
  "\\c{T}": "Ţ",
  "\\c{t}": "ţ",
  "\\v{T}": "Ť",
  "\\v{t}": "ť",
  "{\\fontencoding{LELA}\\selectfont\\char47}": "Ŧ",
  "{\\fontencoding{LELA}\\selectfont\\char63}": "ŧ",
  "\\~{U}": "Ũ",
  "\\~{u}": "ũ",
  "\\={U}": "Ū",
  "\\={u}": "ū",
  "\\u{U}": "Ŭ",
  "\\u{u}": "ŭ",
  "\\r{U}": "Ů",
  "\\r{u}": "ů",
  "\\H{U}": "Ű",
  "\\H{u}": "ű",
  "\\k{U}": "Ų",
  "\\k{u}": "ų",
  "\\^{W}": "Ŵ",
  "\\^{w}": "ŵ",
  "\\^{Y}": "Ŷ",
  "\\^{y}": "ŷ",
  "\\\"{Y}": "Ÿ",
  "\\'{Z}": "Ź",
  "\\'{z}": "ź",
  "\\.{Z}": "Ż",
  "\\.{z}": "ż",
  "\\v{Z}": "Ž",
  "\\v{z}": "ž",
  "f": "ƒ",
  "\\texthvlig": "ƕ",
  "\\textnrleg": "ƞ",
  "\\eth": "ƪ",
  "{\\fontencoding{LELA}\\selectfont\\char195}": "ƺ",
  "\\textdoublepipe": "ǂ",
  "\\'{g}": "ǵ",
  "\\Elztrna": "ɐ",
  "\\Elztrnsa": "ɒ",
  "\\Elzopeno": "ɔ",
  "\\Elzrtld": "ɖ",
  "{\\fontencoding{LEIP}\\selectfont\\char61}": "ɘ",
  "\\Elzschwa": "ə",
  "\\varepsilon": "ɛ",
  "g": "ɡ",
  "\\Elzpgamma": "ɣ",
  "\\Elzpbgam": "ɤ",
  "\\Elztrnh": "ɥ",
  "\\Elzbtdl": "ɬ",
  "\\Elzrtll": "ɭ",
  "\\Elztrnm": "ɯ",
  "\\Elztrnmlr": "ɰ",
  "\\Elzltlmr": "ɱ",
  "\\Elzltln": "ɲ",
  "\\Elzrtln": "ɳ",
  "\\Elzclomeg": "ɷ",
  "\\textphi": "ɸ",
  "\\Elztrnr": "ɹ",
  "\\Elztrnrl": "ɺ",
  "\\Elzrttrnr": "ɻ",
  "\\Elzrl": "ɼ",
  "\\Elzrtlr": "ɽ",
  "\\Elzfhr": "ɾ",
  "{\\fontencoding{LEIP}\\selectfont\\char202}": "ɿ",
  "\\Elzrtls": "ʂ",
  "\\Elzesh": "ʃ",
  "\\Elztrnt": "ʇ",
  "\\Elzrtlt": "ʈ",
  "\\Elzpupsil": "ʊ",
  "\\Elzpscrv": "ʋ",
  "\\Elzinvv": "ʌ",
  "\\Elzinvw": "ʍ",
  "\\Elztrny": "ʎ",
  "\\Elzrtlz": "ʐ",
  "\\Elzyogh": "ʒ",
  "\\Elzglst": "ʔ",
  "\\Elzreglst": "ʕ",
  "\\Elzinglst": "ʖ",
  "\\textturnk": "ʞ",
  "\\Elzdyogh": "ʤ",
  "\\Elztesh": "ʧ",
  "'": "’",
  "\\textasciicaron": "ˇ",
  "\\Elzverts": "ˈ",
  "\\Elzverti": "ˌ",
  "\\Elzlmrk": "ː",
  "\\Elzhlmrk": "ˑ",
  "\\Elzsbrhr": "˒",
  "\\Elzsblhr": "˓",
  "\\Elzrais": "˔",
  "\\Elzlow": "˕",
  "\\textasciibreve": "˘",
  "\\textperiodcentered": "˙",
  "\\r{}": "˚",
  "\\k{}": "˛",
  "\\texttildelow": "˜",
  "\\H{}": "˝",
  "\\tone{55}": "˥",
  "\\tone{44}": "˦",
  "\\tone{33}": "˧",
  "\\tone{22}": "˨",
  "\\tone{11}": "˩",
  "\\`": "̀",
  "\\'": "́",
  "\\^": "̂",
  "\\~": "̃",
  "\\=": "̄",
  "\\u": "̆",
  "\\.": "̇",
  "\\\"": "̈",
  "\\r": "̊",
  "\\H": "̋",
  "\\v": "̌",
  "\\cyrchar\\C": "̏",
  "{\\fontencoding{LECO}\\selectfont\\char177}": "̑",
  "{\\fontencoding{LECO}\\selectfont\\char184}": "̘",
  "{\\fontencoding{LECO}\\selectfont\\char185}": "̙",
  "\\Elzpalh": "̡",
  "\\Elzrh": "̢",
  "\\c": "̧",
  "\\k": "̨",
  "\\Elzsbbrg": "̪",
  "{\\fontencoding{LECO}\\selectfont\\char203}": "̫",
  "{\\fontencoding{LECO}\\selectfont\\char207}": "̯",
  "\\Elzxl": "̵",
  "\\Elzbar": "̶",
  "{\\fontencoding{LECO}\\selectfont\\char215}": "̷",
  "{\\fontencoding{LECO}\\selectfont\\char216}": "̸",
  "{\\fontencoding{LECO}\\selectfont\\char218}": "̺",
  "{\\fontencoding{LECO}\\selectfont\\char219}": "̻",
  "{\\fontencoding{LECO}\\selectfont\\char220}": "̼",
  "{\\fontencoding{LECO}\\selectfont\\char221}": "̽",
  "{\\fontencoding{LECO}\\selectfont\\char225}": "͡",
  "\\'{H}": "Ή",
  "\\'{}{I}": "Ί",
  "\\'{}O": "Ό",
  "\\mathrm{'Y}": "Ύ",
  "\\mathrm{'\\Omega}": "Ώ",
  "\\acute{\\ddot{\\iota}}": "ΐ",
  "\\Alpha": "Α",
  "\\Beta": "Β",
  "\\Gamma": "Γ",
  "\\Delta": "Δ",
  "\\Epsilon": "Ε",
  "\\Zeta": "Ζ",
  "\\Eta": "Η",
  "\\Theta": "Θ",
  "\\Iota": "Ι",
  "\\Kappa": "Κ",
  "\\Lambda": "Λ",
  "M": "𝞵",
  "N": "𝞶",
  "\\Xi": "Ξ",
  "O": "𝞸",
  "\\Pi": "Π",
  "\\Rho": "Ρ",
  "\\Sigma": "Σ",
  "\\Tau": "Τ",
  "\\Upsilon": "ϒ",
  "\\Phi": "Φ",
  "\\Chi": "Χ",
  "\\Psi": "Ψ",
  "\\Omega": "Ω",
  "\\mathrm{\\ddot{I}}": "Ϊ",
  "\\mathrm{\\ddot{Y}}": "Ϋ",
  "\\'{$\\alpha$}": "ά",
  "\\acute{\\epsilon}": "έ",
  "\\acute{\\eta}": "ή",
  "\\acute{\\iota}": "ί",
  "\\acute{\\ddot{\\upsilon}}": "ΰ",
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\epsilon": "ε",
  "\\zeta": "ζ",
  "\\eta": "η",
  "\\texttheta": "θ",
  "\\iota": "ι",
  "\\kappa": "κ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\nu": "ν",
  "\\xi": "ξ",
  "o": "ο",
  "\\pi": "π",
  "\\rho": "ρ",
  "\\varsigma": "ς",
  "\\sigma": "σ",
  "\\tau": "τ",
  "\\upsilon": "υ",
  "\\varphi": "φ",
  "\\chi": "χ",
  "\\psi": "ψ",
  "\\omega": "ω",
  "\\ddot{\\iota}": "ϊ",
  "\\ddot{\\upsilon}": "ϋ",
  "\\acute{\\upsilon}": "ύ",
  "\\acute{\\omega}": "ώ",
  "\\Pisymbol{ppi022}{87}": "ϐ",
  "\\textvartheta": "ϑ",
  "\\phi": "ϕ",
  "\\varpi": "ϖ",
  "\\Stigma": "Ϛ",
  "\\Digamma": "Ϝ",
  "\\digamma": "ϝ",
  "\\Koppa": "Ϟ",
  "\\Sampi": "Ϡ",
  "\\varkappa": "ϰ",
  "\\varrho": "ϱ",
  "\\textTheta": "ϴ",
  "\\backepsilon": "϶",
  "\\cyrchar\\CYRYO": "Ё",
  "\\cyrchar\\CYRDJE": "Ђ",
  "\\cyrchar{\\'\\CYRG}": "Ѓ",
  "\\cyrchar\\CYRIE": "Є",
  "\\cyrchar\\CYRDZE": "Ѕ",
  "\\cyrchar\\CYRII": "І",
  "\\cyrchar\\CYRYI": "Ї",
  "\\cyrchar\\CYRJE": "Ј",
  "\\cyrchar\\CYRLJE": "Љ",
  "\\cyrchar\\CYRNJE": "Њ",
  "\\cyrchar\\CYRTSHE": "Ћ",
  "\\cyrchar{\\'\\CYRK}": "Ќ",
  "\\cyrchar\\CYRUSHRT": "Ў",
  "\\cyrchar\\CYRDZHE": "Џ",
  "\\cyrchar\\CYRA": "А",
  "\\cyrchar\\CYRB": "Б",
  "\\cyrchar\\CYRV": "В",
  "\\cyrchar\\CYRG": "Г",
  "\\cyrchar\\CYRD": "Д",
  "\\cyrchar\\CYRE": "Е",
  "\\cyrchar\\CYRZH": "Ж",
  "\\cyrchar\\CYRZ": "З",
  "\\cyrchar\\CYRI": "И",
  "\\cyrchar\\CYRISHRT": "Й",
  "\\cyrchar\\CYRK": "К",
  "\\cyrchar\\CYRL": "Л",
  "\\cyrchar\\CYRM": "М",
  "\\cyrchar\\CYRN": "Н",
  "\\cyrchar\\CYRO": "О",
  "\\cyrchar\\CYRP": "П",
  "\\cyrchar\\CYRR": "Р",
  "\\cyrchar\\CYRS": "С",
  "\\cyrchar\\CYRT": "Т",
  "\\cyrchar\\CYRU": "У",
  "\\cyrchar\\CYRF": "Ф",
  "\\cyrchar\\CYRH": "Х",
  "\\cyrchar\\CYRC": "Ц",
  "\\cyrchar\\CYRCH": "Ч",
  "\\cyrchar\\CYRSH": "Ш",
  "\\cyrchar\\CYRSHCH": "Щ",
  "\\cyrchar\\CYRHRDSN": "Ъ",
  "\\cyrchar\\CYRERY": "Ы",
  "\\cyrchar\\CYRSFTSN": "Ь",
  "\\cyrchar\\CYREREV": "Э",
  "\\cyrchar\\CYRYU": "Ю",
  "\\cyrchar\\CYRYA": "Я",
  "\\cyrchar\\cyra": "а",
  "\\cyrchar\\cyrb": "б",
  "\\cyrchar\\cyrv": "в",
  "\\cyrchar\\cyrg": "г",
  "\\cyrchar\\cyrd": "д",
  "\\cyrchar\\cyre": "е",
  "\\cyrchar\\cyrzh": "ж",
  "\\cyrchar\\cyrz": "з",
  "\\cyrchar\\cyri": "и",
  "\\cyrchar\\cyrishrt": "й",
  "\\cyrchar\\cyrk": "к",
  "\\cyrchar\\cyrl": "л",
  "\\cyrchar\\cyrm": "м",
  "\\cyrchar\\cyrn": "н",
  "\\cyrchar\\cyro": "о",
  "\\cyrchar\\cyrp": "п",
  "\\cyrchar\\cyrr": "р",
  "\\cyrchar\\cyrs": "с",
  "\\cyrchar\\cyrt": "т",
  "\\cyrchar\\cyru": "у",
  "\\cyrchar\\cyrf": "ф",
  "\\cyrchar\\cyrh": "х",
  "\\cyrchar\\cyrc": "ц",
  "\\cyrchar\\cyrch": "ч",
  "\\cyrchar\\cyrsh": "ш",
  "\\cyrchar\\cyrshch": "щ",
  "\\cyrchar\\cyrhrdsn": "ъ",
  "\\cyrchar\\cyrery": "ы",
  "\\cyrchar\\cyrsftsn": "ь",
  "\\cyrchar\\cyrerev": "э",
  "\\cyrchar\\cyryu": "ю",
  "\\cyrchar\\cyrya": "я",
  "\\cyrchar\\cyryo": "ё",
  "\\cyrchar\\cyrdje": "ђ",
  "\\cyrchar{\\'\\cyrg}": "ѓ",
  "\\cyrchar\\cyrie": "є",
  "\\cyrchar\\cyrdze": "ѕ",
  "\\cyrchar\\cyrii": "і",
  "\\cyrchar\\cyryi": "ї",
  "\\cyrchar\\cyrje": "ј",
  "\\cyrchar\\cyrlje": "љ",
  "\\cyrchar\\cyrnje": "њ",
  "\\cyrchar\\cyrtshe": "ћ",
  "\\cyrchar{\\'\\cyrk}": "ќ",
  "\\cyrchar\\cyrushrt": "ў",
  "\\cyrchar\\cyrdzhe": "џ",
  "\\cyrchar\\CYROMEGA": "Ѡ",
  "\\cyrchar\\cyromega": "ѡ",
  "\\cyrchar\\CYRYAT": "Ѣ",
  "\\cyrchar\\CYRIOTE": "Ѥ",
  "\\cyrchar\\cyriote": "ѥ",
  "\\cyrchar\\CYRLYUS": "Ѧ",
  "\\cyrchar\\cyrlyus": "ѧ",
  "\\cyrchar\\CYRIOTLYUS": "Ѩ",
  "\\cyrchar\\cyriotlyus": "ѩ",
  "\\cyrchar\\CYRBYUS": "Ѫ",
  "\\cyrchar\\CYRIOTBYUS": "Ѭ",
  "\\cyrchar\\cyriotbyus": "ѭ",
  "\\cyrchar\\CYRKSI": "Ѯ",
  "\\cyrchar\\cyrksi": "ѯ",
  "\\cyrchar\\CYRPSI": "Ѱ",
  "\\cyrchar\\cyrpsi": "ѱ",
  "\\cyrchar\\CYRFITA": "Ѳ",
  "\\cyrchar\\CYRIZH": "Ѵ",
  "\\cyrchar\\CYRUK": "Ѹ",
  "\\cyrchar\\cyruk": "ѹ",
  "\\cyrchar\\CYROMEGARND": "Ѻ",
  "\\cyrchar\\cyromegarnd": "ѻ",
  "\\cyrchar\\CYROMEGATITLO": "Ѽ",
  "\\cyrchar\\cyromegatitlo": "ѽ",
  "\\cyrchar\\CYROT": "Ѿ",
  "\\cyrchar\\cyrot": "ѿ",
  "\\cyrchar\\CYRKOPPA": "Ҁ",
  "\\cyrchar\\cyrkoppa": "ҁ",
  "\\cyrchar\\cyrthousands": "҂",
  "\\cyrchar\\cyrhundredthousands": "҈",
  "\\cyrchar\\cyrmillions": "҉",
  "\\cyrchar\\CYRSEMISFTSN": "Ҍ",
  "\\cyrchar\\cyrsemisftsn": "ҍ",
  "\\cyrchar\\CYRRTICK": "Ҏ",
  "\\cyrchar\\cyrrtick": "ҏ",
  "\\cyrchar\\CYRGUP": "Ґ",
  "\\cyrchar\\cyrgup": "ґ",
  "\\cyrchar\\CYRGHCRS": "Ғ",
  "\\cyrchar\\cyrghcrs": "ғ",
  "\\cyrchar\\CYRGHK": "Ҕ",
  "\\cyrchar\\cyrghk": "ҕ",
  "\\cyrchar\\CYRZHDSC": "Җ",
  "\\cyrchar\\cyrzhdsc": "җ",
  "\\cyrchar\\CYRZDSC": "Ҙ",
  "\\cyrchar\\cyrzdsc": "ҙ",
  "\\cyrchar\\CYRKDSC": "Қ",
  "\\cyrchar\\cyrkdsc": "қ",
  "\\cyrchar\\CYRKVCRS": "Ҝ",
  "\\cyrchar\\cyrkvcrs": "ҝ",
  "\\cyrchar\\CYRKHCRS": "Ҟ",
  "\\cyrchar\\cyrkhcrs": "ҟ",
  "\\cyrchar\\CYRKBEAK": "Ҡ",
  "\\cyrchar\\cyrkbeak": "ҡ",
  "\\cyrchar\\CYRNDSC": "Ң",
  "\\cyrchar\\cyrndsc": "ң",
  "\\cyrchar\\CYRNG": "Ҥ",
  "\\cyrchar\\cyrng": "ҥ",
  "\\cyrchar\\CYRPHK": "Ҧ",
  "\\cyrchar\\cyrphk": "ҧ",
  "\\cyrchar\\CYRABHHA": "Ҩ",
  "\\cyrchar\\cyrabhha": "ҩ",
  "\\cyrchar\\CYRSDSC": "Ҫ",
  "\\cyrchar\\cyrsdsc": "ҫ",
  "\\cyrchar\\CYRTDSC": "Ҭ",
  "\\cyrchar\\cyrtdsc": "ҭ",
  "\\cyrchar\\CYRY": "Ү",
  "\\cyrchar\\cyry": "ү",
  "\\cyrchar\\CYRYHCRS": "Ұ",
  "\\cyrchar\\cyryhcrs": "ұ",
  "\\cyrchar\\CYRHDSC": "Ҳ",
  "\\cyrchar\\cyrhdsc": "ҳ",
  "\\cyrchar\\CYRTETSE": "Ҵ",
  "\\cyrchar\\cyrtetse": "ҵ",
  "\\cyrchar\\CYRCHRDSC": "Ҷ",
  "\\cyrchar\\cyrchrdsc": "ҷ",
  "\\cyrchar\\CYRCHVCRS": "Ҹ",
  "\\cyrchar\\cyrchvcrs": "ҹ",
  "\\cyrchar\\CYRSHHA": "Һ",
  "\\cyrchar\\cyrshha": "һ",
  "\\cyrchar\\CYRABHCH": "Ҽ",
  "\\cyrchar\\cyrabhch": "ҽ",
  "\\cyrchar\\CYRABHCHDSC": "Ҿ",
  "\\cyrchar\\cyrabhchdsc": "ҿ",
  "\\cyrchar\\CYRpalochka": "Ӏ",
  "\\cyrchar\\CYRKHK": "Ӄ",
  "\\cyrchar\\cyrkhk": "ӄ",
  "\\cyrchar\\CYRNHK": "Ӈ",
  "\\cyrchar\\cyrnhk": "ӈ",
  "\\cyrchar\\CYRCHLDSC": "Ӌ",
  "\\cyrchar\\cyrchldsc": "ӌ",
  "\\cyrchar\\CYRAE": "Ӕ",
  "\\cyrchar\\cyrae": "ӕ",
  "\\cyrchar\\CYRSCHWA": "Ә",
  "\\cyrchar\\cyrschwa": "ә",
  "\\cyrchar\\CYRABHDZE": "Ӡ",
  "\\cyrchar\\cyrabhdze": "ӡ",
  "\\cyrchar\\CYROTLD": "Ө",
  "\\cyrchar\\cyrotld": "ө",
  "\\hspace{0.6em}": " ",
  "\\hspace{1em}": " ",
  "\\hspace{0.33em}": " ",
  "\\hspace{0.25em}": " ",
  "\\hspace{0.166em}": " ",
  "\\hphantom{0}": " ",
  "\\hphantom{,}": " ",
  "\\hspace{0.167em}": " ",
  "\\;": "   ",
  "\\mkern1mu": " ",
  "-": "−",
  "\\textendash": "–",
  "\\textemdash": "—",
  "\\rule{1em}{1pt}": "―",
  "\\Vert": "‖",
  "`": "‘",
  ",": "‚",
  "\\Elzreapos": "‛",
  "``": "“",
  "''": "”",
  ",,": "„",
  "\\textdagger": "†",
  "\\textdaggerdbl": "‡",
  "\\textbullet": "•",
  ".": "․",
  "..": "‥",
  "\\ldots": "…",
  "\\textperthousand": "‰",
  "\\textpertenthousand": "‱",
  "{'}": "′",
  "{''}": "″",
  "{'''}": "‴",
  "\\backprime": "‵",
  "\\guilsinglleft": "‹",
  "\\guilsinglright": "›",
  "''''": "⁗",
  "\\mkern4mu": " ",
  "\\nolinebreak": "⁠",
  "\\ensuremath{\\Elzpes}": "₧",
  "\\mbox{\\texteuro}": "€",
  "\\dddot": "⃛",
  "\\ddddot": "⃜",
  "\\mathbb{C}": "ℂ",
  "\\mathscr{g}": "ℊ",
  "\\mathscr{H}": "ℋ",
  "\\mathfrak{H}": "ℌ",
  "\\mathbb{H}": "ℍ",
  "\\hslash": "ℏ",
  "\\mathscr{I}": "ℐ",
  "\\mathfrak{I}": "ℑ",
  "\\mathscr{L}": "ℒ",
  "\\mathscr{l}": "𝓁",
  "\\mathbb{N}": "ℕ",
  "\\cyrchar\\textnumero": "№",
  "\\wp": "℘",
  "\\mathbb{P}": "ℙ",
  "\\mathbb{Q}": "ℚ",
  "\\mathscr{R}": "ℛ",
  "\\mathfrak{R}": "ℜ",
  "\\mathbb{R}": "ℝ",
  "\\Elzxrat": "℞",
  "\\texttrademark": "™",
  "\\mathbb{Z}": "ℤ",
  "\\mho": "℧",
  "\\mathfrak{Z}": "ℨ",
  "\\ElsevierGlyph{2129}": "℩",
  "\\mathscr{B}": "ℬ",
  "\\mathfrak{C}": "ℭ",
  "\\mathscr{e}": "ℯ",
  "\\mathscr{E}": "ℰ",
  "\\mathscr{F}": "ℱ",
  "\\mathscr{M}": "ℳ",
  "\\mathscr{o}": "ℴ",
  "\\aleph": "ℵ",
  "\\beth": "ℶ",
  "\\gimel": "ℷ",
  "\\daleth": "ℸ",
  "\\textfrac{1}{3}": "⅓",
  "\\textfrac{2}{3}": "⅔",
  "\\textfrac{1}{5}": "⅕",
  "\\textfrac{2}{5}": "⅖",
  "\\textfrac{3}{5}": "⅗",
  "\\textfrac{4}{5}": "⅘",
  "\\textfrac{1}{6}": "⅙",
  "\\textfrac{5}{6}": "⅚",
  "\\textfrac{1}{8}": "⅛",
  "\\textfrac{3}{8}": "⅜",
  "\\textfrac{5}{8}": "⅝",
  "\\textfrac{7}{8}": "⅞",
  "\\leftarrow": "←",
  "\\uparrow": "↑",
  "\\rightarrow": "→",
  "\\downarrow": "↓",
  "\\leftrightarrow": "↔",
  "\\updownarrow": "↕",
  "\\nwarrow": "↖",
  "\\nearrow": "↗",
  "\\searrow": "↘",
  "\\swarrow": "↙",
  "\\nleftarrow": "↚",
  "\\nrightarrow": "↛",
  "\\arrowwaveright": "↝",
  "\\twoheadleftarrow": "↞",
  "\\twoheadrightarrow": "↠",
  "\\leftarrowtail": "↢",
  "\\rightarrowtail": "↣",
  "\\mapsto": "↦",
  "\\hookleftarrow": "↩",
  "\\hookrightarrow": "↪",
  "\\looparrowleft": "↫",
  "\\looparrowright": "↬",
  "\\leftrightsquigarrow": "↭",
  "\\nleftrightarrow": "↮",
  "\\Lsh": "↰",
  "\\Rsh": "↱",
  "\\ElsevierGlyph{21B3}": "↳",
  "\\curvearrowleft": "↶",
  "\\curvearrowright": "↷",
  "\\circlearrowleft": "↺",
  "\\circlearrowright": "↻",
  "\\leftharpoonup": "↼",
  "\\leftharpoondown": "↽",
  "\\upharpoonright": "↾",
  "\\upharpoonleft": "↿",
  "\\rightharpoonup": "⇀",
  "\\rightharpoondown": "⇁",
  "\\downharpoonright": "⇂",
  "\\downharpoonleft": "⇃",
  "\\rightleftarrows": "⇄",
  "\\dblarrowupdown": "⇅",
  "\\leftrightarrows": "⇆",
  "\\leftleftarrows": "⇇",
  "\\upuparrows": "⇈",
  "\\rightrightarrows": "⇉",
  "\\downdownarrows": "⇊",
  "\\leftrightharpoons": "⇋",
  "\\rightleftharpoons": "⇌",
  "\\nLeftarrow": "⇍",
  "\\nLeftrightarrow": "⇎",
  "\\nRightarrow": "⇏",
  "\\Leftarrow": "⇐",
  "\\Uparrow": "⇑",
  "\\Rightarrow": "⇒",
  "\\Downarrow": "⇓",
  "\\Leftrightarrow": "⇔",
  "\\Updownarrow": "⇕",
  "\\Lleftarrow": "⇚",
  "\\Rrightarrow": "⇛",
  "\\rightsquigarrow": "⇝",
  "\\DownArrowUpArrow": "⇵",
  "\\forall": "∀",
  "\\complement": "∁",
  "\\partial": "𝟃",
  "\\exists": "∃",
  "\\nexists": "∄",
  "\\varnothing": "∅",
  "\\nabla": "∇",
  "\\in": "𝟄",
  "\\not\\in": "∉",
  "\\ni": "∋",
  "\\not\\ni": "∌",
  "\\prod": "∏",
  "\\coprod": "∐",
  "\\sum": "∑",
  "\\mp": "∓",
  "\\dotplus": "∔",
  "\\setminus": "∖",
  "{_\\ast}": "∗",
  "\\circ": "∘",
  "\\bullet": "∙",
  "\\surd": "√",
  "\\propto": "∝",
  "\\infty": "∞",
  "\\rightangle": "∟",
  "\\angle": "∠",
  "\\measuredangle": "∡",
  "\\sphericalangle": "∢",
  "\\mid": "∣",
  "\\nmid": "∤",
  "\\parallel": "∥",
  "\\nparallel": "∦",
  "\\wedge": "∧",
  "\\vee": "∨",
  "\\cap": "∩",
  "\\cup": "∪",
  "\\int": "∫",
  "\\int\\!\\int": "∬",
  "\\int\\!\\int\\!\\int": "∭",
  "\\oint": "∮",
  "\\surfintegral": "∯",
  "\\volintegral": "∰",
  "\\clwintegral": "∱",
  "\\ElsevierGlyph{2232}": "∲",
  "\\ElsevierGlyph{2233}": "∳",
  "\\therefore": "∴",
  "\\because": "∵",
  "\\Colon": "∷",
  "\\ElsevierGlyph{2238}": "∸",
  "\\mathbin{{:}\\!\\!{-}\\!\\!{:}}": "∺",
  "\\homothetic": "∻",
  "\\sim": "∼",
  "\\backsim": "∽",
  "\\lazysinv": "∾",
  "\\wr": "≀",
  "\\not\\sim": "≁",
  "\\ElsevierGlyph{2242}": "≂",
  "\\NotEqualTilde": "≂̸",
  "\\simeq": "≃",
  "\\not\\simeq": "≄",
  "\\cong": "≅",
  "\\approxnotequal": "≆",
  "\\not\\cong": "≇",
  "\\approx": "≈",
  "\\not\\approx": "≉",
  "\\approxeq": "≊",
  "\\tildetrpl": "≋",
  "\\not\\apid": "≋̸",
  "\\allequal": "≌",
  "\\asymp": "≍",
  "\\Bumpeq": "≎",
  "\\NotHumpDownHump": "≎̸",
  "\\bumpeq": "≏",
  "\\NotHumpEqual": "≏̸",
  "\\doteq": "≐",
  "\\not\\doteq": "≐̸",
  "\\doteqdot": "≑",
  "\\fallingdotseq": "≒",
  "\\risingdotseq": "≓",
  ":=": "≔",
  "=:": "≕",
  "\\eqcirc": "≖",
  "\\circeq": "≗",
  "\\estimates": "≙",
  "\\ElsevierGlyph{225A}": "⩣",
  "\\starequal": "≛",
  "\\triangleq": "≜",
  "\\ElsevierGlyph{225F}": "≟",
  "\\not =": "≠",
  "\\equiv": "≡",
  "\\not\\equiv": "≢",
  "\\leq": "≤",
  "\\geq": "≥",
  "\\leqq": "≦",
  "\\geqq": "≧",
  "\\lneqq": "≨",
  "\\lvertneqq": "≨︀",
  "\\gneqq": "≩",
  "\\gvertneqq": "≩︀",
  "\\ll": "≪",
  "\\NotLessLess": "≪̸",
  "\\gg": "≫",
  "\\NotGreaterGreater": "≫̸",
  "\\between": "≬",
  "\\not\\kern-0.3em\\times": "≭",
  "\\not<": "≮",
  "\\not>": "≯",
  "\\not\\leq": "≰",
  "\\not\\geq": "≱",
  "\\lessequivlnt": "≲",
  "\\greaterequivlnt": "≳",
  "\\ElsevierGlyph{2274}": "≴",
  "\\ElsevierGlyph{2275}": "≵",
  "\\lessgtr": "≶",
  "\\gtrless": "≷",
  "\\notlessgreater": "≸",
  "\\notgreaterless": "≹",
  "\\prec": "≺",
  "\\succ": "≻",
  "\\preccurlyeq": "≼",
  "\\succcurlyeq": "≽",
  "\\precapprox": "⪷",
  "\\NotPrecedesTilde": "≾̸",
  "\\succapprox": "⪸",
  "\\NotSucceedsTilde": "≿̸",
  "\\not\\prec": "⊀",
  "\\not\\succ": "⊁",
  "\\subset": "⊂",
  "\\supset": "⊃",
  "\\not\\subset": "⊄",
  "\\not\\supset": "⊅",
  "\\subseteq": "⊆",
  "\\supseteq": "⊇",
  "\\not\\subseteq": "⊈",
  "\\not\\supseteq": "⊉",
  "\\subsetneq": "⊊",
  "\\varsubsetneqq": "⊊︀",
  "\\supsetneq": "⊋",
  "\\varsupsetneq": "⊋︀",
  "\\uplus": "⊎",
  "\\sqsubset": "⊏",
  "\\NotSquareSubset": "⊏̸",
  "\\sqsupset": "⊐",
  "\\NotSquareSuperset": "⊐̸",
  "\\sqsubseteq": "⊑",
  "\\sqsupseteq": "⊒",
  "\\sqcap": "⊓",
  "\\sqcup": "⊔",
  "\\oplus": "⊕",
  "\\ominus": "⊖",
  "\\otimes": "⊗",
  "\\oslash": "⊘",
  "\\odot": "⊙",
  "\\circledcirc": "⊚",
  "\\circledast": "⊛",
  "\\circleddash": "⊝",
  "\\boxplus": "⊞",
  "\\boxminus": "⊟",
  "\\boxtimes": "⊠",
  "\\boxdot": "⊡",
  "\\vdash": "⊢",
  "\\dashv": "⊣",
  "\\top": "⊤",
  "\\perp": "⊥",
  "\\truestate": "⊧",
  "\\forcesextra": "⊨",
  "\\Vdash": "⊩",
  "\\Vvdash": "⊪",
  "\\VDash": "⊫",
  "\\nvdash": "⊬",
  "\\nvDash": "⊭",
  "\\nVdash": "⊮",
  "\\nVDash": "⊯",
  "\\vartriangleleft": "⊲",
  "\\vartriangleright": "⊳",
  "\\trianglelefteq": "⊴",
  "\\trianglerighteq": "⊵",
  "\\original": "⊶",
  "\\image": "⊷",
  "\\multimap": "⊸",
  "\\hermitconjmatrix": "⊹",
  "\\intercal": "⊺",
  "\\veebar": "⊻",
  "\\rightanglearc": "⊾",
  "\\ElsevierGlyph{22C0}": "⋀",
  "\\ElsevierGlyph{22C1}": "⋁",
  "\\bigcap": "⋂",
  "\\bigcup": "⋃",
  "\\diamond": "♢",
  "\\star": "⋆",
  "\\divideontimes": "⋇",
  "\\bowtie": "⋈",
  "\\ltimes": "⋉",
  "\\rtimes": "⋊",
  "\\leftthreetimes": "⋋",
  "\\rightthreetimes": "⋌",
  "\\backsimeq": "⋍",
  "\\curlyvee": "⋎",
  "\\curlywedge": "⋏",
  "\\Subset": "⋐",
  "\\Supset": "⋑",
  "\\Cap": "⋒",
  "\\Cup": "⋓",
  "\\pitchfork": "⋔",
  "\\lessdot": "⋖",
  "\\gtrdot": "⋗",
  "\\verymuchless": "⋘",
  "\\verymuchgreater": "⋙",
  "\\lesseqgtr": "⋚",
  "\\gtreqless": "⋛",
  "\\curlyeqprec": "⋞",
  "\\curlyeqsucc": "⋟",
  "\\not\\sqsubseteq": "⋢",
  "\\not\\sqsupseteq": "⋣",
  "\\Elzsqspne": "⋥",
  "\\lnsim": "⋦",
  "\\gnsim": "⋧",
  "\\precedesnotsimilar": "⋨",
  "\\succnsim": "⋩",
  "\\ntriangleleft": "⋪",
  "\\ntriangleright": "⋫",
  "\\ntrianglelefteq": "⋬",
  "\\ntrianglerighteq": "⋭",
  "\\vdots": "⋮",
  "\\cdots": "⋯",
  "\\upslopeellipsis": "⋰",
  "\\downslopeellipsis": "⋱",
  "\\barwedge": "⌅",
  "\\perspcorrespond": "⩞",
  "\\lceil": "⌈",
  "\\rceil": "⌉",
  "\\lfloor": "⌊",
  "\\rfloor": "⌋",
  "\\recorder": "⌕",
  "\\mathchar\"2208": "⌖",
  "\\ulcorner": "⌜",
  "\\urcorner": "⌝",
  "\\llcorner": "⌞",
  "\\lrcorner": "⌟",
  "\\frown": "⌢",
  "\\smile": "⌣",
  "\\langle": "〈",
  "\\rangle": "〉",
  "\\ElsevierGlyph{E838}": "⌽",
  "\\Elzdlcorn": "⎣",
  "\\lmoustache": "⎰",
  "\\rmoustache": "⎱",
  "\\textvisiblespace": "␣",
  "\\ding{172}": "①",
  "\\ding{173}": "②",
  "\\ding{174}": "③",
  "\\ding{175}": "④",
  "\\ding{176}": "⑤",
  "\\ding{177}": "⑥",
  "\\ding{178}": "⑦",
  "\\ding{179}": "⑧",
  "\\ding{180}": "⑨",
  "\\ding{181}": "⑩",
  "\\circledS": "Ⓢ",
  "\\Elzdshfnc": "┆",
  "\\Elzsqfnw": "┙",
  "\\diagup": "╱",
  "\\ding{110}": "■",
  "\\square": "□",
  "\\blacksquare": "▪",
  "\\fbox{~~}": "▭",
  "\\Elzvrecto": "▯",
  "\\ElsevierGlyph{E381}": "▱",
  "\\ding{115}": "▲",
  "\\bigtriangleup": "△",
  "\\blacktriangle": "▴",
  "\\vartriangle": "▵",
  "\\blacktriangleright": "▸",
  "\\triangleright": "▹",
  "\\ding{116}": "▼",
  "\\bigtriangledown": "▽",
  "\\blacktriangledown": "▾",
  "\\triangledown": "▿",
  "\\blacktriangleleft": "◂",
  "\\triangleleft": "◃",
  "\\ding{117}": "◆",
  "\\lozenge": "◊",
  "\\bigcirc": "◯",
  "\\ding{108}": "●",
  "\\Elzcirfl": "◐",
  "\\Elzcirfr": "◑",
  "\\Elzcirfb": "◒",
  "\\ding{119}": "◗",
  "\\Elzrvbull": "◘",
  "\\Elzsqfl": "◧",
  "\\Elzsqfr": "◨",
  "\\Elzsqfse": "◪",
  "\\ding{72}": "★",
  "\\ding{73}": "✩",
  "\\ding{37}": "☎",
  "\\ding{42}": "☛",
  "\\ding{43}": "☞",
  "\\rightmoon": "☾",
  "\\mercury": "☿",
  "\\venus": "♀",
  "\\male": "♂",
  "\\jupiter": "♃",
  "\\saturn": "♄",
  "\\uranus": "♅",
  "\\neptune": "♆",
  "\\pluto": "♇",
  "\\aries": "♈",
  "\\taurus": "♉",
  "\\gemini": "♊",
  "\\cancer": "♋",
  "\\leo": "♌",
  "\\virgo": "♍",
  "\\libra": "♎",
  "\\scorpio": "♏",
  "\\sagittarius": "♐",
  "\\capricornus": "♑",
  "\\aquarius": "♒",
  "\\pisces": "♓",
  "\\ding{171}": "♠",
  "\\ding{168}": "♣",
  "\\ding{170}": "♥",
  "\\ding{169}": "♦",
  "\\quarternote": "♩",
  "\\eighthnote": "♪",
  "\\flat": "♭",
  "\\natural": "♮",
  "\\sharp": "♯",
  "\\ding{33}": "✁",
  "\\ding{34}": "✂",
  "\\ding{35}": "✃",
  "\\ding{36}": "✄",
  "\\ding{38}": "✆",
  "\\ding{39}": "✇",
  "\\ding{40}": "✈",
  "\\ding{41}": "✉",
  "\\ding{44}": "✌",
  "\\ding{45}": "✍",
  "\\ding{46}": "✎",
  "\\ding{47}": "✏",
  "\\ding{48}": "✐",
  "\\ding{49}": "✑",
  "\\ding{50}": "✒",
  "\\ding{51}": "✓",
  "\\ding{52}": "✔",
  "\\ding{53}": "✕",
  "\\ding{54}": "✖",
  "\\ding{55}": "✗",
  "\\ding{56}": "✘",
  "\\ding{57}": "✙",
  "\\ding{58}": "✚",
  "\\ding{59}": "✛",
  "\\ding{60}": "✜",
  "\\ding{61}": "✝",
  "\\ding{62}": "✞",
  "\\ding{63}": "✟",
  "\\ding{64}": "✠",
  "\\ding{65}": "✡",
  "\\ding{66}": "✢",
  "\\ding{67}": "✣",
  "\\ding{68}": "✤",
  "\\ding{69}": "✥",
  "\\ding{70}": "✦",
  "\\ding{71}": "✧",
  "\\ding{74}": "✪",
  "\\ding{75}": "✫",
  "\\ding{76}": "✬",
  "\\ding{77}": "✭",
  "\\ding{78}": "✮",
  "\\ding{79}": "✯",
  "\\ding{80}": "✰",
  "\\ding{81}": "✱",
  "\\ding{82}": "✲",
  "\\ding{83}": "✳",
  "\\ding{84}": "✴",
  "\\ding{85}": "✵",
  "\\ding{86}": "✶",
  "\\ding{87}": "✷",
  "\\ding{88}": "✸",
  "\\ding{89}": "✹",
  "\\ding{90}": "✺",
  "\\ding{91}": "✻",
  "\\ding{92}": "✼",
  "\\ding{93}": "✽",
  "\\ding{94}": "✾",
  "\\ding{95}": "✿",
  "\\ding{96}": "❀",
  "\\ding{97}": "❁",
  "\\ding{98}": "❂",
  "\\ding{99}": "❃",
  "\\ding{100}": "❄",
  "\\ding{101}": "❅",
  "\\ding{102}": "❆",
  "\\ding{103}": "❇",
  "\\ding{104}": "❈",
  "\\ding{105}": "❉",
  "\\ding{106}": "❊",
  "\\ding{107}": "❋",
  "\\ding{109}": "❍",
  "\\ding{111}": "❏",
  "\\ding{112}": "❐",
  "\\ding{113}": "❑",
  "\\ding{114}": "❒",
  "\\ding{118}": "❖",
  "\\ding{120}": "❘",
  "\\ding{121}": "❙",
  "\\ding{122}": "❚",
  "\\ding{123}": "❛",
  "\\ding{124}": "❜",
  "\\ding{125}": "❝",
  "\\ding{126}": "❞",
  "\\ding{161}": "❡",
  "\\ding{162}": "❢",
  "\\ding{163}": "❣",
  "\\ding{164}": "❤",
  "\\ding{165}": "❥",
  "\\ding{166}": "❦",
  "\\ding{167}": "❧",
  "\\ding{182}": "❶",
  "\\ding{183}": "❷",
  "\\ding{184}": "❸",
  "\\ding{185}": "❹",
  "\\ding{186}": "❺",
  "\\ding{187}": "❻",
  "\\ding{188}": "❼",
  "\\ding{189}": "❽",
  "\\ding{190}": "❾",
  "\\ding{191}": "❿",
  "\\ding{192}": "➀",
  "\\ding{193}": "➁",
  "\\ding{194}": "➂",
  "\\ding{195}": "➃",
  "\\ding{196}": "➄",
  "\\ding{197}": "➅",
  "\\ding{198}": "➆",
  "\\ding{199}": "➇",
  "\\ding{200}": "➈",
  "\\ding{201}": "➉",
  "\\ding{202}": "➊",
  "\\ding{203}": "➋",
  "\\ding{204}": "➌",
  "\\ding{205}": "➍",
  "\\ding{206}": "➎",
  "\\ding{207}": "➏",
  "\\ding{208}": "➐",
  "\\ding{209}": "➑",
  "\\ding{210}": "➒",
  "\\ding{211}": "➓",
  "\\ding{212}": "➔",
  "\\ding{216}": "➘",
  "\\ding{217}": "➙",
  "\\ding{218}": "➚",
  "\\ding{219}": "➛",
  "\\ding{220}": "➜",
  "\\ding{221}": "➝",
  "\\ding{222}": "➞",
  "\\ding{223}": "➟",
  "\\ding{224}": "➠",
  "\\ding{225}": "➡",
  "\\ding{226}": "➢",
  "\\ding{227}": "➣",
  "\\ding{228}": "➤",
  "\\ding{229}": "➥",
  "\\ding{230}": "➦",
  "\\ding{231}": "➧",
  "\\ding{232}": "➨",
  "\\ding{233}": "➩",
  "\\ding{234}": "➪",
  "\\ding{235}": "➫",
  "\\ding{236}": "➬",
  "\\ding{237}": "➭",
  "\\ding{238}": "➮",
  "\\ding{239}": "➯",
  "\\ding{241}": "➱",
  "\\ding{242}": "➲",
  "\\ding{243}": "➳",
  "\\ding{244}": "➴",
  "\\ding{245}": "➵",
  "\\ding{246}": "➶",
  "\\ding{247}": "➷",
  "\\ding{248}": "➸",
  "\\ding{249}": "➹",
  "\\ding{250}": "➺",
  "\\ding{251}": "➻",
  "\\ding{252}": "➼",
  "\\ding{253}": "➽",
  "\\ding{254}": "➾",
  "\\longleftarrow": "⟵",
  "\\longrightarrow": "⟶",
  "\\longleftrightarrow": "⟷",
  "\\Longleftarrow": "⟸",
  "\\Longrightarrow": "⟹",
  "\\Longleftrightarrow": "⟺",
  "\\longmapsto": "⟼",
  "\\sim\\joinrel\\leadsto": "⟿",
  "\\ElsevierGlyph{E212}": "⤅",
  "\\UpArrowBar": "⤒",
  "\\DownArrowBar": "⤓",
  "\\ElsevierGlyph{E20C}": "⤣",
  "\\ElsevierGlyph{E20D}": "⤤",
  "\\ElsevierGlyph{E20B}": "⤥",
  "\\ElsevierGlyph{E20A}": "⤦",
  "\\ElsevierGlyph{E211}": "⤧",
  "\\ElsevierGlyph{E20E}": "⤨",
  "\\ElsevierGlyph{E20F}": "⤩",
  "\\ElsevierGlyph{E210}": "⤪",
  "\\ElsevierGlyph{E21C}": "⤳",
  "\\ElsevierGlyph{E21D}": "⤳̸",
  "\\ElsevierGlyph{E21A}": "⤶",
  "\\ElsevierGlyph{E219}": "⤷",
  "\\Elolarr": "⥀",
  "\\Elorarr": "⥁",
  "\\ElzRlarr": "⥂",
  "\\ElzrLarr": "⥄",
  "\\Elzrarrx": "⥇",
  "\\LeftRightVector": "⥎",
  "\\RightUpDownVector": "⥏",
  "\\DownLeftRightVector": "⥐",
  "\\LeftUpDownVector": "⥑",
  "\\LeftVectorBar": "⥒",
  "\\RightVectorBar": "⥓",
  "\\RightUpVectorBar": "⥔",
  "\\RightDownVectorBar": "⥕",
  "\\DownLeftVectorBar": "⥖",
  "\\DownRightVectorBar": "⥗",
  "\\LeftUpVectorBar": "⥘",
  "\\LeftDownVectorBar": "⥙",
  "\\LeftTeeVector": "⥚",
  "\\RightTeeVector": "⥛",
  "\\RightUpTeeVector": "⥜",
  "\\RightDownTeeVector": "⥝",
  "\\DownLeftTeeVector": "⥞",
  "\\DownRightTeeVector": "⥟",
  "\\LeftUpTeeVector": "⥠",
  "\\LeftDownTeeVector": "⥡",
  "\\UpEquilibrium": "⥮",
  "\\ReverseUpEquilibrium": "⥯",
  "\\RoundImplies": "⥰",
  "\\ElsevierGlyph{E214}": "⥼",
  "\\ElsevierGlyph{E215}": "⥽",
  "\\Elztfnc": "⦀",
  "\\ElsevierGlyph{3018}": "〘",
  "\\Elroang": "⦆",
  "<\\kern-0.58em(": "⦓",
  "\\ElsevierGlyph{E291}": "⦔",
  "\\Elzddfnc": "⦙",
  "\\Angle": "⦜",
  "\\Elzlpargt": "⦠",
  "\\ElsevierGlyph{E260}": "⦵",
  "\\ElsevierGlyph{E61B}": "⦶",
  "\\ElzLap": "⧊",
  "\\Elzdefas": "⧋",
  "\\LeftTriangleBar": "⧏",
  "\\NotLeftTriangleBar": "⧏̸",
  "\\RightTriangleBar": "⧐",
  "\\NotRightTriangleBar": "⧐̸",
  "\\ElsevierGlyph{E372}": "⧜",
  "\\blacklozenge": "⧫",
  "\\RuleDelayed": "⧴",
  "\\Elxuplus": "⨄",
  "\\ElzThr": "⨅",
  "\\Elxsqcup": "⨆",
  "\\ElzInf": "⨇",
  "\\ElzSup": "⨈",
  "\\ElzCint": "⨍",
  "\\clockoint": "⨏",
  "\\ElsevierGlyph{E395}": "⨐",
  "\\sqrint": "⨖",
  "\\ElsevierGlyph{E25A}": "⨥",
  "\\ElsevierGlyph{E25B}": "⨪",
  "\\ElsevierGlyph{E25C}": "⨭",
  "\\ElsevierGlyph{E25D}": "⨮",
  "\\ElzTimes": "⨯",
  "\\ElsevierGlyph{E25E}": "⨵",
  "\\ElsevierGlyph{E259}": "⨼",
  "\\amalg": "⨿",
  "\\ElzAnd": "⩓",
  "\\ElzOr": "⩔",
  "\\ElsevierGlyph{E36E}": "⩕",
  "\\ElOr": "⩖",
  "\\Elzminhat": "⩟",
  "\\stackrel{*}{=}": "⩮",
  "\\Equal": "⩵",
  "\\leqslant": "⩽",
  "\\nleqslant": "⩽̸",
  "\\geqslant": "⩾",
  "\\ngeqslant": "⩾̸",
  "\\lessapprox": "⪅",
  "\\gtrapprox": "⪆",
  "\\lneq": "⪇",
  "\\gneq": "⪈",
  "\\lnapprox": "⪉",
  "\\gnapprox": "⪊",
  "\\lesseqqgtr": "⪋",
  "\\gtreqqless": "⪌",
  "\\eqslantless": "⪕",
  "\\eqslantgtr": "⪖",
  "\\Pisymbol{ppi020}{117}": "⪝",
  "\\Pisymbol{ppi020}{105}": "⪞",
  "\\NestedLessLess": "⪡",
  "\\NotNestedLessLess": "⪡̸",
  "\\NestedGreaterGreater": "⪢",
  "\\NotNestedGreaterGreater": "⪢̸",
  "\\preceq": "⪯",
  "\\not\\preceq": "⪯̸",
  "\\succeq": "⪰",
  "\\not\\succeq": "⪰̸",
  "\\precneqq": "⪵",
  "\\succneqq": "⪶",
  "\\precnapprox": "⪹",
  "\\succnapprox": "⪺",
  "\\subseteqq": "⫅",
  "\\nsubseteqq": "⫅̸",
  "\\supseteqq": "⫆",
  "\\nsupseteqq": "⫆̸",
  "\\subsetneqq": "⫋",
  "\\supsetneqq": "⫌",
  "\\ElsevierGlyph{E30D}": "⫫",
  "\\Elztdcol": "⫶",
  "{{/}\\!\\!{/}}": "⫽",
  "{\\rlap{\\textbackslash}{{/}\\!\\!{/}}}": "⫽⃥",
  "\\ElsevierGlyph{300A}": "《",
  "\\ElsevierGlyph{300B}": "》",
  "\\ElsevierGlyph{3019}": "〙",
  "\\openbracketleft": "〚",
  "\\openbracketright": "〛",
  "ff": "ﬀ",
  "fi": "ﬁ",
  "fl": "ﬂ",
  "ffi": "ﬃ",
  "ffl": "ﬄ",
  "\\mathbf{A}": "𝐀",
  "\\mathbf{B}": "𝐁",
  "\\mathbf{C}": "𝐂",
  "\\mathbf{D}": "𝐃",
  "\\mathbf{E}": "𝐄",
  "\\mathbf{F}": "𝐅",
  "\\mathbf{G}": "𝐆",
  "\\mathbf{H}": "𝐇",
  "\\mathbf{I}": "𝐈",
  "\\mathbf{J}": "𝐉",
  "\\mathbf{K}": "𝐊",
  "\\mathbf{L}": "𝐋",
  "\\mathbf{M}": "𝐌",
  "\\mathbf{N}": "𝐍",
  "\\mathbf{O}": "𝐎",
  "\\mathbf{P}": "𝐏",
  "\\mathbf{Q}": "𝐐",
  "\\mathbf{R}": "𝐑",
  "\\mathbf{S}": "𝐒",
  "\\mathbf{T}": "𝐓",
  "\\mathbf{U}": "𝐔",
  "\\mathbf{V}": "𝐕",
  "\\mathbf{W}": "𝐖",
  "\\mathbf{X}": "𝐗",
  "\\mathbf{Y}": "𝐘",
  "\\mathbf{Z}": "𝐙",
  "\\mathbf{a}": "𝐚",
  "\\mathbf{b}": "𝐛",
  "\\mathbf{c}": "𝐜",
  "\\mathbf{d}": "𝐝",
  "\\mathbf{e}": "𝐞",
  "\\mathbf{f}": "𝐟",
  "\\mathbf{g}": "𝐠",
  "\\mathbf{h}": "𝐡",
  "\\mathbf{i}": "𝐢",
  "\\mathbf{j}": "𝐣",
  "\\mathbf{k}": "𝐤",
  "\\mathbf{l}": "𝐥",
  "\\mathbf{m}": "𝐦",
  "\\mathbf{n}": "𝐧",
  "\\mathbf{o}": "𝐨",
  "\\mathbf{p}": "𝐩",
  "\\mathbf{q}": "𝐪",
  "\\mathbf{r}": "𝐫",
  "\\mathbf{s}": "𝐬",
  "\\mathbf{t}": "𝐭",
  "\\mathbf{u}": "𝐮",
  "\\mathbf{v}": "𝐯",
  "\\mathbf{w}": "𝐰",
  "\\mathbf{x}": "𝐱",
  "\\mathbf{y}": "𝐲",
  "\\mathbf{z}": "𝐳",
  "\\mathsl{A}": "𝐴",
  "\\mathsl{B}": "𝐵",
  "\\mathsl{C}": "𝐶",
  "\\mathsl{D}": "𝐷",
  "\\mathsl{E}": "𝐸",
  "\\mathsl{F}": "𝐹",
  "\\mathsl{G}": "𝐺",
  "\\mathsl{H}": "𝐻",
  "\\mathsl{I}": "𝐼",
  "\\mathsl{J}": "𝐽",
  "\\mathsl{K}": "𝐾",
  "\\mathsl{L}": "𝐿",
  "\\mathsl{M}": "𝑀",
  "\\mathsl{N}": "𝑁",
  "\\mathsl{O}": "𝑂",
  "\\mathsl{P}": "𝑃",
  "\\mathsl{Q}": "𝑄",
  "\\mathsl{R}": "𝑅",
  "\\mathsl{S}": "𝑆",
  "\\mathsl{T}": "𝑇",
  "\\mathsl{U}": "𝑈",
  "\\mathsl{V}": "𝑉",
  "\\mathsl{W}": "𝑊",
  "\\mathsl{X}": "𝑋",
  "\\mathsl{Y}": "𝑌",
  "\\mathsl{Z}": "𝑍",
  "\\mathsl{a}": "𝑎",
  "\\mathsl{b}": "𝑏",
  "\\mathsl{c}": "𝑐",
  "\\mathsl{d}": "𝑑",
  "\\mathsl{e}": "𝑒",
  "\\mathsl{f}": "𝑓",
  "\\mathsl{g}": "𝑔",
  "\\mathsl{i}": "𝑖",
  "\\mathsl{j}": "𝑗",
  "\\mathsl{k}": "𝑘",
  "\\mathsl{l}": "𝑙",
  "\\mathsl{m}": "𝑚",
  "\\mathsl{n}": "𝑛",
  "\\mathsl{o}": "𝑜",
  "\\mathsl{p}": "𝑝",
  "\\mathsl{q}": "𝑞",
  "\\mathsl{r}": "𝑟",
  "\\mathsl{s}": "𝑠",
  "\\mathsl{t}": "𝑡",
  "\\mathsl{u}": "𝑢",
  "\\mathsl{v}": "𝑣",
  "\\mathsl{w}": "𝑤",
  "\\mathsl{x}": "𝑥",
  "\\mathsl{y}": "𝑦",
  "\\mathsl{z}": "𝑧",
  "\\mathbit{A}": "𝑨",
  "\\mathbit{B}": "𝑩",
  "\\mathbit{C}": "𝑪",
  "\\mathbit{D}": "𝑫",
  "\\mathbit{E}": "𝑬",
  "\\mathbit{F}": "𝑭",
  "\\mathbit{G}": "𝑮",
  "\\mathbit{H}": "𝑯",
  "\\mathbit{I}": "𝑰",
  "\\mathbit{J}": "𝑱",
  "\\mathbit{K}": "𝑲",
  "\\mathbit{L}": "𝑳",
  "\\mathbit{M}": "𝑴",
  "\\mathbit{N}": "𝑵",
  "\\mathbit{O}": "𝜭",
  "\\mathbit{P}": "𝑷",
  "\\mathbit{Q}": "𝑸",
  "\\mathbit{R}": "𝑹",
  "\\mathbit{S}": "𝑺",
  "\\mathbit{T}": "𝑻",
  "\\mathbit{U}": "𝑼",
  "\\mathbit{V}": "𝑽",
  "\\mathbit{W}": "𝑾",
  "\\mathbit{X}": "𝑿",
  "\\mathbit{Y}": "𝒀",
  "\\mathbit{Z}": "𝒁",
  "\\mathbit{a}": "𝒂",
  "\\mathbit{b}": "𝒃",
  "\\mathbit{c}": "𝒄",
  "\\mathbit{d}": "𝒅",
  "\\mathbit{e}": "𝒆",
  "\\mathbit{f}": "𝒇",
  "\\mathbit{g}": "𝒈",
  "\\mathbit{h}": "𝒉",
  "\\mathbit{i}": "𝒊",
  "\\mathbit{j}": "𝒋",
  "\\mathbit{k}": "𝒌",
  "\\mathbit{l}": "𝒍",
  "\\mathbit{m}": "𝒎",
  "\\mathbit{n}": "𝒏",
  "\\mathbit{o}": "𝒐",
  "\\mathbit{p}": "𝒑",
  "\\mathbit{q}": "𝒒",
  "\\mathbit{r}": "𝒓",
  "\\mathbit{s}": "𝒔",
  "\\mathbit{t}": "𝒕",
  "\\mathbit{u}": "𝒖",
  "\\mathbit{v}": "𝒗",
  "\\mathbit{w}": "𝒘",
  "\\mathbit{x}": "𝒙",
  "\\mathbit{y}": "𝒚",
  "\\mathbit{z}": "𝒛",
  "\\mathscr{A}": "𝒜",
  "\\mathscr{C}": "𝒞",
  "\\mathscr{D}": "𝒟",
  "\\mathscr{G}": "𝒢",
  "\\mathscr{J}": "𝒥",
  "\\mathscr{K}": "𝒦",
  "\\mathscr{N}": "𝒩",
  "\\mathscr{O}": "𝒪",
  "\\mathscr{P}": "𝒫",
  "\\mathscr{Q}": "𝒬",
  "\\mathscr{S}": "𝒮",
  "\\mathscr{T}": "𝒯",
  "\\mathscr{U}": "𝒰",
  "\\mathscr{V}": "𝒱",
  "\\mathscr{W}": "𝒲",
  "\\mathscr{X}": "𝒳",
  "\\mathscr{Y}": "𝒴",
  "\\mathscr{Z}": "𝒵",
  "\\mathscr{a}": "𝒶",
  "\\mathscr{b}": "𝒷",
  "\\mathscr{c}": "𝒸",
  "\\mathscr{d}": "𝒹",
  "\\mathscr{f}": "𝒻",
  "\\mathscr{h}": "𝒽",
  "\\mathscr{i}": "𝒾",
  "\\mathscr{j}": "𝒿",
  "\\mathscr{k}": "𝓀",
  "\\mathscr{m}": "𝓂",
  "\\mathscr{n}": "𝓃",
  "\\mathscr{p}": "𝓅",
  "\\mathscr{q}": "𝓆",
  "\\mathscr{r}": "𝓇",
  "\\mathscr{s}": "𝓈",
  "\\mathscr{t}": "𝓉",
  "\\mathscr{u}": "𝓊",
  "\\mathscr{v}": "𝓋",
  "\\mathscr{w}": "𝓌",
  "\\mathscr{x}": "𝓍",
  "\\mathscr{y}": "𝓎",
  "\\mathscr{z}": "𝓏",
  "\\mathmit{A}": "𝓐",
  "\\mathmit{B}": "𝓑",
  "\\mathmit{C}": "𝓒",
  "\\mathmit{D}": "𝓓",
  "\\mathmit{E}": "𝓔",
  "\\mathmit{F}": "𝓕",
  "\\mathmit{G}": "𝓖",
  "\\mathmit{H}": "𝓗",
  "\\mathmit{I}": "𝓘",
  "\\mathmit{J}": "𝓙",
  "\\mathmit{K}": "𝓚",
  "\\mathmit{L}": "𝓛",
  "\\mathmit{M}": "𝓜",
  "\\mathmit{N}": "𝓝",
  "\\mathmit{O}": "𝓞",
  "\\mathmit{P}": "𝓟",
  "\\mathmit{Q}": "𝓠",
  "\\mathmit{R}": "𝓡",
  "\\mathmit{S}": "𝓢",
  "\\mathmit{T}": "𝓣",
  "\\mathmit{U}": "𝓤",
  "\\mathmit{V}": "𝓥",
  "\\mathmit{W}": "𝓦",
  "\\mathmit{X}": "𝓧",
  "\\mathmit{Y}": "𝓨",
  "\\mathmit{Z}": "𝓩",
  "\\mathmit{a}": "𝓪",
  "\\mathmit{b}": "𝓫",
  "\\mathmit{c}": "𝓬",
  "\\mathmit{d}": "𝓭",
  "\\mathmit{e}": "𝓮",
  "\\mathmit{f}": "𝓯",
  "\\mathmit{g}": "𝓰",
  "\\mathmit{h}": "𝓱",
  "\\mathmit{i}": "𝓲",
  "\\mathmit{j}": "𝓳",
  "\\mathmit{k}": "𝓴",
  "\\mathmit{l}": "𝓵",
  "\\mathmit{m}": "𝓶",
  "\\mathmit{n}": "𝓷",
  "\\mathmit{o}": "𝓸",
  "\\mathmit{p}": "𝓹",
  "\\mathmit{q}": "𝓺",
  "\\mathmit{r}": "𝓻",
  "\\mathmit{s}": "𝓼",
  "\\mathmit{t}": "𝓽",
  "\\mathmit{u}": "𝓾",
  "\\mathmit{v}": "𝓿",
  "\\mathmit{w}": "𝔀",
  "\\mathmit{x}": "𝔁",
  "\\mathmit{y}": "𝔂",
  "\\mathmit{z}": "𝔃",
  "\\mathfrak{A}": "𝔄",
  "\\mathfrak{B}": "𝔅",
  "\\mathfrak{D}": "𝔇",
  "\\mathfrak{E}": "𝔈",
  "\\mathfrak{F}": "𝔉",
  "\\mathfrak{G}": "𝔊",
  "\\mathfrak{J}": "𝔍",
  "\\mathfrak{K}": "𝔎",
  "\\mathfrak{L}": "𝔏",
  "\\mathfrak{M}": "𝔐",
  "\\mathfrak{N}": "𝔑",
  "\\mathfrak{O}": "𝔒",
  "\\mathfrak{P}": "𝔓",
  "\\mathfrak{Q}": "𝔔",
  "\\mathfrak{S}": "𝔖",
  "\\mathfrak{T}": "𝔗",
  "\\mathfrak{U}": "𝔘",
  "\\mathfrak{V}": "𝔙",
  "\\mathfrak{W}": "𝔚",
  "\\mathfrak{X}": "𝔛",
  "\\mathfrak{Y}": "𝔜",
  "\\mathfrak{a}": "𝔞",
  "\\mathfrak{b}": "𝔟",
  "\\mathfrak{c}": "𝔠",
  "\\mathfrak{d}": "𝔡",
  "\\mathfrak{e}": "𝔢",
  "\\mathfrak{f}": "𝔣",
  "\\mathfrak{g}": "𝔤",
  "\\mathfrak{h}": "𝔥",
  "\\mathfrak{i}": "𝔦",
  "\\mathfrak{j}": "𝔧",
  "\\mathfrak{k}": "𝔨",
  "\\mathfrak{l}": "𝔩",
  "\\mathfrak{m}": "𝔪",
  "\\mathfrak{n}": "𝔫",
  "\\mathfrak{o}": "𝔬",
  "\\mathfrak{p}": "𝔭",
  "\\mathfrak{q}": "𝔮",
  "\\mathfrak{r}": "𝔯",
  "\\mathfrak{s}": "𝔰",
  "\\mathfrak{t}": "𝔱",
  "\\mathfrak{u}": "𝔲",
  "\\mathfrak{v}": "𝔳",
  "\\mathfrak{w}": "𝔴",
  "\\mathfrak{x}": "𝔵",
  "\\mathfrak{y}": "𝔶",
  "\\mathfrak{z}": "𝔷",
  "\\mathbb{A}": "𝔸",
  "\\mathbb{B}": "𝔹",
  "\\mathbb{D}": "𝔻",
  "\\mathbb{E}": "𝔼",
  "\\mathbb{F}": "𝔽",
  "\\mathbb{G}": "𝔾",
  "\\mathbb{I}": "𝕀",
  "\\mathbb{J}": "𝕁",
  "\\mathbb{K}": "𝕂",
  "\\mathbb{L}": "𝕃",
  "\\mathbb{M}": "𝕄",
  "\\mathbb{O}": "𝕆",
  "\\mathbb{S}": "𝕊",
  "\\mathbb{T}": "𝕋",
  "\\mathbb{U}": "𝕌",
  "\\mathbb{V}": "𝕍",
  "\\mathbb{W}": "𝕎",
  "\\mathbb{X}": "𝕏",
  "\\mathbb{Y}": "𝕐",
  "\\mathbb{a}": "𝕒",
  "\\mathbb{b}": "𝕓",
  "\\mathbb{c}": "𝕔",
  "\\mathbb{d}": "𝕕",
  "\\mathbb{e}": "𝕖",
  "\\mathbb{f}": "𝕗",
  "\\mathbb{g}": "𝕘",
  "\\mathbb{h}": "𝕙",
  "\\mathbb{i}": "𝕚",
  "\\mathbb{j}": "𝕛",
  "\\mathbb{k}": "𝕜",
  "\\mathbb{l}": "𝕝",
  "\\mathbb{m}": "𝕞",
  "\\mathbb{n}": "𝕟",
  "\\mathbb{o}": "𝕠",
  "\\mathbb{p}": "𝕡",
  "\\mathbb{q}": "𝕢",
  "\\mathbb{r}": "𝕣",
  "\\mathbb{s}": "𝕤",
  "\\mathbb{t}": "𝕥",
  "\\mathbb{u}": "𝕦",
  "\\mathbb{v}": "𝕧",
  "\\mathbb{w}": "𝕨",
  "\\mathbb{x}": "𝕩",
  "\\mathbb{y}": "𝕪",
  "\\mathbb{z}": "𝕫",
  "\\mathslbb{A}": "𝕬",
  "\\mathslbb{B}": "𝕭",
  "\\mathslbb{C}": "𝕮",
  "\\mathslbb{D}": "𝕯",
  "\\mathslbb{E}": "𝕰",
  "\\mathslbb{F}": "𝕱",
  "\\mathslbb{G}": "𝕲",
  "\\mathslbb{H}": "𝕳",
  "\\mathslbb{I}": "𝕴",
  "\\mathslbb{J}": "𝕵",
  "\\mathslbb{K}": "𝕶",
  "\\mathslbb{L}": "𝕷",
  "\\mathslbb{M}": "𝕸",
  "\\mathslbb{N}": "𝕹",
  "\\mathslbb{O}": "𝕺",
  "\\mathslbb{P}": "𝕻",
  "\\mathslbb{Q}": "𝕼",
  "\\mathslbb{R}": "𝕽",
  "\\mathslbb{S}": "𝕾",
  "\\mathslbb{T}": "𝕿",
  "\\mathslbb{U}": "𝖀",
  "\\mathslbb{V}": "𝖁",
  "\\mathslbb{W}": "𝖂",
  "\\mathslbb{X}": "𝖃",
  "\\mathslbb{Y}": "𝖄",
  "\\mathslbb{Z}": "𝖅",
  "\\mathslbb{a}": "𝖆",
  "\\mathslbb{b}": "𝖇",
  "\\mathslbb{c}": "𝖈",
  "\\mathslbb{d}": "𝖉",
  "\\mathslbb{e}": "𝖊",
  "\\mathslbb{f}": "𝖋",
  "\\mathslbb{g}": "𝖌",
  "\\mathslbb{h}": "𝖍",
  "\\mathslbb{i}": "𝖎",
  "\\mathslbb{j}": "𝖏",
  "\\mathslbb{k}": "𝖐",
  "\\mathslbb{l}": "𝖑",
  "\\mathslbb{m}": "𝖒",
  "\\mathslbb{n}": "𝖓",
  "\\mathslbb{o}": "𝖔",
  "\\mathslbb{p}": "𝖕",
  "\\mathslbb{q}": "𝖖",
  "\\mathslbb{r}": "𝖗",
  "\\mathslbb{s}": "𝖘",
  "\\mathslbb{t}": "𝖙",
  "\\mathslbb{u}": "𝖚",
  "\\mathslbb{v}": "𝖛",
  "\\mathslbb{w}": "𝖜",
  "\\mathslbb{x}": "𝖝",
  "\\mathslbb{y}": "𝖞",
  "\\mathslbb{z}": "𝖟",
  "\\mathsf{A}": "𝖠",
  "\\mathsf{B}": "𝖡",
  "\\mathsf{C}": "𝖢",
  "\\mathsf{D}": "𝖣",
  "\\mathsf{E}": "𝖤",
  "\\mathsf{F}": "𝖥",
  "\\mathsf{G}": "𝖦",
  "\\mathsf{H}": "𝖧",
  "\\mathsf{I}": "𝖨",
  "\\mathsf{J}": "𝖩",
  "\\mathsf{K}": "𝖪",
  "\\mathsf{L}": "𝖫",
  "\\mathsf{M}": "𝖬",
  "\\mathsf{N}": "𝖭",
  "\\mathsf{O}": "𝖮",
  "\\mathsf{P}": "𝖯",
  "\\mathsf{Q}": "𝖰",
  "\\mathsf{R}": "𝖱",
  "\\mathsf{S}": "𝖲",
  "\\mathsf{T}": "𝖳",
  "\\mathsf{U}": "𝖴",
  "\\mathsf{V}": "𝖵",
  "\\mathsf{W}": "𝖶",
  "\\mathsf{X}": "𝖷",
  "\\mathsf{Y}": "𝖸",
  "\\mathsf{Z}": "𝖹",
  "\\mathsf{a}": "𝖺",
  "\\mathsf{b}": "𝖻",
  "\\mathsf{c}": "𝖼",
  "\\mathsf{d}": "𝖽",
  "\\mathsf{e}": "𝖾",
  "\\mathsf{f}": "𝖿",
  "\\mathsf{g}": "𝗀",
  "\\mathsf{h}": "𝗁",
  "\\mathsf{i}": "𝗂",
  "\\mathsf{j}": "𝗃",
  "\\mathsf{k}": "𝗄",
  "\\mathsf{l}": "𝗅",
  "\\mathsf{m}": "𝗆",
  "\\mathsf{n}": "𝗇",
  "\\mathsf{o}": "𝗈",
  "\\mathsf{p}": "𝗉",
  "\\mathsf{q}": "𝗊",
  "\\mathsf{r}": "𝗋",
  "\\mathsf{s}": "𝗌",
  "\\mathsf{t}": "𝗍",
  "\\mathsf{u}": "𝗎",
  "\\mathsf{v}": "𝗏",
  "\\mathsf{w}": "𝗐",
  "\\mathsf{x}": "𝗑",
  "\\mathsf{y}": "𝗒",
  "\\mathsf{z}": "𝗓",
  "\\mathsfbf{A}": "𝗔",
  "\\mathsfbf{B}": "𝗕",
  "\\mathsfbf{C}": "𝗖",
  "\\mathsfbf{D}": "𝗗",
  "\\mathsfbf{E}": "𝗘",
  "\\mathsfbf{F}": "𝗙",
  "\\mathsfbf{G}": "𝗚",
  "\\mathsfbf{H}": "𝗛",
  "\\mathsfbf{I}": "𝗜",
  "\\mathsfbf{J}": "𝗝",
  "\\mathsfbf{K}": "𝗞",
  "\\mathsfbf{L}": "𝗟",
  "\\mathsfbf{M}": "𝗠",
  "\\mathsfbf{N}": "𝗡",
  "\\mathsfbf{O}": "𝗢",
  "\\mathsfbf{P}": "𝗣",
  "\\mathsfbf{Q}": "𝗤",
  "\\mathsfbf{R}": "𝗥",
  "\\mathsfbf{S}": "𝗦",
  "\\mathsfbf{T}": "𝗧",
  "\\mathsfbf{U}": "𝗨",
  "\\mathsfbf{V}": "𝗩",
  "\\mathsfbf{W}": "𝗪",
  "\\mathsfbf{X}": "𝗫",
  "\\mathsfbf{Y}": "𝗬",
  "\\mathsfbf{Z}": "𝗭",
  "\\mathsfbf{a}": "𝗮",
  "\\mathsfbf{b}": "𝗯",
  "\\mathsfbf{c}": "𝗰",
  "\\mathsfbf{d}": "𝗱",
  "\\mathsfbf{e}": "𝗲",
  "\\mathsfbf{f}": "𝗳",
  "\\mathsfbf{g}": "𝗴",
  "\\mathsfbf{h}": "𝗵",
  "\\mathsfbf{i}": "𝗶",
  "\\mathsfbf{j}": "𝗷",
  "\\mathsfbf{k}": "𝗸",
  "\\mathsfbf{l}": "𝗹",
  "\\mathsfbf{m}": "𝗺",
  "\\mathsfbf{n}": "𝗻",
  "\\mathsfbf{o}": "𝗼",
  "\\mathsfbf{p}": "𝗽",
  "\\mathsfbf{q}": "𝗾",
  "\\mathsfbf{r}": "𝗿",
  "\\mathsfbf{s}": "𝘀",
  "\\mathsfbf{t}": "𝘁",
  "\\mathsfbf{u}": "𝘂",
  "\\mathsfbf{v}": "𝘃",
  "\\mathsfbf{w}": "𝘄",
  "\\mathsfbf{x}": "𝘅",
  "\\mathsfbf{y}": "𝘆",
  "\\mathsfbf{z}": "𝘇",
  "\\mathsfsl{A}": "𝘈",
  "\\mathsfsl{B}": "𝘉",
  "\\mathsfsl{C}": "𝘊",
  "\\mathsfsl{D}": "𝘋",
  "\\mathsfsl{E}": "𝘌",
  "\\mathsfsl{F}": "𝘍",
  "\\mathsfsl{G}": "𝘎",
  "\\mathsfsl{H}": "𝘏",
  "\\mathsfsl{I}": "𝘐",
  "\\mathsfsl{J}": "𝘑",
  "\\mathsfsl{K}": "𝘒",
  "\\mathsfsl{L}": "𝘓",
  "\\mathsfsl{M}": "𝘔",
  "\\mathsfsl{N}": "𝘕",
  "\\mathsfsl{O}": "𝘖",
  "\\mathsfsl{P}": "𝘗",
  "\\mathsfsl{Q}": "𝘘",
  "\\mathsfsl{R}": "𝘙",
  "\\mathsfsl{S}": "𝘚",
  "\\mathsfsl{T}": "𝘛",
  "\\mathsfsl{U}": "𝘜",
  "\\mathsfsl{V}": "𝘝",
  "\\mathsfsl{W}": "𝘞",
  "\\mathsfsl{X}": "𝘟",
  "\\mathsfsl{Y}": "𝘠",
  "\\mathsfsl{Z}": "𝘡",
  "\\mathsfsl{a}": "𝘢",
  "\\mathsfsl{b}": "𝘣",
  "\\mathsfsl{c}": "𝘤",
  "\\mathsfsl{d}": "𝘥",
  "\\mathsfsl{e}": "𝘦",
  "\\mathsfsl{f}": "𝘧",
  "\\mathsfsl{g}": "𝘨",
  "\\mathsfsl{h}": "𝘩",
  "\\mathsfsl{i}": "𝘪",
  "\\mathsfsl{j}": "𝘫",
  "\\mathsfsl{k}": "𝘬",
  "\\mathsfsl{l}": "𝘭",
  "\\mathsfsl{m}": "𝘮",
  "\\mathsfsl{n}": "𝘯",
  "\\mathsfsl{o}": "𝘰",
  "\\mathsfsl{p}": "𝘱",
  "\\mathsfsl{q}": "𝘲",
  "\\mathsfsl{r}": "𝘳",
  "\\mathsfsl{s}": "𝘴",
  "\\mathsfsl{t}": "𝘵",
  "\\mathsfsl{u}": "𝘶",
  "\\mathsfsl{v}": "𝘷",
  "\\mathsfsl{w}": "𝘸",
  "\\mathsfsl{x}": "𝘹",
  "\\mathsfsl{y}": "𝘺",
  "\\mathsfsl{z}": "𝘻",
  "\\mathsfbfsl{A}": "𝘼",
  "\\mathsfbfsl{B}": "𝘽",
  "\\mathsfbfsl{C}": "𝘾",
  "\\mathsfbfsl{D}": "𝘿",
  "\\mathsfbfsl{E}": "𝙀",
  "\\mathsfbfsl{F}": "𝙁",
  "\\mathsfbfsl{G}": "𝙂",
  "\\mathsfbfsl{H}": "𝙃",
  "\\mathsfbfsl{I}": "𝙄",
  "\\mathsfbfsl{J}": "𝙅",
  "\\mathsfbfsl{K}": "𝙆",
  "\\mathsfbfsl{L}": "𝙇",
  "\\mathsfbfsl{M}": "𝙈",
  "\\mathsfbfsl{N}": "𝙉",
  "\\mathsfbfsl{O}": "𝙊",
  "\\mathsfbfsl{P}": "𝙋",
  "\\mathsfbfsl{Q}": "𝙌",
  "\\mathsfbfsl{R}": "𝙍",
  "\\mathsfbfsl{S}": "𝙎",
  "\\mathsfbfsl{T}": "𝙏",
  "\\mathsfbfsl{U}": "𝙐",
  "\\mathsfbfsl{V}": "𝙑",
  "\\mathsfbfsl{W}": "𝙒",
  "\\mathsfbfsl{X}": "𝙓",
  "\\mathsfbfsl{Y}": "𝙔",
  "\\mathsfbfsl{Z}": "𝙕",
  "\\mathsfbfsl{a}": "𝙖",
  "\\mathsfbfsl{b}": "𝙗",
  "\\mathsfbfsl{c}": "𝙘",
  "\\mathsfbfsl{d}": "𝙙",
  "\\mathsfbfsl{e}": "𝙚",
  "\\mathsfbfsl{f}": "𝙛",
  "\\mathsfbfsl{g}": "𝙜",
  "\\mathsfbfsl{h}": "𝙝",
  "\\mathsfbfsl{i}": "𝙞",
  "\\mathsfbfsl{j}": "𝙟",
  "\\mathsfbfsl{k}": "𝙠",
  "\\mathsfbfsl{l}": "𝙡",
  "\\mathsfbfsl{m}": "𝙢",
  "\\mathsfbfsl{n}": "𝙣",
  "\\mathsfbfsl{o}": "𝙤",
  "\\mathsfbfsl{p}": "𝙥",
  "\\mathsfbfsl{q}": "𝙦",
  "\\mathsfbfsl{r}": "𝙧",
  "\\mathsfbfsl{s}": "𝙨",
  "\\mathsfbfsl{t}": "𝙩",
  "\\mathsfbfsl{u}": "𝙪",
  "\\mathsfbfsl{v}": "𝙫",
  "\\mathsfbfsl{w}": "𝙬",
  "\\mathsfbfsl{x}": "𝙭",
  "\\mathsfbfsl{y}": "𝙮",
  "\\mathsfbfsl{z}": "𝙯",
  "\\mathtt{A}": "𝙰",
  "\\mathtt{B}": "𝙱",
  "\\mathtt{C}": "𝙲",
  "\\mathtt{D}": "𝙳",
  "\\mathtt{E}": "𝙴",
  "\\mathtt{F}": "𝙵",
  "\\mathtt{G}": "𝙶",
  "\\mathtt{H}": "𝙷",
  "\\mathtt{I}": "𝙸",
  "\\mathtt{J}": "𝙹",
  "\\mathtt{K}": "𝙺",
  "\\mathtt{L}": "𝙻",
  "\\mathtt{M}": "𝙼",
  "\\mathtt{N}": "𝙽",
  "\\mathtt{O}": "𝙾",
  "\\mathtt{P}": "𝙿",
  "\\mathtt{Q}": "𝚀",
  "\\mathtt{R}": "𝚁",
  "\\mathtt{S}": "𝚂",
  "\\mathtt{T}": "𝚃",
  "\\mathtt{U}": "𝚄",
  "\\mathtt{V}": "𝚅",
  "\\mathtt{W}": "𝚆",
  "\\mathtt{X}": "𝚇",
  "\\mathtt{Y}": "𝚈",
  "\\mathtt{Z}": "𝚉",
  "\\mathtt{a}": "𝚊",
  "\\mathtt{b}": "𝚋",
  "\\mathtt{c}": "𝚌",
  "\\mathtt{d}": "𝚍",
  "\\mathtt{e}": "𝚎",
  "\\mathtt{f}": "𝚏",
  "\\mathtt{g}": "𝚐",
  "\\mathtt{h}": "𝚑",
  "\\mathtt{i}": "𝚒",
  "\\mathtt{j}": "𝚓",
  "\\mathtt{k}": "𝚔",
  "\\mathtt{l}": "𝚕",
  "\\mathtt{m}": "𝚖",
  "\\mathtt{n}": "𝚗",
  "\\mathtt{o}": "𝚘",
  "\\mathtt{p}": "𝚙",
  "\\mathtt{q}": "𝚚",
  "\\mathtt{r}": "𝚛",
  "\\mathtt{s}": "𝚜",
  "\\mathtt{t}": "𝚝",
  "\\mathtt{u}": "𝚞",
  "\\mathtt{v}": "𝚟",
  "\\mathtt{w}": "𝚠",
  "\\mathtt{x}": "𝚡",
  "\\mathtt{y}": "𝚢",
  "\\mathtt{z}": "𝚣",
  "\\mathbf{\\Alpha}": "𝛂",
  "\\mathbf{\\Beta}": "𝛃",
  "\\mathbf{\\Gamma}": "𝛄",
  "\\mathbf{\\Delta}": "𝛅",
  "\\mathbf{\\Epsilon}": "𝛆",
  "\\mathbf{\\Zeta}": "𝛇",
  "\\mathbf{\\Eta}": "𝛈",
  "\\mathbf{\\Theta}": "𝚯",
  "\\mathbf{\\Iota}": "𝛊",
  "\\mathbf{\\Kappa}": "𝛋",
  "\\mathbf{\\Lambda}": "𝛌",
  "\\mathbf{\\Xi}": "𝛏",
  "\\mathbf{\\Pi}": "𝛑",
  "\\mathbf{\\Rho}": "𝛒",
  "\\mathbf{\\vartheta}": "𝛝",
  "\\mathbf{\\Sigma}": "𝛔",
  "\\mathbf{\\Tau}": "𝛕",
  "\\mathbf{\\Upsilon}": "𝛖",
  "\\mathbf{\\Phi}": "𝛗",
  "\\mathbf{\\Chi}": "𝛘",
  "\\mathbf{\\Psi}": "𝛙",
  "\\mathbf{\\Omega}": "𝛚",
  "\\mathbf{\\nabla}": "𝛁",
  "\\mathbf{\\theta}": "𝛉",
  "\\mathbf{\\varsigma}": "𝛓",
  "\\mathbf{\\varkappa}": "𝛞",
  "\\mathbf{\\phi}": "𝛟",
  "\\mathbf{\\varrho}": "𝛠",
  "\\mathbf{\\varpi}": "𝛡",
  "\\mathsl{\\Alpha}": "𝛼",
  "\\mathsl{\\Beta}": "𝛽",
  "\\mathsl{\\Gamma}": "𝛾",
  "\\mathsl{\\Delta}": "𝛿",
  "\\mathsl{\\Epsilon}": "𝜀",
  "\\mathsl{\\Zeta}": "𝜁",
  "\\mathsl{\\Eta}": "𝜂",
  "\\mathsl{\\Theta}": "𝜃",
  "\\mathsl{\\Iota}": "𝜄",
  "\\mathsl{\\Kappa}": "𝜅",
  "\\mathsl{\\Lambda}": "𝜆",
  "\\mathsl{\\Xi}": "𝜉",
  "\\mathsl{\\Pi}": "𝜋",
  "\\mathsl{\\Rho}": "𝜌",
  "\\mathsl{\\vartheta}": "𝜗",
  "\\mathsl{\\Sigma}": "𝜎",
  "\\mathsl{\\Tau}": "𝜏",
  "\\mathsl{\\Upsilon}": "𝜐",
  "\\mathsl{\\Phi}": "𝜑",
  "\\mathsl{\\Chi}": "𝜒",
  "\\mathsl{\\Psi}": "𝜓",
  "\\mathsl{\\Omega}": "𝜔",
  "\\mathsl{\\nabla}": "𝛻",
  "\\mathsl{\\varsigma}": "𝜍",
  "\\mathsl{\\varkappa}": "𝜘",
  "\\mathsl{\\phi}": "𝜙",
  "\\mathsl{\\varrho}": "𝜚",
  "\\mathsl{\\varpi}": "𝜛",
  "\\mathbit{\\Alpha}": "𝜶",
  "\\mathbit{\\Beta}": "𝜷",
  "\\mathbit{\\Gamma}": "𝜸",
  "\\mathbit{\\Delta}": "𝜹",
  "\\mathbit{\\Epsilon}": "𝜺",
  "\\mathbit{\\Zeta}": "𝜻",
  "\\mathbit{\\Eta}": "𝜼",
  "\\mathbit{\\Theta}": "𝜽",
  "\\mathbit{\\Iota}": "𝜾",
  "\\mathbit{\\Kappa}": "𝜿",
  "\\mathbit{\\Lambda}": "𝝀",
  "\\mathbit{\\Xi}": "𝝃",
  "\\mathbit{\\Pi}": "𝝅",
  "\\mathbit{\\Rho}": "𝝆",
  "\\mathbit{\\Sigma}": "𝝈",
  "\\mathbit{\\Tau}": "𝝉",
  "\\mathbit{\\Upsilon}": "𝝊",
  "\\mathbit{\\Phi}": "𝝋",
  "\\mathbit{\\Chi}": "𝝌",
  "\\mathbit{\\Psi}": "𝝍",
  "\\mathbit{\\Omega}": "𝝎",
  "\\mathbit{\\nabla}": "𝜵",
  "\\mathbit{\\varsigma}": "𝝇",
  "\\mathbit{\\vartheta}": "𝝑",
  "\\mathbit{\\varkappa}": "𝝒",
  "\\mathbit{\\phi}": "𝝓",
  "\\mathbit{\\varrho}": "𝝔",
  "\\mathbit{\\varpi}": "𝝕",
  "\\mathsfbf{\\Alpha}": "𝝰",
  "\\mathsfbf{\\Beta}": "𝝱",
  "\\mathsfbf{\\Gamma}": "𝝲",
  "\\mathsfbf{\\Delta}": "𝝳",
  "\\mathsfbf{\\Epsilon}": "𝝴",
  "\\mathsfbf{\\Zeta}": "𝝵",
  "\\mathsfbf{\\Eta}": "𝝶",
  "\\mathsfbf{\\Theta}": "𝝷",
  "\\mathsfbf{\\Iota}": "𝝸",
  "\\mathsfbf{\\Kappa}": "𝝹",
  "\\mathsfbf{\\Lambda}": "𝝺",
  "\\mathsfbf{\\Xi}": "𝝽",
  "\\mathsfbf{\\Pi}": "𝝿",
  "\\mathsfbf{\\Rho}": "𝞀",
  "\\mathsfbf{\\vartheta}": "𝞋",
  "\\mathsfbf{\\Sigma}": "𝞂",
  "\\mathsfbf{\\Tau}": "𝞃",
  "\\mathsfbf{\\Upsilon}": "𝞄",
  "\\mathsfbf{\\Phi}": "𝞅",
  "\\mathsfbf{\\Chi}": "𝞆",
  "\\mathsfbf{\\Psi}": "𝞇",
  "\\mathsfbf{\\Omega}": "𝞈",
  "\\mathsfbf{\\nabla}": "𝝯",
  "\\mathsfbf{\\varsigma}": "𝞁",
  "\\mathsfbf{\\varkappa}": "𝞌",
  "\\mathsfbf{\\phi}": "𝞍",
  "\\mathsfbf{\\varrho}": "𝞎",
  "\\mathsfbf{\\varpi}": "𝞏",
  "\\mathsfbfsl{\\Alpha}": "𝞪",
  "\\mathsfbfsl{\\Beta}": "𝞫",
  "\\mathsfbfsl{\\Gamma}": "𝞬",
  "\\mathsfbfsl{\\Delta}": "𝞭",
  "\\mathsfbfsl{\\Epsilon}": "𝞮",
  "\\mathsfbfsl{\\Zeta}": "𝞯",
  "\\mathsfbfsl{\\Eta}": "𝞰",
  "\\mathsfbfsl{\\vartheta}": "𝟅",
  "\\mathsfbfsl{\\Iota}": "𝞲",
  "\\mathsfbfsl{\\Kappa}": "𝞳",
  "\\mathsfbfsl{\\Lambda}": "𝞴",
  "\\mathsfbfsl{\\Xi}": "𝞷",
  "\\mathsfbfsl{\\Pi}": "𝞹",
  "\\mathsfbfsl{\\Rho}": "𝞺",
  "\\mathsfbfsl{\\Sigma}": "𝞼",
  "\\mathsfbfsl{\\Tau}": "𝞽",
  "\\mathsfbfsl{\\Upsilon}": "𝞾",
  "\\mathsfbfsl{\\Phi}": "𝞿",
  "\\mathsfbfsl{\\Chi}": "𝟀",
  "\\mathsfbfsl{\\Psi}": "𝟁",
  "\\mathsfbfsl{\\Omega}": "𝟂",
  "\\mathsfbfsl{\\nabla}": "𝞩",
  "\\mathsfbfsl{\\varsigma}": "𝞻",
  "\\mathsfbfsl{\\varkappa}": "𝟆",
  "\\mathsfbfsl{\\phi}": "𝟇",
  "\\mathsfbfsl{\\varrho}": "𝟈",
  "\\mathsfbfsl{\\varpi}": "𝟉",
  "\\mathbf{0}": "𝟎",
  "\\mathbf{1}": "𝟏",
  "\\mathbf{2}": "𝟐",
  "\\mathbf{3}": "𝟑",
  "\\mathbf{4}": "𝟒",
  "\\mathbf{5}": "𝟓",
  "\\mathbf{6}": "𝟔",
  "\\mathbf{7}": "𝟕",
  "\\mathbf{8}": "𝟖",
  "\\mathbf{9}": "𝟗",
  "\\mathbb{0}": "𝟘",
  "\\mathbb{1}": "𝟙",
  "\\mathbb{2}": "𝟚",
  "\\mathbb{3}": "𝟛",
  "\\mathbb{4}": "𝟜",
  "\\mathbb{5}": "𝟝",
  "\\mathbb{6}": "𝟞",
  "\\mathbb{7}": "𝟟",
  "\\mathbb{8}": "𝟠",
  "\\mathbb{9}": "𝟡",
  "\\mathsf{0}": "𝟢",
  "\\mathsf{1}": "𝟣",
  "\\mathsf{2}": "𝟤",
  "\\mathsf{3}": "𝟥",
  "\\mathsf{4}": "𝟦",
  "\\mathsf{5}": "𝟧",
  "\\mathsf{6}": "𝟨",
  "\\mathsf{7}": "𝟩",
  "\\mathsf{8}": "𝟪",
  "\\mathsf{9}": "𝟫",
  "\\mathsfbf{0}": "𝟬",
  "\\mathsfbf{1}": "𝟭",
  "\\mathsfbf{2}": "𝟮",
  "\\mathsfbf{3}": "𝟯",
  "\\mathsfbf{4}": "𝟰",
  "\\mathsfbf{5}": "𝟱",
  "\\mathsfbf{6}": "𝟲",
  "\\mathsfbf{7}": "𝟳",
  "\\mathsfbf{8}": "𝟴",
  "\\mathsfbf{9}": "𝟵",
  "\\mathtt{0}": "𝟶",
  "\\mathtt{1}": "𝟷",
  "\\mathtt{2}": "𝟸",
  "\\mathtt{3}": "𝟹",
  "\\mathtt{4}": "𝟺",
  "\\mathtt{5}": "𝟻",
  "\\mathtt{6}": "𝟼",
  "\\mathtt{7}": "𝟽",
  "\\mathtt{8}": "𝟾",
  "\\mathtt{9}": "𝟿"
}
    };
  

convert.latex2unicode["\\url"] = '';
convert.latex2unicode["\\href"] = '';

convert.to_latex = function(str) {

  chunk_to_latex = function(arr) {
    var chr;
    var res = ''
    var textMode=true;

    for (chr of arr) {
      if (chr.match(/^[\\{]/)) {
        textMode = chr.match(/[^a-z]$/i);
      } else {
        if (!textMode) {
          res += '{}';
          textMode = true;
        }
      }

      res += chr;
    }

    return res;
  }

  str = '' + str;
  var strlen = str.length;
  var c, ca;
  var l;

  var res = [];

  for (var i=0; i < strlen; i++) {
    c = str.charAt(i);
    if (!convert.unicode2latex[c]) {
      convert.unicode2latex[c] = {latex: c, math:false};
    }
    convert.unicode2latex[c].math = !!convert.unicode2latex[c].math;

    if (config.exportCharset == 'UTF-8' && !convert.unicode2latex[c].force) {
      ca = c;
    } else {
      ca = convert.unicode2latex[c].latex;
    }

    var last = res.length - 1;
    if (res.length == 0 || convert.unicode2latex[c].math != res[last].math) {
      res.push({chars: [ca], math: convert.unicode2latex[c].math});
    } else {
      res[last].chars.push(ca);
    }
  }

  res = res.map(function(chunk) {
    if (chunk.math) {
      return '\\ensuremath{' + chunk_to_latex(chunk.chars) + '}';
    } else {
      return chunk_to_latex(chunk.chars);
    }
  });

  res = chunk_to_latex(res);

  return res.replace(/{}\s+/g, ' ');
}

convert.from_latex = function(str) {
  var chunks = str.split('\\');
  var res = chunks.shift();
  var m, i, c, l;

  for (chunk of chunks) {
    chunk = '\\' + chunk;
    l = chunk.length;
    m = null;
    for (i=2; i<=l; i++) {
      if (convert.latex2unicode[chunk.substring(0, i)]) {
        m = i;
      } else {
        break;
      }
    }

    if (m) {
      res += convert.latex2unicode[chunk.substring(0, m)] + chunk.substring(m, chunk.length);
    } else {
      res += chunk;
    }
  }
  return res;
}

var strings = {};
var keyRe = /[a-zA-Z0-9\-]/;
var keywordSplitOnSpace = true;
var keywordDelimRe = '\\s*[,;]\\s*';
var keywordDelimReFlags = '';

function setKeywordSplitOnSpace( val ) {
  keywordSplitOnSpace = val;
}

function setKeywordDelimRe( val, flags ) {
  //expect string, but it could be RegExp
  if(typeof(val) != 'string') {
    keywordDelimRe = val.toString().slice(1, val.toString().lastIndexOf('/'));
    keywordDelimReFlags = val.toString().slice(val.toString().lastIndexOf('/')+1);
  } else {
    keywordDelimRe = val;
    keywordDelimReFlags = flags;
  }
}

function processField(item, field, value) {
  if(Zotero.Utilities.trim(value) == '') return null;
  if(fieldMap[field]) {
    item[fieldMap[field]] = value;
  } else if(inputFieldMap[field]) {
    item[inputFieldMap[field]] = value;
  } else if(field == "journal") {
    if(item.publicationTitle) {
      item.journalAbbreviation = value;
    } else {
      item.publicationTitle = value;
    }
  } else if(field == "fjournal") {
    if(item.publicationTitle) {
      // move publicationTitle to abbreviation
      item.journalAbbreviation = value;
    }
    item.publicationTitle = value;
  } else if(field == "author" || field == "editor" || field == "translator") {
    // parse authors/editors/translators
    var names = value.split(/ and /i); // now case insensitive
    for(var i in names) {
      var name = names[i];
      // skip empty names
      if (name.trim() == '') {
        continue;
      }
      // Names in BibTeX can have three commas
      pieces = name.split(',');
      var creator = {};
      if (pieces.length > 1) {
        creator.firstName = pieces.pop().trim();
        creator.lastName = pieces.join(',').trim();
        creator.creatorType = field;
      } else {
        creator = Zotero.Utilities.cleanAuthor(name, field, false);
      }
      item.creators.push(creator);
    }
  } else if(field == "institution" || field == "organization") {
    item.backupPublisher = value;
  } else if(field == "number"){ // fix for techreport
    if (item.itemType == "report") {
      item.reportNumber = value;
    } else if (item.itemType == "book" || item.itemType == "bookSection") {
      item.seriesNumber = value;
    } else if (item.itemType == "patent"){
      item.patentNumber = value;
    } else {
      item.issue = value;
    }
  } else if(field == "month") {
    var monthIndex = months.indexOf(value.toLowerCase());
    if(monthIndex != -1) {
      value = Zotero.Utilities.formatDate({month:monthIndex});
    } else {
      value += " ";
    }
    
    if(item.date) {
      if(value.indexOf(item.date) != -1) {
        // value contains year and more
        item.date = value;
      } else {
        item.date = value+item.date;
      }
    } else {
      item.date = value;
    }
  } else if(field == "year") {
    if(item.date) {
      if(item.date.indexOf(value) == -1) {
        // date does not already contain year
        item.date += value;
      }
    } else {
      item.date = value;
    }
  } else if(field == "pages") {
    if (item.itemType == "book" || item.itemType == "thesis" || item.itemType == "manuscript") {
      item.numPages = value;
    }
    else {
      item.pages = value.replace(/--/g, "-");
    }
  } else if(field == "note") {
    item.extra += "\n"+value;
  } else if(field == "howpublished") {
    if(value.length >= 7) {
      var str = value.substr(0, 7);
      if(str == "http://" || str == "https:/" || str == "mailto:") {
        item.url = value;
      } else {
        item.extra += "\nPublished: "+value;
      }
    }
  
  } 
  //accept lastchecked or urldate for access date. These should never both occur. 
  //If they do we don't know which is better so we might as well just take the second one
  else if (field == "lastchecked"|| field == "urldate"){
    item.accessDate = value;
  }
  else if(field == "keywords" || field == "keyword") {
    var re = new RegExp(keywordDelimRe, keywordDelimReFlags);
    if(!value.match(re) && keywordSplitOnSpace) {
      // keywords/tags
      item.tags = value.split(/\s+/);
    } else {
      item.tags = value.split(re);
    }
  } else if (field == "comment" || field == "annote" || field == "review") {
    item.notes.push({note:Zotero.Utilities.text2html(value)});
  } else if (field == "pdf" || field == "path" /*Papers2 compatibility*/) {
    item.attachments = [{path:value, mimeType:"application/pdf"}];
  } else if (field == "sentelink") { // the reference manager 'Sente' has a unique file scheme in exported BibTeX
    item.attachments = [{path:value.split(",")[0], mimeType:"application/pdf"}];
  } else if (field == "file") {
    var attachments = value.split(";");
    for(var i in attachments){
      var attachment = attachments[i];
      var parts = attachment.split(":");
      var filetitle = parts[0];
      var filepath = parts[1];
      if (filepath.trim() === '') continue; // skip empty entries
      var filetype = parts[2];

      if (!filetype) { throw value; }

      if (filetitle.length == 0) {
        filetitle = "Attachment";
      }
      if (filetype.match(/pdf/i)) {
        item.attachments.push({path:filepath, mimeType:"application/pdf", title:filetitle});
      } else {
        item.attachments.push({path:filepath, title:filetitle});
      }
    }
  }
}

function getFieldValue(read) {
  var value = "";
  // now, we have the first character of the field
  if(read == "{") {
    // character is a brace
    var openBraces = 1;
    while(read = Zotero.read(1)) {
      if(read == "{" && value[value.length-1] != "\\") {
        openBraces++;
        value += "{";
      } else if(read == "}" && value[value.length-1] != "\\") {
        openBraces--;
        if(openBraces == 0) {
          break;
        } else {
          value += "}";
        }
      } else {
        value += read;
      }
    }
    
  } else if(read == '"') {
    var openBraces = 0;
    while(read = Zotero.read(1)) {
      if(read == "{" && value[value.length-1] != "\\") {
        openBraces++;
        value += "{";
      } else if(read == "}" && value[value.length-1] != "\\") {
        openBraces--;
        value += "}";
      } else if(read == '"' && openBraces == 0) {
        break;
      } else {
        value += read;
      }
    }
  }
  
  if(value.length > 1) {
    value = convert.from_latex(value);

    //convert tex markup into permitted HTML
    value = mapTeXmarkup(value);

    // kill braces
    value = value.replace(/([^\\])[{}]+/g, "$1");
    if(value[0] == "{") {
      value = value.substr(1);
    }
    
    // chop off backslashes
    value = value.replace(/([^\\])\\([#$%&~_^\\{}])/g, "$1$2");
    value = value.replace(/([^\\])\\([#$%&~_^\\{}])/g, "$1$2");
    if(value[0] == "\\" && "#$%&~_^\\{}".indexOf(value[1]) != -1) {
      value = value.substr(1);
    }
    if(value[value.length-1] == "\\" && "#$%&~_^\\{}".indexOf(value[value.length-2]) != -1) {
      value = value.substr(0, value.length-1);
    }
    value = value.replace(/\\\\/g, "\\");
    value = value.replace(/\s+/g, " ");
  }

  return value;
}

function jabrefSplit(str, sep) {
  var quoted = false;
  var result = [];

  str = str.split('');
  while (str.length > 0) {
    if (result.length == 0) { result = ['']; }

    if (str[0] == sep) {
      str.shift();
      result.push('');
    } else {
      if (str[0] == '\\') { str.shift(); }
      result[result.length - 1] += str.shift();
    }
  }
  return result;
}

function jabrefCollect(arr, func) {
  if (arr == null) { return []; }

  var result = [];

  for (var i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

function processComment() {
  var comment = "";
  var read;
  var collectionPath = [];
  var parentCollection, collection;

  while(read = Zotero.read(1)) {
    if (read == "}") { break; } // JabRef ought to escape '}' but doesn't; embedded '}' chars will break the import just as it will on JabRef itself
    comment += read;
  }

  if (comment == 'jabref-meta: groupsversion:3;') {
    jabref.format = 3;
    return;
  }

  if (comment.indexOf('jabref-meta: groupstree:') == 0) {
    if (jabref.format != 3) {
      trLog("jabref: fatal: unsupported group format: " + jabref.format);
      return;
    }
    comment = comment.replace(/^jabref-meta: groupstree:/, '').replace(/[\r\n]/gm, '')

    var records = jabrefSplit(comment, ';');
    while (records.length > 0) {
      var record = records.shift();
      var keys = jabrefSplit(record, ';');
      if (keys.length < 2) { continue; }

      var record = {id: keys.shift()};
      record.data = record.id.match(/^([0-9]) ([^:]*):(.*)/);
      if (record.data == null) {
        trLog("jabref: fatal: unexpected non-match for group " + record.id);
        return;
      }
      record.level = parseInt(record.data[1]);
      record.type = record.data[2]
      record.name = record.data[3]
      record.intersection = keys.shift(); // 0 = independent, 1 = intersection, 2 = union

      if (isNaN(record.level)) {
        trLog("jabref: fatal: unexpected record level in " + record.id);
        return;
      }

      if (record.level == 0) { continue; }
      if (record.type != 'ExplicitGroup') {
        trLog("jabref: fatal: group type " + record.type + " is not supported");
        return;
      }

      collectionPath = collectionPath.slice(0, record.level - 1).concat([record.name]);
      trLog("jabref: locating level " + record.level + ": " + collectionPath.join('/'));

      if (jabref.root.hasOwnProperty(collectionPath[0])) {
        collection = jabref.root[collectionPath[0]];
        trLog("jabref: root " + collection.name + " found");
      } else {
        collection = new Zotero.Collection();
        collection.name = collectionPath[0];
        collection.type = 'collection';
        collection.children = [];
        jabref.root[collectionPath[0]] = collection;
        trLog("jabref: root " + collection.name + " created");
      }
      parentCollection = null;

      for (var i = 1; i < collectionPath.length; i++) {
        var path = collectionPath[i];
        trLog("jabref: looking for child " + path + " under " + collection.name);

        var child = jabrefCollect(collection.children, function(n) { return (n.name == path)})
        if (child.length != 0) {
          child = child[0]
          trLog("jabref: child " + child.name + " found under " + collection.name);
        } else {
          child = new Zotero.Collection();
          child.name = path;
          child.type = 'collection';
          child.children = [];

          collection.children.push(child);
          trLog("jabref: child " + child.name + " created under " + collection.name);
        }

        parentCollection = collection;
        collection = child;
      }

      if (parentCollection) {
        parentCollection = jabrefCollect(parentCollection.children, function(n) { return (n.type == 'item') });
      }

      if (record.intersection == '2' && parentCollection) { // union with parent
        collection.children = parentCollection;
      }

      while(keys.length > 0) {
        key = keys.shift();
        if (key != '') {
          trLog('jabref: adding ' + key + ' to ' + collection.name);
          collection.children.push({type: 'item', id: key});
        }
      }

      if (parentCollection && record.intersection == '1') { // intersection with parent
        collection.children = jabrefMap(collection.children, function(n) { parentCollection.indexOf(n) !== -1; });
      }
    }
  }
}

function beginRecord(type, closeChar) {
  type = Zotero.Utilities.trimInternal(type.toLowerCase());
  if(type != "string") {
    var zoteroType = tex2zotero[type];
    if (!zoteroType) {
      trLog("discarded item from BibTeX; type was "+type);
      return;
    }
    var item = new Zotero.Item(zoteroType);
    
    item.extra = "";
  }
  
  var field = "";
  
  // by setting dontRead to true, we can skip a read on the next iteration
  // of this loop. this is useful after we read past the end of a string.
  var dontRead = false;
  
  while(dontRead || (read = Zotero.read(1))) {
    dontRead = false;
    
    if(read == "=") {                // equals begin a field
    // read whitespace
      var read = Zotero.read(1);
      while(" \n\r\t".indexOf(read) != -1) {
        read = Zotero.read(1);
      }
      
      if(keyRe.test(read)) {
        // read numeric data here, since we might get an end bracket
        // that we should care about
        value = "";
        value += read;
        
        // character is a number
        while((read = Zotero.read(1)) && keyRe.test(read)) {
          value += read;
        }
        
        // don't read the next char; instead, process the character
        // we already read past the end of the string
        dontRead = true;
        
        // see if there's a defined string
        if(strings[value]) value = strings[value];
      } else {
        var value = getFieldValue(read);
      }
      
      if(item) {
        processField(item, field.toLowerCase(), value);
      } else if(type == "string") {
        strings[field] = value;
      }
      field = "";
    } else if(read == ",") {            // commas reset
      if (item.itemID == null) {
        item.itemID = field; // itemID = citekey
      }
      field = "";
    } else if(read == closeChar) {
      if(item) {
        if(item.extra) {
          item.extra += "\n";
        } else {
          item.extra = '';
        }
        item.extra += 'bibtex: ' + item.itemID;

        item.complete();
      }
      return;
    } else if(" \n\r\t".indexOf(read) == -1) {    // skip whitespace
      field += read;
    }
  }
}

function doImport() {
  var read = "", text = "", recordCloseElement = false;
  var type = false;
  
  while(read = Zotero.read(1)) {
    if(read == "@") {
      type = "";
    } else if(type !== false) {
      if(type == "comment") {
        processComment();
        type = false;
      } else if(read == "{") {    // possible open character
        beginRecord(type, "}");
        type = false;
      } else if(read == "(") {    // possible open character
        beginRecord(type, ")");
        type = false;
      } else if(/[a-zA-Z0-9-_]/.test(read)) {
        type += read;
      }
    }
  }

  for (var key in jabref.root) {
    if (jabref.root.hasOwnProperty(key)) { jabref.root[key].complete(); }
  }
}

function escape_url(str) {
  return str.replace(/[\{\}\\_]/g, function(chr){return '%' + ('00' + chr.charCodeAt(0).toString(16)).slice(-2)});
}
function escape(value, sep) {
  if (typeof value == 'number') { return value; }
  if (!value) { return; }

  if (value instanceof Array) {
    if (value.length == 0) { return; }
    return [escape(v) for (v of value)].join(sep);
  }

  var doublequote = value.literal;
  value = value.literal || value;
  value = convert.to_latex(value);
  if (doublequote) { value = '{' + value + '}'; }
  return value;
}

function writeField(field, value, bare) {
  if (typeof value == 'number') {
  } else {
    if (!value) { return; }
  }

  if (!bare) { value = '{' + value + '}'; }

  Zotero.write(",\n\t" + field + " = " + value);
}

function mapHTMLmarkup(characters){
  //converts the HTML markup allowed in Zotero for rich text to TeX
  //since  < and > have already been escaped, we need this rather hideous code - I couldn't see a way around it though.
  //italics and bold
  characters = characters.replace(/\{\\textless\}i\{\\textgreater\}(.+?)\{\\textless\}\/i{\\textgreater\}/g, "\\textit{$1}")
    .replace(/\{\\textless\}b\{\\textgreater\}(.+?)\{\\textless\}\/b{\\textgreater\}/g, "\\textbf{$1}");
  //sub and superscript
  characters = characters.replace(/\{\\textless\}sup\{\\textgreater\}(.+?)\{\\textless\}\/sup{\\textgreater\}/g, "\$^{\\textrm{$1}}\$")
    .replace(/\{\\textless\}sub\{\\textgreater\}(.+?)\{\\textless\}\/sub\{\\textgreater\}/g, "\$_{\\textrm{$1}}\$");
  //two variants of small caps
  characters = characters.replace(/\{\\textless\}span\sstyle=\"small\-caps\"\{\\textgreater\}(.+?)\{\\textless\}\/span{\\textgreater\}/g, "\\textsc{$1}")
    .replace(/\{\\textless\}sc\{\\textgreater\}(.+?)\{\\textless\}\/sc\{\\textgreater\}/g, "\\textsc{$1}");
  return characters;
}


function mapTeXmarkup(tex){
  //reverse of the above - converts tex mark-up into html mark-up permitted by Zotero
  //italics and bold
  tex = tex.replace(/\\textit\{([^\}]+\})/g, "<i>$1</i>").replace(/\\textbf\{([^\}]+\})/g, "<b>$1</b>");
  //two versions of subscript the .* after $ is necessary because people m
  tex = tex.replace(/\$[^\{\$]*_\{([^\}]+\})\$/g, "<sub>$1</sub>").replace(/\$[^\{]*_\{\\textrm\{([^\}]+\}\})/g, "<sub>$1</sub>");  
  //two version of superscript
  tex = tex.replace(/\$[^\{]*\^\{([^\}]+\}\$)/g, "<sup>$1</sup>").replace(/\$[^\{]*\^\{\\textrm\{([^\}]+\}\})/g, "<sup>$1</sup>");  
  //small caps
  tex = tex.replace(/\\textsc\{([^\}]+)/g, "<span style=\"small-caps\">$1</span>");
  return tex;
}
//Disable the isTitleCase function until we decide what to do with it.
/* const skipWords = ["but", "or", "yet", "so", "for", "and", "nor",
  "a", "an", "the", "at", "by", "from", "in", "into", "of", "on",
  "to", "with", "up", "down", "as", "while", "aboard", "about",
  "above", "across", "after", "against", "along", "amid", "among",
  "anti", "around", "as", "before", "behind", "below", "beneath",
  "beside", "besides", "between", "beyond", "but", "despite",
  "down", "during", "except", "for", "inside", "like", "near",
  "off", "onto", "over", "past", "per", "plus", "round", "save",
  "since", "than", "through", "toward", "towards", "under",
  "underneath", "unlike", "until", "upon", "versus", "via",
  "within", "without"];

function isTitleCase(string) {
  const wordRE = /[\s[(]([^\s,\.:?!\])]+)/g;

  var word;
  while (word = wordRE.exec(string)) {
    word = word[1];
    if(word.search(/\d/) != -1  //ignore words with numbers (including just numbers)
      || skipWords.indexOf(word.toLowerCase()) != -1) {
      continue;
    }

    if(word.toLowerCase() == word) return false;
  }
  return true;
}
*/


var CiteKeys = {
  keys: [],
  embeddedKeyRE: /bibtex:\s*([^\s\r\n]+)/,
  unsafechars: /[^-a-z0-9!\$\*\+\.\/:;\?\[\]]/ig,

  extract: function(item) {
    if (!item.extra) { return null; }

    var m = CiteKeys.embeddedKeyRE.exec(item.extra);
    if (!m) { return null; }

    item.extra = item.extra.replace(m[0], '');
    var key = m[1];
    if (CiteKeys.keys[key]) { trLog('BibTex export: duplicate key ' + key); }
    CiteKeys.keys[key] = true;
    return key;
  },

  getCreators: function(item, onlyEditors) {
    if(!item.creators || !item.creators.length) { return {}; }

    var creators = {
      authors:        [],
      editors:        [],
      collaborators:  []
    };
    var primaryCreatorType = Zotero.Utilities.getCreatorsForType(item.itemType)[0];
    var creator;
    for(creator of item.creators) {
      if (!creator.lastName) { continue; }
      var name = (creator.lastName);
      if (name == '') { continue; }

      switch (creator.creatorType) {
        case 'editor':
        case 'seriesEditor':
          creators.editors.push(name);
          break;
        case 'translator':
          creators.translators.push(name);
          break;
        case primaryCreatorType:
          creators.authors.push(name);
          break;
        default:
          creators.collaborators.push(name);
      }
    }

    for (type in creators) {
      if (creators[type].length == 0) { creators[type] = null; }
    }

    if (onlyEditors) { return creators.editors; }
    return creators.authors || creators.editors || creators.collaborators || creators.translators || null;
  },

  clean: function(str) {
    str = ZU.removeDiacritics(str).replace(CiteKeys.unsafechars, '').trim();
    return str;
  },

  _auth: function(item, onlyEditors, n, m) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    var author = authors[m || 0];
    if (author && n) { author = author.substring(0, n); }
    return author;
  },

  _authorLast: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    return authors[authors.length - 1];
  },

  _authors: function(item, onlyEditors, n) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    if (n) {
      var etal = (authors.length > n);
      authors = authors.slice(0, n);
      if (etal) { authors.push('EtAl'); } 
    }
    authors = authors.join('');
    return authors;
  },

  _authorsAlpha: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    switch (authors.length) {
      case 1:
        return authors[0].substring(0, 3);
      case 2:
      case 3:
      case 4:
        return [author.substring(0, 1) for (author of authors)].join('');
      default:
        return [author.substring(0, 1) for (author of authors.slice(0, 3))].join('') + '+';
    }
  },

  _authIni: function(item, onlyEditors, n) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    return [author.substring(0, n) for (author of authors)].join('');
  },

  _authorIni: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    var firstAuthor = authors.shift();

    return firstAuthor.substring(0, 5) + [[a.substring(0, 1) for (a in auth.split(/\s+/))].join('') for(auth in authors)].join('');
  },

  _auth_auth_ea: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    var postfix = (authors.length > 2 ? '.ea' : '');
    return authors.slice(0,2).join('') + postfix;
  },

  _auth_etal: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    var postfix = (authors.length > 2 ? '.etal' : '');
    return authors.slice(0,2).join('') + postfix;
  },

  _authshort: function(item, onlyEditors) {
    var authors = CiteKeys.getCreators(item, onlyEditors);
    if (!authors) { return null; }

    switch (authors.length) {
      case 1:         return authors[0];
      case 2: case 3: return [auth.substring(0,1) for (auth of authors)].join('');
      default:        return [auth.substring(0,1) for (auth of authors)].join('') + '+';
    }
  },

  _firstpage: function(item) {
    if (!item.pages) { return null;}
    var firstpage = null;
    item.pages.replace(/^([0-9]+)/, function(match, fp) { firstpage = fp; });
    return firstpage;
  },

  _keyword: function(item, dummy, n) {
    if (!item.tags || !item.tags[n]) { return null; }
    return items.tags[n].tag;
  },

  _lastpage: function(item) {
    if (!item.pages) { return null;}
    var lastpage = null;
    item.pages.replace(/([0-9]+)[^0-9]*$/, function(match, lp) { lastpage = lp; });
    return lastpage;
  },

  words: function(str) {
    return [CiteKeys.clean(word) for (word of str.split(/\s+/)) if (word != '')];
  },

  _shorttitle: function(item) {
    if (!item.title) { return null; }
    var words = CiteKeys.words(item.title);
    return words.slice(0,3).join('');
  },

  skipWords: ['a','an','the','some','from','on','in','to','of','do','with','der','die','das','ein',
              'eine','einer','eines','einem','einen','un','une','la','le',
              'l','el','las','los','al','uno','una','unos','unas','de','des','del','d'],

  _veryshorttitle: function(item) {
    if (!item.title) { return null; }
    var words = CiteKeys.words(item.title);
    words = [word for (word of words) if (CiteKeys.skipWords.indexOf(word.toLowerCase()) == -1)];
    return words.slice(0,3).join('');
  },

  _shortyear: function(item) {
    if (!item.date) { return null; }
    var date = Zotero.Utilities.strToDate(item.date);
    if (typeof date.year === 'undefined') { return null; }
    return (date.year % 100) + '';
  },

  _year: function(item) {
    if (!item.date) { return null; }
    var date = Zotero.Utilities.strToDate(item.date);
    if (typeof date.year === 'undefined') { return item.date; }
    return date.year;
  },

  _title: function(item) {
    return item.title;
  },

  to_abbr: function(value) {
    if (!value) { return null; }
    return [word.substring(0,1) for (word in value.split(/\s+/))].join('');
  },

  to_lower: function(value) {
    if (!value) { return null; }
    return value.toLowerCase();
  },

  to_upper: function(value) {
    if (!value) { return null; }
    return value.toUpperCase();
  },

  build: function(item) {
    var citekey = CiteKeys.extract(item);
    if (citekey) { return citekey; }

    var basekey = config.citeKeyFormat.replace(/\[([^\]]+)\]/g, function(match, command) {
      var cmds = command.split(':');
      var field = cmds.shift();
      var value = null;

      var N = null;
      var M = null;
      field.replace(/([0-9]+)_([0-9]+)$/, function(match, n, m) { N = n; M = m; return ''; });
      field.replace(/([0-9]+)$/, function(match, n) { N = n; return ''; });

      var onlyEditors = (field.match(/^edtr/) || field.match(/^editors/));
      field = field.replace(/^edtr/, 'auth').replace(/^editors/, 'authors');

      var value = CiteKeys['_' + field.replace('.', '_')](item, onlyEditors, N, M);
      if (value) { value = CiteKeys.clean(value); }

      var cmd;
      for (cmd of cmds) {
        if (cmd.match(/^[(].*[)]$/)) {
          if (!value) { value = cmd.substring(1, cmd.length - 2); }
        } else {
          value = CiteKeys['to_' + cmd](value);
        }
        if (value) { value = CiteKeys.clean(value); }
      }

      return value ? value : '';
    });

    basekey = CiteKeys.clean(basekey);

    citekey = basekey;
    var i = 0;
    while(CiteKeys.keys[citekey]) {
      i++;
      citekey = basekey + "-" + i;
    }
    CiteKeys.keys[citekey] = true;
    return citekey;
  }
};


function doExport() {
  var item;
  var citations = {};
  while (item = Zotero.nextItem()) {
    citations[item.key] = CiteKeys.build(item);
  }
  Zotero.write(JSON.stringify(citations));
}

var exports = {
	"doExport": doExport,
	"setKeywordDelimRe": setKeywordDelimRe,
	"setKeywordSplitOnSpace": setKeywordSplitOnSpace
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "import",
		"input": "@article{Adams2001,\nauthor = {Adams, Nancy K and DeSilva, Shanaka L and Self, Steven and Salas, Guido and Schubring, Steven and Permenter, Jason L and Arbesman, Kendra},\nfile = {:Users/heatherwright/Documents/Scientific Papers/Adams\\_Huaynaputina.pdf:pdf;::},\njournal = {Bulletin of Volcanology},\nkeywords = {Vulcanian eruptions,breadcrust,plinian},\npages = {493--518},\ntitle = {{The physical volcanology of the 1600 eruption of Huaynaputina, southern Peru}},\nvolume = {62},\nyear = {2001}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "Nancy K",
						"lastName": "Adams",
						"creatorType": "author"
					},
					{
						"firstName": "Shanaka L",
						"lastName": "DeSilva",
						"creatorType": "author"
					},
					{
						"firstName": "Steven",
						"lastName": "Self",
						"creatorType": "author"
					},
					{
						"firstName": "Guido",
						"lastName": "Salas",
						"creatorType": "author"
					},
					{
						"firstName": "Steven",
						"lastName": "Schubring",
						"creatorType": "author"
					},
					{
						"firstName": "Jason L",
						"lastName": "Permenter",
						"creatorType": "author"
					},
					{
						"firstName": "Kendra",
						"lastName": "Arbesman",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"Vulcanian eruptions",
					"breadcrust",
					"plinian"
				],
				"seeAlso": [],
				"attachments": [
					{
						"path": "Users/heatherwright/Documents/Scientific Papers/Adams_Huaynaputina.pdf",
						"mimeType": "application/pdf",
						"title": "Attachment"
					}
				],
				"publicationTitle": "Bulletin of Volcanology",
				"pages": "493–518",
				"title": "The physical volcanology of the 1600 eruption of Huaynaputina, southern Peru",
				"volume": "62",
				"date": "2001"
			}
		]
	},
	{
		"type": "import",
		"input": "@Book{abramowitz+stegun,\n author    = \"Milton {Abramowitz} and Irene A. {Stegun}\",\n title     = \"Handbook of Mathematical Functions with\n              Formulas, Graphs, and Mathematical Tables\",\n publisher = \"Dover\",\n year      =  1964,\n address   = \"New York\",\n edition   = \"ninth Dover printing, tenth GPO printing\"\n}\n\n@Book{Torre2008,\n author    = \"Joe Torre and Tom Verducci\",\n publisher = \"Doubleday\",\n title     = \"The Yankee Years\",\n year      =  2008,\n isbn      = \"0385527403\"\n}\n",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Milton",
						"lastName": "Abramowitz",
						"creatorType": "author"
					},
					{
						"firstName": "Irene A.",
						"lastName": "Stegun",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Handbook of Mathematical Functions with Formulas, Graphs, and Mathematical Tables",
				"publisher": "Dover",
				"date": "1964",
				"place": "New York",
				"edition": "ninth Dover printing, tenth GPO printing"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Joe",
						"lastName": "Torre",
						"creatorType": "author"
					},
					{
						"firstName": "Tom",
						"lastName": "Verducci",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"publisher": "Doubleday",
				"title": "The Yankee Years",
				"date": "2008",
				"ISBN": "0385527403"
			}
		]
	},
	{
		"type": "import",
		"input": "@INPROCEEDINGS {author:06,\n title    = {Some publication title},\n author   = {First Author and Second Author},\n crossref = {conference:06},\n pages    = {330—331},\n}\n@PROCEEDINGS {conference:06,\n editor    = {First Editor and Second Editor},\n title     = {Proceedings of the Xth Conference on XYZ},\n booktitle = {Proceedings of the Xth Conference on XYZ},\n year      = {2006},\n month     = oct,\n}",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "First",
						"lastName": "Author",
						"creatorType": "author"
					},
					{
						"firstName": "Second",
						"lastName": "Author",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Some publication title",
				"pages": "330—331"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "First",
						"lastName": "Editor",
						"creatorType": "editor"
					},
					{
						"firstName": "Second",
						"lastName": "Editor",
						"creatorType": "editor"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Proceedings of the Xth Conference on XYZ",
				"publicationTitle": "Proceedings of the Xth Conference on XYZ",
				"date": "October 2006"
			}
		]
	},
	{
		"type": "import",
		"input": "@Book{hicks2001,\n author    = \"von Hicks, III, Michael\",\n title     = \"Design of a Carbon Fiber Composite Grid Structure for the GLAST\n              Spacecraft Using a Novel Manufacturing Technique\",\n publisher = \"Stanford Press\",\n year      =  2001,\n address   = \"Palo Alto\",\n edition   = \"1st,\",\n isbn      = \"0-69-697269-4\"\n}",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Michael",
						"lastName": "von Hicks, III",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Design of a Carbon Fiber Composite Grid Structure for the GLAST Spacecraft Using a Novel Manufacturing Technique",
				"publisher": "Stanford Press",
				"date": "2001",
				"place": "Palo Alto",
				"edition": "1st,",
				"ISBN": "0-69-697269-4"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{Oliveira_2009, title={USGS monitoring ecological impacts}, volume={107}, number={29}, journal={Oil & Gas Journal}, author={Oliveira, A}, year={2009}, pages={29}}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "A",
						"lastName": "Oliveira",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "USGS monitoring ecological impacts",
				"volume": "107",
				"issue": "29",
				"publicationTitle": "Oil & Gas Journal",
				"date": "2009",
				"pages": "29"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{test-ticket1661,\ntitle={non-braking space: ~; accented characters: {\\~n} and \\~{n}; tilde operator: \\~},\n} ",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "non-braking space: ; accented characters: ñ and ñ; tilde operator: ∼"
			}
		]
	},
	{
		"type": "import",
		"input": "@ARTICLE{Frit2,\n  author = {Fritz, U. and Corti, C. and P\\\"{a}ckert, M.},\n  title = {Test of markupconversion: Italics, bold, superscript, subscript, and small caps: Mitochondrial DNA$_{\\textrm{2}}$ sequences suggest unexpected phylogenetic position\n        of Corso-Sardinian grass snakes (\\textit{Natrix cetti}) and \\textbf{do not}\n        support their \\textsc{species status}, with notes on phylogeography and subspecies\n        delineation of grass snakes.},\n  journal = {Actes du $4^{\\textrm{ème}}$ Congrès Français d'Acoustique},\n  year = {2012},\n  volume = {12},\n  pages = {71-80},\n  doi = {10.1007/s13127-011-0069-8}\n}\n",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "U.",
						"lastName": "Fritz",
						"creatorType": "author"
					},
					{
						"firstName": "C.",
						"lastName": "Corti",
						"creatorType": "author"
					},
					{
						"firstName": "M.",
						"lastName": "Päckert",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Test of markupconversion: Italics, bold, superscript, subscript, and small caps: Mitochondrial DNA<sub>2</sub>$ sequences suggest unexpected phylogenetic position of Corso-Sardinian grass snakes (<i>Natrix cetti</i>) and <b>do not</b> support their <span style=\"small-caps\">species status</span>, with notes on phylogeography and subspecies delineation of grass snakes.",
				"publicationTitle": "Actes du <sup>ème</sup>$ Congrès Français d'Acoustique",
				"date": "2012",
				"volume": "12",
				"pages": "71-80",
				"DOI": "10.1007/s13127-011-0069-8"
			}
		]
	},
	{
		"type": "import",
		"input": "@misc{american_rights_at_work_public_2012,\n    title = {Public Service Research Foundation},\n\turl = {http://www.americanrightsatwork.org/blogcategory-275/},\n\turldate = {2012-07-27},\n\tauthor = {American Rights at Work},\n\tyear = {2012},\n\thowpublished = {http://www.americanrightsatwork.org/blogcategory-275/},\n}",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "American Rights at",
						"lastName": "Work",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Public Service Research Foundation",
				"url": "http://www.americanrightsatwork.org/blogcategory-275/",
				"accessDate": "2012-07-27",
				"date": "2012"
			}
		]
	}
]
/** END TEST CASES **/

