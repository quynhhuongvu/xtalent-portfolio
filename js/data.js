/* missies: pas hier de tekst aan. status: "done" of "lock". */
const MISSIONS = [
  {no:"01", title:"AQUATOPIA", icon:"chest", status:"done", scene:"sub", meta:"12 nov 2025",
   txt:"Hack The Future: een dag lang de systemen van een gecrashte duikboot herstellen. Mijn allereerste hackathon.",
   when:"12 november 2025", loot:"Databases zijn veel meer dan opslag: structuur, optimalisatie, security en prestaties spelen allemaal mee. Ik zette mijn eerste stappen in AI en vector search. En ik leerde dat je tijdens een hackathon niet te lang mag vastzitten aan één oplossing, en dat het oké is om te vragen wat je niet begrijpt.", link:"#",
   more:["Challenge \"Discoverers of the Great DBArrier Reef\" van Monin & Exitas. Als team Stoeptegel herstelden we een kapotte Oracle-database op een Linux-VM: control files terugzetten, accounts ontgrendelen, back-ups importeren met Data Pump en een database link leggen tussen twee pluggable databases.", "Het laatste checkpoint was het moeilijkst: de AI-assistent Haddock moest de handleidingen van de duikboot kunnen doorzoeken. We zetten pdf's om naar tekst, knipten die in chunks en maakten er vector embeddings van. Ik had nog nooit met vectoren gewerkt, dus ik vroeg eerlijk hulp aan de coaches.", "Resultaat: 79% en de 2e plaats van de 18 teams in de juryranking, goed voor een top 3-nominatie. Dit jaar doe ik opnieuw mee!"]},
  {no:"02", title:"GRAILS", icon:"flag", status:"done", scene:"phish", meta:"maart – mei 2026",
   txt:"Internationale competitie (IBA Kolding) waarin we met een team een verantwoorde AI-oplossing bouwden rond de SDG's.",
   when:"maart – mei 2026", loot:"Een goede AI-oplossing is meer dan een accuraat model: transparantie, privacy en bruikbaarheid voor de doelgroep tellen even zwaar. Ik leerde een technisch project helder te presenteren aan een jury die niet altijd technisch is, en om op tijd los te laten in plaats van eindeloos aan details te schaven.", link:"#",
   more:["Met team Arctic Intelligence (vier PXL-studenten) bouwden we Arctic Security Shield: een Flask-webapp die phishing en oplichting herkent via een URL-scanner, een e-mailanalyse en een telefoonchecker, met uitleg in eenvoudige taal en een Gmail-add-on. Hoofddoel: SDG 10, ongelijkheid verminderen.", "Ik nam de pipeline, de beveiliging van de app en de frontend op mij. Omdat onze doelgroep weinig technische kennis heeft, hield ik de interface eenvoudig en duidelijk.", "In mei reisden we met trein en bus naar Kolding voor de GRAILS-week, waar we de 2e plaats behaalden in de categorie Best Ethical Innovation."]},
  {no:"03", title:"CURSE OF ACHROMA", icon:"lock", status:"lock", meta:"24 nov 2026",
   txt:"Deze missie is nog niet gespeeld. Hier komt het verslag na 24 november.",
   when:"24 november 2026", loot:"ERROR 404 · LOOT NIET GEVONDEN", link:"#"},
  {no:"EAT", title:"NOM NOM NOM", icon:"bowl", status:"rest", rest:true, meta:"nom nom nom",
   txt:"Nom nom nom. Nom nom nom nom nom!",
   when:"Nom nom nom!", loot:"Nom nom nom nom...", link:"#"},
  {no:"XX", title:"EIND-REFLECTIE", icon:"door", status:"lock", scene:"mirror", meta:"the end",
   txt:"Het laatste level: terugblik op alles wat ik deed en hoe ik groeide.",
   when:"ERROR 404 · DATUM NIET GEVONDEN", loot:"ERROR 404 · LOOT NIET GEVONDEN", link:"#"}
];

/* logboek: alle activiteiten (uit je portfolio-docx). type: sem | pop | inno | int status: done | up */
const TYPES={sem:{label:"SEMINARIES",icon:"coin"},pop:{label:"POP",icon:"heart"},inno:{label:"INNOVATIE",icon:"chest"},int:{label:"INTERNATIONAAL",icon:"flag"}};
const HOURS=[["Innovatie",50],["Internationalisering",30],["Persoonlijke ontw.",33],["Seminaries",24]]; // uit i-talent attest
const LOG=[
  {yr:"2023–2024",ts:"TS2",date:"12/02 – 16/02/2024",type:"pop",title:"Projectweek 2TIN",txt:"Workshops over soft skills, netwerken en Big Data in mobiliteit.",loc:"PXL Campus",dur:""},
  {yr:"2023–2024",ts:"TS2",date:"27/02/2024",type:"pop",title:"POP-sessie: Brein aan het werk!",txt:"Focus, singletasking en de Pomodoro-methode.",loc:"PXL Campus",dur:""},
  {yr:"2023–2024",ts:"TS2",date:"27/02/2024",type:"pop",title:"POP-sessie: POPping",txt:"Zelfkennis, sterktes en valkuilen via het Johari-venster.",loc:"PXL Campus",dur:""},
  {yr:"2023–2024",ts:"TS2",date:"12/03/2024",type:"sem",title:"Easi: Microsoft Cloud – Azure & Intune",txt:"Azure core services, Azure AD in hybride omgevingen, zero trust, Microsoft 365 en Intune.",loc:"Easi, PXL Campus",dur:"3 u"},
  {yr:"2023–2024",ts:"TS2",date:"19/03/2024",type:"sem",title:"Toreon: Ethical Hacking",txt:"In teams zelf verschillende systemen hacken.",loc:"Toreon, PXL Campus",dur:"3 u"},
  {yr:"2023–2024",ts:"TS2",date:"16/04/2024",type:"sem",title:"Ordina: CI/CD use case",txt:"Hands-on lab waarin we zelf software pipelines bouwden.",loc:"Ordina, PXL Campus",dur:"3 u"},
  {yr:"2023–2024",ts:"TS2",date:"23/04/2024",type:"sem",title:"Gluo: Multicloud workshop",txt:"Werken met meerdere cloudplatformen, met hands-on labs.",loc:"Gluo, PXL Campus",dur:"3 u"},
  {yr:"2025–2026",ts:"TS3",date:"02/10 – 09/10/2025",type:"inno",title:"Innovatieroute: Security & Cloud",txt:"Workshops van Fortinet, Exclusive Networks en Resilix: firewalls, VPN, SD-WAN, ransomware en incident response.",loc:"PXL, Corda Campus",dur:""},
  {yr:"2025–2026",ts:"TS3",date:"08/10/2025",type:"pop",title:"POP-sessie: My team and I",txt:"Teamdynamica en het model van Lencioni (5 frustraties van teamwork).",loc:"PXL, Corda Campus",dur:""},
  {yr:"2025–2026",ts:"TS3",date:"05/11/2025",type:"sem",title:"Brightest: Pentesting",txt:"Web-, API- en netwerkpentests en red teaming.",loc:"Brightest, Corda Campus",dur:"3 u"},
  {yr:"2025–2026",ts:"TS3",date:"12/11/2025",type:"inno",title:"Hack the Future: Aquatopia",txt:"SQL-herstel en een AI vector search engine bouwen.",loc:"Flanders Meeting & Convention Center, Antwerpen",dur:"13 u"},
  {yr:"2025–2026",ts:"TS3",date:"26/11/2025",type:"sem",title:"Equans: Ethical hacking",txt:"PLC's hacken in een gesimuleerde fabrieksomgeving.",loc:"Equans, Corda Campus",dur:""},
  {yr:"2025–2026",ts:"TS3",date:"03/12/2025",type:"sem",title:"Gluo: DevSecOps",txt:"Beveiliging van DevOps-processen en GitLab pipelines in 6 hands-on labs.",loc:"Gluo, Corda Campus",dur:"3 u"},
  {yr:"2025–2026",ts:"TS3",date:"10/12/2025",type:"sem",title:"Cegeka: bezoek aan datacenter",txt:"Fysieke infrastructuur en hot/cold aisle design voor koeling.",loc:"Cegeka, Hasselt",dur:"3 u"},
  {yr:"2025–2026",ts:"TS3",date:"02/03 – 22/05/2026",type:"int",title:"BIP: GRAILS",txt:"Online sessies en GRAILS-week in Kolding. Arctic Security Shield, een AI-tool tegen phishing.",loc:"Online + IBA Business Academy, Kolding (DK)",dur:"30 u"},
  {yr:"2026–2027",ts:"Extra",date:"24/11/2026",type:"inno",title:"Hack the Future: The Curse of Achroma",txt:"ERROR 404 · deze missie is nog niet gespeeld.",loc:"Flanders Meeting & Convention Center, Antwerpen",dur:"13 u",status:"up"}
];
