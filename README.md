# 💪Team A* Fitness 

## ⚠️ Anleitung zum Starten des Projekts ⚠️

Vor dem Starten des Servers müssen entsprechende Änderungen in den `.env`-Dateien der Laravel- und React-Projekte vorgenommen werden.  
Die folgenden Zeilen müssen genau wie unten angegeben hinzugefügt oder ersetzt werden:

### ⚠️⚠️⚠️ React-Projekt liegt auch in diesem Projekt

Dieses Projekt enthält eine Laravel-Anwendung, in die ein React-Projekt integriert ist. Das React-Projekt befindet sich innerhalb des Hauptverzeichnisses der Laravel-Anwendung im Ordner team-a-stern-webdev-laravel/react-fitness. Dieses Verzeichnis dient als Arbeitsbereich für die Frontend-Entwicklung mit React, die nahtlos mit der Laravel-Backend-Architektur verbunden ist.


### Laravel `.env` Datei: `/team-a-stern-webdev-laravel/.env`

```env
APP_URL=http://localhost  
FRONTEND_URL=http://192.168.64.45  
FRONTEND_PORT=3000  
FRONTEND_LOCAL_URL=http://localhost  
MAIL_FROM_ADDRESS="hello@team-a.com"
```

### React `.env` Datei:

```env
REACT_APP_API_URL="http://192.168.64.45:8088"
```

### Zusätzliche Änderungen:

**Laravel-Projekt:**  
Stellen Sie sicher, dass die Datei `config/cors.php` die folgenden Zeilen enthält:

```php
'allowed_origins' => [  
    env('FRONTEND_URL') . ':' . env('FRONTEND_PORT'),  
    env('FRONTEND_LOCAL_URL') . ':' . env('FRONTEND_PORT'),  
],
```

**React-Projekt:**  
Stellen Sie sicher, dass die Datei `react-fitness/src/axiosConfig.js` wie folgt aussieht:

```javascript
import axios from 'axios';

const baseURL = `${process.env.REACT_APP_API_URL}/api`;
export default axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
```

### Nächster Schritt: Verbinden des Speichers
Führen Sie den folgenden Befehl aus, um den Speicher zu verknüpfen:
```bash
php artisan storage:link
```

### Datenbank-Migration und Seed
Nachdem der Speicher verknüpft ist, führen Sie den folgenden Befehl aus, um Migrationen zu erstellen und die Datenbank zu füllen:

```bash
php artisan migrate:refresh --seed
```

### Projekt starten
**Laravel-Projekt:**  
Das Laravel-Projekt kann aus dem Verzeichnis `team-a-stern-webdev-laravel` mit dem folgenden Befehl gestartet werden:

```bash
php artisan serve --host=192.168.64.45 --port=8088
```

**React-Projekt:**  
Das React-Projekt kann aus dem Verzeichnis `team-a-stern-webdev-laravel/react-fitness` mit dem folgenden Befehl gestartet werden:

```bash
PORT=3000 npm start
```

### Testzugangsdaten
Nach Abschluss der Migration können Sie sich mit den folgenden Rollen und Zugangsdaten anmelden:
- **User**: `user@user.com` / `password`
- **Trainer**: `trainer@trainer.com` / `password`
- **Admin**: `admin@admin.com` / `password`

### Einrichtungshinweise

Die Funktionsfähigkeit wurde getestet, indem die folgenden Befehle nacheinander eingegeben wurden:


```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:refresh --seed
php artisan storage:link
php artisan serve --host=192.168.64.45 --port=8088
```
#### Frontend-Einrichtung

```bash
cd react-fitness
npm install
cp .env.example .env
npm start
# oder:
PORT=3003 npm start
```

# 📝 Projektbeschreibung



Es wurde in diesem Projekt eine Plattform für Fitnessaktivitäten entwickelt. Die Nutzer können Trainingseinheiten auswählen, Ernährungsrezepte finden und mit Trainern kommunizieren.


## 💻 Verwendete Technologien
- **Laravel 11.9** – Für die Umsetzung der Backend-Funktionalität.
- **React 19.0** – Für die Entwicklung der Frontend-Oberfläche.
