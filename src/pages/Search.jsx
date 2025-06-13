import { useState, useRef, useEffect } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast'
function Search() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  // Sample station data 
  const stations = [
    'Asansol',
    'Howrah',
    'Durgapur',
    'Sealdah',
    'New Delhi',
    'Mumbai Central',
    'Chennai Central',
    'Kolkata',
    'Bangalore City',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Kanpur Central',
    'Nagpur',
    'Bhopal',
    'Indore',
    'Patna',
    'Guwahati'
  ];

  const filteredSourceStations = stations.filter(station => 
    station.toLowerCase().includes(source.toLowerCase()) && station.toLowerCase() !== destination.toLowerCase()
  );

  const filteredDestinationStations = stations.filter(station => 
    station.toLowerCase().includes(destination.toLowerCase()) && station.toLowerCase() !== source.toLowerCase()
  );

  const handleSearch = async () => {
    if (!source || !destination) {
      toast.error('Please select both source and destination stations');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await API.get(`/trains/availability?source=${source}&destination=${destination}`);
      setTrains(res.data);
    } catch (error) {
      console.error('Error searching trains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStationSelect = (station, type) => {
    if (type === 'source') {
      setSource(station);
      setShowSourceDropdown(false);
    } else {
      setDestination(station);
      setShowDestinationDropdown(false);
    }
  };

  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setShowSourceDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Train</h1>
          <p className="text-gray-600">Search and book train tickets across India</p>
        </div>

  
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              
              <div className="md:col-span-5 relative" ref={sourceRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter source station"
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      setShowSourceDropdown(true);
                    }}
                    onFocus={() => setShowSourceDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
            
                {showSourceDropdown && source && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSourceStations.length > 0 ? (
                      filteredSourceStations.map((station, index) => (
                        <div
                          key={index}
                          onClick={() => handleStationSelect(station, 'source')}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-800">{station}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">No stations found</div>
                    )}
                  </div>
                )}
              </div>

             
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={swapStations}
                  className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
                  title="Swap stations"
                >
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              
              <div className="md:col-span-5 relative" ref={destinationRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter destination station"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowDestinationDropdown(true);
                    }}
                    onFocus={() => setShowDestinationDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                
                {showDestinationDropdown && destination && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDestinationStations.length > 0 ? (
                      filteredDestinationStations.map((station, index) => (
                        <div
                          key={index}
                          onClick={() => handleStationSelect(station, 'destination')}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-800">{station}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">No stations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

          
            <div className="mt-6 text-center">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : (
                  'Search Trains'
                )}
              </button>
            </div>
          </div>
        </div>

        
        {trains.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Trains</h2>
            <div className="space-y-4">
              {trains.map(train => (
                <div key={train.train_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{train.train_name}</h3>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-sm">{train.source} → {train.destination}</span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {train.available_seats} seats available
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link 
                        to={`/book/${train.train_id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* no result */}
        {trains.length === 0 && source && destination && !isLoading && (
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-8-7.933 8 8 0 1116 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Trains Found</h3>
              <p className="text-gray-600">Try searching with different stations or check back later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;