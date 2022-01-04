# 
# Helper code for 0HV120 assignment 1 (2021)
# see assignment1.py for examples of how to use
#
# DO NOT CHANGE THIS CODE
# 

from random import random, gauss as normal_distribution

class Bandits():
  def __init__(self, nr_of_bandits, credit=0.0):
    self.__range = 1
    self.__ratio = 2
    self.__avg_reward = [self.__range*random() for _ in range(nr_of_bandits)]
    self.__std_deviation = [self.__avg_reward[n]/self.__ratio for n in range(nr_of_bandits)]
    self.__credit = credit

  def spin_one(self, nr):
    if self.__credit < 1.0:
      raise ValueError('Not enough credit to spin.')

    result = normal_distribution(self.__avg_reward[nr], self.__std_deviation[nr])
    reward = max(0, round(result, 2))
    self.__credit += reward - 1.0  # each spin costs 1.0
    
    return reward

  def deposit(self, amount):
    if amount < 0.0:
      raise ValueError('You can only deposit positive amounts.')

    self.__credit += round(amount, 2)

  def get_credit(self):
    return self.__credit


