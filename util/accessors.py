from flask import Flask
import sqlite3

DB_FILE = "data/info.db"

def leader():
    #return the leaderboard stats in descending order by wins
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    all_scores = c.execute("SELECT * FROM leaderboard ORDER BY wins DESC;").fetchall()
    db.close()
    return all_scores

#print(leader())

