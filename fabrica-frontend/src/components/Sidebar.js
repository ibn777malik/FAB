// src/components/Sidebar.js
export default function Sidebar({ currentTab, setTab }) {
    return (
      <div className="w-48 bg-gray-100 h-full p-4">
        <button
          onClick={() => setTab('properties')}
          className={`block w-full text-left mb-2 px-3 py-2 rounded ${
            currentTab === 'properties'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200'
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`block w-full text-left px-3 py-2 rounded ${
            currentTab === 'settings'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200'
          }`}
        >
          Settings
        </button>
      </div>
    )
  }
  