import sqlite3, urllib.request, json

#open("../data/info.db","w").close() #Resets Database

db = sqlite3.connect("data/info.db")

d = db.cursor()



db.commit()
db.close()
