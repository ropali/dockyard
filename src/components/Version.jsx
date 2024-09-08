import {IconDocker} from "../Icons/index.jsx";
import React, {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api";

export default function Version() {

    const [version, setVersion] = useState("")

    useEffect(() => {
        invoke('get_version').then((res) => {
            console.log(res)
            setVersion("Version " + res["Version"]);
        });
    }, []);

    return (
        <form action="#" className="border-t border-base-300">
            <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500  hover:text-gray-700 tooltip tooltip-right hover:tooltip-open"
                data-tip={`Online - ${version}`}
            >
                <IconDocker className="size-6 opacity-75 mt-2 mb-2" fill="#197534"/>
            </button>
        </form>
    )
}