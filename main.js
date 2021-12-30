const server = require('./src/server');

server.get('/test', async (req, res) => {
    try {
        const login_res = await axios.get('http://localhost:8000/spotify/login');
        console.log(login_res.data);
    } catch (error) {
        res.status(500).json({status: 500, message: "login error"});
    }
    
    try {
        const param_send_create = {
            params: {
                title: "Playlist Test",
                description: "description test",
            }
        }
    
        const create_res = await axios.get('http://localhost:8000/spotify/create_playlist', param_send_create);
        console.log(create_res.data);
    } catch (error) {
        res.status(500).json({status: 500, message: "create playlist error"});
    }

    try {
        const param_send_search = {
            params: {
                song_name: 'idonwannabeyouanymore',
                artist_name: 'billie eilish',
            }
        }
        
        const search_res = await axios.get('http://localhost:8000/spotify/search', param_send_search);
        console.log(search_res.data);
    } catch (error) {
        res.status(500).json({status: 500, message: "search track error"});
    }

    try {
        const param_send_add = {
            params: {
                track_ids: search_res.response[0],
                playlist_id: create_res.response,
            }
        }
    
        const add_res = await axios.get('http://localhost:8000/spotify/add_track', param_send_add);
        console.log(add_res.data);
    } catch (error) {
        res.status(500).json({status: 500, message: "add track error"});
    }
});

server.get('/', (req, res) => {
    res.send('SPOTIFY API IS RUNNING!!!');
});

server.listen(8000, () => {
    console.log(
        'HTTP Server up. Now go to http://localhost:8000/ in your browser.'
    )
});