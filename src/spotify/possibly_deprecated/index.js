const playlist = require('./playlist');
const search = require('./search');
const add = require('./add');
// const token = require('./assets/auth_token');

const test_token = require('./assets/test_auth');

module.exports = async () => {
    // token();
    // const t_token = await test_token();
    // console.log('T_token: ', t_token);

    var playlist_id = await playlist();
    console.log('Pl response: ', playlist_id);

    var add_data = await add('4RVwu0g32PAqgUiJoXsdF8');
    console.log("add data: ", add_data);

    // playlist(secrets);
    // add(secrets, playlist_secret.id,'4HOryCnbme0zBnF8LWij3f')

    // search();
};