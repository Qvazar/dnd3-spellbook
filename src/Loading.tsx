import React from 'react';
import { CircularProgress } from "@material-ui/core";

const Loading: React.FC = () => (
    <div className="loading">
        <CircularProgress />
    </div>
);

export default Loading;
