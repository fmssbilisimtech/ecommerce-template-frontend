import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'


export default function Checkout() {
    const { isAuthenticated } = useAuth0();
    const history = useHistory()

    useEffect(() => {
        if(!isAuthenticated) history.push('/')
    }, [isAuthenticated, history]);

    if(isAuthenticated) {
        return true
    }

    return null;
}