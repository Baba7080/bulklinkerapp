// src/useFacebookSDK.js
import { useEffect } from 'react';

const useFacebookSDK = (appId, configId) => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    console.log('loading script')
    script.onload = () => {
      console.log(" started loading script")
      // Initialize the Facebook SDK
      window.fbAsyncInit = function () {
        window.FB.init({
          appId,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v19.0'
        });

        console.log("ended loading script")
      };
    };

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [appId, configId]);
};

export default useFacebookSDK;
