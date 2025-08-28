import { Container } from '../models/Container';

/**
 * Utility functions for working with Docker Compose containers
 */

export interface ComposeProject {
    name: string;
    containers: Container[];
    runningCount: number;
    totalCount: number;
}

/**
 * Groups containers by Docker Compose project
 */
export function groupContainersByComposeProject(containers: Container[]): {
    composeProjects: ComposeProject[];
    standaloneContainers: Container[];
} {
    const projectMap = new Map<string, Container[]>();
    const standaloneContainers: Container[] = [];

    containers.forEach(container => {
        if (container.isDockerComposeContainer()) {
            const projectName = container.getDockerComposeProject() || 'Unknown Project';
            if (!projectMap.has(projectName)) {
                projectMap.set(projectName, []);
            }
            projectMap.get(projectName)!.push(container);
        } else {
            standaloneContainers.push(container);
        }
    });

    const composeProjects: ComposeProject[] = Array.from(projectMap.entries()).map(([name, containers]) => ({
        name,
        containers: containers.sort((a, b) => {
            const serviceA = a.getDockerComposeService() || '';
            const serviceB = b.getDockerComposeService() || '';
            return serviceA.localeCompare(serviceB);
        }),
        runningCount: containers.filter(c => c.isRunning()).length,
        totalCount: containers.length
    }));

    // Sort projects by name
    composeProjects.sort((a, b) => a.name.localeCompare(b.name));

    // Sort standalone containers by name
    standaloneContainers.sort((a, b) => a.getName().localeCompare(b.getName()));
    
    return { composeProjects, standaloneContainers };
}

/**
 * Checks if a container name follows Docker Compose naming convention
 */
export function isComposeContainerName(name: string): boolean {
    // Docker Compose containers typically follow the pattern: project_service_number
    const parts = name.split('_');
    return parts.length >= 2 && /^\d+$/.test(parts[parts.length - 1]);
}

/**
 * Extracts project name from Docker Compose container name
 */
export function extractProjectNameFromContainerName(name: string): string | null {
    if (!isComposeContainerName(name)) {
        return null;
    }
    
    const parts = name.split('_');
    // Remove the last part (number) and join the rest
    return parts.slice(0, -1).join('_');
}
