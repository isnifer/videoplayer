## HTML5 Video Player ##

###[Demo](http://kuznetsovanton.ru/games/videoapi/demo.html) (23.02.2014 04:33:34)###

### 1. Install dependencies ###
```bash
npm install --save-dev
```

### 2. Develop ###
```bash
grunt
```

### 3. Prepare for prod ###
```bash
grunt comb
```

You need "assets" folder for using. Insert style.min.css and videoplayer.min.js to page.
### 4. Use ###
```js
var videos = new Player('video');
```
'video' - video element selector. It can be anything ('.player', '#player', etc).

### 5. Player skins ###
If you want to use predefined skins, set attribute **data-skin** to *'skin_' + 1..8* or create your own.

### 6. Create skin ###
If you want to add skin or remove predefined skins, you need to compile new style file.
- Install dependencies
- Run grunt
- Add or remove skins from style.styl
- Compile css
- Use it

#### 7. Predefined controls ####
- Progress bar
- Play / Pause
- Mute
- Volume
- Current time
- Overall time
- Fullscreen

**IMPORTANT:** if you want use custom fonts in your own skins, please, import them to fonts.styl file.
