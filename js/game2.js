/**
 * GAME 2: COMPLETA EL VERSÍCULO
 */

const Game2 = {
  verses: [],
  session: null,
  currentVerse: null,
  currentVerseParsed: null,
  usedVerseIds: [],

  init() {
    // LIMPIAR TODO para comenzar fresco
    Storage.clearGame2Data();
    
    this.verses = Storage.getGame2Verses();
    
    // VALIDACIÓN: Si hay menos de 100 versículos, reiniciar TODO
    if (this.verses.length < 100) {
      console.warn('⚠️ Datos corruptos: solo ' + this.verses.length + ' versículos. Reiniciando...');
      this.verses = [];
      Storage.clearGame2Data();
    }
    
    // Intentar cargar usedVerseIds del storage
    const savedUsedIds = Storage.getGame2UsedVerses();
    this.usedVerseIds = savedUsedIds && savedUsedIds.length > 0 ? savedUsedIds : [];
    
    if (this.verses.length === 0) {
      this.verses = [
        // IDs FIJOS para que persistan entre sesiones
        { id: 'v001', citation: 'Éxodo 14:14', fullText: 'El Señor peleará por vosotros. Estad [tranquilos]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v002', citation: 'Éxodo 33:14', fullText: 'El Eterno respondió: Mi presencia irá contigo, y te haré [descansar]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v003', citation: 'Deuteronomio 8:2', fullText: 'Acuérdate de todo el [camino] por donde te ha traído el Señor tu Dios, estos 40 años en el desierto, para humillarte, para probarte y saber lo que estaba en tu [corazón]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v004', citation: 'Deuteronomio 33:27', fullText: 'El eterno Dios es tu [refugio], y aquí abajo están los brazos eternos, él echará delante de ti al [enemigo]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v005', citation: '1 Samuel 12:24', fullText: 'Tan sólo reverenciad al Señor y servidle de [verdad], con todo vuestro corazón, considerando cuán grandes cosas ha [realizado] por vosotros', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v006', citation: '1 Samuel 14:6', fullText: 'Jonatán dijo a su escudero: Ven, pasemos a la guarnición de estos [incircuncisos], quizá el Eterno obre algo por nosotros. Porque para el Señor no es difícil [salvar] con muchos o con pocos', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v007', citation: '2 Samuel 22:29', fullText: 'Tú eres mi [lámpara], oh Eterno. El Señor [convierte] mis tinieblas en [luz]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v008', citation: '1 Reyes 8:61', fullText: 'Sea, pues, vuestro corazón plenamente [leal] al Eterno nuestro Dios, para andar en sus estatutos y guardar sus [Mandamientos]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v009', citation: '2 Reyes 6:16', fullText: 'Eliseo respondió: No temas. Porque más están con nosotros que con [ellos]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v010', citation: '1 Crónicas 16:11', fullText: 'Buscad al Señor y su [fortaleza], buscad su [rostro] [continuamente]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v011', citation: 'Salmos 4:8', fullText: 'Me acuesto y duermo en [paz], porque sólo tú, oh Eterno, me haces vivir [confiado]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v012', citation: '2 Crónicas 15:7', fullText: 'Pero [esforzaos] vosotros, y no desfallezcan vuestras manos, porque vuestra obra tendrá su [recompensa]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v013', citation: '2 Crónicas 16:9', fullText: 'Porque los ojos del Eterno [contemplan] toda la tierra, para fortalecer a los que tienen corazón [íntegro] hacia él', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v014', citation: 'Esdras 7:10', fullText: 'Porque Esdras había aplicado su corazón a [inquirir] la Ley del Eterno, a [cumplirla], y a enseñar a Israel sus estatutos y normas', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v015', citation: 'Nehemías 9:17', fullText: 'No quisieron oír, ni se acordaron de las maravillas que habías hecho en su favor. Pero tú eres un Dios [perdonador], [clemente] y [piadoso], tardo para la ira, y grande en [amor], que no los [abandonaste]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v016', citation: 'Job 12:13', fullText: 'Con Dios está la [sabiduría] y el [poder], suyo es el [consejo] y la [inteligencia]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v017', citation: 'Job 23:10', fullText: 'Pero él [conoce] mi camino. Me [probará], y saldré como [oro]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v018', citation: 'Job 35:10', fullText: 'Y ninguno dice: ¿Dónde está Dios, mi [Hacedor], que inspira las canciones de loor en la [noche]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v019', citation: 'Salmos 16:8', fullText: 'Al Eterno he puesto siempre ante mí; porque está a mi [diestra], no seré [conmovido]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v020', citation: 'Salmos 25:14', fullText: 'El Eterno da su [secreto] a quienes lo veneran, y a ellos da a conocer su [pacto]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v021', citation: 'Salmos 31:19', fullText: '¡Cuán grande es tu [bondad], que has guardado para los que te honran, que concedes a los que se refugian en ti, ante los [hombres]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v022', citation: 'Salmos 36:9', fullText: 'Porque de ti brota el [manantial] de la vida, y en tu [luz] vemos la [luz]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v023', citation: 'Salmos 62:8', fullText: 'Esperad en él en todo tiempo, oh pueblos, derramad ante él vuestro [corazón]. Dios es nuestro [refugio]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v024', citation: 'Salmos 73:26', fullText: 'Mi carne y mi corazón [desfallecen], pero la roca de mi corazón y mi [porción] es Dios para [siempre]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v025', citation: 'Salmos 85:10', fullText: 'El [amor] y la [fidelidad] se encontraron, la [justicia] y la [paz] se besaron', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v026', citation: 'Salmos 92:14', fullText: 'Aun en la vejez [fructificará], estará [vigoroso] y [lozano]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v027', citation: 'Salmos 94:19', fullText: 'Cuando aumentan mis [inquietudes], tu [consuelo] alegra mi [espíritu]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v028', citation: 'Salmos 112:7', fullText: 'No temerá las malas [noticias], su corazón está [firme], [confiado] en el Eterno', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v029', citation: 'Salmos 119:165', fullText: 'Mucha [paz] gozan los que aman tu [Ley], y no hay para ellos [tropiezo]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v030', citation: 'Salmos 138:3', fullText: 'El día que [clamé], me [respondiste], y me [fortaleciste]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v031', citation: 'Proverbios 11:25', fullText: 'El [generoso] será [prosperado], y el que sacia a otros, él también será [saciado]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v032', citation: 'Proverbios 15:23', fullText: 'El hombre se alegra al dar la [respuesta] adecuada, y la palabra a su [tiempo], ¡cuán buena es!', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v033', citation: 'Proverbios 16:32', fullText: 'Mejor es el que [tarde] se aira que el fuerte; mejor el que [domina] su espíritu, que el que toma una [ciudad]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v034', citation: 'Proverbios 20:5', fullText: 'Aguas [profundas] son los propósitos del corazón del hombre, pero el [entendido] los [alcanzará]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v035', citation: 'Eclesiastés 7:8', fullText: 'Mejor es el [fin] de un asunto que su [principio]. Mejor es el [sufrido] que el [altivo]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v036', citation: 'Isaías 26:12', fullText: 'Oh Eterno, tú nos darás [paz], porque también llevas a cabo en nosotros todas nuestras [obras]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v037', citation: 'Isaías 30:15', fullText: 'Así dice el Señor, el Eterno, el Santo de Israel: En [convertiros] y en descanso está vuestra salvación, en quietud y en [confianza] está vuestra fortaleza', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v038', citation: 'Isaías 32:17', fullText: 'Y el resultado de la [justicia] será [paz]; y el efecto de la [rectitud], reposo y [seguridad] para siempre', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v039', citation: 'Isaías 46:4', fullText: 'Hasta vuestra vejez yo seré el [mismo], hasta las canas os [sostendré]. Yo os hice, yo os [llevaré], yo os [sustentaré], y os [cuidaré]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v040', citation: 'Isaías 58:11', fullText: 'El Eterno te [guiará] siempre, en las sequías te [saciará], y fortalecerá tus [huesos]. Serás como huerta bien [regada], como manantial [inagotable]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v041', citation: 'Jeremías 17:7', fullText: 'Bendito el que [confía] en el Eterno, y pone su [esperanza] en él', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v042', citation: 'Lamentaciones 3:26', fullText: 'Bueno es esperar en [silencio] en la [salvación] del Eterno', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v043', citation: 'Oseas 6:3', fullText: 'Conozcamos al Eterno, [insistamos] en [conocerlo]. Su venida es tan [segura] como el alba', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v044', citation: 'Oseas 10:12', fullText: 'Sembrad para vosotros en [justicia], segad [cosecha] de [amor]. Arad vuestra tierra sin labrar, porque es [tiempo] de buscar al Eterno', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v045', citation: 'Joel 2:13', fullText: 'Rasgad vuestro [corazón], y no vuestro vestido. Volved al Eterno vuestro Dios; porque es [bondadoso] y [clemente], lento para la ira, grande en [amor]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v046', citation: 'Miqueas 7:7', fullText: 'Pero yo al Eterno [miraré], [esperaré] al Dios de mi [salvación]], mi Dios me [oirá]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v047', citation: 'Salmos 121:2', fullText: 'Mi [socorro] viene del Eterno, que hizo el [cielo] y la [tierra]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v048', citation: 'Habacuc 3:18', fullText: 'con todo, yo me [alegraré] en el eterno, y me [gozaré] en el Dios de mi [salvación]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v049', citation: 'Sofonías 3:17', fullText: 'El Eterno está en medio de ti, [poderoso], él [salvará]. Se gozará sobre ti con [alegría]], te [pacificará]] con su [amor]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v050', citation: 'Zacarías 4:6', fullText: 'Entonces respondió: Esta es la Palabra del Señor a Zorobabel, que dice: No con [ejército]], ni con [fuerza]], sino con mi [Espíritu]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v051', citation: 'Éxodo 20:8', fullText: 'Acuérdate del día [sábado]] para [santificarlo]]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v052', citation: 'Deuteronomio 6:5', fullText: 'Amarás al Señor tu Dios con todo tu [corazón]], con toda tu [alma]] y con todo tu [poder]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v053', citation: 'Josué 1:9', fullText: 'Mira que te mando que te [esfuerces]] y seas [valiente]]. No temas ni [desmayes]], porque el Eterno tu Dios estará contigo donde quiera que vayas', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v054', citation: 'Salmos 23:1', fullText: 'El Eterno es mi [pastor]], nada me [faltará]]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v055', citation: 'Salmos 46:1', fullText: 'Dios es nuestro [amparo]] y [fortaleza]], nuestro [pronto]] auxilio en las [tribulaciones]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v056', citation: 'Salmos 119:105', fullText: 'Lámpara es para mis pies tu [Palabra]], una [luz]] en mi [camino]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v057', citation: 'Proverbios 3:5', fullText: 'Fíate del Eterno de todo tu [corazón]], y no te apoyes en tu [prudencia]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v058', citation: 'Proverbios 3:6', fullText: 'Reconócelo en todos tus [caminos]], y él [enderezará]] tus [veredas]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v059', citation: 'Proverbios 22:6', fullText: 'Instruye al [niño]] en su [camino]], Y aun cuando fuere viejo no se [apartará]] de él', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v060', citation: 'Eclesiastés 12:13', fullText: 'El fin de todo el [discurso]], es éste: [Venera]] a Dios y guarda sus [Mandamientos]], porque éste es todo el [deber]] del hombre', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v061', citation: 'Isaías 40:31', fullText: 'Pero los que [esperan]] al Eterno tendrán [nuevas]] fuerzas, [levantarán]] el vuelo como [águilas]]; correrán, y no se cansarán', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v062', citation: 'Isaías 41:10', fullText: 'No temas, que yo estoy contigo. No [desmayes]], que Yo Soy tu [Dios]] que te [fortalezco]]. Siempre te [ayudaré]], siempre te [sustentaré]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v063', citation: 'Isaías 53:5', fullText: 'Pero él fue [herido]] por nuestras rebeliones, [molido]] por nuestros pecados, el [castigo]] de nuestra paz fue sobre él, y por su llaga fuimos [curados]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v064', citation: 'Jeremías 29:11', fullText: 'Yo sé los [pensamientos]] que tengo acerca de vosotros —dice el Eterno —, [pensamientos]] de [paz]] y no de [mal]], para daros el [fin]] que esperáis', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v065', citation: 'Jeremías 33:3', fullText: 'Clama a mí, y te [responderé]], y te [enseñaré]] cosas [grandes]] y [ocultas]], que tú no sabes', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v066', citation: 'Mateo 5:14', fullText: 'Vosotros sois la [luz]] del mundo. Una ciudad situada sobre un [monte]] no se puede [esconder]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v067', citation: 'Mateo 6:33', fullText: 'Buscad primero el [reino]] de Dios y su [justicia]], y todas estas cosas os serán [añadidas]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v068', citation: 'Mateo 7:7', fullText: 'Pedid, y os [darán]]; buscad, y [hallaréis]]; llamad, y os [abrirán]]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v069', citation: 'Mateo 11:28', fullText: 'Venid a mí todos los que estáis [fatigados]] y [cargados]], y yo os haré [descansar]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v070', citation: 'Mateo 24:14', fullText: 'Y este [evangelio]] del [reino]] será [predicado]] en todo el mundo, por [testimonio]] a todas las [naciones]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v071', citation: 'Mateo 28:19', fullText: 'Por tanto, id y haced [discípulos]] en todas las [naciones]], [bautizándolos]] en el Nombre del Padre, del Hijo y del Espíritu Santo', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v072', citation: 'Lucas 19:10', fullText: 'Porque el Hijo del Hombre vino a [buscar]] y a [salvar]] lo que se había [perdido]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v073', citation: 'Juan 1:1', fullText: 'En el [principio]] ya existía el [Verbo]], y el [Verbo]] estaba con Dios, y el [Verbo]] era [Dios]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v074', citation: 'Juan 3:16', fullText: 'Porque tanto amó Dios al mundo, que dio a su [Hijo]] único, para que todo el que [crea]] en él, no [perezca]], sino tenga [vida]] eterna', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v075', citation: 'Juan 8:32', fullText: 'Y [conoceréis]] la [verdad]], y la [verdad]] os [libertará]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v076', citation: 'Juan 11:25', fullText: 'Jesús respondió: Yo Soy la [resurrección]] y la [vida]]. El que cree en mí, aunque muera, [vivirá]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v077', citation: 'Juan 14:6', fullText: 'Jesús respondió: Yo Soy el [camino]], la [verdad]] y la [vida]]. Nadie viene al Padre, sino por [mí]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v078', citation: 'Juan 14:15', fullText: 'Si me [amáis]], [guardaréis]] mis [Mandamientos]]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v079', citation: 'Juan 14:27', fullText: 'La [paz]] os dejo, mi [paz]] os doy. Os la doy, no como el mundo la da. No se [turbe]] vuestro corazón, ni tenga [miedo]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v080', citation: 'Hechos 1:8', fullText: 'Pero [recibiréis]] el [poder]], cuando venga sobre vosotros el Espíritu Santo, y me seréis [testigos]] en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v081', citation: 'Hechos 4:12', fullText: 'En ningún otro hay [salvación]], porque no hay otro Nombre bajo el cielo, dado a los hombres, en que podamos ser [salvos]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v082', citation: 'Romanos 3:23', fullText: 'por cuanto todos [pecaron]], y están [destituidos]] de la [gloria]] de Dios', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v083', citation: 'Romanos 6:23', fullText: 'Porque la [paga]] del pecado es la [muerte]]. Pero el don gratuito de Dios es la [vida]] eterna en Cristo Jesús Señor nuestro', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v084', citation: 'Romanos 8:28', fullText: 'Sabemos que todas las cosas [obran]] para el [bien]] de los que aman a Dios, de los que han sido [llamados]] según su [propósito]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v085', citation: 'Romanos 12:2', fullText: 'Y no os [conforméis]] a este mundo, sino [transformaos]] mediante la [renovación]] de vuestra mente, para que podáis comprobar cuál es la [buena]] voluntad de Dios', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v086', citation: '1 Corintios 6:19', fullText: '¿No sabéis que vuestro [cuerpo]] es [templo]] del Espíritu Santo, que está en vosotros, que tenéis de Dios, Y que no sois [vuestros]]?', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v087', citation: '1 Corintios 10:13', fullText: 'No os ha venido ninguna [tentación]], sino humana. Pero Dios es fiel, y no os dejará ser tentados más de lo que podáis resistir. Antes, junto con la tentación os dará también la [salida]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v088', citation: '1 Corintios 13:13', fullText: 'Ahora permanecen estas tres [virtudes]]: la [fe]], la [esperanza]] y el [amor]]. Pero la mayor es el [amor]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v089', citation: '2 Corintios 5:17', fullText: 'Por lo tanto, si alguno está en Cristo, es una [nueva]] creación. Las cosas viejas [pasaron]], todo es [nuevo]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v090', citation: 'Gálatas 5:22', fullText: 'Pero el fruto del Espíritu es: [amor]], [gozo]], [paz]], [paciencia]], [benignidad]], [bondad]], [fidelidad]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v091', citation: 'Efesios 2:8', fullText: 'Porque por [gracia]] habéis sido [salvados]] por la [fe]]. Y esto no proviene de vosotros, sino que es el don de [Dios]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v092', citation: 'Filipenses 4:13', fullText: 'Todo lo puedo en Cristo que me [fortalece]]', difficulty: 'kids', pointsPerWord: 1, example: true },
        { id: 'v093', citation: 'Filipenses 4:19', fullText: 'Mi Dios, pues, [suplirá]] toda [necesidad]] vuestra, conforme a su [gloriosa]] riqueza en Cristo Jesús', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v094', citation: '2 Timoteo 3:16', fullText: 'Toda [Escritura]] es [inspirada]] por Dios, y es [útil]] para enseñar, [reprender]], [enmendar]] e [instruir]] en justicia', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v095', citation: 'Hebreos 11:1', fullText: 'La fe es estar [seguros]] de lo que esperamos, y [ciertos]] de lo que no [vemos]]', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v096', citation: '1 Pedro 5:7', fullText: 'Echad toda vuestra [ansiedad]] sobre él, porque él [cuida]] de vosotros', difficulty: 'youth', pointsPerWord: 1, example: true },
        { id: 'v097', citation: '1 Juan 1:9', fullText: 'Si [confesamos]] nuestros pecados, Dios es fiel y justo para [perdonar]] nuestros pecados, y [limpiarnos]] de todo [mal]]', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v098', citation: 'Apocalipsis 3:20', fullText: 'Yo estoy a la [puerta]] y [llamo]]. Si alguno oye mi voz y [abre]] la puerta, entraré a su [casa]], y cenaré con él, y él conmigo', difficulty: 'adults', pointsPerWord: 1, example: true },
        { id: 'v099', citation: 'Apocalipsis 21:4', fullText: 'Y Dios [enjugará]] toda lágrima de los ojos de ellos. Y no habrá más [muerte]], ni [llanto]], ni [clamor]], ni [dolor]], porque las primeras cosas [pasaron]]', difficulty: 'expert', pointsPerWord: 1, example: true },
        { id: 'v100', citation: 'Juan 3:16 - Completo', fullText: 'Porque de tal manera [amó]] Dios al mundo, que ha dado a su Hijo [unigénito]], para que todo aquel que en él [crea]], no se [pierda]], mas tenga [vida]] eterna', difficulty: 'youth', pointsPerWord: 1, example: true }
      ];
      Storage.setGame2Verses(this.verses);
      console.log('✅ 100 versículos cargados exitosamente (v001-v100)');
      console.log('📊 Total:', this.verses.length, 'versículos en la base de datos');
    } else {
      console.log('✅ Versículos cargados de storage:', this.verses.length, 'versículos');
    }

    this.session = {
      leftTeamPoints: 0,
      rightTeamPoints: 0,
      completedVerses: [],
      pointsPerWord: 1
    };
    Storage.setGame2Session(this.session);
  },

  createVerse(data) {
    if (!data.citation || !data.fullText) {
      return 'Faltan datos requeridos';
    }

    const hiddenWords = Utils.extractBracketedWords(data.fullText);
    if (hiddenWords.length < 2) {
      return 'Se requieren al menos 2 palabras ocultas (entre corchetes)';
    }

    const verse = {
      id: Utils.generateId(),
      citation: data.citation,
      fullText: data.fullText,
      difficulty: data.difficulty || 'youth',
      pointsPerWord: data.pointsPerWord || 1,
      example: false
    };

    this.verses.push(verse);
    Storage.setGame2Verses(this.verses);
    return null;
  },

  generateAutoHiddenWords(text, level) {
    const hidden = Utils.generateHiddenWords(text, level);
    const result = text;

    let modified = result;
    hidden.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      modified = modified.replace(regex, `[${word}]`);
    });

    return modified;
  },

  getVerses() {
    return this.verses;
  },

  getRandomVerse() {
    // VALIDACIÓN: Asegurar que tenemos 100 versículos
    if (this.verses.length < 100) {
      console.error('❌ ERROR: Solo hay ' + this.verses.length + ' versículos. Se esperaban 100.');
      console.log('Reiniciando sistema...');
      this.init();
    }
    
    const availableVerses = this.verses.filter(v => !this.usedVerseIds.includes(v.id));
    
    // Si todos están usados, reiniciar
    if (availableVerses.length === 0) {
      console.log('🔄 Todos los 100 versículos usados. Reiniciando...');
      this.usedVerseIds = [];
      Storage.setGame2UsedVerses([]);
      return this.verses[Math.floor(Math.random() * this.verses.length)];
    }
    
    const randomVerse = availableVerses[Math.floor(Math.random() * availableVerses.length)];
    console.log('📖 Versículo disponible: ' + randomVerse.citation + ' (ID: ' + randomVerse.id + ')');
    console.log('📊 Usados: ' + this.usedVerseIds.length + '/100');
    return randomVerse;
  },

  loadVerseById(verseId) {
    const verse = this.verses.find(v => v.id === verseId);
    if (!verse) return null;

    if (!this.usedVerseIds.includes(verse.id)) {
      this.usedVerseIds.push(verse.id);
      Storage.setGame2UsedVerses(this.usedVerseIds);
    }

    this.currentVerse = { ...verse };
    const hiddenWords = Utils.extractBracketedWords(verse.fullText);

    const blanks = hiddenWords.map((word, idx) => ({
      index: idx,
      word: word,
      revealed: false,
      guessedBy: null
    }));

    this.currentVerseParsed = {
      id: verse.id,
      citation: verse.citation,
      fullText: verse.fullText,
      difficulty: verse.difficulty,
      blanks: blanks,
      currentBlankIndex: 0
    };

    return this.currentVerseParsed;
  },

  loadRandomVerse() {
    const verse = this.getRandomVerse();
    if (!verse) {
      console.error('❌ ERROR: No hay versículo disponible');
      return null;
    }

    // IMPORTANTE: Marcar como usado ANTES de cargar
    if (!this.usedVerseIds.includes(verse.id)) {
      this.usedVerseIds.push(verse.id);
      Storage.setGame2UsedVerses(this.usedVerseIds);
      console.log('✅ Marcado como usado: ' + verse.id);
    }

    this.currentVerse = { ...verse };
    const hiddenWords = Utils.extractBracketedWords(verse.fullText);

    const blanks = hiddenWords.map((word, idx) => ({
      index: idx,
      word: word,
      revealed: false,
      guessedBy: null
    }));

    this.currentVerseParsed = {
      id: verse.id,
      citation: verse.citation,
      fullText: verse.fullText,
      difficulty: verse.difficulty,
      blanks: blanks,
      currentBlankIndex: 0
    };

    console.log('📋 Versículo cargado: ' + verse.citation + ' (' + verse.id + ')');
    return this.currentVerseParsed;
  },

  revealWord(teamSide) {
    if (!this.currentVerseParsed) return 'No hay versículo cargado';

    const blank = this.currentVerseParsed.blanks[this.currentVerseParsed.currentBlankIndex];
    
    if (!blank) return 'No hay más espacios';
    if (blank.revealed) return 'Este espacio ya fue revelado';

    blank.revealed = true;
    
    if (teamSide) {
      blank.guessedBy = teamSide;
      const points = this.currentVerse.pointsPerWord;
      
      if (teamSide === 'left') {
        this.session.leftTeamPoints += points;
      } else {
        this.session.rightTeamPoints += points;
      }
      
      AudioSystem.playSuccess();
    } else {
      AudioSystem.playError();
    }

    Storage.setGame2Session(this.session);
    return null;
  },

  nextBlank() {
    if (!this.currentVerseParsed) return;
    
    const totalBlanks = this.currentVerseParsed.blanks.length;
    if (this.currentVerseParsed.currentBlankIndex < totalBlanks - 1) {
      this.currentVerseParsed.currentBlankIndex++;
      return false;
    }
    return true;
  },

  prevBlank() {
    if (this.currentVerseParsed.currentBlankIndex > 0) {
      this.currentVerseParsed.currentBlankIndex--;
    }
  },

  goToBlank(index) {
    if (index >= 0 && index < this.currentVerseParsed.blanks.length) {
      this.currentVerseParsed.currentBlankIndex = index;
    }
  },

  endGame() {
    const result = {
      winner: null,
      leftPoints: this.session.leftTeamPoints,
      rightPoints: this.session.rightTeamPoints
    };

    if (this.session.leftTeamPoints > this.session.rightTeamPoints) {
      result.winner = 'left';
    } else if (this.session.rightTeamPoints > this.session.leftTeamPoints) {
      result.winner = 'right';
    } else {
      result.winner = 'tie';
    }

    return result;
  },

  restart() {
    this.session = {
      leftTeamPoints: 0,
      rightTeamPoints: 0,
      completedVerses: [],
      pointsPerWord: 1
    };
    this.usedVerseIds = [];
    Storage.setGame2UsedVerses([]);
    Storage.setGame2Session(this.session);
    this.currentVerse = null;
    this.currentVerseParsed = null;
  },

  adjustPoints(teamSide, amount) {
    if (teamSide === 'left') {
      this.session.leftTeamPoints = Math.max(0, this.session.leftTeamPoints + amount);
    } else {
      this.session.rightTeamPoints = Math.max(0, this.session.rightTeamPoints + amount);
    }
    Storage.setGame2Session(this.session);
  },

  deleteVerse(verseId) {
    this.verses = this.verses.filter(v => v.id !== verseId && !v.example);
    Storage.setGame2Verses(this.verses);
  }
};

Game2.init();

