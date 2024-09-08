import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    IconBxCog,
    IconContainerTwentyFour,
    IconDatabaseCheckOutline,
    IconDocker,
    IconServerNetworkAlt,
    IconStack2
} from "../Icons";
import Version from "./Version.jsx";

function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-screen w-16 flex-col justify-between bg-base-100 z-50">
            <div>
                <div className="inline-flex size-16 items-center justify-center">
          <span className="grid size-10 place-content-center rounded-lg tooltip tooltip-right hover:tooltip-open"
                data-tip="Dockyard - Beatiful, Simple & Fast Docker Client">
            <img src="/logo.png" alt="" srcSet=""/>
          </span>
                </div>

                <div className="border-t border-base-300">
                    <div className="px-2">
                        <ul className="space-y-4 border-base-300 pt-4">
                            <li>
                                <Link
                                    to="/"
                                    className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/' ? 'text-base-content bg-base-200' : 'text-gray-500'} tooltip tooltip-right hover:tooltip-open`}
                                    data-tip="Containers"
                                >
                                    <IconContainerTwentyFour className="size-6 opacity-75"/>

                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/images"
                                    className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/images' ? 'text-base-content bg-base-200' : 'text-gray-500'} tooltip tooltip-right hover:tooltip-open`}
                                    data-tip="Images"
                                >
                                    <IconStack2 className="size-7 opacity-75"/>

                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/volumes"
                                    className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/volumes' ? 'text-base-content bg-base-200' : 'text-gray-500'} tooltip tooltip-right hover:tooltip-open`}
                                    data-tip="Volumes"
                                >
                                    <IconDatabaseCheckOutline className="size-7 opacity-75"/>

                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/networks"
                                    className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/networks' ? 'text-base-content bg-base-200' : 'text-gray-500'} tooltip tooltip-right hover:tooltip-open`}
                                    data-tip="Networks"
                                >
                                    <IconServerNetworkAlt className="size-7 opacity-75"/>

                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="sticky inset-x-0 bottom-0 bg-base-100 p-2">
                <div className="py-4 border-t border-base-300">
                    <Link
                        to="/settings"
                        className="group relative flex justify-center rounded px-2 py-1.5 tooltip tooltip-right hover:tooltip-open"
                        data-tip="Settings"
                    >
                        <IconBxCog className="size-5 opacity-75"/>

                    </Link>
                </div>
                <Version/>
            </div>
        </div>
    );
}

export default Sidebar;