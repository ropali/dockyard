import React, {useEffect, useRef} from 'react';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../state/ContainerContext.jsx";
import {toast} from "react-toastify";
import {listen} from "@tauri-apps/api/event";


const TerminalComponent = () => {
    const terminalRef = useRef(null);  // Reference to terminal container
    const xterm = useRef(null);        // Xterm instance
    const fitAddon = useRef(new FitAddon()); // FitAddon instance

    const {selectedContainer} = useContainers();

    // Define a command prompt symbol
    const promptSymbol = '>>> ';

    // Buffer to store the user's command input
    let inputBuffer = '';

    // Function to display the prompt symbol
    const showPrompt = () => {
        xterm.current.write(`\r\n${promptSymbol}`);
    };


    // Function to execute the command and display the result in the terminal
    const executeCommand = async (cmd) => {
        try {
            let res = await invoke("exec", {cName: selectedContainer.Names[0].replace("/", ""), command: cmd});
        } catch (e) {
            xterm.current.writeln(`\r\nError: ${e}`);  // Display the error message
            toast.error(e);  // Optionally show the error with toast
        } finally {
            fitAddon.current.fit();  // Ensure terminal resizes after error
        }
    };

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize Xterm terminal
        xterm.current = new Terminal({
            cursorBlink: true,
            fontSize: 16,
            fontFamily: '"Fira Mono", monospace',
            padding: 10,
        });

        xterm.current.loadAddon(fitAddon.current);
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();

        showPrompt(); // Show the prompt at the start

        // Handle terminal user input
        xterm.current.onData(async (data) => {
            const code = data.charCodeAt(0);

            if (code === 13) { // Enter key
                const command = inputBuffer.trim(); // Get the input command and trim extra spaces
                inputBuffer = '';  // Clear input buffer

                if (command.length > 0) {
                    await executeCommand(command);  // Execute the command
                }

                showPrompt();  // Show the next prompt after command execution
            } else if (code === 127) { // Backspace
                if (inputBuffer.length > 0) {
                    inputBuffer = inputBuffer.slice(0, -1);  // Remove last character
                    xterm.current.write('\b \b');  // Move cursor back, clear the character at the cursor position
                }
            } else {
                inputBuffer += data;  // Append to input buffer
                xterm.current.write(data);  // Display the typed character
            }
        });


        // Clean up terminal on unmount
        return () => {

            xterm.current.dispose();
        };
    }, [selectedContainer]);

    // Handle resizing the terminal to fit the container
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
                    xterm.current.write(`\r${l}\r\n`);  // Write each line to the terminal
                });
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
