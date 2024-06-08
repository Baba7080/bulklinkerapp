import { useEffect, useState } from 'react';
import DI from '../core/DependencyInjection';
import { Box } from '@chakra-ui/react';
import Navbar from '../components/Auth/Navbar';
import Hero from '../components/Auth/Hero';
import Footer from '../components/Auth/Footer';
import Features from '../components/Auth/Features';
import Pricing from '../components/Auth/Pricing';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

const Auth = (props) => {
    const { di, user } = props
    useEffect(() => {
        let login = user.get("login");
        if (login) {
            di.PUSH("/panel/"+props.user.get("user_details").user_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const toggleSignup = () => setIsSignupOpen(!isSignupOpen);
    const switchToSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };
    const switchToLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    return <Box>
        <Login isOpen={isLoginOpen} onClose={toggleLogin} onSwitch={switchToSignup} di={props.di} error={props.error} success={props.success} globalState={props.globalState} />
        <Signup isOpen={isSignupOpen} onClose={toggleSignup} onSwitch={switchToLogin} di={props.di} error={props.error} success={props.success} />

        <Navbar toggleLogin={toggleLogin} toggleSignup={toggleSignup} />
        <Box > {/* Adjust the margin-top to ensure the content is below the fixed navbar */}
            <Hero toggleSignup={toggleSignup} />
            <Features />
            <Pricing />
        </Box>
        <Footer />
    </Box>
};

export default DI(Auth);