# NEKEH Portál – telepítési útmutató

Ez a mappa a NEKEH teljes weboldala: főoldal, Közlöny, jelentkezés, saját bejelentkezés (szolgálati azonosító + jelszó), belső chat és hangcsatornák, valamint a Vezetés oldal.

Amíg nem állítod be a Firebase-t, az oldal **bemutató módban** fut: minden működik, de az adatok csak a saját böngésződben tárolódnak. Ahhoz, hogy mások is be tudjanak lépni, kövesd az alábbi lépéseket. Kb. 15 perc, és ingyenes.

## A mappa tartalma

| Fájl | Mire való |
|---|---|
| `index.html` | Maga a weboldal |
| `img/` | Címer, vállapok, egységfelvarrók |
| `firestore.rules` | Az adatbázis biztonsági szabályai |
| `TELEPITES.md` | Ez az útmutató |

## 1. Firebase-projekt létrehozása

1. Nyisd meg: https://console.firebase.google.com (Google-fiókkal lépsz be).
2. **Create a project** → név: pl. `nekeh-portal` → a Google Analytics kikapcsolható → **Create project**.
3. A projekt az ingyenes **Spark** csomagon indul. Bankkártya nem kell.

## 2. Bejelentkezés bekapcsolása

1. Bal menü: **Build → Authentication → Get started**.
2. **Sign-in method** fül → **Email/Password** → az első kapcsolót kapcsold be → **Save**.

A tagok nem e-mail-címmel lépnek be, hanem szolgálati azonosítóval. Az oldal ebből a háttérben képez egy belső címet, ezért levelet senki nem kap.

## 3. Adatbázis létrehozása és a szabályok

1. **Build → Firestore Database → Create database**.
2. Hely: válaszd az **eur3 (europe-west)** lehetőséget, vagy egy európai régiót.
3. Indítás: **Start in production mode** → **Create**.
4. Nyisd meg a **Rules** fület, töröld a benne lévő szöveget, és másold be a `firestore.rules` fájl teljes tartalmát → **Publish**.

A szabályok gondoskodnak arról, hogy:
- csak a Főbiztos adhasson rangot, fogadhasson el kérelmet, és hirdethessen rendeletet;
- a kérelmeket csak a beküldő és a Főbiztos lássa;
- a belső csatornákat csak a felvett tagok olvashassák;
- az egységcsatornákat csak az adott egység és a vezetés lássa.

## 4. A weboldal összekötése a Firebase-szel

1. Kattints a fogaskerékre a bal felső sarokban → **Project settings**.
2. Lent a **Your apps** résznél kattints a **`</>`** (Web) ikonra → adj nevet (pl. `portal`) → **Register app**. Hostingot itt nem kell bepipálni.
3. Megjelenik egy `firebaseConfig` blokk. Nyisd meg az `index.html`-t egy szövegszerkesztőben (Jegyzettömb is jó), és keresd meg ezt a sort:

   ```js
   const FIREBASE_CONFIG = null;
   ```

4. Cseréld le erre (a saját értékeiddel):

   ```js
   const FIREBASE_CONFIG = {
     apiKey: "…",
     authDomain: "…",
     projectId: "…",
     storageBucket: "…",
     messagingSenderId: "…",
     appId: "…"
   };
   ```

5. Mentsd el a fájlt.

Az `apiKey` nem titkos jelszó. A Firebase-nél ez nyilvános azonosító, a védelmet a 3. lépés szabályai adják.

## 5. Közzététel az interneten

A hangcsatornához és a bejelentkezéshez az oldalnak **https**-en kell futnia. Két ingyenes megoldás:

### A) GitHub Pages
1. Regisztrálj: https://github.com → **New repository** → név: pl. `nekeh` → **Public** → **Create repository**.
2. **uploading an existing file** link → húzd be az `index.html`-t és az `img` mappát → **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, mappa: `/ (root)` → **Save**.
4. Egy-két perc múlva megjelenik a cím, pl. `https://felhasznalonev.github.io/nekeh/`.

### B) Netlify
1. Nyisd meg: https://app.netlify.com/drop (ingyenes regisztráció kell).
2. Húzd be az egész mappát. Azonnal kapsz egy `https://….netlify.app` címet.

## 6. Első indítás: a Főbiztosi fiók

1. Nyisd meg a kész oldalt, és menj a **Bejelentkezés** oldalra.
2. Megjelenik **A rendszer első beállítása** űrlap. Itt hozd létre a saját fiókodat (szolgálati név, Roblox-név, azonosító, jelszó).
3. Az első fiók automatikusan Főbiztos lesz, és ezt utólag senki nem veheti el. **Ezt a közzététel után azonnal tedd meg**, mielőtt a linket bárkinek elküldöd.

## 7. Napi használat

- **Tagok felvétele:** a jelentkezők az oldalon kitöltik a kérdőívet, és közben létrehozzák a saját azonosítójukat. Te a **Vezetés** oldalon elfogadod, interjúra hívod vagy elutasítod őket. Felvételkor egységbe is sorolod őket.
- **Rangok, egységek:** a Vezetés oldal **Állomány** táblázatában.
- **Rendeletek:** a Vezetés oldalon kihirdeted, a sorszámot az oldal automatikusan adja (pl. `1/2026. (XI. 1.) NEKEH rendelet`).
- **Riasztási fokozat, közlemény, szabályzat, rangnevek:** szintén a Vezetés oldalon.

## Hangcsatornák

- Egy csatornában legfeljebb 8 fő beszélhet egyszerre. A hang közvetlenül a résztvevők gépei között halad, a szerver csak összeköti őket.
- Első belépéskor a böngésző engedélyt kér a mikrofonhoz. Ezt engedélyezni kell.
- Ritkán előfordul (pl. egyes iskolai vagy céges hálózatokon), hogy két ember nem hallja egymást. Ilyenkor segít, ha valamelyikük mobilnetre vált.

## Elfelejtett jelszó

Firebase Console → **Authentication → Users** → keresd meg a tagot (`azonosito@nekeh.example.com` formában) → a sor végén a három pont → **Reset password** helyett válaszd a **Delete account** lehetőséget. Utána a tag ugyanazzal az azonosítóval újra jelentkezhet, te pedig újra felveszed. (A jelszavát te sem látod, és nem is kell látnod.)

## Ingyenes keretek

A Spark csomag naponta 50 000 olvasást és 20 000 írást ad. Ez egy néhány tucat fős frakciónak bőven elég. Ha egyszer mégis elfogyna, másnapig az írás szünetel, és az oldal ezt hibaüzenetben jelzi.

## Gyakori hibák

| Hibaüzenet | Megoldás |
|---|---|
| „A Firebase-ben nincs bekapcsolva az e-mail/jelszavas belépés” | 2. lépés |
| „Ehhez nincs jogosultságod” mindenhol | A 3. lépés szabályai nincsenek publikálva |
| Az oldal betölt, de bemutató módban van | Az `index.html`-ben a `FIREBASE_CONFIG` még `null` (4. lépés) |
| A mikrofon nem kapcsol be | Az oldalt https-en nyisd meg, és engedélyezd a mikrofont a címsorban |
