import asyncio
import websockets
import json
import os
from datetime import datetime

USERS = set()


async def notify_users():
    if USERS:
        message = f'{USERS}'
        await asyncio.wait([user.send(message) for user in USERS])


turns_in_room = []
history = []


# TODO канальное распределение.
async def register(websocket):
    global history
    USERS.add(websocket)
    await notify_users()
    if os.stat("data.json").st_size != 0:
        with open('data.json') as json_file:
            history = json.load(json_file)
        for i in history:
            print(i)

    await asyncio.wait([user.send(json.dumps(history)) for user in USERS])


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


# Примитивный метод, репульс пакета от клиента другим клиентам.
# TODO По хорошему нужно написать алгоритм марсшрутизиции между комнатами в игре.

async def repulse(websocket, path):
    # asyncio.get_event_loop().create_task(history(websocket))
    try:
        await register(websocket)
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            if ('turn' in data):
                print(data)
                turns_in_room.append(data['turn'])
                print(turns_in_room)
            if len(turns_in_room) > 0:
                await asyncio.wait([user.send(json.dumps(turns_in_room[::-1][0])) for user in USERS])
            if ('clear' in data):
                print('Clearing turns')
                turns_in_room.clear()

            if ('log' in data):
                print(data)
                # print(history)
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
