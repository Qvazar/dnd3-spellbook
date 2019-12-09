import React from 'react';

type ErrorProps = {
    error: Error
}

const Error: React.FC<ErrorProps> = ({error}) => {
    return <div>{error.message}</div>;
};

export default Error;
