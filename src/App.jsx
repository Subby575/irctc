import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Search from './pages/Search';
import Book from './pages/Book';
import BookingDetails from './pages/BookingDetails';
import AdminAddTrain from './pages/AdminAddTrain';
import Navbar from './components/Navbar';
import MyBookings from './pages/MyBookings';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Toaster position="top-right" />
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:trainId" element={<Book />} />
        <Route path="/booking/:bookingId" element={<BookingDetails />} />
        <Route path="/admin/add-train" element={<AdminAddTrain />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
