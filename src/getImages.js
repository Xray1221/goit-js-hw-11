import axios from "axios";

export default async function getImages(searchString, page) {
    const images = (await axios('https://pixabay.com/api/', {params: {
        key: '30779155-f5a839bf4d4e28d8eacf13ca8', 
        q: searchString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page
    }})).data;

    return await images;
}