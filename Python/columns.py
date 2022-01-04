answer = input("first name 1: ")
fn_1 = str(answer)

answer = input("first name 2: ")
fn_2 = str(answer)

answer = input("first name 3: ")
fn_3 = str(answer)

answer = input("last name 1: ")
ln_1 = str(answer)

answer = input("last name 2: ")
ln_2 = str(answer)

answer = input("last name 3: ")
ln_3 = str(answer)

maxNameLenght = max(len(fn_1), len(fn_2), len(fn_3)) + 4

print()

print("first".ljust(maxNameLenght, " ") + "last")

print(fn_1.ljust(maxNameLenght, " ") + ln_1)
print(fn_2.ljust(maxNameLenght, " ") + ln_2)
print(fn_3.ljust(maxNameLenght, " ") + ln_3)
