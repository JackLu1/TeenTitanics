import sqlite3, urllib.request, json

#open("../data/info.db","w").close() #Resets Database

db = sqlite3.connect("../data/info.db")

c = db.cursor()

#Setting up tables
'''creates table to store user information'''
c.execute("CREATE TABLE IF NOT EXISTS userInfo(userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, Bombermons TEXT, Upgrades TEXT, Money INTEGER)")

'''creates table to store leaderboard information'''
c.execute("CREATE TABLE IF NOT EXISTS leaderboard(userID INTEGER, Wins INTEGER)")

'''creates table to store Pokemon information'''
c.execute("CREATE TABLE IF NOT EXISTS pokeInfo(pokeID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, Health INTEGER, Attack INTEGER, Speed INTEGER, Type TEXT)")

#for i in 
poke = "https://pokeapi.co/api/v2/pokemon/squirtle/"
response = urllib.request.Request(poke)
response.add_header('User-Agent',"Mozilla")
response = urllib.request.urlopen(response)
obj = json.loads(response.read())

name = obj['name']
health = obj['stats'][5]['base_stat']
attack = obj['stats'][4]['base_stat']
speed = obj['stats'][0]['base_stat']
typ = obj['types'][0]['type']['name']

print(name)
print(health)
print(attack)
print(speed)
print(typ)

db.commit()
db.close()