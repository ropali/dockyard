import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {IconBxErrorCircle} from "../../Icons/index.jsx";

const ErrorScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const errorMessage = location.state?.message

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-base-400">
            <div className="text-center">
                <div className="text-6xl mb-4 text-gray-600">
                    <IconBxErrorCircle className="mx-auto h-20 w-20 text-red-500"/>
                </div>
                <h1 className="text-3xl font-semibold text-gray-800">Oops, something went wrong!</h1>
                <p className="text-lg text-gray-600 mt-2">{errorMessage}</p>
                <button
                    onClick={() => navigate("/")}
                    className="btn btn-primary mt-10 ">
                    Retry
                </button>
            </div>
        </div>
    );
};

export default ErrorScreen;
