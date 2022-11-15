import {Photo} from "react-photo-album";

export interface ImageDetails {
    id: string
    picture: string
}

export interface GridImage extends Photo{
    id: string,
}

export const getImage = (id: string, src: string) : GridImage =>{
    return {
        id: id,
        src: src,
        width: 250,
        height: 350,
        key: id,
    }
}


