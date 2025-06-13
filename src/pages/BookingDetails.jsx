import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function BookingDetails() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // sample ticket
    const ticketData = `
IRCTC E-TICKET
==============
Booking ID: ${booking.booking_id}
Train: ${booking.train_name}
Seats: ${booking.seat_numbers.join(', ')}
Journey: ${booking.arrival_time_at_source} to ${booking.arrival_time_at_destination}
Status: Confirmed
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.booking_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Booking</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
          </div>
          <p className="text-gray-600">Your train ticket has been successfully booked</p>
        </div>

        {/* e-ticket */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* ticket header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">IRCTC E-TICKET</h2>
                <p className="text-orange-100">Electronic Reservation Slip</p>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <p className="text-sm text-orange-100">Booking ID</p>
                  <p className="text-xl font-bold">{booking.booking_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ticket bdy */}
          <div className="p-8">
            {/* train info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                    </svg>
                    Train Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600 mb-1">{booking.train_name}</p>
                    <p className="text-gray-600">Train Number: {booking.train_id || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Seat Information
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.seat_numbers.map((seat, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        Seat {seat}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Total Seats: {booking.seat_numbers.length}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Journey Timeline
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-500 rounded-full p-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Departure</p>
                        <p className="text-lg font-bold text-green-600">{booking.arrival_time_at_source}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-500 rounded-full p-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Arrival</p>
                        <p className="text-lg font-bold text-red-600">{booking.arrival_time_at_destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Booking Status</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-full p-1 mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-green-800 font-medium">CONFIRMED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* important instructions */}
            {/* <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Important Instructions</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Please carry a valid photo ID proof during your journey</li>
                    <li>• Arrive at the station at least 30 minutes before departure</li>
                    <li>• Keep this e-ticket handy for verification</li>
                    <li>• Contact customer support for any queries</li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Ticket</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m3-6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2z" />
            </svg>
            <span>Download</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;