import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useContainers } from '../../state/ContainerContext';

interface EnvVars {
    [key: string]: string
}

interface ContainerInfo {
    Config?: {
        Env?: string[];
    };
    Id?: string;
}

const ContainerEnvVars = () => {
    const { selectedContainer } = useContainers();

    const [envVars, setEnvVars] = useState<EnvVars>({} as EnvVars);

    const getInfo = () => {
        invoke<ContainerInfo>('fetch_container_info', { cId: selectedContainer?.Id })
            .then((info) => {
                const envVars = info?.Config?.Env ?? [];

                const envObj: EnvVars = {};

                envVars.forEach((envVar) => {
                    const [key, value] = envVar.split('=');
                    envObj[key] = value;
                });

                setEnvVars(envObj);
            })
            .catch((error) => {
                console.error('Error fetching container info:', error);
            });
    };

    useEffect(() => {
        getInfo();
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
