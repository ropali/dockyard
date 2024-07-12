import React from 'react';

import { IconBxsTachometer, IconContainerTwentyFour, IconStack2, IconDatabaseCheckOutline, IconServerNetworkAlt, IconDocker, IconBxCog } from "../icons"

function Sidebar() {
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
                className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
              >
                <IconBxsTachometer className="size-5 opacity-75" />

                <span
                  className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Dashboard
                </span>
              </a>
            </div>

            <ul className="space-y-1 border-t border-gray-100 pt-4">
              <li>
                <a
                  href="#"
                  className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >


                  <IconContainerTwentyFour className="size-5 opacity-75" />

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
                  className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >

                  <IconStack2 className="size-5 opacity-75" />
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
                  className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  <IconDatabaseCheckOutline className="size-5 opacity-75" />

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
                  className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  

                  <IconServerNetworkAlt className="size-5 opacity-75"/>

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

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
        <div className="py-4">
          <a
            href="#"
            className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
          >
            

            <IconBxCog className="size-5 opacity-75"/>

            <span
              className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              Settings
            </span>
          </a>
        </div>
        <form action="#" className="border-t">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <IconDocker className="size-5 opacity-75"/>

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
