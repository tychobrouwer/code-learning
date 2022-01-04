from random import randint

randomFloor = 0
randomCeiling = 100

def main():
    playing = True

    print('Welcome to the guessing game!')

    while playing == True:
        guessStatus = False
        game = Game

        while guessStatus != 'correct':
            guessStatus = game.game(game)
        else:
            print('You have guessed the number!')
            
            answer = input('replay! Enter Y or N: ')

            if answer == 'Y':
                guessStatus = False

                game.newGame(game)
            else:
                print('Thanks for playing!')

                playing = False

class Game:
    randomNumber = randint(randomFloor, randomCeiling)

    def newGame(self):
        self.randomNumber = randint(randomFloor, randomCeiling)

    def game(self):
        try:
            guess = int(input(f'Guess a number between {randomFloor} and a {randomCeiling}: '))
            
            if guess == self.randomNumber:
                return 'correct'
            elif guess > self.randomNumber:
                print('lower')

                return 'low'
            else:
                print('higher')

                return 'high'

        except:
            print('Enter a valid number.')

if __name__ == "__main__":
    main()