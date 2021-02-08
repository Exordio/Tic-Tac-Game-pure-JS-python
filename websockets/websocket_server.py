import asyncio
import websockets
import json
import os


turns_in_room = []
history = []
history_is_loaded = False
room_names = {}


async def register(websocket):
    global history
    global history_is_loaded

    if not history_is_loaded:
        if os.stat("data.json").st_size != 0:
            with open('data.json') as json_file:
                history = json.load(json_file)
            # for i in history:
                # print(i)
    await websocket.send(json.dumps(history))


#TODO Логирование действий мультиплеера
async def repulse(websocket, path):
    global room_names
    global versus
    try:
        await register(websocket)
        room_name = None
        versus = None
        while True:
            data = await websocket.recv()
            data = json.loads(data)

            if('roomName' in data):
                # print(data)
                room_name = data['roomName']

                if not(room_name in room_names):
                    room_names[room_name] = set()
                    room_names['username'] = set()
                room_names[room_name].add(websocket)

                # room_names['username'].add(data['username'])

                #versus = str(room_names['username']).replace('{', '').replace('}', '').replace("'", '').replace(',', ' VS')
                #print(versus)

            if ('turn' in data):
                print(data)
                turns_in_room.append(data['turn'])
                print(turns_in_room)
            if (len(turns_in_room) > 0):
                await asyncio.wait([user.send(json.dumps(turns_in_room[::-1][0])) for user in room_names[room_name]])
            #if (len(turns_in_room) >= 9):

            if ('clear' in data):
                print('Clearing turns')
                turns_in_room.clear()
                room_names.clear()

            if ('log' in data):
                print(data)
                history.append(data)
                to_file = history
                with open('data.json', 'w', encoding='utf-8') as f:
                    json.dump(to_file, f, ensure_ascii=True, indent=4)

    except websockets.exceptions.ConnectionClosedOK:
        print('Clearing turns')
        turns_in_room.clear()


start_server = websockets.serve(repulse, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
