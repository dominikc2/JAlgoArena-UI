import React from 'react';
import {Grid, Col, Button, Table, PageHeader} from 'react-bootstrap';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import FontAwesome from '../components/FontAwesome';
import {attemptLogout} from "../actions/AuthActions";
import {fetchSubmissions} from "../actions/index";
import WorkInProgress from '../components/WorkInProgress';
import store from '../store';
import {closeWorkInProgressWindow} from "../actions/index";

class Profile extends React.Component {

    transferToProfileIfLoggedOut() {
        if (!this.props.userAuthSession.user) {
            hashHistory.push('/login');
        }
    }

    componentWillMount() {
        this.transferToProfileIfLoggedOut();
    }

    componentDidUpdate() {
        this.transferToProfileIfLoggedOut();
    }

    componentDidMount() {
        if (this.props.userAuthSession.user) {
            store.dispatch(fetchSubmissions(this.props.userAuthSession.user.id));
        }
    }

    render() {
        const {
            userAuthSession
        } = this.props;

        let {
            user
        } = userAuthSession;

        user = user || {username: "", email: "", id: ""};

        let submissions = this.props.submissions.map ? this.props.submissions : [];

        let submissionNodes = submissions.map((submission, idx) =>
            <tr key={idx}>
                <td>{submission.problemId}</td>
                <td>{submission.elapsed_time}</td>
            </tr>
        );

        return <Grid>
            <WorkInProgress showModal={this.props.showModal} onHide={this.props.onHide}/>
            <Col mdOffset={3} md={6}>
                <PageHeader>Submissions</PageHeader>
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        <th>Problem ID</th>
                        <th>Used Time (ms)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {submissionNodes}
                    </tbody>
                </Table>
                <PageHeader>Profile</PageHeader>
                <Table striped bordered condensed hover responsive>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    </tbody>
                </Table>
                <Button bsStyle="danger" className="pull-right" onClick={this.props.onLogout}>
                    <FontAwesome name="sign-out"/> Logout
                </Button>
            </Col>
        </Grid>;
    }
}

const mapStateToProps = (state) => {
    return {
        userAuthSession: state.userAuthSession,
        submissions: state.submissions
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => {
            dispatch(attemptLogout());
        },
        onHide: () => {
            dispatch(closeWorkInProgressWindow());
        }
    }
};

const ProfilePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);

export default ProfilePage;