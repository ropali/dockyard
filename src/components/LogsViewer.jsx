import React, { useState } from 'react';

import "@patternfly/react-core/dist/styles/base.css";
import { IconTextWrap, IconArrowDownCircle, IconArrowUpCircle } from "../Icons";

import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup, Tooltip } from '@patternfly/react-core';

const LogsViewer = ({ logs }) => {
    const [isTextWrapped, setIsTextWrapped] = React.useState(false);
    const [scrollTo, setScrollTo] = useState(0)


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
                        <ToolbarItem>
                            <LogViewerSearch placeholder="Search" className="text-black bg-base-100 border-primary" />
                        </ToolbarItem>
                        <ToolbarGroup align={{ default: 'alignRight' }}>{rightAlignedToolbarGroup}</ToolbarGroup>

                    </ToolbarContent>
                </Toolbar>
            }
        />
    );
};

export default LogsViewer;