import {useEffect, useState} from "react";
import axios from "axios";
import {BottomNavigation, Grid, Paper} from "@mui/material";
import {BASE_PHOTO_URL} from "../constants/constants";
import ImageCard from "./image-card";
import PhotoFrameGrid from "./image-grid/photo-frame-grid";
import {getImage, GridImage, ImageDetails} from "../services/photo-helper";

export default function Body() {

    const [images, setImages] = useState<ImageDetails[]>([]);
    const [selectedImages, setSelectedImages] = useState<GridImage[]>([]);

    useEffect(() => {
        // fetch images from the server
        axios.get(BASE_PHOTO_URL).then(response => {
            setImages(response.data.entries)
        }).catch((error: any) => {
            alert("Something went wrong");
            console.log(error)
        })
    }, [])

    const onSelect = (id: string, src: string) => {
        setSelectedImages(selectedImages.concat(getImage(id, src)))
    }

    const onRemove = (id: string) => {
        const tempArray = selectedImages.filter((image) => image.id !== id);
        setSelectedImages(tempArray);
    }

    return images && (
        <>
            <Grid container spacing={{xs: 2, md: 2}} columns={{xs: 4, sm: 8, md: 15}} paddingLeft={'10px'}
                  paddingRight={'10px'} paddingBottom={selectedImages.length > 0 ? '370px' : '50px'}>
                {images.map((image, index) => (
                    <Grid item xs={2} sm={4} md={3} key={index}>
                        <ImageCard
                            id={image.id}
                            url={image.picture}
                            selectedImages={selectedImages}
                            onSelect={onSelect}
                            onRemove={onRemove}
                        />
                    </Grid>
                ))}
            </Grid>
            {selectedImages.length > 0 && (
                <Paper sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingTop: '10px'
                }} variant="outlined">
                    <BottomNavigation sx={{height: '350px', flex: 1, overflowY: 'auto'}}>
                        <PhotoFrameGrid selectedPhotos={selectedImages}/>
                    </BottomNavigation>
                </Paper>
            )}
        </>
    );
}
