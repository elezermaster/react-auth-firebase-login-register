#### in services folder project create localStorageService.js file

```javascript

const TOKEN_KEY = 'jwt-token'
const REFRESH_KEY = 'jwt-refresh-token'
const EXPIRES_KEY = 'jwt-expires'

    export function setTokens({refreshToken, idToken, expiresIn}) {
        const expiresDate = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem(TOKEN_KEY, idToken)
        localStorage.setItem(REFRESH_KEY, refreshToken)
        localStorage.setItem(EXPIRES_KEY, expiresDate)
    }

    export function getAccessToken() {
        return localStorage.getItem(TOKEN_KEY)
    }

    export function getRefreshToken() {
        return localStorage.getItem(REFRESH_KEY)
    }

    export function getTokenExpiresDate() {
        return localStorage.getItem(EXPIRES_KEY)
    }

    const localStorageService = {
        setTokens,
        getAccessToken,
        getRefreshToken,
        getTokenExpiresDate,
    }

    export default localStorageService;


```

#### in registerForm  connect to useAuth

```javascript

import {useQualities} from '../../hooks/useQualities'
import {useProfessions} from '../../hooks/useProfession'
import {useAuth} from '../../hooks/useAuth'
import {useHistory} from 'react-router-dom'

const RegisterForm = () => {
    const history = useHistory();
    const {signUp} = useAuth();
    const [data, setData] = useState({
        email: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: [],
        licence: false
    });

```


#### in submit form 

```javascript

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const newData = {...data, qualities: data.qualities.map(q => q.value)}
        try {
           await signUp(newData);
           history.push('/')
        } catch (error) {
            setErrors(error)
        }
    };
```

#### in login form 

```javascript

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(data);
        try {
           await signIn(data);
           history.push('/')
        } catch (error) {
            setErrors(error)
        }
    };

```

