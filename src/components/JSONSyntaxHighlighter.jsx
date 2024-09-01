import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function JSONSyntaxHighlighter({ json }) {
  return (
    <div className={`h-full flex flex-col h-full`}>
      <SyntaxHighlighter
        language="json"
        style={theme}
        className="flex-grow overflow-auto"
        customStyle={{
          margin: 0,
          height: '100%',
        }}
      >
        {JSON.stringify(json, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
}