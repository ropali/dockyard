import React, { useState } from 'react';

import "@patternfly/react-core/dist/styles/base.css";
import { IconTextWrap, IconArrowDownCircle, IconArrowUpCircle } from "../Icons/index.tsx";

import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup } from '@patternfly/react-core';

interface LogsViewerProps {
    logs: string[];
}

const LogsViewer = ({ logs }: LogsViewerProps) => {
    const [isTextWrapped, setIsTextWrapped] = React.useState(false);
    const [scrollTo, setScrollTo] = useState(0);


    const rightAlignedToolbarGroup = (
        <React.Fragment>
            <ToolbarGroup variant="icon-button-group" className='bg-base-100'>
                <ToolbarItem alignSelf='center' spacer="spacerLg">
                    <div className="join">
                        <button
                            className="btn btn-sm join-item tooltip tooltip-left hover:tooltip-open" data-tip="Scroll To Bottom"
                            onClick={() => setScrollTo(logs.length)}
                        >
                            <IconArrowDownCircle />
                        </button>
                        <button
                            className="btn btn-sm join-item tooltip tooltip-left hover:tooltip-open" data-tip="Scroll To Top"
                            onClick={() => setScrollTo(1)}
                        >
                            <IconArrowUpCircle />
                        </button>
                        <button className={`btn btn-sm join-item tooltip tooltip-left hover:tooltip-open ${isTextWrapped ? 'btn-primary' : ''}`} data-tip={isTextWrapped ? "Unwrap Text" : "Wrap Text"}
                            onClick={() => setIsTextWrapped(!isTextWrapped)}
                        >
                            <IconTextWrap />
                        </button>
                    </div>

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
            scrollToRow={scrollTo}
            toolbar={
                <Toolbar>
                    <ToolbarContent className='bg-base-100'>
                        <ToolbarItem className='border-base-content'>
                            <LogViewerSearch placeholder="Search" className="text-base-content bg-base-100 border-base-content" />
                        </ToolbarItem>
                        <ToolbarGroup align={{ default: 'alignRight' }}>{rightAlignedToolbarGroup}</ToolbarGroup>

                    </ToolbarContent>
                </Toolbar>
            }
        />
    );
};

export default LogsViewer;