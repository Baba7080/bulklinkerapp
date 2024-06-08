// src/WhatsAppSignupButton.js
import React, { useEffect } from 'react';
import useFacebookSDK from './useFacebookSDK';
import { fbLogin, getFacebookLoginStatus, initFacebookSdk } from './FacebookSDK';
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const WhatsAppSignupButton = ({ appId, configId }) => {
    useFacebookSDK(appId, configId);

    const launchWhatsAppSignup = () => {
        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    console.log('Access Token:', accessToken);
                    // Use this token to call the debug_token API and get the shared WABA's ID
                    // Example: Call your backend API to handle further onboarding steps
                    // axios.post('/api/whatsapp-onboarding', { accessToken })
                    //   .then(response => console.log('Onboarding successful', response))
                    //   .catch(error => console.error('Onboarding failed', error));
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },
            {
                config_id: configId, // Replace with your configuration ID
                response_type: 'code', // Must be set to 'code' for System User access token
                override_default_response_type: true,
                extras: {
                    setup: {
                        // Prefilled data can go here
                    },
                },
            }
        );
    };
    // useEffect(() => {
    //     console.log("Started use effect");
    //     initFacebookSdk().then(() => {
    //         console.log('lodade')
    //         getFacebookLoginStatus().then((response) => {
    //             if (response == null) {
    //                 console.log("No login status for the person");
    //             } else {
    //                 console.log(response);
    //             }
    //         });
    //     });
    // }, []);
    // function login() {
    //     console.log("reached log in button");
    //     fbLogin().then((response) => {
    //         console.log(response);
    //         if (response.status === "connected") {
    //             console.log("Person is connected");
    //         } else {
    //             // something
    //         }
    //     });
    // }

    return (
        <>
            <div id="fb-root"></div>
            <Button
                leftIcon={<AddIcon />}
                colorScheme="red"
                variant="solid"
                onClick={launchWhatsAppSignup}>
                Add New Account
            </Button>
        </>
    );
};

export default WhatsAppSignupButton;
