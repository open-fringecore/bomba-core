import computer from "./computer";
import ip from "./ip";

export const discover = () => {
    const { address, broadcastAddress } = ip();
    const name = computer();

    console.log("MY IP: ", address);
    console.log("MY BROADCAST: ", broadcastAddress);
    console.log("COMPUTER NAME: ", name);

    return "Discovering...";
};
