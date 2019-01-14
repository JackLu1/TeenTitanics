import sqlite3

#open("../data/info.db","w").close() #Resets Database

db = sqlite3.connect("../data/info.db")

c = db.cursor()

#Setting up tables
'''creates table to store user information'''
c.execute("CREATE TABLE IF NOT EXISTS userInfo(userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, Bombermons TEXT, Upgrades TEXT, Money INTEGER)")

'''creates table to store leaderboard information'''
c.execute("CREATE TABLE IF NOT EXISTS leaderboard(userID INTEGER, Wins INTEGER)")

'''creates table to store Pokemon information'''
c.execute("CREATE TABLE IF NOT EXISTS userInfo(pokeID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, Attack INTEGER, Speed INTEGER, Type TEXT)")

db.commit()
db.close()