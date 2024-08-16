

const ContainerCard = ({ container, onClick, isSelected }) => {
    const statusColor = container.Status.includes("Exited") ? 'bg-red-500' : 'bg-green-500';

    return (
        <div
            className={
                `p-2 bg-base-100 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-2 relative 
                ${isSelected ? 'border-l-4 border-base-content' : ''}`
            }
            onClick={onClick}
        >
            <div className="flex items-center mb-1">
                <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
                <h1 className="text-sm font-semibold">{container.Names[0].slice(1)}</h1>
            </div>
            <div className="mb-1">
                <p className="text-xs ">
                    <span className="font-medium">ID:</span> {container.Id.slice(0, 7)}
                </p>
                <p className="text-xs ">
                    <span className="font-medium">Image:</span> {container.Image.split(':')[0]}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-xs ">
                    <span className="font-medium">Status:</span> {container.Status.split(' ')[0]}
                </p>
                {container.Ports && container.Ports.length > 0 && (
                    <p className="text-xs ">
                        <span className="font-medium">Ports:</span> {container.Ports[0].PublicPort} &rarr; {container.Ports[0].PrivatePort}
                    </p>
                )}
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
};

export default ContainerCard;