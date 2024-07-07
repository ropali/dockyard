import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import {Table} from './components/Table';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64" /> {/* Set a fixed width for Sidebar */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="h-full w-full mt-4">
            <Table />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
