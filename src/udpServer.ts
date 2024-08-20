import * as dgram from "dgram";
import useBroadcast from "./broadcast";

type UdpMsgType = {
    method: string;
    name: string;
    id: string;
    ip: string;
    httpPort: number;
    isBroadcast: boolean;
};
export const udpServer = (
    MY_ID: string,
    NAME: string,
    BROADCAST_ADDR: string,
    MY_IP: string,
    UDP_PORT: number,
    HTTP_PORT: number
) => {
    const { broadcast } = useBroadcast();

    const server = dgram.createSocket({
        type: "udp4",
        reuseAddr: true,
    });
    server.bind({
        port: UDP_PORT,
        address: "0.0.0.0",
        exclusive: false,
    });

    const msg: UdpMsgType = {
        method: "SELF",
        name: NAME,
        id: MY_ID,
        ip: MY_IP,
        httpPort: HTTP_PORT,
        isBroadcast: true,
    };

    const initialBroadcast = () => {
        broadcast(server, BROADCAST_ADDR, UDP_PORT, JSON.stringify(msg));
    };

    server.on("listening", function () {
        const address = server.address();
        console.log(`Listening on ${address.address}:${address.port}`);
        server.setBroadcast(true);

        initialBroadcast();
    });

    server.on("message", (receivedMsg, rinfo) => {
        const data: UdpMsgType = JSON.parse(receivedMsg?.toString());

        if (data.id == MY_ID) {
            return;
        }

        console.log("DATA:", data);
        // ! DEBUGGING...
        if (data?.isBroadcast) {
            console.log("<-- Broadcasted From:", data.name, data.id?.slice(-5));
        } else {
            console.log("<-- Received From:", data.name, data.id?.slice(-5));
        }
    });

    server.on("error", (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
};
