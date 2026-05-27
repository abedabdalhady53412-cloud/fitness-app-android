# Fitness App - Design & Architektur

## Überblick

Eine persönliche Fitness-App für Abed, die seinen 4-Tage-Trainingsplan mit Übungsvideos, wöchentlich wechselnden Rezepten, Wasser- und Vitaminerinnerungen verwaltet. Die App ermöglicht es dem Nutzer, alles jederzeit anzupassen und zu bearbeiten.

## Screen-Liste

1. **Home / Dashboard** — Heute's Trainingstag, aktuelle Mahlzeit, Wasser- und Vitamin-Status
2. **Trainingsplan** — Wochenübersicht (4-Tage-Split), Tagesdetails mit Übungen und Videos
3. **Übungs-Detail** — Video abspielen, Beschreibung, Sätze/Wiederholungen, Bearbeitungsoptionen
4. **Ernährung** — Aktuelle Mahlzeiten für die Woche, Rezepte mit Videos
5. **Rezept-Detail** — Rezeptvideo, Zutaten, Nährwerte, Bearbeitungsoptionen
6. **Erinnerungen** — Wasser-Tracker, Vitamin-Erinnerungen, Bearbeitungsoptionen
7. **Einstellungen** — App-Konfiguration, Datenexport/Import

## Primäre Inhalte & Funktionalität

### Home / Dashboard
- **Heute's Trainingstag:** Zeige den aktuellen Trainingstag (z.B. "Tag 1: Rücken & Bizeps") mit Übersicht der Übungen
- **Aktuelle Mahlzeit:** Zeige die nächste geplante Mahlzeit
- **Wasser-Status:** Anzahl Gläser Wasser heute (mit Ziel: 2L)
- **Vitamin-Erinnerungen:** Zeige fällige Vitamine an
- **Quick Actions:** Buttons zu Trainingsplan, Ernährung, Erinnerungen

### Trainingsplan
- **Wochenübersicht:** Zeige alle 4 Trainingstage (Mo-Do oder benutzerdefiniert)
- **Tagesdetails:** Alle Übungen für den Tag mit:
  - Übungsname
  - Video-Thumbnail
  - Sätze, Wiederholungen, Gewicht (falls vorhanden)
  - Bearbeitungsbutton
- **Cardio-Info:** Zeige Cardio-Dauer und -Typ für den Tag

### Übungs-Detail
- **Video-Player:** Vollbild-Video der Übung
- **Übungs-Info:** Name, Muskelgruppe, Sätze/Wiederholungen
- **Bearbeitungsoptionen:** Gewicht, Sätze, Wiederholungen ändern
- **Notizen:** Persönliche Notizen zur Übung speichern

### Ernährung
- **Wochenübersicht:** Zeige alle Mahlzeiten für die aktuelle Woche
- **Mahlzeit-Karte:** Frühstück, Mittag, Abendessen mit Rezept-Thumbnail
- **Wöchentlicher Wechsel:** Button zum Austausch von Rezepten für die nächste Woche
- **Mahlzeit-Bearbeitung:** Mahlzeiten anpassen oder austauschen

### Rezept-Detail
- **Video-Player:** Rezeptvideo abspielen
- **Zutaten:** Vollständige Zutatenliste mit Mengen
- **Nährwerte:** Kalorien, Protein, Kohlenhydrate, Fette
- **Bearbeitungsoptionen:** Rezept anpassen, Zutaten ändern

### Erinnerungen
- **Wasser-Tracker:** Täglicher Wasser-Konsum (Ziel: 2L)
  - Buttons zum Hinzufügen von Wasser (z.B. +250ml)
  - Visueller Fortschrittsbalken
- **Vitamin-Erinnerungen:** Zeitplan für Vitamine
  - Multivitamin, Whey Isolat, Kreatin, Omega 3, Zink, Vitamin C, Vitamin D
  - Zeitpunkte: Mit Mahlzeiten, nach Training, vor dem Schlafen
  - Abhaken-Funktion
- **Bearbeitungsoptionen:** Erinnerungszeiten anpassen

### Einstellungen
- **Trainingsplan-Einstellungen:** Starttag der Woche, Trainingstage anpassen
- **Ernährungs-Einstellungen:** Mahlzeiten-Zeiten, Allergien/Ausschlüsse
- **Erinnerungen-Einstellungen:** Benachrichtigungen aktivieren/deaktivieren
- **Datenexport:** Trainingsplan, Ernährung, Fortschritt exportieren

## Wichtige User-Flows

### Flow 1: Trainieren
1. User öffnet App → sieht Heute's Trainingstag
2. Tippt auf Übung → Video-Detail öffnet sich
3. Video abspielen, Sätze/Wiederholungen notieren
4. Zurück zum Trainingsplan → nächste Übung
5. Nach Training: Wasser trinken & Vitamine einnehmen

### Flow 2: Mahlzeit planen
1. User öffnet Ernährung → sieht aktuelle Woche
2. Tippt auf Mahlzeit → Rezept-Detail mit Video
3. Rezept-Video ansehen, Zutaten notieren
4. Mahlzeit zubereiten
5. Nach Mahlzeit: Vitamine einnehmen (falls fällig)

### Flow 3: Wöchentlicher Wechsel
1. User öffnet Ernährung
2. Tippt "Nächste Woche" oder "Rezepte wechseln"
3. App zeigt neue Rezepte für die nächste Woche
4. User kann Rezepte anpassen oder akzeptieren

### Flow 4: Erinnerungen
1. User öffnet Erinnerungen → sieht Wasser-Status und Vitamin-Zeitplan
2. Tippt "+250ml" → Wasser-Status aktualisiert sich
3. Tippt Vitamin an → markiert als "Eingenommen"
4. Benachrichtigungen erinnern an fällige Vitamine

## Farbschema

- **Primär:** #FF6B35 (Orange-Rot) — Energie, Fitness
- **Sekundär:** #004E89 (Dunkelblau) — Vertrauen, Stabilität
- **Akzent:** #F7B801 (Gold) — Erfolg, Fortschritt
- **Hintergrund:** #FFFFFF (Weiß) / #F5F5F5 (Hellgrau)
- **Text:** #1A1A1A (Dunkelgrau)
- **Erfolg:** #4CAF50 (Grün)
- **Warnung:** #FFC107 (Gelb)

## Datenspeicherung

- **Lokal:** AsyncStorage für Trainingsplan, Ernährung, Erinnerungen, Benutzernotizen
- **Videos:** Hochgeladen und in der App gespeichert oder von externem Server gestreamt
- **Struktur:**
  - `workoutPlan`: Array von Trainingstagen mit Übungen
  - `recipes`: Array von Rezepten mit Kategorien
  - `reminders`: Wasser- und Vitamin-Zeitplan
  - `userProgress`: Trainingsfortschritt, Notizen
