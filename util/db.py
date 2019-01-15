import sqlite3, urllib.request, json

#open("../data/info.db","w").close() #Resets Database

db = sqlite3.connect("../data/info.db")

c = db.cursor()

#Setting up tables
'''creates table to store user information'''
c.execute("CREATE TABLE IF NOT EXISTS userInfo(userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, slots INTEGER, healthUpgrade INTEGER, attackUpgrade INTEGER, speedUpgrade INTEGER, money INTEGER)")

'''creates table to store leaderboard information'''
c.execute("CREATE TABLE IF NOT EXISTS leaderboard(username TEXT, wins INTEGER)")

'''creates table to store Pokemon information'''
c.execute("CREATE TABLE IF NOT EXISTS pokeInfo(pokeID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, health INTEGER, attack FLOAT, speed INTEGER, type TEXT)")

'''copy info from PokeAPI'''

counter = 1

while (counter < 8):

    '''access api and read json information'''
    poke = "https://pokeapi.co/api/v2/pokemon/" + str(counter) + "/"
    response = urllib.request.Request(poke)
    response.add_header('User-Agent',"Mozilla")
    response = urllib.request.urlopen(response)
    obj = json.loads(response.read())

    '''load the parameters that we need from the json'''
    name = obj['name']
    health = obj['stats'][5]['base_stat']
    attack = int((obj['stats'][4]['base_stat']) / 10)
    speed = int((obj['stats'][0]['base_stat']) / 4)

    if (counter == 1): #for bulbasaur's weird typing
        typ = obj['types'][1]['type']['name']
    else:
        typ = obj['types'][0]['type']['name']

#    print(name)
#    print(health)
#    print(attack)
#    print(speed)
#    print(typ)

    c.execute("INSERT INTO pokeInfo(name, health, attack, speed, type) VALUES (?,?,?,?,?)", (name, health, attack, speed, typ,))

    counter += 3

db.commit()
db.close()
