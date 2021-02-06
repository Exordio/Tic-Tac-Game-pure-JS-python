import asyncio
import websockets
import json

USERS = set()


async def notify_users():
    if USERS:
        message = f'{USERS}'
        await asyncio.wait([user.send(message) for user in USERS])

#TODO канальное распределение.
async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


turns_in_room = []

# Примитивный метод, репульс пакета от клиента другим клиентам.
# TODO По хорошему нужно написать алгоритм марсшрутизиции между комнатами в игре.
async def repulse(websocket, path):
    try:
        await register(websocket)
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            print(data)
            if('turn' in data):
                turns_in_room.append(data['turn'])
                print(turns_in_room)
            if len(turns_in_room) > 0:
                await asyncio.wait([user.send(json.dumps(turns_in_room[::-1][0])) for user in USERS])
            if('clear' in data):
                print('Clearing turns')
                turns_in_room.clear()
    except websockets.exceptions.ConnectionClosedOK:
        print('Clearing turns')
        turns_in_room.clear()


start_server = websockets.serve(repulse, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()