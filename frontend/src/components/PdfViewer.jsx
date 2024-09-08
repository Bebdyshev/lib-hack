import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PdfViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const pdfName = queryParams.get('url');

  useEffect(() => {
    if (pdfName) {
      navigate(pdfName, { replace: true });
    }
  }, [pdfName, navigate]);

  return null; // No need to render anything if you are only redirecting
};

export default PdfViewer;
