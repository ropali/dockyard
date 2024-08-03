import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconBxsTachometer, IconContainerTwentyFour, IconStack2, IconDatabaseCheckOutline, IconServerNetworkAlt, IconDocker, IconBxCog } from "../Icons";

function Sidebar() {
  const location = useLocation();

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
              <Link
                to="/dashboard"
                className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/dashboard' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
              >
                <IconBxsTachometer className="size-6 opacity-75" />

                <span
                  className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Dashboard
                </span>
              </Link>
            </div>

            <ul className="space-y-4 border-t border-gray-100 pt-4">
              <li>
                <Link
                  to="/"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                >
                  <IconContainerTwentyFour className="size-6 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible index-1111"
                  >
                    Containers
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/images"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/images' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                >
                  <IconStack2 className="size-7 opacity-75" />
                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Images
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/volumes"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/volumes' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                >
                  <IconDatabaseCheckOutline className="size-7 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Volumes
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/networks"
                  className={`group relative flex justify-center rounded px-2 py-1.5 ${location.pathname === '/networks' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'}`}
                >
                  <IconServerNetworkAlt className="size-7 opacity-75" />

                  <span
                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Networks
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 bg-white p-2">
        <div className="py-4 border-t border-gray-100">
          <Link
            to="/settings"
            className="group relative flex justify-center rounded px-2 py-1.5"
          >
            <IconBxCog className="size-5 opacity-75" />

            <span
              className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              Settings
            </span>
          </Link>
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