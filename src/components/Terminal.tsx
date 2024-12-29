import React, {useCallback, useEffect, useRef} from 'react';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../state/ContainerContext";
import {listen} from "@tauri-apps/api/event";

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
        expectingOutput: false
    });

    const showPrompt = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write(`\r\n${promptSymbol}`);
        terminalState.current.cursorPosition = 0;
        terminalState.current.buffer = '';
        terminalState.current.historyPosition = -1;
        terminalState.current.expectingOutput = false;
    }, []);

    const redrawLine = useCallback(() => {
        if (!xterm.current) return;
        xterm.current.write('\r' + ' '.repeat(promptSymbol.length + terminalState.current.buffer.length));
        xterm.current.write('\r' + promptSymbol + terminalState.current.buffer);
        const moveBack = terminalState.current.buffer.length - terminalState.current.cursorPosition;
        if (moveBack > 0) {
            xterm.current.write('\x1b['.concat(moveBack.toString(), 'D'));
        }
    }, []);

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
        if (!terminalRef.current || terminalState.current.initialized) return;

        xterm.current = new Terminal(TERMINAL_CONFIG);

        xterm.current.loadAddon(fitAddon.current);
        xterm.current.open(terminalRef.current);
        fitAddon.current.fit();
        showPrompt();

        const handleData = async (data: string) => {
            const code = data.charCodeAt(0);

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

            if (code === KEY_CODES.ENTER) {
                const command = terminalState.current.buffer.trim();
                if (command.length > 0) {
                    xterm.current!.write('\r\n');
                    await executeCommand(command);
                } else {
                    showPrompt();
                }
            } else if (code === KEY_CODES.BACKSPACE) {
                if (terminalState.current.cursorPosition > 0) {
                    const start = terminalState.current.buffer.slice(0, terminalState.current.cursorPosition - 1);
                    const end = terminalState.current.buffer.slice(terminalState.current.cursorPosition);
                    terminalState.current.buffer = start + end;
                    terminalState.current.cursorPosition--;
                    redrawLine();
                }
            } else if (data.length === 1) {
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

    const setupTerminalOutput = async () => {
        const unlistenTerm = await listen('terminal_stdout', (event: any) => {
            if (!xterm.current || !terminalState.current.expectingOutput) return;

            xterm.current.write('\r\n');
            const output = event.payload.replace(/\n/g, '\r\n');

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