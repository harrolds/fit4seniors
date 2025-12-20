import React, { useState } from 'react';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { ModuleCard } from '../../shared/ui/ModuleCard';
import { Button } from '../../shared/ui/Button';
import { useTrainingCatalog, toneToCssVar } from './catalog';
import './trainieren.css';

export const TrainierenHub: React.FC = () => {
  const { goTo } = useNavigation();
  const { t, locale } = useI18n();
  const { data, isLoading, error } = useTrainingCatalog();
  const [showMore, setShowMore] = useState(false);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.hub.loading')}</p>;
  }

  if (error || !data) {
    return <p className="trainieren-status">{t('trainieren.hub.error')}</p>;
  }

  const moduleImageMap: Record<string, string> = {
    cardio: '/assets/trainieren/cardio_excercise.png',
    strength: '/assets/trainieren/strength_exercise.png',
    muskelaufbau: '/assets/trainieren/strength_exercise.png',
    muskel: '/assets/trainieren/strength_exercise.png',
    balance: '/assets/trainieren/balance_excercise.png',
    balance_flex: '/assets/trainieren/balance_excercise.png',
    brain: '/assets/trainieren/brain_excercise.png',
  };

  return (
    <div className="trainieren-page">
      {locale === 'en' ? (
        <>
          {/* Training Overview Intro (EN) */}
          <section className="training-intro" lang="en" aria-labelledby="training-intro-title-en">
            <h2 id="training-intro-title-en">Your Training. Clearly Structured. Built for Everyday Life.</h2>

            <p>
              Choose the module that fits you and explore focused sessions from our <strong>structured training catalog</strong>.
              This app is designed to help you stay <strong>active</strong>, <strong>mobile</strong>, and <strong>mentally sharp</strong> —
              without pressure or complexity.
            </p>

            <Button
              variant="primary"
              className="training-intro-toggle"
              onClick={() => setShowMore((prev) => !prev)}
              aria-expanded={showMore}
              aria-controls="training-intro-details-en"
            >
              {showMore ? 'Show less' : 'Read more'}
            </Button>

            <div
              id="training-intro-details-en"
              style={{
                maxHeight: showMore ? 1600 : 0,
                overflow: 'hidden',
                transition: 'max-height var(--motion-duration-normal, 250ms) var(--motion-ease-standard, ease)',
              }}
              aria-hidden={!showMore}
            >
              <ul className="training-intro-list">
                <li><strong>Cardio</strong> supports endurance and gentle movement to boost heart health and daily energy.</li>
                <li><strong>Strength Training</strong> helps maintain and build muscle using safe, practical exercises.</li>
                <li><strong>Balance &amp; Flexibility</strong> improves stability, mobility, and body awareness for everyday confidence.</li>
                <li><strong>Brain Training</strong> keeps the mind sharp with short, focused tasks for attention and thinking.</li>
              </ul>

              <p className="training-intro-goal">
                The goal of this App is to provide a <strong>simple</strong>, <strong>reliable</strong> training companion that adapts to your pace
                and supports long-term quality of life.
              </p>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Training Overview Intro (DE) */}
          <section className="training-intro" lang="de" aria-labelledby="training-intro-title-de">
            <h2 id="training-intro-title-de">Ihr Training. Klar strukturiert. Für den Alltag gemacht.</h2>

            <p>
              Wählen Sie das Trainingsmodul, das zu Ihnen passt, und entdecken Sie gezielte Einheiten aus unserem <strong>strukturierten Trainingskatalog</strong>.
              Diese App unterstützt Sie dabei, <strong>aktiv</strong>, <strong>beweglich</strong> und <strong>geistig fit</strong> zu bleiben –
              ohne Überforderung, ohne Zeitdruck.
            </p>

            <Button
              variant="primary"
              className="training-intro-toggle"
              onClick={() => setShowMore((prev) => !prev)}
              aria-expanded={showMore}
              aria-controls="training-intro-details-de"
            >
              {showMore ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </Button>

            <div
              id="training-intro-details-de"
              style={{
                maxHeight: showMore ? 1600 : 0,
                overflow: 'hidden',
                transition: 'max-height var(--motion-duration-normal, 250ms) var(--motion-ease-standard, ease)',
              }}
              aria-hidden={!showMore}
            >
              <ul className="training-intro-list">
                <li><strong>Cardio</strong> stärkt Ihre Ausdauer und bringt Sie sanft in Bewegung – ideal für Herz, Kreislauf und tägliche Energie.</li>
                <li><strong>Muskelaufbau</strong> hilft beim Erhalt und Aufbau von Kraft mit sicheren, alltagstauglichen Übungen.</li>
                <li><strong>Balance &amp; Flexibilität</strong> verbessert Stabilität, Beweglichkeit und Körpergefühl – für mehr Sicherheit im Alltag.</li>
                <li><strong>Gehirntraining</strong> hält den Kopf wach mit kurzen, klaren Aufgaben für Konzentration und Denkfähigkeit.</li>
              </ul>

              <p className="training-intro-goal">
                Ziel dieser App ist es, Ihnen ein <strong>einfaches</strong>, <strong>verlässliches</strong> Trainingsangebot zu bieten,
                das sich an Ihr Tempo anpasst und langfristig zu mehr Lebensqualität beiträgt.
              </p>
            </div>
          </section>
        </>
      )}

      <div className="trainieren-grid">
        {data.modules.map((module) => (
          /* Media renders first via CSS order for Trainieren page */
          <ModuleCard
            key={module.id}
            tone={module.tone}
            title={module.title}
            subtitle={module.description}
            rightSlot={<Icon name={module.icon} size={28} />}
            role="button"
            tabIndex={0}
            onClick={() => (module.id === 'brain' ? goTo('/brain') : goTo(`/trainieren/${module.id}`))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (module.id === 'brain') {
                  goTo('/brain');
                } else {
                  goTo(`/trainieren/${module.id}`);
                }
              }
            }}
            className="trainieren-module-card"
            style={{ cursor: 'pointer', backgroundColor: toneToCssVar(module.tone) }}
            aria-label={module.title}
          >
            <div className="trainieren-card-media" aria-hidden="true">
              <img
                className="trainieren-card-media__img"
                src={moduleImageMap[module.id]}
                alt=""
                loading="lazy"
              />
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};


