#TeenTitanics - Cathy Cai, Ahnaf Kazi, Ricky Lin, Matthew Ming

import json
import os
import urllib

from flask import Flask, render_template, session, redirect, request, url_for, flash

from util import db, auth

app = Flask(__name__)

app.secret_key = os.urandom(32)

#obtains keys to use from key database
with open("data/key.json") as f:
    data = json.loads(f.read())
    key=data['key']


@app.route("/")
def index():

    '''This function redirects the user to their profile page if they are logged in.
       If they aren't, it will render the login page
       where the users will be prompted to enter their username and password.
       When users enter and submit the information,
       they will be redirected to the authentication page.'''

    #if the user is logged in redirect them to their profile page
    if 'user' in session:
        return redirect('/home')

    #if not, load the login page
    return render_template("index.html")

@app.route("/logout")
def logout():

    if 'user' in session:
        session.pop('user')
        flash('Sucessfully Logged Out')
    return redirect('/')

@app.route("/register")
def register():

    '''This function redirects the user to their profile page if they are logged in.
       If they aren't, it will render the account creator page
       where they will be prompted to enter their desired username and password
       as well as confirm their password.
       Once the user sumbits their information, they will be redirected to their profile page.
       Users can also click the login link which brings them back to the login page.'''

    #redirects if not logged in
    if 'user' in session:
        return redirect('/home')

    return render_template("register.html")

@app.route("/auth", methods = ['POST','GET'])
def authenticate():

    '''This function redirects users who got to the the authenticate page without entering a form to the login page.
       If they did enter a form, it will check if the username and password are in the database.
       If they are, it will redirect them to their home page and flash a message indicating a successful login.
       If they aren't, it will redirect them to the login page and flash a message indicating the issue.
       Whether the username or the password was incorrect.
       If they were both incorrect, the message will only indicate an issue with the username.'''

    loginStatus = ''

    #if the user got here without entering a form, redirect them to the index
    if request.method == 'GET' or not('user' in request.form.keys()):
        return redirect('/')

    #checks the user's login info or account creation
    if "pass2" in request.form.keys():
        loginStatus =  auth.register(request.form['user'],request.form['pass1'],request.form['pass2'])

    else: loginStatus = auth.login(request.form["user"],request.form["pass"])

    #if the user successsfully logs in or creates an acount, redirect them to their profile page
    if loginStatus in ["Account creation successful","Login Successful"]:
        session['user'] = request.form['user']
        return redirect('/home')

    else:
        flash(loginStatus)
        #Redirects to previous page or root if there is none
        return redirect(request.referrer or '/')

@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/leaders')
def leaders():
    leaders = db.leaderboard()
    return render_template("leaders.html", leaders=leaders)

@app.route('/market')
def market():
    try:
        user = session['user']
    except:
        return redirect('/')
    user_info = db.findInfo('userInfo', user, 'username', fetchOne =  True)
    money = user_info[7]
    # stuff = user_info[???]
    return render_template("market.html",
                            username = user,
                            money = money

    )

@app.route('/start')
def start():
    try:
        user = session['user']
    except:
        return redirect('/')
    user_info = db.findInfo('userInfo', user, 'username', fetchOne =  True)
    slots = user_info[3]
    pokemon_images = []
    poke_info = db.findAll('pokeInfo')[:slots]
    for poke in poke_info:
        pokemon_images.append(poke[1] + '.png')
    return render_template("start.html",
                            pokemons = pokemon_images
    )

@app.route('/game')
def game():
    return render_template("game.html")

@app.route('/newpoke', methods=['POST', 'GET'])
def newpoke():
    try:
        user = session['user']
    except:
        return redirect('/')
    user_info = db.findInfo('userInfo', user, 'username', fetchOne =  True)
    money = user_info[7]
    # assuming 3 slots initiated
    slots = user_info[3]
    poke_info = db.findAll('pokeInfo')
    # new_poke = poke_info[slots]
    new_poke = poke_info[0]
    slots += 1
    db.modify('userInfo', 'slots', slots, 'username', user)
    db.modify('userInfo', 'money', money - 200, 'username', user)
    return redirect('/start')

if __name__ == "__main__":
    app.debug = True
    app.run()
