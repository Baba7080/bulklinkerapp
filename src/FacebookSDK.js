export const initFacebookSdk = () => {
    return new Promise((resolve, reject) => {
        // Load the Facebook SDK asynchronously
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: '1075467237089677',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v19.0'
            });
            // Resolve the promise when the SDK is loaded
            resolve();
        }
    })
};

export const getFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus((response) => {
            resolve(response);
        });
    });
};

export const fbLogin = (configId) => {
    return new Promise((resolve, reject) => {
        window.FB.login((response) => {
            resolve(response)
        }, {
            config_id: configId, // Replace with your configuration ID
            response_type: 'code', // Must be set to 'code' for System User access token
            override_default_response_type: true,
            extras: {
                setup: {
                    // Prefilled data can go here
                },
            },
        })
    })
}
