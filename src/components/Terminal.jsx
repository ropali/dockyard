import React, {useCallback, useEffect, useRef} from 'react';
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

    const terminalState = useRef({
        initialized: false,
        buffer: '',
        cursorPosition: 0,
        promptLength: promptSymbol.length,
        history: [],
        historyPosition: -1,
        unsubscribeCallbacks: [],
        expectingOutput: false  // New flag to track if we're expecting command output
    });

    const showPrompt = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write(`\r\n${promptSymbol}`);
        terminalState.current.cursorPosition = 0;
        terminalState.current.buffer = '';
        terminalState.current.historyPosition = -1;
        terminalState.current.expectingOutput = false;  // Reset output expectation
    }, []);

    const redrawLine = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write('\r' + ' '.repeat(promptSymbol.length + terminalState.current.buffer.length));
        xterm.current.write('\r' + promptSymbol + terminalState.current.buffer);
        const moveBack = terminalState.current.buffer.length - terminalState.current.cursorPosition;
        if (moveBack > 0) {
            xterm.current.write('\x1b['.concat(moveBack, 'D'));
        }
    }, []);

    const findWordBoundary = useCallback((text, position, direction) => {
        if (direction === 'left') {
            if (position === 0) return 0;
            let newPos = position - 1;
            while (newPos > 0 && /\s/.test(text[newPos])) newPos--;
            while (newPos > 0 && !/\s/.test(text[newPos - 1])) newPos--;
            return newPos;
        } else {
            if (position === text.length) return text.length;
            let newPos = position;
            while (newPos < text.length && /\s/.test(text[newPos])) newPos++;
            while (newPos < text.length && !/\s/.test(text[newPos])) newPos++;
            return newPos;
        }
    }, []);

    const executeCommand = useCallback(async (cmd) => {
        if (!xterm.current || !selectedContainer) return;

        try {
            if (cmd.trim() && (terminalState.current.history.length === 0 ||
                terminalState.current.history[terminalState.current.history.length - 1] !== cmd)) {
                terminalState.current.history.push(cmd);
            }

            // Set the flag before executing the command
            terminalState.current.expectingOutput = true;

            await invoke("exec", {
                cName: selectedContainer.Names[0].replace("/", ""),
                command: cmd
            });

        } catch (e) {
            terminalState.current.expectingOutput = false;  // Reset flag on error
            xterm.current.write(`\r\nError: ${e.message}\r\n`);
            showPrompt();
        }
    }, [selectedContainer, showPrompt]);

    const handleHistory = useCallback((direction) => {
        if (terminalState.current.history.length === 0) return;

        if (direction === 'up') {
            if (terminalState.current.historyPosition === -1) {
                terminalState.current.historyPosition = terminalState.current.history.length - 1;
            } else if (terminalState.current.historyPosition > 0) {
                terminalState.current.historyPosition--;
            }
        } else if (direction === 'down') {
            if (terminalState.current.historyPosition < terminalState.current.history.length - 1) {
                terminalState.current.historyPosition++;
            } else {
                terminalState.current.historyPosition = -1;
            }
        }

        terminalState.current.buffer = terminalState.current.historyPosition === -1
            ? ''
            : terminalState.current.history[terminalState.current.historyPosition];
        terminalState.current.cursorPosition = terminalState.current.buffer.length;
        redrawLine();
    }, [redrawLine]);

    const initializeTerminal = useCallback(() => {
        if (!terminalRef.current || terminalState.current.initialized) return;

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

        const handleData = async (data) => {
            const code = data.charCodeAt(0);

            if (data.length > 1) {
                switch (data) {
                    case '\x1b[C': // Right arrow
                        if (terminalState.current.cursorPosition < terminalState.current.buffer.length) {
                            terminalState.current.cursorPosition++;
                            xterm.current.write(data);
                        }
                        return;
                    case '\x1b[D': // Left arrow
                        if (terminalState.current.cursorPosition > 0) {
                            terminalState.current.cursorPosition--;
                            xterm.current.write(data);
                        }
                        return;
                    case '\x1b[A': // Up arrow
                        handleHistory('up');
                        return;
                    case '\x1b[B': // Down arrow
                        handleHistory('down');
                        return;
                    case '\x1b[H': // Home key
                    case '\x1bOH':
                        terminalState.current.cursorPosition = 0;
                        redrawLine();
                        return;
                    case '\x1b[F': // End key
                    case '\x1bOF':
                        terminalState.current.cursorPosition = terminalState.current.buffer.length;
                        redrawLine();
                        return;
                    case '\x1b[1;5C': // Ctrl + Right
                        terminalState.current.cursorPosition = findWordBoundary(
                            terminalState.current.buffer,
                            terminalState.current.cursorPosition,
                            'right'
                        );
                        redrawLine();
                        return;
                    case '\x1b[1;5D': // Ctrl + Left
                        terminalState.current.cursorPosition = findWordBoundary(
                            terminalState.current.buffer,
                            terminalState.current.cursorPosition,
                            'left'
                        );
                        redrawLine();
                        return;
                }
                return;
            }

            if (code === 13) { // Enter key
                const command = terminalState.current.buffer.trim();
                if (command.length > 0) {
                    xterm.current.write('\r\n');
                    await executeCommand(command);
                } else {
                    showPrompt();
                }
            } else if (code === 127) { // Backspace
                if (terminalState.current.cursorPosition > 0) {
                    const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition - 1);
                    const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                    terminalState.current.buffer = start + end;
                    terminalState.current.cursorPosition--;
                    redrawLine();
                }
            } else if (data.length === 1) { // Regular characters
                const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition);
                const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                terminalState.current.buffer = start + data + end;
                terminalState.current.cursorPosition++;
                redrawLine();
            }
        };

        xterm.current.onData(handleData);
        terminalState.current.initialized = true;

        terminalState.current.unsubscribeCallbacks.push(() => {
            if (xterm.current) {
                xterm.current.dispose();
                xterm.current = null;
            }
        });
    }, [showPrompt, redrawLine, handleHistory, findWordBoundary, executeCommand]);

    useEffect(() => {
        initializeTerminal();

        return () => {
            terminalState.current.unsubscribeCallbacks.forEach(cleanup => cleanup());
            terminalState.current.unsubscribeCallbacks = [];
            terminalState.current.initialized = false;
        };
    }, [initializeTerminal]);

    useEffect(() => {
        const handleResize = () => {
            if (fitAddon.current) {
                fitAddon.current.fit();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (selectedContainer && xterm.current) {
            const setupTerminalOutput = async () => {
                const unlistenTerm = await listen('terminal_stdout', (event) => {
                    if (!xterm.current || !terminalState.current.expectingOutput) return;
                    console.log("payload", event.payload)
                    const lines = event.payload.split(/\n/);
                    console.log("lines", lines)
                    lines.forEach(l => {
                        xterm.current.write(`\r\n${l}\r`);
                    });
                    showPrompt();
                });

                terminalState.current.unsubscribeCallbacks.push(() => unlistenTerm());
            };

            setupTerminalOutput();
        }
    }, [selectedContainer, showPrompt]);

    return (
        <div style={{height: '100%', width: '100%', overflow: 'hidden'}} ref={terminalRef}/>
    );
};

export default TerminalComponent;