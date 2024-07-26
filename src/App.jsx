import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DetailsPanel from './components/DetailsPanel';
import ContainersList from './components/Containers/ContainersList';
import { invoke } from '@tauri-apps/api/tauri'



function App() {
  const [containers, setContainers] = useState([])
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [containerFilter, setContainerFilter] = useState("all");

  const filteredContainers = containers.filter(container => {
    const matchesSearchQuery = container.Names[0].toLowerCase().includes(searchQuery.toLowerCase());
    console.log("--CC", container.Status);
    let matchesFilter;
  
    switch (containerFilter.toLowerCase()) {
      case 'all':
        matchesFilter = true;
        break;
      case 'running':
        matchesFilter = container.Status.toLowerCase().includes('up');
        break;
      case 'stopped':
        matchesFilter = !container.Status.toLowerCase().includes('up');
        break;
      default:
        matchesFilter = true;
    }
  
    return matchesSearchQuery && matchesFilter;
  });


  useEffect(() => {

    invoke('fetch_containers').then((containers) => {
      setContainers(containers)
    })


  }, [])


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <main className="flex p-5 bg-gray-100 flex-1 overflow-hidden mb-2">
          <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
              <ContainersList
                containers={filteredContainers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                
                onContainerClick={setSelectedContainer}
                onContainerFilterChange={(value) => setContainerFilter(value)}
              />
            </div>
            <div className={`w-full bg-gray-200 ml-1 overflow-hidden	 ${selectedContainer ? 'bg-white' : 'bg-gray-200'}`}>
              <DetailsPanel selectedContainer={selectedContainer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
