import React from 'react';
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {nord as theme} from 'react-syntax-highlighter/dist/esm/styles/prism';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Register the JSON language
SyntaxHighlighter.registerLanguage('json', json);

export interface JSONSyntaxHighlighterProps {
    id: string;
    json: string;
}

const SyntaxHighlighterComponent = SyntaxHighlighter as any;

export default function JSONSyntaxHighlighter({json}: JSONSyntaxHighlighterProps) {
    return (
        <div className="h-full flex flex-col">
            <SyntaxHighlighterComponent
                language="json"
                style={theme}
                className="flex-grow overflow-auto"
                customStyle={{
                    margin: 0,
                    height: '100%',
                }}
            >
                {JSON.stringify(json, null, 2)}
            </SyntaxHighlighterComponent>
        </div>
    );
}