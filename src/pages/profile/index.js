import httpRequest from '~/utils/htppRequest';

const USER_URL = '/user/list';

function Profile() {
    httpRequest
        .get(USER_URL, {
            withCredentials: true,
        })
        .then((response) => {
            // console.log(response.data);
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    return <h2>Profile page</h2>;
}
export default Profile;
