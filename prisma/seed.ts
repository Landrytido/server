// ./prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const affirmations: string[] = [
    'Aujourd\'hui, je vais qu\'il faut au bon endroit et au bon moment pour l\'enrichissement de tous',
    'Les gens m\'apprécient. C\'est étonnant, mais presque tous ceux que je rencontre m\'apprécient vraiment immédiatement. Bien sûr, moi aussi j\'apprécie immédiatement presque tous ceux que je rencontre. Je suppose que les gens perçoivent ce que j\'éprouve',
    'Je me prépare toujours méticuleusement pour chaque chose importante à accomplir. c\'est une des raisons pour lesquelles je...',
    'Je pars toujours en avance pour me rendre à un rendez-vous, de façon à avoir le temps de me préparer mentalement avant d\'arriver sur place',
    'Je débute toujours par ce que j\'ai le moins envie de faire, de façon à ne plus y penser et passer ainsi une bonne journée',
    'Chaque jour, je me rapproche un peu plus de mes objectifs',
    'Je dois toujours agir de la façon la plus productive possible',
    'Je ne me contente d\'aucun quota fixé pour des gens ordinaires, je les dépassent',
    'J\'assume la pleine responsabilité de mes actions et de ma vie. Mon bien-être est entre les meilleurs mains possible : les miennes',
    'Je gagne. Je contribue. Je réalise. Je crois en moi.',
    'C\'en est fini de dépenser pour quelque chose qui creusait ma tombe. Je suis fier d\'avoir arrêté, et je me sens vraiment bien depuis que j\'ai arrêté. J\'ai plus d\'énergie, plus de dynamisme et je me sens plus vivant. Rien ne me fera retoucher à une de ces saloperies de cigarettes',
    'Ma santé est merveilleuse. Tous mes organes fonctionnent parfaitement. Je suis en bonne santé pour sept raisons. Je suis heureux. J\'aime la vie. Je découvre toujours de nouvelles choses fascinantes à faire. Je sais que j\'ai un avenir merveilleux. Je n\'assimile que de bonnes choses dans mon esprit. je fais de l\'exercice régulièrement et de façon équilibrée. Je mange de la nourriture saine et des repas équilibrés',
    'Je lis quelque chose de positif tous les soirs et j\'écoute quelque chose d\'utile tous les matins',
    'J\'évite les gens négatifs et l\'apport négatif des médias. Quand quelqu\'un essaye de me déverser des pensées négatives, je refuse de l\'accepter',
    'J\'accueille toujours favorablement les nouvelles idées positives',
    'Il est étonnant de constater combien souvent je fais la connaissance de gens intéressants ayant des opinions enthousiastes',
    'Je ne gaspille jamais mon temps avec des gens négatifs',
    'Je remets à jour mes auto-instructions une fois par mois et je les passe en revue trois fois par jour',
    'Je peux le faire',
    'Je respecte  trop mon être et mon avenir pour gaspiller de l\'énergie à prouver des choses sans importance. Je n\'ai pas besoin de le faire. Mais quand mes intérêts vitaux sont vraiment en jeu, je suis un combattant intelligent, plein de ressources, âpre, et je gagne !',
    'Je suis toujours calme. Rien ne peut m\'atteindre au point de ne pas pouvoir me contenir, jusqu\'à ce que j\'aie l\'occasion de chasser ma colère en suant à grosses gouttes. Ensuite, je décide comment aborder le problème, s\'il y a lieu. Ma théorie est la suivante : calme et astuce ont toujours leur place',
    'Mes émotions ne me contrôlent pas, c\'est moi qui les contrôle. Je n\'accumule pas la tension et je ne grince pas des dents, je contrôle mes émotions en utilisant mon corps et mon esprit comme entité unique. Au lieu d\'essayer de contenir colère et stress pendant de longues périodes, je fais de l\'exercice pour les chasser ',
    'J\'utilise correctement toutes  mes ressources. J\'active mon esprit pour des activités importantes; j\'échauffe mon corps pour les défis; je me garde bien du dosage excessif et du manque d\'exercice',
    'Je suis une personne d\'idées. J\'ai beaucoup d\'idées formidables parce que je sais exactement ce que je veux, et j\'emmagasine sans cesse des données dans mon subconscient de façon à lui permettre de produire ces idées',
    'Je ne travaille pas. On me donne beaucoup d\'argent parce que je suis merveilleux dans ce que j\'aime faire',
    'J\'arrive toujours là où je veux aller parce que je planifie mes heures, mes journées, mes mois, mes années et ma vie entière',
    'Mon plan de vie n\'est jamais terminé, parce que je trouve toujours de nouvelles façons d\'améliorer ma vie et de nouvelles choses à apprendre et à apprécier',
    'J\'ai toujours un sommeil efficace et sain, et j\'obtiens tout le sommeil dont j\'ai besoin en seulement ___ heures. Puis, je me réveille en pleine forme, je saute hors du lit et je commence à accomplir de bonnes choses en employant chaque minutes de la journée de façon productive',
    'J\'accepte les cartes que la vie me distribue, puis je joue et je gagne les plus grosses cagnottes possible. Les choses que je ne peux pas contrôler ne me font jamais baisser les bras parce que je pense toujours aux grandes choses que j\'accomplis aujourd\'hui et aux plus grandes choses que j\'accomplirai demain',
    'Je recherche le succès pour .... (inscrivez la raison)',
    'Je me respecte parce que je suis efficace et que je persévère contre les rejets et les obstacles stoppant les gens de moindre ténacité',
    'Je me prépare consciencieusement pour toute activité importante',
    'J\'ai un haut degré d\'intégrité personnelle qui me conduit à fournir un effort supplémentaire',
    'Je suis un gagnant',
    'Je trouve mes meilleures solutions pendant mon sommeil. J\'y arrive en définissant mes problèmes par écrit et en laissant mon subconscient faire le reste. Cela marche toujours parce que j\'ai la patience de me détendre et de laisser faire et que je suis confiant',
    'J\'aime le succès. Je travaille sensément et durement pour ce que j\'obtiens, donc je l\'ai largement mérité',
    'Personne ne me fait sentir coupable d\'avoir réussi. Si quelqu\'un ne peut pas supporter ma réussite, tant pis pour lui. Je trouverai de nouveaux amis qui le pourront',
    'J\'ai suffisamment d\'argent de réserve pour défendre mon point de vue lors de rudes négociations et ne pas fléchir sur les décisions importantes',
    'Je dispose d\'un soutien formidable pour ma confiance et mes performances parce que je ne dépense jamais un sou qui ne sois pas absolument vital, tant qu\'il n\'y a pas ____ sur mon compte épargne',
    'Je gagne très souvent parce que je me prépare considérablement en vue de mes défis',
    'Je m\'occupe des affaires d\'aujourd\'hui, mais pas au point d\'oublier celles de demain. Je suis un planificateur. Je vois loin. Je mesure toujours mes performances et j\'élimine les pertes de temps inutiles. Et je dépense toujours moins que je ne gagne. Quand viennent les lendemains, je suis prêt pour eux.',
    'Je comprends que la vie se réduit à la façon dont j\'emploie mes secondes',
    'Je ne gaspille pas mon temps, je l\'investis soignemeusement eet intelligemment',
    'Je suis toujours à l\'affût de meilleurs façons d\'investir mon temps',
    'j\'érige de solides remparts contre les gens qui perdent leur temps',
    'Je prend le temps de prévoir et d\'anticiper',
    'J\'ai bonne conscience parce que je profite toujours le mieux possible du temps qui passe',
    'Je planifie mon temps pour enrichir la qualité de ma vie personnelle',
    'je suis autodiscipliné, je ne laisse jamais la télévision contrôler ma vie',
    'Je fais les choses correctement la première fois',
    'Je suis organisé parce que je planifie mes journées et que je suis mes plans',
    'Je suis responsable de qui je suis',
    'Je suis intransigeant en ce qui concerne mon temps fonctionnel. Personne ne le grignote. Et je ne gaspille pas mon propre temps fonctionnel en effectuant des tâches sans intérêt ou en m\'adonnant à des activités inutiles',
    'Pendant mes temps de détente, je me défoule vraiment et je me détends.\r\nQuand je ne travail pas, je ne travail pas',
    'Je fais régulièrement de l\'exercice (mentionnez votre programme exacte) et je me sens en pleine forme',
    'J\'adore faire de l\'exercice. Beaucoup de gens pensent que c\'est ennuyeux. Je plains ces gens parce qu\'ils ne savent pas ce qu\'ils perdent',
    'Je prend ma séance d\'exercice car cela me permet de me détendre et de me débarrasser des tensions de la journée',
    'J\'ai des objectifs précis en termes d\'exercice. Je fais de l\'exercice pour me donner de l\'énergie, améliorer ma santé, m\'aider à mieux dormir et prolonger ma vie. Je n \'ai pas l\'intention de m\'entêter ou de me démolir. Alors, j\'accélère le rythme quand je le peux, mais je reste toujours à l\'écoute de mon corps.',
    'Je mange et je bois toujours avec modération',
    'Je m\'applique à accroître mon énergie physique avec régularité et bon sens',
    'Je prend grand soin de mon corps',
    'Je ne laisse jamais une pensée négative entrer dans mon esprit',
    'J\'ai toujours des objectifs clairement définis',
    'Je travaille dur pour éxecuter et accomplir, et non pas seulement pour gagner de l\'argent',
    'J\'ai une excellente mémoire des noms. Je retiens le nom d\'une personne dès le début. Je le répète plusieurs fois durant ma première conversation avec elle, et je prends des notes que je relis de temps en temps pour intensifier mon souvenir de cette personne',
    'Je suis très bon en math parce que j\'aime les maths, j\'en fais et j\'en sais beaucoup à ce sujet',
    'Je suis bon en orthographe parce que je sais combien c\'est important d\'écrire correctement pour réussir',
    'Je suis extrêmement bon en (tout ce que vous vulez bien faire) parce que j\'ai fait l\'effort d\'être bon dans ce domaine',
    'Je travaille dur, j\'ai donc mérité le droit de rire de moi-même et du monde. Mes activités sont très importantes pour moi. Elles sont en effet si importantes qu\'il ne me viendrait même pas à l\'idée d\'entraver ma capacité de les faires progresser en supprimant les vertus curatives de l\'humour',
    'Je vois toujours le bon côté des choses - je suis comme ça.',
    'Je sais que le rire vient immédiatement après le sommeil et la nourriture en tant que reconstituant, alors je suis toujours à la recherche d\'une occasion de me dilater un peu la rate',
    'J\'ai un grand sens de l\'humour et il se renforce de jour en jour. J\'aime bien cela, quand on rit de moi',
    'Je prends toujours le temps de sentir le parfum des roses, d\'apprécier la beauté d\'un coucher de soleil et de voir le côté amusant de la vie',
    'Je choisi toujours le bon moment parce que j\'y suis très attentif',
    'Je considère chaque problème comme une bonne occasion d\'utiliser mon talent et mon esprit d\'initiative',
    'Je vois une occasion favorable dans chaque défi',
    'J\'agis très rapidement quand il faut agir vite. Mais, je suis aussi capable de calmement ne rien faire quand c\'est la meilleure solution',
    'Je deviens toujours très occupé quand j\'ai des problèmes et je travaille pour m\'en débarrasser',
    'Je ne me laisse jamais aller pour chasser le stress parce que je sais que cela ne fait qu\'empirer les choses le lendemain',
    'J\'adore agir; j\'adore faire des choses; J\'adore accomplir. Et je fait toujours ces 3 choses avec constance, gaieté et succès',
    'J\'ai de la chance. Il m\'arrive toujours de bonnes choses',
    'Je n\'ai jamais d\'accidents parce que je suis vigilant, je me protège intelligemment et je prévois',
    'Ma nature est ce que je veux qu\'elle soit',
    'Le succès vaut bien plus que son prix. Dans ce monde, je suis un conducteur, non un passager. Je suis un meneur et un faiseur. J\'adore agir et foncer. Parce que je suis un meneur, mes connaissances, mon influence mon pouvoir et ma richesse s\'accroissent rapidement',
    'Je sais où je vais parce que j\'ai pris le temps et la peine de prendre cette décision',
    'Je me maintiens en super forme',
    '(choisissez quelque chose) ne me gêne pas du tout',
    'Je ne fais pas des choses stupides telles que laisser des drogues contrôler mon esprit',
    'Je n\'ai pas peur d\'échouer parce que c\'est comme cela que j\'apprends',
    'Quand j\'échoue, je regarde ce que j\'ai bien fait et non pas ce que j\'ai mal fait',
    'Je respecte et j\'écoute les opinions d\'autrui, mais j\'ai foi en mes propres opinions et je prend moi-même mes décisions',
    'Je suis riche. Je suis riche parce que je pense à la valeur qu\'a l\'argent en tant qu\'investissement de toute une vie quand je suis tenté de sortir des limites de mon budget',
    '( à remplir ) % de mon revenu me suffit pour vivre',
    'Je prend la fication d\'objectifs au sérieux',
    'Je suis absolument persuadé que je vais atteindre tous mes objectifs',
    'Je désire ardemment mes objectifs parce qu\'ils sont si excitants. Je les garde toujours à l\'esprit',
    'Je m\'imagine intensément trois fois par jour comme si j\'avais atteint tous mes objectifs',
    'Je comprends que je suis vraiment mon propre employé, même si je travaille chez  (à remplir)',
    'Je n\'oublie jamais qu\'accumuler du capital en vue d\'investissements constitue la clef ouvrant la porte du succès',
    'J\'ai une grande autodiscipline, alors j\'atteins toujours mon objectif d\'économiser (à remplir) pour 100 de mon revenu pour des investissements (Dix pour cent est le pourcentage minimal)',
    'Je suis prêt à franchir la prochaine étape de mon ascension',
    'Je vie dans le présent',
    'Je recherche toujours ce qu\'il y a de bon chez les gens qui me sont proches',
    'Sans négliger mes propres intérêts, je recherche ce qu\'il y a de bon en chacun',
    'Je me sers d\'habitudes pour accélérer la routine, et non pas pour éluder la réalité',
    'Je contrôle mes pensées',
    'Je ne laisse pas d\'idées négatives entrer dans mon esprit',
    'Je contrôle mon esprit, mon corps et mes actions',
    'Je contrôle les événements en (à remplir)',
    'Je sais que le succès dépend de la façon dont j\'utilise mon temps, alors je l\'utilise toujours extrêmement bien',
    'Je suis autodiscipliné. Quand je prends des engagements vis-à-vis de moi-même ou d\'autrui, je les tiens',
    'Je suis fier de mes performances, fier de ma volonté de faire ce que je sais devoir fait, fier d\'être un fonceur, un gagnant et un faiseur',
    'Je revois mes auto-instructions tous les matins et tous les soirs, et au moins une fois durant la journée. Je passe quelques secondes sur chaque auto-instruction pour en ressentir intensément les émotions',
    'Quand je ressens mes auto-instructions, je regarde de mes propres yeux la personne que je deviens. Je regarde le monde non pas dans la peau de la personne que je veux être. Je me sens faire les choses que je veux faire, et pendant ces instants vitaux je suis qui je veux être',
    'Toutes les semaines, je passe une demi-heure à ajouter de nouvelles auto-instruction, à en réviser d\'anciennes et à intensifier mon engagement émotionnel à leur égard',
    'Je fais tout cela parce que je suis le type de personne efficaces, énergique et couronné de succès qui réagit bien aux auto-instructions positives'
]

async function seedAutoInstructionSuggestions() {
    for (const affirmation of affirmations) {
	  await prisma.autoInstructionSuggestion.create({
		data: {
		    description: affirmation
		}
	  })
    }
}

async function main() {
    console.log('Start seeding...')
    await seedAutoInstructionSuggestions()
    console.log('Seeding finished.')
}

main()
	.then(async () => {
	    await prisma.$disconnect()
	})
	.catch(async (e) => {
	    console.error(e)
	    await prisma.$disconnect()
	    process.exit(1)
	})