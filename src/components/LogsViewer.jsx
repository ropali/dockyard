import React, { useState } from 'react';

import "@patternfly/react-core/dist/styles/base.css";
import { IconArrowDownCircleFill, IconArrowUpCircleFill } from "../Icons";

import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup, Tooltip } from '@patternfly/react-core';

const LogsViewer = ({ logs }) => {
    const [isTextWrapped, setIsTextWrapped] = React.useState(false);
    const [scrollTo, setScrollTo] = useState(0)


    const rightAlignedToolbarGroup = (
        <React.Fragment>
            <ToolbarGroup variant="icon-button-group">
                <ToolbarItem alignSelf='center' spacer="spacerLg">
                    <Tooltip position="left" content={"Scroll To Top"}>
                        <div className="form-control mr-2">
                            <label className="label cursor-pointer" onClick={() => { setScrollTo(1) }}>

                                <IconArrowUpCircleFill className="size-6" fill="#000000" />
                            </label>
                        </div>

                    </Tooltip>

                </ToolbarItem>

                <ToolbarItem alignSelf='center' spacer="spacerLg">
                    <Tooltip position="left" content={"Scroll To Bottom"}>
                        <div className="form-control mr-2">
                            <label className="label cursor-pointer" onClick={() => { setScrollTo(logs.length) }}>

                                <IconArrowDownCircleFill className="size-6" fill="#000000" />
                            </label>
                        </div>

                    </Tooltip>

                </ToolbarItem>

                <ToolbarItem alignSelf='center' spacer="spacerLg">
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text mr-2">Wrap Text</span>
                            <input
                                type="checkbox"
                                checked={isTextWrapped}
                                className="checkbox checkbox-primary checkbox-xs"
                                onChange={(_event, value) => setIsTextWrapped(!isTextWrapped)}
                            />
                        </label>
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