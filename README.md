# Brick Game
- [Reference used](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)
- [The colour theme used](https://www.nordtheme.com/)
- This is a simple brick-breaking game made by following a tutorial.
- Made to learn basic javascript, using canvases, animating stuff and such.
# Tic Tac Toe
- A very basic tic-tac-toe game using html and js.
## Rock Paper Scissors
- A classic.
# Ninety Nine
## Description
Making a simple card game using html and js.
## Attributions
- Rules from [bicyclecards](https://bicyclecards.com/how-to-play/99-ninety-nine/) and [wikipedia](https://en.wikipedia.org/wiki/Ninety-nine_(addition_card_game)).
- Card assets from [here](https://github.com/hayeah/playing-cards-assets).
> Thanks a lot to everyone mentioned here :) !
## Rules
### Objective
- The objective of the game is to be the last person remaining.
- Every player has three 'tokens' or 'lives' and on loosing all three of them, the player is eliminated.
### Gameplay
- Each player is dealt 3 cards and is given three tokens
- The remaining cards form the 'draw-pile'.
- At the start of the game, the 'total' is set to zero.
- Each player has to place a card, and add its value to the previous total, announce the new total to the other players and then take a card from the draw-pile.
- The values of each card is as follows:
    - A(4): 1 or 11 (chosen by the player)
    - 2(4): 2
    - 3(4): 3
    - 4(4): 0, reverses the direction of play (clockwise becomes anti-clockwise and vice-versea)
    - 5(4): 5
    - 6(4): 6
    - 7(4): 7
    - 8(4): 8
    - 9(4): 0
    - 10(4): -10 (10 is subtracted from the total)
    - J(4): 10
    - Q(4): 10
    - K(4): Sets the total to 99, ignoring the previous total
    - Joker(2): sets the total back to zero
- Whenever a player places a card which pushes the total above 99 loses a token.
### Miscellaneous
- Think of 9 as a 'skip' card and 4 as the 'reverse' card.
- Shuffle the pile into the draw-pile whenever a player loses or the draw-pile becomes too small.
