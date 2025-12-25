import express from "express";
import cors from 'cors';
import {Room, type RoomId} from "./domain/room.ts";

const app = express();
const port = 5723;

app.use(express.json());
app.use(cors());

const rooms = new Map<RoomId, Room>();
app.get('/room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const name = req.query.name as string;
    const room =  rooms.get(roomId);
    if(!room) return res.status(404).send({ error: 'Room not found'});

    room.addListener(name);
    res.json(room.toClient());

    room.requestTimestamp();
});

app.get('/room/:roomId/streaming', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const roomId = req.params.roomId as RoomId;
    const name = req.query.name as string;

    let interValID = setInterval(() => {
        const room = rooms.get(roomId);
        if(!room) {
            res.end();
            clearInterval(interValID);
        } else {
            for(const event of room.getPendingEvents(name)) {
                event.consumed = event.consumed.map(consumed => {
                    if(consumed.id === name) consumed.consumed = true;
                    return consumed;
                });
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            }
        }
    }, 300);

    res.on('close', () => {
        console.log('client dropped me = ' + roomId);
        clearInterval(interValID);
        rooms.get(roomId)?.removeListener(name);
        res.end();
    });
});

app.post('/room/:roomId', (req, res) => {
    const room = new Room(req.params.roomId);
    rooms.set(req.params.roomId, room);
    res.status(200).send('ok');
});

app.patch('/room/:roomId/videoId/:videoId', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if(!room) return res.status(404).send('Room not found');

    room.addVideo(req.params.videoId);
    res.status(200).send('ok');
});

app.patch('/room/:roomId/playerMetadata', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if(!room) return res.status(404).send('Room not found');

    room.addMetadata(req.body);
    res.status(200).send('ok');
});

app.listen(port, () => {
    console.log(`Rage party listening on port ${port}`)
});