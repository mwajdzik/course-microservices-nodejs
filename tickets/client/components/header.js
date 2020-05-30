import Link from 'next/link';

export default ({currentUser}) => {
    const availableLinks = [
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ];

    const links = availableLinks
        .filter(linkConfig => linkConfig)
        .map(({label, href}) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <a className="nav-link">{label}</a>
                    </Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-light bg-light" style={{'margin-bottom': '2em'}}>
            <Link href="/">
                <a className="navbar-brand">GitTix</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    );
};
