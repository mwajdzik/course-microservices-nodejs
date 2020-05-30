import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({Component, pageProps, currentUser}) => {
    console.log('I am called in a browser and on a server side!')

    return (
        <div className="container">
            <Header currentUser={currentUser}/>
            <Component {...pageProps} />
        </div>
    );
};

// getInitialProps is called by NextJS during the server-side rendering
AppComponent.getInitialProps = async (appContext) => {
    console.log('I am called on a server side!')

    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {pageProps, ...data};
};

export default AppComponent;
