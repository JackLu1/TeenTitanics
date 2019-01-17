import sqlite3, urllib.request, json

#open("../data/info.db","w").close() #Resets Database

db = sqlite3.connect("data/info.db")

c = db.cursor()

#Setting up tables
'''creates table to store user information'''
c.execute("CREATE TABLE IF NOT EXISTS userInfo(userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, slots INTEGER, healthUpgrade INTEGER, attackUpgrade INTEGER, speedUpgrade INTEGER, money INTEGER, wins INTEGER)")

'''creates table to store Pokemon information'''
c.execute("CREATE TABLE IF NOT EXISTS pokeInfo(pokeID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, health INTEGER, attack INTEGER, speed INTEGER, type TEXT)")

'''copy info from PokeAPI if empty'''

empty = True

for i in c.execute("SELECT * FROM pokeInfo WHERE pokeID = 1"):
    empty = False

if empty:
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

        counter += 1

#c.execute("INSERT INTO userInfo (username, password, slots, healthUpgrade, attackUpgrade, speedUpgrade, money, wins) VALUES(?,?,?,?,?,?,?,?)",("324ware","234",0,0,0,0,0,19))
#c.execute("INSERT INTO userInfo (username, password, slots, healthUpgrade, attackUpgrade, speedUpgrade, money, wins) VALUES(?,?,?,?,?,?,?,?)",("234wera","pswd",0,0,0,0,0,3))
#c.execute("INSERT INTO userInfo (username, password, slots, healthUpgrade, attackUpgrade, speedUpgrade, money) VALUES(?,?,?,?,?,?,?)",("324ware","234",0,0,0,0,0,))
#c.execute("INSERT INTO userInfo (username, password, slots, healthUpgrade, attackUpgrade, speedUpgrade, money) VALUES(?,?,?,?,?,?,?)",("234wera","pswd",0,0,0,0,0,))

db.commit()
db.close()

def findAll(tableName):
   '''returns entire record with specific value at specific column from specified db table'''

   db = sqlite3.connect("data/info.db")

   c = db.cursor()

   command = "SELECT * from {0}".format(tableName)
   c.execute(command)

   info = c.fetchall()
   db.close()

   return info

def findInfo(tableName,filterValue,colToFilt, sortCol = None, notEqual = None, fetchOne = None, asSubstring= False):
   '''returns entire record with specific value at specific column from specified db table'''

   db = sqlite3.connect("data/info.db")

   c = db.cursor()

   if notEqual:
       boolEqual = '!'
   else:
       boolEqual = ''

   if sortCol:
       sortQuery = 'ORDER BY {}'.format(sortCol)
   else:
       sortQuery = ''

   if notEqual:
       boolEqual = '!'
   else:
       boolEqual = ''

   if sortCol:
       sortQuery = 'ORDER BY {}'.format(sortCol)
   else:
       sortQuery = ''

   if asSubstring:
       filterValue = '%' + filterValue + '%'
       eq = 'LIKE'
   else:
       eq = '='

   command = "SELECT * FROM  '{0}'  WHERE {1} {3}{4} '{2}'".format(tableName,colToFilt,filterValue, boolEqual, eq)
   command += sortQuery
   c.execute(command)

   listInfo = []
   if fetchOne:
       info = c.fetchone()
   else:
       info = c.fetchall()

   if info:
       for col in info:
           #print(col)-
           listInfo.append(col)

   db.close()
   return listInfo

def modify(tableName, colToMod, newVal, filterIndex, filterValue):
    db = sqlite3.connect("data/info.db")
    c = db.cursor()
    print(("UPDATE {0} SET {1}='{2}' WHERE {3}='{4}'").format(tableName, colToMod, newVal, filterIndex, filterValue))
    c.execute(("UPDATE {0} SET {1}='{2}' WHERE {3}='{4}'").format(tableName, colToMod, newVal, filterIndex, filterValue))
    db.commit()
    db.close()

#    if asSubstring:
#        filterValue = '%' + filterValue + '%'
#        eq = 'LIKE'
#    else:
#        eq = '='

#    command = "SELECT * FROM  '{0}'  WHERE {1} {3}{4} '{2}'".format(tableName,colToFilt,filterValue, boolEqual, eq)
#    command += sortQuery
#    c.execute(command)

#    listInfo = []
#    if fetchOne:
#        info = c.fetchone()
#    else:
#        info = c.fetchall()

#    if info:
#        for col in info:
#            #print(col)-
#            listInfo.append(col)

#    db.close()
#    return listInfo

def leaderboard():

    db = sqlite3.connect("data/info.db")
    c = db.cursor()
    c.execute("SELECT username FROM userInfo ORDER BY wins DESC")
    users = c.fetchall()
    c.execute("SELECT wins FROM userInfo ORDER BY wins DESC")
    wins = c.fetchall()
    entry = []
    entries = []
    for i in  range(0,len(users)):
        entry.append(users[i])
        entry.append(wins[i])
        entries.append(entry)
        entry = []
    db.close()
    return entries
