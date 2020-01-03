import axios from 'axios';

export async function fetchClassroomInfo(id)
{
    try {
        const fetcher = await axios.post(url('/classroom/info'), {
            id
        });

        return [fetcher.data.classroom, fetcher.data.users, fetcher.data.channel];
    } catch (error) {
        console.log(error);
    }
}

export async function fetchChatMessages(id)
{
    try {
        const fetcher = await axios.post(url('/classroom/chat/load'), {
            id
        });

        return fetcher.data;
    } catch (error) {
        console.log(error);
    }
}

export async function fetchDrawstate(id)
{
    try {
        const fetcher = await axios.post(url('/classroom/drawstate'), {
            id,
            mode: 'fetch'
        });

        return fetcher.data.data;
    } catch (error) {
        console.log(error);
    }
}