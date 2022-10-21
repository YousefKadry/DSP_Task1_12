from flask import render_template
from SignalStudio import app

@app.route('/SignalStudio')
def SignalStudio():
    return render_template('index.html')