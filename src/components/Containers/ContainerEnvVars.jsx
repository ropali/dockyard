import React, {useEffect, useState} from 'react';
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../../state/ContainerContext.jsx";

const ContainerEnvVars = () => {
    const {selectedContainer} = useContainers();

    const [envVars, setEnvVars] = useState({})


    function getInfo() {
        invoke('fetch_container_info', {cId: selectedContainer.Id}).then((info) => {
            let envVars = info?.Config?.Env;

            let envObj = {}

            envVars.forEach(envVar => {
                let keyVal = envVar.split("=")
                envObj[keyVal[0]] = keyVal[1]
            })
            setEnvVars(envObj)

        }).catch((error) => {
            console.error("Error fetching container info:", error);
        });
    }

    useEffect(() => {
        getInfo()
    }, [selectedContainer]);


    return (
        <div className="overflow-x-auto h-full">
            <table className="table table-sm w-full bg-base-100 text-base">
                <thead>
                <tr>
                    <th>VARIABLE</th>
                    <th>VALUE</th>

                </tr>
                </thead>
                <tbody>
                {envVars && Object.entries(envVars).map(([key, value]) => (
                    <tr key={key} className="text-base-content">
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerEnvVars;
