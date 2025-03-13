import {Command, CommandRunner, Option} from 'nest-commander';
import {PrismaService} from "../Core/Datasource/Prisma";
import {User, Link as LinkPrisma, LinkGroup as LinkGroupPrisma, LinkGroupLink} from "@prisma/client";
import {exit} from "@nestjs/cli/actions";
import UseCaseFactory from "../Api/UseCase/UseCaseFactory";
import CreateLinkFromLinkGroupUseCase
    from "../Api/UseCase/Links/Link/CreateLinkFromLinkGroupUseCase/CreateLinkFromLinkGroupUseCase";
import {SaveLinkGroupDto} from "../Api/Dto/LinkDto/SaveLinkGroupDto";
import {SaveLinkDto} from "../Api/Dto/LinkDto/SaveLinkDto";
import {ContextualGraphqlRequest} from "../index";

interface BasicCommandOptions {
    string?: string;
    boolean?: boolean;
    number?: number;
    email?: string;
    keep?: boolean;
}

interface Note {
    title: string,
    content: string,
}

interface Link {
    name: string,
    link: string,
    description: string,
    clickedCounter: string,
    linkGroupId: string
}

interface LinkGroup {
    id: string,
    name: string,
    description?: string
}

@Command({
    name: 'importLegacy',
    description: 'Import the legacy data from the previous MWC Angular app',
})

export class ImportLegacyCommand extends CommandRunner {
    private user: User
    private notes: Note[] = [
	  {
		title: 'Bloc-Notes',
		content: 'JE DOIS TOUJOURS AGIR DE LA FACON LA PLUS PRODUCTIVE POSSIBLE\\n\\njenn : 0033 7 77 03 94 45\\n\\nInventaire : Emilie \\n\\nPas trouvé dans l\'entrepôt : Rudy\\n\\nAffichage de mantra\\nWidget recherche d\'emploi - suivi postulation \\nRecherche connexion Chromecast \\n\\n10 miles Charleroi \\n\\nVidéo Anderlues Belrack \\n\\n\\n asbl@hdmnetwork.com\\nxm+qC$55w-Ych_W\\nhttps://pro3.mail.ovh.net/\\n\\nCv vidéo portfolio\\n\\nNeocitran\\nToutypasse.be\\n\\nModule :\\n- CRM\\n- Sales\\n- Purchase\\n- Website\\n- ecommerce\\n- inventory\\n- project timesheet\\n- studio\\n- marketing'
	  },
	  {title: 'En cas de piscine surprise', content: '- Brosse à cheveux - Crème hydratante'},
	  {
		title: 'Manuel Git',
		content: "git init -> initialisation de Git\\ngit clone -> cloner un projet git\\ngit status -> Voir l\'état d\'une branche\\ngit add [filename] -> ajouter un fichier dans le staged area\\ngit add . -> ajouter tous les fichiers dans le staged area\\ngit remove [filename] -> retirer un fichier du staged area\\ngit remove . -> retirer tous les fichiers dans le staged area\\ngit commit -m -> créer un noeud dans l\'historique\\ngit restore [filename] -> restaurer un fichier au dernier commit\\ngit reset --hard -> restaurer tous les fichiers au dernier commit (usage avec parcimonie : kill)\\ngit reset --hard [commitName or head or tag] -> retirer tout les commits jusqu\'au commit mentionné\\ngit revert [commitName] -> crée un commit qui reviendra à l\'état du commit mentionné et mets le head dessus\\ngit checkout -> changer le working directory par rapport à un noeud de l\'historique\\ngit log -> display l\'historique (les commits)\\ngit log --graph -> display l\'historique avec le graph des branches\\ngit checkout -> changer le working directory par rapport à un noeud de l\'historique\\ngit checkout -b [branchName] -> créer une branche et checkout sur la brahce\\ngit branch -> voir toutes les branches\\ngit branch [branchName] -> créer une branche\\ngit branch -d [branchName] -> supprimer une branche\\ngit merge -> fusionner une branche\\ngit rebase [master || branchName] -> remettre à niveau ma branche à partir des modifications de master. \\ngit stash -> revenir au dernier commit et sauvegarder le travail en brouillon (pour changer de branche par exemple)\\ngit stash apply -> récuperer le travail en brouillon\\ngit remote add [Depot (origin la plupart du temps)] [url] -> lie un dépôt local à un dépot distant\\ngit remote remove [Depot (origin la plupart du temps)] [url] -> délie un dépôt local à un dépot distant\\ngit push [Depot (origin surement)] --all -> met à jour le distant avec le local\\ngit fetch -> mets à jour l\'historique locale avec le distant\\ngit put -> met à jour et fusionne le local avec le distant\\ngit cherry-pick [commitName] -> ajoute un commit précis à la branche courante\\ngit tag [tagName] -> ajoute un tag à la branche courante'"
	  },
	  {
		title: 'Git Odoo',
		content: 'FETCH ET RELOAD\\ngit fetch origin master\\ngit reset --hard origin/master\\n\\nNOUVELLE BRANCHE\\ngit fetch origin master\\ngit reset --hard origin/master\\ngit checkout -b "Nouvelle branche" (ne pas oublier -davg à la fin de la branche)\\n\\nREBASE\\ngit fetch origin master\\ngit rebase origin/master\\n\\nPASSER EN 17.0\\ngit fetch origin 17.0 && git checkout 17.0 && git reset --hard origin/17.0'
	  },
	  {
		title: 'tags html',
		content: '<!DOCTYPE html>\\n<html lang="fr">\\n<head>\\n  <meta charset="UTF-8">\\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n  <title>Ajouter une note interne</title>\\n  <style>\\n    .tags-container {\\n      display: flex;\\n      flex-wrap: wrap;\\n      padding: 5px;\\n      border: 1px solid #ccc;\\n      border-radius: 3px;\\n      min-height: 100px;\\n    }\\n    .tag {\\n      background-color: #d1e7dd;\\n      color: #0f5132;\\n      padding: 5px 10px;\\n      border-radius: 3px;\\n      margin: 2px;\\n      display: inline-flex;\\n      align-items: center;\\n    }\\n    .tag .remove-tag {\\n      margin-left: 5px;\\n      cursor: pointer;\\n    }\\n    .input-container {\\n      display: flex;\\n      flex-wrap: wrap;\\n      flex: 1;\\n    }\\n    .input-container input {\\n      border: none;\\n      outline: none;\\n      padding: 5px;\\n      flex: 1;\\n      min-width: 150px;\\n    }\\n  </style>\\n</head>\\n<body>\\n  <div>\\n    <label for="note-input">Ajouter une note interne :</label><br>\\n    <div class="tags-container" id="tags-container">\\n      <div class="input-container">\\n        <input type="text" id="note-input" placeholder="Écrivez votre note et appuyez sur Entrée...">\\n      </div>\\n    </div>\\n  </div>\\n\\n  <script>\\n    document.getElementById(\'note-input\').addEventListener(\'keydown\', function(event) {\\n      const noteInput = document.getElementById(\'note-input\');\\n      const tagsContainer = document.getElementById(\'tags-container\');\\n\\n      if (event.key === \'Enter\') {\\n        event.preventDefault();\\n        const tagText = noteInput.value.trim();\\n        if (tagText) {\\n          const tag = document.createElement(\'div\');\\n          tag.className = \'tag\';\\n          tag.innerHTML = `${tagText} <span class="remove-tag">&times;</span>`;\\n          tagsContainer.insertBefore(tag, noteInput.parentElement);\\n          noteInput.value = \'\';\\n          tag.querySelector(\'.remove-tag\').addEventListener(\'click\', function() {\\n            tagsContainer.removeChild(tag);\\n          });\\n        }\\n      } else if (event.key === \'Backspace\' && noteInput.value === \'\') {\\n        const tags = tagsContainer.getElementsByClassName(\'tag\');\\n        if (tags.length > 0) {\\n          const lastTag = tags[tags.length - 1];\\n          tagsContainer.removeChild(lastTag);\\n        }\\n      }\\n    });\\n  </script>\\n</body>\\n</html>'
	  },
	  {
		title: 'To do HDM',
		content: 'Duotrotter :\\n - éditer activité, resto, logement\\n - crée les conseils (webdesign, site web, console d\'admin)\\n - crée les carnets de voyages   (webdesign, site web, console d\'admin)\\n\\nNawakim :\\n - classement divers\\n - goldmember\\n - Tutoriel\\n - document aide dans chaque section\\n - lister et crée les quetes\\n - ajouter des animations\\n - crée les objectifs quotidiens (perso et guildes)\\n - contacter un admin\\n - crée le casino\\n - exposer sa collection de carte\\n - creuser avec une pelle\\n - hacher du bois avec la hache\\n\\nHDM network dashboard :\\n - avancé sur les docs/vidéos de formation\\n - coder les certifications'
	  },
	  {
		title: 'GraphQL reminder',
		content: 'Coté back :\\n\\nnpx prisma generate\\nnpx prisma migrate dev\\n\\nCôté front :\\nyarn generate'
	  },
	  {
		title: 'Factory nest',
		content: '@Injectable()\\nexport default abstract class CapacityFactory<U extends UseCase<any, any>> {\\n  constructor(protected readonly container: ModuleRef) {}\\n\\n  async create<T extends any>(capacityId: number): Promise<T> {\\n    this.container.create(BufForceCapacityUseCase);\\n  }\\n}'
	  },
	  {
		title: 'Kdo Gaëlle ',
		content: 'Concert Maneskin\\nCours de photo\\nLisbonne-madrid-corse-copenhagen-cagliari-vienne-orient express\\nThe tote bag - marc Jacob\\naifryer\\n'
	  },
	  {
		title: 'Suivi horaire CR Carrelage',
		content: '14-01-25 : 3 heures avant plantage de timesheet (180 minutes)\\n15-01-25 : 110 minutes\\n8h07 - 8h26 - 19\\n9h28 - 09h58 - 30\\n10h08 - 10h15 - 7\\n11h50 - 12h30 - 40\\n12h58 - 13h12 - 14'
	  },
	  {title: 'Beone', content: 'Edwin pack horaires '}
    ];
    private link_groups: LinkGroup[] = [
	  {id: '2', name: 'Github', description: ''},
	  {id: '3', name: 'HTML', description: ''},
	  {id: '4', name: 'CSS', description: ''},
	  {id: '5', name: 'WEBDESIGN', description: ''},
	  {id: '6', name: 'MARKDOWN', description: ''},
	  {id: '7', name: 'PHP', description: ''},
	  {id: '8', name: 'JAVASCRIPT', description: ''},
	  {id: '9', name: 'FRAMEWORK JAVASCRIPT', description: ''},
	  {id: '10', name: 'NODE', description: ''},
	  {id: '11', name: 'REACT JS', description: ''},
	  {id: '12', name: 'SEO', description: ''},
	  {id: '13', name: 'EXTRA', description: ''},
	  {id: '14', name: 'JOB', description: ''},
	  {id: '15', name: 'ANGULAR', description: ''},
	  {id: '27', name: 'Odoo', description: ''},
	  {id: '44', name: 'Projet HDM', description: ''},
	  {id: '54', name: 'Informations', description: ''},
	  {id: '55', name: 'IA', description: ''},
	  {id: '56', name: 'Jeux', description: ''}
    ];
    private links : Link[] = [
	  {name:'Chat GPT',link:'https://chat.openai.com/chat',description:'',clickedCounter:'193',linkGroupId:'13'},
	  {name:'7sur7',link:'https://www.7sur7.be',description:'',clickedCounter:'184',linkGroupId:'54'},
	  {name:'Photopea',link:'https://www.photopea.com/',description:'',clickedCounter:'116',linkGroupId:'5'},
	  {name:'Odoo : My runbot',link:'https://runbot.odoo.com/runbot/r-d-1?search=davg',description:'',clickedCounter:'67',linkGroupId:'27'},
	  {name:'Monopoly go',link:'https://www.monopolygo.com/',description:'',clickedCounter:'57',linkGroupId:'56'},
	  {name:'Boite mail HDM',link:'https://pro3.mail.ovh.net/',description:'',clickedCounter:'55',linkGroupId:'44'},
	  {name:'Spotify Xtended',link:'https://xtended.hdmnetwork.com/',description:'',clickedCounter:'41',linkGroupId:'44'},
	  {name:'Icones8',link:'https://icones8.fr/',description:'',clickedCounter:'13',linkGroupId:'5'},
	  {name:'Belrack Admin',link:'https://www.belrack.be/admin/',description:'',clickedCounter:'12',linkGroupId:'44'},
	  {name:'Pack JS',link:'https://salukimakingcode.github.io/pack/',description:'',clickedCounter:'9',linkGroupId:'9'},
	  {name:'CDN',link:'https://console.scaleway.com/object-storage/buckets/fr-par/hdmnetwork-cdn/files/nouvelan/',description:'',clickedCounter:'8',linkGroupId:'44'},
	  {name:'Dashboard',link:'https://www.hdmnetwork.be/',description:'',clickedCounter:'7',linkGroupId:'44'},
	  {name:'Redimensionner image',link:'https://www.iloveimg.com/fr/redimensionner-image#resize-options,pixels',description:'',clickedCounter:'6',linkGroupId:'5'},
	  {name:'I Love PDF',link:'https://www.ilovepdf.com/fr',description:'',clickedCounter:'6',linkGroupId:'13'},
	  {name:'github',link:'https://github.com/',description:'',clickedCounter:'5',linkGroupId:'2'},
	  {name:'Nawakim Beta',link:'https://beta.nawakim.com/home',description:'',clickedCounter:'5',linkGroupId:'44'},
	  {name:'Roue Chromatique',link:'https://color.adobe.com/fr/create/color-wheel',description:'',clickedCounter:'4',linkGroupId:'5'},
	  {name:'Italia',link:'https://italia.hdmnetwork.com/home',description:'',clickedCounter:'4',linkGroupId:'44'},
	  {name:'HTML : Preload',link:'https://developer.mozilla.org/fr/docs/Web/HTML/Link_types/preload',description:'',clickedCounter:'3',linkGroupId:'3'},
	  {name:'Pixabay',link:'https://pixabay.com/',description:'',clickedCounter:'3',linkGroupId:'5'},
	  {name:'cloneur de voix',link:'https://play.ht/',description:'',clickedCounter:'3',linkGroupId:'13'},
	  {name:'Perplexity',link:'https://www.perplexity.ai/',description:'',clickedCounter:'3',linkGroupId:'55'},
	  {name:'github : La doc',link:'https://git-scm.com/book/en/v2',description:'',clickedCounter:'2',linkGroupId:'2'},
	  {name:'HTML : les balises semantiques',link:'https://ronan-hello.fr/series/html/balises-semantiques-html',description:'',clickedCounter:'2',linkGroupId:'3'},
	  {name:'La doc complète',link:'https://developer.mozilla.org/en-US/docs/Web/CSS',description:'',clickedCounter:'2',linkGroupId:'4'},
	  {name:'JSON to Typescript',link:'https://transform.tools/json-to-typescript',description:'',clickedCounter:'2',linkGroupId:'8'},
	  {name:'Angular : Le cours',link:'https://openclassrooms.com/fr/courses/7471261-debutez-avec-angular',description:'',clickedCounter:'2',linkGroupId:'15'},
	  {name:'Timesheet io',link:'https://web.timesheetio.app/',description:'',clickedCounter:'2',linkGroupId:'44'},
	  {name:'Tiny png',link:'https://tinypng.com/',description:'',clickedCounter:'2',linkGroupId:'5'},
	  {name:'Flux IA',link:'https://flux-ai.io/',description:'',clickedCounter:'2',linkGroupId:'13'},
	  {name:'jira mywebcompanion',link:'https://mywebcompanionhdm.atlassian.net/jira/software/projects/SCRUM/boards/1',description:'',clickedCounter:'2',linkGroupId:'44'},
	  {name:'Google Play Android Developers',link:'https://developer.android.com/distribute/console?hl=fr',description:'',clickedCounter:'2',linkGroupId:'13'},
	  {name:'github : Learn Git by bitBucket',link:'https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud',description:'',clickedCounter:'1',linkGroupId:'2'},
	  {name:'HTML : la doc complète',link:'https://developer.mozilla.org/en-US/docs/Web/HTML',description:'',clickedCounter:'1',linkGroupId:'3'},
	  {name:'Générateur de gradient 1',link:'https://html-css-js.com/css/generator/gradient/',description:'',clickedCounter:'1',linkGroupId:'4'},
	  {name:'Undraw',link:'https://undraw.co/illustrations',description:'',clickedCounter:'1',linkGroupId:'5'},
	  {name:'State of Javascript',link:'https://stateofjs.com/en-us/',description:'',clickedCounter:'1',linkGroupId:'13'},
	  {name:'Material',link:'https://material.angular.io/components/categories',description:'',clickedCounter:'1',linkGroupId:'15'},
	  {name:'Stock IO',link:'https://web.stockio.app/',description:'',clickedCounter:'1',linkGroupId:'44'},
	  {name:'Contrat de prestation',link:'https://www.canva.com/design/DAGSg9Y07io/fAWQDpT-_n1j99Ptiq8l_w/edit',description:'',clickedCounter:'1',linkGroupId:'44'},
	  {name:'Expo : build',link:'https://docs.expo.dev/build/introduction/',description:'',clickedCounter:'1',linkGroupId:'11'},
	  {name:'Sembly',link:'https://www.sembly.ai/',description:'',clickedCounter:'1',linkGroupId:'55'},
	  {name:'github : Cheat sheet',link:'https://training.github.com/downloads/github-git-cheat-sheet.pdf',description:'',clickedCounter:'0',linkGroupId:'2'},
	  {name:'github : Learn git hub by practice',link:'https://learngitbranching.js.org/?locale=fr_FR',description:'',clickedCounter:'0',linkGroupId:'2'},
	  {name:'github : Cours codecademy',link:'https://www.codecademy.com/courses/learn-git/lessons/git-workflow/exercises/hello-git',description:'',clickedCounter:'0',linkGroupId:'2'},
	  {name:'Guide complète',link:'https://www.w3schools.com/css/css3_animations.asp',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Démo des animation',link:'https://acchou.github.io/html-css-cheat-sheet/animation.html',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Générateur d\'animation 1',link:'https://animista.net/play/basic',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Générateur d\'animation 2',link:'https://webcode.tools/generators/css/keyframe-animation',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Grid : le guide',link:'https://css-tricks.com/snippets/css/complete-guide-grid/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Grid : Serious games',link:'https://cssgridgarden.com/#fr',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Flex : Le guide',link:'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Flex : Serious games',link:'https://codepip.com/games/flexbox-froggy/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Flex : Générateur',link:'https://flexbox.help/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Les selecteurs CSS',link:'https://www.w3schools.com/cssref/css_selectors.php',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Générateur de gradient 2',link:'https://colordesigner.io/gradient-generator',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'CSS Minifier',link:'https://www.toptal.com/developers/cssminifier',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'animate.css',link:'https://animate.style/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Skeleton',link:'http://getskeleton.com/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Bulma',link:'https://bulma.io/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Tailwind',link:'https://tailwindcss.com/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'SASS : Le site',link:'https://sass-lang.com/',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'SASS : Cheatsheet',link:'https://devhints.io/sass',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'SASS : Cours vidéo',link:'https://www.youtube.com/watch?v=aOccUzHD_MQ&list=PLjwdMgw5TTLWVp8WUGheSrGnmEWIMk9H6',description:'',clickedCounter:'0',linkGroupId:'4'},
	  {name:'Palette de couleur',link:'https://www.schemecolor.com/',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'Figma',link:'https://www.figma.com/',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'Figma : La doc',link:'https://help.figma.com/hc/en-us',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'AnimeJS',link:'https://animejs.com/',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'Greensock',link:'https://greensock.com/',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'Free Webdesign',link:'https://dribbble.com/',description:'',clickedCounter:'0',linkGroupId:'5'},
	  {name:'Markdown : La doc',link:'https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax',description:'',clickedCounter:'0',linkGroupId:'6'},
	  {name:'Markdown : Les emojis',link:'https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md',description:'',clickedCounter:'0',linkGroupId:'6'},
	  {name:'Editeur en ligne',link:'https://readme.so/fr/editor',description:'',clickedCounter:'0',linkGroupId:'6'},
	  {name:'PHP POO',link:'https://openclassrooms.com/fr/courses/1665806-programmez-en-oriente-objet-en-php',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'SOLID et design pattern',link:'https://openclassrooms.com/fr/courses/7415611-ecrivez-du-php-maintenable-avec-les-principes-solid-et-les-design-patterns',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'Twig : La doc',link:'https://twig.symfony.com/doc/3.x/',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'PHP Manuel (en français)',link:'https://www.php.net/manual/fr/',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'String : Fonctions natives',link:'https://www.php.net/manual/fr/ref.strings.php',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'Dates et heures',link:'https://www.php.net/manual/fr/refs.calendar.php',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'Cours codecademy',link:'https://www.codecademy.com/learn/introduction-to-javascript',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Cours Sabe',link:'https://sabe.io/classes/javascript',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Référenciel : Array',link:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Canvas : cours Becode',link:'https://docs.google.com/presentation/d/1bUzIIMzRDGi_LfuNZ-YJEHpRvwHegwhSIrDXtwEJENs/edit#slide=id.g35f391192_04',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Canvas : Alsacreation',link:'https://www.alsacreations.com/tuto/lire/1484-introduction.html',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Destructuring',link:'https://www.learn-js.org/en/Destructuring',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Template literals',link:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Unit test : Jasmine',link:'https://jasmine.github.io/',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Unit test : Mocha',link:'https://mochajs.org/',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Validateur JSON',link:'https://jsonlint.com/',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Javascript Minifier',link:'https://www.toptal.com/developers/javascript-minifier',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Keycode : key press',link:'https://www.toptal.com/developers/keycode',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Canvas : CodeMonster',link:'http://www.crunchzilla.com/code-monster',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Référenciel : Event',link:'https://www.w3schools.com/jsref/dom_obj_event.asp',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Référenciel : date',link:'https://www.w3schools.com/jsref/jsref_obj_date.asp',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Obfuscation de code',link:'https://blog.jscrambler.com/javascript-obfuscation-the-definitive-guide',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Best Of JS',link:'https://bestofjs.org/',description:'',clickedCounter:'0',linkGroupId:'8'},
	  {name:'Chart JS',link:'https://www.chartjs.org/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'Chart JS : exemple',link:'https://css-tricks.com/the-many-ways-of-getting-data-into-charts/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'Dimple JS',link:'http://dimplejs.org/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'D3 JS',link:'https://d3js.org/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'Phaser',link:'https://phaser.io/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'Electron',link:'https://www.electronjs.org/',description:'',clickedCounter:'0',linkGroupId:'9'},
	  {name:'Express/mongo : Le cours',link:'https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb',description:'',clickedCounter:'0',linkGroupId:'10'},
	  {name:'liste des packs officiel',link:'https://github.com/sindresorhus/awesome-nodejs',description:'',clickedCounter:'0',linkGroupId:'10'},
	  {name:'Pack Jsonfile',link:'https://www.npmjs.com/package/jsonfile',description:'',clickedCounter:'0',linkGroupId:'10'},
	  {name:'Pack Socket.io',link:'https://socket.io/',description:'',clickedCounter:'0',linkGroupId:'10'},
	  {name:'Mongoose : Les Queries',link:'https://mongoosejs.com/docs/queries.html',description:'',clickedCounter:'0',linkGroupId:'10'},
	  {name:'Cours Codecademy',link:'https://www.codecademy.com/learn/react-101',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'La doc (en français)',link:'https://fr.reactjs.org/',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Material UI',link:'https://mui.com/core/',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Les events',link:'https://reactjs.org/docs/events.html#supported-events',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'React sur github pages',link:'https://github.com/gitname/react-gh-pages',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'React Router 6.7',link:'https://reactrouter.com/en/6.7.0/start/tutorial',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Les Hooks',link:'https://reactjs.org/docs/hooks-reference.html',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Memory Leak Issue',link:'https://medium.com/technology-hits/how-to-fix-memory-leak-issue-in-react-js-using-hook-a5ecbf9becf8#:~:text=To%20fix%2C%20cancel%20all%20subscriptions,before%20the%20response%20was%20received',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Toastify',link:'https://fkhadra.github.io/react-toastify/introduction/',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Expo : Les icones',link:'https://icons.expo.fyi/',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Material UI : icons',link:'https://mui.com/material-ui/material-icons/',description:'',clickedCounter:'0',linkGroupId:'11'},
	  {name:'Cours : Les bases',link:'https://openclassrooms.com/fr/courses/5561431-augmentez-votre-trafic-grace-au-referencement-naturel-seo',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Cours : Les perfs techniques',link:'https://openclassrooms.com/fr/courses/5922626-optimisez-le-referencement-de-votre-site-seo-en-ameliorant-ses-performances-techniques',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Google Search Console',link:'https://search.google.com/search-console',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Webrankinfo',link:'https://www.webrankinfo.com/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Screaming Frog',link:'https://www.screamingfrog.co.uk/seo-spider/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Générateur de données structurées',link:'https://www.google.com/webmasters/markup-helper/u/0/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'SEM Rush : le site',link:'https://fr.semrush.com/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'SEM Rush : le blog',link:'https://fr.semrush.com/blog/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : HTML W3C',link:'https://validator.w3.org/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : CSS W3C',link:'https://jigsaw.w3.org/css-validator/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : GTMetrix',link:'https://gtmetrix.com/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : Données structurées',link:'https://developers.google.com/search/docs/appearance/structured-data?hl=fr',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : Page speed',link:'https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect&hl=fr',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : Lighthouse',link:'https://developer.chrome.com/docs/lighthouse/overview/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Mot clef : SEO Hero',link:'http://www.seo-hero.tech/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Mot clef : Uber Suggest',link:'https://neilpatel.com/ubersuggest/',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Mot clef : WordStream',link:'https://www.wordstream.com/keywords',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Validateur : Mobile friendly',link:'https://search.google.com/test/mobile-friendly?hl=fr',description:'',clickedCounter:'0',linkGroupId:'12'},
	  {name:'Chrome device',link:'chrome://inspect/#devices',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Badge : ForTheBadge',link:'https://forthebadge.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Regex',link:'https://regex101.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Typescript : Le cours',link:'https://riptutorial.com/Download/typescript-fr.pdf',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'ORM : Prisma',link:'https://www.prisma.io/docs/getting-started/quickstart',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Mocky : Simulateur Backend',link:'https://designer.mocky.io/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Code Combat',link:'https://codecombat.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Wakatime',link:'https://wakatime.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Badge : Shield.io',link:'https://shields.io/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Awwwards',link:'https://www.awwwards.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Webbyawards',link:'https://www.webbyawards.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Lovie Awards',link:'https://www.lovieawards.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Daily Trends Google',link:'https://trends.google.com/trends/trendingsearches/daily?geo=BE',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Vercel',link:'https://vercel.com/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Question d\'entretien',link:'https://github.com/h5bp/Front-end-Developer-Interview-Questions',description:'',clickedCounter:'0',linkGroupId:'14'},
	  {name:'ICT Job',link:'https://www.ictjob.be/fr/',description:'',clickedCounter:'0',linkGroupId:'14'},
	  {name:'RxJS',link:'https://www.learnrxjs.io/',description:'',clickedCounter:'0',linkGroupId:'15'},
	  {name:'Nebular UI',link:'https://akveo.github.io/nebular/',description:'',clickedCounter:'0',linkGroupId:'15'},
	  {name:'PrimeNG UI',link:'https://www.primefaces.org/primeng/setup',description:'',clickedCounter:'0',linkGroupId:'15'},
	  {name:'Deploy for android 1',link:'https://ionicframework.com/docs/v7/angular/your-first-app/deploying-mobile',description:'',clickedCounter:'0',linkGroupId:'15'},
	  {name:'Deploy for android 2',link:'https://capacitorjs.com/docs/basics/workflow',description:'',clickedCounter:'0',linkGroupId:'15'},
	  {name:'Postmark App',link:'https://postmarkapp.com/lp/postmark-email-api?utm_source=google&utm_medium=cpc&utm_c[…]viGSnSpOViQ4xhBu63r9OyDFid3T_ozklIz2S5ZaTd_Ncz-UaAsa3EALw_wcB',description:'',clickedCounter:'0',linkGroupId:'7'},
	  {name:'Polypane',link:'https://polypane.app/',description:'',clickedCounter:'0',linkGroupId:'13'},
	  {name:'Indeed',link:'https://emplois.be.indeed.com/l-charleroi-emplois.html?vjk=2b13b7085583b6ef',description:'',clickedCounter:'0',linkGroupId:'14'},
	  {name:'Adecco',link:'https://www.adecco.be/fr-be/',description:'',clickedCounter:'0',linkGroupId:'14'},
	  {name:'Unique Interim',link:'https://www.unique.be/fr/',description:'',clickedCounter:'0',linkGroupId:'14'}
    ];

    constructor(
	    private readonly prisma: PrismaService,
	    private readonly useCaseFactory: UseCaseFactory
    ) {
	  super();
    }

    async run(passedParam: string[], options?: BasicCommandOptions): Promise<void> {
	  console.clear();
	  this.checkEmail(options);
	  await this.userProcess(options.email);
	  if (!options.keep) await this.purgeDataBeforeExec();
	  else this.logInfo("Keep option enabled: Skipping data purge.");
	  await this.execImportNotes();
	  await this.execImportLinkGroups();
	  this.logInfo("Finished import for : " + options.email);
    }
    
    logInfo(message: string): void {
	  console.log(`[${new Date().toISOString()}][INFO] : ${message}`);
    }
    
    logSuccess(message: string, tabNumber: number = 1): void {
	  console.log(`${"\t".repeat(tabNumber)} ● [SUCCESS] : ${message}`);
    }
    
    logError(message: string, tabNumber: number = 1): void {
	  console.error(`${"\t".repeat(tabNumber)} ● [ERROR] : ${message}`);
    }

    async purgeDataBeforeExec(): Promise<void> {
	  this.logInfo(`Purging data for ${this.user.email}`);
	  const groups = await this.prisma.linkGroup.findMany({
		where: {
		    userId: this.user.id,
		}
	  });
	  const linkGroupLink = await this.prisma.linkGroupLink.deleteMany({
		where: {
		    linkGroupId: {
			  in: groups.map(group => group.id),
		    },
		},
	  });
	  const link = await this.prisma.link.deleteMany({
		where: {
		    ownerId: this.user.id,
		}
	  });
	  const notes = await this.prisma.note.deleteMany({
		where: {
		    userId: this.user.id,
		}
	  });
	  const linkGroup = await this.prisma.linkGroup.deleteMany({
		where: {
		    userId: this.user.id,
		}
	  });
	  this.logSuccess(`Deleted ${notes.count} notes`);
	  this.logSuccess(`Deleted ${linkGroupLink.count} link group links`);
	  this.logSuccess(`Deleted ${link.count} links`);
	  this.logSuccess(`Deleted ${linkGroup.count} link groups`);
    }

    async execImportNotes(): Promise<void> {
	  this.logInfo("Importing notes");
	  const result = await this.importNotes();
	  if (!result) {
		this.logError('Failed to load importNotes');
		exit();
	  }
	  this.logSuccess(`Imported ${this.notes.length} notes successfully`);
    }

    async execImportLinkGroups(): Promise<void> {
	  this.logInfo("Importing link groups");
	  const result = await this.importLinkGroups();
	  if (!result) {
		this.logError('Failed to load importLinkGroups');
		exit();
	  }
    }

    async importLinkGroups(): Promise<boolean> {
	  // for each link group, create a new link group and find
	  let groupCounter = this.link_groups.length;
	  for (const group of this.link_groups) {
		const createdGroup = await this.linkGroupSave({
		    title: group.name,
		    description: group.description,
		})
		if (!createdGroup) {
		    this.logError(`Failed to create link group ${group.name}`);
		    return false;
		}
		this.logSuccess(`Link group ${group.name} created successfully`);
		const links = this.links.filter(link => link.linkGroupId === group.id);
		let counter = links.length;
		for (const link of links) {
		    await this.linkCreate({
			  linkGroupId: createdGroup.id,
			  linkName:link.name,
			  ownerId: this.user.id,
			  url: link.link
		    })
		    counter--;
		}
		if (counter !== 0) {
		    this.logError(`Failed to create all links for group ${group.name}`);
		    return false;
		}
		this.logSuccess(`Created ${links.length} links successfully`, 2);
		groupCounter--;
	  }
	  if (groupCounter !== 0) {
		this.logError('Failed to create all link groups');
		exit();
	  }
	  return true;
    }

    async importNotes(): Promise<boolean> {
	  let count = this.notes.length;
	  try {
		for (const note of this.notes) {
		    await this.prisma.note.create({
			  data: {
				title: note.title,
				content: "{\"ops\":[{\"insert\":\"" + note.content + "\"}]}",
				user: {
				    connect: {
					  id: this.user.id,
				    },
				},
			  },
		    });
		    count--;
		}
	  } catch (e) {
		this.logError(e);
	  }
	  return count === 0;
    }

    async userProcess(email: string): Promise<void> {
	  this.logInfo(`Starting import for : ${email}`);
	  const user = await this.getExistingUser(email);
	  if (!user) {
		this.logError(`User with email ${email} not found`);
		exit()
	  }
	  this.logInfo(`Found user ${user.email}`);
	  this.user = user;
    }

    async getExistingUser(email: string): Promise<User> {
	  try {
		return await this.prisma.user.findUnique({
		    where: {
			  email: email,
		    },
		});
	  } catch (e) {
		this.logError(e);
		exit();
	  }
    }

    checkEmail(options: BasicCommandOptions): void {
	  if (!options.email) {
		this.logError('Email is required');
		exit();
	  }
    }

    @Option({
	  flags: '-e, --email <email>',
	  description: 'User email address',
    })
    parseEmail(val: string): string {
	  return val;
    }

    @Option({
	  flags: '-k, --keep',
	  description: 'Skip purging existing data (keep data)',
    })
    parseKeep(val: string): boolean {
	  // As a boolean flag, simply return true if provided.
	  return true;
    }


    // UTILS

    async linkGroupSave(dto: SaveLinkGroupDto): Promise<LinkGroupPrisma> {
	  if (dto.id) {
		return this.prisma.linkGroup.update({
		    where: {id: dto.id},
		    data: {
			  title: dto.title,
			  description: dto.description,
		    },
		    include: {user: true, links: {include: {link: true}}},
		});
	  } else {
		return this.prisma.linkGroup.create({
		    data: {
			  title: dto.title,
			  description: dto.description,
			  userId: this.user.id,
		    },
		    include: {user: true, links: {include: {link: true}}},
		});
	  }
    }

    async linkCreate(dto: SaveLinkDto): Promise<any> {
	  // Check if a Link with the same URL already exists.
	  let link = await this.findLinkByUrl(dto.url);
	  if (link) {
		// Ensure the join relation does not already exist.
		const existingRelation = await this.findLinkGroupLink(dto.linkGroupId, link.id);
		if (!existingRelation) {
		    await this.createLinkGroupLink(dto.linkGroupId, link.id, dto.linkName);
		}else {
		    // Update the existing relation name.
		    await this.updateLinkGroupLinkLinkName(dto.linkGroupId, link.id, dto.linkName);
		}
	  } else {
		// Create a new Link and then create the join relation.
		link = await this.createLink(dto);
		await this.createLinkGroupLink(dto.linkGroupId, link.id, dto.linkName);
	  }
	  return link;
    }

    async findLinkByUrl(url: string): Promise<LinkPrisma | null> {
	  return this.prisma.link.findUnique({ where: { url } });
    }

    async findLinkGroupLink(linkGroupId: string, linkId: string): Promise<LinkGroupLink | null> {
	  return this.prisma.linkGroupLink.findUnique({
		where: {linkGroupId_linkId: {linkGroupId, linkId}},
	  });
    }
    async createLinkGroupLink(linkGroupId: string, linkId: string, linkName: string): Promise<LinkGroupLink> {
	  return this.prisma.linkGroupLink.create({
		data: {linkGroupId, linkId, linkName},
	  });
    }
    async updateLinkGroupLinkLinkName(linkGroupId: string, linkId: string, linkName: string): Promise<LinkGroupLink> {
	  return this.prisma.linkGroupLink.update({
		where: {linkGroupId_linkId: {linkGroupId, linkId}},
		data: {linkName},
	  });
    }
    async createLink(dto: SaveLinkDto): Promise<LinkPrisma> {
	  return this.prisma.link.create({
		data: {
		    url: dto.url,
		    ownerId: dto.ownerId,
		    imageId: dto.imageId,
		    screenShotAt: dto.screenShotAt,
		},
	  });
    }
}
