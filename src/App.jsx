import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Card from './components/Card';
import DetailsPanel from './components/DetailsPanel';

import data from './data.json';

const mockContainersData = data.containers;

function TopBar({ searchQuery, setSearchQuery, showAll, setShowAll }) {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 p-2 rounded-md border-gray-200 shadow-sm sm:text-sm "
        placeholder="Search..."
      />
      <label className="ml-4 flex items-center text-gray-400">
        <input
          type="checkbox"
          checked={showAll}
          onChange={(e) => setShowAll(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-0 transition duration-150 ease-in-out"
        />
        <span className="ml-2">Show All</span>
      </label>
    </div>
  );
}


function App() {
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredContainers = mockContainersData.filter(container => {
    const matchesSearchQuery = container.Names[0].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShowAll = showAll || container.Status.toLocaleLowerCase() === 'running';
    return matchesSearchQuery && matchesShowAll;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex p-6 bg-gray-100 flex-1 overflow-hidden mb-2">
          <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
              <TopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showAll={showAll}
                setShowAll={setShowAll}
              />
              {filteredContainers.map(container => (
                <Card
                  key={container.Id}
                  container={container}
                  onClick={() => setSelectedContainer(container)}
                />
              ))}
            </div>
            <div className="w-2/3 bg-gray-200 p-2 ml-1 overflow-y-auto">
              <DetailsPanel selectedContainer={selectedContainer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
