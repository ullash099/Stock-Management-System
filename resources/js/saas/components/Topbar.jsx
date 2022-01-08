import React from 'react'
import { Link } from 'react-router-dom'
import Spinner from './Spinner';
import { AppUrl } from '../Context'

export default function Topbar(props) {
    const [data,setData] = React.useState({
        csrf : document.getElementsByName('csrf-token')[0].content,
        name : ``,
        role : ``,
        photo : ``,
        loading: true,
    });

    const GetUserInfo = async () => {
        await axios.get(AppUrl(`/secure/my-info`))
        .then(response => {
            let info = response.data            
            setData({
                ...data,
                loading: false,
                name : info.name,
                role : info.role,
                photo : info.photo,
            });
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    const handleSubmit = () => {
        document.getElementById("logout").submit()
    }

    React.useEffect(() => {
        GetUserInfo();
    }, [props]);

    return (
        <div className="navbar-custom">
            <ul className="list-unstyled topbar-menu float-end mb-0">
                {/* <li className="dropdown notification-list">
                    <Link to="#" className="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                        <i className="dripicons-bell noti-icon"></i>
                        <span className="noti-icon-badge"></span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg">

                        <div className="dropdown-item noti-title">
                            <h5 className="m-0">
                                <span className="float-end">
                                    <Link to="#" className="text-dark">
                                        <small>Clear All</small>
                                    </Link>
                                </span>Notification
                            </h5>
                        </div>

                        <div style={{ maxHeight : "230px" }} data-simplebar="init">
                            <div className="simplebar-wrapper" style={{ margin : "0px" }}>

                                <div className="simplebar-height-auto-observer-wrapper">
                                    <div className="simplebar-height-auto-observer"></div>
                                </div>

                                <div className="simplebar-mask">
                                    <div className="simplebar-offset" style={{ right : "0px", bottom : "0px" }}>
                                        <div className="simplebar-content-wrapper" style={{ height : "auto", overflow : "hidden scroll" }}>
                                            <div className="simplebar-content" style={{ padding : "0px" }}>
                            
                                                <Link to="#" className="dropdown-item notify-item">
                                                    <div className="notify-icon bg-primary">
                                                        <i className="mdi mdi-comment-account-outline"></i>
                                                    </div>
                                                    <p className="notify-details">Caleb Flakelar commented on Admin
                                                        <small className="text-muted">1 min ago</small>
                                                    </p>
                                                </Link>
                            
                                                <Link to="#" className="dropdown-item notify-item">
                                                    <div className="notify-icon bg-info">
                                                        <i className="mdi mdi-account-plus"></i>
                                                    </div>
                                                    <p className="notify-details">New user registered.
                                                        <small className="text-muted">5 hours ago</small>
                                                    </p>
                                                </Link>
                            
                                                <Link to="#" className="dropdown-item notify-item">
                                                    <div className="notify-icon">
                                                        <img src={AppUrl(`/saas/images/users/avatar-2.jpg`)} className="img-fluid rounded-circle" alt="" />
                                                    </div>
                                                    <p className="notify-details">Cristina Pride</p>
                                                    <p className="text-muted mb-0 user-msg">
                                                        <small>Hi, How are you? What about our next meeting</small>
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="simplebar-placeholder" style={{ width : "318px", height : "390px" }}></div>

                            </div>

                            <div className="simplebar-track simplebar-horizontal" style={{ visibility : "hidden" }}>
                                <div className="simplebar-scrollbar" style={{ width : "0px", display: "none" }}></div>
                            </div>

                            <div className="simplebar-track simplebar-vertical" style={{ visibility : "hidden" }}>
                                <div className="simplebar-scrollbar" style={{ height : "0px", display: "none", transform : "translate3d(0px, 0px, 0px)" }}></div>
                            </div>

                        </div>

                        <Link to="#" className="dropdown-item text-center text-primary notify-item notify-all">
                            View All
                        </Link>

                    </div>
                </li> */}

                {
                    data.loading ? (<Spinner />) : 
                    (
                        <li className="dropdown notification-list">

                            <Link to="#" className="nav-link dropdown-toggle nav-user arrow-none me-0" data-bs-toggle="dropdown" role="button" aria-haspopup="false" aria-expanded="false">
                                <span className="account-user-avatar">
                                    {
                                        data.photo ? 
                                        (
                                            <img src={data.photo} alt="user-image" className="rounded-circle" />
                                        )
                                        :(``)
                                    }
                                </span>
                                <span>
                                    <span className="account-user-name">{ data.name ? data.name : `` }</span>
                                    <span className="account-position">{ data.role ? data.role : `` }</span>
                                </span>
                            </Link>

                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                                                        
                                <Link to={AppUrl(`/control/my-account`)} className="dropdown-item notify-item">
                                    <i className="mdi mdi-account-circle me-1"></i>
                                    <span>My Account</span>
                                </Link>

                                <form method="POST" id="logout" action={AppUrl(`/logout`)}>
                                    <input name="_token" type="hidden" value={data.csrf} />
                                    <Link onClick={handleSubmit} to="#" className="dropdown-item notify-item">
                                        <i className="mdi mdi-logout me-1"></i>
                                        <span>Logout</span>
                                    </Link>
                                </form>
                                
                            </div>
                        </li>
                    )
                }

            </ul>

            <button className="button-menu-mobile open-left">
                <i className="mdi mdi-menu"></i>
            </button>

            {/* <div className="app-search dropdown d-none d-lg-block">
                <form>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search..." />
                        <span className="mdi mdi-magnify search-icon"></span>
                        <button className="input-group-text btn-primary" type="button">Search</button>
                    </div>
                </form>
            </div> */}

        </div>
    )
}
