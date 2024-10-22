import React, {useEffect, useRef} from 'react';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../state/ContainerContext.jsx";
import {listen} from "@tauri-apps/api/event";

const TerminalComponent = () => {
    const terminalRef = useRef(null);
    const xterm = useRef(null);
    const fitAddon = useRef(new FitAddon());
    const {selectedContainer} = useContainers();
    const promptSymbol = '>>> ';
    let inputBuffer = '';

    const showPrompt = () => {
        xterm.current.write(`\r\n${promptSymbol}`);
    };

    const executeCommand = async (cmd) => {

        try {
            const result = await invoke("exec", {cName: selectedContainer.Names[0].replace("/", ""), command: cmd});

        } catch (e) {
            xterm.current.write(`\r\nError: ${e.message}\r\n`);

        } finally {
            fitAddon.current.fit(); // Adjust terminal size after command execution

        }

    };

    useEffect(() => {
        if (!terminalRef.current) return;

        xterm.current = new Terminal({
            cursorBlink: true,
            fontSize: 16,
            fontFamily: '"Fira Mono", monospace',
            rows: 24,
            cols: 80,
            scrollback: 1000
        });

        xterm.current.loadAddon(fitAddon.current);
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
        showPrompt();

        xterm.current.onData(async (data) => {
            const code = data.charCodeAt(0);

            if (code === 13) { // Enter key
                const command = inputBuffer.trim();
                if (command.length > 0) {
                    await executeCommand(command);
                }
                inputBuffer = ''; // Clear input buffer
            } else if (code === 127) { // Backspace
                if (inputBuffer.length > 0) {
                    inputBuffer = inputBuffer.slice(0, -1);
                    xterm.current.write('\b \b'); // Move cursor back and clear character
                }
            } else if (data.length === 1) { // Regular characters
                inputBuffer += data; // Append to buffer
                xterm.current.write(data); // Write character
            }
        });

        return () => {
            xterm.current.dispose();
        };
    }, [selectedContainer]);

    useEffect(() => {
        const handleResize = () => {
            fitAddon.current.fit();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (selectedContainer) {
            const unlistenTerm = listen('terminal_stdout', (event) => {

                const lines = event.payload.split(/\n/);  // Split by newlines otherwise output appears crooked
                lines.forEach(l => {
                    xterm.current.write(`\r\n${l}\r`);  // Write each line to the terminal
                });
                showPrompt()
            });

            return () => {
                unlistenTerm.then(f => f());
            };
        }
    }, [selectedContainer]);

    return (
        <div style={{height: '100%', width: '100%', overflow: 'hidden'}} ref={terminalRef}/>
    );
};

export default TerminalComponent;
