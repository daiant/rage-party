import express from "express";
import cors from 'cors';
import {Room, type RoomId} from "./domain/room.js";

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

    room.requestTimestamp(name);
});

app.delete('/room/:roomId/listener/:listener', (req, res) => {
    const roomId = req.params.roomId;
    const listener = req.params.listener;
    
    rooms.get(roomId)?.removeListener(listener);
    res.status(200).send('ok');
})

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
                event.ack(name);
                res.write(`data: ${JSON.stringify(event.toClient())}\n\n`);
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

    room.addVideo(req.params.videoId, req.query.name as string);
    res.status(200).send('ok');
});

app.post('/room/:roomId/pause', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if(!room) return res.status(404).send('Room not found');

    room.pauseVideo(req.query.name as string);
    res.status(200).send('ok');
});

app.post('/room/:roomId/resume', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if(!room) return res.status(404).send('Room not found');
    room.resumeVideo(req.query.name as string);
    res.status(200).send('ok');
});

app.post('/room/:roomId/currentTimestamp', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if(!room) return res.status(404).send('Room not found');
    room.updateCurrentTimestamp(req.query.name as string, req.body.currentTimestamp as number);
    res.status(200).send('ok');
});

app.listen(port, () => {
    console.log(`Rage party listening on port ${port}`)
    console.log('Creating random room with id 1234');
    rooms.set('1234', new Room('1234'));
});