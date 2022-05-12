import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech.audio import AudioOutputConfig
import pyodbc
from flask_cors import CORS, cross_origin
from flask import Flask,request
app = Flask(__name__)
CORS(app, support_credentials=True)

server = 'employeemgr.database.windows.net'
database = 'employee'
username = 'techgig@employeemgr'
password = 'gigtech@1234'   
driver= '{ODBC Driver 18 for SQL Server}'
conn=  pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)

@app.route('/get-employee-details',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def getEmployeeDetails():
    cursor=conn.cursor()
    cursor.execute("SELECT * from employee_details")
    columns = [column[0] for column in cursor.description]
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))
    return {"employee-details":results}

@app.route('/add-employee-details',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def addEmployeeDetails():
    return 'hello'

@app.route('/update-employee-details',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def updateEmployeeDetails():
    return 'hello'

@app.route('/add-pronunciation',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def addPronunciation():
    if request.method == 'POST':
        details=request.json
        blob=details['blob']
        empid=details['empid']
        
        nametype=details['nametype'] # default or preferred
        if nametype=="default":
            conn.execute("UPDATE employee_details SET pronunciation=?, recordedPronunciation=true where empid=?",blob,empid)
        else:
            conn.execute("UPDATE employee_details SET preferredNamePronunciation=? recordedPronunciation=true where empid=?",blob,empid)

    return 'Success'

@app.route('/get-pronunciation',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def getPronunciation():
    #Cover both system and reecorded pronunciation
    return 'hello'



if __name__ == '__main__':
   app.run()
