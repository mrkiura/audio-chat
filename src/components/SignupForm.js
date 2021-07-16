import React  from 'react';
import { useGlobalState } from '../RoomContextProvider';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';



const SignupForm = () => {
    const [state, setState] = useGlobalState();
    const updateNickname = (nickname) => {
        setState({...state, nickname});
    }
    const history = useHistory()
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = state.nickname;
        setupTwilio(nickname);
        history.push('/rooms')
    };

   const setupTwilio = (nickname) => {
        fetch(`/api/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            const twilioToken = data.token;
            const device = new Device(twilioToken);
            device.updateOptions(twilioToken, {
                codecPreferences: ['opus', 'pcmu'],
                maxAverageBitrate: 16000
            });
            device.on('error', (device) => {
                console.log("error: ", device)
            });
            setState((state) => {
                return {...state, device, twilioToken}
            });
        })
        .catch((error) => {
            console.log(error)
        })
    };



    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter nickname"
                onChange={ e => updateNickname(e.target.value)}
            />
             <input type="submit" value="Submit" />
        </form>
    );
};

export default SignupForm;
