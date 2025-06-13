import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/bookings/mine');
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load your bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const getStatusColor = (booking) => {
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-600 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600">View and manage your train reservations</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{bookings.length}</p>
                <p className="text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {bookings.reduce((acc, b) => acc + b.seat_numbers.length, 0)}
                </p>
                <p className="text-gray-600">Total Seats</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{bookings.length}</p>
                <p className="text-gray-600">Active Trips</p>
              </div>
            </div>
          </div>
        </div>

        {/* bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Bookings Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any train bookings yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Trains</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{booking.train_name}</h3>
                        <p className="text-gray-600">Booking ID: {booking.booking_id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking)}`}>
                      Confirmed
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* journey Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Journey
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Departure:</span>
                          <span className="font-medium">{formatTime(booking.arrival_time_at_source)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Arrival:</span>
                          <span className="font-medium">{formatTime(booking.arrival_time_at_destination)}</span>
                        </div>
                      </div>
                    </div>

                    {/* seat details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Seats ({booking.seat_numbers.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {booking.seat_numbers.map((seat, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

              
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Actions</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleViewDetails(booking.booking_id)}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

    
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              </div>
            ))}
          </div>
        )}

  
        {bookings.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Book Another Trip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;