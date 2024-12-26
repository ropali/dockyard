import React, { useEffect, useState, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
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
    const [envVars, setEnvVars] = useState<EnvVars>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const getInfo = async () => {
        if (!selectedContainer) return;

        try {
            setIsLoading(true);
            setError(null);
            const info = await invoke<ContainerInfo>('fetch_container_info', { cId: selectedContainer.Id });
            const envVars = info?.Config?.Env ?? [];

            const envObj: EnvVars = {};
            envVars.forEach((envVar) => {
                const [key, value] = envVar.split('=');
                envObj[key] = value;
            });

            setEnvVars(envObj);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch container info');
            console.error('Error fetching container info:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEnvVars = useMemo(() => {
        const entries = Object.entries(envVars);
        if (!searchQuery) return entries;

        return entries.filter(([key, value]) => 
            key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            value.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [envVars, searchQuery]);

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    useEffect(() => {
        getInfo();
    }, [selectedContainer]);

    if (!selectedContainer) {
        return (
            <div className="flex items-center justify-center h-full text-base-content/60">
                <p>Select a container to view environment variables</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-error">
                <p>Error: {error}</p>
                <button className="btn btn-primary mt-4" onClick={getInfo}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search environment variables..."
                    className="input input-bordered w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                ) : filteredEnvVars.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-base-content/60">
                        <p>{searchQuery ? 'No matching environment variables found' : 'No environment variables'}</p>
                    </div>
                ) : (
                    <table className="table table-sm w-full bg-base-100 text-base">
                        <thead>
                            <tr>
                                <th>VARIABLE</th>
                                <th>VALUE</th>
                                <th className="w-20">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnvVars.map(([key, value]) => (
                                <tr key={key} className="text-base-content hover">
                                    <td>{key}</td>
                                    <td>{value}</td>
                                    <td>
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => copyToClipboard(`${key}=${value}`, key)}
                                        >
                                            {copiedKey === key ? 'Copied!' : 'Copy'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ContainerEnvVars;
