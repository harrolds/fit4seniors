import type { PhysicalExercise } from '../../domain/fit4seniors/exercises';

// Erste Version des Übungskatalogs für Fit4Seniors (Deutsch)
// Hinweis: Die Bildpfade sind Platzhalter und können später an echte Assets angepasst werden.

export const PHYSICAL_EXERCISES_DE: PhysicalExercise[] = [
  // Balance (B1–B6)
  {
    id: 'B1',
    title: 'Seitenbalance mit Stuhl',
    category: 'balance',
    level: 1,
    position: 'standing',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/b1_seitenbalance.png',
      alt: 'Senior steht seitlich am Stuhl und hebt ein Bein leicht an',
    },
    steps: [
      'Stellen Sie sich seitlich neben einen stabilen Stuhl und halten Sie sich mit einer Hand fest.',
      'Heben Sie das äußere Bein leicht vom Boden ab.',
      'Halten Sie die Position ruhig, atmen Sie gleichmäßig.',
      'Stellen Sie den Fuß wieder ab und wechseln Sie das Bein.',
    ],
    safetyNote:
      'Nur so hoch heben, wie es angenehm ist. Bei Unsicherheit immer am Stuhl festhalten.',
    tags: ['beine', 'balance', 'stuhl'],
  },
  {
    id: 'B2',
    title: 'Tandemstand',
    category: 'balance',
    level: 1,
    position: 'standing',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/b2_tandemstand.png',
      alt: 'Senior steht mit einem Fuß direkt vor dem anderen',
    },
    steps: [
      'Stellen Sie einen Fuß direkt vor den anderen, als würden Sie auf einer Linie stehen.',
      'Halten Sie sich bei Bedarf leicht an einem Tisch oder Stuhl fest.',
      'Halten Sie die Position und atmen Sie ruhig.',
      'Wechseln Sie nach der Zeit die Fußstellung.',
    ],
    safetyNote:
      'Nur so weit voreinander stellen, wie Sie sicher stehen können. Bei Unsicherheit immer festhalten.',
    tags: ['balance', 'koordination'],
  },
  {
    id: 'B3',
    title: 'Gewichtsverlagerung links/rechts',
    category: 'balance',
    level: 2,
    position: 'standing',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/b3_gewichtsverlagerung.png',
      alt: 'Senior verlagert das Gewicht langsam von einem Bein auf das andere',
    },
    steps: [
      'Stellen Sie sich hüftbreit hin, Hände können auf der Hüfte ruhen.',
      'Verlagern Sie langsam das Gewicht auf das linke Bein.',
      'Kommen Sie zur Mitte zurück und verlagern Sie das Gewicht auf das rechte Bein.',
      'Wiederholen Sie die Bewegung ruhig und gleichmäßig.',
    ],
    safetyNote:
      'Nicht wippen, sondern langsam verlagern. Bei Schwindel sofort pausieren.',
    tags: ['balance', 'beine'],
  },
  {
    id: 'B4',
    title: 'Einbeinstand mit Unterstützung',
    category: 'balance',
    level: 2,
    position: 'standing',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/b4_einbeinstand.png',
      alt: 'Senior hält sich an einem Stuhl fest und steht auf einem Bein',
    },
    steps: [
      'Halten Sie sich mit einer oder beiden Händen an einem Stuhl fest.',
      'Heben Sie ein Bein leicht vom Boden ab.',
      'Halten Sie die Position für einige Sekunden und atmen Sie ruhig.',
      'Stellen Sie den Fuß ab und wechseln Sie das Bein.',
    ],
    safetyNote:
      'Nur ausführen, wenn ein stabiler Halt vorhanden ist. Nicht ohne Unterstützung ausprobieren.',
    tags: ['balance', 'bein'],
  },
  {
    id: 'B5',
    title: 'Kreisende Hüftbewegungen',
    category: 'balance',
    level: 1,
    position: 'standing',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/b5_hueftkreisen.png',
      alt: 'Senior steht und macht kreisende Bewegungen mit der Hüfte',
    },
    steps: [
      'Stellen Sie sich hüftbreit hin, Hände auf die Hüfte.',
      'Bewegen Sie die Hüfte langsam in einer kreisenden Bewegung.',
      'Führen Sie einige Kreise in eine Richtung aus, dann in die andere.',
    ],
    safetyNote:
      'Bewegung langsam und kontrolliert ausführen. Kein Hohlkreuz machen.',
    tags: ['mobilität', 'rumpf'],
  },
  {
    id: 'B6',
    title: 'Balance-Mini-Schritte',
    category: 'balance',
    level: 3,
    position: 'standing',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/b6_minischritte.png',
      alt: 'Senior macht kleine, langsame Schritte vorwärts',
    },
    steps: [
      'Stellen Sie sich gerade hin.',
      'Machen Sie kleine Schritte nach vorne, als würden Sie über eine schmale Linie gehen.',
      'Setzen Sie die Füße bewusst und langsam auf.',
    ],
    safetyNote:
      'Nur in einer sicheren Umgebung durchführen, ohne Stolperfallen. Bei Unsicherheit an einer Wand oder Möbeln orientieren.',
    tags: ['balance', 'gehen'],
  },

  // Kraft (K1–K7)
  {
    id: 'K1',
    title: 'Stuhl-Aufstehen',
    category: 'strength',
    level: 1,
    position: 'chair',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/k1_stuhl_aufstehen.png',
      alt: 'Senior steht vom Stuhl auf und setzt sich wieder hin',
    },
    steps: [
      'Setzen Sie sich auf einen stabilen Stuhl, Füße hüftbreit auf dem Boden.',
      'Lehnen Sie den Oberkörper leicht nach vorne.',
      'Drücken Sie sich mit den Beinen nach oben in den Stand.',
      'Setzen Sie sich langsam und kontrolliert wieder hin.',
    ],
    safetyNote:
      'Nicht fallen lassen, sondern aktiv absetzen. Stuhl am besten an die Wand stellen.',
    tags: ['kraft', 'beine', 'alltag'],
  },
  {
    id: 'K2',
    title: 'Wand-Liegestütze',
    category: 'strength',
    level: 2,
    position: 'standing',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/k2_wandliegestuetz.png',
      alt: 'Senior stützt sich mit beiden Händen an der Wand ab',
    },
    steps: [
      'Stellen Sie sich etwa eine Armlänge vor eine Wand.',
      'Legen Sie die Hände in Schulterhöhe an die Wand.',
      'Beugen Sie langsam die Arme und bringen Sie den Oberkörper Richtung Wand.',
      'Drücken Sie sich wieder zurück in die Ausgangsposition.',
    ],
    safetyNote:
      'Nur soweit beugen, wie es sich gut anfühlt. Keine Schmerzen in den Schultern ignorieren.',
    tags: ['kraft', 'oberkörper'],
  },
  {
    id: 'K3',
    title: 'Schulterheben',
    category: 'strength',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/k3_schulterheben.png',
      alt: 'Senior sitzt auf einem Stuhl und hebt die Schultern zu den Ohren',
    },
    steps: [
      'Setzen Sie sich aufrecht auf einen Stuhl.',
      'Heben Sie beide Schultern langsam in Richtung Ohren.',
      'Halten Sie kurz inne und lassen Sie die Schultern wieder sinken.',
    ],
    safetyNote:
      'Schultern nicht verkrampfen. Atmen Sie ruhig weiter.',
    tags: ['kraft', 'schultern'],
  },
  {
    id: 'K4',
    title: 'Arme nach vorne strecken',
    category: 'strength',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/k4_arme_vorne.png',
      alt: 'Senior sitzt und streckt beide Arme nach vorne aus',
    },
    steps: [
      'Setzen Sie sich aufrecht hin.',
      'Strecken Sie beide Arme nach vorne auf Schulterhöhe aus.',
      'Halten Sie die Position einige Sekunden und senken Sie die Arme langsam wieder.',
    ],
    safetyNote:
      'Nicht ins Hohlkreuz fallen. Bauch leicht anspannen.',
    tags: ['kraft', 'arme'],
  },
  {
    id: 'K5',
    title: 'Mini-Kniebeuge mit Stuhl',
    category: 'strength',
    level: 2,
    position: 'standing',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/k5_minikniebeuge.png',
      alt: 'Senior hält sich am Stuhl fest und macht kleine Kniebeugen',
    },
    steps: [
      'Stellen Sie sich hinter einen Stuhl und halten Sie sich an der Rückenlehne fest.',
      'Beugen Sie die Knie leicht, als wollten Sie sich ein wenig setzen.',
      'Drücken Sie sich wieder nach oben in den Stand.',
    ],
    safetyNote:
      'Knie nicht zu tief beugen. Keine ruckartigen Bewegungen.',
    tags: ['kraft', 'beine'],
  },
  {
    id: 'K6',
    title: 'Bizepscurls ohne Gewicht',
    category: 'strength',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/k6_bizepscurls.png',
      alt: 'Senior sitzt und beugt die Arme, als würde er Gewichte halten',
    },
    steps: [
      'Setzen Sie sich aufrecht hin, Arme seitlich am Körper.',
      'Beugen Sie beide Arme, als würden Sie leichte Gewichte nach oben ziehen.',
      'Senken Sie die Arme wieder und wiederholen Sie die Bewegung.',
    ],
    safetyNote:
      'Bewegung ruhig und kontrolliert ausführen. Kein Schwung mit dem Oberkörper.',
    tags: ['kraft', 'arme'],
  },
  {
    id: 'K7',
    title: 'Seitliches Armheben',
    category: 'strength',
    level: 2,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/k7_seitliches_armheben.png',
      alt: 'Senior sitzt und hebt die Arme seitlich auf Schulterhöhe',
    },
    steps: [
      'Setzen Sie sich aufrecht hin.',
      'Heben Sie beide Arme seitlich bis etwa auf Schulterhöhe.',
      'Senken Sie die Arme wieder ab und wiederholen Sie die Bewegung.',
    ],
    safetyNote:
      'Schultern entspannt halten. Nicht höher als angenehm anheben.',
    tags: ['kraft', 'schultern'],
  },

  // Mobilität (M1–M7)
  {
    id: 'M1',
    title: 'Schulterkreisen',
    category: 'mobility',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m1_schulterkreisen.png',
      alt: 'Senior sitzt und kreist die Schultern',
    },
    steps: [
      'Setzen Sie sich aufrecht hin.',
      'Kreisen Sie beide Schultern langsam nach hinten.',
      'Führen Sie anschließend ein paar Kreise nach vorne aus.',
    ],
    safetyNote:
      'Kreise klein und angenehm halten. Keine hastigen Bewegungen.',
    tags: ['mobilität', 'schultern'],
  },
  {
    id: 'M2',
    title: 'Sanftes Nicken',
    category: 'mobility',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m2_nacken_nicken.png',
      alt: 'Senior sitzt und neigt den Kopf leicht nach vorne und hinten',
    },
    steps: [
      'Setzen Sie sich aufrecht hin, Blick nach vorne.',
      'Neigen Sie den Kopf langsam nach vorne, als würden Sie nicken.',
      'Kommen Sie langsam wieder in die Mitte zurück.',
    ],
    safetyNote:
      'Nur in einem kleinen, angenehmen Bewegungsumfang. Kein Kreisen des Kopfes.',
    tags: ['mobilität', 'nacken'],
  },
  {
    id: 'M3',
    title: 'Hüftrotation im Stehen',
    category: 'mobility',
    level: 2,
    position: 'standing',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m3_hueftrotation.png',
      alt: 'Senior steht und dreht den Oberkörper leicht nach links und rechts',
    },
    steps: [
      'Stellen Sie sich hüftbreit hin, Arme locker an der Seite.',
      'Drehen Sie den Oberkörper sanft nach links, Becken bleibt möglichst stabil.',
      'Kommen Sie zur Mitte zurück und drehen Sie nach rechts.',
    ],
    safetyNote:
      'Bewegung langsam ausführen. Nicht ruckartig drehen.',
    tags: ['mobilität', 'rücken'],
  },
  {
    id: 'M4',
    title: 'Knieheben im Stehen',
    category: 'mobility',
    level: 2,
    position: 'standing',
    durationSeconds: 30,
    media: {
      type: 'image',
      src: '/media/exercises/m4_knieheben.png',
      alt: 'Senior hebt im Stehen abwechselnd die Knie an',
    },
    steps: [
      'Stellen Sie sich gerade hin, halten Sie sich bei Bedarf an einem Stuhl fest.',
      'Heben Sie ein Knie in Richtung Hüfte und setzen Sie den Fuß wieder ab.',
      'Wechseln Sie das Bein und wiederholen Sie die Bewegung im ruhigen Tempo.',
    ],
    safetyNote:
      'Nicht zu hoch heben. Bei Unsicherheit Stuhl oder Wand zur Unterstützung nutzen.',
    tags: ['mobilität', 'beine'],
  },
  {
    id: 'M5',
    title: 'Fußkreisen im Sitzen',
    category: 'mobility',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m5_fusskreisen.png',
      alt: 'Senior sitzt und kreist den Fuß in der Luft',
    },
    steps: [
      'Setzen Sie sich auf einen Stuhl, ein Bein leicht anheben.',
      'Kreisen Sie den Fuß ein paar Mal in die eine Richtung.',
      'Wechseln Sie die Richtung und anschließend das Bein.',
    ],
    safetyNote:
      'Nur so weit anheben, wie es bequem ist. Nicht in den Hüftgelenken reißen.',
    tags: ['mobilität', 'fuesse'],
  },
  {
    id: 'M6',
    title: 'Armstreckung nach oben',
    category: 'mobility',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m6_arme_oben.png',
      alt: 'Senior sitzt und streckt beide Arme nach oben',
    },
    steps: [
      'Setzen Sie sich aufrecht hin.',
      'Strecken Sie beide Arme langsam nach oben, so weit es angenehm ist.',
      'Halten Sie kurz inne und senken Sie die Arme kontrolliert wieder.',
    ],
    safetyNote:
      'Nicht ins Hohlkreuz fallen. Bei Schulterbeschwerden nur bis zur Schmerzgrenze.',
    tags: ['mobilität', 'arme'],
  },
  {
    id: 'M7',
    title: 'Seitliches Beugen im Sitzen',
    category: 'mobility',
    level: 1,
    position: 'seated',
    durationSeconds: 20,
    media: {
      type: 'image',
      src: '/media/exercises/m7_seitbeuge.png',
      alt: 'Senior sitzt und beugt den Oberkörper zur Seite',
    },
    steps: [
      'Setzen Sie sich aufrecht hin, Füße hüftbreit auf dem Boden.',
      'Schieben Sie eine Hand langsam Richtung Knie, der Oberkörper beugt sich leicht zur Seite.',
      'Kommen Sie wieder in die Mitte zurück und wechseln Sie die Seite.',
    ],
    safetyNote:
      'Bewegung klein und kontrolliert halten. Kein Rundrücken machen.',
    tags: ['mobilität', 'rumpf'],
  },
];

