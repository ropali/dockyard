import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <Navbar />
        <div class="container h-auto w-full bg-gray-200 mt-4">
         
          <div className="overflow-x-auto">
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
