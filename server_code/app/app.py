import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech.audio import AudioOutputConfig
import pyodbc
from flask_cors import CORS, cross_origin
from flask import Flask,request
from azure.storage.blob import BlobServiceClient
app = Flask(__name__)
CORS(app, support_credentials=True)

server = 'employeemgr.database.windows.net'
database = 'employee'
username = 'techgig@employeemgr'
password = 'gigtech@1234'   
driver= '{ODBC Driver 18 for SQL Server}'
conn=  pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
connection_string = "DefaultEndpointsProtocol=https;AccountName=sqlvaexw675lswetoy;AccountKey=cD7BCVR3xJtdA2IxLd5q4ezmobMbUlaBEvE9/gx3ms8ZGJxNfGOrHcxqHGtxVrGbfyUH+RQ80IeI+AStTqBJSQ==;EndpointSuffix=core.windows.net"
service = BlobServiceClient.from_connection_string(conn_str=connection_string)
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
    if request.method == 'POST':
        details=request.json
        empid=int(details.get("empid"))
        name=details.get("name")
        location=details.get("location")
        contact=details.get("contact")
        gender=details.get("gender")
        performance=int(details.get("performance"))
        notes=details.get("notes")
        preferredName=details.get("preferredName")
        phonetic=details.get("phonetic")
        preferredNameDefault=details.get("preferredNameDefault")
        cursor=conn.cursor()
        cursor.execute("INSERT into employee_details (empid,empname,location,contact,gender,performance,notes,preferredName,phonetic,preferredNameDefault,recordedPronunciation) values ('%d','%s','%s','%s','%s','%d','%s','%s','%s','%d','%d')"%(empid,name,location,contact,gender,performance,notes,preferredName,phonetic,preferredNameDefault, 0))
        conn.commit()
    return {"message":'Success'}

@app.route('/update-employee-details',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def updateEmployeeDetails():
    if request.method == 'POST':
        details=request.json
        empid=details.get("empid")
        preferredNameDefault=details.get("preferredNameDefault")
        if(details.get("phonetic")):
            phonetic=details.get("phonetic")
        else:
            phonetic=""

        if(details.get("preferredname")):
            preferredname=details.get("preferredname")
        else:
            preferredname=""
       
        cursor=conn.cursor()
        cursor.execute("UPDATE employee_details set preferredName='%s', preferredNameDefault='%s',phonetic='%s' where empid='%s'"%(preferredname,preferredNameDefault,phonetic,empid))
        conn.commit()
    return {"message":'Success'}

@app.route('/add-pronunciation',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def addPronunciation():
    if request.method == 'POST':
        details=request.form
        recorded_blob=request.files.get("blob")
        print(details)
        print(recorded_blob)
        
        empid=details.get("empid")
        nametype=details['nametype'] # default or preferred
        blob_client = service.get_blob_client(container="vulnerability-assessment",blob=empid+"_"+nametype+".wav") 
        blob_client.upload_blob(recorded_blob,overwrite=True)
        pronunciationUrl="https://sqlvaexw675lswetoy.blob.core.windows.net/vulnerability-assessment/"+empid+"_"+nametype+".wav"
        if nametype=="default":
            cursor=conn.cursor()
            cursor.execute("UPDATE dbo.employee_details SET pronunciation='%s', recordedPronunciation='%s' where empid='%s'"%(pronunciationUrl,'true',empid))
            conn.commit()
            return {"message":'Success'}
        elif nametype=="preferred":
            cursor=conn.cursor()
            cursor.execute("UPDATE dbo.employee_details SET  preferred_name_pronunciation='%s', recordedPronunciation='%s' where empid='%s'"%(pronunciationUrl,'true',empid))
            conn.commit()
            return {"message":'Success'}
    return {"message":'Failure'}

@app.route('/remove-pronunciation',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def removePronunciation():
    if request.method == 'POST':
        details=request.json
        empid=details.get("empid")
        cursor=conn.cursor()
        cursor.execute("UPDATE dbo.employee_details SET  pronunciation='%s',preferred_name_pronunciation='%s', recordedPronunciation='%d' where empid='%s'"%('','',0,empid))
        conn.commit()
        return {"message":'Success'}
    return {"message":'Failure'}

@app.route('/get-pronunciation',methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def getPronunciation():
    #Cover only system recorded pronunciation
    if request.method == 'POST':
        details=request.json
        empname=details['name']
        speech_config = speechsdk.SpeechConfig(subscription="89cdac66a8fc48348a331c52a8fa4de7", region="eastus")
        audio_config = AudioOutputConfig(use_default_speaker=False)
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        print(synthesizer.speak_text_async(empname))


    return 'hello'



if __name__ == '__main__':
   app.run()
