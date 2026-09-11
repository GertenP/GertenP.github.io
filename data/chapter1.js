// Peatükk 1: Funktsioonid ja nende graafikud
// Allikas: KM 1. peatükk (2023) konspekt + KM I 4. loeng (2026) + Praktikum 1

export const chapter1 = {
  id: 1,
  week: 1,
  title: "Funktsioonid ja nende graafikud",
  intro:
    "Selle peatüki keskmes on funktsiooni mõiste, funktsioonide omadused (paaris/paaritu, üksühesus, pealekujutus), liit- ja pöördfunktsioon ning põhilised elementaarfunktsioonid, mida kogu kursuse vältel kasutame.",

  theory: [
    {
      id: "1.1",
      title: "Funktsiooni mõiste, määramis- ja muutumispiirkond",
      blocks: [
        {
          type: "text",
          html: "Kaks muutujat võivad olla teineteisest sõltuvad või sõltumatud. Kui muutuja $y$ väärtus sõltub muutuja $x$ väärtusest, nimetame $y$ <b>sõltuvaks muutujaks</b> ja $x$ <b>sõltumatuks muutujaks (argumendiks)</b>."
        },
        {
          type: "def",
          label: "Definitsioon 1.2",
          html: "Olgu antud hulk $X \\subset \\mathbb{R}$. Kui igale arvule $x \\in X$ on vastavusse seatud üks ja ainult üks reaalarv $y$, siis öeldakse, et hulgal $X$ on defineeritud <b>funktsioon</b> $f$, mida märgitakse $$y = f(x).$$ Elementi $y=f(x)$ nimetatakse elemendi $x$ <b>kujutiseks</b>, elementi $x$ elemendi $y$ <b>originaaliks</b>."
        },
        {
          type: "example",
          label: "Näide 1.1",
          html: "Seos $u = \\pm\\sqrt{|v|}$ <b>ei</b> ole funktsioon, kuna ühele argumendile $v \\ne 0$ vastab kaks väärtust. Küll on funktsiooniks $u=\\sqrt{v}$, $v \\in [0,\\infty)$."
        },
        {
          type: "def",
          label: "Definitsioon 1.3",
          html: "Kõikide elementide hulka $X$, mille puhul elemendile $x \\in X$ on funktsiooniga $f$ seatud vastavusse $f(x)$, nimetatakse funktsiooni $f$ <b>määramispiirkonnaks</b>.<br>Funktsiooni $f$ kõikide väärtuste hulka $\\{y \\mid y=f(x),\\ x\\in X\\}$ nimetatakse <b>muutumispiirkonnaks</b> (väärtuste hulgaks) ja tähistatakse $f(X)$."
        },
        {
          type: "example",
          label: "Näide 1.3",
          html: "Funktsiooni $f(x)=\\sqrt{1-x^2}$ määramispiirkond on $X=[-1,1]$ (väljaspool seda muutuks juuritav avaldis negatiivseks). Muutumispiirkond on $f(X)=[0,1]$."
        },
        {
          type: "note",
          label: "Märkus 1.2 — loomulik määramispiirkond",
          html: "Kui reaalmuutuja funktsiooni korral on antud vaid teda määrav eeskiri (valem), määramispiirkonda pole eraldi fikseeritud, siis loetakse määramispiirkonnaks kõigi argumendi väärtuste hulk, mille korral valem üldse mõtet omab."
        },
        {
          type: "example",
          label: "Näide 1.4",
          html: "Funktsiooni $y=\\sqrt{x^2-4}$ (loomulik) määramispiirkond on $$X=(-\\infty,-2]\\cup[2,\\infty).$$"
        },
        {
          type: "check",
          q: "Leia funktsiooni $f(x)=\\dfrac{1}{\\sqrt{x-3}}$ loomulik määramispiirkond.",
          a: "Vaja on $x-3>0$ (nii juurealune on positiivne KUI ka nimetaja $\\ne 0$), seega $X=(3,\\infty)$."
        },
        {
          type: "def",
          label: "Definitsioon 1.4",
          html: "Funktsiooni $f$ <b>graafikuks</b> nimetatakse $xy$-tasandi punktide hulka $$G(f)=\\{(x,y)\\mid y=f(x),\\ x\\in X\\}.$$"
        },
        {
          type: "note",
          label: "Märkus 1.3 — esitusviisid",
          html: "Funktsiooni saab esitada: (1) <b>analüütiliselt</b> valemi(te) abil, (2) <b>numbriliselt</b> tabeli abil, (3) <b>geomeetriliselt</b> graafiku ehk joonisena."
        },
        {
          type: "note",
          label: "Märkus 1.4 — ilmutamata kuju",
          html: "Funktsioon võib olla antud ka ilmutamata kujul, nt ringjoon $x^2+y^2=1$. Sellisest võrrandist saame välja tuua kaks funktsiooni: $y=\\sqrt{1-x^2}$ ja $y=-\\sqrt{1-x^2}$, mõlema määramispiirkond on $[-1,1]$."
        },
        {
          type: "graph",
          fn: "Math.sqrt(1 - x*x)",
          xmin: -1.6, xmax: 1.6, ymin: -0.3, ymax: 1.6,
          label: "y = √(1−x²) (ringjoone ülemine pool)"
        },
        {
          type: "text",
          html: "<b>Paaris- ja paaritu funktsioon.</b> Eeldame, et $f$ määramispiirkond $X$ on sümmeetriline nullpunkti suhtes ($x\\in X \\Rightarrow -x \\in X$)."
        },
        {
          type: "def",
          label: "Definitsioon 1.5",
          html: "Funktsiooni $y=f(x)$ nimetatakse <b>paarisfunktsiooniks</b>, kui $f(-x)=f(x)$ iga $x\\in X$ korral.<br>Funktsiooni $y=f(x)$ nimetatakse <b>paarituks funktsiooniks</b>, kui $f(-x)=-f(x)$ iga $x\\in X$ korral.<br><br>Paaritud: $y=\\sin x$, $y=x$. Paaris: $y=\\cos x$, $y=x^2$."
        },
        {
          type: "note",
          label: "Märkus 1.5",
          html: "Paarisfunktsiooni graafik on sümmeetriline $y$-telje suhtes. Paaritu funktsiooni graafik on sümmeetriline nullpunkti suhtes."
        },
        {
          type: "check",
          q: "Kas $f(x)=\\dfrac{3}{x}-x^3$ on paaris, paaritu või kumbki mitte?",
          a: "$f(-x)=\\dfrac{3}{-x}-(-x)^3=-\\dfrac{3}{x}+x^3=-\\left(\\dfrac{3}{x}-x^3\\right)=-f(x)$ — funktsioon on <b>paaritu</b>."
        }
      ]
    },
    {
      id: "1.2",
      title: "Üksühesus ja pealekujutus",
      blocks: [
        {
          type: "def",
          label: "Definitsioon 1.6",
          html: "Funktsiooni $f:X\\to Y$ nimetatakse <b>üksüheseks funktsiooniks</b> (injektiivseks), kui iga $x_1,x_2\\in X$, $x_1\\ne x_2$, korral ka funktsiooni väärtused on erinevad: $$f(x_1)\\ne f(x_2).$$"
        },
        {
          type: "note",
          label: "Märkus 1.6",
          html: "Üksühesus tähendab, et kui $f(x_1)=f(x_2)$, siis peab kehtima $x_1=x_2$. Ühelgi $y\\in Y$ ei ole üle ühe originaali."
        },
        {
          type: "example",
          label: "Näide 1.6",
          html: "Konstantne funktsioon $f(x)=1$ on üksühene ühepunktilisel hulgal $x\\in\\{a\\}$, kuid ei ole üksühene suuremal hulgal. Lineaarne funktsioon $f(x)=ax+b$ ($a\\ne0$) on <b>alati</b> üksühene."
        },
        {
          type: "note",
          html: "Siinusfunktsioon $y=\\sin x$ ei ole üksühene kogu $\\mathbb{R}$ peal (perioodiline!), aga osalõigul $\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]$ on ta üksühene."
        },
        {
          type: "def",
          label: "Definitsioon 1.7",
          html: "Funktsiooni $f:X\\to Y$ nimetatakse <b>pealekujutuseks</b> (sürjektiivseks), kui $f(X)=Y$, s.t iga elemendi $y\\in Y$ korral leidub originaal $x\\in X$ nii, et $y=f(x)$."
        },
        {
          type: "def",
          label: "Definitsioon 1.8",
          html: "Funktsiooni $f:X\\to Y$ nimetatakse <b>üksüheseks pealekujutuseks</b> (bijektiivseks), kui $f$ on nii üksühene kui ka pealekujutus — igal elemendil $Y$-st on täpselt üks originaal."
        },
        {
          type: "check",
          q: "Kas $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^2$ on üksühene? Kas pealekujutus?",
          a: "Ei ole üksühene ($f(-2)=f(2)=4$). Ei ole pealekujutus (negatiivsed arvud pole ühegi $x$ pilt). Küll aga on $f:[0,\\infty)\\to[0,\\infty)$, $f(x)=x^2$ üksühene pealekujutus."
        }
      ]
    },
    {
      id: "1.3",
      title: "Liitfunktsioon",
      blocks: [
        {
          type: "def",
          label: "Definitsioon 1.9",
          html: "Olgu antud funktsioonid $f:X\\to Y$ ja $g:Y\\to Z$. Funktsioonide $f$ ja $g$ <b>liitfunktsiooniks</b> (kompositsiooniks) nimetatakse funktsiooni $h:X\\to Z$, mis on defineeritud võrdusega $$h(x)=g(f(x)),\\quad x\\in X.$$ Kirjutatakse $h=gf$ või $h=g\\circ f$."
        },
        {
          type: "example",
          label: "Näide 1.8",
          html: "Olgu $f(x)=x+1$, $g(x)=x^2$. Siis $$(gf)(x)=g(f(x))=(x+1)^2=x^2+2x+1,$$ $$(fg)(x)=f(g(x))=x^2+1.$$ Märka: $gf \\ne fg$ — liitfunktsiooni moodustamine <b>ei ole kommutatiivne</b>!"
        },
        {
          type: "check",
          q: "Olgu $f(x)=\\sqrt{x}$ ja $g(x)=x-4$. Leia $(f\\circ g)(x)$ ja selle määramispiirkond.",
          a: "$(f\\circ g)(x)=f(g(x))=\\sqrt{x-4}$. Määramispiirkond: vaja $x-4\\ge0 \\Rightarrow x\\in[4,\\infty)$."
        }
      ]
    },
    {
      id: "1.4",
      title: "Pöördfunktsioon",
      blocks: [
        {
          type: "text",
          html: "Olgu antud funktsioon $f:X\\to Y$, mis on üksühene pealekujutus. Siis igal elemendil $y\\in Y$ on olemas parajasti üks originaal $x\\in X$: $f(x)=y$."
        },
        {
          type: "def",
          label: "Definitsioon 1.10",
          html: "Üksühese vastavuse $f:X\\to Y$ <b>pöördfunktsioon</b> $f^{-1}:Y\\to X$ määratakse võrdusega $$f^{-1}(y)=x,$$ kus $f(x)=y$ iga $x\\in X$ korral."
        },
        {
          type: "note",
          label: "Märkus 1.7",
          html: "Pöördfunktsiooni saab defineerida ainult siis, kui $f:X\\to Y$ on üksühene vastavus hulkade $X$ ja $Y$ vahel. $(f^{-1})^{-1}=f$."
        },
        {
          type: "example",
          label: "Näide 1.10",
          html: "Leiame funktsiooni $y=\\dfrac{x+1}{x}$ pöördfunktsiooni. $f:\\mathbb{R}\\setminus\\{0\\}\\to\\mathbb{R}\\setminus\\{1\\}$ on üksühene pealekujutus. Avaldame $x$: $$xy-x=1 \\Rightarrow x=\\frac{1}{y-1}.$$ Seega $f^{-1}:\\mathbb{R}\\setminus\\{1\\}\\to\\mathbb{R}\\setminus\\{0\\}$, $$f^{-1}(x)=\\frac{1}{x-1}.$$"
        },
        {
          type: "example",
          label: "Näide 1.11",
          html: "Funktsiooni $f:[0,\\infty)\\to[0,\\infty)$, $f(x)=x^2$ pöördfunktsioon on $f^{-1}(x)=\\sqrt{x}$. NB: funktsioonil $f:\\mathbb{R}\\to[0,\\infty)$, $f(x)=x^2$ pöördfunktsiooni <b>ei ole</b>, sest see ei ole üksühene kogu $\\mathbb{R}$ peal."
        },
        {
          type: "note",
          html: "Kirjutis $f^{-1}(x)$ tähendab <b>pöördfunktsiooni</b>, mitte astendust $\\dfrac{1}{f(x)}$! Segaduse vältimiseks kasutatakse trigonomeetria arkusfunktsioonide korral pigem tähistust $\\arcsin x$ jne, mitte $\\sin^{-1}x$."
        },
        {
          type: "graph",
          fn: "1/(x-1)",
          xmin: -6, xmax: 6, ymin: -6, ymax: 6,
          label: "f⁻¹(x) = 1/(x−1)"
        },
        {
          type: "check",
          q: "Leia funktsiooni $f(x)=2x-6$ pöördfunktsioon.",
          a: "$y=2x-6 \\Rightarrow x=\\dfrac{y+6}{2}$, seega $f^{-1}(x)=\\dfrac{x+6}{2}$."
        }
      ]
    },
    {
      id: "1.5",
      title: "Põhilised elementaarfunktsioonid",
      blocks: [
        {
          type: "def",
          label: "Definitsioon 1.11",
          html: "<b>Põhilisteks elementaarfunktsioonideks</b> nimetatakse: (1) konstantne funktsioon $y=c$; (2) astmefunktsioon $y=x^a$; (3) eksponentfunktsioon $y=a^x$ ($a>0,a\\ne1$); (4) logaritmfunktsioon $y=\\log_a x$ ($a>0,a\\ne1$); (5) trigonomeetrilised funktsioonid $\\sin x,\\cos x,\\tan x,\\cot x$; (6) arkusfunktsioonid $\\arcsin x,\\arccos x,\\arctan x,\\operatorname{arccot} x$."
        },
        {
          type: "text",
          html: "<b>Astmefunktsioon $y=x^a$.</b> Funktsioonid $y=x$ ja $y=x^3$ on üksühesed, paaritud, kasvavad. Funktsioonid $y=x^2, y=x^4$ on paarisfunktsioonid, mitte üksühesed. Kui $a\\in(0,1)$, saame juurfunktsioonid, nt $y=x^{1/2}=\\sqrt{x}$ (loomulik mp $[0,\\infty)$) ja $y=x^{1/3}=\\sqrt[3]{x}$ (loomulik mp $\\mathbb{R}$). Kui $a<0$: $y=x^{-1}=\\dfrac{1}{x}$, määramispiirkonnast jääb alati välja $x=0$."
        },
        {
          type: "graph",
          fn: "x*x*x",
          xmin: -2, xmax: 2, ymin: -4, ymax: 4,
          label: "y = x³ (paaritu, üksühene)"
        },
        {
          type: "graph",
          fn: "x*x",
          xmin: -3, xmax: 3, ymin: -0.5, ymax: 6,
          label: "y = x² (paaris, mitte üksühene)"
        },
        {
          type: "text",
          html: "<b>Eksponentfunktsioon $y=a^x$</b> ($a>0,a\\ne1$). Kõige olulisem: $y=e^x$ ($e$ — Euleri arv). $y=e^x$ kasvab kiiresti, $y=e^{-x}$ kahaneb kiiresti."
        },
        {
          type: "def",
          html: "<b>Eksponentfunktsiooni omadused:</b> $$a^0=1,\\quad a^x>0,\\quad a^{x+y}=a^x a^y,\\quad a^{-x}=\\frac{1}{a^x},$$ $$a^{x-y}=\\frac{a^x}{a^y},\\quad (a^x)^y=a^{xy},\\quad (ab)^x=a^xb^x.$$"
        },
        {
          type: "graph",
          fn: "Math.exp(x)",
          xmin: -3, xmax: 3, ymin: -1, ymax: 12,
          label: "y = eˣ"
        },
        {
          type: "text",
          html: "<b>Logaritmfunktsioon $y=\\log_a x$</b> ($a>0,a\\ne1$). Kõige olulisem on naturaallogaritm $y=\\ln x$ (alus $e$). Eksponent- ja logaritmfunktsioon on teineteise pöördfunktsioonid: $f(x)=a^x$, $g(x)=\\log_a x$, $f^{-1}=g$ ja $g^{-1}=f$."
        },
        {
          type: "def",
          html: "<b>Logaritmfunktsiooni omadused:</b> $$\\log xy=\\log|x|+\\log|y|,\\quad \\log\\frac{x}{y}=\\log|x|-\\log|y|\\ (xy>0),$$ $$\\log_a x=\\frac{\\ln x}{\\ln a},\\quad \\log_a x^a=a\\log_a x,\\quad x=a^{\\log_a x}\\ (x>0),$$ $$\\ln 1=0,\\quad \\ln e=1,\\quad \\ln e^{-1}=-1.$$"
        },
        {
          type: "graph",
          fn: "Math.log(x)",
          xmin: -1, xmax: 8, ymin: -3, ymax: 3,
          label: "y = ln x"
        },
        {
          type: "check",
          q: "Lihtsusta: $\\ln(e^3 \\cdot e^{-1})$.",
          a: "$\\ln(e^{3-1})=\\ln(e^2)=2$."
        },
        {
          type: "text",
          html: "<b>Trigonomeetrilised funktsioonid</b> $\\sin x, \\cos x, \\tan x, \\cot x$ ning nendega seotud $\\sec x=\\dfrac{1}{\\cos x}$, $\\csc x=\\dfrac{1}{\\sin x}$. $\\sin$ ja $\\tan$ on paaritud, $\\cos$ on paaris. Kõik neljast ($\\sin,\\cos,\\tan,\\cot$) on perioodilised."
        },
        {
          type: "graph",
          fn: "Math.sin(x)",
          xmin: -6.6, xmax: 6.6, ymin: -1.5, ymax: 1.5,
          label: "y = sin x"
        },
        {
          type: "graph",
          fn: "Math.cos(x)",
          xmin: -6.6, xmax: 6.6, ymin: -1.5, ymax: 1.5,
          label: "y = cos x"
        },
        {
          type: "graph",
          fn: "Math.tan(x)",
          xmin: -6.2, xmax: 6.2, ymin: -6, ymax: 6,
          label: "y = tan x"
        },
        {
          type: "text",
          html: "<b>Arkusfunktsioonid</b> $\\arcsin x, \\arccos x, \\arctan x, \\operatorname{arccot} x$ on vastavate trigonomeetriliste funktsioonide pöördfunktsioonid <b>sobival</b> määramis- ja muutumispiirkonnal: $$\\arcsin:[-1,1]\\to\\left[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right],\\quad \\arccos:[-1,1]\\to[0,\\pi],$$ $$\\arctan:\\mathbb{R}\\to\\left(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right),\\quad \\operatorname{arccot}:\\mathbb{R}\\to(0,\\pi).$$"
        },
        {
          type: "note",
          label: "Märkus 1.10 — kasulikud seosed",
          html: "$$\\arccos x+\\arcsin x=\\frac{\\pi}{2},\\qquad \\arctan x+\\operatorname{arccot} x=\\frac{\\pi}{2}.$$"
        },
        {
          type: "graph",
          fn: "Math.asin(x)",
          xmin: -1.4, xmax: 1.4, ymin: -2, ymax: 2,
          label: "y = arcsin x"
        },
        {
          type: "check",
          q: "Kas $\\sin^{-1}x$ ja $\\dfrac{1}{\\sin x}$ tähendavad sama asja?",
          a: "Ei! $\\sin^{-1}x$ (kui kasutatakse seda tähistust) tähendab <b>pöördfunktsiooni</b> $\\arcsin x$, mitte astendust $\\dfrac{1}{\\sin x}$. Segaduse vältimiseks kasuta pigem tähistust $\\arcsin x$."
        }
      ]
    },
    {
      id: "1.6",
      title: "Elementaarfunktsioonid",
      blocks: [
        {
          type: "def",
          label: "Definitsioon 1.12",
          html: "<b>Elementaarfunktsioonideks</b> nimetatakse funktsioone, mis on saadavad põhilistest elementaarfunktsioonidest lõpliku arvu aritmeetiliste tehete ja liitfunktsiooni moodustamise teel."
        },
        {
          type: "example",
          html: "Näiteks $f(x)=e^{e^{\\sin\\left(1+\\sqrt{\\log(4+x^2)}\\right)}}$ on elementaarfunktsioon (kuigi keeruline — see on lihtsamate funktsioonide liitfunktsioon)."
        },
        {
          type: "note",
          html: "Mitteelementaarfunktsiooni näide: integraalne siinus $\\operatorname{Si}(x)=\\displaystyle\\int_0^x \\frac{\\sin t}{t}\\,dt$ — seda ei saa avaldada põhiliste elementaarfunktsioonide lõpliku kombinatsioonina."
        }
      ]
    },
    {
      id: "1.7",
      title: "Jadad *",
      blocks: [
        {
          type: "text",
          html: "Jada on oma sisult lõpmatu järjestatud arvude loend $a_1,a_2,\\dots,a_n,\\dots$, millel on esimene element ja igale elemendile vahetult järgnev element."
        },
        {
          type: "def",
          label: "Definitsioon 1.13",
          html: "<b>Jadaks</b> nimetatakse naturaalarvulise argumendiga funktsiooni $$x=x(n),\\quad n=1,2,\\dots$$ Tähistame $(x_n)$. Arvu $x_n$ nimetatakse jada üldliikmeks."
        },
        {
          type: "example",
          label: "Näide 1.12",
          html: "Funktsiooni $x=n^2$ korral saame jada $(x_n)=1,4,9,\\dots,n^2,\\dots$"
        }
      ]
    }
  ],

  flashcards: [
    { id: "fc1", tag: "def", front: "Funktsiooni määramispiirkond", back: "Kõikide elementide $x\\in X$ hulk, mille korral $f(x)$ on defineeritud." },
    { id: "fc2", tag: "def", front: "Funktsiooni muutumispiirkond $f(X)$", back: "Funktsiooni kõikide väärtuste hulk $\\{y\\mid y=f(x), x\\in X\\}$." },
    { id: "fc3", tag: "def", front: "Paarisfunktsioon", back: "$f(-x)=f(x)$ iga $x\\in X$. Graafik sümmeetriline $y$-telje suhtes. Näide: $\\cos x$, $x^2$." },
    { id: "fc4", tag: "def", front: "Paaritu funktsioon", back: "$f(-x)=-f(x)$ iga $x\\in X$. Graafik sümmeetriline nullpunkti suhtes. Näide: $\\sin x$, $x^3$." },
    { id: "fc5", tag: "def", front: "Üksühene funktsioon (injektiivne)", back: "Iga $x_1\\ne x_2$ korral $f(x_1)\\ne f(x_2)$. Ühelgi väärtusel pole üle ühe originaali." },
    { id: "fc6", tag: "def", front: "Pealekujutus (sürjektiivne)", back: "$f(X)=Y$ — iga $y\\in Y$ korral leidub originaal $x\\in X$." },
    { id: "fc7", tag: "def", front: "Üksühene pealekujutus (bijektiivne)", back: "Funktsioon on korraga üksühene JA pealekujutus. Ainult sellisel funktsioonil saab defineerida pöördfunktsiooni." },
    { id: "fc8", tag: "def", front: "Liitfunktsioon $h=g\\circ f$", back: "$h(x)=g(f(x))$. NB: $g\\circ f \\ne f\\circ g$ üldjuhul (ei ole kommutatiivne)." },
    { id: "fc9", tag: "def", front: "Pöördfunktsioon $f^{-1}$", back: "Määratud võrdusega $f^{-1}(y)=x$, kus $f(x)=y$. Olemas ainult siis, kui $f$ on üksühene pealekujutus." },
    { id: "fc10", tag: "fact", front: "$\\sin^{-1}x$ tähendab...", back: "Pöördfunktsiooni $\\arcsin x$, MITTE $\\dfrac{1}{\\sin x}$!" },
    { id: "fc11", tag: "fact", front: "$a^0 = ?$", back: "$a^0=1$ (iga $a>0$ korral)." },
    { id: "fc12", tag: "fact", front: "$a^{x+y} = ?$", back: "$a^{x+y}=a^x\\cdot a^y$" },
    { id: "fc13", tag: "fact", front: "$\\log(xy) = ?$", back: "$\\log|x|+\\log|y|$ (kui $xy>0$)" },
    { id: "fc14", tag: "fact", front: "$\\log_a x$ baasiteisendus", back: "$\\log_a x = \\dfrac{\\ln x}{\\ln a}$" },
    { id: "fc15", tag: "fact", front: "$\\ln e = ?\\qquad \\ln 1 = ?$", back: "$\\ln e = 1, \\qquad \\ln 1 = 0$" },
    { id: "fc16", tag: "fact", front: "$\\arccos x + \\arcsin x = ?$", back: "$\\dfrac{\\pi}{2}$" },
    { id: "fc17", tag: "fact", front: "$\\arctan x + \\operatorname{arccot} x = ?$", back: "$\\dfrac{\\pi}{2}$" },
    { id: "fc18", tag: "graph", front: "$\\arcsin$ väärtuste hulk (muutumispiirkond)", back: "$\\left[-\\dfrac{\\pi}{2},\\dfrac{\\pi}{2}\\right]$" },
    { id: "fc19", tag: "graph", front: "$\\arccos$ väärtuste hulk", back: "$[0,\\pi]$" },
    { id: "fc20", tag: "graph", front: "$\\arctan$ väärtuste hulk", back: "$\\left(-\\dfrac{\\pi}{2},\\dfrac{\\pi}{2}\\right)$" },
    { id: "fc21", tag: "fact", front: "$\\sec x = ?$", back: "$\\sec x = \\dfrac{1}{\\cos x}$" },
    { id: "fc22", tag: "fact", front: "$\\csc x = ?$", back: "$\\csc x = \\dfrac{1}{\\sin x}$" },
    { id: "fc23", tag: "def", front: "Elementaarfunktsioon", back: "Saadav põhilistest elementaarfunktsioonidest lõpliku arvu aritmeetiliste tehete ja liitfunktsiooni moodustamise teel." },
    { id: "fc24", tag: "def", front: "Jada", back: "Naturaalarvulise argumendiga funktsioon $x=x(n)$, $n=1,2,\\dots$ Tähis $(x_n)$." },
    { id: "fc25", tag: "graph", front: "Millised astmefunktsioonid ($y=x^a$) on paaritud ja üksühesed?", back: "Paaritu astmeeksponendiga, nt $x, x^3, x^5,\\dots$ ning $x^{1/3}, x^{1/5},\\dots$" },
    { id: "fc26", tag: "fact", front: "Millist tähte kasutatakse Euleri arvu jaoks ja ligikaudu mis väärtus tal on?", back: "$e \\approx 2{,}71828\\dots$ — kasutusel eksponent-/logaritmfunktsioonide alusena." }
  ],

  practice: {
    source: "Praktikum 1 — Funktsioonid",
    problems: [
      {
        id: "1.1",
        prompt: "Kirjutage välja järgmised funktsionaalsed sõltuvused.",
        sub: [
          "Ümara lati tugevus $S$ on võrdeline tema jämeduse $h$ neljanda astmega",
          "Delfiini energiakulu $E$ ujudes on proportsionaalne tema liikumiskiiruse $v$ kuubiga",
          "Teekonna keskmine kiirus $v$ on pöördvõrdeline kulutatud ajaga $t$",
          "Kahe keha vaheline gravitatsioonijõud $G$ on pöördvõrdeline kehade vahelise kauguse ruuduga"
        ],
        answer: null
      },
      {
        id: "1.3",
        prompt: "Selgitage, kas funktsioonide $f(x)=x+1$ ja $g(x)=\\dfrac{x^2-1}{x-1}$ korral kehtib võrdus $f=g$? Skitseerige nende funktsioonide graafikud.",
        answer: "Ei kehti. ($g$ määramispiirkonnast puudub $x=1$, $f$-i omast mitte — funktsioonid ei ole võrdsed, kuigi valemid taanduvad samaks väljaspool $x=1$.)"
      },
      {
        id: "1.4",
        prompt: "Skitseerige järgmiste funktsioonide graafikud (kasuta peatüki graafikuid abiks: nihked, peegeldused, skaleerimised).",
        sub: [
          "$f(x)=-x^2+1$", "$f(x)=\\log(-x)$", "$f(x)=\\sin(x-\\pi)$", "$f(x)=\\arcsin x+\\pi/2$",
          "$f(x)=e^{-2x}$", "$f(x)=\\cos x$", "$f(x)=\\cos 2x$", "$f(x)=\\cos 3x$",
          "$f(x)=\\sin\\frac{x}{2}$", "$f(x)=\\sin\\frac{x}{4}$", "$f(x)=\\tan 2x$", "$f(x)=\\tan(x-2\\pi)$"
        ],
        answer: null
      },
      {
        id: "1.9",
        prompt: "Leidke järgmiste funktsioonide määramis- ja muutumispiirkonnad.",
        sub: [
          "$f(x)=\\sqrt{x+4}$", "$f(x)=\\sqrt{x^2-4}$", "$f(x)=\\log(x-6)$",
          "$f(x)=\\dfrac{1}{\\log(1-x)}+\\sqrt{x+2}$", "$f(x)=\\dfrac{1}{\\ln(2-x)}$",
          "$f(x)=\\arcsin(2x-1)$", "$f(x)=\\arccos\\dfrac{2}{1+x}$"
        ],
        answer: "(a) X=[−4,∞), Y=[0,∞)  (b) X=(−∞,−2]∪[2,∞), Y=[0,∞)  (c) X=(6,∞), Y=ℝ  (d) X=[−2,1)∖{0}, Y=ℝ∖[√3, 1/log3)  (e) X=(−∞,1)∪(1,2), Y=ℝ∖{0}  (f) X=[0,1], Y=[−π/2,π/2]  (g) X=(−∞,−3]∪[1,∞), Y=[0,π]∖{π/2}"
      },
      {
        id: "1.10",
        prompt: "Selgitage, millised järgmistest funktsioonidest on paaris- ja millised on paaritud funktsioonid.",
        sub: [
          "$f(x)=\\dfrac{3}{x}-x^3$", "$f(x)=x(5^{2x}-5^{-2x})$", "$f(x)=\\dfrac{\\arcsin x}{\\arctan x}$",
          "$f(x)=\\sin x - x\\cos x$", "$f(x)=\\sin x - \\cos x$"
        ],
        answer: "(a) Paaritu  (b) Paaris  (c) Paaris  (d) Paaritu  (e) Pole paaris ega paaritu"
      },
      {
        id: "1.11",
        prompt: "Selgitage, millised järgmistest funktsioonidest on perioodilised, leidke vähim periood $T$.",
        sub: [
          "$f(x)=\\sin 2x$", "$f(x)=\\cos 3x$", "$f(x)=x^2$", "$f(x)=\\tan\\dfrac{x}{2}+3$"
        ],
        answer: "(a) T=π  (b) T=2π/3  (c) Ei ole perioodiline funktsioon  (d) T=2π"
      }
    ],
    note: "Ülesanded 1.2, 1.5–1.8 on graafiku-/arutlusülesanded (mõõtmine, joonised, tabelid) — ametlikku lühivastust materjalides pole, need tasub läbi teha ja praktikumis/loengus üle kontrollida."
  }
};
