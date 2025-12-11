import React from 'react';

export const GlobalSettingsScreen: React.FC = () => {
  return (
    <div className="f4s-settings">
      {/* Darstellung */}
      <section className="f4s-settings__section">
        <h2>Darstellung</h2>
        <div className="f4s-settings__row">
          <label htmlFor="fontSizeSetting">Schriftgröße</label>
          <select id="fontSizeSetting" name="fontSizeSetting" defaultValue="medium">
            <option value="medium">Mittel (14px)</option>
            <option value="large">Groß (18px)</option>
          </select>
        </div>
        <div className="f4s-settings__row">
          <label htmlFor="contrastSetting">Kontrastmodus</label>
          <select id="contrastSetting" name="contrastSetting" defaultValue="normal">
            <option value="normal">Normal</option>
            <option value="high">Hoch</option>
          </select>
        </div>
      </section>

      {/* Profil */}
      <section className="f4s-settings__section">
        <h2>Profil</h2>
        <div className="f4s-settings__row">
          <label htmlFor="profileName">Name</label>
          <input id="profileName" name="profileName" type="text" placeholder="Optional" />
        </div>
        <div className="f4s-settings__row">
          <label htmlFor="ageCategory">Alterskategorie</label>
          <select id="ageCategory" name="ageCategory" defaultValue="60-69">
            <option value="60-69">60–69</option>
            <option value="70-79">70–79</option>
            <option value="80+">80+</option>
          </select>
        </div>
        <div className="f4s-settings__row">
          <label htmlFor="mobilityLevel">Mobilität</label>
          <select id="mobilityLevel" name="mobilityLevel" defaultValue="seated">
            <option value="seated">Sitzend</option>
            <option value="mobile">Mobil</option>
            <option value="intense">Sehr mobil</option>
          </select>
        </div>
      </section>

      {/* App-Information */}
      <section className="f4s-settings__section">
        <h2>App-Information</h2>
        <p>Fit4Seniors – Version 1.0</p>
        <p>
          <a href="/datenschutz">Datenschutz</a>
        </p>
        <p>
          <a href="/impressum">Impressum</a>
        </p>
      </section>
    </div>
  );
};
