import { useParams } from 'react-router-dom';
import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import {toast} from 'react-hot-toast'
function Book() {
  const { trainId } = useParams();
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBook = async () => {
        const token = getToken();
         if (!token) {
      toast.error("You must be logged in to book a train.");
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post(`/trains/${trainId}/book`, {
        no_of_seats: seats
      });
      toast.success('Booking successful');
      navigate(`/booking/${res.data.booking_id}`);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Book Your Journey</h1>
          </div>
          <p className="text-gray-600">Train ID: <span className="font-semibold text-indigo-600">{trainId}</span></p>
        </div>

        {/* booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* train info  */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Train {trainId}</h3>
                  <p className="text-blue-100">Select your preferred number of seats</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* seat selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Number of Seats
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg font-medium"
                  placeholder="Enter number of seats"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500">Maximum 6 seats per booking</p>
            </div>

            {/* booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Number of Seats:</span>
                <span className="font-semibold text-lg">{seats}</span>
              </div>
            </div>

            {/* action bttons */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleBook}
                disabled={loading || seats < 1}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* additional */}
        {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-medium text-blue-800">Important Information</h5>
              <p className="text-sm text-blue-700 mt-1">
                Please ensure you have valid ID proof for travel. Booking confirmation will be sent to your registered email.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Book;