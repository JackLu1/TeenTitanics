from flask import Flask
import sqlite3

DB_FILE = "data/info.db"

#def fakeAcc():
    #fake account test cases
#    db = sqlite3.connect(DB_FILE)
#    c = db.cursor()
#    c.execute("INSERT INTO userInfo (username, password) VALUES(?,?)",("bob","123",))
#    c.execute("INSERT INTO leaderboard (username, wins) VALUES(?,?)",("bob", 10))
#    c.execute("INSERT INTO userInfo (username, password) VALUES(?,?)",("user","pswd",))
#    c.execute("INSERT INTO leaderboard (username, wins) VALUES(?,?)",("user", 5))
#    c.execute("INSERT INTO userInfo (username, password) VALUES(?,?)",("joe","biden",))
#    c.execute("INSERT INTO leaderboard (username, wins) VALUES(?,?)",("joe", 7))
#    db.commit()
#    db.close()
#    return "Done"

#fakeAcc()
