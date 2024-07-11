import React from 'react';

function DetailsPanel({ selectedContainer }) {
  if (!selectedContainer) {
    return <div className="text-gray-600 p-4">Select a container to see more details</div>;
  }

  const logs = `2024-05-18 12:45:38.003 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2024-05-18 12:45:38.009 UTC [1] LOG:  database system was shut down at 2024-05-18 09:20:41 UTC
2024-05-18 12:50:38.003 UTC [27] LOG:  checkpoint starting: shutdown immediate
2024-05-18 12:50:38.091 UTC [27] LOG:  checkpoint complete: wrote 0 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.010 s, sync=0.801 s, total=0.825 s; sync files=0, longest=0.800 s, average=0.800 s; distance=0 kB, estimate=0 kB; lsn=0/1C806020, redo lsn=0/1C806020
2024-05-18 12:50:38.091 UTC [27] LOG:  shutting down
2024-05-18 12:50:38.091 UTC [27] LOG:  database system is shut down`;

  return (
    <div className="p-4 bg-white shadow-sm h-full overflow-x-hidden flex flex-col">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-bold">{selectedContainer.Names[0].slice(1)}</h1>
        <p className="ml-auto text-sm text-gray-600">Status: {selectedContainer.Status}</p>
      </div>
      <div className="flex mb-4">
        <button className="mx-1 px-4 py-2 bg-blue-500 text-white rounded">WEB</button>
        <button className="mx-1 px-4 py-2 bg-blue-500 text-white rounded">EXEC</button>
        <button className="mx-1 px-4 py-2 bg-blue-500 text-white rounded">START</button>
        <button className="mx-1 px-4 py-2 bg-blue-500 text-white rounded">RESTART</button>
        <button className="mx-1 px-4 py-2 bg-red-500 text-white rounded">REMOVE</button>
        <button className="mx-1 px-4 py-2 bg-gray-500 text-white rounded">INFO</button>
      </div>
      <div className="flex mb-4 border-b">
        <button className="mr-4 pb-2 border-b-2 border-blue-500">LOGS</button>
        <button className="pb-2">STATS</button>
      </div>
      <div className="flex-1 overflow-auto bg-black text-white p-2 rounded">
        <pre className="whitespace-pre-wrap">{logs}</pre>
      </div>
    </div>
  );
}

export default DetailsPanel;
