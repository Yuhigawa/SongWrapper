const axios = require('axios');
const request = require('supertest');

const server = require('../src/server');

describe('Testing Spotify API routes', () => {
    let global_data = {};

    // test('Testing login route', async () => {
    //     const data = await axios.get('http://localhost:8000/deezer/login')
    //     expect(data.status).toBe(200);
    // });
    test('Testing login route', async () => {
        const data = await request(server)
                                    .get('/deezer/login')

        global_data.login = data;
        expect(data.status).toBe(302);
    });
    
    // test('Testing callback route', async () => {
    //     const data = await request(server)
    //                                 .get('/deezer/callback')
    //     expect(data.status).toBe(200);
    // });
    
    test('Testing creating playlist route', async () => {
        const param_send_create = {
            params: {
                title: "Playlist Test",
                description: "description test",
            }
        }

        const data = await request(server)
                            .get('/deezer/create_playlist')
                            .set('Authorization', `Bearer ${Buffer.from('BQBfazd97YUWmPWm8UGJiGeVL6J5uy-QdasCmGAM6tR85QYr0nbXTDet2vHtgLsAnuCA-t-qruzvTI4F-vzFHD5u5SUNIiNI2OkIcfqmIoGJ-DMSvhxdeohRL_WXe2XtYoqbEfSMtmUcbJkMEnWSX-VKVGQbi8RvK3uA4zL2d4sAXXchdwwhof4A15oALFnpUDGtqFtVVIvlq8YpXE-mzcd3x4RFWONDgeJlATRBL5AnODPsKBMBRNFFBmPjF5B82W5Cj86ZmE8zE8981iKZvS4hug').toString('base64')}`)
                            .send(param_send_create);
    
        // const data = await axios.get('/deezer/create_playlist', param_send_create);
        global_data.playlist = data;
        expect(data.status).toBe(201);
        expect(data.text).toHaveProperty('message');
        expect(data.text).toHaveProperty('response');
    });
    
    // test('Testing search route', async () => {
    //     const param_send_search = {
    //         params: {
    //             song_name: 'idonwannabeyouanymore',
    //             artist_name: 'billie eilish',
    //         }
    //     }
        
    //     const data = await axios.get('/deezer/search', param_send_search);
    //     global_data.search = data;
    //     expect(data.status).toBe(200);
    // });
    
    // test('Testing add track route', async () => {
    //     const param_send_add = {
    //         params: {
    //             track_ids: global_data.search.response[0],
    //             playlist_id: global_data.playlist.response,
    //         }
    //     }
    
    //     const data = await axios.get('/deezer/add_track', param_send_add);
    //     expect(data.status).toBe(200);
    // });

});