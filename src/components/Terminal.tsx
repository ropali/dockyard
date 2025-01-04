import React, {useCallback, useEffect, useRef} from 'react';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../state/ContainerContext";
import {listen} from "@tauri-apps/api/event";
import { debounce } from '../utils';

interface TerminalState {
    initialized: boolean;
    buffer: string;
    cursorPosition: number;
    promptLength: number;
    history: string[];
    historyPosition: number;
    unsubscribeCallbacks: (() => void)[];
    expectingOutput: boolean;
}

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

const TerminalComponent: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal | null>(null);
    const fitAddon = useRef(new FitAddon());
    const {selectedContainer} = useContainers();
    const promptSymbol = '>>> ';

    const terminalState = useRef<TerminalState>({
        initialized: false,
        buffer: '',
        cursorPosition: 0,
        promptLength: promptSymbol.length,
        history: [],
        historyPosition: -1,
        unsubscribeCallbacks: [],
        expectingOutput: false,
    });
    

    
    const showPrompt = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write(`\r\n${promptSymbol}`);
        terminalState.current.cursorPosition = 0;
        terminalState.current.buffer = '';
        terminalState.current.historyPosition = -1;
        terminalState.current.expectingOutput = false;
    }, []);



    /**
     * Redraws the current line in the terminal with the prompt symbol and buffer content.
     * This function handles:
     * 1. Clearing the current line
     * 2. Writing the prompt symbol and buffer content
     * 3. Adjusting cursor position
     * 
     * @remarks
     * The function uses ANSI escape sequences for cursor movement:
     * - '\r' moves cursor to start of line
     * - '\x1b[nD' moves cursor back n positions
     * 
     * @returns void
     * @throws Nothing
     */
    const redrawLine = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write('\r' + ' '.repeat(promptSymbol.length + terminalState.current.buffer.length));
        xterm.current.write('\r' + promptSymbol + terminalState.current.buffer);
        const moveBack = terminalState.current.buffer.length - terminalState.current.cursorPosition;
        if (moveBack > 0) {
            xterm.current.write('\x1b['.concat(moveBack.toString(), 'D'));
        }
    }, []);

    

    /**
     * Finds the boundary of a word in the given text based on the current position and direction.
     * When moving left, it finds the start of the current/previous word.
     * When moving right, it finds the end of the current/next word.
     * 
     * @param text - The input text string to search within
     * @param position - The current cursor position in the text
     * @param direction - The direction to search ('left' or 'right')
     * @returns The new position at the word boundary
     * 
     * @example
     * // Moving left
     * findWordBoundary("hello world", 7, 'left') // returns 6 (start of "world")
     * 
     * // Moving right 
     * findWordBoundary("hello world", 0, 'right') // returns 5 (end of "hello")
     */
    const findWordBoundary = useCallback((text: string, position: number, direction: 'left' | 'right'): number => {
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




    /**
     * Executes a command in the selected container's terminal.
     * 
     * @param cmd - The command string to be executed in the container
     * @returns Promise<void>
     * 
     * @remarks
     * This function handles command execution in an xterm terminal instance for a Docker container.
     * It maintains a command history and manages terminal state during command execution.
     * 
     * The function performs the following:
     * - Validates terminal and container existence
     * - Adds unique commands to history
     * - Sets terminal to expect output
     * - Invokes command execution in container
     * - Handles errors and displays them in terminal
     * - Shows prompt after execution
     * 
     * @throws Will throw and display errors from command execution in the terminal
     * 
     * @requires
     * - Active xterm.current instance
     * - Selected container
     * - invoke function for container command execution
     */
    const executeCommand = useCallback(async (cmd: string) => {
        if (!xterm.current || !selectedContainer) return;
        console.log("X", cmd)
        try {
            if (cmd.trim() && (terminalState.current.history.length === 0 ||
                terminalState.current.history[terminalState.current.history.length - 1] !== cmd)) {
                terminalState.current.history.push(cmd);
            }

            terminalState.current.expectingOutput = true;

            await invoke("exec", {
                cName: selectedContainer.getName(),
                command: cmd
            });

            showPrompt();

        } catch (e: any) {
            terminalState.current.expectingOutput = false;
            xterm.current.write(`\r\nError: ${e.message}\r\n`);
            showPrompt();
        }
    }, [selectedContainer, showPrompt]);

    /**
     * Handles navigation through command history using up and down arrow keys
     * @param direction - Direction of history navigation ('up' or 'down')
     * 
     * The function manages terminal command history navigation:
     * - For 'up' direction:
     *   - If not in history (-1), moves to most recent command
     *   - Otherwise moves to previous command if available
     * - For 'down' direction:
     *   - Moves to next command if available
     *   - Resets to empty input (-1) if at end of history
     * 
     * Updates the terminal buffer with selected historical command
     * and adjusts cursor position accordingly
     */
    const handleHistory = useCallback((direction: 'up' | 'down') => {
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
        // If the terminal reference or terminal state is not initialized, return
        if (!terminalRef.current || terminalState.current.initialized) return;

        // Create a new Terminal instance with the specified configuration
        xterm.current = new Terminal(TERMINAL_CONFIG);

        // Load the fit addon and open the terminal in the referenced div
        xterm.current.loadAddon(fitAddon.current);
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
        showPrompt();

        // Handle data input from the terminal
        const handleData = async (data: string) => {
            const code = data.charCodeAt(0);

            // Handle escape sequences for arrow keys and other special keys
            if (data.length > 1) {
                switch (data) {
                    case ESCAPE_SEQUENCES.RIGHT_ARROW:
                        if (terminalState.current.cursorPosition < terminalState.current.buffer.length) {
                            terminalState.current.cursorPosition++;
                            xterm.current!.write(data);
                        }
                        return;
                    case ESCAPE_SEQUENCES.LEFT_ARROW:
                        if (terminalState.current.cursorPosition > 0) {
                            terminalState.current.cursorPosition--;
                            xterm.current!.write(data);
                        }
                        return;
                    case ESCAPE_SEQUENCES.UP_ARROW:
                        handleHistory('up');
                        return;
                    case ESCAPE_SEQUENCES.DOWN_ARROW:
                        handleHistory('down');
                        return;
                    case ESCAPE_SEQUENCES.HOME[0]:
                    case ESCAPE_SEQUENCES.HOME[1]:
                        terminalState.current.cursorPosition = 0;
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.END[0]:
                    case ESCAPE_SEQUENCES.END[1]:
                        terminalState.current.cursorPosition = terminalState.current.buffer.length;
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.CTRL_LEFT:
                        terminalState.current.cursorPosition = findWordBoundary(
                            terminalState.current.buffer,
                            terminalState.current.cursorPosition,
                            'right'
                        );
                        redrawLine();
                        return;
                    case ESCAPE_SEQUENCES.CTRL_RIGHT:
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
                const command = terminalState.current.buffer.trim();
                if (command.length > 0) {
                    xterm.current!.write('\r\n');
                    await executeCommand(command);
                } else {
                    showPrompt();
                }
            // Handle Backspace key press
            } else if (code === KEY_CODES.BACKSPACE) {
                if (terminalState.current.cursorPosition > 0) {
                    const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition - 1);
                    const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                    terminalState.current.buffer = start + end;
                    terminalState.current.cursorPosition--;
                    redrawLine();
                }
            // Handle regular character input
            } else if (data.length === 1) {
                const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition);
                const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                terminalState.current.buffer = start + data + end;
                terminalState.current.cursorPosition++;
                redrawLine();
            }
        };

        // Set up the data handler for the terminal
        xterm.current.onData(handleData);
        terminalState.current.initialized = true;

        // Add a cleanup function to the unsubscribe callbacks
        terminalState.current.unsubscribeCallbacks.push(() => {
            if (xterm.current) {
                xterm.current.dispose();
                xterm.current = null;
            }
        });
    }, [showPrompt, redrawLine, handleHistory, findWordBoundary, executeCommand]);


    const resizeTTY = async () => {
        if (!selectedContainer || !xterm.current) return;

        const { cols, rows } = xterm.current;

        console.log("RESIZE", cols, rows)
        
        await invoke('resize_tty', {
            containerName: selectedContainer.getName(),
            width: rows,
            height: cols
        });
    }

    useEffect(() => {
        initializeTerminal();
        resizeTTY();

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
                debounce(resizeTTY, 1000)();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Function to set up terminal output listener
    const setupTerminalOutput = async () => {
        // Listen for 'terminal_stdout' events
        const unlistenTerm = await listen('terminal_stdout', (event: any) => {
            // If terminal is not initialized or not expecting output, return
            if (!xterm.current || !terminalState.current.expectingOutput) return;

            // Write a new line in the terminal
            xterm.current.write('\r\n');
            // Replace newlines with carriage return + newline for proper display
            const output = event.payload.replace(/\n/g, '\r\n');

            // If the output includes the end marker, stop expecting output
            if (output.includes('\n#$')) {
                terminalState.current.expectingOutput = false;
            } else {
                // Otherwise, write the output to the terminal
                xterm.current.write(output);
            }
        });
        // Add the unlisten function to the unsubscribe callbacks
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
