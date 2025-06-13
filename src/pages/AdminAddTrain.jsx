import { useState, useEffect } from 'react';
import API from '../api/api';
import { getToken } from '../utils/auth';
import {toast} from 'react-hot-toast';
function AdminAddTrain() {
  const [activeTab, setActiveTab] = useState('add');
  const [form, setForm] = useState({
    train_name: '',
    source: '',
    destination: '',
    seat_capacity: '',
    arrival_time_at_source: '',
    arrival_time_at_destination: ''
  });

  const [trains, setTrains] = useState([]);
  const [seatUpdates, setSeatUpdates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrains = trains.filter(train =>
    train.train_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // add Train
  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      await API.post('/trains/create', form, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'X-ADMIN-KEY':  import.meta.env.VITE_ADMIN_API_KEY
        }
      });
    
      toast.success('Train Added Successfully!');
      setForm({
        train_name: '',
        source: '',
        destination: '',
        seat_capacity: '',
        arrival_time_at_source: '',
        arrival_time_at_destination: ''
      });
      fetchAllTrains();
      setActiveTab('list'); 
    } catch (err) {
      console.error(err);
      toast.error('Failed to add train.');
      
    }
  };

  const handleDeleteTrain = async (trainId) => {
    if (!window.confirm('Are you sure you want to delete this train?')) return;

    try {
      await API.delete(`/trains/${trainId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'X-ADMIN-KEY':  import.meta.env.VITE_ADMIN_API_KEY
        }
      });
      toast.success('Train deleted successfully');
      fetchAllTrains();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete train.');
    }
  };

  // fetch All Trains
  const fetchAllTrains = async () => {
    try {
      const res = await API.get('/trains/availability', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'X-ADMIN-KEY':  import.meta.env.VITE_ADMIN_API_KEY,
        }
      });
      setTrains(res.data);
    } catch (err) {
      console.error('Failed to fetch trains:', err);
    }
  };

  // update seat capacity
  const handleSeatChange = (trainId, value) => {
    setSeatUpdates({ ...seatUpdates, [trainId]: value });
  };

  const handleUpdateSeat = async (trainId) => {
    const newSeats = seatUpdates[trainId];
    if (!newSeats || isNaN(newSeats)) {
      toast.error('Please enter a valid seat capacity.');
      return;
    }

    try {
      const res = await API.put(`/trains/${trainId}/update-seats`, {
        seat_capacity: newSeats
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'X-ADMIN-KEY': import.meta.env.VITE_ADMIN_API_KEY,
        }
      });

      toast.success(`Seat capacity updated to ${res.data.new_capacity}`);
      setSeatUpdates({ ...seatUpdates, [trainId]: '' });
      fetchAllTrains();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update seat capacity.');
    }
  };

  useEffect(() => {
    fetchAllTrains();
  }, []);

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="mt-2 text-md text-gray-600">Efficiently manage trains, schedules, and capacity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Train
              </span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Trains ({trains.length})
              </span>
            </button>
          </nav>
        </div>
      </div>

     {/* tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="px-8 py-10">
              <div className="mb-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Add New Train</h2>
                <p className="mt-2 text-gray-600">Fill in the train details to add it to the system</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Train Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="train_name"
                      placeholder="e.g., Rajdhani Express"
                      value={form.train_name}
                      onChange={(e) => setForm({ ...form, train_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Seat Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="seat_capacity"
                      type="number"
                      min="1"
                      placeholder="e.g., 200"
                      value={form.seat_capacity}
                      onChange={(e) => setForm({ ...form, seat_capacity: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Source Station <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="source"
                      placeholder="e.g., New Delhi"
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Destination Station <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="destination"
                      placeholder="e.g., Mumbai Central"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Departure Time (Source)
                    </label>
                    <input
                      name="arrival_time_at_source"
                      type="time"
                      value={form.arrival_time_at_source}
                      onChange={(e) => setForm({ ...form, arrival_time_at_source: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Arrival Time (Destination)
                    </label>
                    <input
                      name="arrival_time_at_destination"
                      type="time"
                      value={form.arrival_time_at_destination}
                      onChange={(e) => setForm({ ...form, arrival_time_at_destination: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={handleAddTrain}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform  shadow-lg hover:shadow-xl flex items-center text-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Train to System
                  </button>
                </div>
              </div>
                
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="px-8 py-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Train Fleet</h2>
                  <p className="mt-2 text-gray-600">Manage existing trains and their capacities</p>
                </div>
                <div className="mt-6 lg:mt-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search trains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-6 py-3 w-full lg:w-80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {trains.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No trains in system</h3>
                  <p className="text-gray-500 mb-8">Get started by adding your first train to the fleet.</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Add First Train
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                  {filteredTrains.map(train => (
                    <div key={train.train_id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-lg">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                        {/* Train Info */}
                        <div className="lg:col-span-1">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{train.train_name}</h3>
                              <p className="text-sm text-gray-500">ID: #{train.train_id}</p>
                            </div>
                          </div>
                        </div>

                        {/* route info */}
                        <div className="lg:col-span-1">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{train.source}</div>
                            <div className="flex items-center justify-center my-2">
                              <div className="w-8 h-0.5 bg-blue-300"></div>
                              <svg className="w-4 h-4 text-blue-600 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                              <div className="w-8 h-0.5 bg-blue-300"></div>
                            </div>
                            <div className="font-semibold text-gray-900">{train.destination}</div>
                          </div>
                        </div>

                        {/* capacity info */}
                        <div className="lg:col-span-1">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{train.available_seats}</div>
                            <div className="text-sm text-gray-500">of {train.seat_capacity} seats</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                style={{width: `${(train.available_seats / train.seat_capacity) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* schedule info */}
                        <div className="lg:col-span-1">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Departure:</span>
                              <span className="font-semibold text-gray-900">{train.arrival_time_at_source || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Arrival:</span>
                              <span className="font-semibold text-gray-900">{train.arrival_time_at_destination || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* actions */}
                        <div className="lg:col-span-1">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                placeholder="Capacity"
                                min="1"
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 place-content-center focus:border-blue-500 w-12"
                                value={seatUpdates[train.train_id] || ''}
                                onChange={(e) => handleSeatChange(train.train_id, e.target.value)}
                              />
                              <button
                                onClick={() => handleUpdateSeat(train.train_id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md"
                              >
                                Update
                              </button>
                            </div>
                            <button
                              onClick={() => handleDeleteTrain(train.train_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md w-full"
                            >
                              Delete Train
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminAddTrain;