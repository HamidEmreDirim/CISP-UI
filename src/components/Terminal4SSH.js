import { socket } from "../services/socket";
import React, { useState } from 'react';
import Terminal from 'react-terminal-ui';
import { TerminalOutput, TerminalInput } from 'react-terminal-ui'; // TerminalOutput bileşenini import edin (örnek olarak)


function Terminal4SSH() {

    const [lineData, setLineData] = useState([
        <TerminalOutput key={0}>Welcome to the Life SSH Terminal!&#128075;</TerminalOutput>,
        <TerminalOutput key={1}></TerminalOutput>,
    ]);

    async function onInput(input) {
        socket.emit('executeCommand', input);

        let ld = [...lineData];
        ld.push(<TerminalInput key={ld.length}>{input}</TerminalInput>);
        await socket.on('commandOutput', (data) => {
            console.log(data);
            ld.push(<TerminalOutput key={ld.length}>{data}</TerminalOutput>);
            setLineData(ld);
            socket.removeAllListeners('commandOutput');
        });
    }

    return (
        <div style={{ fontFamily: 'monospace', height: '100vh', padding: '20px' }}>
            <Terminal color="green" prompt="Life@csa:~$" onInput={onInput}> {lineData} </Terminal>
        </div>
    );
}

export default Terminal4SSH;
