﻿# Tic-Tac-Game-pure-JS-python

Tic-tac-toe , is a paper-and-pencil game for two players, X and O, who take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three of their marks in a diagonal, horizontal, or vertical row is the winner. It is a solved game with a forced draw assuming best play from both players. 


DEMO VIDEO : https://youtu.be/4hkOMqspGLk

DEV DEMO SERVER : https://tic-tac-purejs-python-git-master.exordio.vercel.app/

logging is not working on dev - because the websocket server is not running with him.

# New Features!

  - 1 x 1 one 1 device mode
  - play with bot
  - multiplayer on websockets

### Todos
 - Improve network code (Room-system) (done)
 - Add locks between player moves (processed)
 - Make the bot smarter (done - minimax algorithm)
 - Logging player actions in 1v1 modes and against bots (done)
 - Logging player actions in multiplayer (processed)


>At the moment the project does not have all declared features. 
There are also things that need to be added for good, for example
need to add the inability to go to the player until the other player has finished.


### Tech

* HTML
* CSS3
* JS 
* Python3

### Installation

Requires [python3](https://www.python.org/downloads/) to run.
Install the dependencies and devDependencies and start the websocket server.
```sh
$ cd websockets
$ python -m venv venv
$ \venv\Scripts\activate
$ pip install websockets
$ python websockets.py
```

Than simple run index.html to check it



