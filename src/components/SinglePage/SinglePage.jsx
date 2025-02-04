import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from 'react-use-cart';

function Singleproduct() {
    const [car, setCars] = useState(null);
    const { addItem } = useCart();
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImage] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://tradewheels.onrender.com/api/user`, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUserData(userData);
            } catch (error) {
                setError('Could not fetch user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        fetchCarData();
        fetchImageData();
    }, [id]);

    const fetchCarData = async () => {
        try {
            const response = await fetch(`https://tradewheels.onrender.com/api/sellCar/cars/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    };

    const fetchImageData = async () => {
        try {
            const response = await fetch(`https://tradewheels.onrender.com/api/images/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API response:', data);

            if (data.images && Array.isArray(data.images)) {
                setImages(data.images);
            } else {
                console.error('Expected an array but got:', data);
            }
        } catch (error) {
            console.error('Error fetching image data:', error);
        }
    };

    if (!car) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col justify-center items-center lg:flex-row gap-16 lg:items-start p-6">
            {/* Images Section */}
            <div className="flex flex-col gap-4">
                {images.length > 0 && (
                    <img
                        src={activeImg || images[0]?.image_url}
                        alt="Main Image"
                        className=" w-max h-96 object-cover rounded-lg shadow-lg"
                    />
                )}
                <div className="flex flex-row justify-start gap-2 mt-4">
                    {images.slice(0, 7).map((img, index) => (
                        <img
                            key={index}
                            src={img?.image_url}
                            alt={`Image ${index + 1}`}
                            className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                            onClick={() => setActiveImage(img?.image_url)}
                        />
                    ))}
                </div>
            </div>

            {/* Car Details Section */}
            <div className="flex flex-col gap-4 lg:w-2/4 bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-500 text-lg">{car.brand}</p>
                <p className="text-gray-500 text-lg">{car.year}</p>
                <span className="text-3xl font-bold">{car.make} {car.model}</span>

                <div className="flex gap-4 mt-4">
                    <div className="bg-slate-200 text-base p-2 rounded-lg font-semibold">{car.km_driven} KM</div>
                    <div className="bg-slate-200 text-base p-2 rounded-lg font-semibold">{car.fuel_type}</div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <div><strong>Variant:</strong> {car.variant}</div>
                    <div><strong>Ownership:</strong> {car.ownership}</div>
                    <div><strong>Color:</strong> {car.color}</div>
                </div>

                <h6 className="text-2xl font-bold text-blue-500 mt-6">Rs {car.price}</h6>

                <div className="flex flex-row items-center pt-4">
                    {userData ? (
                        <button
                            className="bg-blue-600 hover:bg-blue-700 transition duration-200 font-semibold px-5 py-3 text-white rounded-md"
                            onClick={() => addItem(car)}
                        >
                            Book Test Drive
                        </button>
                    ) : (
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 transition duration-200 font-semibold px-5 py-3 text-white rounded-md">
                            Login to Book Test Drive
                        </Link>
                    )}
                    {message && <p className="pl-5 text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Singleproduct;
