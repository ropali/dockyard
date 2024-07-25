import React from 'react';

import "@patternfly/react-core/dist/styles/base.css";


import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem, Checkbox, ToolbarGroup, Tooltip } from '@patternfly/react-core';

const LogsViewer = ({ logs }) => {
    const [isTextWrapped, setIsTextWrapped] = React.useState(false);


    const rightAlignedToolbarGroup = (
        <React.Fragment>
            <ToolbarGroup variant="icon-button-group">
                <ToolbarItem alignSelf='center' spacer="spacerLg">
                    <Checkbox
                        label="Wrap text"
                        aria-label="wrap text checkbox"
                        isChecked={isTextWrapped}
                        id="wrap-text-checkbox"
                        onChange={(_event, value) => setIsTextWrapped(value)}
                        className="rounded"
                    />
                </ToolbarItem>

            </ToolbarGroup>
        </React.Fragment>
    );


    return (
        <LogViewer
            data={logs.join("\n")}
            theme="dark"
            isTextWrapped={isTextWrapped}
            height="100%"
            scrollToRow={logs.length}
            toolbar={
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarItem>
                            <LogViewerSearch placeholder="Search" className="text-black" />
                        </ToolbarItem>
                        <ToolbarGroup align={{ default: 'alignRight' }}>{rightAlignedToolbarGroup}</ToolbarGroup>

                    </ToolbarContent>
                </Toolbar>
            }
        />
    );
};

export default LogsViewer;