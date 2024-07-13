import React, { useState } from 'react';

import { IconBxsTachometer, IconContainerTwentyFour, IconStack2, IconDatabaseCheckOutline, IconServerNetworkAlt, IconDocker, IconBxCog } from "../icons"

function Sidebar() {
  const [selectedIcon, setSelectedIcon] = useState(null); // Initialize selected icon to null

  const handleIconClick = (iconId) => {
    setSelectedIcon(iconId);
  };

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-e bg-white z-50">
      <div>
        <div className="inline-flex size-16 items-center justify-center">
          <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            DD
          </span>
        </div>

        <div className="border-t border-gray-100">
          <div className="px-2">
            <div className="py-4">
              <a
                href="#"
                className={`group relative flex justify-center rounded px-2 py-1.5 ${selectedIcon === 'dashboard' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                onClick={() => handleIconClick('dashboard')}
              >
                <IconBxsTachometer className="size-6 opacity-75" />

                <span
                  className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Dashboard
                </span>
              </a>
            </div>

            <ul className="space-y-4 border-t border-gray-100 pt-4">
              <li>
                <a
                  href="#"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${selectedIcon === 'containers' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                  onClick={() => handleIconClick('containers')}
                >

                  <IconContainerTwentyFour className="size-6 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible index-1111"
                  >
                    Containers
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${selectedIcon === 'images' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                  onClick={() => handleIconClick('images')}
                >

                  <IconStack2 className="size-7 opacity-75" />
                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Images
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${selectedIcon === 'volumes' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                  onClick={() => handleIconClick('volumes')}
                >
                  <IconDatabaseCheckOutline className="size-7 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >

                    Volumes
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${selectedIcon === 'networks' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                  onClick={() => handleIconClick('networks')}
                >


                  <IconServerNetworkAlt className="size-7 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Networks
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 bg-white p-2">
        <div className="py-4 border-t border-gray-100">
          <a
            href="#"
            className="group relative flex justify-center rounded px-2 py-1.5 "
          >

            <IconBxCog className="size-5 opacity-75" />

            <span
              className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              Settings
            </span>
          </a>
        </div>
        <form action="#" className="border-t border-gray-100 p-1">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <IconDocker className="size-5 opacity-75" fill="#197534" />

            <span
              className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              Online
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sidebar;
