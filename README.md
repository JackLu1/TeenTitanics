# TeenTitanics Presents: Bombermon! 
- Project Manager Matthew Ming
- Back End Developer Ricky Lin
- Front End Developer Cathy Cai
- Scripts and Game Designer Ahnaf Kazi

## Project Overview
A local multiplayer game based off the popular game Bomberman, but with a twist! Fight opponents as Pokemon with special abilities with weather effects based on your coordinates! After gathering some wins, go to the market to get new Pokemons and buy upgrades or head to the leaderboard to see who's dominating right now. 

## Video Demo

## Necessary packages
Note:

Python 3 is used

On a Linux, sudo access is required to install packages and dependencies  

You need to create a virtual environment and then install Wheel and Flask.

Wheel archives the requirements and dependencies installed.  

Flask is required to create and run flask apps. 

Note: angle brackets(<>) are simply used to denote a field you should fill out, do not include them.

Installing a virtual environment:

```
sudo apt install python3 -venv
python3 -m venv <name of venv>
```

Activate the virtual environment

```
.<name of venv>/bin/activate
```

Installing Wheel:

```
pip3 install wheel
```

Installing Flask:

```
pip3 install flask
```
 
## Launch instructions
1. Clone this repo.
```
git clone https://github.com/DevMMing/TeenTitanics.git
```
2. Activate your virtual environment.
```
$ python3 -m venv venv
$ . venv/bin/activate
```
3. Go to the project folder.
```
(venv) $ cd TeenTitanics
```
4. Run app.py
```
(venv) $ python app.py
```
5. Navigate to ```localhost:5000``` or ```127.0.0.1``` on your web browser.
6. When you go to the game webpage, ```Ctrl+Shift+r``` to update and render the js.

## API
- PokeAPI: https://pokeapi.co/, used to provide stats to the Pokemon in the game and give weather benefits based on their typing, no API keys needed, limit of 100 API requests per IP address per minute 
- IpAPI : https://ipapi.co/, use to track user's location so we can put the coordinates into the weather api, no API key needed, limit of 1000 calls per day 
- Forecast.Io: https://darksky.net/dev, used to get the weather conditions of the user so that we can provide weather effects based on the weather in his location. To procure keys, sign up with an email. Then, click the link that is sent to your email. The quota is 1000 requests per day for free

Once you have gotten your own key, go to key.json in the data folder and replace each respective database key-value pair strings with your key value. 
