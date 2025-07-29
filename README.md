# Sunoku
This is a lightweight browser-based game built with React and deployed via GitHub Pages - you can play [here](https://saverio7310.github.io/Sunoku/). It can be played directly in your web browser without the need to download or install anything.

## Index
1. [Inspiration](#inspiration)
2. [Stack and Language](#stack-and-language)
3. [Structure](#structure)
4. [Architecture & State Management](#architecture--state-management)
    - [Contexts](#contexts)
    - [Reducer](#reducer)
    - [States](#states)
    - [Refs](#refs)
    - [Effects](#effects)
5. [Folder Structure](#folder-structure)
6. [How to Play](#how-to-play)
7. [How to Run](#how-to-run)
8. [Known Issues](#known-issues)

## Inspiration
For this little game, I took inspiration from a minigame called *Voltorb Flip*, from the well-known game *Pokémon HeartGold* for *Nintendo DS*. I remember having fun playing that minigame, so that I recreated a personal version to play it from anywhere.  
The name I gave to my project comes from *Sudoku*, since the game is very similar in the logic. The *no* in the middle of the name stands for *number 0*, since your **goal** is to **avoid** the zeros spread across the gameboard.

## Stack and Language
Sunoku is a **front-end project** for which I decided to use **React** as the main library in order to create the page's structure and logic.  
I chose **TypeScript** instead of **JavaScript** as the language: the amount of time lost in my previous experience with the latter due to runtime errors is greater than the time spent to create a well-defined structure for the components, assign types to the variables and props and use them accordingly.  
The project was created and managed with **Vite**. It is way faster than the previously used **CRA**. With few simple clicks in the set-up, it created all the files and folders needed to start the project in a matter of minutes.  
It is, then, deployed on **GitHub Pages** as a static [page](https://saverio7310.github.io/Sunoku/).

## Structure
As all React applications, my page is built using components. The page has a **Header** component containing the title and a toggle switch that lets you change the theme (dark or light) and a homepage div, containing the actual game.  
**Gameboard** and **Menu** are the two main components, rendering the playing grid and the game's info.
The former contains 25 clickable **Card** components, 10 non-clickable **Counter** components - displaying info about the corresponding row or column - and 1 empty cell.  
The latter displays the game's statistics, messages and instructions through the use of *tab panels*. Finally, the main and only button of the page, which lets you start the game, advance to the next level or restart when you lose.  
Another important component is the **CandidatesContextMenu**, which pops up when you right-click on a clickable (not already clicked!) card, lets you choose the possible candidate values for that specific card and disappears when clicking away from it or clicking the *X* button.

## Architecture & State Management
The first and mid versions of the project were quite messy for what concerns the states. There weren't any contexts or reducers. The final version, in my opinion, has a good and reasonable state management. This doesn't mean it cannot be improved further, of course.

### Contexts
I have decided to use two contexts, one for the [theme](Game/src/components/ThemeContext.tsx) and the other for the [candidates context menu](Game/src/components/CandidatesContextMenuContext.tsx).  
The first simply exports a string - *dark* or *light* - and a switch function.  
The second exports a boolean value used for the visibility of the context menu itself on the screen and a **Position** object containing the coordinates in which spawning the context menu and the row and column of the card right-clicked, alongside the corresponding setting functions.

### Reducer
The only reducer I've implemented is the one that manages the gameboard's matrix. Since the matrix handling requires to make multiple actions, a [reducer](Game/src/model/boardReducer.ts) was needed to manage everything easily and correctly.  
The actions on the matrix are:
- board creation
- board revelation
- flip card clicked
- show candidate on selected card

### States
Many [states](Game/src/App.tsx#L26) were used to handle the game's logic and the UI. They manage the current level, the current score, the single level score, the record-high score, the game state and so on.

### Refs
I used 2 [refs](Game/src/App.tsx#L34) in the project.  
The first is used to store the reference of the div element of the candidates context menu. I explain why I used it in the next [sub-section](#effects).  
The last one is used to store the current value of the level. I used a combination of *state* and *ref* for these reasons:
- the state signals that level is a reactive variable
- the ref holds the next value which is updated in a moment t1 but the change has to be visually shown in a moment t2

So the ref is used to handle the level value whilst the state is updated only when it has to be shown.

### Effects
3 effects were needed in this project.  
An effect is used to load the record-high score from the **localStorage**, if any.
Another effect was used to add an event listener to close the candidates context menu when clicking away from it. This is where the ref to the div element was needed.
The last one was used to add the selected theme as a class name to the HTML `<body>` element. Changing the class will make the CSS load the correct set of colors from the [colors.css](Game/src/styles/colors.css) file.

## Folder Structure
The root folder is named `Game/`. Inside this folder, you can find:
- `node_modules` - libraries used in the project
- `public` - static files
- `src` - source code
- `src/assets` - static assets such as images, icons, etc
- `src/components` - react components
- `src/model` - TypeScript classes
- `src/styles` - CSS files
- `src/types` - TypeScript types
- `src/utils` - helper functions and logic

## How to play
These are the rules:
- Your goal is to find all 3's and 2's hidden in the grid
- The last column and last row show how many 0's are present in each corresponding column/row, and what the total value of the numbers is
- If you find them all, you will win the level and proceed to the next one
- You can right-click on any card to add a candidate value
- Finding any 0 will make you lose the game right away

## How to Run
These steps will make you start the project locally.
1. clone the repo
```bash
git clone https://github.com/Saverio7310/Sunoku.git
```

2. open the project folder
```bash
cd Sunoku
```

3. install the dependencies
```bash
npm install
```

4. start in dev mode
```bash
npm start
```

5. go to [http://localhost:5173/Sunoku/](http://localhost:5173/Sunoku/)

## Known Issues
- Currently no sound or music implementation
- No onboarding or tutorial for new players
- Right-click behavior may differ slightly on mobile devices
- Page is not responsive for mobile devices
- Lack of accessibility support (e.g. keyboard navigation)
