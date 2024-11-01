import React, {useCallback, useEffect, useRef} from 'react';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../state/ContainerContext.jsx";
import {listen} from "@tauri-apps/api/event";


const TERMINAL_CONFIG = {
    cursorBlink: true,
    fontSize: 16,
    fontFamily: '"Fira Mono", monospace',
    rows: 24,
    cols: 80,
    scrollback: 1000
};

const KEY_CODES = {
    ENTER: 13,
    BACKSPACE: 127
};

const ESCAPE_SEQUENCES = {
    RIGHT_ARROW: '\x1b[C',
    LEFT_ARROW: '\x1b[D',
    UP_ARROW: '\x1b[A',
    DOWN_ARROW: '\x1b[B',
    HOME: ['\x1b[H', '\x1bOH'],
    END: ['\x1b[F', '\x1bOF'],
    CTRL_RIGHT: '\x1b[1;5C',
    CTRL_LEFT: '\x1b[1;5D'
};

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

    // Helper function to find word boundaries when moving the cursor left/right with CTRL
    const findWordBoundary = useCallback((text, position, direction) => {
        if (direction === 'left') {
            // If already at start, return start position
            if (position === 0) return 0;

            // Start from one position left of cursor
            let newPos = position - 1;

            // Skip any whitespace characters moving left
            while (newPos > 0 && /\s/.test(text[newPos])) newPos--;

            // Skip any non-whitespace characters moving left
            // This gets us to the start of the current word
            while (newPos > 0 && !/\s/.test(text[newPos - 1])) newPos--;

            return newPos;
        } else {
            // If already at end, return end position 
            if (position === text.length) return text.length;

            let newPos = position;

            // Skip any whitespace characters moving right
            while (newPos < text.length && /\s/.test(text[newPos])) newPos++;

            // Skip any non-whitespace characters moving right
            // This gets us to the end of the current word
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

            showPrompt();

        } catch (e) {
            terminalState.current.expectingOutput = false;  // Reset flag on error
            xterm.current.write(`\r\nError: ${e.message}\r\n`);
            showPrompt();
        }
    }, [selectedContainer, showPrompt]);

    // Handles navigation through command history using up/down arrows
    const handleHistory = useCallback((direction) => {
        // If there's no command history, do nothing
        if (terminalState.current.history.length === 0) return;

        if (direction === 'up') {
            // If we're at the current command (position -1), go to most recent history item
            if (terminalState.current.historyPosition === -1) {
                terminalState.current.historyPosition = terminalState.current.history.length - 1;
            }
            // Otherwise move up in history if we're not at the oldest command
            else if (terminalState.current.historyPosition > 0) {
                terminalState.current.historyPosition--;
            }
        } else if (direction === 'down') {
            // Move down in history if we're not at the most recent command
            if (terminalState.current.historyPosition < terminalState.current.history.length - 1) {
                terminalState.current.historyPosition++;
            }
            // If we're at the most recent command, go back to empty current command
            else {
                terminalState.current.historyPosition = -1;
            }
        }

        // Update the terminal buffer with either:
        // - Empty string if we're back at current command (position -1)
        // - Or the historical command at current position
        terminalState.current.buffer = terminalState.current.historyPosition === -1
            ? ''
            : terminalState.current.history[terminalState.current.historyPosition];

        // Move cursor to end of command
        terminalState.current.cursorPosition = terminalState.current.buffer.length;

        // Redraw the terminal line to show the new command
        redrawLine();
    }, [redrawLine]);

    const initializeTerminal = useCallback(() => {
        if (!terminalRef.current || terminalState.current.initialized) return;

        xterm.current = new Terminal(TERMINAL_CONFIG);

        xterm.current.loadAddon(fitAddon.current);
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
        showPrompt();

        const handleData = async (data) => {
            const code = data.charCodeAt(0);

            if (data.length > 1) {
                switch (data) {
                    case ESCAPE_SEQUENCES.RIGHT_ARROW: // Right arrow
                        if (terminalState.current.cursorPosition < terminalState.current.buffer.length) {
                            terminalState.current.cursorPosition++;
                            xterm.current.write(data);
                        }
                        return;
                    case ESCAPE_SEQUENCES.LEFT_ARROW: // Left arrow
                        if (terminalState.current.cursorPosition > 0) {
                            terminalState.current.cursorPosition--;
                            xterm.current.write(data);
                        }
                        return;
                    case ESCAPE_SEQUENCES.UP_ARROW: // Up arrow
                        handleHistory('up');
                        return;
                    case ESCAPE_SEQUENCES.DOWN_ARROW: // Down arrow
                        handleHistory('down');
                        return;
                    case ESCAPE_SEQUENCES.HOME[0]: // Home key
                    case ESCAPE_SEQUENCES.HOME[1]:
                        terminalState.current.cursorPosition = 0;
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.END[0]: // End key
                    case ESCAPE_SEQUENCES.END[1]:
                        terminalState.current.cursorPosition = terminalState.current.buffer.length;
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.CTRL_LEFT: // Ctrl + Right
                        terminalState.current.cursorPosition = findWordBoundary(
                            terminalState.current.buffer,
                            terminalState.current.cursorPosition,
                            'right'
                        );
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.CTRL_RIGHT: // Ctrl + Left
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

            // Handle Enter key press
            if (code === KEY_CODES.ENTER) {
                // Get the trimmed command from the current buffer
                const command = terminalState.current.buffer.trim();
                if (command.length > 0) {
                    // If command exists, write a newline and execute it
                    xterm.current.write('\r\n');
                    await executeCommand(command);
                } else {
                    // If empty command, just show the prompt again
                    showPrompt();
                }
            } else if (code === KEY_CODES.BACKSPACE) {
                // Only handle backspace if we're not at the start of the line
                if (terminalState.current.cursorPosition > 0) {
                    // Split buffer into before and after cursor
                    const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition - 1);
                    const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                    // Remove one character by joining buffer without it
                    terminalState.current.buffer = start + end;
                    // Move cursor back one position
                    terminalState.current.cursorPosition--;
                    // Redraw the line to show the change
                    redrawLine();
                }
            } else if (data.length === 1) {
                // Handle single character input (regular typing)
                // Split buffer at cursor position
                const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition);
                const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                // Insert new character at cursor position
                terminalState.current.buffer = start + data + end;
                // Move cursor forward
                terminalState.current.cursorPosition++;
                // Redraw line to show the new character
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

    const setupTerminalOutput = async () => {
        const unlistenTerm = await listen('terminal_stdout', (event) => {
            if (!xterm.current || !terminalState.current.expectingOutput) return;

            // First write a new line to ensure clean output
            xterm.current.write('\r\n');

            // Write the output
            const output = event.payload.replace(/\n/g, '\r\n');

            // Check if this is the end of command output
            if (output.includes('\n#$')) {
                terminalState.current.expectingOutput = false;
            } else {
                xterm.current.write(output);
            }
        });
        terminalState.current.unsubscribeCallbacks.push(() => unlistenTerm());
    };

    useEffect(() => {
        if (selectedContainer && xterm.current) {
            setupTerminalOutput();
        }
    }, [selectedContainer, showPrompt]);

    return (
        <div style={{height: '100%', width: '100%', overflow: 'hidden'}} ref={terminalRef}/>
    );
};

export default TerminalComponent;