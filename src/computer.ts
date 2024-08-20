import * as os from "os";

function getComputerName(): string {
    return os.hostname();
}

export default () => {
    const name = getComputerName();

    return name;
};
