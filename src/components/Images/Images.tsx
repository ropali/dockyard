import React from 'react';

export default function ImagesPage(): JSX.Element {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="h-32 rounded-lg bg-gray-200"></div>
            <div className="h-32 rounded-lg bg-gray-200 lg:col-span-2"></div>
        </div>
    );
}
