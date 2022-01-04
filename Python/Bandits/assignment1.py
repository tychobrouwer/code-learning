from math import exp
from bandits import Bandits

number_of_bandits = 5
credit = 50

command_list = ["q", "c", "d", "o", "a", "s", "t", "b", "z", "p"]
show_credit = str("c")
deposit = str("d")
spin = str("o")
all_bandits = str("a")
stats = str("s")
zero = str("z")
goal = str("p")

def available_commands():
  print('available commands:')
  print('q - quit program')
  print('c - show current credit')
  print('d - deposit credit')
  print('o - spin one bandit')
  print('a - spin all bandits')
  print('s - stats of one bandit')
  # print('t - table of rewards')
  # print('b - best/worst bandit')
  print('z - % of zero reward')
  print('p - play until goal or broke')
  print()

def command_request():
  print()
  return str(input("command: "))

def deposit_credit():
  try:
    amount = int(input("how much do you want to deposit? "))

    if amount < 0:
      print("please enter an amount greater than 0")
    else:
      bandits.deposit(amount)
      credit = bandits.get_credit()

      print("your current credit is " + str(credit))
  except:
    print("please enter an number greater than 0")

def spin_one_bandit():
  if bandits.get_credit() <= 0:
    print("I'm sorry, you do not have enough credit")

  else:
    try:
      bandit_nr = int(input("please enter which bandit: "))

      if bandit_nr > number_of_bandits or bandit_nr < 1:
        print("please enter a number from 1 to " + str(number_of_bandits))

      else:
        reward = bandits.spin_one(bandit_nr - 1)
        bandits.deposit(reward)

        print("the reward of bandit " + str(bandit_nr) + " is " + str(reward) + " euro")
        print("your new credit is: " + str(round(bandits.get_credit(), 2)) + " euro")

    except:
      print("please enter a number from 1 to " + str(number_of_bandits))

def spin_all_bandits():
  title_str = "bandit".rjust(10, " ")
  reward_str = "reward".rjust(10, " ")

  if bandits.get_credit() >= number_of_bandits:
    for bandit_nr in range(0, number_of_bandits):
      reward = bandits.spin_one(bandit_nr)

      reward_str += str(reward).rjust(10, " ")
      title_str += str(bandit_nr + 1).rjust(10, " ")

    print(title_str)
    print(reward_str)
  else:
   print("I'm sorry, you do not have enough credit")

def stats_one_bandit():
  try:
    nr_spins = int(input("how many spins do you want? "))

    if nr_spins <= 0:
      print("please enter a number greater than 0")

    else:
      try:
        bandit_nr = int(input("please enter which bandit: "))

        if bandit_nr > number_of_bandits or bandit_nr < 1:
          print("please enter a number from 1 to " + str(number_of_bandits))

        else:
          rewards = []

          for n in range(nr_spins):
            if bandits.get_credit() >= 1:
              rewards.append(bandits.spin_one(bandit_nr - 1))
            
            else:
              print("your ran out of credit at " + str(len(rewards)) + " spins")

              break
            
          average_reward = sum(rewards) / len(rewards)
          print("average reward of bandit " + str(bandit_nr) + " was " + str(round(average_reward, 2)))
      except:
        print("please enter a number from 1 to " + str(number_of_bandits))

  except:
    print("please enter a number greater than 0")

def zero_reward_pct():
  try:
    nr_spins = int(input("How many spins do you want? "))

    try:
      bandit_nr = int(input("please enter which bandit: "))

      if bandit_nr > number_of_bandits or bandit_nr < 1:
        print("please enter a number from 1 to " + str(number_of_bandits))

      else:
        number_of_zero = 0

        for n in range(nr_spins):
          if bandits.get_credit() >= 1:
            reward = bandits.spin_one(bandit_nr - 1)
            bandits.deposit(reward)

            if reward == 0:
              number_of_zero += 1

          else:
            print("I'm sorry, you ran out of credit")

        pct_zero_spins = (number_of_zero / nr_spins) * 100
        print("the percentage of spins with a reward of 0 was " + str(round(pct_zero_spins, 2)))

    except:
      print("please enter a number from 1 to " + str(number_of_bandits))

  except:
    print("please enter an number greater than 0")

def broke_or_goal():
  try:
    goal = int(input("what do you want your goal to be? "))

    if goal > bandits.get_credit():
      try:
        bandit_nr = int(input("please enter which bandit: "))

        if bandit_nr > number_of_bandits or bandit_nr < 1:
          print("please enter a number from 1 to " + str(number_of_bandits))

        else:
          while 1 <= bandits.get_credit() < goal:
            reward = bandits.spin_one(bandit_nr - 1)
            bandits.deposit(reward)

          if 1 > bandits.get_credit():
            print("you ran out of credit, your current credit is " + str(round(bandits.get_credit(), 2)) + " euro")

          elif bandits.get_credit() >= goal:
            print("you have reached your goal, your current credit is " + str(round(bandits.get_credit(), 2)) + " euro")

      except:
        print("please enter a number from 1 to " + str(number_of_bandits))
        
    else:
      print("please enter a number greater than " + str(round(bandits.get_credit(), 2)))

  except:
    print("please enter a positive number")

bandits = Bandits(nr_of_bandits=number_of_bandits, credit=credit)

print('┌─────────────────────┬───────────────────────┐')
print('│ 0HV120 assignment 1 │ The One-Armed Bandits │')
print('├─────────────────────┼───────────────────────┤')
print('│ duo partner 1       │ Thomas Hendrik        │')
print('├─────────────────────┼───────────────────────┤')
print('│ duo partner 2       │ Tessa Groeneveld      │')
print('└─────────────────────┴───────────────────────┘')
print()

available_commands()

command = command_request()

while command != str("q"):
  if command not in command_list:
    print("unknown command " + str(command))
    available_commands()

  else:
    if command == show_credit:
      print("show current credit")
      print("your current credt is: " + str(round(bandits.get_credit(), 2)) + " euro")

    elif command == deposit:
      print("deposit credit")

      deposit_credit()

    elif command == spin:
      print("spin one bandit")

      spin_one_bandit()

    elif command == all_bandits:
      print("spin all bandits")

      spin_all_bandits()

    elif command == stats:
      print("stats of one bandit")

      stats_one_bandit()

    elif command == zero:
      print("% of zero reward")

      zero_reward_pct()

    elif command == goal:
      print("play until goal or broke")

      broke_or_goal()

  command = command_request()
                

