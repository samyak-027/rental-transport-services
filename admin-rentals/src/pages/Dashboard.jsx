import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';
import AddCarIcon from '../assets/add-car.svg';

function Dashboard() {
  const [adminName, setAdminName] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skeleton, setSkeleton] = useState(true);
  const navigate = useNavigate();

  // Fetch admin name
  useEffect(() => {
    fetch('http://localhost:5007/api/admin/profile', {
      method: 'GET',
      credentials: 'include', // Ensures cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdminName(data.admin.name);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const skeletonTimer = setTimeout(() => {
      setSkeleton(false);
    }, 2000);

    fetch('http://localhost:5007/api/cars/getCars')
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setCars(data);
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => clearTimeout(skeletonTimer);
  }, []);

  const handleDeleteCar = (carId) => {
    fetch(`http://localhost:5007/api/cars/${carId}`, { 
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCars((prev) => prev.filter((car) => car._id !== carId));
        } else {
          alert('Failed to delete car');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold">Hey, {adminName}</h1>
          <h1 className="text-2xl font-bold">All Vehicles</h1>
        </div>

          <button
            onClick={() => navigate('/car-form')}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            <img src={AddCarIcon} alt="Add Vehicle" className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {skeleton && <Skeleton />}
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-wrap">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} onDelete={handleDeleteCar} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;