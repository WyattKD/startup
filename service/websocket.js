const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function room_handler(httpServer) {
    const wss = new WebSocketServer({ noServer: true });
    const rooms = {};

    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
          wss.emit('connection', ws, request);
        });
    });

    let connections = [];

    wss.on('connection', (ws) => {
        const connection = { id: uuid.v4(), alive: true, ws: ws };
        connections.push(connection);

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            const { type, room, player, guesser, word_giver } = data;

            if (type === 'join') {
                if (!rooms[room]) {
                    rooms[room] = [];
                }
                // Check if the player is already in the room
                if (!(ws in rooms[room])) { 
                    rooms[room].push(ws);
                    console.log(`Player ${player} joined room ${room}`);
                }

                if (rooms[room].length === 2) {
                    rooms[room].forEach((client) => {
                        client.send(JSON.stringify({ type: 'start', message: 'Game starting!' }));
                    });
                }
            }

            if (type === 'get_players') {
                if (!rooms[room]) {
                    rooms[room] = [];
                }
                if (rooms[room].length >= 1) {
                    rooms[room].forEach((client) => {
                        client.send(JSON.stringify({ type: 'players', message: rooms[room].length }));
                    });
                }
            }

            if (type === 'update_roles') {
                if (!rooms[room]) {
                    rooms[room] = [];
                }
                if (rooms[room].length === 2) {
                    rooms[room].forEach((client) => {
                        client.send(JSON.stringify({ type: 'roles', message: { guesser: guesser, word_giver: word_giver } }));
                    });
                }
            }

            if (type === 'leave_room') {
                for (const room in rooms) {
                    rooms[room] = rooms[room].filter((client) => client !== ws);
                    if (rooms[room].length === 0) {
                        delete rooms[room];
                    }
                }
            }

            if (type === 'change_real_words') {
                
                if (!rooms[room]) {
                    rooms[room] = [];
                }
                if (rooms[room].length === 2) {
                    console.log('message SENT');
                    rooms[room].forEach((client) => {
                        client.send(JSON.stringify({ type: 'real_words', message: true }));
                    });
                }
            }
        });

        ws.on('close', () => {
            const pos = connections.findIndex((o, i) => o.id === connection.id);
            if (pos >= 0) {
                connections.splice(pos, 1);
            }

            for (const room in rooms) {
                rooms[room] = rooms[room].filter((client) => client !== ws);
                if (rooms[room].length === 0) {
                    delete rooms[room];
                }
            }
        });
        ws.on('pong', () => {
            connection.alive = true;
        });
    });
    setInterval(() => {
        connections.forEach((c) => {
            // Kill any connection that didn't respond to the ping last time
            if (!c.alive) {
            c.ws.terminate();
            } else {
            c.alive = false;
            c.ws.ping();
            }
        });
    }, 10000);

}

module.exports = { room_handler };