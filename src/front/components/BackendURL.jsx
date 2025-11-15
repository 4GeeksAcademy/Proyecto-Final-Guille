import React, { useState, useEffect } from "react";

const BackendURL = () => {
	const [backendURL, setBackendURL] = useState("");

	useEffect(() => {
		setBackendURL(import.meta.env.VITE_BACKEND_URL);
	}, []);

	return (
		<div className="alert alert-info">
			<strong>Backend URL:</strong> {backendURL}
		</div>
	);
};

export default BackendURL;