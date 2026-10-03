import { verify, type JwtPayload } from "jsonwebtoken";
import ws, { WebSocketServer } from "ws"
import { config } from "./config";
import  prisma  from "@repo/db/client"
const wss = new WebSocketServer({port :8080})
import type { WebSocket } from "ws";

type OnlineUser = {
    name: string;
    ws: WebSocket;
    id: string;
};

const onlineUsers = new Map<string, OnlineUser>()

wss.on("connection", async(ws , req)=>{

    const token = req.url?.split("?token=")[1];

    if(!token) {
      ws.close()
      return  
    }

     let decoded;

    try {
    decoded = verify(token, config.JWT_SECRET ) as JwtPayload

    } catch (error) {
        ws.close()
        return;

    }
     
    const user = await prisma.user.findUnique({
        where: {id : decoded.userId}
    })
    
    if(!user ){
        ws.close()
        return 
    }

    onlineUsers.set(decoded.userId, {
        name : user.username,
        ws,
        id : user.id
    })


    wss.clients.forEach((ws)=>{
        ws.send(JSON.stringify({
            type:"ONLINE_USERS",
            payload : {
                users : Array.from(onlineUsers)
            }
        }))
    })

    ws.on("message", (e)=>{
        const parsedData = JSON.parse(e.toString())

        if(parsedData.type === "JOIN"){
            onlineUsers.set();
        }
    })
})