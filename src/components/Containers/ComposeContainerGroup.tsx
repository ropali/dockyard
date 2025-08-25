import React, { useState } from 'react';
import { Container } from '../../models/Container';
import { ComposeProject } from '../../utils/docker-compose';

interface ComposeContainerGroupProps {
    project: ComposeProject;
    onContainerSelect: (container: Container) => void;
    selectedContainer: Container | null;
}

// Smaller variant of ContainerCard for child containers
const SmallContainerCard = ({ container, onClick, isSelected }: {
    container: Container;
    onClick: () => void;
    isSelected: boolean;
}) => {
    const statusColor = !container.isRunning() ? 'bg-red-500' : 'bg-green-500';
    const isComposeContainer = container.isDockerComposeContainer();
    const composeService = container.getDockerComposeService();

    return (
        <div
            className={
                `p-1.5 bg-base-100 shadow-sm rounded-md hover:shadow-md transition-shadow duration-300 cursor-pointer mb-1.5 relative 
                ${isSelected ? 'border-l-2 border-base-content' : ''}`
            }
            onClick={onClick}
        >
            <div className="flex items-center mb-1">
                <div className={`w-2 h-2 rounded-full ${statusColor} mr-1.5`}></div>
                <div className="flex-1">
                    <h1 className="text-xs font-semibold">{container.getName()}</h1>
                    {isComposeContainer && composeService && (
                        <p className="text-xs text-blue-600 font-medium">{composeService}</p>
                    )}
                </div>
            </div>
            <div className="mb-1 mr-3">
                <p className="text-xs">
                    <span className="font-medium">ID:</span> {container.Id.slice(0, 7)}
                </p>
                <p className="text-xs truncate" title={container.getImageName()}>
                    <span className="font-medium">Image:</span> {container.getImageName()}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-xs">
                    <span className="font-medium">Status:</span> {container.Status.split(' ')[0]}
                </p>
                {container.Ports && container.Ports.length > 0 && container.Ports[0].PublicPort && (
                    <p className="text-xs">
                        <span className="font-medium">Ports:</span> {container.Ports[0].PublicPort} &rarr; {container.Ports[0].PrivatePort}
                    </p>
                )}
            </div>
            <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
};

const ComposeContainerGroup = ({ 
    project, 
    onContainerSelect, 
    selectedContainer
}: ComposeContainerGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4">
            <div 
                className="p-2 bg-base-100 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-2 relative"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <h1 className="text-sm font-semibold">{project.name}</h1>
                </div>
                <div className="mb-1 mr-4">
                    <p className="text-xs">
                        <span className="font-medium">Project:</span> {project.name}
                    </p>
                    <p className="text-xs">
                        <span className="font-medium">Status:</span> {project.runningCount}/{project.totalCount} containers running
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs">
                        <span className="font-medium">Type:</span> Docker Compose
                    </p>
                    <p className="text-xs">
                        <span className="font-medium">Services:</span> {project.containers.length}
                    </p>
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <svg 
                        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            
            {isExpanded && (
                <div className="space-y-1.5 ml-2">
                    {project.containers.map((container) => (
                        <SmallContainerCard
                            key={container.Id}
                            container={container}
                            onClick={() => onContainerSelect(container)}
                            isSelected={selectedContainer?.Id === container.Id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComposeContainerGroup;
